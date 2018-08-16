const mongoose = require('mongoose');
const Promotion = mongoose.model('promotions');
var polyline = require('google-polyline')
var randomstring = require("randomstring");



/**
 * Get all promo codes.
 * @param {*} req 
 * @param {*} res 
 */
module.exports.getAllCode = (req, res) => {

    var event_id = req.params.id;

    console.log("sent_id", event_id)
    Promotion
        .findById(event_id)
        .select('promocodes')
        .exec(function (err, event) {
            var response = {
                status: 200,
                message: []
            };
            if (err) {
                console.log(err);
                console.log("Error processing your request");
                response.status = 500;
                response.message = err;
            } else if (!event) {
                console.log("Event Id not found in database", event_id);
                response.status = 404;
                response.message = {
                    "message": "Event Id not found " + event_id
                };
            } else {
                response.message = event.promocodes ? event.promocodes : []
            }
            res
                .status(response.status)
                .json(response.message);
        });

};

/**
 * get one code
 * @param {*} req 
 * @param {*} res 
 */
module.exports.getOneCode = (req, res) => {

    var promoid = req.params.id;
    var codeid = req.params.pcodeid;


    Promotion
        .findById(promoid)
        .select('promocodes')
        .exec((err, event) => {
            //Get one code by Id
            var promocode = event.promocodes.id(codeid);
            var response = {
                status: 200,
                message: promocode
            };

            if (err) {
                console.log(err);
                console.log("Error processing your request");
                response.status = 500;
                response.message = err;
            } else if (!event) {
                console.log("Promo code id not found in database");
                response.status = 404;
                response.message = {
                    "message": "Event not found  not found in database " + hos_id
                };
            } else {

                res
                    .status(response.status)
                    .json(response.message);
            }
        });

};

/**
 * Generate the promo codes:
 * 
 */

module.exports.generateCodes = (req, res) => {

    var promoid = req.params.id;

    Promotion
        .findById(promoid)
        .select('promocodes')
        .exec((err, event) => {

            var response = {
                status: 200,
                message: []
            };
            if (err) {
                console.log(err);
                console.log("Error finding promotion");
                response.status = 500;
                response.message = err;
                return;
            } else if (!event) {
                console.log("Event not found");
                response.status = 404;
                response.message = {
                    "message": "Requested Event not found in the system."
                };
                return;
            }
            console.log("Step three");

            if (event) {
                var counter;
                console.log("Step four");
                /**
                 * Simply generate codes with a for loop,  can be do
                 */
                for (var i=0; i < req.body.codenum; i++) {
                    console.log("generated", i, "code", randomstring.generate(7));
                    event.promocodes.push({
                        code: randomstring.generate(7),
                        active: true,
                        value: req.body.value,
                        expired: false,
                        expirydate: new Date(req.body.expirydate)

                    });
                }


                    event.save((err, eventUpdated) => {
                        if (err) {
                            console.log("Error updating event subrecord", err);

                            res
                                .status(500)
                                .json({
                                    "error": "Server error processing your request"
                                });
                            return;
                        } else {
                            console.log("saved", eventUpdated);
                            res
                                .status(201)
                                .json(eventUpdated.promocodes[eventUpdated.promocodes.length - 1]);
                            return;
                        }
                    });
                    console.log("Step five");

                }
            


        });

};

