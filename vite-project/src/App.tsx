import { useRef, useState } from "react"
import Turnstile from "react-turnstile"
import axios from "axios";

function App() {
  const [token, setToken] = useState<string>("");
  const otpRef = useRef(null);

  // console.log(otpRef.cuu);

  async function submitHandler() {

    const response = axios.post('http://localhost:8000/reset-password', {
      email: "nirmaljyotib@gmail.com",
      newPassword: "alphabeta",
      otp: "158142",
      token: token
    });

    console.log(response);
  }
  
  return (
    <>
      {token && token}
      <input type="number" placeholder='otp...' ref={otpRef}/>
      <input type="password" placeholder='password...'/>
      
      <Turnstile
        sitekey="0xyour_public_key"
        onVerify={(token) => {
          setToken(token);
        }}
      />
      <button disabled={!token} type="submit" onClick={submitHandler}>update password</button>

    </>
  )
}

export default App
