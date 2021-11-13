require("dotenv").config();
const express = require("express");
const axios = require("axios");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const dbObj = require("../utils/database-call");
const signUpRouter = express.Router();
const jwt = require("jsonwebtoken");

// @Route - SignUp
signUpRouter.post(
    "/api/user/signup",
    [
        body("email").isEmail(),
        body("password").custom((value, { req }) => {
            const regexPassword = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
            if (!regexPassword.test(value)) {
                throw new Error(
                    "Password must contain atleast 8 characters and must have a letter and a numer"
                );
            }
            return true;
        }),
        body("passwordConfirmation").custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error(
                    "Password confirmation does not match password"
                );
            }
            return true;
        }),
    ],
    async (req, res) => {
        try {
            const { email, password, userName, userType, fullName } = req.body;

            let errors = [];
            let saltRounds = 7;
            let hashedPasswd;

            if (!email || email == "") {
                errors.push({ error: "Invalid Email", field: "email" });
            }
            if (!password) {
                errors.push({ error: "Invalid Password", field: "password" });
            }
            if (!userName || userName == "") {
                errors.push({ error: "Invalid userName", field: "userName" });
            }
            if (!userType || userType == "") {
                errors.push({ error: "Invalid userType", field: "userType" });
            }
            if (!userType || userType == "") {
                errors.push({ error: "Invalid userType", field: "userType" });
            }
            if (!fullName || fullName == "") {
                errors.push({ error: "Invalid fullName", field: "fullName" });
            }

            // if(userType == "developer"){
            //     if(!req.body.college){
            //         errors.push({error: "Invalid college", field:"college"})
            //     }
            //     if(!req.body.graduationYear){
            //         errors.push({error: "Invalid Graduation Year", field:"graduationYear"})
            //     }
            // }

            // if(userType == "organization"){
            //     if(!req.body.contact){
            //         errors.push({error: "Invalid contact", field:"contact"})
            //     }
            //     if(!req.body.address){
            //         errors.push({error: "Invalid address", field:"address"})
            //     }
            // }

            // Check for validation errors
            if (errors.length != 0) {
                console.log("Errors at start");
                console.log("Errors:", errors);
                return res.status(400).send({ errors: errors });
            }

            // Begin Database Transactions

            /* We've used Begin Transaction 
            to work with the RollBack and Commit 
            functionality. */

            await dbObj.beginTransaction((err) => {
                // Query - User Existance
                let userExistsCheckQuery = `SELECT email FROM user where email='${email}'`;
                let userNameExistsQuery = `SELECT username FROM user where username='${userName}'`;
                // Check for existing User
                dbObj.query(userExistsCheckQuery, (err, results) => {
                    if (err) {
                        return console.log(err);
                    }
                    if (results.length != 0) {
                        console.log("User already exists");
                        return res
                            .status(200)
                            .send({ warning: "User already exists" });
                    }

                    dbObj.query(userNameExistsQuery, (err, userNamResult) => {
                        if (err) {
                            return console.log(err);
                        }
                        if (userNamResult.length != 0) {
                            console.log("Username already exists");
                            return res
                                .status(200)
                                .send({ warning: "Username already exists" });
                        }

                        // Generating Hashed Password
                        let newPasswd = bcrypt.hash(password, saltRounds);
                        newPasswd.then((password) => {
                            hashedPasswd = password;
                            console.log("Hashed", hashedPasswd);

                            // Query - Add User
                            let userAddQuery = `INSERT INTO user(email, password, userName, userType, fullName) VALUES('${email}', '${hashedPasswd}', '${userName}', '${userType}', '${fullName}')`;

                            // Add to User Table
                            dbObj.query(userAddQuery, (err, results) => {
                                if (err) {
                                    console.log("Can't Add user Data", err);
                                    return dbObj.rollback();
                                }

                                if (userType == "developer") {
                                    // Query - Addd Developer
                                    let developerAddQuery = `INSERT INTO developer(email, college, graduationYear) VALUES('${email}', '${req.body.college}', ${req.body.graduationYear})`;

                                    // Add to developer Table
                                    dbObj.query(
                                        developerAddQuery,
                                        (err, results) => {
                                            if (err) {
                                                console.log(
                                                    "Can't Add Developer Data",
                                                    err
                                                );
                                                return dbObj.rollback();
                                            }
                                            dbObj.commit();

                                            const userJWT = jwt.sign(
                                                {
                                                    email: email,
                                                    userType: userType,
                                                    userName: userName,
                                                },
                                                process.env.JWT_SECRET
                                            );

                                            req.session = {
                                                jwt: userJWT,
                                            };

                                            return res
                                                .status(200)
                                                .json({ message: "success" });
                                        }
                                    );
                                } else if (userType == "organization") {
                                    // Query - Add Organization
                                    let organizationAddQuery = `INSERT INTO organization(email, contact, address) VALUES('${email}', '${req.body.contact}', '${req.body.address}')`;

                                    // Add to organization Table
                                    dbObj.query(
                                        organizationAddQuery,
                                        (err, results) => {
                                            if (err) {
                                                console.log(
                                                    "Can't Add Organization Data",
                                                    err
                                                );
                                                return dbObj.rollback();
                                            }
                                            dbObj.commit();

                                            const userJWT = jwt.sign(
                                                {
                                                    email: email,
                                                    userType: userType,
                                                    userName: userName,
                                                },
                                                process.env.JWT_SECRET
                                            );

                                            req.session = {
                                                jwt: userJWT,
                                            };
                                            return res
                                                .status(200)
                                                .json({ message: "success" });
                                        }
                                    );
                                }
                            });
                        });
                    });
                });
            });
        } catch (error) {
            let errors = validationResult(req);

            if (!errors.isEmpty()) {
                console.log("Errors at End");
                return res.status(400).json({ errors: errors.array() });
            }
        }
    }
);

module.exports = signUpRouter;
