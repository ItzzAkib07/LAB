import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from './Images/NBIT.png';
import front from './Images/employee-front.png';

export default function Login() {

  const navigate = useNavigate();



  /////////////////////////////////////////////////////////// Validate authorised user API  ////////////////////////////////////////////////////////

  const [name, setName] = useState('');
  const [password, setPassword] = useState('');

  const loginUser = async (e) => {
    e.preventDefault();

    const res = await fetch('/api/auth/login', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name, password
      })
    });

    const data = await res.json();
    localStorage.setItem("token", data.token)
    console.log(data);

    if (res.status === 400 || !data) {
      window.alert("Invalid Credentials");
      console.log("Invalid Credentials");
    }

    else if (name === "Dinesh Mengu") {
      window.alert("Login Successful");
      console.log("Login Successful");
      navigate('/admin')
    }

    else {
      window.alert("Login Successful");
      console.log("Login Successful");

      navigate('/Main');
    }
  }



  return (
    <>

      {/* /////////////////////////////////////////////////////////// CDN link of font awesome for icons  //////////////////////////////////////////////////////// */}

      <style>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.2.0/css/all.min.css" />
      </style>

      {/* /////////////////////////////////////////////////////////// Login Container  //////////////////////////////////////////////////////// */}

      <div className="App">
        <div className="content">

          <div>
            <div className="con-logo">
              <img src={logo} className="logo" alt="NBIT" />
            </div>

            <h1 className='head'>NBIT LAB MANAGMENT</h1>

            <h1 className='sub-head'>Login</h1>

            <form className="form" id="form" method='POST'>

              <div className='ip'>
                <i className="fa-solid fa-user ">
                  <input type="text" name="name" id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter your name" required autoFocus />
                </i>
              </div>

              <div className='ip'>
                <i className="fa-solid fa-lock ">
                  <input type="password" name="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" required />
                </i>
              </div>

              <button className='btn' onClick={loginUser}>Login</button>

            </form>
          </div>


          <div className='part-2'>
            <div className="background">
              <img src={front} alt="NBIT" />
            </div>
            <a href="signup" className="link" id="link">Don't have account? Click here.</a>
          </div>

        </div>
      </div></>
  )
}
