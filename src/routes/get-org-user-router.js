require('dotenv').config();

const express = require('express');
const dbObj = require('../utils/database-call');

const getOrgUserRouter = express();

getOrgUserRouter.get('/api/user/get/org/:userEmail', (req, res) => {
    let userEmail = req.params.userEmail;
    console.log("Req for ORG USER", userEmail)
    let emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

    if(emailPattern.test(userEmail)){
        let getOrgUserQuery = `SELECT * FROM organization WHERE email='${userEmail}'`;

        dbObj.query(getOrgUserQuery, (err, data) => {
            if(err){
                return res.status(500).send({success: false, error: 'Invalid user'});
            }

            return res.status(200).send({success: true, userProfile: data[0]})
        })
    } else {
        return res.status(500).send({success: false, error: "Invalod email"});
    }
})

module.exports = getOrgUserRouter;