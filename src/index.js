require("dotenv").config();
const express = require("express");
const mysql = require("mysql");
const createError = require("http-errors");
const cookieParser = require("cookie-parser");
const verifyJWT = require("./middlewares/verifyToken");

const databaseSchemaRouter = require("./routes/database-schema");
const errorHandler = require("./middlewares/errorHandler");
const signUpRouter = require("./routes/signUpRouter");
const signInRouter = require("./routes/signInRouter");

const PORT = process.env.PORT || 4200;

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(databaseSchemaRouter);
app.use(signUpRouter);
app.use(signInRouter);

app.get("/", verifyJWT, (req, res) => {
    res.send({
        message: "You're verified",
        email: req.email,
        username: req.username,
        userType: req.userType,
    });
    res.end();
});

// Catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// Error handler
app.use(function (err, req, res, next) {
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};

    res.status(err.status || 500).send(err);
});

app.listen(PORT, () => {
    console.log(`User-Auth-Service Listening on ${PORT}`);
    // connectToDB();
});
