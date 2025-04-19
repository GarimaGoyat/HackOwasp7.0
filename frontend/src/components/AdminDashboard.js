import React, { useEffect, useState } from "react";

const AdminDashboard = () => {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    fetch("/api/verification/requests")
      .then((res) => res.json())
      .then((data) => setRequests(data));
  }, []);

  const handleUpdateStatus = async (shopId, status) => {
    const response = await fetch("/api/verification/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ shop_id: shopId, status }),
    });

    if (response.ok) {
      alert("Status updated successfully!");
      setRequests((prev) =>
        prev.map((req) =>
          req.shop_id === shopId ? { ...req, status } : req
        )
      );
    } else {
      alert("Failed to update status.");
    }
  };

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <table>
        <thead>
          <tr>
            <th>Shop Name</th>
            <th>Owner Name</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((req) => (
            <tr key={req.shop_id}>
              <td>{req.shop_name}</td>
              <td>{req.owner_name}</td>
              <td>{req.status}</td>
              <td>
                <button onClick={() => handleUpdateStatus(req.shop_id, "Approved")}>
                  Approve
                </button>
                <button onClick={() => handleUpdateStatus(req.shop_id, "Rejected")}>
                  Reject
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminDashboard;