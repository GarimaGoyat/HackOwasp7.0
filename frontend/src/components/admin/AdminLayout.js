// frontend/src/components/admin/AdminLayout.js
import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminHeader from './AdminHeader';
import AdminNavigation from './AdminNavigation';
import '../../styles/admin.css'; // Import the CSS file

const AdminLayout = () => {
  return (
    <div className="admin-container">
      <AdminHeader />
      <div className="admin-content-wrapper">
        <AdminNavigation />
        <div className="admin-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;