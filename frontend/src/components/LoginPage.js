import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./loginPage.css";

const LoginPage = () => {
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/login", credentials, { withCredentials: true });
      navigate("/dashboard"); // Redirect to dashboard
    } catch (err) {
      setError("Invalid username or password");
    }
  };

  return (
    <div className="login-container">
      <div className="login-header">
        <h1>LocalMart</h1>
      </div>
      <div className="login-box">
        <h2>Shop Owner Login</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Username or Email</label>
            <input
              type="text"
              name="username"
              placeholder="Enter your username or email"
              value={credentials.username}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={credentials.password}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="login-button">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;