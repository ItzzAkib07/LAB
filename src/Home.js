// import './home.css';
import React, { useEffect, useState } from 'react';
import FormCheckInput from 'react-bootstrap/esm/FormCheckInput';
import { useNavigate } from 'react-router-dom';
import main from './Main';

export default function Home({ userId }) {

    ///////////////////////////////////////////////////////////  Getting logged user details API   ////////////////////////////////////////////////////////


    const [loggeduserData, setLoggedUserData] = useState([]);

    const callLoggedUser = async () => {
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
            setLoggedUserData(info);

            if (!res.status === 200) {
                const error = new Error(res.error);
                throw error;
            }

        } catch (error) {
            console.log(error);
        }
    }

    ///////////////////////////////////////////////////////////  Getting all users details API   ////////////////////////////////////////////////////////

    const [userData, setUserData] = useState([]);

    const callUser = async () => {
        try {
            const res = await fetch('/api/auth/getallusers', {
                method: "GET",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem('token')}`
                }
            });

            const info = await res.json();
            const data = info.filter(({ access }) => access.includes("hod_access"));
            setUserData(data);
            console.log(data);

            if (!res.status === 200) {
                const error = new Error(res.error);
                throw error;
            }

        } catch (error) {
            console.log(error);
        }
    }

    ///////////////////////////////////////////////////////////  Add request API   ////////////////////////////////////////////////////////

    const [request, setRequest] = useState({
        fromd: "",
        tod: "",
        reason: "",
        days: "",
        approvedBy: "",
        remarks: 2
    });

    console.log(request)
    let name, value;

    const handleInputs = (e) => {

        name = e.target.name;
        console.log(name)
        value = e.target.value;
        setRequest({ ...request, [name]: value });
    }


    const cal =  () => {

        

    }



    const postData = async (e) => {
        e.preventDefault();

        const { fromd, tod, reason, days, approvedBy, remarks } = request;
        console.log(request);
        
        const res = await fetch("/api/request/addrequest", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({
                fromd, tod, reason, days, approvedBy, remarks
            })
        });

        const data = await res.json();

        if (res.status === 400 || !data) {
            window.alert("Invalid Request");
            console.log(data);
        }
        else {
            window.alert("Request send Successfully");
            console.log("Request send Successfully");
            window.location.reload();
        }

    }

 
    ///////////////////////////////////////////////////////////  To prevent unauthorised access to pages   ////////////////////////////////////////////////////////

    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token")
        if (!token)

            navigate('/Login', { replace: true })
    })



    useEffect(() => {
        callUser();
        callLoggedUser();
    }, []);


    return (

        <div>
            {/* /////////////////////////////////////////////////////////// CDN link of font awesome for icons  //////////////////////////////////////////////////////// */}

            <style>
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.2.0/css/all.min.css" />
            </style>

            {/* ///////////////////////////////////////////////////////////  Add request container //////////////////////////////////////////////////////// */}


            <div className="home">


                <div className="form-content">


                    <h3 className="heading">Make new request for Leave / Work from home</h3>

                    <form className="h-form" id="form" method="post">

                        <div className="f-ip">
                            <label className="label">From Date</label> <br />
                            <input type="date" className="From" id="From" name="fromd" value={request.fromd} onChange={handleInputs} placeholder="Enter From Date " required />
                        </div>

                        <div className="f-ip">
                            <label className="label">To Date</label> <br />
                            <input type="date" className="To" id="To" name="tod" value={request.tod} onChange={handleInputs} placeholder="Enter To Date " required />
                        </div>

                        <div className="f-ip">
                            <label className="label">Reason</label> <br />
                            <textarea type="text" className="Reason" id="Reason" name="reason" value={request.reason} onChange={handleInputs} placeholder="Enter the reason " required />
                        </div>

                        <div className="f-ip">
                            <label className="label">No. of Days</label> <br />
                            <input type="number" className="Days" id="Days" name="days" value={request.days} onChange={handleInputs} placeholder="Enter No. of Days for leave" required />
                        </div>
                        
                    </form>

                    <div className='f-bottom'>
                        <div className="f-ip">
                            <label className="label">Request To</label><br />
                            <select name='approvedBy' onChange={handleInputs} value={request.approvedBy}>
                                <option >Select HOD</option>
                                ({
                                    userData.map((user) => (
                                        <option key={user._id} value={user._id}>{user.name}</option>
                                    ))
                                })
                            </select>
                        </div>

                        <div>
                            <button type='submit' className="h-btn" onClick={postData} >SEND REQUEST</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}