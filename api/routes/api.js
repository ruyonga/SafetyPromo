const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
var VerifyToken = require('../../verify');

//remember to import all the controllers

const crtlPromtion = require('../controllers/promotions.controller');
const crtlUsers = require('../controllers/user.controller');
const crtlPCode = require('../controllers/promocode.controller');
/**
 * Home 
 */
router.get('/', (req, res) => {
    res.send('From API   toure')
})

//Promotions Routes
router
    .route('/promotions')
    .get(VerifyToken,VerifyToken,crtlPromtion.getAllCodes)
    .post(VerifyToken,crtlPromtion.generateCodes);


router
    .route('/promotions/:id')
    .get(VerifyToken,crtlPromtion.getOne)
    .put(VerifyToken,crtlPromtion.updateOne)
    .delete(VerifyToken,crtlPromtion.deleteOne);


router
    .route('/validate')
    .post(VerifyToken,crtlPromtion.validateCode);



/*
 * Register login
 */
router
    .route('/auth/register')
    .post(crtlUsers.registerUser);

router
    .route('/auth/login')
    .post(crtlUsers.loginUser);

router
    .route('/auth/me')
    .get(VerifyToken, crtlUsers.me);



module.exports = router;