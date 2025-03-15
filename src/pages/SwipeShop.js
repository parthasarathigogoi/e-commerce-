import React, { useState, useEffect } from 'react';
import { FaHeart, FaTimes, FaUndo, FaShoppingCart, FaInfoCircle, FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './SwipeShop.css';

// Sample product data (will be replaced with real data)
const sampleProducts = [
  {
    id: 'p1',
    name: 'Premium Leather Watch',
    price: 1299,
    description: 'Handcrafted premium leather watch with Swiss movement. Perfect for any occasion.',
    image: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1180&q=80',
    category: 'Watches',
    rating: 4.8,
    inStock: true,
    isNew: true,
    isTrending: true,
    discount: 0
  },
  {
    id: 'p2',
    name: 'Designer Silk Dress',
    price: 2499,
    description: 'Elegant silk dress designed by top fashion designers. Perfect for formal events.',
    image: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1180&q=80',
    category: 'Clothing',
    rating: 4.7,
    inStock: true,
    isNew: true,
    isTrending: false,
    discount: 10
  },
  {
    id: 'p3',
    name: 'Luxury Perfume',
    price: 899,
    description: 'Exquisite fragrance with notes of jasmine, rose, and sandalwood. Long-lasting scent.',
    image: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1180&q=80',
    category: 'Perfumes',
    rating: 4.9,
    inStock: true,
    isNew: false,
    isTrending: true,
    discount: 0
  },
  {
    id: 'p4',
    name: 'Italian Leather Belt',
    price: 599,
    description: 'Handmade Italian leather belt with premium buckle. Classic design for any outfit.',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1180&q=80',
    category: 'Belts',
    rating: 4.6,
    inStock: true,
    isNew: false,
    isTrending: false,
    discount: 15
  },
  {
    id: 'p5',
    name: 'Smart Fitness Watch',
    price: 1499,
    description: 'Advanced fitness tracker with heart rate monitoring, GPS, and sleep analysis.',
    image: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1180&q=80',
    category: 'Watches',
    rating: 4.5,
    inStock: true,
    isNew: true,
    isTrending: true,
    discount: 5
  },
  {
    id: 'p6',
    name: 'Designer Sunglasses',
    price: 799,
    description: 'Premium UV protection sunglasses with polarized lenses and designer frames.',
    image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1180&q=80',
    category: 'Accessories',
    rating: 4.7,
    inStock: true,
    isNew: false,
    isTrending: true,
    discount: 0
  },
  {
    id: 'p7',
    name: 'Premium Leather Wallet',
    price: 399,
    description: 'Handcrafted genuine leather wallet with multiple card slots and RFID protection.',
    image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1180&q=80',
    category: 'Accessories',
    rating: 4.8,
    inStock: true,
    isNew: false,
    isTrending: false,
    discount: 0
  },
  {
    id: 'p8',
    name: 'Cashmere Scarf',
    price: 699,
    description: 'Luxuriously soft 100% cashmere scarf. Perfect for cold weather and elegant occasions.',
    image: 'https://images.unsplash.com/photo-1584736286279-75260e512faf?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1180&q=80',
    category: 'Clothing',
    rating: 4.6,
    inStock: true,
    isNew: true,
    isTrending: false,
    discount: 0
  }
];

const SwipeShop = () => {
  const [products, setProducts] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [likedProducts, setLikedProducts] = useState([]);
  const [showDetails, setShowDetails] = useState(false);
  const [loading, setLoading] = useState(true);
  const [lastDirection, setLastDirection] = useState(null);
  const [animation, setAnimation] = useState('');
  const navigate = useNavigate();
  const { addToCart } = useCart();

  // Load products from localStorage and combine with sample products
  useEffect(() => {
    const loadProducts = () => {
      setLoading(true);
      try {
        // Get seller products from localStorage
        const sellerProductsString = localStorage.getItem('sellerProducts');
        let sellerProducts = [];
        
        if (sellerProductsString) {
          const parsedProducts = JSON.parse(sellerProductsString);
          if (Array.isArray(parsedProducts)) {
            // Ensure all seller products have required fields
            sellerProducts = parsedProducts.map(product => ({
              ...product,
              inStock: product.inStock !== undefined ? product.inStock : true,
              isNew: product.isNew !== undefined ? product.isNew : false,
              isTrending: product.isTrending !== undefined ? product.isTrending : false,
              discount: product.discount !== undefined ? product.discount : 0,
              rating: product.rating !== undefined ? product.rating : 4.0,
              isSeller: true // Mark as seller product
            }));
          }
        }
        
        // Combine seller products with sample products
        const allProducts = [...sellerProducts, ...sampleProducts];
        
        // Shuffle the products
        const shuffledProducts = allProducts.sort(() => 0.5 - Math.random());
        
        setProducts(shuffledProducts);
        
        // Store all products in localStorage for cart system to access
        const shopProductsString = localStorage.getItem('shopProducts');
        if (!shopProductsString) {
          localStorage.setItem('shopProducts', JSON.stringify([...sampleProducts, ...sellerProducts]));
        } else {
          // Merge with existing shop products
          const existingShopProducts = JSON.parse(shopProductsString);
          
          // Create a map of existing product IDs
          const existingProductIds = new Set(existingShopProducts.map(p => p.id));
          
          // Add only new products that don't already exist
          const newProducts = sampleProducts.filter(p => !existingProductIds.has(p.id));
          
          if (newProducts.length > 0) {
            localStorage.setItem('shopProducts', JSON.stringify([...existingShopProducts, ...newProducts]));
          }
        }
      } catch (error) {
        console.error('Error loading products:', error);
        // Fallback to sample products if there's an error
        setProducts(sampleProducts);
        
        // Store sample products in localStorage for cart system
        localStorage.setItem('shopProducts', JSON.stringify(sampleProducts));
      } finally {
        setLoading(false);
      }
    };
    
    loadProducts();
  }, []);

  // Handle swipe left
  const handleSwipeLeft = () => {
    if (currentIndex >= products.length - 1) return;
    
    setAnimation('swipe-left');
    setLastDirection('left');
    
    setTimeout(() => {
      setCurrentIndex(currentIndex + 1);
      setAnimation('');
    }, 300);
  };

  // Handle swipe right
  const handleSwipeRight = () => {
    if (currentIndex >= products.length - 1) return;
    
    const product = products[products.length - 1 - currentIndex];
    setLikedProducts(prev => [...prev, product]);
    setAnimation('swipe-right');
    setLastDirection('right');
    
    // Show a notification
    showNotification(`You liked ${product.name}!`);
    
    setTimeout(() => {
      setCurrentIndex(currentIndex + 1);
      setAnimation('');
    }, 300);
  };

  // Handle undo button
  const handleUndo = () => {
    if (currentIndex <= 0) return;
    
    setCurrentIndex(currentIndex - 1);
    
    // If the last action was a like, remove the product from liked products
    if (lastDirection === 'right') {
      setLikedProducts(prev => prev.slice(0, -1));
    }
    
    setLastDirection(null);
  };

  // Show notification
  const showNotification = (message) => {
    const notification = document.createElement('div');
    notification.className = 'swipe-notification';
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

  // Add current product to cart
  const handleAddToCart = () => {
    if (currentIndex < products.length) {
      const product = products[products.length - 1 - currentIndex];
      
      // Make sure the product has an id property
      const productToAdd = {
        ...product,
        id: product.id || product._id // Ensure we have an id property
      };
      
      const result = addToCart(productToAdd);
      
      if (result.success) {
        showNotification(`${product.name} added to cart!`);
      } else {
        showNotification(result.message || 'Could not add to cart');
      }
    }
  };

  // Toggle product details
  const toggleDetails = () => {
    setShowDetails(!showDetails);
  };

  // View all liked products
  const viewLikedProducts = () => {
    // Store liked products in localStorage
    localStorage.setItem('likedProducts', JSON.stringify(likedProducts));
    // Navigate to a page that shows liked products
    navigate('/liked-products');
  };

  // Get current product
  const getCurrentProduct = () => {
    if (currentIndex < products.length) {
      return products[products.length - 1 - currentIndex];
    }
    return null;
  };

  const currentProduct = getCurrentProduct();

  return (
    <div className="swipe-shop-container">
      <div className="swipe-shop-header">
        <h1>Swipe Shop</h1>
        <p>Swipe right to like, left to pass</p>
      </div>
      
      {loading ? (
        <div className="swipe-loading">
          <div className="swipe-spinner"></div>
          <p>Loading products...</p>
        </div>
      ) : currentIndex >= products.length ? (
        <div className="no-more-products">
          <h2>No more products to show!</h2>
          <p>You've swiped through all available products.</p>
          {likedProducts.length > 0 && (
            <button className="view-liked-button" onClick={viewLikedProducts}>
              View {likedProducts.length} Liked Products
            </button>
          )}
          <button className="restart-button" onClick={() => window.location.reload()}>
            Start Over
          </button>
        </div>
      ) : (
        <>
          <div className="swipe-card-container">
            <div className={`simple-card ${animation}`}>
              {currentProduct && (
                <div 
                  className={`card-content ${showDetails ? 'show-details' : ''}`}
                  style={{ backgroundImage: `url(${currentProduct.image})` }}
                >
                  {currentProduct.isSeller && (
                    <div className="seller-badge">Seller Product</div>
                  )}
                  
                  {currentProduct.discount > 0 && (
                    <div className="discount-badge">{currentProduct.discount}% OFF</div>
                  )}
                  
                  <div className="card-info">
                    <h2>{currentProduct.name}</h2>
                    <div className="price-container">
                      {currentProduct.discount > 0 ? (
                        <>
                          <span className="original-price">{formatPrice(currentProduct.price)}</span>
                          <span className="discounted-price">
                            {formatPrice(calculateDiscountedPrice(currentProduct.price, currentProduct.discount))}
                          </span>
                        </>
                      ) : (
                        <span className="price">{formatPrice(currentProduct.price)}</span>
                      )}
                    </div>
                    
                    {showDetails && (
                      <div className="product-details">
                        <p className="product-description">{currentProduct.description}</p>
                        <div className="product-meta">
                          <span className="category">{currentProduct.category}</span>
                          <span className="rating">★ {currentProduct.rating}</span>
                        </div>
                        {currentProduct.isNew && <span className="tag new-tag">New</span>}
                        {currentProduct.isTrending && <span className="tag trending-tag">Trending</span>}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div className="swipe-actions">
            <button className="swipe-button dislike" onClick={handleSwipeLeft}>
              <FaTimes />
            </button>
            <button className="swipe-button info" onClick={toggleDetails}>
              <FaInfoCircle />
            </button>
            <button className="swipe-button undo" onClick={handleUndo} disabled={currentIndex === 0}>
              <FaUndo />
            </button>
            <button className="swipe-button cart" onClick={handleAddToCart}>
              <FaShoppingCart />
            </button>
            <button className="swipe-button like" onClick={handleSwipeRight}>
              <FaHeart />
            </button>
          </div>
          
          <div className="swipe-progress">
            <div className="swipe-progress-text">
              {currentIndex + 1} of {products.length}
            </div>
            <div className="swipe-progress-bar">
              <div 
                className="swipe-progress-fill" 
                style={{ width: `${(currentIndex / products.length) * 100}%` }}
              ></div>
            </div>
          </div>
          
          {likedProducts.length > 0 && (
            <button className="view-liked-button liked-count" onClick={viewLikedProducts}>
              View {likedProducts.length} Liked Products
            </button>
          )}
          
          {lastDirection && (
            <div className="swipe-direction">
              You swiped {lastDirection}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SwipeShop; 