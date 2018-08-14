const mongoose = require('mongoose');
const Promotion = mongoose.model('Promocodes');
var polyline = require('google-polyline')
var randomstring = require("randomstring");


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
  var promoid = req.query.id;

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
      promotion.active= true,
      promotion.value =req.body.value,
      promotion.expired = false,
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

  Promotion
      .findOne({code: req.body.code}, 
          (err, promocode) =>{
              if (err) return res.status(500).send('Error on the server.');
              if (!promocode) return res.status(404).send('Invalid user found.');
                  
            console.log(promocode)


           res.status(200).send(promocode).json();
    });
}



function updateCode(codeid){
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
          } else {
            console.log(promotionUpdate);
            res
              .status(204)
              .send(promotionUpdate)
              .json();
          }
        });


    });
}