import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '../../context/AdminContext';
import './AdminPasswordModal.css';

const AdminPasswordModal = ({ isOpen, onClose }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { checkAdminPassword } = useAdmin();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!password) {
      setError('Please enter the admin password');
      return;
    }

    if (checkAdminPassword(password)) {
      // Password is correct, navigate to admin auth page
      navigate('/admin/auth');
      onClose();
    } else {
      setError('Invalid admin password');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="admin-password-modal-overlay">
      <div className="admin-password-modal">
        <div className="admin-password-modal-header">
          <h2>Admin Access</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        <div className="admin-password-modal-body">
          <p>Please enter the admin password to continue</p>
          {error && <div className="error-message">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                className="password-input"
              />
            </div>
            <button type="submit" className="submit-button">
              Continue
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminPasswordModal; 