import React from 'react'
import "./Css/LoginSignup.css"
import { useState } from 'react'
import { Link } from "react-router-dom";

  // Function for Maintaing a state for knowing the user wish to login or register
  const LoginSignup = () => {
    const [state, setState] = useState('login');
    const [formData, setformData] = useState({
      name: "",
      email: "",
      password: ""
    });

  // Function to chnage state from login to signup and vice verse based upon user's action
  const changeState = () => {
    if (state === 'login') {
      setState('signup');
    }
    else {
      setState('login');
    }
  }

  // Handler function for changes occuring in form data
  const changeHandler = (e) => {
    setformData({ ...formData, [e.target.name]: e.target.value });
  }

  // Login function which will authenticate user from database using JWT token
  const loginFunc = async () => {
    await fetch("http://localhost:4000/login", {
      method: 'POST',
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(formData)
    }).then((res) => res.json()).then((data) => {
      if (data.success) {
        localStorage.setItem("auth-token", data.token);
        window.location.replace("/");
      }
      else {
        alert(data.errors);
      }
    })
  }

  // Signup function
  const signupFunc = async () => {
    await fetch("http://localhost:4000/signup", {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        "Content-Type": "application/json"
      },
      body: JSON.stringify(formData)
    }).then((res) => res.json()).then((data) => {
      if (data.success == 1) {
        localStorage.setItem('auth-token', data.token);
        window.location.replace("/");
      }
      else {
        alert(data.errors);
      }
    })

  }

  return (
    <div className='loginsignup'>
      <div className="loginsignup-container">
        <h1>{state === 'signup' ? "Sign Up" : "Login"}</h1>
        <div className="loginsignup-feilds">
          {state === "signup" ? <input onChange={changeHandler} type="text" placeholder='Your Name' name='name' value={formData.name} /> : <></>}
          <input onChange={changeHandler} type="email" placeholder='Your Email' name='email' value={formData.email} />
          <input onChange={changeHandler} type="password" placeholder='Password' name="password" value={formData.password} />
        </div>
        <button onClick={() => { state === 'login' ? loginFunc() : signupFunc() }}>Continue</button>
        {state === 'signup' ? <p className='loginsignup-login'>Already have an account? <Link style={{ textDecoration: "none" }} onClick={() => { changeState() }}><span>Login here!</span></Link></p> : <p className='loginsignup-login'>Need to create new account? <Link style={{ textDecoration: "none" }} onClick={() => { changeState() }}><span>Register here!</span></Link></p>}
        {state === 'signup' ? <div className="loginsignup-agree">
          <input type="checkbox" name='' id='' />
          <p>By continuing, i agree to the terms of use & privacy policy.</p>
        </div> : <></>}
      </div>
    </div>
  )
}

export default LoginSignup
