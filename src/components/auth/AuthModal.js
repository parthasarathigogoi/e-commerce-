import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaTimes, FaUser } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import './AuthModal.css';

const AuthModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      password: ''
    });
    setError('');
    setLoading(false);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      
      const { success, message } = await login(formData.email, formData.password);
      
      if (success) {
        onClose();
        resetForm();
        // Redirect to homepage
        navigate('/');
      } else {
        setError(message || 'Login failed. Please check your credentials.');
      }
    } catch (error) {
      setError('An error occurred during login. Please try again.');
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return;
    }
    
    // Basic password validation
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      
      const { success, message } = await register(formData.name, formData.email, formData.password);
      
      if (success) {
        onClose();
        resetForm();
        navigate('/');
      } else {
        setError(message || 'Registration failed. Please try again.');
      }
    } catch (error) {
      setError('An error occurred during registration. Please try again.');
      console.error('Registration error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-modal-overlay" onClick={onClose}>
      <div className="auth-modal" onClick={e => e.stopPropagation()}>
        <div className="auth-header">
          <h2>{isLoginMode ? 'Login' : 'Create Account'}</h2>
          <button className="close-button" onClick={onClose}>
            <FaTimes />
          </button>
        </div>
        
        <div className="auth-tabs">
          <button 
            className={`auth-tab ${isLoginMode ? 'active' : ''}`}
            onClick={() => setIsLoginMode(true)}
          >
            Login
          </button>
          <button 
            className={`auth-tab ${!isLoginMode ? 'active' : ''}`}
            onClick={() => setIsLoginMode(false)}
          >
            Register
          </button>
        </div>
        
        <form className="auth-form" onSubmit={isLoginMode ? handleLogin : handleRegister}>
          {error && <div className="auth-error">{error}</div>}
          
          {!isLoginMode && (
            <div className="form-group">
              <div className="input-icon">
                <FaUser className="icon" />
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
            </div>
          )}
          
          <div className="form-group">
            <div className="input-icon">
              <FaEnvelope className="icon" />
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
          </div>
          
          <div className="form-group">
            <div className="input-icon">
              <FaLock className="icon" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
              />
              <button 
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>
          
          {isLoginMode && (
            <div className="forgot-password">
              <a href="#forgot-password">Forgot Password?</a>
            </div>
          )}
          
          <button 
            type="submit" 
            className="auth-button"
            disabled={loading}
          >
            {loading ? 'Processing...' : isLoginMode ? 'Login' : 'Create Account'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AuthModal; 