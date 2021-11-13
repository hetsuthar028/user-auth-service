require('dotenv').config();
const express = require('express');
const dbObj = require('../utils/database-call');
const checkUserNameRouter = express.Router();


checkUserNameRouter.get('/api/user/get/username/:userName', (req, res) => {
    let userName = req.params.userName;
    if(userName.toString().length >= 8){
        let checkUserNameQuery = `SELECT username, email FROM user WHERE username='${userName}'`;

        dbObj.query(checkUserNameQuery, (err, data) => {
            if(err){
                console.log("Erorr getting username from DB");
                return res.status(500).send({success: false, errors: JSON.stringify(err)});
            }

            if(data.length >= 1){
                return res.status(200).send({success: true, data: data[0]});
            } else {
                return res.status(200).send({success: false, data})
                
            }
        })

    } else {
        return res.status(500).send({success: false, errors: 'Invalid username'});
    }
    
})

module.exports = checkUserNameRouter;