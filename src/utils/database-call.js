const mysql = require('mysql');

const dbObj = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "password",
    database:"user",
    port: "7200",
});

dbObj.connect((err)=>{
    if(err) throw err;
    console.log("MySQL DONE")
})

module.exports = dbObj;