require('dotenv').config();
const express = require('express');
const jwt = require('jsonwebtoken');

const currentUserMidd = (req, res, next) =>{
    // console.log("Req Header", req.headers.authorization)
    if(!req.headers.authorization){
        // console.log("No header")
        return next();
    }
    // if(!req.session.jwt){
    //     return next();
    // }

    try{
        const payload = jwt.verify(req.headers.authorization, process.env.JWT_SECRET)
        // const payload = jwt.verify(req.session.jwt, process.env.JWT_SECRET)
        req.currentUser = payload;
        // console.log("C User", req.currentUser)
        next();
    } catch(err){
        return next();
    }
    // next();
};

module.exports = currentUserMidd;