const mongoose = require('mongoose');
const Promotion = mongoose.model('Promocodes');
var polyline = require('google-polyline')
var randomstring = require("randomstring");
var distance = require('google-distance-matrix');


/**
 * Get all Promotions
 * @param {*} req 
 * @param {*} res 
 */
module.exports.getAllCodes = (req, res)=>{

    let offset =0;
    let count = 5; 

   

/**
 * pagination of results
 */
    if(req.query && req.query.offset){
        offset = parseInt(req.query.offset, 10);
    }
    if(req.query && req.query.count){
        count = parseInt(req.query.count, 10);
    }
        

    Promotion
            .find()
            .skip(offset)
            .limit(count)
            .exec((err, promotions)=>{
                if(err){
                    console.log(err)
                    return
                }
                console.log("found promotions", promotions);
                res.status(200)               
                .json(promotions);
            });


}


/**
 * Get One promocodes
 * @param {*} req 
 * @param {*} res 
 */
module.exports.getOne = (req, res) =>{

    var id = req.params.id;

    console.log("sent_id",id);

    Promotion
        .findById(id)
        .exec((err, doc) => {
          var response = {
            status : 200,
            message : doc
          };
          if (err) {
            console.log(err);
            console.log("Error finding promotion");
            response.status = 500;
            response.message = err;
          } else if(!doc) {
            console.log("Promotion Id not found in database", id);
            response.status = 404;
            response.message = {
              "message" : "Promotion Id not found " + id
            };
          }
          console.log(response.message)
          res
            .status(response.status)
            .json(response.message);
        });

}

/**
 * Add New Promotion 
 * @param {*} req 
 * @param {*} res 
 */
module.exports.generateCodes = (req, res) => {

  var codes = []

  for(var i=0; i < req.body.codenum; i++){
    codes.push({ code: randomstring.generate(7),
                  active: true,
                  value: req.body.value,
                  expired: false,
                  radius: req.body.radius,
                  expirydate: new Date(req.body.expirydate),
                  event : {
                    address : req.body.address,
                    coordinates : [parseFloat(req.body.lng), parseFloat(req.body.lat)]
                  }
  })
}

  Promotion
      .create( codes, (err, promotion) =>{

         if (err) {
            console.log("Error creating promotion");
            res
              .status(400)
              .json(err);
              return;
          } else {
            console.log(promotion)
                res
                 .status(201)
                 .json({"message":"Successfull", "promotion":promotion.length});
          }  
    });

};
/**
 * Update the promotion on the platform
 * @param {*} req 
 * @param {*} res 
 */
module.exports.updateOne = (req, res) => {
  var promoid = req.params.id;

  console.log('GET id', promoid);

  Promotion
    .findById(promoid)
    .select('-promocodes')
    .exec(function(err, promotion) {
      if (err) {
        console.log("Error occured processing your request");
        res
          .status(500)
          .json(err);
          return;
      } else if(!promotion) {
        console.log("id not found in database", promoid);
        res
          .status(404)
          .send( "Promotions ID not found " + promoid );
          return;
      }
      promotion.code = randomstring.generate(7),
      promotion.active= req.body.active,
      promotion.value =req.body.value,
      promotion.expired = req.body.expired,
      promotion.radius = req.body.radius,
      promotion.expirydate= new Date(req.body.expirydate),
      promotion.event = { address : req.body.address, coordinates : [parseFloat(req.body.lng), parseFloat(req.body.lat)] }
      promotion.origin = { origin : req.body.origin, coordinates: [parseFloat(req.body.lngo), parseFloat(req.body.lato)]},
      promotion.desitnation = {  desitnation : req.body.desitnation, coordinates:[parseFloat(req.body.lngd), parseFloat(req.body.latd)]
   
      }
      promotion
        .save(function(err, promotionUpdate) {
          if(err) {
            res
              .status(500)
              .json(err);
          } else {
            console.log(promotionUpdate);
            res
              .status(204)
              .send(promotionUpdate)
              .json();
          }
        });


    });

};

/**
 * In reall life i would plan for a soft delete, by updaating a field with deleted =yes/no

 * 
 * @param {*} req 
 * @param {*} res 
 */
module.exports.deleteOne = function(req, res) {
  var promoid = req.params.id;

  Promotion
    .findByIdAndRemove(promoid)
    .exec(function(err, promotion) {
      if (err) {
        console.log(err);
        res
          .status(404)
          .json(err);
      } else {
        console.log("Promotion deleted, id Successfull");
        res
          .status(204)
          .json({"message": "Promotion Deleted successfully"});        
      }
    });
};



  
/**
 * Login
 * @param {*} req 
 * @param {*} res 
 */
module.exports.validateCode = (req, res) => {

  var event = {};
  var origin = {"lat": parseFloat(req.body.lato), "lng":parseFloat(req.body.lngo)};
  var destination = {"lat": parseFloat(req.body.latd), "lng":parseFloat(req.body.lngd)};

  Promotion
      .findOne({code: req.body.code}, 
          (err, promocode) =>{
              if (err) return res.status(500).send('Error on the server.');
              if (!promocode) return res.status(404).send('Invalid user found.');
                  
         
      
          event.lat = promocode.event.coordinates['1'];
          event.lng = promocode.event.coordinates['0'];

            console.log("desitnation",destination);
            console.log("origins", origin)
            console.log("event", event)

            var distance = getDistance(event, destination)

          console.log("radiu= 100 dropoff=",distance)
              if( distance > parseFloat(promocode.radius) ){
                  /**
                   * How far off the event location is the rider going
                   */
                  var diff = distance - parseFloat(promocode.radius);
                
                  res.status(200).send({"message" :"This code can only be used to go to the safety event, your beyond the event location by"+diff}).json();
              }else{
                updateCode(promocode._id, req, res);
                
              }



    });
}

/**
 * Option to use the a library or google API
 * @param {*} x 
 */
var rad = function(x) {
  return x * Math.PI / 180;
};

var getDistance = function(event_address, rider_destination) {
  var R = 6378137; // Earth’s mean radius in meter
  var dLat = rad(rider_destination.lat - event_address.lat);
  var dLong = rad(rider_destination.lng - event_address.lng);
  var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(rad(event_address.lat) * Math.cos(rad(rider_destination.lat))) *
    Math.sin(dLong / 2) * Math.sin(dLong / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c;
  return d; // returns the distance in meter
};


/**
 * Function to mark card inactive after being quereid
 * @param {*} codeid 
 * @param {*} req 
 * @param {*} res 
 */
function updateCode(codeid, req, res){
  var promoid = codeid

  console.log('GET id', promoid);

  Promotion
    .findById(promoid)
    .exec(function(err, promotion) {
      if (err) {
        console.log("Error occured processing your request");
        res
          .status(500)
          .json(err);
          return;
      } else if(!promotion) {
        console.log("id not found in database", promoid);
        res
          .status(404)
          .send( "Promotions ID not found " + promoid );
          return;
      }
      promotion.active= false,
      promotion.expired = true,
      promotion.origin = {
               origin : req.body.origin ,
              coordinates: [parseFloat(req.body.lngo), parseFloat(req.body.lato)]
            },
      promotion.desitnation =
                   {  
                      desitnation : req.body.desitnation , 
                      coordinates: [parseFloat(req.body.lngd), parseFloat(req.body.latd)]
              }
      promotion
        .save(function(err, promotionUpdate) {
          if(err) {
            res
              .status(500)
              .json(err);
              return
          } else {
            console.log(promotionUpdate);
            res.status(200).send(promotionUpdate).json();
           
           
          }
        });


    });
}

/**
 * Change card state
 */
module.exports.updatestatus = (req, res) => {
  var promoid = req.params.id;

  console.log('GET id', promoid);

  Promotion
    .findById(promoid)
    .select('-promocodes')
    .exec(function(err, promotion) {
      if (err) {
        console.log("Error occured processing your request");
        res
          .status(500)
          .json(err);
          return;
      } else if(!promotion) {
        console.log("id not found in database", promoid);
        res
          .status(404)
          .send( "Promotions ID not found " + promoid );
          return;
      }
      promotion.active= req.body.active

      promotion
        .save(function(err, promotionUpdate) {
          if(err) {
            res
              .status(500)
              .json(err);
          } else {
            console.log(promotionUpdate);
            res
              .status(204)
              .json(promotionUpdate);
          }
        });


    });

};
