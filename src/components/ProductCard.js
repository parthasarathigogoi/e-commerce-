import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const { addToCart, cartItems } = useCart();
  const [isHovered, setIsHovered] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [inStock, setInStock] = useState(true);
  
  // Check stock availability
  useEffect(() => {
    const stock = product.stock !== undefined ? product.stock : 0;
    setInStock(stock > 0);
  }, [cartItems, product]);

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!inStock) return;
    
    setIsAddingToCart(true);
    try {
      const result = await addToCart(product.id || product._id);
      if (!result.success) {
        console.error('Failed to add to cart:', result.message);
        alert(result.message || 'Failed to add to cart');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setIsAddingToCart(false);
    }
  };

  // Format price with currency symbol
  const formatPrice = (price) => {
    return `$${parseFloat(price).toFixed(2)}`;
  };

  // Calculate discount price if available
  const discountedPrice = product.discount 
    ? product.price - (product.price * product.discount / 100)
    : product.price;

  return (
    <div 
      className={`product-card ${!inStock ? 'out-of-stock' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link to={`/products/${product._id || product.id}`} className="product-link">
        <div className="product-image">
          <img src={product.image} alt={product.name} />
          
          {product.discount > 0 && (
            <div className="discount-badge">-{product.discount}%</div>
          )}
          
          {!inStock && (
            <div className="stock-badge">Out of Stock</div>
          )}
        </div>
        
        <div className="product-info">
          <h3 className="product-name">{product.name}</h3>
          
          <div className="product-price">
            {product.discount > 0 && (
              <span className="original-price">{formatPrice(product.price)}</span>
            )}
            <span className="current-price">{formatPrice(discountedPrice)}</span>
          </div>
          
          <div className="product-details">
            {product.rating && (
              <div className="product-rating">
                {Array(5).fill().map((_, i) => (
                  <span key={i} className={i < Math.floor(product.rating) ? 'star filled' : 'star'}>★</span>
                ))}
                <span className="rating-number">({product.rating})</span>
              </div>
            )}
            
            <div className="stock-info">
              {inStock ? (
                <span className="in-stock">In Stock</span>
              ) : (
                <span className="out-of-stock">Out of Stock</span>
              )}
            </div>
          </div>
        </div>
      </Link>
      
      <div className={`add-to-cart-overlay ${isHovered ? 'visible' : ''}`}>
        <button 
          className={`add-to-cart-btn ${isAddingToCart ? 'loading' : ''} ${!inStock ? 'disabled' : ''}`}
          onClick={handleAddToCart}
          disabled={isAddingToCart || !inStock}
        >
          {isAddingToCart ? 'Adding...' : inStock ? 'Add to Cart' : 'Out of Stock'}
        </button>
      </div>
    </div>
  );
};

export default ProductCard; 