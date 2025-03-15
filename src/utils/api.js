import axios from 'axios';

// Configure axios defaults
const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add auth token to requests if available
API.interceptors.request.use(config => {
  const token = localStorage.getItem('token') || localStorage.getItem('sellerToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, error => {
  return Promise.reject(error);
});

// Function to handle API errors
const handleError = (error) => {
  console.error('API Error:', error);
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    console.error('Response data:', error.response.data);
    console.error('Status code:', error.response.status);
    return { 
      error: true, 
      message: error.response.data.message || 'Server error occurred',
      status: error.response.status
    };
  } else if (error.request) {
    // The request was made but no response was received
    console.error('No response received:', error.request);
    return { 
      error: true, 
      message: 'No response from server. Please check your connection.'
    };
  } else {
    // Something happened in setting up the request that triggered an Error
    console.error('Request error:', error.message);
    return { 
      error: true, 
      message: 'Error setting up request: ' + error.message
    };
  }
};

// Product API calls
export const ProductAPI = {
  // Get all products with optional filters
  getProducts: async (filters = {}) => {
    try {
      // Use localStorage as fallback if API fails
      try {
        const queryParams = new URLSearchParams(filters).toString();
        const response = await API.get(`/products?${queryParams}`);
        // Save to localStorage as cache
        localStorage.setItem('shopProducts', JSON.stringify(response.data));
        return { success: true, data: response.data };
      } catch (error) {
        console.warn('API fetch failed, using localStorage fallback');
        const shopProducts = localStorage.getItem('shopProducts');
        const sellerProducts = localStorage.getItem('sellerProducts');
        
        if (shopProducts) {
          return { success: true, data: JSON.parse(shopProducts), isOffline: true };
        } else if (sellerProducts) {
          return { success: true, data: JSON.parse(sellerProducts), isOffline: true };
        }
        return { success: false, error: 'Products not available' };
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      return handleError(error);
    }
  },
  
  // Get a single product by ID
  getProductById: async (productId) => {
    try {
      // Use localStorage as fallback if API fails
      try {
        const response = await API.get(`/products/${productId}`);
        return { success: true, data: response.data };
      } catch (error) {
        console.warn('API fetch failed, using localStorage fallback');
        const shopProducts = JSON.parse(localStorage.getItem('shopProducts') || '[]');
        const product = shopProducts.find(p => p.id === productId || p._id === productId);
        
        if (product) {
          return { success: true, data: product, isOffline: true };
        }
        return { success: false, error: 'Product not found' };
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      return handleError(error);
    }
  },
  
  // Get products by seller ID
  getProductsBySeller: async (sellerId) => {
    try {
      // Use localStorage as fallback if API fails
      try {
        const response = await API.get(`/products/seller/${sellerId}`);
        return { success: true, data: response.data };
      } catch (error) {
        console.warn('API fetch failed, using localStorage fallback');
        const shopProducts = JSON.parse(localStorage.getItem('shopProducts') || '[]');
        const sellerProducts = shopProducts.filter(p => p.sellerId === sellerId);
        
        return { success: true, data: sellerProducts, isOffline: true };
      }
    } catch (error) {
      console.error('Error fetching seller products:', error);
      return handleError(error);
    }
  },
  
  // Add a new product
  addProduct: async (productData) => {
    try {
      // Try to add via API
      try {
        const response = await API.post('/products', productData);
        
        // Update localStorage
        this.updateLocalStorageProduct(response.data, 'add');
        
        return { success: true, data: response.data };
      } catch (error) {
        // Fallback to localStorage only
        console.warn('API failed, using localStorage fallback');
        
        // Generate a unique ID for the product
        const productId = 'product_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        
        // Create new product
        const newProduct = {
          ...productData,
          id: productId,
          _id: productId,
          createdAt: new Date().toISOString(),
          stock: parseInt(productData.stock) || 10,
          inStock: parseInt(productData.stock) > 0 || productData.inStock === true
        };
        
        this.updateLocalStorageProduct(newProduct, 'add');
        
        return { success: true, data: newProduct, isOffline: true };
      }
    } catch (error) {
      console.error('Error adding product:', error);
      return handleError(error);
    }
  },
  
  // Update a product
  updateProduct: async (productId, productData) => {
    try {
      // Try to update via API
      try {
        const response = await API.put(`/products/${productId}`, productData);
        
        // Update localStorage
        this.updateLocalStorageProduct(response.data, 'update');
        
        return { success: true, data: response.data };
      } catch (error) {
        // Fallback to localStorage only
        console.warn('API failed, using localStorage fallback');
        
        const shopProducts = JSON.parse(localStorage.getItem('shopProducts') || '[]');
        const existingIndex = shopProducts.findIndex(p => p.id === productId || p._id === productId);
        
        if (existingIndex === -1) {
          return { success: false, error: 'Product not found' };
        }
        
        // Update stock and inStock properties
        const updatedProduct = {
          ...shopProducts[existingIndex],
          ...productData,
          stock: parseInt(productData.stock) || shopProducts[existingIndex].stock,
          inStock: (parseInt(productData.stock) > 0) || productData.inStock === true
        };
        
        this.updateLocalStorageProduct(updatedProduct, 'update');
        
        return { success: true, data: updatedProduct, isOffline: true };
      }
    } catch (error) {
      console.error('Error updating product:', error);
      return handleError(error);
    }
  },
  
  // Delete a product
  deleteProduct: async (productId) => {
    try {
      // Try to delete via API
      try {
        await API.delete(`/products/${productId}`);
        
        // Update localStorage
        this.updateLocalStorageProduct({ id: productId }, 'delete');
        
        return { success: true };
      } catch (error) {
        // Fallback to localStorage only
        console.warn('API failed, using localStorage fallback');
        
        this.updateLocalStorageProduct({ id: productId }, 'delete');
        
        return { success: true, isOffline: true };
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      return handleError(error);
    }
  },
  
  // Handle localStorage updates for products
  updateLocalStorageProduct: (product, action) => {
    try {
      // Update shopProducts
      const shopProducts = JSON.parse(localStorage.getItem('shopProducts') || '[]');
      
      if (action === 'add') {
        shopProducts.push(product);
      } else if (action === 'update') {
        const index = shopProducts.findIndex(p => p.id === product.id || p._id === product.id);
        if (index !== -1) {
          shopProducts[index] = product;
        }
      } else if (action === 'delete') {
        const filteredProducts = shopProducts.filter(p => p.id !== product.id && p._id !== product.id);
        localStorage.setItem('shopProducts', JSON.stringify(filteredProducts));
        
        // Also update sellerProducts
        const sellerProducts = JSON.parse(localStorage.getItem('sellerProducts') || '[]');
        const filteredSellerProducts = sellerProducts.filter(p => p.id !== product.id && p._id !== product.id);
        localStorage.setItem('sellerProducts', JSON.stringify(filteredSellerProducts));
        
        // Notify other components
        window.dispatchEvent(new Event('storage'));
        return;
      }
      
      localStorage.setItem('shopProducts', JSON.stringify(shopProducts));
      
      // If it's a seller product, also update sellerProducts
      if (product.sellerId || product.isSeller) {
        const sellerProducts = JSON.parse(localStorage.getItem('sellerProducts') || '[]');
        
        if (action === 'add') {
          sellerProducts.push(product);
        } else if (action === 'update') {
          const index = sellerProducts.findIndex(p => p.id === product.id || p._id === product.id);
          if (index !== -1) {
            sellerProducts[index] = product;
          }
        }
        
        localStorage.setItem('sellerProducts', JSON.stringify(sellerProducts));
      }
      
      // Notify other components
      window.dispatchEvent(new Event('storage'));
    } catch (error) {
      console.error('Error updating localStorage:', error);
    }
  }
};

// Cart API calls
export const CartAPI = {
  // Get cart for current user
  getCart: async (userId) => {
    try {
      if (!userId) {
        return { success: false, message: 'User ID is required' };
      }
      
      // In real implementation, would call API
      // For now, use localStorage with new structure
      try {
        const response = await API.get(`/cart/${userId}`);
        return { success: true, data: response.data };
      } catch (error) {
        console.warn('API fetch failed, using localStorage fallback');
        const savedCart = localStorage.getItem(`cart_${userId}`);
        const cartData = savedCart ? JSON.parse(savedCart) : { items: [] };
        
        return { success: true, data: cartData, isOffline: true };
      }
    } catch (error) {
      console.error('Error getting cart:', error);
      return handleError(error);
    }
  },
  
  // Add item to cart
  addToCart: async (userId, productId, quantity = 1) => {
    try {
      if (!userId) {
        return { success: false, message: 'User ID is required' };
      }
      
      try {
        const response = await API.post(`/cart/add`, { userId, productId, quantity });
        return { success: true, data: response.data };
      } catch (error) {
        console.warn('API call failed, using localStorage fallback');
        
        // Get product details
        const { success, data } = await ProductAPI.getProductById(productId);
        
        if (!success) {
          return { success: false, message: 'Product not found' };
        }
        
        // Get current cart
        const savedCart = localStorage.getItem(`cart_${userId}`);
        const cartData = savedCart ? JSON.parse(savedCart) : { items: [] };
        
        // Check if product is already in cart
        const existingItemIndex = cartData.items.findIndex(item => item.productId === productId);
        
        if (existingItemIndex >= 0) {
          // Update quantity
          cartData.items[existingItemIndex].quantity += quantity;
        } else {
          // Add new item
          cartData.items.push({
            productId,
            quantity,
            addedAt: new Date().toISOString()
          });
        }
        
        // Update stock
        const currentStock = data.stock || 0;
        if (currentStock < quantity) {
          return { success: false, message: 'Not enough stock available' };
        }
        
        // Save cart
        localStorage.setItem(`cart_${userId}`, JSON.stringify(cartData));
        
        // Update product stock
        await ProductAPI.updateProduct(productId, {
          ...data,
          stock: currentStock - quantity
        });
        
        return { success: true, data: cartData };
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      return handleError(error);
    }
  },
  
  // Remove from cart
  removeFromCart: async (userId, productId) => {
    try {
      if (!userId) {
        return { success: false, message: 'User ID is required' };
      }
      
      try {
        const response = await API.delete(`/cart/item`, { data: { userId, productId } });
        return { success: true, data: response.data };
      } catch (error) {
        console.warn('API call failed, using localStorage fallback');
        
        // Get current cart
        const savedCart = localStorage.getItem(`cart_${userId}`);
        if (!savedCart) {
          return { success: false, message: 'Cart not found' };
        }
        
        const cartData = JSON.parse(savedCart);
        
        // Find item
        const itemIndex = cartData.items.findIndex(item => item.productId === productId);
        if (itemIndex === -1) {
          return { success: false, message: 'Item not found in cart' };
        }
        
        // Get quantity before removing
        const removedQuantity = cartData.items[itemIndex].quantity;
        
        // Remove item
        cartData.items.splice(itemIndex, 1);
        
        // Save cart
        localStorage.setItem(`cart_${userId}`, JSON.stringify(cartData));
        
        // Restore product stock
        const { success, data } = await ProductAPI.getProductById(productId);
        if (success) {
          await ProductAPI.updateProduct(productId, {
            ...data,
            stock: (data.stock || 0) + removedQuantity
          });
        }
        
        return { success: true, data: cartData };
      }
    } catch (error) {
      console.error('Error removing from cart:', error);
      return handleError(error);
    }
  },
  
  // Update quantity
  updateQuantity: async (userId, productId, quantity) => {
    try {
      if (!userId) {
        return { success: false, message: 'User ID is required' };
      }
      
      if (quantity <= 0) {
        return CartAPI.removeFromCart(userId, productId);
      }
      
      try {
        const response = await API.patch(`/cart/update`, { userId, productId, quantity });
        return { success: true, data: response.data };
      } catch (error) {
        console.warn('API call failed, using localStorage fallback');
        
        // Get current cart
        const savedCart = localStorage.getItem(`cart_${userId}`);
        if (!savedCart) {
          return { success: false, message: 'Cart not found' };
        }
        
        const cartData = JSON.parse(savedCart);
        
        // Find item
        const itemIndex = cartData.items.findIndex(item => item.productId === productId);
        if (itemIndex === -1) {
          return { success: false, message: 'Item not found in cart' };
        }
        
        // Get previous quantity
        const previousQuantity = cartData.items[itemIndex].quantity;
        const quantityDiff = quantity - previousQuantity;
        
        // Get product
        const { success, data } = await ProductAPI.getProductById(productId);
        if (!success) {
          return { success: false, message: 'Product not found' };
        }
        
        // Check stock if increasing quantity
        if (quantityDiff > 0) {
          const currentStock = data.stock || 0;
          if (currentStock < quantityDiff) {
            return { success: false, message: 'Not enough stock available' };
          }
        }
        
        // Update quantity
        cartData.items[itemIndex].quantity = quantity;
        
        // Save cart
        localStorage.setItem(`cart_${userId}`, JSON.stringify(cartData));
        
        // Update product stock
        await ProductAPI.updateProduct(productId, {
          ...data,
          stock: (data.stock || 0) - quantityDiff
        });
        
        return { success: true, data: cartData };
      }
    } catch (error) {
      console.error('Error updating quantity:', error);
      return handleError(error);
    }
  },
  
  // Clear cart
  clearCart: async (userId) => {
    try {
      if (!userId) {
        return { success: false, message: 'User ID is required' };
      }
      
      try {
        const response = await API.delete(`/cart/clear/${userId}`);
        return { success: true, data: response.data };
      } catch (error) {
        console.warn('API call failed, using localStorage fallback');
        
        // Get current cart
        const savedCart = localStorage.getItem(`cart_${userId}`);
        if (!savedCart) {
          return { success: true }; // Nothing to clear
        }
        
        const cartData = JSON.parse(savedCart);
        
        // Restore all stock
        for (const item of cartData.items) {
          const { success, data } = await ProductAPI.getProductById(item.productId);
          if (success) {
            await ProductAPI.updateProduct(item.productId, {
              ...data,
              stock: (data.stock || 0) + item.quantity
            });
          }
        }
        
        // Clear cart
        localStorage.removeItem(`cart_${userId}`);
        
        return { success: true };
      }
    } catch (error) {
      console.error('Error clearing cart:', error);
      return handleError(error);
    }
  }
};

// User API functions
export const UserAPI = {
  // Get user profile
  getUserProfile: async (userId) => {
    try {
      const response = await axios.get(`${API.baseURL}/users/${userId}`);
      return { success: true, data: response.data };
    } catch (error) {
      return handleError(error);
    }
  },

  // Update user profile
  updateUserProfile: async (userId, userData) => {
    try {
      const response = await axios.put(`${API.baseURL}/users/${userId}`, userData);
      return { success: true, data: response.data };
    } catch (error) {
      return handleError(error);
    }
  }
};

// Seller API functions
export const SellerAPI = {
  // Get all sellers
  getAllSellers: async () => {
    try {
      const response = await axios.get(`${API.baseURL}/sellers`);
      return { success: true, data: response.data };
    } catch (error) {
      return handleError(error);
    }
  },

  // Get seller by ID
  getSellerById: async (sellerId) => {
    try {
      const response = await axios.get(`${API.baseURL}/sellers/${sellerId}`);
      return { success: true, data: response.data };
    } catch (error) {
      return handleError(error);
    }
  },

  // Add new product as a seller
  addProduct: async (productData) => {
    try {
      const response = await axios.post(`${API.baseURL}/products`, productData);
      return { success: true, data: response.data };
    } catch (error) {
      return handleError(error);
    }
  },

  // Update product as a seller
  updateProduct: async (productId, productData) => {
    try {
      const response = await axios.put(`${API.baseURL}/products/${productId}`, productData);
      return { success: true, data: response.data };
    } catch (error) {
      return handleError(error);
    }
  },

  // Delete product as a seller
  deleteProduct: async (productId) => {
    try {
      const response = await axios.delete(`${API.baseURL}/products/${productId}`);
      return { success: true, data: response.data };
    } catch (error) {
      return handleError(error);
    }
  }
};

export default API; 