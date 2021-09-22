const express = require('express');

const signOutRouter = express.Router();

signOutRouter.post('/api/user/signout', (req, res)=>{
    req.session = null;
    res.send({message: "Signed Out Successfully"});
})

module.exports = signOutRouter;