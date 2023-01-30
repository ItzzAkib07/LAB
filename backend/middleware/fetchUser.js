var jwt = require('jsonwebtoken');
const User = require('../models/User');

// middleware for fetching the user by vering the authorised user  ////////////////////////////////////////////

const fetchUser = async (req, res, next) => {

  let token
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1]
      const decoded = jwt.verify(token, process.env.SECRET_KEY)
      req.user = await User.findById(decoded.id).select('-password')
      const rootUser = await User.findOne({ _id: decoded.id, "token": token });
      req.token = token;
      req.rootUser = rootUser;
      req.userID = rootUser._id;
      next()
    } catch (error) {
      console.log(error);
      res.status(401)
      throw new Error('Not Authorized')
    }
  }
  if (!token) {
    res.status(401)
    throw new Error('Not Authorized With Token')
  }
}

module.exports = fetchUser;