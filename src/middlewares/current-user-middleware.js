require('dotenv').config();
const express = require('express');
const jwt = require('jsonwebtoken');

const currentUserMidd = (req, res, next) =>{
    console.log("Req Header", req.headers.authorization)
    if(!req.headers.authorization){
        return next();
    }

    try{
        const payload = jwt.verify(req.headers.authorization, process.env.JWT_SECRET)
        req.currentUser = payload;
        console.log("C User", payload)
        return next();
    } catch(err){
        return next();
    }
};

module.exports = currentUserMidd;