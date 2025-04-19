import React, { useState, useEffect } from "react";
import axios from "axios";
import "./ShopDetails.css";

const ShopDetails = () => {
  const [shopDetails, setShopDetails] = useState({
    shopName: "",
    email: "",
    phone: "",
    address: "",
    logoUrl: "",
  });
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchShopDetails = async () => {
      try {
        const response = await axios.get("/api/shop/details", { withCredentials: true });
        setShopDetails(response.data);
      } catch (error) {
        console.error("Error fetching shop details:", error);
      }
    };

    fetchShopDetails();
  }, []);

  const handleChange = (e) => {
    setShopDetails({ ...shopDetails, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put("/api/shop/details", shopDetails, { withCredentials: true });
      setMessage("Shop details updated successfully!");
    } catch (error) {
      console.error("Error updating shop details:", error);
      setMessage("Failed to update shop details.");
    }
  };

  return (
    <div className="shop-details-container">
      <h2>Shop Details</h2>
      {message && <div className="message">{message}</div>}
      <form onSubmit={handleSubmit}>
        <label>
          Shop Name:
          <input
            type="text"
            name="shopName"
            value={shopDetails.shopName}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Email:
          <input
            type="email"
            name="email"
            value={shopDetails.email}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Phone:
          <input
            type="text"
            name="phone"
            value={shopDetails.phone}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Address:
          <textarea
            name="address"
            value={shopDetails.address}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Logo URL:
          <input
            type="text"
            name="logoUrl"
            value={shopDetails.logoUrl}
            onChange={handleChange}
          />
        </label>
        <button type="submit">Save</button>
      </form>
    </div>
  );
};

export default ShopDetails;