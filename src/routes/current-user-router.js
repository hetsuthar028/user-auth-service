require('dotenv').config();
const express = require('express');
const currentUserRouter = express.Router();
const jwt = require('jsonwebtoken');
const currentUserMidd = require('../middlewares/current-user-middleware');

currentUserRouter.get('/api/user/currentuser', currentUserMidd, (req, res)=>{
    res.send({currentUser: req.currentUser || null });
});

module.exports = currentUserRouter;