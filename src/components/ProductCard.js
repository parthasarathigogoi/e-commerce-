import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaHeart, FaEye, FaEllipsisV, FaShare, FaInfoCircle, FaTag, FaShippingFast } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const { addToCart, cartItems, getProductStock } = useCart();
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const [availableStock, setAvailableStock] = useState(0);
  const [notification, setNotification] = useState({show: false, message: '', type: ''});
  
  // Update available stock when cart items or product changes
  useEffect(() => {
    const stock = getProductStock(product._id || product.id);
    setAvailableStock(stock);
  }, [cartItems, product, getProductStock]);
  
  // Format price with currency symbol
  const formatPrice = (price) => {
    return `₹${typeof price === 'number' ? price.toFixed(2) : parseFloat(price).toFixed(2)}`;
  };
  
  // Handle add to cart
  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Check if product is in stock
    if (availableStock <= 0) {
      setNotification({
        show: true,
        message: 'This product is out of stock',
        type: 'error'
      });
      
      // Hide notification after 3 seconds
      setTimeout(() => {
        setNotification({show: false, message: '', type: ''});
      }, 3000);
      
      return;
    }
    
    // Map the product data to match the expected format
    const cartProduct = {
      id: product._id || product.id,
      name: product.name,
      price: product.discount > 0 
        ? product.price * (1 - product.discount / 100)
        : product.price,
      image: product.image,
      description: product.description || '',
      category: product.category || 'Uncategorized'
    };
    
    // Add to cart with inventory check
    const result = addToCart(cartProduct);
    
    if (result.success) {
      setNotification({
        show: true,
        message: 'Added to cart successfully',
        type: 'success'
      });
    } else {
      setNotification({
        show: true,
        message: result.message || 'Failed to add to cart',
        type: 'error'
      });
    }
    
    // Hide notification after 3 seconds
    setTimeout(() => {
      setNotification({show: false, message: '', type: ''});
    }, 3000);
  };
  
  // Handle view product details
  const handleViewProduct = (e) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/product/${product._id || product.id}`);
  };
  
  // Handle add to wishlist
  const handleAddToWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log(`Added ${product.name} to wishlist`);
    // Implement wishlist functionality
  };
  
  // Toggle product menu
  const toggleMenu = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowMenu(!showMenu);
  };
  
  // Get short description from product
  const getShortDescription = () => {
    if (product.description) {
      return product.description.length > 60 
        ? product.description.substring(0, 60) + '...' 
        : product.description;
    }
    return `${product.category || 'Premium'} product`;
  };
  
  // Check if product is out of stock
  const isOutOfStock = availableStock <= 0;
  
  return (
    <Link to={`/product/${product._id || product.id}`} className="product-card-link">
      <div className={`product-card ${product.isTrending ? 'premium-card' : ''}`}>
        {/* Product badges */}
        <div className="product-badges">
          {product.isNew && <div className="product-badge new">New</div>}
          {product.isTrending && <div className="product-badge trending">Trend</div>}
          {product.discount > 0 && (
            <div className="product-badge discount">-{product.discount}%</div>
          )}
        </div>
        
        {/* Product image */}
        <div className="product-image-container">
          <img 
            src={product.image} 
            alt={product.name} 
            className="product-image"
            loading="lazy"
          />
          
          {/* Out of stock overlay */}
          {isOutOfStock && (
            <div className="out-of-stock-overlay">
              <span>Out of Stock</span>
            </div>
          )}
          
          {/* Product actions */}
          <div className="product-actions">
            <button 
              className="action-button wishlist-button"
              onClick={handleAddToWishlist}
              title="Add to Wishlist"
            >
              <FaHeart />
            </button>
            <button 
              className="action-button view-button"
              onClick={handleViewProduct}
              title="Quick View"
            >
              <FaEye />
            </button>
            <button 
              className="action-button menu-button"
              onClick={toggleMenu}
              title="More Options"
            >
              <FaEllipsisV />
            </button>
          </div>
        </div>
        
        {/* Product details */}
        <div className="product-details">
          <h3 className="product-name">{product.name}</h3>
          
          <p className="product-description">{getShortDescription()}</p>
          
          <div className="product-price">
            {product.discount > 0 ? (
              <>
                <span className="original-price">{formatPrice(product.price)}</span>
                <span className="discounted-price">
                  {formatPrice(product.price * (1 - product.discount / 100))}
                </span>
              </>
            ) : (
              <span className="current-price">{formatPrice(product.price)}</span>
            )}
          </div>
          
          <div className="product-rating">
            <div className="stars">
              {[...Array(5)].map((_, i) => (
                <span 
                  key={i} 
                  className={i < Math.floor(product.rating || 0) ? 'star filled' : 'star empty'}
                >
                  {i < Math.floor(product.rating || 0) ? '★' : '☆'}
                </span>
              ))}
            </div>
            <span className="reviews">({product.reviews || 0})</span>
          </div>
          
          {/* Availability indicator */}
          <div className="product-availability">
            <span className={isOutOfStock ? 'out-of-stock' : 'in-stock'}>
              {isOutOfStock ? 'Out of Stock' : `In Stock (${availableStock})`}
            </span>
          </div>
          
          {/* Add to Cart Button */}
          <button 
            className="add-to-cart-btn"
            onClick={handleAddToCart}
            disabled={isOutOfStock}
          >
            <FaShoppingCart /> {isOutOfStock ? 'OUT OF STOCK' : 'ADD TO CART'}
          </button>
          
          {/* Notification */}
          {notification.show && (
            <div className={`product-notification ${notification.type}`}>
              {notification.message}
            </div>
          )}
        </div>
        
        {/* Product menu */}
        {showMenu && (
          <div className="product-menu">
            <div className="menu-header">
              <h4>Quick Options</h4>
              <button className="close-menu" onClick={toggleMenu}>×</button>
            </div>
            <div className="menu-items">
              <div className="menu-item" onClick={handleViewProduct}>
                <FaInfoCircle />
                <span>Product Details</span>
              </div>
              <div className="menu-item">
                <FaTag />
                <span>View Similar</span>
              </div>
              <div className="menu-item">
                <FaShippingFast />
                <span>Shipping Info</span>
              </div>
              <div className="menu-item">
                <FaShare />
                <span>Share Product</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </Link>
  );
};

export default ProductCard; 