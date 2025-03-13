import React from 'react';
import { Link } from 'react-router-dom';
import { FaUser, FaCog, FaStore, FaSignOutAlt } from 'react-icons/fa';
import './ProfileDropdown.css';

const ProfileDropdown = ({ isOpen, onClose, onLogout }) => {
  if (!isOpen) return null;

  return (
    <>
      <div className="profile-dropdown-overlay" onClick={onClose} />
      <div className="profile-dropdown">
        <div className="dropdown-header">
          <FaUser className="profile-icon" />
          <span>My Account</span>
        </div>
        
        <div className="dropdown-divider" />
        
        <Link to="/profile" className="dropdown-item" onClick={onClose}>
          <FaUser className="dropdown-icon" />
          <span>Profile</span>
        </Link>
        
        <Link to="/settings" className="dropdown-item" onClick={onClose}>
          <FaCog className="dropdown-icon" />
          <span>Settings</span>
        </Link>
        
        <Link to="/seller" className="dropdown-item" onClick={onClose}>
          <FaStore className="dropdown-icon" />
          <span>Seller Dashboard</span>
        </Link>
        
        <div className="dropdown-divider" />
        
        <button className="dropdown-item logout-item" onClick={onLogout}>
          <FaSignOutAlt className="dropdown-icon" />
          <span>Logout</span>
        </button>
      </div>
    </>
  );
};

export default ProfileDropdown; 