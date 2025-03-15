import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthContext } from '../App';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [products, setProducts] = useState([]);
  const { isAuthenticated, user } = useContext(AuthContext);

  // Load cart items from localStorage when component mounts
  useEffect(() => {
    const savedCart = isAuthenticated && user 
      ? localStorage.getItem(`cart_${user.id}`)
      : localStorage.getItem('guest_cart');
      
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
    
    // Load products from localStorage
    try {
      const shopProducts = localStorage.getItem('shopProducts');
      const sellerProducts = localStorage.getItem('sellerProducts');
      
      if (shopProducts) {
        setProducts(JSON.parse(shopProducts));
      } else if (sellerProducts) {
        setProducts(JSON.parse(sellerProducts));
      }
    } catch (error) {
      console.error('Error loading products:', error);
    }
  }, [isAuthenticated, user]);

  // Save cart items to localStorage whenever they change
  useEffect(() => {
    if (isAuthenticated && user) {
      localStorage.setItem(`cart_${user.id}`, JSON.stringify(cartItems));
    } else {
      localStorage.setItem('guest_cart', JSON.stringify(cartItems));
    }
  }, [cartItems, isAuthenticated, user]);
  
  // Listen for changes in the products data
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'shopProducts' || e.key === 'sellerProducts') {
        try {
          const updatedProducts = JSON.parse(e.newValue);
          setProducts(updatedProducts);
        } catch (error) {
          console.error('Error parsing products data:', error);
        }
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Update products in localStorage
  const updateProductsInStorage = (updatedProducts) => {
    try {
      // Update both shopProducts and sellerProducts to ensure consistency
      localStorage.setItem('shopProducts', JSON.stringify(updatedProducts));
      localStorage.setItem('sellerProducts', JSON.stringify(updatedProducts));
      
      // Notify other components about the change
      window.dispatchEvent(new Event('storage'));
      
      setProducts(updatedProducts);
    } catch (error) {
      console.error('Error updating products in storage:', error);
    }
  };

  const addToCart = (product) => {
    // First, check if we have enough stock
    const currentProduct = products.find(p => p.id === product.id || p._id === product.id);
    
    if (!currentProduct) {
      console.error('Product not found in inventory');
      return { success: false, message: 'Product not found' };
    }
    
    // Get current stock - either from stock property or convert inStock boolean to number
    const currentStock = typeof currentProduct.stock === 'number' 
      ? currentProduct.stock 
      : (currentProduct.inStock ? 10 : 0); // Default to 10 if inStock is true
    
    // Check if the item is already in cart
    const existingCartItem = cartItems.find(item => item.id === product.id);
    const cartQuantity = existingCartItem ? existingCartItem.quantity : 0;
    
    // Check if we're trying to add more than available
    if (cartQuantity >= currentStock) {
      return { success: false, message: 'Not enough stock available' };
    }
    
    // Update cart
    setCartItems(prevItems => {
      if (existingCartItem) {
        return prevItems.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevItems, { ...product, quantity: 1 }];
    });
    
    // Update product stock in localStorage
    const updatedProducts = products.map(p => {
      if (p.id === product.id || p._id === product.id) {
        // If product has stock property, decrement it
        if (typeof p.stock === 'number') {
          const newStock = p.stock - 1;
          return { 
            ...p, 
            stock: newStock,
            inStock: newStock > 0
          };
        } 
        // Otherwise, update the inStock flag if we've taken all items
        else if (cartQuantity + 1 >= 10) { // Default max of 10 if just using inStock flag
          return { ...p, inStock: false };
        }
      }
      return p;
    });
    
    updateProductsInStorage(updatedProducts);
    
    return { success: true, message: 'Product added to cart' };
  };

  const removeFromCart = (productId) => {
    // Find the cart item to get its quantity
    const cartItem = cartItems.find(item => item.id === productId);
    
    if (!cartItem) {
      return;
    }
    
    // Remove from cart
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
    
    // Restore stock in products
    const updatedProducts = products.map(p => {
      if (p.id === productId || p._id === productId) {
        // If product has stock property, increment it by the cart quantity
        if (typeof p.stock === 'number') {
          const newStock = p.stock + cartItem.quantity;
          return { 
            ...p, 
            stock: newStock,
            inStock: true
          };
        } 
        // Otherwise, just set inStock back to true
        else {
          return { ...p, inStock: true };
        }
      }
      return p;
    });
    
    updateProductsInStorage(updatedProducts);
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(productId);
      return { success: true };
    }
    
    // Find current product in inventory
    const currentProduct = products.find(p => p.id === productId || p._id === productId);
    
    if (!currentProduct) {
      return { success: false, message: 'Product not found' };
    }
    
    // Get current stock
    const currentStock = typeof currentProduct.stock === 'number' 
      ? currentProduct.stock 
      : (currentProduct.inStock ? 10 : 0);
    
    // Find existing cart item
    const existingCartItem = cartItems.find(item => item.id === productId);
    
    if (!existingCartItem) {
      return { success: false, message: 'Item not in cart' };
    }
    
    const currentQuantity = existingCartItem.quantity;
    
    // Calculate available stock (what's in inventory + what's already in our cart)
    const availableStock = currentStock + currentQuantity;
    
    // Check if we're trying to add more than available
    if (newQuantity > availableStock) {
      return { success: false, message: 'Not enough stock available' };
    }
    
    // Update cart quantity
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === productId
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
    
    // Update product stock
    const stockDifference = currentQuantity - newQuantity; // Positive if reducing cart, negative if increasing
    
    const updatedProducts = products.map(p => {
      if (p.id === productId || p._id === productId) {
        // If product has stock property, adjust it
        if (typeof p.stock === 'number') {
          const newStock = p.stock + stockDifference;
          return { 
            ...p, 
            stock: newStock,
            inStock: newStock > 0
          };
        } 
        // Otherwise, update the inStock flag based on cart quantity
        else {
          const wouldBeOutOfStock = newQuantity >= 10; // Default max of 10
          return { ...p, inStock: !wouldBeOutOfStock };
        }
      }
      return p;
    });
    
    updateProductsInStorage(updatedProducts);
    
    return { success: true };
  };

  const clearCart = () => {
    // Restore all stock from cart items
    const updatedProducts = [...products];
    
    cartItems.forEach(item => {
      const productIndex = updatedProducts.findIndex(p => p.id === item.id || p._id === item.id);
      
      if (productIndex !== -1) {
        const product = updatedProducts[productIndex];
        
        // If product has stock property, restore it
        if (typeof product.stock === 'number') {
          updatedProducts[productIndex] = {
            ...product,
            stock: product.stock + item.quantity,
            inStock: true
          };
        } 
        // Otherwise, just set inStock back to true
        else {
          updatedProducts[productIndex] = {
            ...product,
            inStock: true
          };
        }
      }
    });
    
    updateProductsInStorage(updatedProducts);
    
    // Clear cart
    setCartItems([]);
    if (isAuthenticated && user) {
      localStorage.removeItem(`cart_${user.id}`);
    } else {
      localStorage.removeItem('guest_cart');
    }
  };

  const getCartCount = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };
  
  const getProductStock = (productId) => {
    const product = products.find(p => p.id === productId || p._id === productId);
    
    if (!product) {
      return 0;
    }
    
    // Return stock based on product data
    return typeof product.stock === 'number' 
      ? product.stock 
      : (product.inStock ? 10 : 0);  // Default of 10 for inStock true
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      products,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getCartCount,
      getCartTotal,
      getProductStock
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export default CartContext; 