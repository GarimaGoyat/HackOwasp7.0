// frontend/src/components/admin/ShopVerification.js
import React, { useState, useEffect } from 'react';

const DocumentViewer = ({ documents, onClose }) => {
  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <div className="modal-header">
          <h3 className="modal-title">Shop Documents</h3>
          <button className="close-button" onClick={onClose}>&times;</button>
        </div>
        <div className="modal-body">
          <ul className="documents-list">
            {documents.map((doc, index) => (
              <li key={index} className="document-item">
                <span className="document-icon">📄</span>
                <span className="document-name">{doc.name}</span>
                <div className="document-actions">
                  <button className="action-btn action-btn-view">View</button>
                  <button className="action-btn action-btn-view">Download</button>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="form-actions">
          <button className="btn btn-secondary" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

const ShopVerification = () => {
  const [verificationRequests, setVerificationRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDocuments, setShowDocuments] = useState(false);
  const [selectedDocuments, setSelectedDocuments] = useState([]);

  useEffect(() => {
    const fetchVerificationRequests = async () => {
      try {
        const response = await fetch('/api/admin/verification-requests');
        if (!response.ok) {
          throw new Error('Failed to fetch verification requests');
        }
        const data = await response.json();
        setVerificationRequests(data);
      } catch (error) {
        console.error('Error fetching verification requests:', error);
        // Set sample data for demonstration if API fails
        setVerificationRequests([
          {
            id: 1,
            shopName: 'Green Valley Organic Store',
            category: 'Food & Groceries',
            requestDate: '2025-04-25',
            documents: [
              { id: 1, name: 'Business License.pdf' },
              { id: 2, name: 'Tax Registration Certificate.pdf' }
            ],
            status: 'Pending'
          },
          {
            id: 2,
            shopName: 'Handmade Treasures',
            category: 'Crafts & Arts',
            requestDate: '2025-04-24',
            documents: [
              { id: 3, name: 'Business License.pdf' },
              { id: 4, name: 'ID Proof.pdf' }
            ],
            status: 'Pending'
          },
          {
            id: 3,
            shopName: 'Local Farm Produce',
            category: 'Food & Groceries',
            requestDate: '2025-04-23',
            documents: [
              { id: 5, name: 'Business License.pdf' },
              { id: 6, name: 'Address Proof.pdf' }
            ],
            status: 'Pending'
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchVerificationRequests();
  }, []);

  const handleViewDocuments = (documents) => {
    setSelectedDocuments(documents);
    setShowDocuments(true);
  };

  const handleApprove = async (shopId) => {
    try {
      const response = await fetch(`/api/admin/approve-shop/${shopId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to approve shop');
      }

      // Update the local state
      setVerificationRequests(
        verificationRequests.map(req => 
          req.id === shopId ? {...req, status: 'Approved'} : req
        )
      );
    } catch (error) {
      console.error('Error approving shop:', error);
      alert('Failed to approve shop. Please try again.');
    }
  };

  const handleReject = async (shopId) => {
    try {
      const response = await fetch(`/api/admin/reject-shop/${shopId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to reject shop');
      }

      // Update the local state
      setVerificationRequests(
        verificationRequests.map(req => 
          req.id === shopId ? {...req, status: 'Rejected'} : req
        )
      );
    } catch (error) {
      console.error('Error rejecting shop:', error);
      alert('Failed to reject shop. Please try again.');
    }
  };

  if (loading) {
    return <div className="loading-spinner">Loading verification requests...</div>;
  }

  return (
    <div>
      <div className="content-header">
        <h1 className="content-title">Shop Verification Requests</h1>
      </div>
      
      <div className="card">
        <table className="table">
          <thead>
            <tr>
              <th>Shop Name</th>
              <th>Category</th>
              <th>Date Requested</th>
              <th>Documents</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {verificationRequests.map(request => (
              <tr key={request.id}>
                <td>{request.shopName}</td>
                <td>{request.category}</td>
                <td>{new Date(request.requestDate).toLocaleDateString()}</td>
                <td>
                  <button 
                    className="action-btn action-btn-view"
                    onClick={() => handleViewDocuments(request.documents)}
                  >
                    View Docs
                  </button>
                </td>
                <td>
                  <span className={`badge badge-${
                    request.status === 'Pending' ? 'warning' : 
                    request.status === 'Approved' ? 'success' : 'danger'
                  }`}>
                    {request.status}
                  </span>
                </td>
                <td>
                  <button 
                    className="action-btn action-btn-approve"
                    onClick={() => handleApprove(request.id)}
                    disabled={request.status !== 'Pending'}
                  >
                    Approve
                  </button>
                  <button 
                    className="action-btn action-btn-reject"
                    onClick={() => handleReject(request.id)}
                    disabled={request.status !== 'Pending'}
                  >
                    Reject
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showDocuments && (
        <DocumentViewer 
          documents={selectedDocuments} 
          onClose={() => setShowDocuments(false)} 
        />
      )}
    </div>
  );
};

export default ShopVerification;