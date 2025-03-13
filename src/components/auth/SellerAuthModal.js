import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaTimes, FaUser, FaStore, FaPhone } from 'react-icons/fa';
import { useSeller } from '../../context/SellerContext';
import './SellerAuthModal.css';

const SellerAuthModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const { loginSeller, registerSeller } = useSeller();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    storeName: '',
    password: '',
    confirmPassword: ''
  });

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      storeName: '',
      password: '',
      confirmPassword: ''
    });
    setError('');
    setSuccess('');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Check if customer is logged in
    const customerToken = localStorage.getItem('token');
    if (customerToken) {
      // Log out customer before proceeding
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
    }

    if (!isLogin) {
      // Validation for registration
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        setLoading(false);
        return;
      }

      if (formData.password.length < 6) {
        setError('Password must be at least 6 characters');
        setLoading(false);
        return;
      }

      if (!formData.name || !formData.email || !formData.phone || !formData.storeName) {
        setError('All fields are required');
        setLoading(false);
        return;
      }
    }

    try {
      if (isLogin) {
        // Login logic
        const result = await loginSeller(formData.email, formData.password);
        
        if (result.success) {
          onClose();
          resetForm();
          // Redirect to seller dashboard
          navigate('/seller/dashboard');
        } else {
          setError(result.error || 'Login failed');
        }
      } else {
        // Registration logic
        const result = await registerSeller(
          formData.name,
          formData.email,
          formData.password,
          formData.storeName,
          formData.phone
        );
        
        if (result.success) {
          setSuccess('Registration successful! Redirecting to dashboard...');
          setTimeout(() => {
            onClose();
            navigate('/seller/dashboard');
          }, 1500);
        } else {
          setError(result.error || 'Registration failed');
        }
      }
    } catch (err) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="auth-modal-overlay" onClick={onClose}>
      <div className="auth-modal seller-auth-modal" onClick={e => e.stopPropagation()}>
        <button className="close-modal" onClick={onClose}>
          <FaTimes />
        </button>
        
        <div className="auth-header">
          <div className="seller-icon">
            <FaStore />
          </div>
          <h2>{isLogin ? 'Seller Login' : 'Become a Seller'}</h2>
          <p>{isLogin ? 'Sign in to manage your products' : 'Create your seller account to start selling'}</p>
        </div>

        <div className="auth-tabs">
          <button 
            className={`auth-tab ${isLogin ? 'active' : ''}`}
            onClick={() => {
              setIsLogin(true);
              setError('');
              setSuccess('');
              resetForm();
            }}
          >
            Login
          </button>
          <button 
            className={`auth-tab ${!isLogin ? 'active' : ''}`}
            onClick={() => {
              setIsLogin(false);
              setError('');
              setSuccess('');
              resetForm();
            }}
          >
            Register
          </button>
        </div>

        {error && <div className="auth-error">{error}</div>}
        {success && <div className="auth-success">{success}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          {!isLogin && (
            <>
              <div className="form-group">
                <div className="input-group">
                  <FaUser className="input-icon" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Full Name"
                    required={!isLogin}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-group">
                <div className="input-group">
                  <FaStore className="input-icon" />
                  <input
                    type="text"
                    name="storeName"
                    value={formData.storeName}
                    onChange={handleChange}
                    placeholder="Store Name"
                    required={!isLogin}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-group">
                <div className="input-group">
                  <FaPhone className="input-icon" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Phone Number"
                    required={!isLogin}
                    className="form-input"
                  />
                </div>
              </div>
            </>
          )}

          <div className="form-group">
            <div className="input-group">
              <FaEnvelope className="input-icon" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                required
                className="form-input"
              />
            </div>
          </div>

          <div className="form-group">
            <div className="input-group">
              <FaLock className="input-icon" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                required
                className="form-input"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          {!isLogin && (
            <div className="form-group">
              <div className="input-group">
                <FaLock className="input-icon" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm Password"
                  required={!isLogin}
                  className="form-input"
                />
              </div>
            </div>
          )}

          <button 
            type="submit" 
            className="auth-button seller-auth-button"
            disabled={loading}
          >
            {loading ? (isLogin ? 'Signing in...' : 'Creating Account...') : (isLogin ? 'Sign In' : 'Create Account')}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SellerAuthModal;