const express = require("express");
const app = express();
const mysql = require("mysql");
const bodyParser = require("body-parser");

const mongoose = require("mongoose");
const cors = require("cors");
const API_KEY = "34c8297d285bcee35dc92298e13b783a-af778b4b-93c39c25";
const DOMAIN = "sandbox4e5ce5ea8870445cb84763078c6a381c.mailgun.org";
const formData = require("form-data");
const mailgun = require("mailgun-js")({
  apiKey: API_KEY,
  domain: DOMAIN,
});

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

// //Displaying the contents in the table
// connection.query("SELECT * FROM FORMDATA", (error, result) => {
//   console.error("result", result);
// });

//Validation of the email
// Middleware for parsing request bodies
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//EMAIL VERIFICATION SEND

function email(name) {
  const messageData = {
    from: "Excited User <me@samples.mailgun.org>",
    to: "ajithkumardk@gmail.com",
    subject: "Hello",
    html: `<html><body>Dear ${name}, \n\n Please click <a href="http://localhost:3000/verify-account">here</a> to verify your email.\n\nThanks!</body></html>`,
    // html: `Dear ${name}, \n\n Please go here http://localhost:3000/verify-account to verify your email.\n\nThanks!`,
  };

  mailgun.messages().send(messageData, (error, body) => {
    if (error) {
      console.error(error);
    } else {
      console.log("Test Mail Success:", body);
    }
  });

  // client.messages
  //   .create(DOMAIN, messageData)
  //   .then((res) => {
  //     console.log(res);
  //   })
  //   .catch((err) => {
  //     console.error("---##-----" + err);
  //   });
}

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
  // email();

  //Save the form data to the database
  connection.query("INSERT INTO FORMDATA SET ?", formData, (error, result) => {
    if (error) {
      console.error("Error saving form data:", error);
      res.status(500).json({ message: "Error saving form data" });
    } else {
      console.log("Form data saved successfully");
      const name = formData.name; //This name is used for the email purpose
      email(name);
      res.status(200).json({ message: "Form data saved successfully" });
    }
  });
});

//Check Credentials
// Check username and password
app.post("/check-credentials", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  // Query the database to check if the username and password are valid
  connection.query(
    "SELECT * FROM FORMDATA WHERE username = ? AND password = ?",
    [username, password],
    (error, result) => {
      if (error) {
        console.error("Error checking credentials:", error);
        res.status(500).json({ message: "Error checking credentials" });
      } else {
        if (result.length > 0) {
          // Valid credentials, fetch user details
          const userDetails = result[0]; // Assuming only one matching record
          res
            .status(200)
            .json({ message: "Credentials are valid", userDetails });
        } else {
          // Invalid credentials
          res.status(400).json({ message: "Invalid credentials" });
        }
      }
    }
  );
});

app.get("/user-details/:username", (req, res) => {
  console.log("Username data retrieved successfully");

  connection.query(
    "SELECT * FROM `formdata` WHERE username=?",
    [req.params.username],
    (error, result) => {
      if (error) {
        console.error("Error retrieving username's data:", error);
        res.status(500).json({ message: "Error retrieving username's data" });
      } else {
        console.log("Username data retrieved successfully");
        
        console.log(result);
        res.status(200).json(result);
      }
    }
  );
});

// Route for account verification
// app.get("/verify-account", (req, res) => {
//   res.send(
//     "Your account has been verified. Click <a href='/login'>here</a> to login."
//   );
// });

// // //After verified page
// app.get("/login", (req, res) => {
//   res.send("This is the login page.");
// });

// useEffect(() => {
//   const fetchUserData = async () => {
//     const response = await fetch("http://localhost:5000/user-details/${username}", {method: "GET"});
//     const data = await response.json();
//     setUserDetails(data);
//   }
//   fetchUserData();
// }, [username]);
