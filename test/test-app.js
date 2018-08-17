var expect = require("chai").expect;
var verify = require('../verify');
var promocode = require('../api/controllers/promotions.controller');
var request = require('request');
 
var url = "http://localhost:5000/api/v1"



describe("should get a valid response from server", function(){


    it("returns status 200", function(done) {
        request(url, function(error, response, body) {
          expect(response.statusCode).to.equal(200);
          done();
        });
      });

})

/**
 *  Token generations
 */
describe("User can log In? ", function(){

    describe("should get a avalid token for user ", function(){

        it("returns token", function(done) {

        request.post(url+'/auth/login', { form: { email: "dd@rr.com", password: "danny123" }} ,function(err, httpResponse,body) {
                expect(httpResponse.statusCode).to.equal(200);
              done();
            });
          });

        });
});


describe("should return all codes", function(){
    var token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjViNzJhZDJlOWRlZmNiNDI2YTVmMDZiMiIsImlhdCI6MTUzNDUwNjA5NSwiZXhwIjoxNTM0NTkyNDk1fQ.D0pGpJZX4v2o12juHpfT_aEZ0qJt9QLfTEGIQ5JOdYc';

    
    it("has codes in the system", function(){
        
        var promocodes = {};
        var options = {
            url: url+'/promocode',
            headers: {
              'x-access-token': token
            }
          };
           
          function callback(error, response, body) {
            if (!error && response.statusCode == 200) {
              var info = JSON.parse(body);
              expect(promocode != null);
            }
          }
       request(options, callback);
                    
       
    });
});
