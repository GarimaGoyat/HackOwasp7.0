// frontend/src/components/admin/AdminDashboard.js
import React, { useState, useEffect } from 'react';

const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    stats: {
      totalShops: 0,
      pendingVerifications: 0,
      totalProducts: 0,
      openComplaints: 0
    },
    recentActivities: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch('/api/admin/dashboard');
        if (!response.ok) {
          throw new Error('Failed to fetch dashboard data');
        }
        const data = await response.json();
        setDashboardData(data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        // Set sample data for demonstration if API fails
        setDashboardData({
          stats: {
            totalShops: 156,
            pendingVerifications: 28,
            totalProducts: 1245,
            openComplaints: 18
          },
          recentActivities: [
            {
              id: 1,
              activity: 'Shop Verification Request',
              shop: 'Green Valley Organic Store',
              date: '2025-04-25',
              status: 'Pending'
            },
            {
              id: 2,
              activity: 'Complaint Filed',
              shop: 'Urban Crafts Co.',
              date: '2025-04-24',
              status: 'Unresolved'
            },
            {
              id: 3,
              activity: 'Blockchain Verification',
              shop: 'Fresh Harvest Produce',
              date: '2025-04-23',
              status: 'Completed'
            },
            {
              id: 4,
              activity: 'New Shop Registration',
              shop: 'Artisan Bakery',
              date: '2025-04-23',
              status: 'Approved'
            }
          ]
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <div className="loading-spinner">Loading dashboard data...</div>;
  }

  const { stats, recentActivities } = dashboardData;

  return (
    <div>
      <div className="content-header">
        <h1 className="content-title">Dashboard</h1>
      </div>
      
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">{stats.totalShops}</div>
          <div className="stat-label">Total Shops</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.pendingVerifications}</div>
          <div className="stat-label">Pending Verifications</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.totalProducts}</div>
          <div className="stat-label">Total Products</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.openComplaints}</div>
          <div className="stat-label">Open Complaints</div>
        </div>
      </div>
      
      <div className="card">
        <h2 className="card-header">Recent Activities</h2>
        <table className="table">
          <thead>
            <tr>
              <th>Activity</th>
              <th>Shop</th>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {recentActivities.map(activity => (
              <tr key={activity.id}>
                <td>{activity.activity}</td>
                <td>{activity.shop}</td>
                <td>{new Date(activity.date).toLocaleDateString()}</td>
                <td>
                  <span className={`badge badge-${
                    activity.status === 'Pending' ? 'warning' : 
                    activity.status === 'Unresolved' ? 'danger' :
                    'success'
                  }`}>
                    {activity.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;