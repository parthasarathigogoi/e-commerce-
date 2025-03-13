import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaHeart, FaEye, FaEllipsisV, FaShare, FaInfoCircle, FaTag, FaShippingFast } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  
  // Format price with currency symbol
  const formatPrice = (price) => {
    return `₹${typeof price === 'number' ? price.toFixed(2) : parseFloat(price).toFixed(2)}`;
  };
  
  // Handle add to cart
  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
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
    
    addToCart(cartProduct);
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
  
  return (
    <Link to={`/product/${product._id || product.id}`} className="product-card-link">
      <div className={`product-card ${product.isTrending ? 'premium-card' : ''}`}>
        {/* Product badges */}
        {product.isNew && <div className="product-badge new-badge">New</div>}
        {product.isTrending && <div className="product-badge trending-badge">Trend</div>}
        {product.discount > 0 && (
          <div className="product-badge discount-badge">-{product.discount}%</div>
        )}
        
        {/* Product image */}
        <div className="product-image-container">
          <img 
            src={product.image} 
            alt={product.name} 
            className="product-image"
            loading="lazy"
          />
          
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
            <span className={product.inStock ? 'in-stock' : 'out-of-stock'}>
              {product.inStock ? 'In Stock' : 'Out of Stock'}
            </span>
          </div>
          
          {/* Add to Cart Button */}
          <button 
            className="add-to-cart-btn"
            onClick={handleAddToCart}
            disabled={!product.inStock}
          >
            <FaShoppingCart /> ADD TO CART
          </button>
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