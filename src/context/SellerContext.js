import React, { createContext, useState, useContext, useEffect } from 'react';

// Create Seller Context
const SellerContext = createContext();

// Custom hook to use the seller context
export const useSeller = () => {
  const context = useContext(SellerContext);
  if (!context) {
    throw new Error('useSeller must be used within a SellerProvider');
  }
  return context;
};

export const SellerProvider = ({ children }) => {
  const [isSellerAuthenticated, setIsSellerAuthenticated] = useState(false);
  const [sellerData, setSellerData] = useState(null);
  const [sellerProducts, setSellerProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Check for existing seller session
  useEffect(() => {
    const token = localStorage.getItem('sellerToken');
    const data = localStorage.getItem('sellerData');
    const userToken = localStorage.getItem('token');
    
    // If user is logged in as a regular user, don't authenticate as seller
    if (userToken && !token) {
      setIsSellerAuthenticated(false);
      setSellerData(null);
      setLoading(false);
      return;
    }
    
    if (token && data) {
      setIsSellerAuthenticated(true);
      setSellerData(JSON.parse(data));
    } else {
      setIsSellerAuthenticated(false);
      setSellerData(null);
    }
    setLoading(false);
  }, []);
  
  // Effect to listen for storage changes
  useEffect(() => {
    const handleStorageChange = (e) => {
      // Only process relevant storage changes
      if (!['sellerToken', 'sellerData', 'token'].includes(e.key) && e.key !== null) {
        return;
      }
      
      const sellerToken = localStorage.getItem('sellerToken');
      const storedSellerData = localStorage.getItem('sellerData');
      const userToken = localStorage.getItem('token');
      
      // If user token was added and seller is logged in, log out seller
      if (e.key === 'token' && e.newValue && sellerToken) {
        console.log('User logged in, logging out seller');
        localStorage.removeItem('sellerToken');
        localStorage.removeItem('sellerData');
        setIsSellerAuthenticated(false);
        setSellerData(null);
        return;
      }
      
      // If user is logged in as a regular user, don't authenticate as seller
      if (userToken && !sellerToken) {
        setIsSellerAuthenticated(false);
        setSellerData(null);
        return;
      }
      
      // If customer logs in with both tokens, log out seller
      if (userToken && sellerToken) {
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
    
    // Check for user token on mount and clear seller session if needed
    const userToken = localStorage.getItem('token');
    const sellerToken = localStorage.getItem('sellerToken');
    
    if (userToken && sellerToken) {
      localStorage.removeItem('sellerToken');
      localStorage.removeItem('sellerData');
      setIsSellerAuthenticated(false);
      setSellerData(null);
    }
    
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
      // Check if user is already logged in as a regular user
      const userToken = localStorage.getItem("token");
      if (userToken) {
        return { 
          success: false, 
          error: 'You are currently logged in as a user. Please log out before logging in as a seller.' 
        };
      }
      
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
      // Check if user is already logged in as a regular user
      const userToken = localStorage.getItem("token");
      if (userToken) {
        return { 
          success: false, 
          error: 'You are currently logged in as a user. Please log out before registering as a seller.' 
        };
      }
      
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
      // Generate a unique ID for the product
      const productId = 'product_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      
      // Parse stock as integer to ensure proper comparison
      const stockQuantity = parseInt(productData.stock);
      
      // Create new product with ID and additional required fields
      const newProduct = {
        ...productData,
        id: productId,
        _id: productId, // Add _id for compatibility with shop products
        createdAt: new Date().toISOString(),
        sellerId: sellerData?.id,
        rating: productData.rating || 4.5, // Default rating
        reviews: productData.reviews || 0, // Default reviews
        inStock: stockQuantity > 0, // Ensure inStock is properly set based on stock quantity
        stock: stockQuantity, // Ensure stock is an integer
        isSeller: true // Flag to identify seller products
      };
      
      console.log('Adding new product:', newProduct);
      
      // Get current products from localStorage
      let currentProducts = [];
      try {
        const storedProducts = localStorage.getItem('sellerProducts');
        currentProducts = storedProducts ? JSON.parse(storedProducts) : [];
        if (!Array.isArray(currentProducts)) {
          currentProducts = [];
        }
      } catch (error) {
        console.error('Error parsing stored products:', error);
        currentProducts = [];
      }
      
      // Add new product to array
      const updatedProducts = [...currentProducts, newProduct];
      
      // Save to localStorage
      localStorage.setItem('sellerProducts', JSON.stringify(updatedProducts));
      
      // Update state
      setSellerProducts(updatedProducts);
      
      // Also add to shop products
      try {
        // Get existing shop products or initialize empty array
        const shopProducts = JSON.parse(localStorage.getItem('shopProducts')) || [];
        
        // Create a shop-specific version of the product
        const shopProduct = {
          ...newProduct,
          inStock: stockQuantity > 0 // Explicitly set inStock again for shop product
        };
        
        // Check if product already exists in shop products
        const existingIndex = shopProducts.findIndex(p => 
          (p.id === shopProduct.id) || (p._id === shopProduct.id)
        );
        
        let updatedShopProducts;
        if (existingIndex >= 0) {
          // Update existing product
          updatedShopProducts = [...shopProducts];
          updatedShopProducts[existingIndex] = shopProduct;
        } else {
          // Add new product
          updatedShopProducts = [...shopProducts, shopProduct];
        }
        
        localStorage.setItem('shopProducts', JSON.stringify(updatedShopProducts));
        console.log('Product added to shop products successfully with inStock:', shopProduct.inStock);
      } catch (error) {
        console.error('Error updating shop products:', error);
      }
      
      // Dispatch storage event to notify other components
      window.dispatchEvent(new Event('storage'));
      
      return { success: true, product: newProduct };
    } catch (err) {
      console.error('Add product error:', err);
      return { success: false, error: 'Failed to add product' };
    }
  };
  
  // Update product
  const updateProduct = (productId, productData) => {
    try {
      if (!productId) {
        console.error('Invalid product ID provided');
        return { success: false, error: 'Invalid product ID' };
      }

      console.log('Updating product with ID:', productId);
      
      // Parse stock as integer to ensure proper comparison
      const stockQuantity = parseInt(productData.stock);

      // Get current products from localStorage
      let currentProducts = [];
      try {
        const storedProducts = localStorage.getItem('sellerProducts');
        currentProducts = storedProducts ? JSON.parse(storedProducts) : [];
        if (!Array.isArray(currentProducts)) {
          currentProducts = [];
        }
      } catch (error) {
        console.error('Error parsing stored products:', error);
        currentProducts = [];
      }
      
      // Verify product exists before update (check both id and _id)
      const productExists = currentProducts.some(product => 
        (product.id === productId) || (product._id === productId)
      );
      
      if (!productExists) {
        console.error('Product not found for update:', productId);
        return { success: false, error: 'Product not found' };
      }
      
      // Update the product in the array
      const updatedProducts = currentProducts.map(product => {
        if ((product.id === productId) || (product._id === productId)) {
          // Ensure inStock is properly set based on stock quantity
          const updatedProduct = { 
            ...product, 
            ...productData,
            inStock: stockQuantity > 0,
            stock: stockQuantity
          };
          return updatedProduct;
        }
        return product;
      });
      
      // Save to localStorage
      localStorage.setItem('sellerProducts', JSON.stringify(updatedProducts));
      
      // Update state
      setSellerProducts(updatedProducts);
      
      // Also update shop products if exists
      try {
        const shopProducts = JSON.parse(localStorage.getItem('shopProducts')) || [];
        const productIndex = shopProducts.findIndex(p => 
          (p.id === productId) || (p._id === productId)
        );
        
        if (productIndex >= 0) {
          const updatedShopProducts = [...shopProducts];
          updatedShopProducts[productIndex] = {
            ...shopProducts[productIndex],
            ...productData,
            inStock: stockQuantity > 0,
            stock: stockQuantity
          };
          localStorage.setItem('shopProducts', JSON.stringify(updatedShopProducts));
          console.log('Shop products updated successfully with inStock:', stockQuantity > 0);
        }
      } catch (error) {
        console.error('Error updating shop products:', error);
        // Continue with update even if shop products update fails
      }
      
      // Dispatch storage event to notify other components
      window.dispatchEvent(new Event('storage'));
      
      return { success: true };
    } catch (error) {
      console.error('Update product error:', error);
      return { success: false, error: 'Failed to update product' };
    }
  };
  
  // Delete product
  const deleteProduct = (productId) => {
    try {
      if (!productId) {
        console.error('Invalid product ID provided');
        return { success: false, error: 'Invalid product ID' };
      }

      console.log('Deleting product with ID:', productId);

      // Get current products from localStorage
      let currentProducts = [];
      try {
        const storedProducts = localStorage.getItem('sellerProducts');
        currentProducts = storedProducts ? JSON.parse(storedProducts) : [];
        if (!Array.isArray(currentProducts)) {
          currentProducts = [];
        }
      } catch (error) {
        console.error('Error parsing stored products:', error);
        currentProducts = [];
      }
      
      // Verify product exists before deletion (check both id and _id)
      const productExists = currentProducts.some(product => 
        (product.id === productId) || (product._id === productId)
      );
      
      if (!productExists) {
        console.error('Product not found for deletion:', productId);
        return { success: false, error: 'Product not found' };
      }
      
      console.log('Product found, proceeding with deletion');
      
      // Filter out the deleted product (check both id and _id)
      const updatedProducts = currentProducts.filter(product => 
        (product.id !== productId) && (product._id !== productId)
      );
      
      console.log('Products after filter:', updatedProducts.length);
      
      // Update localStorage
      localStorage.setItem('sellerProducts', JSON.stringify(updatedProducts));
      
      // Update state
      setSellerProducts(updatedProducts);
      
      // Also remove from shop products if exists
      try {
        // Update shop products
        const shopProducts = JSON.parse(localStorage.getItem('shopProducts')) || [];
        const updatedShopProducts = shopProducts.filter(product => 
          (product.id !== productId) && (product._id !== productId)
        );
        localStorage.setItem('shopProducts', JSON.stringify(updatedShopProducts));
        
        // Update featured products
        const featuredProducts = JSON.parse(localStorage.getItem('featuredProducts')) || [];
        const updatedFeaturedProducts = featuredProducts.filter(product => 
          (product.id !== productId) && (product._id !== productId)
        );
        localStorage.setItem('featuredProducts', JSON.stringify(updatedFeaturedProducts));
        
        // Update cart items
        const guestCart = JSON.parse(localStorage.getItem('guest_cart')) || [];
        const updatedGuestCart = guestCart.filter(item => 
          (item.id !== productId) && (item._id !== productId)
        );
        localStorage.setItem('guest_cart', JSON.stringify(updatedGuestCart));
        
        // Check for user-specific carts
        const allKeys = Object.keys(localStorage);
        const userCartKeys = allKeys.filter(key => key.startsWith('cart_'));
        
        userCartKeys.forEach(cartKey => {
          try {
            const userCart = JSON.parse(localStorage.getItem(cartKey)) || [];
            const updatedUserCart = userCart.filter(item => 
              (item.id !== productId) && (item._id !== productId)
            );
            localStorage.setItem(cartKey, JSON.stringify(updatedUserCart));
          } catch (e) {
            console.error(`Error updating user cart ${cartKey}:`, e);
          }
        });
      } catch (error) {
        console.error('Error updating related data:', error);
        // Continue with deletion even if related updates fail
      }
      
      // Dispatch storage event to notify other components
      window.dispatchEvent(new Event('storage'));
      
      console.log('Product deletion completed successfully');
      return { success: true };
    } catch (err) {
      console.error('Delete product error:', err);
      return { success: false, error: 'Failed to delete product' };
    }
  };
  
  // Get seller products
  const getSellerProducts = () => {
    try {
      const storedProducts = localStorage.getItem('sellerProducts');
      
      if (!storedProducts) {
        return { success: true, products: [] };
      }
      
      const parsedProducts = JSON.parse(storedProducts);
      
      if (!Array.isArray(parsedProducts)) {
        return { success: true, products: [] };
      }
      
      // Update the state with the retrieved products
      setSellerProducts(parsedProducts);
      
      return { success: true, products: parsedProducts };
    } catch (error) {
      console.error('Error getting seller products:', error);
      return { success: false, error: 'Failed to get products', products: [] };
    }
  };
  
  return (
    <SellerContext.Provider
      value={{
        isSellerAuthenticated,
        sellerData,
        sellerProducts,
        loading,
        error,
        loginSeller,
        registerSeller,
        logoutSeller,
        addProduct,
        updateProduct,
        deleteProduct,
        getSellerProducts
      }}
    >
      {children}
    </SellerContext.Provider>
  );
};

export { SellerContext }; 