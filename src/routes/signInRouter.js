const express = require('express');
const dbObj = require('../utils/database-call');
const bcrypt = require('bcrypt');
const signInRouter = express.Router();


signInRouter.post('/api/user/signin', (req, res)=>{
    let {email, password} = req.body;
    let errors = [];

    // Email and Password Input Value Validation
    if(!email || email == ""){
        errors.push({error: "Invalid Email", field: "email"})
    }
    if(!password || password == ""){
        errors.push({error: "Invalid Password", field:"password"})
    }

    // Queries
    let userFetchQuery = `SELECT email, password FROM user where email='${email}'`;

    dbObj.query(userFetchQuery, (err, results)=>{
        if(err) return res.status(400).json({error: "Error fetching data"})

        if(!results.length){
            return res.status(400).json({message: "Invalid email or password"});
        }

        bcrypt.compare(password, results[0].password, (err, response)=>{
            if(err){
                console.log(err);
                return res.status(400).json({error: "Password can't be decrypted"});
            }

            if(response == false){
                return res.status(400).json({error: "Invalid email or password"});
            }

            return res.status(200).json({message: "success"});
        })
    })
});


module.exports = signInRouter;