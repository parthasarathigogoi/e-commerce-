import React, { useState } from 'react';
import { FaCartPlus, FaEye, FaHeart } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import './Product.css';

const Product = ({ product, showQuickView = true }) => {
  const [isHovered, setIsHovered] = useState(false);
  const { addToCart, getCartItem } = useCart();
  const cartItem = getCartItem(product.id);
  const isInCart = !!cartItem;
  const currentStock = product.stock || 0;
  const isOutOfStock = currentStock <= 0;

  const discountedPrice = product.discount 
    ? product.price - (product.price * (product.discount / 100)) 
    : product.price;

  const handleAddToCart = async (e) => {
    e.preventDefault();
    
    if (isOutOfStock) {
      alert('This product is out of stock');
      return;
    }

    const result = await addToCart(product.id);
    if (!result.success) {
      alert(result.message || 'Failed to add to cart');
    }
  };

  return (
    <div 
      className={`product-card ${isOutOfStock ? 'out-of-stock' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="product-image">
        <img src={product.image} alt={product.name} />
        
        {product.discount > 0 && (
          <div className="product-badge">-{product.discount}%</div>
        )}
        
        {isOutOfStock && (
          <div className="stock-badge">Out of Stock</div>
        )}
        
        <div className={`product-actions ${isHovered ? 'visible' : ''}`}>
          <button 
            className={`cart-action ${isInCart ? 'in-cart' : ''} ${isOutOfStock ? 'disabled' : ''}`}
            onClick={handleAddToCart}
            disabled={isOutOfStock}
          >
            <FaCartPlus />
            <span className="tooltip">{isInCart ? 'In Cart' : isOutOfStock ? 'Out of Stock' : 'Add to Cart'}</span>
          </button>
          
          {showQuickView && (
            <Link to={`/products/${product.id}`} className="view-action">
              <FaEye />
              <span className="tooltip">Quick View</span>
            </Link>
          )}
          
          <button className="wishlist-action">
            <FaHeart />
            <span className="tooltip">Add to Wishlist</span>
          </button>
        </div>
      </div>
      
      <div className="product-info">
        <h3 className="product-name">
          <Link to={`/products/${product.id}`}>{product.name}</Link>
        </h3>
        
        <div className="product-seller">
          By {product.seller ? product.seller.name : 'Unknown Seller'}
        </div>
        
        <div className="product-price">
          {product.discount > 0 && (
            <span className="original-price">${product.price.toFixed(2)}</span>
          )}
          <span className="current-price">${discountedPrice.toFixed(2)}</span>
        </div>
        
        <div className="product-stock">
          {isOutOfStock ? (
            <span className="out-of-stock-text">Out of Stock</span>
          ) : (
            <span className="in-stock-text">{currentStock} in stock</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default Product; 