const express = require('express');
const { check } = require('express-validator');
const jwt = require('jsonwebtoken');

const router = express.Router();


router.use('', (req, res, next) => {

    const token =  req.headers['x-auth-token'];
   
    if(!token){
        return    res.status(401).json({ status: "0", msg: "Unautorised! Token Required." });
    }

    jwt.verify(token,require('config').get('jwtSecret'),(err,decode)=>{

        console.log(decode);


    });

    next();
});



module.exports = router;