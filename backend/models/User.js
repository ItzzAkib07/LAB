var jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const {Schema} = mongoose;


// model for creating the users  ///////////////////////////////////////////////


const UserSchema = new Schema({
    name:{
        type:String,
        required:true
    },
    eid:{
        type:String,
        required:true
    },
    password:{
        type:String ,
        required:true
    },
    access:{
        type:Array,
    },
},
{ timestamps: true }
);

const user = mongoose.model('user', UserSchema);
module.exports = user;