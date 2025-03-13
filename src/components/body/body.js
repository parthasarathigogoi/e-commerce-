import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './body.css';
import ProductVideo from '../video/ProductVideo';
import { useCart } from '../../context/CartContext';
import { FaShoppingCart, FaHeart, FaEye } from 'react-icons/fa';

// Categories with black and white theme
const categories = [
  { name: 'Groceries', image: '/images/grocery.jpg', link: '/groceries', color: '#000000' },
  { name: 'Mobile', image: '/images/mobile.jpg', link: '/mobile', color: '#222222' },
  { name: 'Electronics', image: '/images/electronics.jpg', link: '/electronics', color: '#333333' },
  { name: 'Furniture', image: '/images/furniture.png', link: '/furniture', color: '#444444' },
  { name: 'Beauty', image: '/images/beauty.jpg', link: '/beauty', color: '#555555' },
  { name: 'Fashion', image: '/images/fashions.jpeg', link: '/fashion', color: '#666666' },
];

// Expanded product list
const suggestedProducts = [
  {
    id: 1,
    name: 'iPhone 15 Pro',
    image: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-15-src/productlist/Mobile.jspro-finish-select-202309-6-7inch_AV1?wid=1200&hei=630&fmt=jpeg&qlt=95&.v=1692734591452',
    price: '$999',
    rating: 4.8,
    reviews: 245,
    isNew: true
  },
  {
    id: 2,
    name: 'Samsung Galaxy S24 Ultra',
    image: 'https://images.samsung.com/is/image/samsung/assets/in/smartphones/galaxy-s24-ultra/images/galaxy-s24-ultra-highlights-kv.jpg',
    price: '$1199',
    rating: 4.7,
    reviews: 189
  },
  {
    id: 3,
    name: 'Google Pixel 8 Pro',
    image: 'https://store.google.com/us/product/pixel_8_pro_images/pixel8pro.png',
    price: '$899',
    rating: 4.6,
    reviews: 156
  },
  { 
    id: 4, 
    name: "Rice (1kg)", 
    price: "₹50", 
    image: "/images/rice.jpg",
    rating: 4.5,
    reviews: 120
  },
  { 
    id: 5, 
    name: "Wheat Flour (1kg)", 
    price: "₹45", 
    image: "/images/flour.jpg",
    rating: 4.3,
    reviews: 98
  },
  { 
    id: 6, 
    name: "Salt (1kg)", 
    price: "₹40", 
    image: "/images/salt.jpg",
    rating: 4.4,
    reviews: 87
  },
  { 
    id: 7, 
    name: "Milk (1L)", 
    price: "₹60", 
    image: "/images/milk.png",
    rating: 4.7,
    reviews: 145
  },
  { 
    id: 8, 
    name: "Honey (1L)", 
    price: "₹180", 
    image: "/images/honey.jpeg",
    rating: 4.9,
    reviews: 210,
    isNew: true
  }
];

// New trending products
const trendingProducts = [
  {
    id: 9,
    name: 'Minimalist Watch',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30',
    price: '$129',
    rating: 4.9,
    reviews: 312,
    isNew: true
  },
  {
    id: 10,
    name: 'Leather Wallet',
    image: 'https://images.unsplash.com/photo-1627123424574-724758594e93',
    price: '$49',
    rating: 4.7,
    reviews: 189
  },
  {
    id: 11,
    name: 'Wireless Earbuds',
    image: 'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb',
    price: '$89',
    rating: 4.6,
    reviews: 256
  },
  {
    id: 12,
    name: 'Mechanical Keyboard',
    image: 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef',
    price: '$149',
    rating: 4.8,
    reviews: 178,
    isNew: true
  }
];

// Testimonials
const testimonials = [
  {
    id: 1,
    text: "The quality of products I received exceeded my expectations. The black and white aesthetic of the website matches the premium feel of their items.",
    name: "Sarah Johnson",
    role: "Regular Customer",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150"
  },
  {
    id: 2,
    text: "I've been shopping here for years and have never been disappointed. Their customer service is as elegant as their website design.",
    name: "Michael Chen",
    role: "Premium Member",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150"
  }
];

const Body = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [visibleProducts, setVisibleProducts] = useState(suggestedProducts);
  const [isLoading, setIsLoading] = useState(true);
  const { addToCart } = useCart();

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Filter products by category
  const filterProducts = (category) => {
    setActiveCategory(category);
    // In a real app, you would filter products based on category
    setVisibleProducts(suggestedProducts);
  };

  const handleAddToCart = (product) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: parseFloat(product.price.replace(/[^0-9.-]+/g, '')),
      image: product.image
    });
  };

  return (
    <div className="body-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            <span className="elegant-font">Timeless</span> Elegance
          </h1>
          <p className="hero-subtitle">Discover curated products with sophisticated design and premium quality</p>
          <div className="hero-buttons">
            <button className="primary-button">Shop Collection</button>
            <button className="secondary-button">Explore</button>
          </div>
        </div>
        <div className="hero-image-container">
          <div className="hero-image-wrapper">
            <img src="https://images.unsplash.com/photo-1441986300917-64674bd600d8" alt="Elegant Shopping" className="hero-image" />
            <div className="hero-shape shape-1"></div>
            <div className="hero-shape shape-2"></div>
          </div>
        </div>
      </section>

      {/* Featured Products Banner */}
      <section className="featured-banner">
        <div className="banner-content">
          <h2 className="banner-title">New Arrivals</h2>
          <p className="banner-subtitle">Explore our latest collection of premium products</p>
          <button className="banner-button">View All</button>
        </div>
      </section>

      {/* Categories Section */}
      <section className="categories-section">
        <h2 className="section-title elegant-font">Shop by Category</h2>
        <p className="section-subtitle">Explore our curated selection across various categories</p>
        
        <div className="categories-grid">
          {categories.map((category, index) => (
            <Link 
              to={category.link} 
              key={category.name} 
              className="category-card animate-fade-in"
              style={{animationDelay: `${index * 0.1}s`}}
            >
              <div className="category-icon" style={{backgroundColor: category.color}}>
                <img src={category.image} alt={category.name} />
              </div>
              <h3 className="category-name">{category.name}</h3>
            </Link>
          ))}
        </div>
      </section>

      <div className="elegant-divider"></div>

      {/* Products Section */}
      <section className="products-section">
        <h2 className="section-title elegant-font">Trending Products</h2>
        <p className="section-subtitle">Discover what's popular right now</p>
        
        <div className="product-filter">
          <button 
            className={`filter-button ${activeCategory === 'all' ? 'active' : ''}`}
            onClick={() => filterProducts('all')}
          >
            All
          </button>
          <button 
            className={`filter-button ${activeCategory === 'new' ? 'active' : ''}`}
            onClick={() => filterProducts('new')}
          >
            New Arrivals
          </button>
          <button 
            className={`filter-button ${activeCategory === 'popular' ? 'active' : ''}`}
            onClick={() => filterProducts('popular')}
          >
            Popular
          </button>
          <button 
            className={`filter-button ${activeCategory === 'sale' ? 'active' : ''}`}
            onClick={() => filterProducts('sale')}
          >
            On Sale
          </button>
        </div>
        
        <div className="products-grid">
          {isLoading ? (
            // Skeleton loading
            Array(8).fill().map((_, index) => (
              <div key={index} className="product-card skeleton">
                <div className="product-image skeleton-image"></div>
                <div className="product-details">
                  <div className="skeleton-text skeleton-title"></div>
                  <div className="skeleton-text skeleton-price"></div>
                  <div className="skeleton-text skeleton-rating"></div>
                </div>
              </div>
            ))
          ) : (
            visibleProducts.map((product, index) => (
              <div 
                key={product.id} 
                className="product-card animate-fade-in"
                style={{animationDelay: `${index * 0.1}s`}}
              >
                {product.isNew && <span className="new-badge">NEW</span>}
                <div className="product-image-container">
                  <img src={product.image} alt={product.name} className="product-image" />
                  <div className="product-actions">
                    <button className="action-button wishlist-button">
                      <FaHeart />
                    </button>
                    <button 
                      className="action-button cart-button"
                      onClick={() => handleAddToCart(product)}
                    >
                      <FaShoppingCart />
                    </button>
                    <button className="action-button view-button">
                      <FaEye />
                    </button>
                  </div>
                </div>
                <div className="product-details">
                  <h3 className="product-name">{product.name}</h3>
                  <p className="product-price">{product.price}</p>
                  <div className="product-rating">
                    <span className="stars">{'★'.repeat(Math.floor(product.rating))}{'☆'.repeat(5 - Math.floor(product.rating))}</span>
                    <span className="reviews">({product.reviews})</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Video Section - Smaller and centered */}
      <section className="video-section">
        <h2 className="section-title elegant-font">Our Craftsmanship</h2>
        <p className="section-subtitle">See the quality and attention to detail in our products</p>
        <ProductVideo />
      </section>

      {/* Trending Products Section */}
      <section className="featured-section">
        <div className="container">
          <h2 className="section-title elegant-font" style={{color: 'white'}}>Premium Selection</h2>
          <p className="section-subtitle" style={{color: 'rgba(255,255,255,0.7)'}}>Handpicked items for the discerning customer</p>
          
          <div className="products-grid">
            {trendingProducts.map((product, index) => (
              <div 
                key={product.id} 
                className="product-card premium-card animate-fade-in"
                style={{animationDelay: `${index * 0.1}s`}}
              >
                {product.isNew && <span className="new-badge">NEW</span>}
                <div className="product-image-container">
                  <img src={product.image} alt={product.name} className="product-image" />
                  <div className="product-actions">
                    <button className="action-button wishlist-button">
                      <FaHeart />
                    </button>
                    <button 
                      className="action-button cart-button"
                      onClick={() => handleAddToCart(product)}
                    >
                      <FaShoppingCart />
                    </button>
                    <button className="action-button view-button">
                      <FaEye />
                    </button>
                  </div>
                </div>
                <div className="product-details">
                  <h3 className="product-name">{product.name}</h3>
                  <p className="product-price">{product.price}</p>
                  <div className="product-rating">
                    <span className="stars">{'★'.repeat(Math.floor(product.rating))}{'☆'.repeat(5 - Math.floor(product.rating))}</span>
                    <span className="reviews">({product.reviews})</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <h2 className="section-title elegant-font">What Our Customers Say</h2>
        <p className="section-subtitle">Hear from our satisfied customers</p>
        
        <div className="testimonials-container">
          {testimonials.map(testimonial => (
            <div key={testimonial.id} className="testimonial">
              <p className="testimonial-text">{testimonial.text}</p>
              <div className="testimonial-author">
                <img src={testimonial.avatar} alt={testimonial.name} className="testimonial-avatar" />
                <div>
                  <p className="testimonial-name">{testimonial.name}</p>
                  <p className="testimonial-role">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="feature">
          <div className="feature-icon">🚚</div>
          <h3>Free Shipping</h3>
          <p>On orders over $50</p>
        </div>
        <div className="feature">
          <div className="feature-icon">🔄</div>
          <h3>Easy Returns</h3>
          <p>30-day return policy</p>
        </div>
        <div className="feature">
          <div className="feature-icon">🔒</div>
          <h3>Secure Payments</h3>
          <p>Protected by encryption</p>
        </div>
        <div className="feature">
          <div className="feature-icon">💬</div>
          <h3>24/7 Support</h3>
          <p>We're always here to help</p>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="newsletter-section">
        <div className="newsletter-content">
          <h2 className="newsletter-title elegant-font">Join Our Newsletter</h2>
          <p className="newsletter-subtitle">Stay updated with our latest products and exclusive offers</p>
          <div className="newsletter-form">
            <input type="email" placeholder="Your email address" className="newsletter-input" />
            <button className="newsletter-button">Subscribe</button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Body;
