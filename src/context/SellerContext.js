import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { SellerAPI, ProductAPI } from '../utils/api';
import { v4 as uuidv4 } from 'uuid';

// Create Seller Context
const SellerContext = createContext();

// Custom hook to use the seller context
export const useSeller = () => useContext(SellerContext);

export const SellerProvider = ({ children }) => {
  const [isSellerAuthenticated, setIsSellerAuthenticated] = useState(false);
  const [sellerInfo, setSellerInfo] = useState(null);
  const [sellerProducts, setSellerProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { currentUser } = useAuth();
  
  // Check if seller is authenticated on mount
  useEffect(() => {
    const checkSellerAuth = () => {
      const sellerToken = localStorage.getItem('sellerToken');
      const sellerId = localStorage.getItem('sellerId');
      
      if (sellerToken && sellerId) {
        // Load seller info from localStorage
        const storedSellerInfo = localStorage.getItem('sellerInfo');
        if (storedSellerInfo) {
          try {
            const parsedInfo = JSON.parse(storedSellerInfo);
            setSellerInfo(parsedInfo);
            setIsSellerAuthenticated(true);
            
            // Load seller products
            loadSellerProducts();
          } catch (err) {
            console.error('Error parsing seller info:', err);
            handleSellerLogout();
          }
        }
      }
    };
    
    checkSellerAuth();
  }, []);
  
  // Handle seller login
  const handleSellerLogin = async (email, password) => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulate API call
      // In a real app, this would be an actual API call to your backend
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // For demo purposes, we'll accept any email that ends with @seller.com
      // and any password with at least 6 characters
      if (!email.endsWith('@seller.com')) {
        throw new Error('Invalid seller email. Use an email ending with @seller.com');
      }
      
      if (password.length < 6) {
        throw new Error('Password must be at least 6 characters');
      }
      
      // Generate a fake token and seller ID
      const token = `seller_${Math.random().toString(36).substring(2, 15)}`;
      const sellerId = `sid_${Math.random().toString(36).substring(2, 10)}`;
      
      // Create seller info object
      const sellerData = {
        id: sellerId,
        email: email,
        name: email.split('@')[0],
        shopName: `${email.split('@')[0]}'s Shop`,
        phone: '123-456-7890',
        joinDate: new Date().toISOString()
      };
      
      // Save to localStorage
      localStorage.setItem('sellerToken', token);
      localStorage.setItem('sellerId', sellerId);
      localStorage.setItem('sellerInfo', JSON.stringify(sellerData));
      
      // Update state
      setSellerInfo(sellerData);
      setIsSellerAuthenticated(true);
      
      // Generate some demo products for the seller
      const demoProducts = generateDemoProducts(sellerId);
      localStorage.setItem(`sellerProducts_${sellerId}`, JSON.stringify(demoProducts));
      setSellerProducts(demoProducts);
      
      return { success: true };
    } catch (err) {
      setError(err.message || 'Login failed');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };
  
  // Register a new seller
  const registerSeller = async (name, email, password, shopName, phone) => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Validate email format
      if (!email.endsWith('@seller.com')) {
        throw new Error('Please use an email ending with @seller.com for seller registration');
      }
      
      // Generate a fake token and seller ID
      const token = `seller_${Math.random().toString(36).substring(2, 15)}`;
      const sellerId = `sid_${Math.random().toString(36).substring(2, 10)}`;
      
      // Create seller info object
      const sellerData = {
        id: sellerId,
        email,
        name,
        shopName: shopName || `${name}'s Shop`,
        phone: phone || '123-456-7890',
        joinDate: new Date().toISOString()
      };
      
      // Save to localStorage
      localStorage.setItem('sellerToken', token);
      localStorage.setItem('sellerId', sellerId);
      localStorage.setItem('sellerInfo', JSON.stringify(sellerData));
      
      // Update state
      setSellerInfo(sellerData);
      setIsSellerAuthenticated(true);
      
      // Generate some demo products for the seller
      const demoProducts = generateDemoProducts(sellerId);
      localStorage.setItem(`sellerProducts_${sellerId}`, JSON.stringify(demoProducts));
      setSellerProducts(demoProducts);
      
      return { success: true };
    } catch (err) {
      setError(err.message || 'Registration failed');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };
  
  // Handle seller logout
  const handleSellerLogout = () => {
    localStorage.removeItem('sellerToken');
    localStorage.removeItem('sellerId');
    localStorage.removeItem('sellerInfo');
    
    setSellerInfo(null);
    setIsSellerAuthenticated(false);
    setSellerProducts([]);
  };
  
  // Load seller products
  const loadSellerProducts = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const sellerId = localStorage.getItem('sellerId');
      if (!sellerId) {
        throw new Error('Seller ID not found');
      }
      
      // In a real app, this would be an API call to fetch products
      // For demo, we'll get them from localStorage
      const storedProducts = localStorage.getItem(`sellerProducts_${sellerId}`);
      
      if (storedProducts) {
        const parsedProducts = JSON.parse(storedProducts);
        setSellerProducts(parsedProducts);
      } else {
        // If no products found, create some demo ones
        const demoProducts = generateDemoProducts(sellerId);
        localStorage.setItem(`sellerProducts_${sellerId}`, JSON.stringify(demoProducts));
        setSellerProducts(demoProducts);
      }
      
      return { success: true };
    } catch (err) {
      setError(err.message || 'Failed to load products');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };
  
  // Add a new product
  const addProduct = async (productData) => {
    setLoading(true);
    setError(null);
    
    try {
      const sellerId = localStorage.getItem('sellerId');
      if (!sellerId) {
        throw new Error('Seller ID not found');
      }
      
      // Generate a product ID
      const productId = `prod_${Math.random().toString(36).substring(2, 10)}`;
      
      // Create the new product object
      const newProduct = {
        id: productId,
        sellerId,
        ...productData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      // Add to existing products
      const updatedProducts = [...sellerProducts, newProduct];
      
      // Save to localStorage
      localStorage.setItem(`sellerProducts_${sellerId}`, JSON.stringify(updatedProducts));
      
      // Update state
      setSellerProducts(updatedProducts);
      
      return { success: true, product: newProduct };
    } catch (err) {
      setError(err.message || 'Failed to add product');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };
  
  // Update an existing product
  const updateProduct = async (productId, productData) => {
    setLoading(true);
    setError(null);
    
    try {
      const sellerId = localStorage.getItem('sellerId');
      if (!sellerId) {
        throw new Error('Seller ID not found');
      }
      
      // Find the product to update
      const productIndex = sellerProducts.findIndex(p => p.id === productId);
      
      if (productIndex === -1) {
        throw new Error('Product not found');
      }
      
      // Create the updated product
      const updatedProduct = {
        ...sellerProducts[productIndex],
        ...productData,
        updatedAt: new Date().toISOString()
      };
      
      // Update the products array
      const updatedProducts = [...sellerProducts];
      updatedProducts[productIndex] = updatedProduct;
      
      // Save to localStorage
      localStorage.setItem(`sellerProducts_${sellerId}`, JSON.stringify(updatedProducts));
      
      // Update state
      setSellerProducts(updatedProducts);
      
      return { success: true, product: updatedProduct };
    } catch (err) {
      setError(err.message || 'Failed to update product');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };
  
  // Delete a product
  const deleteProduct = async (productId) => {
    setLoading(true);
    setError(null);
    
    try {
      const sellerId = localStorage.getItem('sellerId');
      if (!sellerId) {
        throw new Error('Seller ID not found');
      }
      
      // Filter out the product to delete
      const updatedProducts = sellerProducts.filter(p => p.id !== productId);
      
      // Save to localStorage
      localStorage.setItem(`sellerProducts_${sellerId}`, JSON.stringify(updatedProducts));
      
      // Update state
      setSellerProducts(updatedProducts);
      
      return { success: true };
    } catch (err) {
      setError(err.message || 'Failed to delete product');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };
  
  // Helper function to generate demo products
  const generateDemoProducts = (sellerId) => {
    const categories = ['Electronics', 'Clothing', 'Home', 'Beauty', 'Sports'];
    const productNames = [
      'Premium Wireless Headphones',
      'Ultra HD Smart TV',
      'Designer Leather Wallet',
      'Stainless Steel Water Bottle',
      'Organic Cotton T-Shirt',
      'Bluetooth Portable Speaker',
      'Professional Chef Knife Set',
      'Luxury Scented Candle',
      'Fitness Tracker Watch',
      'Memory Foam Pillow'
    ];
    
    return Array(5).fill().map((_, index) => {
      const price = Math.floor(Math.random() * 200) + 10;
      const discount = Math.random() > 0.7 ? Math.floor(Math.random() * 30) + 5 : 0;
      const stock = Math.floor(Math.random() * 50) + 1;
      
      return {
        id: `prod_demo_${index}_${Math.random().toString(36).substring(2, 7)}`,
        sellerId,
        name: productNames[index],
        description: `This is a high-quality ${productNames[index].toLowerCase()} that will exceed your expectations.`,
        price,
        originalPrice: discount ? price + (price * discount / 100) : price,
        discount,
        stock,
        category: categories[Math.floor(Math.random() * categories.length)],
        image: `https://source.unsplash.com/300x300/?product,${productNames[index].split(' ')[0].toLowerCase()}`,
        rating: (Math.random() * 2 + 3).toFixed(1),
        reviews: Math.floor(Math.random() * 100),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
    });
  };
  
  const value = {
    isSellerAuthenticated,
    sellerInfo,
    sellerProducts,
    loading,
    error,
    handleSellerLogin,
    registerSeller,
    handleSellerLogout,
    loadSellerProducts,
    addProduct,
    updateProduct,
    deleteProduct
  };
  
  return (
    <SellerContext.Provider value={value}>
      {children}
    </SellerContext.Provider>
  );
};

export default SellerContext; 