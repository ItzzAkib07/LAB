import logo from './Images/NBIT.png';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import back from './Images/employee-back.png';

import './App.css';

export default function Signup() {

    const navigate = useNavigate();

    /////////////////////////////////////////////////////////// Registerng new user API  ////////////////////////////////////////////////////////


    const [user, setUser] = useState({
        name: "", eid: "", password: ""
    });

    let name, value;

    const handleInputs = (e) => {
        console.log(e);
        name = e.target.name;
        value = e.target.value;
        setUser({ ...user, [name]: value });
    }


    const postData = async (e) => {
        e.preventDefault();

        const { name, eid, password } = user;

        const res = await fetch("/api/auth/createuser", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name, eid, password
            })
        });

        const data = await res.json();

        if (res.status === 422 || !data) {
            window.alert("User is already exists. Please try to Login.");
            console.log("User is already exists. Please try to Login.");
        }

        else {
            window.alert("Registration Successful");
            console.log("Registration Successful");

            navigate('/Login');
        }
    }

    return (

        <>

        
            {/* /////////////////////////////////////////////////////////// CDN link of font awesome for icons  //////////////////////////////////////////////////////// */}

            <style>
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.2.0/css/all.min.css" />
            </style>


            {/* /////////////////////////////////////////////////////////// Sign-up Container  //////////////////////////////////////////////////////// */}


            <div className="App">

                <div className="content">

                    <div className='part-1'>

                        <div className="con-logo">
                            <img src={logo} className="logo" alt="NBIT" />
                        </div>

                        <h1 className='head'>NBIT LAB MANAGMENT</h1>

                        <h1 className='sub-head'>Signup</h1>

                        <form className="form" id="form" method='post'>

                            <div className='ip'>
                                <i className="fa-solid fa-user ">
                                    <input type="text" name="name" id="name" value={user.name} onChange={handleInputs} placeholder="Enter your name" required autoFocus />
                                </i>
                            </div>

                            <div className='ip'>
                                <i class="fa-solid fa-id-card">
                                    <input type="text" name="eid" id="eid" value={user.eid} onChange={handleInputs} placeholder="Enter your Employee ID" required />
                                </i>
                            </div>

                            <div className='ip'>
                                <i className="fa-solid fa-lock ">
                                    <input type="password" name="password" id="password" value={user.password} onChange={handleInputs} placeholder="Enter your password" required />
                                </i>
                            </div>

                            <button className='btn' type='submit' onClick={postData}>Sign Up</button>

                        </form>
                    </div>

                    <div className='part-2'>
                        <div className="background">
                            <img src={back} alt="NBIT" />
                        </div>
                        <a href="login" className="link" id="link">Already have an account? Click here.</a>
                    </div>
                </div>
            </div>
        </>
    );
}

