require('dotenv').config();
const express = require('express');
const jwt = require('jsonwebtoken');

const currentUserMidd = (req, res, next) =>{
    if(!req.session.jwt){
        return next();
    }

    try{
        const payload = jwt.verify(req.session.jwt, process.env.JWT_SECRET)
        req.currentUser = payload;
    } catch(err){
        return next();
    }
    next();
};

module.exports = currentUserMidd;