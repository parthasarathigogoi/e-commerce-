import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaArrowLeft, FaShoppingCart, FaTrash } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import './LikedProducts.css';

const LikedProducts = () => {
  const [likedProducts, setLikedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    // Load liked products from localStorage
    const loadLikedProducts = () => {
      setLoading(true);
      try {
        const likedProductsString = localStorage.getItem('likedProducts');
        if (likedProductsString) {
          const parsedProducts = JSON.parse(likedProductsString);
          if (Array.isArray(parsedProducts)) {
            setLikedProducts(parsedProducts);
          }
        }
      } catch (error) {
        console.error('Error loading liked products:', error);
      } finally {
        setLoading(false);
      }
    };

    loadLikedProducts();
  }, []);

  // Format price
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  // Calculate discounted price
  const calculateDiscountedPrice = (price, discount) => {
    if (!discount) return price;
    return price - (price * (discount / 100));
  };

  // Add product to cart
  const handleAddToCart = (product) => {
    addToCart(product);
    showNotification(`${product.name} added to cart!`);
  };

  // Remove product from liked products
  const handleRemove = (productId) => {
    const updatedProducts = likedProducts.filter(product => product.id !== productId);
    setLikedProducts(updatedProducts);
    localStorage.setItem('likedProducts', JSON.stringify(updatedProducts));
    showNotification('Product removed from liked items');
  };

  // Show notification
  const showNotification = (message) => {
    const notification = document.createElement('div');
    notification.className = 'liked-notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.classList.add('show');
      setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
          document.body.removeChild(notification);
        }, 300);
      }, 2000);
    }, 100);
  };

  return (
    <div className="liked-products-container">
      <div className="liked-products-header">
        <Link to="/swipe-shop" className="back-button">
          <FaArrowLeft /> Back to Swipe Shop
        </Link>
        <h1>Your Liked Products</h1>
        <p>{likedProducts.length} {likedProducts.length === 1 ? 'item' : 'items'}</p>
      </div>

      {loading ? (
        <div className="liked-loading">
          <div className="liked-spinner"></div>
          <p>Loading your liked products...</p>
        </div>
      ) : likedProducts.length === 0 ? (
        <div className="no-liked-products">
          <h2>No liked products yet</h2>
          <p>Go back to the Swipe Shop and swipe right on products you like!</p>
          <Link to="/swipe-shop" className="swipe-more-button">
            Start Swiping
          </Link>
        </div>
      ) : (
        <div className="liked-products-grid">
          {likedProducts.map(product => (
            <div className="liked-product-card" key={product.id}>
              {product.isSeller && (
                <div className="liked-seller-badge">Seller Product</div>
              )}
              
              {product.discount > 0 && (
                <div className="liked-discount-badge">{product.discount}% OFF</div>
              )}
              
              <div className="liked-product-image" style={{ backgroundImage: `url(${product.image})` }}>
                <button 
                  className="liked-remove-button" 
                  onClick={() => handleRemove(product.id)}
                  aria-label="Remove from liked products"
                >
                  <FaTrash />
                </button>
              </div>
              
              <div className="liked-product-info">
                <h3>{product.name}</h3>
                
                <div className="liked-price-container">
                  {product.discount > 0 ? (
                    <>
                      <span className="liked-original-price">{formatPrice(product.price)}</span>
                      <span className="liked-discounted-price">
                        {formatPrice(calculateDiscountedPrice(product.price, product.discount))}
                      </span>
                    </>
                  ) : (
                    <span className="liked-price">{formatPrice(product.price)}</span>
                  )}
                </div>
                
                <div className="liked-product-meta">
                  <span className="liked-category">{product.category}</span>
                  <span className="liked-rating">★ {product.rating}</span>
                </div>
                
                <p className="liked-product-description">{product.description}</p>
                
                <div className="liked-product-tags">
                  {product.isNew && <span className="liked-tag liked-new-tag">New</span>}
                  {product.isTrending && <span className="liked-tag liked-trending-tag">Trending</span>}
                </div>
                
                <button 
                  className="liked-add-to-cart-button" 
                  onClick={() => handleAddToCart(product)}
                >
                  <FaShoppingCart /> Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LikedProducts; 