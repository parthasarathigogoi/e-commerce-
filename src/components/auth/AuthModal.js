import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaTimes, FaUser } from 'react-icons/fa';
import { AuthContext } from '../../App';
import './AuthModal.css';

const AuthModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { setIsAuthenticated, setUser } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      password: '',
      confirmPassword: ''
    });
    setError('');
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

    if (!isLogin && formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const endpoint = isLogin ? '/api/login' : '/api/register';
      const payload = isLogin 
        ? { email: formData.email, password: formData.password }
        : { name: formData.name, email: formData.email, password: formData.password };

      // For demo purposes, simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (isLogin) {
        // Log out seller if logged in
        localStorage.removeItem('sellerToken');
        localStorage.removeItem('sellerData');
        
        // Simulate successful login
        localStorage.setItem('token', 'demo-token');
        localStorage.setItem('userId', 'demo-user');
        setIsAuthenticated(true);
        setUser({ id: 'demo-user' });
        onClose();
        resetForm();
        // Redirect to homepage
        navigate('/');
      } else {
        // Simulate successful registration
        setIsLogin(true);
        setFormData({
          name: '',
          email: formData.email,
          password: '',
          confirmPassword: ''
        });
        setError('Registration successful! Please log in.');
      }
    } catch (err) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  // For demo purposes
  const handleDemoLogin = () => {
    setLoading(true);
    setTimeout(() => {
      // Log out seller if logged in
      localStorage.removeItem('sellerToken');
      localStorage.removeItem('sellerData');
      
      localStorage.setItem('token', 'demo-token');
      localStorage.setItem('userId', 'demo-user');
      setIsAuthenticated(true);
      setUser({ id: 'demo-user' });
      onClose();
      resetForm();
      setLoading(false);
      // Redirect to homepage
      navigate('/');
    }, 1000);
  };

  if (!isOpen) return null;

  return (
    <div className="auth-modal-overlay" onClick={onClose}>
      <div className="auth-modal" onClick={e => e.stopPropagation()}>
        <button className="close-modal" onClick={onClose}>
          <FaTimes />
        </button>
        
        <div className="auth-header">
          <h2>{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
          <p>{isLogin ? 'Sign in to continue shopping' : 'Join our community of shoppers'}</p>
        </div>

        <div className="auth-tabs">
          <button 
            className={`auth-tab ${isLogin ? 'active' : ''}`}
            onClick={() => {
              setIsLogin(true);
              setError('');
              resetForm();
            }}
          >
            Sign In
          </button>
          <button 
            className={`auth-tab ${!isLogin ? 'active' : ''}`}
            onClick={() => {
              setIsLogin(false);
              setError('');
              resetForm();
            }}
          >
            Sign Up
          </button>
        </div>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          {!isLogin && (
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
            className="auth-button"
            disabled={loading}
          >
            {loading ? (isLogin ? 'Signing in...' : 'Creating Account...') : (isLogin ? 'Sign In' : 'Create Account')}
          </button>

          {isLogin && (
            <button 
              type="button" 
              className="demo-button"
              onClick={handleDemoLogin}
              disabled={loading}
            >
              Demo Login
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default AuthModal; 