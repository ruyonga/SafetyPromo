require('dotenv').config();
require('../api/db/dbconfig');
var expect = require("chai").expect;
var request = require("request");
const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const app = express();

if(process.env.NODE_ENV == "production")
{
	console.log = function(){};	
}



const PORT = process.env.PORT || 5000;
//make server listen to teh api
const api = require('../api/routes/api');

//app.use(cors);
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Authorization");
    next();
});
// Enable parsing of posted forms
app.use(bodyParser.urlencoded({
    extended: false
}));

app.use(bodyParser.json());


//ask the server to use the api routes
app.use('/api/v1', api);

app.get('/', function (req, res) {

    res.send({
            "message":"You just happened to miss the turn"
    })

})


app.listen(PORT, function () {
    console.log('Server running on localhost:' + PORT);
})