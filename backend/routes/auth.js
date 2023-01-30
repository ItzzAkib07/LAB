const express = require('express');
const router = express.Router();
const fetchUser = require('../middleware/fetchUser');
const User = require('../models/User');
const { body, validationResult } = require('express-validator');
var jwt = require('jsonwebtoken');
const { LogTimings } = require('concurrently');
const bcrypt = require('bcryptjs');



// ROUTE 1 : create a user using: POST "/api/auth/createuser"

router.post('/createuser',  async (req, res) => {

  const { name, eid, password, access } = req.body;

  // if error return error

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  // check wheater user is exists
  try {
    let user = await User.findOne({ eid: req.body.eid });
    if (user) {
      return res.status(422).json({ error: "User is already exists" })
    }


    // creating secure password
    const salt = await bcrypt.genSalt(10);
    const secPass = await bcrypt.hash(req.body.password, salt);

    // creating a new user
    user = await User.create({
      name: req.body.name,
      eid: req.body.eid,
      password: secPass,
      access: req.body.access
    });


    const authToken = await generateToken(user._id);
    console.log("Token genereated");
    console.log(authToken)

    res.json({ token:authToken })

  } catch (error) {
    console.error(error.message)
    res.status(500).send(error.message);
  }
})


// ROUTE 2: Authenticate a user using: POST "/api/auth/login"

router.post('/login', async (req, res) => {

  const { name, password } = req.body

  const user = await User.findOne({ name })

   if (!user) {
      return res.status(400).json({ error: "Please try to login with valid credentials" });
    }

  if (user && (await bcrypt.compare(password, user.password))) {
    res.json({ _id: user.id, name: user.name, eid: user.eid, token: generateToken(user._id) })
  } else {
    res.status(400)
    throw new Error('Invalid Credentials')
  }

    console.log("Data stored :\n");
    console.log("Name:",user.name);
    console.log("\nid : ",user.eid);
    console.log("\ntoken : ",token);

})


// ROUTE 3 : Get User Details POST"/api/auth/getUser"

router.get('/getUser', fetchUser , async (req, res) => {

  try {
    const userID = req.userID;
    console.log("User ID ;-", userID);
    const user = await User.findById(userID)
    res.send({name : user.name, id: user.eid, _id:user._id});
    console.log({name : user.name, id: user.eid});
    
  } catch (error) {
    console.error(error.message)
    res.status(500).send("Internal server error");
  }
}) 


//Generate Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.SECRET_KEY, { expiresIn: '30d' })
}


//  ROUTE 3 : Get User Details POST"/api/auth/getAllUser"

router.get('/getallusers', fetchUser , async (req, res) => {
  try {
    const allUser = await User.find()
    res.send(allUser)

  } catch (error) {
    console.error(error.message)
    res.status(500).send("Internal server error");
  }
})

module.exports = router

