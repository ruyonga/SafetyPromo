const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
        type : String,
    required : true ,
    },
    email:{
        type : String,
        required : true,
    },
    password:{
        type : String,
    required : true 
    },
    fullnames: String,
    phonenumber: String,
    sex: String,
    position: String

});

module.exports = mongoose.model('User', userSchema, 'users');

