const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = mongoose.model('User');
var bcrypt = require('bcryptjs');

/**
 * Register
 * @param {*} req 
 * @param {*} res 
 */
module.exports.registerUser = (req, res) => {
    var hashedPassword = bcrypt.hashSync(req.body.password, 8);

    User.create({
        username : req.body.username,
        email : req.body.email,
        password : hashedPassword,
        fullnames: req.body.fullnames,
        phonenumber: req.body.phonenumber,
        sex: req.body.sex,
        position: req.body.position
      }, (err, user) => {
            if (err) return res.status(500).send("There was a problem registering the user.")
            // create a token
            var token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, {
            expiresIn: 86400 // expires in 24 hours
            });
            res.status(200).send({ auth: true, token: token });
        }); 
   
}







  
/**
 * Login
 * @param {*} req 
 * @param {*} res 
 */
module.exports.loginUser = (req, res) => {

    User
        .findOne({$or: [
            {email: req.body.email},
            {username: req.body.username}
              ]}, 
            (err, user) =>{
                if (err) return res.status(500).send('Error on the server.');
                if (!user) return res.status(404).send('No user found.');
                    
                    var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
                
                    if (!passwordIsValid) return res.status(401).send({ auth: false, token: null });
               
                    var token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, {
                            expiresIn: 86400 // expires in 24 hours
                    });
             res.status(200).send({ auth: true, token: token });
      });
}



module.exports.me = (req, res, next)=>{

    console.log("here");

    var token= req.headers['x-access-token'];
    if(!token) return res.status(401).send({ auth: false, message: "No auth token provided."});
    jwt.verify(token, process.env.SECRET_KEY, (err, decoded)=>{
        if(err) {
            return res.status(500).send({auth: false, message: "Failed to authenticate token."});
        }else{
        /**
         * Query for the use
         */
    User.findById(decoded.id,{ password: 0 }, (err, user)=> {
        if (err) 
            return res.status(500).send("There was a problem finding the user.");

        if (!user) 
            return res.status(404).send("No user found.");
        
        res.status(200).send(user);
        });
    }
    });

}

module.exports.updateUser = (req, res) => {
    
    User.findByIdAndUpdate(req.params.id, req.body, {
        new: true
    }, function (err, user) {
        if (err) 
            return res.status(500).send("There was a problem updating the user.");
        res.status(200).send(user);
    });
}

module.exports.logout = (req, res)=>{
    res.status(200).send({ auth: false, token: null });
}