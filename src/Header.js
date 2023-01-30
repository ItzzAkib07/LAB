import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Label } from 'reactstrap';

const Header = () => {

  /////////////////////////////////////////////////////////// Fetching User Details  ////////////////////////////////////////////////////////

  const [userData, setUserData] = useState({});

  const callUser = async () => {
    try {
      const res = await fetch('/api/auth/getUser', {
        method: "GET",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem('token')}`
        }
      });

      const info = await res.json();
      console.log(info);
      setUserData(info);

      if (!res.status === 200) {
        const error = new Error(res.error);
        throw error;
      }

    } catch (error) {
      console.log(error);
    }
  }


  useEffect(() => {
    const token = localStorage.getItem("token")
    if(!token)
    navigate('/Login', { replace: true })
    callUser();
}, []);


  /////////////////////////////////////////////////////////// Logout Function  ////////////////////////////////////////////////////////

  const navigate = useNavigate();

  const Logout = async (e) => {
    e.preventDefault();

    window.alert("Are you sure. You want to Logout");

    localStorage.clear();

    navigate('/Login', { replace: true });
  }


  return (
    <>
      
    </>
  )
}

export default Header