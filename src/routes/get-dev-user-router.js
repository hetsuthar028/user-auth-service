require('dotenv').config();
const express = require('express');
const dbObj = require('../utils/database-call');

const getDevUserRouter = express();

getDevUserRouter.get('/api/user/get/dev/:userEmail', (req, res) => {
    let userEmail = req.params.userEmail;

    let emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

    if(emailPattern.test(userEmail)){
        let getDevUserQuery = `SELECT * FROM developer WHERE email='${userEmail}'`;

        dbObj.query(getDevUserQuery, (err, data) => {
            if(err){
                return res.status(500).send({success: false, error: 'Invalid user'});
            }

            return res.status(200).send({success: true, userProfile: data[0]})
        })
    } else {
        return res.status(500).send({success: false, error: 'Invalid email'});
    }

})

module.exports = getDevUserRouter;