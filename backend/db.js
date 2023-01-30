const mongoose = require('mongoose');
const mongoURI = "mongodb://localhost:27017/NBIT_LEAVE_MANAGMENT"


const connect = ()=>{
        mongoose.connect(mongoURI,()=>{
            console.log("Connect to Mongo Successfully");
        })
}

module.exports = connect