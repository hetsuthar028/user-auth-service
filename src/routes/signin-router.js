require("dotenv").config();
const express = require("express");
const dbObj = require("../utils/database-call");
const bcrypt = require("bcrypt");
const signInRouter = express.Router();
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const verifyJWT = require("../middlewares/verify-token");
const jwtSecret = process.env.JWT_SECRET;

signInRouter.post(
    "/api/user/signin",
    [body("email").isEmail()],
    async (req, res) => {
        const expErrors = validationResult(req);
        if (!expErrors.isEmpty()) {
            return res.status(400).json({ error: expErrors.array() });
        }

        let { email, password } = req.body;
        let errors = [];

        // Email and Password Input Value Validation
        if (!email || email == "") {
            errors.push({ error: "Invalid Email", field: "email" });
        }
        if (!password || password == "") {
            errors.push({ error: "Invalid Password", field: "password" });
        }

        // Queries
        let userFetchQuery = `SELECT * FROM user where email='${email}'`;

        await dbObj.query(userFetchQuery, (err, results) => {
            if (err)
                return res.status(400).json({ error: "Error fetching data" });

            

            if (!results.length || results == undefined) {
                return res
                    .status(400)
                    .json({ message: "Invalid email or password" });
            }
            let { email, storedPassword, username, userType, fullName } = results[0];

            bcrypt.compare(password, results[0].password, (err, response) => {
                if (err) {
                    console.log(err);
                    return res
                        .status(400)
                        .json({ error: "Password can't be decrypted" });
                }

                if (response == false) {
                    return res
                        .status(400)
                        .json({ error: "Invalid email or password" });
                }

                // Generate an access token
                const accessToken = jwt.sign(
                    { email: email, username: username, userType: userType },
                    jwtSecret,
                    { expiresIn: "100m" }
                );
                
                // Storing session cookie
                // req.session = {
                //     jwt: accessToken
                // };

                res.header("authorization", accessToken).json({
                    error: null,
                    data: { accessToken },
                });

                // return res.status(200).json({message: "success"});
            });
        });
    }
);

module.exports = signInRouter;
