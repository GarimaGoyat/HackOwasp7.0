// frontend/src/components/admin/AdminHeader.js
import React from 'react';
import { Link } from 'react-router-dom';

const AdminHeader = () => {
  return (
    <div className="admin-header">
      <Link to="/admin" className="logo">LocalMart</Link>
      <div className="user-info">Hello, Admin</div>
    </div>
  );
};

export default AdminHeader;