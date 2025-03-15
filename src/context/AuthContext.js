import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check auth status on initial load
  useEffect(() => {
    const checkAuth = () => {
      try {
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('userData');
        
        if (token && userData) {
          const user = JSON.parse(userData);
          setCurrentUser(user);
          setIsAuthenticated(true);
        } else {
          setCurrentUser(null);
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
        setCurrentUser(null);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };
    
    checkAuth();
  }, []);

  // Login user
  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    
    try {
      // For demo purposes, we'll simulate a successful login
      // In a real app, this would be an API call
      const userId = uuidv4();
      const user = {
        uid: userId,
        email: email,
        name: email.split('@')[0],
        createdAt: new Date().toISOString()
      };
      
      // Store user data and token
      localStorage.setItem('token', 'demo-token-' + userId);
      localStorage.setItem('userData', JSON.stringify(user));
      
      setCurrentUser(user);
      setIsAuthenticated(true);
      setLoading(false);
      
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      setError('Failed to log in. Please check your credentials.');
      setLoading(false);
      return { success: false, message: 'Authentication failed' };
    }
  };

  // Register user
  const register = async (name, email, password) => {
    setLoading(true);
    setError(null);
    
    try {
      // For demo purposes, we'll simulate a successful registration
      // In a real app, this would be an API call
      const userId = uuidv4();
      const user = {
        uid: userId,
        email: email,
        name: name,
        createdAt: new Date().toISOString()
      };
      
      // Store user data and token
      localStorage.setItem('token', 'demo-token-' + userId);
      localStorage.setItem('userData', JSON.stringify(user));
      
      setCurrentUser(user);
      setIsAuthenticated(true);
      setLoading(false);
      
      return { success: true };
    } catch (error) {
      console.error('Registration error:', error);
      setError('Failed to register. Please try again.');
      setLoading(false);
      return { success: false, message: 'Registration failed' };
    }
  };

  // Logout user
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    setCurrentUser(null);
    setIsAuthenticated(false);
    return { success: true };
  };

  // Update user profile
  const updateProfile = async (userData) => {
    setLoading(true);
    setError(null);
    
    try {
      if (!currentUser) {
        throw new Error('No user is logged in');
      }
      
      // Update user data
      const updatedUser = {
        ...currentUser,
        ...userData,
        updatedAt: new Date().toISOString()
      };
      
      // Store updated user data
      localStorage.setItem('userData', JSON.stringify(updatedUser));
      
      setCurrentUser(updatedUser);
      setLoading(false);
      
      return { success: true };
    } catch (error) {
      console.error('Profile update error:', error);
      setError('Failed to update profile. Please try again.');
      setLoading(false);
      return { success: false, message: 'Profile update failed' };
    }
  };

  const value = {
    currentUser,
    isAuthenticated,
    loading,
    error,
    login,
    register,
    logout,
    updateProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext; 