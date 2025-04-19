import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./ShopOwnerSignUp.css";

const ShopOwnerSignUp = () => {
  const [formData, setFormData] = useState({
    shopName: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: ""
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      // Submit to backend
      const response = await axios.post("/signup", {
        username: formData.username,
        password: formData.password,
        shopName: formData.shopName,
        email: formData.email,
        role: "shop_owner" // Specify this is a shop owner
      });

      alert("Sign up successful! Please login.");
      navigate("/login");
    } catch (err) {
      if (err.response && err.response.data) {
        setError(err.response.data);
      } else {
        setError("Failed to register. Please try again.");
      }
    }
  };

  return (
    <div className="signup-container">
      <h2>Shop Owner Sign Up</h2>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit}>
        <label>
          Shop Name:
          <input 
            type="text" 
            name="shopName"
            value={formData.shopName}
            onChange={handleChange}
            placeholder="Enter your shop name" 
            required 
          />
        </label>
        <label>
          Email Address:
          <input 
            type="email" 
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email" 
            required 
          />
        </label>
        <label>
          Username:
          <input 
            type="text" 
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Choose a username" 
            required 
          />
        </label>
        <label>
          Password:
          <input 
            type="password" 
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter password" 
            required 
          />
        </label>
        <label>
          Confirm Password:
          <input 
            type="password" 
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm password" 
            required 
          />
        </label>
        <button type="submit">Sign Up</button>
        <button type="button" onClick={() => navigate("/")}>Cancel</button>
      </form>
      <p>
        Already have an account? <Link to="/login">Sign In</Link>
      </p>
    </div>
  );
};

export default ShopOwnerSignUp;