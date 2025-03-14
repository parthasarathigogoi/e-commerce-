import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { FaShoppingCart, FaHeart, FaEye, FaFilter, FaChevronDown, FaStar, FaTimes, FaStore } from 'react-icons/fa';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './Shop.css';
import StickyOfferBar from '../components/offers/StickyOfferBar';
import SpecialOffers from '../components/offers/SpecialOffers';
import { useSeller } from '../context/SellerContext';
import ProductCard from '../components/ProductCard';

// Mock product data for premium products
const mockProducts = [
  {
    _id: '1',
    name: 'Luxury Chronograph Watch',
    price: 1299.99,
    description: 'Elegant stainless steel chronograph with sapphire crystal glass',
    image: '/images/electronics.jpg',
    hoverImage: '/images/electronics.jpg', // Ideally a different angle of the same product
    category: 'Watches',
    rating: 4.9,
    reviews: 87,
    inStock: true,
    isNew: false,
    isTrending: true,
    discount: 15
  },
  {
    _id: '2',
    name: 'Designer Silk Dress',
    price: 899.99,
    description: 'Premium silk evening dress with hand-stitched details',
    image: '/images/fashions.jpeg',
    hoverImage: '/images/fashions.jpeg', // Ideally a different angle of the same product
    category: 'Clothes',
    rating: 4.8,
    reviews: 124,
    inStock: true,
    isNew: true,
    isTrending: false,
    discount: 0
  },
  {
    _id: '3',
    name: 'Italian Leather Belt',
    price: 249.99,
    description: 'Handcrafted Italian leather belt with platinum buckle',
    image: '/images/furniture.png',
    category: 'Belts',
    rating: 4.7,
    reviews: 65,
    inStock: true,
    isNew: false,
    isTrending: false,
    discount: 20
  },
  {
    _id: '4',
    name: 'Signature Eau de Parfum',
    price: 189.99,
    description: 'Exclusive fragrance with notes of amber and sandalwood',
    image: '/images/beauty.jpg',
    category: 'Perfumes',
    rating: 4.9,
    reviews: 142,
    inStock: true,
    isNew: false,
    isTrending: true,
    discount: 0
  },
  {
    _id: '5',
    name: 'Handcrafted Oxford Shoes',
    price: 459.99,
    description: 'Premium leather Oxford shoes with Goodyear welt construction',
    image: '/images/mobile.jpg',
    category: 'Shoes',
    rating: 4.8,
    reviews: 78,
    inStock: true,
    isNew: true,
    isTrending: false,
    discount: 10
  },
  {
    _id: '6',
    name: 'Cashmere Sweater',
    price: 349.99,
    description: 'Ultra-soft pure cashmere sweater in classic design',
    image: '/images/fashions.jpeg',
    category: 'Clothes',
    rating: 4.7,
    reviews: 93,
    inStock: true,
    isNew: false,
    isTrending: false,
    discount: 0
  },
  {
    _id: '7',
    name: 'Diamond Encrusted Watch',
    price: 2499.99,
    description: 'Luxury timepiece with diamond-encrusted bezel and Swiss movement',
    image: '/images/electronics.jpg',
    category: 'Watches',
    rating: 5.0,
    reviews: 42,
    inStock: true,
    isNew: false,
    isTrending: true,
    discount: 0
  },
  {
    _id: '8',
    name: 'Artisan Leather Wallet',
    price: 179.99,
    description: 'Hand-stitched leather wallet with RFID protection',
    image: '/images/furniture.png',
    category: 'Accessories',
    rating: 4.6,
    reviews: 56,
    inStock: true,
    isNew: false,
    isTrending: false,
    discount: 25
  },
  {
    _id: '9',
    name: 'Limited Edition Perfume',
    price: 299.99,
    description: 'Rare blend of exotic oils in a crystal bottle',
    image: '/images/beauty.jpg',
    category: 'Perfumes',
    rating: 4.9,
    reviews: 31,
    inStock: false,
    isNew: true,
    isTrending: false,
    discount: 0
  },
  {
    _id: '10',
    name: 'Italian Suede Loafers',
    price: 399.99,
    description: 'Handmade suede loafers with leather soles',
    image: '/images/mobile.jpg',
    category: 'Shoes',
    rating: 4.8,
    reviews: 67,
    inStock: true,
    isNew: false,
    isTrending: true,
    discount: 15
  },
  {
    _id: '11',
    name: 'Silk Designer Tie',
    price: 129.99,
    description: 'Hand-rolled silk tie with exclusive pattern',
    image: '/images/fashions.jpeg',
    category: 'Accessories',
    rating: 4.7,
    reviews: 48,
    inStock: true,
    isNew: false,
    isTrending: false,
    discount: 0
  },
  {
    _id: '12',
    name: 'Tailored Wool Suit',
    price: 1299.99,
    description: 'Bespoke wool suit with custom measurements',
    image: '/images/fashions.jpeg',
    category: 'Clothes',
    rating: 4.9,
    reviews: 52,
    inStock: true,
    isNew: true,
    isTrending: false,
    discount: 30
  }
];

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imagesLoaded, setImagesLoaded] = useState(0);
  const [totalImages, setTotalImages] = useState(0);
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [collapsedSections, setCollapsedSections] = useState([]);
  const [filters, setFilters] = useState({
    categories: [],
    priceRange: { min: 0, max: 5000 },
    ratings: [],
    inStock: false,
    sellerProducts: false,
    searchQuery: ''
  });
  const [sortBy, setSortBy] = useState('featured');
  const [notification, setNotification] = useState({ show: false, product: null });
  const { addToCart, cartItems } = useCart();
  const { getSellerProducts, sellerProducts } = useSeller();
  const navigate = useNavigate();
  const location = useLocation();

  // Extract search query from URL parameters
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const searchQuery = queryParams.get('search');
    
    if (searchQuery) {
      setFilters(prev => ({
        ...prev,
        searchQuery
      }));
    }
  }, [location.search]);

  // Fetch seller products from localStorage
  useEffect(() => {
    const storedSellerProducts = localStorage.getItem('sellerProducts');
    if (storedSellerProducts) {
      try {
        const parsedProducts = JSON.parse(storedSellerProducts);
        getSellerProducts(parsedProducts);
      } catch (error) {
        console.error('Error parsing seller products:', error);
      }
    }
  }, [getSellerProducts]);

  useEffect(() => {
    // Simulate API fetch with mock data
    setTimeout(() => {
      try {
        // Combine mock products with seller products
        let allProducts = [...mockProducts];
        
        if (sellerProducts.length > 0) {
          // Transform seller products to match the product structure
          const formattedSellerProducts = sellerProducts.map(product => {
            // Ensure stock is parsed as an integer
            const stockQuantity = parseInt(product.stock);
            
            return {
              _id: product.id || `seller-${product.name.replace(/\s+/g, '-').toLowerCase()}`,
              name: product.name,
              price: parseFloat(product.price),
              description: product.description,
              image: product.image || '/images/placeholder.jpg',
              category: product.category,
              rating: 5.0, // Default rating for new seller products
              reviews: 0,
              // Explicitly calculate inStock based on stock quantity
              inStock: stockQuantity > 0,
              stock: stockQuantity,
              isNew: true,
              isTrending: false,
              discount: parseInt(product.discount) || 0,
              isSeller: true // Flag to identify seller products
            };
          });
          
          console.log('Formatted seller products:', formattedSellerProducts.map(p => ({ name: p.name, stock: p.stock, inStock: p.inStock })));
          
          allProducts = [...allProducts, ...formattedSellerProducts];
        }
        
        let filteredProducts = [...allProducts];
        
        // Apply search query filter
        if (filters.searchQuery) {
          const query = filters.searchQuery.toLowerCase();
          filteredProducts = filteredProducts.filter(product => 
            product.name.toLowerCase().includes(query) || 
            product.description.toLowerCase().includes(query) ||
            product.category.toLowerCase().includes(query)
          );
        }
        
        // Apply seller products filter
        if (filters.sellerProducts) {
          filteredProducts = filteredProducts.filter(product => product.isSeller);
        }
        
        // Apply category filter
        if (filters.categories.length > 0) {
          filteredProducts = filteredProducts.filter(
            product => filters.categories.includes(product.category)
          );
        }
        
        // Apply price range filter
        filteredProducts = filteredProducts.filter(
          product => product.price >= filters.priceRange.min &&
                    product.price <= filters.priceRange.max
        );
        
        // Apply rating filter
        if (filters.ratings.length > 0) {
          filteredProducts = filteredProducts.filter(
            product => filters.ratings.some(rating => Math.floor(product.rating) >= rating)
          );
        }
        
        // Apply in stock filter
        if (filters.inStock) {
          filteredProducts = filteredProducts.filter(product => product.inStock === true);
        }
        
        // Apply sorting
        switch (sortBy) {
          case 'price-low':
            filteredProducts.sort((a, b) => a.price - b.price);
            break;
          case 'price-high':
            filteredProducts.sort((a, b) => b.price - a.price);
            break;
          case 'rating':
            filteredProducts.sort((a, b) => b.rating - a.rating);
            break;
          case 'newest':
            filteredProducts.sort((a, b) => b.isNew - a.isNew);
            break;
          default:
            // Default sorting (featured)
            break;
        }
        
        setProducts(filteredProducts);
        setTotalImages(filteredProducts.length);
        setLoading(false);
      } catch (error) {
        setError('Failed to load products. Please try again later.');
        setLoading(false);
      }
    }, 1000);
  }, [filters, sortBy, sellerProducts]);

  const handleFilterChange = (type, value) => {
    setFilters(prev => ({
      ...prev,
      [type]: value
    }));
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  const applyFilters = () => {
    let filteredProducts = [...mockProducts];

    // Apply category filter
    if (filters.categories.length > 0) {
      filteredProducts = filteredProducts.filter(product =>
        filters.categories.includes(product.category)
      );
    }

    // Apply price range filter
    filteredProducts = filteredProducts.filter(product =>
      product.price >= filters.priceRange.min &&
      product.price <= filters.priceRange.max
    );

    // Apply rating filter
    if (filters.ratings.length > 0) {
      filteredProducts = filteredProducts.filter(product =>
        filters.ratings.some(rating => Math.floor(product.rating) >= rating)
      );
    }

    // Apply in stock filter
    if (filters.inStock) {
      filteredProducts = filteredProducts.filter(product => product.inStock);
    }

    // Apply sorting
    switch (sortBy) {
      case 'price-low':
        filteredProducts.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filteredProducts.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filteredProducts.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        filteredProducts.sort((a, b) => b.isNew - a.isNew);
        break;
      default:
        // Default sorting (featured)
        break;
    }

    setProducts(filteredProducts);
    setIsFilterVisible(false);
  };

  const resetFilters = () => {
    setFilters({
      categories: [],
      priceRange: { min: 0, max: 5000 },
      ratings: [],
      inStock: false,
      sellerProducts: false,
      searchQuery: ''
    });
    setSortBy('featured');
    setProducts(mockProducts);
    setIsFilterVisible(false);
  };

  const handleViewProduct = (productId) => {
    navigate(`/product/${productId}`);
  };

  const handleAddToWishlist = (productId) => {
    console.log(`Added product ${productId} to wishlist`);
    // Implement wishlist functionality
  };

  const handleAddToCart = (product) => {
    // Map the product data to match the expected format
    const cartProduct = {
      id: product._id, // Map _id to id
      name: product.name,
      price: product.discount > 0 
        ? product.price * (1 - product.discount / 100)
        : product.price,
      image: product.image,
      description: product.description,
      category: product.category
    };
    
    addToCart(cartProduct);
    setNotification({ show: true, product: cartProduct });
    
    // Hide notification after 3 seconds
    setTimeout(() => {
      setNotification({ show: false, product: null });
    }, 3000);
  };

  const handleImageLoad = () => {
    setImagesLoaded(prev => prev + 1);
  };

  const loadingProgress = totalImages > 0 ? Math.round((imagesLoaded / totalImages) * 100) : 0;

  const formatPrice = (price) => {
    return `₹${price.toLocaleString('en-IN')}`;
  };

  const toggleFilterSection = (sectionName) => {
    if (collapsedSections.includes(sectionName)) {
      setCollapsedSections(collapsedSections.filter(name => name !== sectionName));
    } else {
      setCollapsedSections([...collapsedSections, sectionName]);
    }
  };

  const isSectionCollapsed = (sectionName) => {
    return collapsedSections.includes(sectionName);
  };

  if (loading) {
    return (
      <div className="shop-container">
        <StickyOfferBar />
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading premium products...</p>
          <div className="loading-bar-container">
            <div className="loading-bar" style={{ width: `${loadingProgress}%` }}></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="shop-container">
        <StickyOfferBar />
        <div className="error">
          <div className="error-icon">!</div>
          <p>Error: {error}</p>
          <button onClick={() => window.location.reload()}>Try Again</button>
        </div>
      </div>
    );
  }

  return (
    <div className="shop-container">
      <StickyOfferBar />
      
      <div className="shop-header">
        <h1 className="shop-title">Premium Collection</h1>
        <p className="shop-subtitle">Discover our curated selection of luxury products</p>
      </div>

      <SpecialOffers />

      <div className="shop-controls">
        <button 
          className={`filter-toggle ${isFilterVisible ? 'active' : ''}`}
          onClick={() => setIsFilterVisible(!isFilterVisible)}
        >
          <FaFilter /> Filters
        </button>
        <div className="sort-container">
          <span className="sort-label">Sort by:</span>
          <select 
            className="sort-select" 
            value={sortBy}
            onChange={handleSortChange}
          >
            <option value="featured">Featured</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
            <option value="newest">Newest First</option>
          </select>
        </div>
      </div>

      {/* Filter Overlay for Mobile */}
      <div 
        className={`filter-overlay ${isFilterVisible ? 'active' : ''}`} 
        onClick={() => setIsFilterVisible(false)}
      ></div>

      <div className="shop-layout">
        <div className={`shop-filters ${isFilterVisible ? 'active' : ''}`}>
          <div className={`filter-section ${isSectionCollapsed('categories') ? 'collapsed' : ''}`}>
            <div 
              className="filter-header"
              onClick={() => toggleFilterSection('categories')}
            >
              <h3>Categories</h3>
              <span className="toggle-icon"><FaChevronDown /></span>
            </div>
            <div className="filter-options">
              {['Watches', 'Clothes', 'Belts', 'Perfumes'].map(category => (
                <label key={category} className="filter-option">
                  <input
                    type="checkbox"
                    checked={filters.categories.includes(category)}
                    onChange={(e) => {
                      const newCategories = e.target.checked
                        ? [...filters.categories, category]
                        : filters.categories.filter(c => c !== category);
                      handleFilterChange('categories', newCategories);
                    }}
                  />
                  {category}
                </label>
              ))}
            </div>
          </div>

          <div className={`filter-section ${isSectionCollapsed('price') ? 'collapsed' : ''}`}>
            <div 
              className="filter-header"
              onClick={() => toggleFilterSection('price')}
            >
              <h3>Price Range</h3>
              <span className="toggle-icon"><FaChevronDown /></span>
            </div>
            <div className="price-range">
              <div className="price-inputs">
                <input
                  type="number"
                  className="price-input"
                  value={filters.priceRange.min}
                  onChange={(e) => handleFilterChange('priceRange', {
                    ...filters.priceRange,
                    min: Number(e.target.value)
                  })}
                  placeholder="Min"
                />
                <span className="price-separator">-</span>
                <input
                  type="number"
                  className="price-input"
                  value={filters.priceRange.max}
                  onChange={(e) => handleFilterChange('priceRange', {
                    ...filters.priceRange,
                    max: Number(e.target.value)
                  })}
                  placeholder="Max"
                />
              </div>
            </div>
          </div>

          <div className={`filter-section ${isSectionCollapsed('rating') ? 'collapsed' : ''}`}>
            <div 
              className="filter-header"
              onClick={() => toggleFilterSection('rating')}
            >
              <h3>Rating</h3>
              <span className="toggle-icon"><FaChevronDown /></span>
            </div>
            <div className="filter-options">
              {[5, 4, 3, 2, 1].map(rating => (
                <label key={rating} className="filter-option">
                  <input
                    type="checkbox"
                    checked={filters.ratings.includes(rating)}
                    onChange={(e) => {
                      const newRatings = e.target.checked
                        ? [...filters.ratings, rating]
                        : filters.ratings.filter(r => r !== rating);
                      handleFilterChange('ratings', newRatings);
                    }}
                  />
                  <div className="rating-stars">
                    {[...Array(5)].map((_, i) => (
                      <FaStar 
                        key={i} 
                        className={i < rating ? 'filled' : 'empty'} 
                      />
                    ))}
                  </div>
                  <span>& Up</span>
                </label>
              ))}
            </div>
          </div>

          <div className="filter-section">
            <label className="filter-option">
              <input
                type="checkbox"
                checked={filters.inStock}
                onChange={(e) => handleFilterChange('inStock', e.target.checked)}
              />
              In Stock Only
            </label>
          </div>

          <div className={`filter-section ${isSectionCollapsed('seller') ? 'collapsed' : ''}`}>
            <div 
              className="filter-header"
              onClick={() => toggleFilterSection('seller')}
            >
              <h3>Seller Products</h3>
              <span className="toggle-icon"><FaChevronDown /></span>
            </div>
            <div className="filter-options">
              <label className="filter-option">
                <input
                  type="checkbox"
                  checked={filters.sellerProducts}
                  onChange={() => handleFilterChange('sellerProducts', !filters.sellerProducts)}
                />
                <FaStore className="seller-icon" /> Show Seller Products
              </label>
            </div>
          </div>

          <button className="apply-filters" onClick={applyFilters}>
            Apply Filters
          </button>
          <button className="reset-filters" onClick={resetFilters}>
            Reset Filters
          </button>
        </div>

        <div className="products-grid-container">
          <div className="products-count">
            {products.length} {products.length === 1 ? 'product' : 'products'} found
          </div>
          
          <div className="products-grid">
            {products.length === 0 ? (
              <div className="no-products">No products found</div>
            ) : (
              products.map((product, index) => (
                <div 
                  key={product._id} 
                  className="product-grid-item"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <ProductCard product={product} />
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Cart Notification */}
      <div className={`cart-notification ${notification.show ? 'show' : ''}`}>
        <div className="notification-content">
          <button 
            className="close-notification" 
            onClick={() => setNotification({ show: false, product: null })}
          >
            <FaTimes />
          </button>
          {notification.product && (
            <>
              <div className="notification-image">
                <img src={notification.product.image} alt={notification.product.name} />
              </div>
              <div className="notification-details">
                <p className="notification-title">Added to Cart!</p>
                <p className="notification-product">{notification.product.name}</p>
                <div className="notification-price">
                  {formatPrice(notification.product.price)}
                </div>
              </div>
              <div className="notification-actions">
                <button className="view-cart-btn">View Cart ({cartItems.length})</button>
                <button className="checkout-btn">Checkout</button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Sticky Cart Icon */}
      <div className="sticky-cart">
        <div className="cart-icon">
          <FaShoppingCart />
          {cartItems.length > 0 && <span className="cart-count">{cartItems.length}</span>}
        </div>
      </div>
    </div>
  );
};

export default Shop; 