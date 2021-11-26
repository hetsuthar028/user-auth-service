const express = require("express");
const mysql = require("mysql");
const axios = require("axios");

const router = express.Router();

const mysqlConn = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "password",
  port: "7200",
});

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "password",
  database: "user",
  port: "7200",
});

mysqlConn.connect((err) => {
    if (err) console.log("Error Connecting to MySQL");
    console.log("Connected to MySQL...");
});

db.connect((err) => {
    if (err) console.log("Error Connecting to User Database");
    console.log("Connected to User Database...");
});


mysqlConn.on("error", (err) => {
  console.log("[mysql error]");
});

db.on("error", (err) => {
  console.log("[mysql error]");
});



let paths = {
  userDatabase: "/api/user/database/createDatabase",
  userTable: "/api/user/database/createUserTable",
  developerTable: "/api/user/database/createDevUserTable",
  organizationTable: "/api/user/database/createOrgUserTable",
  allTables: "/api/user/database/createAllTables",
  dropDeveloperTable: "/api/user/database/dropDeveloperTable",
  dropOrganizationTable: "/api/user/database/dropOrganizationTable",
  dropUserTable: "/api/user/database/dropUserTable",
};


// @Route - User Database
router.get(paths["userDatabase"], (req, res) => {
  let query = "CREATE DATABASE user";

  mysqlConn.query(query, (err, result) => {
    if (err) {
      console.log("Error Creating Database...");
      return res.status(400).send({ message: "Error Creating User Database", err });
    }
    console.log("Database Created Successfully!");
    return res.send({ message: "Database Created Successfully!" });
  });
  // mysqlConn.destroy();
});


// @Route - User Table
router.get(paths["userTable"], (req, res) => {
  let query =
    "CREATE TABLE IF NOT EXISTS user(email varchar(50) PRIMARY KEY, password VARCHAR(100), username varchar(20) NOT NULL, userType varchar(20) NOT NULL,  fullName varchar(50))";

  db.query(query, (err, result) => {
    if (err) {
      console.log("Error Creating User Table");
      return res.status(400).send({ message: "Error Creating User Table", error: err.message });
    }
    console.log("User Table Created Successfully!");
    return res.send({ message: "User Table Created Successfully!", result });
  });
});


// @Route - Developer User Table
router.get(paths["developerTable"], (req, res) => {
  let query =
    "CREATE TABLE IF NOT EXISTS developer(email varchar(50) PRIMARY KEY NOT NULL, college varchar(50) NOT NULL, graduationYear INT NOT NULL, FOREIGN KEY(email) REFERENCES user(email) ON UPDATE CASCADE ON DELETE CASCADE)";

  db.query(query, (err, result) => {
    if (err) {
      console.log("Error Creating Developer-User Table", err);
      return res
        .status(400)
        .send({ message: "Error Creating Developer-User Tbale" });
    }
    console.log("Developer Table Created Successfully!");
    return res.send({ message: "Developer Table Created Successfully!" });
  });
 
});


// @Route - Organization User Table
router.get(paths["organizationTable"], (req, res) => {
  let query =
    "CREATE TABLE IF NOT EXISTS organization(email varchar(50) PRIMARY KEY NOT NULL, contact varchar(10), address varchar(100), FOREIGN KEY(email) REFERENCES user(email) ON UPDATE CASCADE ON DELETE CASCADE)";

  db.query(query, (err, result) => {
    if (err) {
      console.log("Error Creating Organization-User Table");
      return res
        .status(400)
        .send({ message: "Error Creating Organization-User Tbale" });
    }
    console.log("Organization Table Created Successfully!");
    return res.send({ message: "Organization Table Created Successfully!" });
  });
});


// @Route - All Tables
router.get(paths["allTables"], (req, res) => {
  axios
    .all([
      axios.get(paths["userTable"]),
      axios.get(paths["developerTable"]),
      axios.get(paths["organizationTable"]),
    ])
    .then((response) => {
      console.log("All Tables Created Successfully");
      return res.send({ message: "All Tables Created Succesfully" });
    });
});


// @Route - Drop Database
router.get('/api/user/database/dropDatabase', (req, res)=>{
    let query = "DROP DATABASE user";
    mysqlConn.query(query, (err, result)=>{
        if(err){
            console.log("Error occured while deleting Databae")
            return res.status(400).send({message: "Error occured while deleting Database"})
        }
        console.log("Database Dropped Succesfully")
        return res.status(200).send({message:"Database Dropped Succesfully."})
    })
})


// @Route - Drop User Table
router.get(`${paths["dropUserTable"]}`, (req, res)=>{
    let query = "DROP TABLE user";
    db.query(query, (err, result)=>{
        if(err){
            console.log("Error occured while deleting User Table")
            return res.status(400).send({message: "Error occured while User Table"})
        }
        console.log("User Table  Dropped Succesfully")
        return res.status(200).send({message:"User Table Dropped Succesfully."})
    })
})


// @Route - Drop Developer Table
router.get(`${paths["dropDeveloperTable"]}`, (req, res)=>{
    let query = "DROP TABLE developer";
    db.query(query, (err, result)=>{
        if(err){
            console.log("Error occured while deleting DevUser Table")
            return res.status(400).send({message: "Error occured while DevUser Table"})
        }
        console.log("DevUser Table  Dropped Succesfully")
        return res.status(200).send({message:"DevUser Table Dropped Succesfully."})
    })
})


// @Route - Drop Organization Table
router.get(`${paths["dropOrganizationTable"]}`, (req, res)=>{
    let query = "DROP TABLE organization";
    db.query(query, (err, result)=>{
        if(err){
            console.log("Error occured while deleting OrgUser Table")
            return res.status(400).send({message: "Error occured while OrgUser Table"})
        }
        console.log("OrgUser Table  Dropped Succesfully")
        return res.status(200).send({message:"OrgUser Table Dropped Succesfully."})
    })
})


module.exports = router;
