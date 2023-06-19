import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const LoginPage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    // Create the form data object
    const formData = {
      username,
      password,
    };

    // Make a POST request to the server to check the credentials
    fetch("http://localhost:5000/check-credentials", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message === "Credentials are valid") {
          // Credentials are valid, navigate to LoginDetailsPage with the username as a parameter
          navigate(`/login-details/${username}`);
        } else {
          // Invalid credentials, display an error message
          setLoginError("Invalid username or password");
        }
      })
      .catch((error) => {
        console.error("Error checking credentials:", error);
      });
  };

  return (
    <div>
      <h1>Login Page</h1>
      <form onSubmit={handleSubmit} className="d-flex flex-column mb-3">
        <label>
          Username:
          <input
            className="mt-3"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </label>
        <label>
          Password:
          <input
            className="mt-3"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        <input type="submit" value="Login" className="mt-3 btn-sm" />
        {loginError && <div className="text-danger">{loginError}</div>}
      </form>
      <div>
        Not registered? <Link to="/">Create an account</Link>
      </div>
    </div>
  );
};

export default LoginPage;
