const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
var VerifyToken = require('../../verify');

//remember to import all the controllers

const crtlPromtion = require('../controllers/promotions.controller');
const crtlUsers = require('../controllers/user.controller');
/**
 * Home 
 */
router.get('/', (req, res) => {
    res.send('From API   toure')
})

//Promotions Routes
router
    .route('/promocode')
    .get(VerifyToken,VerifyToken,crtlPromtion.getAllCodes)
    .post(VerifyToken,crtlPromtion.generateCodes);


router
    .route('/promocode/:id')
    .get(VerifyToken,crtlPromtion.getOne)
    .put(VerifyToken,crtlPromtion.updateOne)
    .delete(VerifyToken,crtlPromtion.deleteOne);


router
    .route('/promocode/validate')
    .post(VerifyToken, crtlPromtion.validateCode);
    
router
    .route('/getActiveCodes')
    .get(VerifyToken, crtlPromtion.getActiveCode);
    
router
    .route('/promocode/status/:id')
    .put(VerifyToken,crtlPromtion.updatestatus);

router
    .route('/promocode/updateAll')
    .post(VerifyToken, crtlPromtion.updateAll)


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