const dotenv = require("dotenv");
const connect = require('./db');
const express = require('express');
dotenv.config({path : './config.env'});

connect();

const app = express();
const port = 5000;

app.use(express.json())
// app.use(express.urlencoded({ extended: false}));
//Avalaible routes

app.use('/api/auth',require('./routes/auth'))
app.use('/api/request',require('./routes/request'))

app.listen(port, ()=>{
console.log('App is started on port 5000'); 
})