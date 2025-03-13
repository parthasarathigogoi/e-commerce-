import React, { createContext, useState, useContext, useEffect } from 'react';

// Create Seller Context
const SellerContext = createContext();

// Custom hook to use the seller context
export const useSeller = () => useContext(SellerContext);

export const SellerProvider = ({ children }) => {
  const [isSellerAuthenticated, setIsSellerAuthenticated] = useState(() => {
    const sellerToken = localStorage.getItem('sellerToken');
    return !!sellerToken;
  });
  
  const [sellerData, setSellerData] = useState(() => {
    const storedSellerData = localStorage.getItem('sellerData');
    return storedSellerData ? JSON.parse(storedSellerData) : null;
  });
  
  const [sellerProducts, setSellerProducts] = useState(() => {
    try {
      const storedProducts = localStorage.getItem('sellerProducts');
      if (storedProducts) {
        const parsed = JSON.parse(storedProducts);
        return Array.isArray(parsed) ? parsed : [];
      }
      return [];
    } catch (error) {
      console.error('Error parsing stored products:', error);
      return [];
    }
  });
  
  // Effect to handle seller authentication state changes
  useEffect(() => {
    const sellerToken = localStorage.getItem('sellerToken');
    const storedSellerData = localStorage.getItem('sellerData');
    const customerToken = localStorage.getItem('token');
    
    // If customer is logged in, log out seller
    if (customerToken && sellerToken) {
      localStorage.removeItem('sellerToken');
      localStorage.removeItem('sellerData');
      setIsSellerAuthenticated(false);
      setSellerData(null);
      return;
    }
    
    if (sellerToken && storedSellerData) {
      setIsSellerAuthenticated(true);
      setSellerData(JSON.parse(storedSellerData));
    } else {
      setIsSellerAuthenticated(false);
      setSellerData(null);
    }
  }, []);
  
  // Effect to listen for storage changes
  useEffect(() => {
    const handleStorageChange = () => {
      const sellerToken = localStorage.getItem('sellerToken');
      const storedSellerData = localStorage.getItem('sellerData');
      const customerToken = localStorage.getItem('token');
      
      // If customer logs in, log out seller
      if (customerToken && sellerToken) {
        localStorage.removeItem('sellerToken');
        localStorage.removeItem('sellerData');
        setIsSellerAuthenticated(false);
        setSellerData(null);
        return;
      }
      
      // Update seller auth state
      if (sellerToken && storedSellerData) {
        setIsSellerAuthenticated(true);
        setSellerData(JSON.parse(storedSellerData));
      } else {
        setIsSellerAuthenticated(false);
        setSellerData(null);
      }
    };
    
    // Listen for storage changes
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);
  
  // Load products from localStorage when authentication changes
  useEffect(() => {
    if (isSellerAuthenticated) {
      try {
        const storedProducts = localStorage.getItem('sellerProducts');
        if (storedProducts) {
          const parsed = JSON.parse(storedProducts);
          if (Array.isArray(parsed)) {
            setSellerProducts(parsed);
          }
        }
      } catch (error) {
        console.error('Error loading seller products:', error);
        setSellerProducts([]);
      }
    }
  }, [isSellerAuthenticated]);
  
  // Login seller
  const loginSeller = async (email, password) => {
    try {
      // Log out customer if logged in
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      
      // In a real app, this would be an API call
      // For demo purposes, we'll simulate a successful login
      const mockSellerData = {
        id: 'seller-' + Date.now(),
        name: email.split('@')[0],
        email,
        storeName: email.split('@')[0] + "'s Store",
        createdAt: new Date().toISOString()
      };
      
      // Save to localStorage
      localStorage.setItem('sellerToken', 'mock-seller-token-' + Date.now());
      localStorage.setItem('sellerData', JSON.stringify(mockSellerData));
      
      setIsSellerAuthenticated(true);
      setSellerData(mockSellerData);
      
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Invalid credentials' };
    }
  };
  
  // Register seller
  const registerSeller = async (name, email, password, storeName, phone) => {
    try {
      // Log out customer if logged in
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      
      // In a real app, this would be an API call
      // For demo purposes, we'll simulate a successful registration
      const mockSellerData = {
        id: 'seller-' + Date.now(),
        name,
        email,
        storeName,
        phone,
        createdAt: new Date().toISOString()
      };
      
      // Save to localStorage
      localStorage.setItem('sellerToken', 'mock-seller-token-' + Date.now());
      localStorage.setItem('sellerData', JSON.stringify(mockSellerData));
      
      setIsSellerAuthenticated(true);
      setSellerData(mockSellerData);
      
      return { success: true };
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, error: 'Registration failed' };
    }
  };
  
  // Logout seller
  const logoutSeller = () => {
    localStorage.removeItem('sellerToken');
    localStorage.removeItem('sellerData');
    setIsSellerAuthenticated(false);
    setSellerData(null);
  };
  
  // Add product
  const addProduct = (productData) => {
    try {
      const newProduct = {
        ...productData,
        id: `product-${Date.now()}`,
        _id: `product-${Date.now()}`, // Add _id for compatibility with shop products
        sellerId: sellerData?.id,
        createdAt: new Date().toISOString(),
        rating: productData.rating || 4.5, // Default rating if not provided
        reviews: productData.reviews || 0, // Default reviews count if not provided
        isNew: true, // Mark as new product
        isTrending: false,
        discount: productData.discount || 0 // Default discount if not provided
      };
      
      const updatedProducts = Array.isArray(sellerProducts) 
        ? [...sellerProducts, newProduct] 
        : [newProduct];
      
      setSellerProducts(updatedProducts);
      
      // Save to localStorage
      localStorage.setItem('sellerProducts', JSON.stringify(updatedProducts));
      
      return { success: true, product: newProduct };
    } catch (error) {
      console.error('Add product error:', error);
      return { success: false, error: 'Failed to add product' };
    }
  };
  
  // Update product
  const updateProduct = (productId, productData) => {
    try {
      if (!Array.isArray(sellerProducts)) {
        return { success: false, error: 'Products data is invalid' };
      }
      
      const updatedProducts = sellerProducts.map(product => 
        product.id === productId ? { ...product, ...productData } : product
      );
      
      setSellerProducts(updatedProducts);
      
      // Save to localStorage
      localStorage.setItem('sellerProducts', JSON.stringify(updatedProducts));
      
      return { success: true };
    } catch (error) {
      console.error('Update product error:', error);
      return { success: false, error: 'Failed to update product' };
    }
  };
  
  // Delete product
  const deleteProduct = (productId) => {
    try {
      if (!Array.isArray(sellerProducts)) {
        return { success: false, error: 'Products data is invalid' };
      }
      
      const updatedProducts = sellerProducts.filter(product => product.id !== productId);
      
      setSellerProducts(updatedProducts);
      
      // Save to localStorage
      localStorage.setItem('sellerProducts', JSON.stringify(updatedProducts));
      
      // Also remove from shop products if present
      try {
        const shopProducts = localStorage.getItem('shopProducts');
        if (shopProducts) {
          const parsedShopProducts = JSON.parse(shopProducts);
          if (Array.isArray(parsedShopProducts)) {
            const updatedShopProducts = parsedShopProducts.filter(
              product => product.id !== productId && product._id !== productId
            );
            localStorage.setItem('shopProducts', JSON.stringify(updatedShopProducts));
          }
        }
        
        // Also check featured products
        const featuredProducts = localStorage.getItem('featuredProducts');
        if (featuredProducts) {
          const parsedFeaturedProducts = JSON.parse(featuredProducts);
          if (Array.isArray(parsedFeaturedProducts)) {
            const updatedFeaturedProducts = parsedFeaturedProducts.filter(
              product => product.id !== productId && product._id !== productId
            );
            localStorage.setItem('featuredProducts', JSON.stringify(updatedFeaturedProducts));
          }
        }
        
        // Also check cart items
        const cartItems = localStorage.getItem('cartItems');
        if (cartItems) {
          const parsedCartItems = JSON.parse(cartItems);
          if (Array.isArray(parsedCartItems)) {
            const updatedCartItems = parsedCartItems.filter(
              item => item.id !== productId && item._id !== productId
            );
            localStorage.setItem('cartItems', JSON.stringify(updatedCartItems));
          }
        }
        
        // Dispatch storage event to notify other components
        window.dispatchEvent(new Event('storage'));
      } catch (error) {
        console.error('Error updating related product data:', error);
        // Continue with deletion even if related updates fail
      }
      
      return { success: true };
    } catch (error) {
      console.error('Delete product error:', error);
      return { success: false, error: 'Failed to delete product' };
    }
  };
  
  // Get seller products
  const getSellerProducts = () => {
    try {
      // In a real app, this would be an API call
      // For demo purposes, we'll get products from localStorage
      const storedProducts = localStorage.getItem('sellerProducts');
      let products = [];
      
      if (storedProducts) {
        try {
          products = JSON.parse(storedProducts);
          if (!Array.isArray(products)) {
            products = [];
          }
        } catch (error) {
          console.error('Error parsing products:', error);
          products = [];
        }
      }
      
      // Filter products by seller ID in a real app
      // const sellerProducts = products.filter(product => product.sellerId === sellerData?.id);
      
      setSellerProducts(products);
      return { success: true, products };
    } catch (error) {
      console.error('Get products error:', error);
      return { success: false, error: 'Failed to get products', products: [] };
    }
  };
  
  return (
    <SellerContext.Provider value={{
      isSellerAuthenticated,
      sellerData,
      sellerProducts,
      loginSeller,
      registerSeller,
      logoutSeller,
      addProduct,
      updateProduct,
      deleteProduct,
      getSellerProducts
    }}>
      {children}
    </SellerContext.Provider>
  );
};

export { SellerContext }; 