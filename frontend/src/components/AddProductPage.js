import React, { useState } from "react";
import axios from "axios";
import "./AddProductPage.css";

const AddProductPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    quantity: "",
    image: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      await axios.post("/api/shopkeeper/add-product", formData, {
        withCredentials: true,
      });
      setSuccess("Product added successfully!");
      setFormData({ name: "", category: "", price: "", quantity: "", image: "" });
    } catch (err) {
      setError("Failed to add product. Please try again.");
    }
  };

  return (
    <div className="add-product-container">
      <h2>Add New Product</h2>
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}
      <form onSubmit={handleSubmit}>
        <label>
          Product Name:
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Category:
          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Price:
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Quantity:
          <input
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Image URL:
          <input
            type="text"
            name="image"
            value={formData.image}
            onChange={handleChange}
          />
        </label>
        <div className="form-buttons">
          <button type="submit" className="save-button">
            Save
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

export default AddProductPage;