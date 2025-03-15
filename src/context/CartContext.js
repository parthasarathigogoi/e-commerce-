import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { CartAPI, ProductAPI } from '../utils/api';

const CartContext = createContext();

export const useCart = () => {
  return useContext(CartContext);
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [cartProducts, setCartProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();

  // Load cart items and product details from API
  useEffect(() => {
    const loadCartData = async () => {
      if (!currentUser) {
        setCartItems([]);
        setCartProducts([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        // Get cart items from API
        const cartResponse = await CartAPI.getCart(currentUser.uid);
        
        if (cartResponse.success && cartResponse.data) {
          setCartItems(cartResponse.data.items || []);
          
          // Fetch product details for each cart item
          const productPromises = cartResponse.data.items.map(item => 
            ProductAPI.getProductById(item.productId)
          );
          
          const productResponses = await Promise.all(productPromises);
          const products = productResponses
            .filter(response => response.success)
            .map(response => response.data);
          
          setCartProducts(products);
        } else {
          console.error("Failed to load cart:", cartResponse.message);
          setCartItems([]);
          setCartProducts([]);
        }
      } catch (error) {
        console.error("Error loading cart:", error);
        setCartItems([]);
        setCartProducts([]);
      } finally {
        setLoading(false);
      }
    };

    loadCartData();
  }, [currentUser]);

  // Add to cart
  const addToCart = async (productId, quantity = 1) => {
    if (!currentUser) {
      console.error("User must be logged in to add items to cart");
      return { success: false, message: "User must be logged in" };
    }

    try {
      const response = await CartAPI.addToCart(currentUser.uid, productId, quantity);
      
      if (response.success) {
        // Reload cart data after successful add
        const cartResponse = await CartAPI.getCart(currentUser.uid);
        if (cartResponse.success) {
          setCartItems(cartResponse.data.items || []);
          
          // Get product details
          const productResponse = await ProductAPI.getProductById(productId);
          if (productResponse.success) {
            setCartProducts(prevProducts => {
              const exists = prevProducts.some(p => p.id === productResponse.data.id);
              if (!exists) {
                return [...prevProducts, productResponse.data];
              }
              return prevProducts;
            });
          }
        }
        return { success: true };
      } else {
        console.error("Failed to add to cart:", response.message);
        return { success: false, message: response.message };
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      return { success: false, message: "Error adding to cart" };
    }
  };

  // Remove from cart
  const removeFromCart = async (productId) => {
    if (!currentUser) {
      console.error("User must be logged in to remove items from cart");
      return { success: false, message: "User must be logged in" };
    }

    try {
      const response = await CartAPI.removeFromCart(currentUser.uid, productId);
      
      if (response.success) {
        // Update local state
        setCartItems(prevItems => prevItems.filter(item => item.productId !== productId));
        return { success: true };
      } else {
        console.error("Failed to remove from cart:", response.message);
        return { success: false, message: response.message };
      }
    } catch (error) {
      console.error("Error removing from cart:", error);
      return { success: false, message: "Error removing from cart" };
    }
  };

  // Update quantity
  const updateQuantity = async (productId, quantity) => {
    if (!currentUser) {
      console.error("User must be logged in to update cart");
      return { success: false, message: "User must be logged in" };
    }
    
    if (quantity <= 0) {
      return removeFromCart(productId);
    }

    try {
      const response = await CartAPI.updateQuantity(currentUser.uid, productId, quantity);
      
      if (response.success) {
        // Update local state
        setCartItems(prevItems => 
          prevItems.map(item => 
            item.productId === productId ? { ...item, quantity } : item
          )
        );
        return { success: true };
      } else {
        console.error("Failed to update quantity:", response.message);
        return { success: false, message: response.message };
      }
    } catch (error) {
      console.error("Error updating quantity:", error);
      return { success: false, message: "Error updating quantity" };
    }
  };

  // Clear cart
  const clearCart = async () => {
    if (!currentUser) {
      console.error("User must be logged in to clear cart");
      return { success: false, message: "User must be logged in" };
    }

    try {
      const response = await CartAPI.clearCart(currentUser.uid);
      
      if (response.success) {
        setCartItems([]);
        return { success: true };
      } else {
        console.error("Failed to clear cart:", response.message);
        return { success: false, message: response.message };
      }
    } catch (error) {
      console.error("Error clearing cart:", error);
      return { success: false, message: "Error clearing cart" };
    }
  };

  // Get cartItem for a specific product
  const getCartItem = (productId) => {
    return cartItems.find(item => item.productId === productId);
  };

  // Calculate cart quantities and totals
  const cartQuantity = cartItems.reduce((total, item) => total + item.quantity, 0);
  
  const cartTotal = cartItems.reduce((total, item) => {
    const product = cartProducts.find(p => p.id === item.productId);
    return total + (product ? product.price * item.quantity : 0);
  }, 0);

  const value = {
    cartItems,
    cartProducts,
    loading,
    cartQuantity,
    cartTotal,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartItem
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export default CartContext; 