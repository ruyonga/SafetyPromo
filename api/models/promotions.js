const mongoose = require('mongoose');
const Schema = mongoose.Schema;



const promocodes = new Schema({
    code: { type:String,required: true },
    active: {  type: Boolean,  default: true },
    value: Number,                  //Value of the promo code
    radius:Number,
    expired: { type: Boolean, default: false},
    expirydate:Date,
    origin: { origin: String,
                //Always store coordinate Latitude, long order
                coordinates: { type: [Number],index : '2dsphere' }
            },
        destination: {
                desitnation: String,
                coordinates: { type: [Number],index : '2dsphere' }},
        event: { address: String, 
                 coordinates: {  type: [Number], index : '2dsphere'
                }},
            polyline: String
});


module.exports = mongoose.model('promotions', promocodes, 'promotions') ;



