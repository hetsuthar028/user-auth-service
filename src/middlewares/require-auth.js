const express = require('express');

const requireAuth = (req, res, next) =>{
    if(!req.currentUser){
        return res.status(401).send({error: "Not authorized"});
    }
    next();
}

module.exports = requireAuth;