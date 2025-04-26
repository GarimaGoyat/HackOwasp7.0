import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import ShopOwnerSignUp from './components/ShopOwnerSignUp';
import ShopOwnerDashboard from './components/ShopOwnerDashboard';
import LandingPage from './components/LandingPage';
import AddProductPage from './components/AddProductPage';
import VerificationRequestPage from './components/VerificationRequestPage';
import AdminLayout from './components/admin/AdminLayout';
import AdminDashboard from './components/admin/AdminDashboard';
import ShopVerification from './components/admin/ShopVerification';
import BlockchainVerification from './components/admin/BlockchainVerification';
import ComplaintsManager from './components/admin/ComplaintsManager';
import PlatformStats from './components/admin/PlatformStats';

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<ShopOwnerSignUp />} />
        
        {/* Shop owner routes */}
        <Route path="/dashboard" element={<ShopOwnerDashboard />} />
        <Route path="/add-product" element={<AddProductPage />} />
        <Route path="/request-verification" element={<VerificationRequestPage />} />
        
        {/* Admin routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="shop-verification" element={<ShopVerification />} />
          <Route path="blockchain" element={<BlockchainVerification />} />
          <Route path="complaints" element={<ComplaintsManager />} />
          <Route path="stats" element={<PlatformStats />} />
          {/* Add other admin routes as needed */}
        </Route>
      </Routes>
    </Router>
  );
};

export default App;