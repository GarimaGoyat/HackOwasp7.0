import React, { useState } from "react";
import "./VerificationRequestPage.css";

const VerificationRequestPage = () => {
  const [shopName, setShopName] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [address, setAddress] = useState("");
  const [documentUrl, setDocumentUrl] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage("");
    setErrorMessage("");

    const requestData = {
      shop_name: shopName,
      owner_name: ownerName,
      address,
      document_url: documentUrl,
    };

    try {
      const response = await fetch("/api/verification/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData),
      });

      if (response.ok) {
        setSuccessMessage("Verification request submitted successfully!");
        setShopName("");
        setOwnerName("");
        setAddress("");
        setDocumentUrl("");
      } else {
        setErrorMessage("Failed to submit verification request. Please try again.");
      }
    } catch (error) {
      setErrorMessage("An error occurred. Please try again.");
    }
  };

  return (
    <div className="verification-page-container">
      <h1>Request Shop Verification</h1>
      {successMessage && <div className="success-message">{successMessage}</div>}
      {errorMessage && <div className="error-message">{errorMessage}</div>}
      <form className="verification-form" onSubmit={handleSubmit}>
        <label>
          Shop Name:
          <input
            type="text"
            value={shopName}
            onChange={(e) => setShopName(e.target.value)}
            placeholder="Enter your shop name"
            required
          />
        </label>
        <label>
          Owner Name:
          <input
            type="text"
            value={ownerName}
            onChange={(e) => setOwnerName(e.target.value)}
            placeholder="Enter your name"
            required
          />
        </label>
        <label>
          Address:
          <textarea
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Enter your shop address"
            required
          />
        </label>
        <label>
          Document URL:
          <input
            type="text"
            value={documentUrl}
            onChange={(e) => setDocumentUrl(e.target.value)}
            placeholder="Provide a document URL for verification"
            required
          />
        </label>
        <button type="submit" className="submit-button">
          Submit Request
        </button>
      </form>
    </div>
  );
};

export default VerificationRequestPage;