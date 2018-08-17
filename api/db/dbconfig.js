
const mongoose = require('mongoose');

const dbUrl  = process.env.PROD_DB
mongoose.connect(dbUrl, err =>{
    if(err){
        console.log(err)
    }else{
        console.log("connected to DB")
    }
} );


// CAPTURE APP TERMINATION / RESTART EVENTS
// To be called when process is restarted or terminated
function gracefulShutdown(msg, callback) {
    mongoose.connection.close(function() {
      console.log('Mongoose disconnected through ' + msg);
      callback();
    });
  }
  
  // For nodemon restarts
  process.once('SIGUSR2', function() {
    gracefulShutdown('nodemon restart', function() {
      process.kill(process.pid, 'SIGUSR2');
    });
  });
  // For app termination
  process.on('SIGINT', function() {
    gracefulShutdown('App termination (SIGINT)', function() {
      process.exit(0);
    });
  });
  // For Heroku app termination
  process.on('SIGTERM', function() {
    gracefulShutdown('App termination (SIGTERM)', function() {
      process.exit(0);
    });
  });



  /**
   * Register the Scemas witht eh Db
   */
  require('../models/promotions');
  require('../models/user');