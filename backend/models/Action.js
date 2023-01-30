const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const {Schema} = mongoose;


// model for storing HOD's action againts the user request ///////////////////////////////////////////////


const actionSchema = new Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'user'
    },
    action:{
        type:String,
        required:true
    },
});

module.exports = mongoose.model('action', actionSchema);