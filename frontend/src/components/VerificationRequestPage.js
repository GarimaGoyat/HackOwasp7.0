import React, { useState } from "react";
import axios from "axios";
import "./VerificationRequest.css";

const VerificationRequestPage = () => {
  const [formData, setFormData] = useState({
    businessName: "",
    address: "",
    documentUrl: "",
  });
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      await axios.post("/api/verification/request", formData, {
        withCredentials: true,
      });
      setSuccess("Verification request submitted successfully!");
      setFormData({ businessName: "", address: "", documentUrl: "" });
    } catch (err) {
      setError("Failed to submit verification request. Please try again.");
    }
  };

  return (
    <div className="verification-request-container">
      <h2>Request Verification</h2>
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}
      <form onSubmit={handleSubmit}>
        <label>
          Business Name:
          <input
            type="text"
            name="businessName"
            value={formData.businessName}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Address:
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Document URL:
          <input
            type="text"
            name="documentUrl"
            value={formData.documentUrl}
            onChange={handleChange}
            required
          />
        </label>
        <div className="form-buttons">
          <button type="submit" className="submit-button">
            Submit
          </button>
          <button
            type="button"
            className="cancel-button"
            onClick={() => (window.location.href = "/dashboard")}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default VerificationRequestPage;