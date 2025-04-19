import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ShopDetails from "./ShopDetails"; // Import ShopDetails component
import VerificationRequest from "./VerificationRequest"; // Import the VerificationRequest component
import "./ShopOwnerDashboard.css";

const ShopOwnerDashboard = () => {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("products");
  const [showVerificationForm, setShowVerificationForm] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("/api/products", {
          withCredentials: true,
        });
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleEditProduct = (productId) => {
    navigate(`/add-product?id=${productId}`); // Navigate to Add Product page with product ID
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await axios.delete(`/api/products/delete?id=${productId}`, {
          withCredentials: true,
        });
        setProducts(products.filter((product) => product.id !== productId)); // Remove the deleted product from the list
        alert("Product deleted successfully!");
      } catch (error) {
        console.error("Error deleting product:", error);
        alert("Failed to delete product. Please try again.");
      }
    }
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="logo">LocalMart</div>
        <ul className="menu">
          <li
            className={`menu-item ${activeTab === "products" ? "active" : ""}`}
            onClick={() => setActiveTab("products")}
          >
            <span className="icon">📦</span>
            <span className="text">Products</span>
          </li>
          <li
            className={`menu-item ${activeTab === "shopDetails" ? "active" : ""}`}
            onClick={() => setActiveTab("shopDetails")}
          >
            <span className="icon">🏪</span>
            <span className="text">Shop Details</span>
          </li>
          <li
            className="menu-item"
            onClick={() => navigate("/request-verification")} // Navigate to the new page
          >
            <span className="icon">✅</span>
            <span className="text">Request Verification</span>
          </li>
          <li className="menu-item">
            <span className="icon">🚪</span>
            <span className="text">Logout</span>
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {activeTab === "products" && (
          <>
            <div className="top-bar">
              <span className="greeting">Hello, ShopOwner</span>
            </div>

            {/* Dashboard Header */}
            <div className="dashboard-header">
              <h2>Your Products</h2>
              <button
                className="add-product-btn"
                onClick={() => navigate("/add-product")}
              >
                + Add Product
              </button>
            </div>

            {/* Search Bar */}
            <div className="search-bar-container">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                className="search-bar"
                placeholder="Search your products..."
                value={searchQuery}
                onChange={handleSearchChange}
              />
            </div>

            {/* Product Table */}
            <table className="product-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr key={product.id}>
                    <td>{product.name}</td>
                    <td>{product.category}</td>
                    <td>${product.price}</td>
                    <td>{product.quantity}</td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="icon-button"
                          onClick={() => handleEditProduct(product.id)} // Pencil icon handler
                        >
                          ✏️
                        </button>
                        <button
                          className="icon-button"
                          onClick={() => handleDeleteProduct(product.id)} // Dustbin icon handler
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
        {activeTab === "shopDetails" && <ShopDetails />}
        {showVerificationForm && (
          <VerificationRequest onClose={() => setShowVerificationForm(false)} />
        )}
      </div>
    </div>
  );
};

export default ShopOwnerDashboard;