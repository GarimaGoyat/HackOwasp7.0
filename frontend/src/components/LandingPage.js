import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import axios from "axios"; // Import axios for API calls
import "./LandingPage.css";

const LandingPage = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState([]);
  const navigate = useNavigate(); // Initialize navigate

  const categories = ["All", "Food", "Electronics", "Farmers", "Clothing", "Stationery", "Home Decor", "Accessories"];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("/api/products");
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = products.filter((product) => {
    const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleProductClick = (productId) => {
    console.log(`Product clicked: ${productId}`);
    // Add navigation or other logic here
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleWelcomeBoxClick = () => {
    console.log("Welcome Box clicked");
    // Add navigation or other logic here
  };

  const handleVerifiedBoxClick = () => {
    console.log("Blockchain Verified Sellers Box clicked");
    // Add navigation or other logic here
  };

  return (
    <div className="landing-page">
      {/* Top Navbar */}
      <nav className="navbar">
        <div className="navbar-left">
          <span className="logo">LocalMart</span>
        </div>
        <div className="navbar-center">
          <div className="search-bar-container">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              className="search-bar"
              placeholder="Search products, shops..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <div className="navbar-right">
          {/* Navigate to the signup page */}
          <button className="auth-btn" onClick={() => navigate("/signup")}>
            Login | Sign Up
          </button>
        </div>
      </nav>

      {/* Horizontal Category Buttons */}
      <div className="category-scroll">
        {categories.map((category) => (
          <button
            key={category}
            className={`category-btn ${selectedCategory === category ? "active" : ""}`}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Welcome Box */}
      <button className="welcome-box" onClick={handleWelcomeBoxClick}>
        <span className="emoji">👋</span>
        <h2>Welcome to LocalMart</h2>
        <p>
          Find nearby shops with real-time info. Visit only verified and trusted
          stores.
        </p>
      </button>

      {/* Blockchain Verified Sellers Box */}
      <button className="verified-box" onClick={handleVerifiedBoxClick}>
        <span className="emoji">✅</span>
        <h3>Verified Sellers</h3> {/* Updated text */}
        <p>
          Our verification process ensures all sellers with ✅ badge are
          authenticated and approved by the admin.
        </p>
      </button>

      {/* Product Grid */}
      <div className="product-grid">
        {filteredProducts.map((product) => (
          <button
            key={product.id}
            className="product-card"
            onClick={() => handleProductClick(product.id)}
          >
            <div className="product-image">
              <img
                src={product.image || "https://via.placeholder.com/150"}
                alt={product.name}
              />
            </div>
            <div className="product-info">
              <h3>{product.name}</h3>
              <p>Price: ${product.price}</p>
              <p>Category: {product.category}</p>
              <p>Quantity: {product.quantity}</p>
              <p>Shop Address: {product.shopAddress}</p> {/* Add this line */}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default LandingPage;
