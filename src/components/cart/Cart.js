import React from 'react';
import { FaTimes, FaPlus, FaMinus, FaLongArrowAltLeft } from 'react-icons/fa';
import { useCart } from '../../context/CartContext';
import './Cart.css';

const Cart = ({ isOpen, onClose }) => {
  const { cartItems, cartProducts, cartQuantity, cartTotal, updateQuantity, removeFromCart, clearCart, loading } = useCart();

  if (!isOpen) return null;

  const handleUpdateQuantity = async (productId, newQuantity) => {
    if (newQuantity < 1) return;
    
    const result = await updateQuantity(productId, newQuantity);
    if (!result.success) {
      alert(result.message || 'Failed to update quantity');
    }
  };

  const handleRemoveItem = async (productId) => {
    const result = await removeFromCart(productId);
    if (!result.success) {
      alert(result.message || 'Failed to remove item');
    }
  };

  const handleClearCart = async () => {
    const result = await clearCart();
    if (!result.success) {
      alert(result.message || 'Failed to clear cart');
    }
  };

  const getProductDetails = (productId) => {
    return cartProducts.find(p => p.id === productId) || {};
  };

  return (
    <div className="cart-overlay" onClick={onClose}>
      <div className="cart-modal" onClick={e => e.stopPropagation()}>
        <div className="cart-header">
          <h2>Your Cart ({cartQuantity})</h2>
          <button className="close-button" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <div className="cart-items">
          {loading ? (
            <div className="cart-loading">Loading your cart...</div>
          ) : cartItems.length === 0 ? (
            <div className="empty-cart">
              <p>Your cart is empty</p>
              <button className="continue-shopping-btn" onClick={onClose}>
                <FaLongArrowAltLeft /> Continue Shopping
              </button>
            </div>
          ) : (
            <>
              {cartItems.map(item => {
                const product = getProductDetails(item.productId);
                return (
                  <div className="cart-item" key={item.productId}>
                    <div className="item-image">
                      <img src={product.image || 'https://via.placeholder.com/80'} alt={product.name || 'Product'} />
                    </div>
                    <div className="item-details">
                      <h3>{product.name || 'Product'}</h3>
                      <p className="item-price">${product.price ? product.price.toFixed(2) : '0.00'}</p>
                    </div>
                    <div className="item-quantity">
                      <button 
                        className="quantity-btn"
                        onClick={() => handleUpdateQuantity(item.productId, item.quantity - 1)}
                      >
                        <FaMinus />
                      </button>
                      <span>{item.quantity}</span>
                      <button 
                        className="quantity-btn"
                        onClick={() => handleUpdateQuantity(item.productId, item.quantity + 1)}
                      >
                        <FaPlus />
                      </button>
                    </div>
                    <button 
                      className="remove-btn"
                      onClick={() => handleRemoveItem(item.productId)}
                    >
                      <FaTimes />
                    </button>
                  </div>
                );
              })}
              <div className="cart-actions">
                <button className="clear-cart-btn" onClick={handleClearCart}>Clear Cart</button>
              </div>
            </>
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="cart-footer">
            <div className="cart-total">
              <span>Total:</span>
              <span>${cartTotal.toFixed(2)}</span>
            </div>
            <button className="checkout-btn">Proceed to Checkout</button>
          </div>
        )}
        
        {cartItems.length === 0 && (
          <div className="cart-footer empty">
            <button className="cart-close-btn" onClick={onClose}>Close</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart; 