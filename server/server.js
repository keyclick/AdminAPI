const express = require("express");
const app = express();
const mysql = require("mysql");
const bodyParser = require("body-parser");

const mongoose = require("mongoose");
const cors = require("cors");

const port = 5000;

app.use(cors());

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "ajithgo",
});

//testing backend
app.get("/", (req, res) => {
  return res.json("from Backend");
});

//console testing backend
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

//checking if database is connected
connection.connect((error) => {
  if (error) {
    console.error("Error connecting to the database:", error);
  } else {
    console.log("Connected to the database successfully!");
  }
});

// Test the database connection
connection.query("SELECT NOW() as currentTime", (error, results, fields) => {
  if (error) {
    console.error("Error connecting to the database:", error);
  } else {
    console.log("Connected to the database successfully!");
    console.log("Current time from the database:", results[0].currentTime);
  }
});

//Displaying the contents in the table
connection.query("SELECT * FROM FORMDATA", (error, result) => {
  console.error("result", result);
});

//Validation of the email
// Middleware for parsing request bodies
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Email Validation. Define a route for email validation
app.post("/validate-email", (req, res) => {
  const email = req.body.email;
  // Regular expression pattern for email validation
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  // Check if the email matches the pattern
  if (emailPattern.test(email)) {
    // Email is valid
    res.status(200).json({ message: "Email is valid" });
  } else {
    // Email is invalid
    res.status(400).json({ message: "Email is invalid" });
  }
});

// Validation of the username
app.post("/validate-username", (req, res) => {
  const username = req.body.username;
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Check if the username is valid (you can implement your validation logic here)
  if (emailPattern.test(username)) {
    // Username is valid
    res.status(200).json({ message: "username is valid" });
  } else {
    // Username is invalid
    res.status(400).json({ message: "username is invalid" });
  }
});

// Handle form submission
app.post("/submit-form", (req, res) => {
  const formData = req.body;

  // Save the form data to the database
  connection.query("INSERT INTO FORMDATA SET ?", formData, (error, result) => {
    if (error) {
      console.error("Error saving form data:", error);
      res.status(500).json({ message: "Error saving form data" });
    } else {
      console.log("Form data saved successfully");
      res.status(200).json({ message: "Form data saved successfully" });
    }
  });
});
