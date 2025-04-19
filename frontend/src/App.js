import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './components/LoginPage'; // Ensure this file exists
import ShopOwnerSignUp from './components/ShopOwnerSignUp'; // Ensure this file exists
import ShopOwnerDashboard from './components/ShopOwnerDashboard'; // Ensure this file exists
import LandingPage from './components/LandingPage'; // Ensure this file exists
import AddProductPage from './components/AddProductPage'; // Add this import for the Add Product page
import VerificationRequestPage from './components/VerificationRequestPage'; // Add this import for the Verification Request page

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<ShopOwnerDashboard />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<ShopOwnerSignUp />} />
        <Route path="/add-product" element={<AddProductPage />} /> {/* Add this route */}
        <Route path="/request-verification" element={<VerificationRequestPage />} /> {/* Add this route */}
      </Routes>
    </Router>
  );
};

export default App;