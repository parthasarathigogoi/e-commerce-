import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser, FaCog, FaStore, FaSignOutAlt } from 'react-icons/fa';
import { useSeller } from '../../context/SellerContext';
import './ProfileDropdown.css';

const ProfileDropdown = ({ isOpen, onClose, onLogout }) => {
  const navigate = useNavigate();
  const { isSellerAuthenticated } = useSeller();
  
  if (!isOpen) return null;

  const handleSellerDashboardClick = (e) => {
    e.preventDefault();
    onClose();
    navigate('/seller/dashboard');
  };

  const handleProfileClick = (e) => {
    e.preventDefault();
    onClose();
    navigate('/profile');
  };

  const handleSettingsClick = (e) => {
    e.preventDefault();
    onClose();
    navigate('/settings');
  };

  const handleLogoutClick = () => {
    onClose();
    onLogout();
  };

  return (
    <>
      <div className="profile-dropdown-overlay" onClick={onClose} />
      <div className="profile-dropdown">
        <div className="dropdown-header">
          <FaUser className="profile-icon" />
          <span>My Account</span>
        </div>
        
        <div className="dropdown-divider" />
        
        <a href="/profile" className="dropdown-item" onClick={handleProfileClick}>
          <FaUser className="dropdown-icon" />
          <span>Profile</span>
        </a>
        
        <a href="/settings" className="dropdown-item" onClick={handleSettingsClick}>
          <FaCog className="dropdown-icon" />
          <span>Settings</span>
        </a>
        
        {isSellerAuthenticated && (
          <a href="/seller/dashboard" className="dropdown-item" onClick={handleSellerDashboardClick}>
            <FaStore className="dropdown-icon" />
            <span>Seller Dashboard</span>
          </a>
        )}
        
        <div className="dropdown-divider" />
        
        <button className="dropdown-item logout-item" onClick={handleLogoutClick}>
          <FaSignOutAlt className="dropdown-icon" />
          <span>Logout</span>
        </button>
      </div>
    </>
  );
};

export default ProfileDropdown; 