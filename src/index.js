require("dotenv").config();
const express = require("express");
const mysql = require("mysql");
const createError = require("http-errors");
const cookieParser = require("cookie-parser");
require('express-async-errors');
const verifyJWT = require("./middlewares/verify-token");
const cookieSession = require('cookie-session');
const cors = require('cors');

const databaseSchemaRouter = require("./routes/database-schema");
const errorHandler = require('./middlewares/error-handler');
const signUpRouter = require("./routes/signup-router");
const signInRouter = require("./routes/signin-router");
const signOutRouter = require("./routes/signout-router");
const currentUserRouter = require('./routes/current-user-router');
const getUserRouter = require('./routes/get-user-router');
const checkUserNameRouter = require('./routes/check-username-router');
const getDevUserRouter = require('./routes/get-dev-user-router');
const PORT = process.env.PORT || 4200;

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
// app.use(cookieParser());
app.use(
    cookieSession({
        signed: false
    })
);
app.use(databaseSchemaRouter);
app.use(signUpRouter);
app.use(signInRouter);
app.use(currentUserRouter);
app.use(signOutRouter);
app.use(getUserRouter);
app.use(checkUserNameRouter);
app.use(getDevUserRouter);

app.use(errorHandler);

app.get("/", verifyJWT, (req, res) => {
    res.send({
        message: "You're verified",
        email: req.email,
        username: req.username,
        userType: req.userType,
    });
    res.end();
});

app.listen(PORT, () => {
    console.log(`User-Auth-Service Listening on ${PORT}`);
    // connectToDB();
});
