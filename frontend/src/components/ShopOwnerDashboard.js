import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ShopDetails from "./ShopDetails";
import VerificationRequestPage from "./VerificationRequestPage";
import AddProductPage from "./AddProductPage";
import "./ShopOwnerDashboard.css";

const ShopOwnerDashboard = () => {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("products"); // Track the active tab
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

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
            className={`menu-item ${activeTab === "addProduct" ? "active" : ""}`}
            onClick={() => setActiveTab("addProduct")}
          >
            <span className="icon">➕</span>
            <span className="text">Add Product</span>
          </li>
          <li
            className={`menu-item ${activeTab === "requestVerification" ? "active" : ""}`}
            onClick={() => setActiveTab("requestVerification")}
          >
            <span className="icon">✅</span>
            <span className="text">Request Verification</span>
          </li>
          <li className="menu-item" onClick={() => navigate("/login")}>
            <span className="icon">🚪</span>
            <span className="text">Logout</span>
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {activeTab === "products" && (
          <>
            <div className="dashboard-header">
              <h2>Your Products</h2>
              <button
                className="add-product-btn"
                onClick={() => setActiveTab("addProduct")}
              >
                + Add Product
              </button>
            </div>

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

            <table className="product-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Quantity</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr key={product.id}>
                    <td>{product.name}</td>
                    <td>{product.category}</td>
                    <td>${product.price}</td>
                    <td>{product.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}

        {activeTab === "shopDetails" && <ShopDetails />}
        {activeTab === "addProduct" && <AddProductPage />}
        {activeTab === "requestVerification" && <VerificationRequestPage />}
      </div>
    </div>
  );
};

export default ShopOwnerDashboard;