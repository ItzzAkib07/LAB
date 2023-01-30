import Home from './Home';
import logo from './Images/NBIT.png';
import Popup from './components/Popup';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Label } from 'reactstrap';


export default function Main() {

    /////////////////////////////////////////////////////////// For Popup Modal  ////////////////////////////////////////////////////////
    const [currentID, setCurrentID] = useState("");
    const [buttonPopup, setButtonPopup] = useState(false);

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


    /////////////////////////////////////////////////////////// Fetching Requests  ////////////////////////////////////////////////////////

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
    
    for(var i=0; i<lab.length; i++)
    {
        console.log(lab[i].days);
    }



    /////////////////////////////////////////////////////////// Updating Existing Request (To-Date)  ////////////////////////////////////////////////////////

    const [extendDate, setDate] = useState({
        extend: ""
    });

    const handleInputs = (e) => {
        setDate({ ...extendDate, ["extend"]: +e.target.value });
    }

    const updateRequestID = (id) => {
        setButtonPopup(true);
        setCurrentID(id);
    }

    const updateDate = async (e) => {
        e.preventDefault();
        try {

            const { extend } = extendDate;

            const res = await fetch(`/api/request/updaterequest/${currentID}`, {
                method: "put",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(
                    { extend: extend }
                )
            });

            const data = await res.json();
            if (res.status === 400 || !data) {
                window.alert("Internal Server Issue");
                console.log("Internal Server Issue");
                window.location.reload();

            }
            else {
                window.alert("Date updated Successfully");
                console.log("Date updated Successfully");
                window.location.reload();
            }

        } catch (error) {
            console.log(error)
        }
    }

    function cal(){
        var days = 3;
    }

    useEffect(() => {
        const token = localStorage.getItem("token")
        if (!token)
            navigate('/Login', { replace: true })
            callUser();
            getReq();
            cal();
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

            {/* /////////////////////////////////////////////////////////// CDN link of font awesome for icons  //////////////////////////////////////////////////////// */}

            <style>
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.2.0/css/all.min.css" />
            </style>


            {/* /////////////////////////////////////////////////////////// Popup window   //////////////////////////////////////////////////////// */}

            <Popup trigger={buttonPopup} setTrigger={setButtonPopup}>
                <h3>Extend Date</h3>
                <form method='post'>
                    <input type="Date" className='pop-ip' id='pop-ip' name="extendDate" onChange={handleInputs} required />
                    <button className='p-btn' type='submit' onClick={updateDate}>Send</button>
                </form>
            </Popup>



            {/* /////////////////////////////////////////////////////////// Header section   //////////////////////////////////////////////////////// */}

            <header className="header">
                <div className="logo">
                    <img src={logo} className="logo" alt="NBIT" />
                </div>

                <div className="user">
                    <div className='UserDetails'>
                        <div className='avtaar'>
                            <i className="fa fa-user" aria-hidden="true"></i>
                        </div>

                        <div className='u-details'>
                            <span>Name :- {userData.name}  </span> <br />
                            <span>E-ID &nbsp;&nbsp;&nbsp;:- {userData.id}  </span> <br />
                        </div>
                    </div>


                    <div className='btn-logout'>
                        <button onClick={Logout} >
                            <i className="fa fa-sign-out" aria-hidden="true"></i>
                        </button>
                        <br />
                        <Label>Logout</Label>
                    </div>
                </div>

            </header>

            <section className="leaves">

                <div className="leaves">
                        <div className='ShowDate'>

                            <p>Total Leaves = 18</p>
                            <p>Personal Leaves = 5</p>
                            <p>Sick Leaves = 6</p>
                            <p>Leaves Remaining = <span id="span">{}</span></p>
                        </div>
                    {/* {lab.map((req, index) =>
                        <div className='ShowDate' key={index} data-id={req.id}>

                            <p>Total Leaves = 18</p>
                            <p>Personal Leaves = 5</p>
                            <p>Sick Leaves = 6</p>
                            <p>Leaves Remaining = <span id="span">{req.days}</span></p>

                        </div>
                    )} */}

                </div>

            </section>

            {/* /////////////////////////////////////////////////////////// Home component section   //////////////////////////////////////////////////////// */}

            <Home userId={userData._id} />

            {/* /////////////////////////////////////////////////////////// All users requests section   //////////////////////////////////////////////////////// */}

            <div className="table-content">

                <table className="table" method="GET">
                    <thead>
                        <tr className="t-tr">
                            <th className="t-th1" colSpan="14">Your Current Leaves</th>
                        </tr>

                        <tr className="t-tr">
                            <th className="t-th">From Date</th>
                            <th className="t-th">To Date</th>
                            <th className="t-th">Reason</th>
                            <th className="t-th">No. of Days</th>
                            <th className="t-th">Approved By</th>
                            <th className="t-th">Status</th>

                        </tr>

                    </thead>

                    <tbody id="table_body">
                        {lab.map((req, index) =>
                        (<tr key={index} data-id={req.id}>
                            <td>{req.fromd}</td>
                            <td>{req.tod}</td>
                            <td>{req.reason}</td>
                            <td>{req.days}</td>
                            <td>{req.approvedBy.name}</td>
                            <td>
                                {req.remarks === 2 && (<span className="btn-hold" title='Hold' id='Hold' name='Hold' ><i className="fa-solid fa-pause "></i></span>)}
                                {req.remarks === 3 && (<span className="btn-decline" title='Decline' id='Decline' name='Decline' ><i className="fa-solid fa-xmark "></i></span>)}
                                {req.remarks === 4 && (<span className="btn-approve" title='Approve' id='Approve' name='Approve' ><i className="fa-solid fa-check "></i></span>)}
                            </td>
                        </tr>)
                        )}
                    </tbody>

                </table>
            </div>
        </>
    );
}