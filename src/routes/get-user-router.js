require('dotenv').config();
const express = require('express');
const dbObj = require('../utils/database-call');
const getUserRouter = express.Router();

getUserRouter.get('/api/user/get/:userEmail', (req, res) => {

    let userEmail = req.params.userEmail;
    console.log("GOt User Req", userEmail)
    let emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if(emailPattern.test(userEmail)){
        let getUserQuery = `SELECT username, fullName, email FROM user WHERE email='${userEmail}'`;

        dbObj.query(getUserQuery, (err, data) => {
            if(err){
                console.log("Error getting user data from DB", err);
                return res.status(500).send({success: false, errors: JSON.stringify(err)});
            }

            return res.status(200).send({success: true, user: data[0]});
        })
        
    } else{
        return res.status(500).send({success: false, errors: "Invalid user email"});
    }
})

module.exports = getUserRouter;