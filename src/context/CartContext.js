import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthContext } from '../App';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const { isAuthenticated, user } = useContext(AuthContext);

  // Load cart items from localStorage when component mounts
  useEffect(() => {
    const savedCart = isAuthenticated && user 
      ? localStorage.getItem(`cart_${user.id}`)
      : localStorage.getItem('guest_cart');
      
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
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

  const addToCart = (product) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      if (existingItem) {
        return prevItems.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevItems, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(productId);
      return;
    }
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === productId
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  const clearCart = () => {
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

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getCartCount,
      getCartTotal
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