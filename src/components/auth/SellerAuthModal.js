import React, { useState } from 'react';
import { FaTimes, FaStore, FaUser, FaLock, FaEnvelope, FaPhone, FaBuilding } from 'react-icons/fa';
import { useSeller } from '../../context/SellerContext';
import './AuthModal.css';

const SellerAuthModal = ({ isOpen, onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    shopName: '',
    phone: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState('');

  const { handleSellerLogin, registerSeller } = useSeller();

  const validateForm = () => {
    const newErrors = {};
    
    if (!isLogin && !formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (!isLogin && !formData.shopName.trim()) {
      newErrors.shopName = 'Shop name is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    
    // Clear submit messages
    setSubmitError('');
    setSubmitSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    setSubmitError('');
    setSubmitSuccess('');
    
    try {
      if (isLogin) {
        // Handle login
        const result = await handleSellerLogin(formData.email, formData.password);
        
        if (result.success) {
          setSubmitSuccess('Login successful!');
          setTimeout(() => {
            onClose();
          }, 1000);
        } else {
          setSubmitError(result.error || 'Login failed. Please try again.');
        }
      } else {
        // Handle registration
        const result = await registerSeller(
          formData.name,
          formData.email,
          formData.password,
          formData.shopName,
          formData.phone
        );
        
        if (result.success) {
          setSubmitSuccess('Registration successful!');
          setTimeout(() => {
            onClose();
          }, 1000);
        } else {
          setSubmitError(result.error || 'Registration failed. Please try again.');
        }
      }
    } catch (error) {
      console.error('Auth error:', error);
      setSubmitError('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setErrors({});
    setSubmitError('');
    setSubmitSuccess('');
  };

  if (!isOpen) return null;

  return (
    <div className="auth-modal-overlay">
      <div className="auth-modal">
        <button className="close-button" onClick={onClose}>
          <FaTimes />
        </button>
        
        <div className="auth-header">
          <FaStore className="auth-icon" />
          <h2>{isLogin ? 'Seller Login' : 'Become a Seller'}</h2>
        </div>
        
        {submitError && (
          <div className="auth-error-message">
            {submitError}
          </div>
        )}
        
        {submitSuccess && (
          <div className="auth-success-message">
            {submitSuccess}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="form-group">
              <label>
                <FaUser className="input-icon" />
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={handleChange}
                />
              </label>
              {errors.name && <span className="error-text">{errors.name}</span>}
            </div>
          )}
          
          <div className="form-group">
            <label>
              <FaEnvelope className="input-icon" />
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
              />
            </label>
            {errors.email && <span className="error-text">{errors.email}</span>}
          </div>
          
          <div className="form-group">
            <label>
              <FaLock className="input-icon" />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
              />
            </label>
            {errors.password && <span className="error-text">{errors.password}</span>}
          </div>
          
          {!isLogin && (
            <>
              <div className="form-group">
                <label>
                  <FaBuilding className="input-icon" />
                  <input
                    type="text"
                    name="shopName"
                    placeholder="Shop Name"
                    value={formData.shopName}
                    onChange={handleChange}
                  />
                </label>
                {errors.shopName && <span className="error-text">{errors.shopName}</span>}
              </div>
              
              <div className="form-group">
                <label>
                  <FaPhone className="input-icon" />
                  <input
                    type="text"
                    name="phone"
                    placeholder="Phone Number (Optional)"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </label>
              </div>
            </>
          )}
          
          <button 
            type="submit" 
            className="auth-submit-button"
            disabled={isSubmitting}
          >
            {isSubmitting 
              ? 'Processing...' 
              : isLogin 
                ? 'Login' 
                : 'Register'
            }
          </button>
        </form>
        
        <div className="auth-footer">
          <p>
            {isLogin 
              ? "Don't have a seller account?" 
              : "Already have a seller account?"
            }
            <button 
              type="button"
              className="toggle-auth-button"
              onClick={toggleAuthMode}
            >
              {isLogin ? 'Register' : 'Login'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SellerAuthModal;