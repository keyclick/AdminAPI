import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import VerificationPage from "./VerificationPage.jsx";
import LoginPage from "./LoginPage.jsx";

import LoginDetailsPage from "./LoginDetailsPage.jsx";
import "bootstrap/dist/css/bootstrap.css";

function App() {
  //Getting field values

  //Confirming password and confirm password are the same
  const [passwordError, setPasswordError] = useState("");
  const [passwordValid, setPasswordValid] = useState(true);

  const handleSubmit = (event) => {
    event.preventDefault();
    const name = event.target.elements.name.value;
    const username = event.target.elements.username.value;
    const password = event.target.elements.password.value;
    const confirmPassword = event.target.elements.confirmPassword.value;
    const language = event.target.elements.language.value;
    const mobile = event.target.elements.mobile.value;

    // Create the form data object
    const formData = {
      name,
      username,
      password,
      confirmPassword,
      language,
      mobile,
    };

    if (password !== confirmPassword) {
      // Password and confirm password do not match
      setPasswordError("Passwords do not match");
      setPasswordValid(false);
      return;
    } else {
      setPasswordError("");
      setPasswordValid(true);
    }

    // Perform username validation
    // Make a POST request to the server to validate the username
    fetch("http://localhost:5000/validate-username", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message === "username is valid") {
          // Username is valid, continue with form submission

          // Make a POST request to the server to save the form data
          fetch("http://localhost:5000/submit-form", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
          })
            .then((response) => response.json())
            .then((data) => {
              console.log(data);
              // Handle the response from the server
              // You can display a success message or perform any other actions here
              if (data.message === "Form data saved successfully") {
                window.location.href = "/verify-account"; // Redirect to the verification page
              }
            })
            .catch((error) => {
              console.error("Error submitting form:", error);
              // Handle the error, display an error message, etc.
            });
        } else {
          // Username is invalid, display an error message
          console.error("Username is invalid");
        }
      })
      .catch((error) => {
        console.error("Error validating username:", error);
      });

    // // Make a POST request to the server to save the form data
    // if (passwordValid) {
    //   fetch("http://localhost:5000/submit-form", {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify(formData),
    //   })
    //     .then((response) => response.json())
    //     .then((data) => {
    //       console.log(data);
    //       // Handle the response from the server
    //       // You can display a success message or perform any other actions here
    //     })
    //     .catch((error) => {
    //       console.error("Error submitting form:", error);
    //       // Handle the error, display an error message, etc.
    //     });
    // }
  };

  return (
    <Router>
      <div>
        <Routes>
          <Route
            path="/"
            element={
              <form onSubmit={handleSubmit} className="d-flex flex-column mb-3">
                <h1>Registration Form</h1>

                <label>
                  Name:
                  <input className="mt-3" type="text" id="name" required />
                </label>
                <label>
                  Username:
                  <input className="mt-3" type="email" id="username" required />
                </label>
                <label>
                  Password:
                  <input
                    className={`mt-3 ${!passwordValid ? "is-invalid" : ""}`}
                    type="password"
                    id="password"
                    required
                    pattern=".{8,}"
                    title="Password must be at least 8 characters long"
                  />
                </label>
                <label>
                  Confirm Password:
                  <input
                    className={`mt-3 ${!passwordValid ? "is-invalid" : ""}`}
                    type="password"
                    id="confirmPassword"
                    required
                  />
                  {!passwordValid && (
                    <div className="invalid-feedback">{passwordError}</div>
                  )}
                </label>
                <label>
                  Language:
                  <select className="mt-3" name="language" id="language">
                    <option value="ENG">ENG</option>
                    <option value="DE">DE</option>
                  </select>
                </label>
                <label>
                  Mobile:
                  <input className="mt-3" type="number" id="mobile" />
                </label>
                <input type="submit" value="Submit" className="mt-3 btn-sm" />
              </form>
            }
          />
          <Route path="/verify-account" element={<VerificationPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/login-details/:username" element={<LoginDetailsPage />} />
          
        </Routes>
      </div>
    </Router>
  );
}

export default App;
