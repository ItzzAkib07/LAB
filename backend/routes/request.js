const express = require('express');
const router = express.Router();
const fetchUser = require('../middleware/fetchUser');
const Request = require('../models/Newrequest');
const Action = require("../models/Action");
const User = require("../models/User")
const { body, validationResult } = require('express-validator');
const nodemailer = require('nodemailer');
const { request } = require('express');


// ROUTE 1 : Fetch a user requests: GET "/api/request/fetchRequests"
router.get('/fetchRequests', fetchUser, async (req, res) => {
    const user = await User.findById(req.userID)
    try {
        let bool = "user";
        if (user.access) {
            if (user.access.includes("hod_access")) bool = "approvedBy";
        }
            
        const request = await Request.find({ [bool]: req.userID}).populate([
            { path: "user", select: "-password" },
            { path: "approvedBy", select: "-password" },
        ]);
        
        res.send(request);   
        
      } catch (error) {
        console.error(error.message)
        res.status(500).send("Internal server error");
      }
})


// ROUTE 2 : Add new requests: POST "/api/request/addrequest"

router.post('/addrequest',fetchUser, async (req, res) => {
    try {
        const { fromd, tod, reason, days, approvedBy, remarks } = req.body;
        
        // if error return error
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        };
        const request = new Request({
            user:req.userID, fromd, tod, reason, days, approvedBy, remarks
        })
        
        const currentUser = await User.findById(req.userID)
        console.log("currentUser :- ",currentUser.name);



        const savedRequest = await request.save()


        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: 'akibm@nextbridgesolutions.com',
              pass: 'Ghhghhhhgjkl1@'
            }
        });


        // akibm@nextbridgesolutions.com
        
        const hod  = await User.findById(req.body.approvedBy)

        console.log("HOD :- ",hod.name);
        // dinesh@nextbridgesolutions.com
        var mailOptions = {
            from: 'pdclabrequest@gmail.com',// sender address
            to: 'mullaakib47@gmail.com', // list of receivers
            subject: 'PDC Leave Request', // Subject line
            html: `
                <div style="padding:10px; 
                border-style: ridge;
                border-radius:10px;">
                <p>Hello ${hod.name},</p>
                <p>You have a new Leave Request.</p>
                <h3>Request Details</h3>
                <ul>
                    <li>Name: ${currentUser.name} </li>
                    <li>From Date: ${req.body.fromd}</li>
                    <li>To Date: ${req.body.tod}</li>
                    <li>Reason: ${req.body.reason}</li>
                    <li>No. of Days: ${req.body.days}</li>
                </ul>

                <h4 style = "margin:auto">Use this below link to respond</h4>
                <span style = "text-align:center">http://localhost:3000/</span>
            `
            };
            
        transporter.sendMail(mailOptions, function(error, info){
            if (error)
            {
              res.json({status: true, respMesg: 'Having issue while sending mail. Please try again later.'})
                console.log("Having issue while sending mail. Please try again later.")
            } 
            else
            {
              res.json({status: true, respMesg: 'Email Sent Successfully'})
              console.log("Email Sent Successfully")
            }
         
          });


        res.json(savedRequest)
        // console.log(savedRequest)

    } catch (error) {
        console.error(error.message)
        res.status(500).send("Internal server error");
    }

})



// ROUTE 5 : Take ACtion : POST "/api/request/takeaction"

router.put('/takeaction/:id',fetchUser, async (req, res) => {
    try {
        const { action } = req.body;

        // if error return error
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const labRequestID = await Request.findById(req.params.id);
        if (!labRequestID) {
            res.status(400);
            throw new Error("Lab Request not found");
        }

        const updatedLabRequest = await Request.findByIdAndUpdate(
            req.params.id,
            { remarks: req.body.status },
            { new: true }
        ).populate([
            { path: "user", select: "-password" },
            { path: "approvedBy", select: "-password" },
        ]);

        res.status(200).json(updatedLabRequest);

    } catch (error) {
        console.error(error.message)
        res.status(500).send("Internal server error");
    }
})



// ROUTE 7 : Fetch a requests: GET "/api/request/fetchaction"


router.get('/fetchaction', fetchUser, async (req, res) => {
    const status = await Action.find({ User });
    res.json(status)
    try {
        const userID = req.userID;
        const action = await Action.findById(userID).populate([
            { path: "user", select: "-password" },
            { path: "approvedBy", select: "-password" },
        ]);
        res.send(action);            
      } catch (error) {
        console.error(error.message)
        res.status(500).send("Internal server error");
      }
})


module.exports = router






















































































































































































































































































































// ROUTE 6 : Send mail to HOD: POST "/api/request/sendMail"
 
// router.post('/sendMail',async (req,res)=>{
//     console.log(req.body.name);
//     var transporter = nodemailer.createTransport({
//         service: 'gmail',
//         auth: {
//           user: 'akibm@nextbridgesolutions.com',
//           pass: 'Ghhghhhhgjkl1@'
//         }
//     });
 
//     var mailOptions = {
//         from: 'akibm@nextbridgesolutions.com',// sender address
//         to: 'akibmulla47@gmail.com', // list of receivers
//         subject: 'New Lab Request', // Subject line
//         html: `
//             <div style="padding:10px;border-style: ridge" border-radiun>
//             <p>You have a new Lab Request.</p>
//             <h3>Request Details</h3>
//             <ul>
//                 <li>name: ${req.body.name} </li>
//                 <li>E-id: ${req.body.eid}</li>
//                 <li>cname: ${req.body.cname}</li>
//                 <li>reason: ${req.body.reason}</li>
//                 <li>fromd: ${req.body.fromd}</li>
//                 <li>tod: ${req.body.tod}</li>
//                 <li>ip: ${req.body.ip}</li>
//                 <li>host: ${req.body.host}</li>
//                 <li>HOD: ${req.body.approvedBy}</li>
//             </ul>
//         `
//         };
     
//     transporter.sendMail(mailOptions, function(error, info){
//         if (error)
//         {
//           res.json({status: true, respMesg: 'Having issue while sending mail. Please try again later.'})
//             console.log("Having issue while sending mail. Please try again later.")
//         } 
//         else
//         {
//           res.json({status: true, respMesg: 'Email Sent Successfully'})
//           console.log("Email Sent Successfully")
//         }
     
//       });
// });



        // const labRequestID = await Request.findById(req.params.id);
        // if (!labRequestID) {
        //     res.status(400);
        //     throw new Error("Lab Request not found");
        // }

        // if (request.user !== req.user.id) {
        //     return res.status(401).send("NOT ALLOWED");
        // }

        // const updatedLabRequest = await Request.findByIdAndUpdate(
        //     req.params.id,
        //     { tod: req.body.tod },
        //     { $set: Newrequest },
        //     { new: true }
        // ).populate([
        //     { path: "user", select: "-password" },
        //     { path: "approvedBy", select: "-password" },
        // ]);
        // res.status(200).json(updatedLabRequest);

        // request = await Request.findByIdAndUpdate(req.params.id, { $set: Newrequest }, { new: true })
        // res.json(request)







// ROUTE 1 : Fetch a All user requests for Admin: GET "/api/request/fetchAllRequests"



// router.get('/fetchaction', fetchUser, async (req, res) => {
//     const reasons = await Action.find({ User });
//     res.json(reasons)
//     try {
//         const userID = req.userID;
//         console.log("User ID ;;;-", userID);
//         const reason = await Action.findById(userID)
//         res.send(reason); 
//         console.log("Reason :- ",reason)           
//     } catch (error) {
//         console.error(error.message)
//         res.status(500).send("Internal server error");
//       }
// })


// ROUTE 4 : Delete the existing user requests: DELETE "/api/request/deleterequest/:id"

// router.delete('/deleterequest/:id', fetchUser, async (req, res) => {
    
//     try {

//         // find the request to be delete

//         let request = await Request.findById(req.params.id);
//         if (!request) { return res.status(404).send("NOT FOUND") }


//         // Allow deletion only if user owns this request


//         if (request.user.toString() !== req.User.id) {
//             return res.status(401).send("NOT ALLOWED");
//         }

//         request = await Request.findByIdAndDelete(req.params.id)
//         res.json({ "success": "Request has been deleted", request: request });


//     } catch (error) {
//         console.error(error.message)
//         res.status(500).send("Internal server error");
//     }
// })


