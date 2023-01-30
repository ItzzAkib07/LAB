const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const {Schema} = mongoose;

// model for creating and adding the users requests ///////////////////////////////////////////////

const RequestSchema = new Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'user',
        required:true
    },
    fromd:{
        type:Date,
        required:true,
    },
    tod:{
        type:Date,
        required:true,
    },
    reason:{
        type:String,
        required:true,
    },
    days:{
        type:Number,
        required:true,
    },
    approvedBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'user',
        required:true
    },
    remarks: {
        type: Number,
        required: true,
        validate: {
            validator: Number.isInteger,
            message: "{VALUE} is not an integer value",
        },
    },
},
    {
        timestamps: true,
    }
);

const request = mongoose.model('request', RequestSchema);
module.exports = request;