import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '../../context/AdminContext';
import './AdminAuth.css';

const AdminAuth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [step, setStep] = useState(1); // 1: Email, 2: Verification, 3: Registration
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    verificationCode: ''
  });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState('');
  
  const { 
    isAdminAuthenticated, 
    loginAdmin, 
    initiateAdminRegistration, 
    registerAdmin 
  } = useAdmin();
  
  const navigate = useNavigate();
  
  // Redirect if already authenticated
  useEffect(() => {
    if (isAdminAuthenticated) {
      navigate('/admin/dashboard');
    }
  }, [isAdminAuthenticated, navigate]);
  
  const validateEmail = (email) => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
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
  };
  
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setSuccess('');
    
    // Validate form
    let formErrors = {};
    
    if (!formData.email) {
      formErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      formErrors.email = 'Please enter a valid email';
    }
    
    if (!formData.password) {
      formErrors.password = 'Password is required';
    }
    
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }
    
    // Submit login
    const result = await loginAdmin(formData.email, formData.password);
    
    if (result.success) {
      setSuccess('Login successful! Redirecting...');
      setTimeout(() => {
        navigate('/admin/dashboard');
      }, 1500);
    } else {
      setErrors({ general: result.error || 'Login failed' });
    }
  };
  
  const handleInitiateRegistration = async (e) => {
    e.preventDefault();
    setErrors({});
    setSuccess('');
    
    // Validate email
    if (!formData.email) {
      setErrors({ email: 'Email is required' });
      return;
    } else if (!validateEmail(formData.email)) {
      setErrors({ email: 'Please enter a valid email' });
      return;
    }
    
    // Send verification code
    const result = await initiateAdminRegistration(formData.email);
    
    if (result.success) {
      setSuccess('Verification code sent to your email');
      setStep(2); // Move to verification step
    } else {
      setErrors({ general: result.error || 'Failed to send verification code' });
    }
  };
  
  const handleVerifyAndRegister = async (e) => {
    e.preventDefault();
    setErrors({});
    setSuccess('');
    
    // Validate form
    let formErrors = {};
    
    if (!formData.name) {
      formErrors.name = 'Name is required';
    }
    
    if (!formData.verificationCode) {
      formErrors.verificationCode = 'Verification code is required';
    }
    
    if (!formData.password) {
      formErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      formErrors.password = 'Password must be at least 6 characters';
    }
    
    if (!formData.confirmPassword) {
      formErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      formErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }
    
    // Register admin
    const result = await registerAdmin(
      formData.name,
      formData.email,
      formData.password,
      formData.verificationCode
    );
    
    if (result.success) {
      setSuccess('Registration successful! Redirecting...');
      setTimeout(() => {
        navigate('/admin/dashboard');
      }, 1500);
    } else {
      setErrors({ general: result.error || 'Registration failed' });
    }
  };
  
  const toggleMode = () => {
    setIsLogin(!isLogin);
    setStep(1);
    setErrors({});
    setSuccess('');
    setFormData({
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      verificationCode: ''
    });
  };
  
  return (
    <div className="admin-auth-container">
      <div className="admin-auth-card">
        <div className="admin-auth-header">
          <h1>{isLogin ? 'Admin Login' : 'Admin Registration'}</h1>
          <p>{isLogin ? 'Sign in to access the admin dashboard' : 'Create a new admin account'}</p>
        </div>
        
        {errors.general && <div className="error-message">{errors.general}</div>}
        {success && <div className="success-message">{success}</div>}
        
        {isLogin ? (
          <form onSubmit={handleLoginSubmit} className="admin-auth-form">
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className={errors.email ? 'input-error' : ''}
              />
              {errors.email && <div className="field-error">{errors.email}</div>}
            </div>
            
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className={errors.password ? 'input-error' : ''}
              />
              {errors.password && <div className="field-error">{errors.password}</div>}
            </div>
            
            <button type="submit" className="auth-button">
              Login
            </button>
          </form>
        ) : (
          <>
            {step === 1 && (
              <form onSubmit={handleInitiateRegistration} className="admin-auth-form">
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    className={errors.email ? 'input-error' : ''}
                  />
                  {errors.email && <div className="field-error">{errors.email}</div>}
                </div>
                
                <button type="submit" className="auth-button">
                  Send Verification Code
                </button>
              </form>
            )}
            
            {step === 2 && (
              <form onSubmit={handleVerifyAndRegister} className="admin-auth-form">
                <div className="form-group">
                  <label htmlFor="name">Full Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    className={errors.name ? 'input-error' : ''}
                  />
                  {errors.name && <div className="field-error">{errors.name}</div>}
                </div>
                
                <div className="form-group">
                  <label htmlFor="verificationCode">Verification Code</label>
                  <input
                    type="text"
                    id="verificationCode"
                    name="verificationCode"
                    value={formData.verificationCode}
                    onChange={handleChange}
                    placeholder="Enter verification code"
                    className={errors.verificationCode ? 'input-error' : ''}
                  />
                  {errors.verificationCode && <div className="field-error">{errors.verificationCode}</div>}
                </div>
                
                <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Create a password"
                    className={errors.password ? 'input-error' : ''}
                  />
                  {errors.password && <div className="field-error">{errors.password}</div>}
                </div>
                
                <div className="form-group">
                  <label htmlFor="confirmPassword">Confirm Password</label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm your password"
                    className={errors.confirmPassword ? 'input-error' : ''}
                  />
                  {errors.confirmPassword && <div className="field-error">{errors.confirmPassword}</div>}
                </div>
                
                <button type="submit" className="auth-button">
                  Complete Registration
                </button>
                
                <button 
                  type="button" 
                  className="resend-button"
                  onClick={handleInitiateRegistration}
                >
                  Resend Verification Code
                </button>
              </form>
            )}
          </>
        )}
        
        <div className="auth-toggle">
          {isLogin ? (
            <p>Don't have an admin account? <button onClick={toggleMode}>Register</button></p>
          ) : (
            <p>Already have an admin account? <button onClick={toggleMode}>Login</button></p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminAuth; 