// frontend/src/components/admin/AdminNavigation.js
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

const AdminNavigation = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Add logout logic here (clear localStorage, cookies, etc.)
    // Then navigate to login page
    localStorage.removeItem('authToken');
    navigate('/login');
  };

  return (
    <div className="admin-sidebar">
      <NavLink to="/admin/dashboard" className={({ isActive }) => 
        isActive ? "sidebar-item active" : "sidebar-item"}>
        <i>📊</i> Dashboard
      </NavLink>
      <NavLink to="/admin/shop-verification" className={({ isActive }) => 
        isActive ? "sidebar-item active" : "sidebar-item"}>
        <i>📋</i> Shop Verification
      </NavLink>
      <NavLink to="/admin/blockchain" className={({ isActive }) => 
        isActive ? "sidebar-item active" : "sidebar-item"}>
        <i>🔗</i> Blockchain Verification
      </NavLink>
      <NavLink to="/admin/complaints" className={({ isActive }) => 
        isActive ? "sidebar-item active" : "sidebar-item"}>
        <i>🛑</i> Handle Complaints
      </NavLink>
      <NavLink to="/admin/stats" className={({ isActive }) => 
        isActive ? "sidebar-item active" : "sidebar-item"}>
        <i>📈</i> Platform Stats
      </NavLink>
      <NavLink to="/admin/sellers" className={({ isActive }) => 
        isActive ? "sidebar-item active" : "sidebar-item"}>
        <i>👥</i> Manage Sellers
      </NavLink>
      <NavLink to="/admin/categories" className={({ isActive }) => 
        isActive ? "sidebar-item active" : "sidebar-item"}>
        <i>🏷️</i> Categories
      </NavLink>
      <NavLink to="/admin/settings" className={({ isActive }) => 
        isActive ? "sidebar-item active" : "sidebar-item"}>
        <i>⚙️</i> Settings
      </NavLink>
      <div className="sidebar-item logout" onClick={handleLogout}>
        <i>🚪</i> Logout
      </div>
    </div>
  );
};

export default AdminNavigation;