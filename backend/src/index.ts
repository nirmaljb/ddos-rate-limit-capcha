import express from "express"
import { rateLimit } from "express-rate-limit"
import cors from "cors";

const homeLimiter = rateLimit({
    windowMs: 1 * 60 * 1000,
    limit: 5,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
})

const otpRateLimiter = rateLimit({
	windowMs: 5 * 60 * 1000, // 15 minutes
	limit: 3, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
	standardHeaders: 'draft-8', // draft-6: `RateLimit-*` headers; draft-7 & draft-8: combined `RateLimit` header
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
	// store: ... , // Redis, Memcached, etc. See below.
})

const passwordRateLimiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	limit: 5, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
	standardHeaders: 'draft-8', // draft-6: `RateLimit-*` headers; draft-7 & draft-8: combined `RateLimit` header
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
	// store: ... , // Redis, Memcached, etc. See below.
})

const app = express();
app.use(cors())
app.use(express.json())

const otpStore: Record<string, string> = {};

app.get('/', homeLimiter, (req, res) => {
    res.send('Server running')
})

app.post('/generate-otp', otpRateLimiter, (req, res): any => {
    const email = req.body.email;
    if(!email) {
        return res.status(400).json({ message: "Email required" });
    }

    const otp = Math.floor(100000 + Math.random() * 90000).toString();
    otpStore[email] = otp;

    console.log(`Your (${email}) OTP is ${otp}`)
    res.status(200).json({ message: 'OTP generated and logged' })
});

app.post('/reset-password', passwordRateLimiter, async (req, res): Promise<any> => {
    const { email, otp, newPassword, token } = req.body;

    let formData = new FormData();
    formData.append('secret', "0xxxxxyour_secret_key");
    formData.append('response', token);

    console.log(formData);

    const url = "https://challenges.cloudflare.com/turnstile/v0/siteverify";
    const firstResult = await fetch(url, {
        body: formData,
        method: "POST"
    })

    const firstResponse = await firstResult.json();
    console.log(firstResponse);
    if(!firstResponse.success) {
        return res.status(409).json({ message: "Can't verify the browser" })
    }


    if(!email || !otp || !newPassword) {
        return res.status(400).json({ message: 'Email, OTP and Password required' })
    }

    if(otpStore[email] === otp) {
        console.log(`The password for ${email} has been reset to ${newPassword}`);
        return res.status(200).json({ message: 'Password has been reset' })
    }else {
        return res.status(401).json({ message: 'Invalid OTP' })
    }
})

app.listen(8000, () => {
    console.log('Listening to http://localhost:8000')
})