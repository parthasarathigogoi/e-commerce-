import React, { createContext, useState, useContext, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { sendVerificationEmail } from '../utils/emailService';

// Create Admin Context
export const AdminContext = createContext();

// Custom hook to use the admin context
export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};

export const AdminProvider = ({ children }) => {
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [adminData, setAdminData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [verificationCode, setVerificationCode] = useState(null);
  const [pendingAdmins, setPendingAdmins] = useState([]);
  const [stats, setStats] = useState({
    totalSellers: 0,
    totalProducts: 0,
    totalUsers: 0,
    totalOrders: 0,
    revenue: 0
  });
  
  // Check for existing admin session
  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    const data = localStorage.getItem('adminData');
    
    if (token && data) {
      setIsAdminAuthenticated(true);
      setAdminData(JSON.parse(data));
    } else {
      setIsAdminAuthenticated(false);
      setAdminData(null);
    }
    
    // Load pending admins
    const storedPendingAdmins = localStorage.getItem('pendingAdmins');
    if (storedPendingAdmins) {
      setPendingAdmins(JSON.parse(storedPendingAdmins));
    }
    
    setLoading(false);
  }, []);
  
  // Generate statistics
  useEffect(() => {
    if (isAdminAuthenticated) {
      // In a real app, this would be an API call
      // For demo purposes, we'll calculate from localStorage
      
      try {
        // Count sellers
        const sellerData = localStorage.getItem('sellerData');
        const sellers = sellerData ? 1 : 0;
        
        // Count products
        const sellerProducts = localStorage.getItem('sellerProducts');
        const products = sellerProducts ? JSON.parse(sellerProducts).length : 0;
        
        // Count users
        const userData = localStorage.getItem('userData');
        const users = userData ? 1 : 0;
        
        // Mock orders and revenue
        const orders = Math.floor(Math.random() * 100);
        const revenue = Math.floor(Math.random() * 10000);
        
        setStats({
          totalSellers: sellers,
          totalProducts: products,
          totalUsers: users,
          totalOrders: orders,
          revenue: revenue
        });
      } catch (error) {
        console.error('Error generating stats:', error);
      }
    }
  }, [isAdminAuthenticated]);
  
  // Login admin
  const loginAdmin = async (email, password) => {
    try {
      setLoading(true);
      
      // In a real app, this would be an API call
      // For demo purposes, we'll check against localStorage
      
      const admins = JSON.parse(localStorage.getItem('admins') || '[]');
      const admin = admins.find(a => a.email === email);
      
      if (!admin) {
        return { success: false, error: 'Admin not found' };
      }
      
      if (admin.password !== password) {
        return { success: false, error: 'Invalid password' };
      }
      
      // Save to localStorage
      const token = 'admin-token-' + Date.now();
      localStorage.setItem('adminToken', token);
      localStorage.setItem('adminData', JSON.stringify(admin));
      
      setIsAdminAuthenticated(true);
      setAdminData(admin);
      
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Invalid credentials' };
    } finally {
      setLoading(false);
    }
  };
  
  // Register admin
  const registerAdmin = async (name, email, password, verificationCode) => {
    try {
      setLoading(true);
      
      // Check if the verification code matches
      const pendingAdmin = pendingAdmins.find(
        admin => admin.email === email && admin.verificationCode === verificationCode
      );
      
      if (!pendingAdmin) {
        return { success: false, error: 'Invalid verification code' };
      }
      
      // Create new admin
      const newAdmin = {
        id: uuidv4(),
        name,
        email,
        password,
        role: 'admin',
        createdAt: new Date().toISOString()
      };
      
      // Get existing admins or initialize empty array
      const existingAdmins = JSON.parse(localStorage.getItem('admins') || '[]');
      
      // Check if admin already exists
      if (existingAdmins.some(admin => admin.email === email)) {
        return { success: false, error: 'Admin already exists' };
      }
      
      // Add new admin
      const updatedAdmins = [...existingAdmins, newAdmin];
      
      // Save to localStorage
      localStorage.setItem('admins', JSON.stringify(updatedAdmins));
      
      // Remove from pending admins
      const updatedPendingAdmins = pendingAdmins.filter(
        admin => !(admin.email === email && admin.verificationCode === verificationCode)
      );
      
      localStorage.setItem('pendingAdmins', JSON.stringify(updatedPendingAdmins));
      setPendingAdmins(updatedPendingAdmins);
      
      // Auto login
      const token = 'admin-token-' + Date.now();
      localStorage.setItem('adminToken', token);
      localStorage.setItem('adminData', JSON.stringify(newAdmin));
      
      setIsAdminAuthenticated(true);
      setAdminData(newAdmin);
      
      return { success: true };
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, error: 'Registration failed' };
    } finally {
      setLoading(false);
    }
  };
  
  // Logout admin
  const logoutAdmin = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminData');
    setIsAdminAuthenticated(false);
    setAdminData(null);
  };
  
  // Initiate admin registration with verification
  const initiateAdminRegistration = async (email) => {
    try {
      setLoading(true);
      
      // Generate a 6-digit verification code
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      setVerificationCode(code);
      
      // Send verification email
      const emailResult = await sendVerificationEmail(email, code);
      
      if (!emailResult.success) {
        return { success: false, error: 'Failed to send verification email' };
      }
      
      // Store pending admin
      const pendingAdmin = {
        email,
        verificationCode: code,
        timestamp: Date.now()
      };
      
      const updatedPendingAdmins = [...pendingAdmins, pendingAdmin];
      localStorage.setItem('pendingAdmins', JSON.stringify(updatedPendingAdmins));
      setPendingAdmins(updatedPendingAdmins);
      
      return { success: true, message: 'Verification code sent to your email' };
    } catch (error) {
      console.error('Error initiating registration:', error);
      return { success: false, error: 'Failed to initiate registration' };
    } finally {
      setLoading(false);
    }
  };
  
  // Get all sellers
  const getAllSellers = () => {
    try {
      // In a real app, this would be an API call
      // For demo purposes, we'll check localStorage
      
      const sellerData = localStorage.getItem('sellerData');
      if (!sellerData) {
        return { success: true, sellers: [] };
      }
      
      const seller = JSON.parse(sellerData);
      return { success: true, sellers: [seller] };
    } catch (error) {
      console.error('Error getting sellers:', error);
      return { success: false, error: 'Failed to get sellers', sellers: [] };
    }
  };
  
  // Get all products
  const getAllProducts = () => {
    try {
      // In a real app, this would be an API call
      // For demo purposes, we'll check localStorage
      
      const sellerProducts = localStorage.getItem('sellerProducts');
      if (!sellerProducts) {
        return { success: true, products: [] };
      }
      
      const products = JSON.parse(sellerProducts);
      return { success: true, products };
    } catch (error) {
      console.error('Error getting products:', error);
      return { success: false, error: 'Failed to get products', products: [] };
    }
  };
  
  // Delete product
  const deleteProduct = (productId) => {
    try {
      // In a real app, this would be an API call
      // For demo purposes, we'll update localStorage
      
      const sellerProducts = localStorage.getItem('sellerProducts');
      if (!sellerProducts) {
        return { success: false, error: 'No products found' };
      }
      
      const products = JSON.parse(sellerProducts);
      const updatedProducts = products.filter(
        product => product.id !== productId && product._id !== productId
      );
      
      localStorage.setItem('sellerProducts', JSON.stringify(updatedProducts));
      
      // Also update shop products
      const shopProducts = localStorage.getItem('shopProducts');
      if (shopProducts) {
        const parsedShopProducts = JSON.parse(shopProducts);
        const updatedShopProducts = parsedShopProducts.filter(
          product => product.id !== productId && product._id !== productId
        );
        
        localStorage.setItem('shopProducts', JSON.stringify(updatedShopProducts));
      }
      
      return { success: true, message: 'Product deleted successfully' };
    } catch (error) {
      console.error('Error deleting product:', error);
      return { success: false, error: 'Failed to delete product' };
    }
  };
  
  // Update product
  const updateProduct = (productId, productData) => {
    try {
      // In a real app, this would be an API call
      // For demo purposes, we'll update localStorage
      
      const sellerProducts = localStorage.getItem('sellerProducts');
      if (!sellerProducts) {
        return { success: false, error: 'No products found' };
      }
      
      const products = JSON.parse(sellerProducts);
      const updatedProducts = products.map(product => {
        if (product.id === productId || product._id === productId) {
          return { ...product, ...productData };
        }
        return product;
      });
      
      localStorage.setItem('sellerProducts', JSON.stringify(updatedProducts));
      
      // Also update shop products
      const shopProducts = localStorage.getItem('shopProducts');
      if (shopProducts) {
        const parsedShopProducts = JSON.parse(shopProducts);
        const updatedShopProducts = parsedShopProducts.map(product => {
          if (product.id === productId || product._id === productId) {
            return { ...product, ...productData };
          }
          return product;
        });
        
        localStorage.setItem('shopProducts', JSON.stringify(updatedShopProducts));
      }
      
      return { success: true, message: 'Product updated successfully' };
    } catch (error) {
      console.error('Error updating product:', error);
      return { success: false, error: 'Failed to update product' };
    }
  };
  
  // Delete seller
  const deleteSeller = (sellerId) => {
    try {
      // In a real app, this would be an API call
      // For demo purposes, we'll update localStorage
      
      localStorage.removeItem('sellerToken');
      localStorage.removeItem('sellerData');
      
      // Also delete seller's products
      localStorage.removeItem('sellerProducts');
      
      return { success: true, message: 'Seller deleted successfully' };
    } catch (error) {
      console.error('Error deleting seller:', error);
      return { success: false, error: 'Failed to delete seller' };
    }
  };
  
  // Check admin password
  const checkAdminPassword = (password) => {
    return password === '789613';
  };
  
  return (
    <AdminContext.Provider
      value={{
        isAdminAuthenticated,
        adminData,
        loading,
        error,
        stats,
        verificationCode,
        loginAdmin,
        registerAdmin,
        logoutAdmin,
        initiateAdminRegistration,
        getAllSellers,
        getAllProducts,
        deleteProduct,
        updateProduct,
        deleteSeller,
        checkAdminPassword
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}; 