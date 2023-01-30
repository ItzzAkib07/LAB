// import './home.css';
import logo from './Images/NBIT.png';
import Popup from './components/Popup';
import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';


export default function Admin(userId) {

    /////////////////////////////////////////////////////////// Popup Modal  ////////////////////////////////////////////////////////
    const [currentID, setCurrentID] = useState("");
    const [buttonPopup, setButtonPopup] = useState(false);

    const [action, setAction] = useState({
        status: ""
    });


    const handleInputs = (e) => {   
        setAction({ ...action, ["status"]: +e.target.value});
    }

    const getRequestID = (id) => {
		setButtonPopup(true);
        setCurrentID(id);
    }

    const reqAction = async (e) => {
        e.preventDefault();

        const { status } = action;
        console.log(currentID);
        const res = await fetch(`/api/request/takeaction/${currentID}`, {
            method:"put",
            headers:{
                "Content-Type" : "application/json",
                "Authorization":`Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(
                {status:status}
            )
        });

        const data = await res.json();
        
        if(res.status === 400 || !data) {
            window.alert("Invalid Request");
            console.log(data);
        }
        else {
            console.log("Action Took Successfully");
            window.location.reload();
        }
    }

    /////////////////////////////////////////////////////////// Request Action Function   ////////////////////////////////////////////////////////


    const [requestStatus, setRequestStatus] = useState(["Select Action","Put on Hold", "Decline", "Approve"])

    const ReqAction = async (e) => {
        e.preventDefault();

        window.location.reload();
    }

    /////////////////////////////////////////////////////////// Getting User Data  ////////////////////////////////////////////////////////

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
            setUserData(info);

            if (!res.status === 200) {
                const error = new Error(res.error);
                throw error;
            }


        } catch (error) {
            console.log(error);
        }
    }



    /////////////////////////////////////////////////////////// Fetching Requests   ////////////////////////////////////////////////////////

    const [lab, setLab] = useState([]);

    const getReq = async () => {
        try {
            const res = await fetch('/api/request/fetchRequests', {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem('token')}`
                }
            });

            const info = await res.json();
            if (info.length > 0)
                setLab(info);
            if (!res.status === 200) {
                const error = new Error(res.error);
                throw error;
            }


        } catch (error) {
            console.log(error);
        }
    }



    /////////////////////////////////////////////////////////// Logout Function   ////////////////////////////////////////////////////////

    const navigate = useNavigate();

    const Logout = async (e) => {
        e.preventDefault();

        window.alert("Are you sure. You want to Logout");

        localStorage.clear();

        navigate('/Login', { replace: true });
    }

    useEffect(() => {
        const token = localStorage.getItem("token")
        if(!token)
        navigate('/Login', { replace: true })
        callUser();
        getReq();
    }, []);


    return (
        <>
            <div>

                {/* /////////////////////////////////////////////////////////// CDN link of font awesome for icons  //////////////////////////////////////////////////////// */}

                <style>
                    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.2.0/css/all.min.css" />
                </style>

                {/* /////////////////////////////////////////////////////////// Popup window   //////////////////////////////////////////////////////// */}

                <Popup trigger={buttonPopup} setTrigger={setButtonPopup}>
                    <h3>Take Action</h3>
                    <form >
                        <select className='pop-ip' name='status' onChange={handleInputs} required>
                            {requestStatus.map((status, i) => 
                                <option key={i} value = {i+1}>{status}</option>
                            )}
                        </select>
                        <button className='p-btn' type='submit' onClick={reqAction}>submit</button>
                    </form>
                </Popup>


                {/* /////////////////////////////////////////////////////////// Header section   //////////////////////////////////////////////////////// */}

                <header className="header">
                    <div className="logo">
                        <img src={logo} alt="NBIT" />
                    </div>

                    <div className="user">

                        <div className='avtaar'>
                            <i className="fa fa-user" aria-hidden="true"></i>
                        </div>

                        <div className='u-details'>
                            <span>Name :- {userData.name} </span> <br />
                            <span>E-ID &nbsp;&nbsp;&nbsp;:- {userData.id} </span>
                        </div>
                        <div className='btn-logout'>
                            <button onClick={Logout} >
                                <i className="fa fa-sign-out" aria-hidden="true"></i>
                            </button>
                        </div>
                    </div>
                </header>

                {/* /////////////////////////////////////////////////////////// Table section   //////////////////////////////////////////////////////// */}


                <div className="table-content">

                    <table className="table">
                        <thead>
                            <tr className="t-tr">
                                <th className="t-th2" colSpan={7}><span>Leave Requests</span></th>
                            </tr>

                            <tr className="t-tr">
                                <th className="t-th">Name</th>
                                <th className="t-th">From Date</th>
                                <th className="t-th">To Date</th>
                                <th className="t-th">Reason</th>
                                <th className="t-th">No. of Days</th>
                                <th className="t-th">Status</th>
                                <th className="t-th">Action</th>
                            </tr>
                        </thead>

                        <tbody id="table_body">
                            {lab.map((req, index) =>
                            (<tr key={index} data-id={req._id}>
                                <td>{req.user.name}</td>
                                <td>{req.fromd}</td>
                                <td>{req.tod}</td>
                                <td>{req.reason}</td>
                                <td>{req.days}</td>
                                <td>
                                    {req.remarks === 2 &&  (<span className="btn-hold" title='Hold' id='Hold' name='Hold' ><i className="fa-solid fa-pause "></i></span> )}
                                    {req.remarks === 3 &&  (<span className="btn-decline" title='Decline' id='Decline' name='Decline' ><i className="fa-solid fa-xmark "></i></span>)}
                                    {req.remarks === 4 &&  (<span className="btn-approve" title='Approve' id='Approve' name='Approve' ><i className="fa-solid fa-check "></i></span>)}
                                </td>
                                <td>
                                    <button className="btn-action" title='Action' id='action'  name='action' onClick={() => getRequestID(req._id)}><i className="fa-solid fa-edit"></i></button>
                                </td>
                            </tr>)
                            )}
                        </tbody>


                    </table>
                </div>
            </div>
        </>
    );
}