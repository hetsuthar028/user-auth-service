const express = require('express');
const mysql = require('mysql');
const databaseSchemaRouter = require('./routes/database-schema');
const errorHandler = require('./middlewares/errorHandler');
const signUpRouter = require('./routes/signUpRouter');
const signInRouter = require('./routes/signInRouter');

const PORT = process.env.PORT || 4200;

const app = express();
app.use(express.json());
app.use(databaseSchemaRouter);
app.use(signUpRouter);
app.use(signInRouter);

app.get('/', (req, res)=>{
    res.send({message: "Server running"});
    res.end();
});

app.listen(PORT, ()=>{
    console.log(`User-Auth-Service Listening on ${PORT}`);
    // connectToDB();
});