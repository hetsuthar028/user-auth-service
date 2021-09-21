const express = require("express");
const axios = require("axios");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const dbObj = require("../utils/database-call");
const signUpRouter = express.Router();

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
            const { email, password, username, userType, fullName } = req.body;

            let errors = [];
            let saltRounds = 7;
            let hashedPasswd;

            if (!email || email == "") {
                errors.push({ error: "Invalid Email", field: "email" });
            }
            if (!password) {
                errors.push({ error: "Invalid Password", field: "password" });
            }

            // Check for validation errors
            if (errors.length != 0) {
                return res.status(400).send({ errors: errors });
            }

            // Begin Database Transactions

            /* We've used Begin Transaction 
            to work with the RollBack and Commit 
            functionality. */

            await dbObj.beginTransaction((err) => {
                // Query - User Existance
                let userExistsCheckQuery = `SELECT email FROM user where email='${email}'`;

                // Check for existing User
                dbObj.query(userExistsCheckQuery, (err, results) => {
                    if (err) {
                        return console.log(err);
                    }
                    if (results.length != 0) {
                        return res
                            .status(400)
                            .json({ warning: "User already exists" });
                    }

                    // Generating Hashed Password
                    let newPasswd = bcrypt.hash(password, saltRounds);
                    newPasswd.then((password) => {
                        hashedPasswd = password;
                        console.log("Hashed", hashedPasswd);

                        // Query - Add User
                        let userAddQuery = `INSERT INTO user(email, password, username, userType, fullName) VALUES('${email}', '${hashedPasswd}', '${username}', '${userType}', '${fullName}')`;

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
                                        return res
                                            .status(200)
                                            .json({ message: "success" });
                                    }
                                );
                            } else if (userType == "organization") {
                                // Query - Add Organization
                                let organizationAddQuery = `INSERT INTO organization(email, contact, address) VALUES('${email}', ${req.body.contact}, '${req.body.address}')`;

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
        } catch (error) {
            let errors = validationResult(req);

            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
        }
    }
);

module.exports = signUpRouter;
