import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './body.css';
import ProductVideo from '../video/ProductVideo';
import { useCart } from '../../context/CartContext';
import { FaShoppingCart, FaHeart, FaEye } from 'react-icons/fa';
import StickyOfferBar from '../offers/StickyOfferBar';
import SpecialOffers from '../offers/SpecialOffers';
import ProductCard from '../ProductCard';

// Premium categories with black and white theme
const categories = [
  { name: 'Watches', image: '/images/electronics.jpg', link: '/shop?category=Watches', color: '#000000' },
  { name: 'Clothes', image: '/images/fashions.jpeg', link: '/shop?category=Clothes', color: '#222222' },
  { name: 'Shoes', image: '/images/mobile.jpg', link: '/shop?category=Shoes', color: '#333333' },
  { name: 'Belts', image: '/images/furniture.png', link: '/shop?category=Belts', color: '#444444' },
  { name: 'Perfumes', image: '/images/beauty.jpg', link: '/shop?category=Perfumes', color: '#555555' },
  { name: 'Accessories', image: '/images/fashions.jpeg', link: '/shop?category=Accessories', color: '#666666' },
];

// Premium featured products
const featuredProducts = [
  {
    id: 1,
    name: 'Swiss Automatic Watch',
    image: '/images/electronics.jpg',
    price: 2499.99,
    rating: 4.9,
    reviews: 87,
    isNew: true,
    category: 'Watches'
  },
  {
    id: 2,
    name: 'Italian Silk Tie',
    image: '/images/fashions.jpeg',
    price: 129.99,
    rating: 4.7,
    reviews: 48,
    category: 'Accessories'
  },
  {
    id: 3,
    name: 'Handcrafted Leather Belt',
    image: '/images/furniture.png',
    price: 249.99,
    rating: 4.8,
    reviews: 65,
    category: 'Belts'
  },
  {
    id: 4,
    name: 'Designer Wool Coat',
    image: '/images/fashions.jpeg',
    price: 899.99,
    rating: 4.9,
    reviews: 52,
    isNew: true,
    category: 'Clothes'
  }
];

// Premium trending products
const trendingProducts = [
  {
    id: 5,
    name: 'Luxury Chronograph Watch',
    image: '/images/electronics.jpg',
    price: 1299.99,
    rating: 4.8,
    reviews: 76,
    category: 'Watches'
  },
  {
    id: 6,
    name: 'Signature Eau de Parfum',
    image: '/images/beauty.jpg',
    price: 189.99,
    rating: 4.9,
    reviews: 142,
    category: 'Perfumes'
  },
  {
    id: 7,
    name: 'Italian Leather Loafers',
    image: '/images/mobile.jpg',
    price: 399.99,
    rating: 4.8,
    reviews: 67,
    isNew: true,
    category: 'Shoes'
  },
  {
    id: 8,
    name: 'Cashmere Sweater',
    image: '/images/fashions.jpeg',
    price: 349.99,
    rating: 4.7,
    reviews: 93,
    category: 'Clothes'
  }
];

// Testimonials
const testimonials = [
  {
    id: 1,
    text: "The quality of the luxury items I purchased exceeded my expectations. The elegant aesthetic of their products matches the premium feel of their brand.",
    name: "Sarah Johnson",
    role: "VIP Customer",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150"
  },
  {
    id: 2,
    text: "I've been shopping here for years and have never been disappointed. Their attention to detail and craftsmanship is unmatched.",
    name: "Michael Chen",
    role: "Premium Member",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150"
  }
];

const Body = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [visibleProducts, setVisibleProducts] = useState(featuredProducts);
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
    if (category === 'all') {
      setVisibleProducts(featuredProducts);
    } else if (category === 'new') {
      setVisibleProducts(featuredProducts.filter(product => product.isNew));
    } else {
      setVisibleProducts(featuredProducts.filter(product => product.category === category));
    }
  };

  const handleAddToCart = (product) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: typeof product.price === 'number' ? product.price : parseFloat(product.price.replace(/[^0-9.-]+/g, '')),
      image: product.image
    });
  };

  return (
    <div className="body-container">
      {/* Sticky Offer Bar */}
      <StickyOfferBar />
      
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            <span className="elegant-font">Luxury</span> Redefined
          </h1>
          <p className="hero-subtitle">Discover our exclusive collection of premium products crafted for the discerning customer</p>
          <div className="hero-buttons">
            <Link to="/shop" className="primary-button">Shop Collection</Link>
            <Link to="/categories" className="secondary-button">Explore Categories</Link>
          </div>
        </div>
        <div className="hero-image-container">
          <div className="hero-image-wrapper">
            <img src="https://images.unsplash.com/photo-1441986300917-64674bd600d8" alt="Luxury Shopping" className="hero-image" />
            <div className="hero-shape shape-1"></div>
            <div className="hero-shape shape-2"></div>
          </div>
        </div>
      </section>

      {/* Special Offers Section */}
      <SpecialOffers />

      {/* Featured Products Banner */}
      <section className="featured-banner">
        <div className="banner-content">
          <h2 className="banner-title">Exclusive Collection</h2>
          <p className="banner-subtitle">Explore our handpicked selection of premium luxury items</p>
          <Link to="/shop" className="banner-button">View All</Link>
        </div>
      </section>

      {/* Categories Section */}
      <section className="categories-section">
        <h2 className="section-title elegant-font">Premium Categories</h2>
        <p className="section-subtitle">Explore our curated selection of luxury products</p>
        
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

      {/* Featured Products Section */}
      <section className="products-section">
        <h2 className="section-title elegant-font">Featured Products</h2>
        <p className="section-subtitle">Discover our selection of premium items</p>
        
        <div className="filter-buttons">
          <button 
            className={`filter-button ${activeCategory === 'all' ? 'active' : ''}`}
            onClick={() => filterProducts('all')}
          >
            All
          </button>
          <button 
            className={`filter-button ${activeCategory === 'Watches' ? 'active' : ''}`}
            onClick={() => filterProducts('Watches')}
          >
            Watches
          </button>
          <button 
            className={`filter-button ${activeCategory === 'Clothes' ? 'active' : ''}`}
            onClick={() => filterProducts('Clothes')}
          >
            Clothes
          </button>
          <button 
            className={`filter-button ${activeCategory === 'Accessories' ? 'active' : ''}`}
            onClick={() => filterProducts('Accessories')}
          >
            Accessories
          </button>
        </div>
        
        <div className="products-grid">
          {isLoading ? (
            // Skeleton loading
            Array(4).fill().map((_, index) => (
              <div key={index} className="product-card skeleton">
                <div className="skeleton-image"></div>
                <div className="skeleton-text skeleton-title"></div>
                <div className="skeleton-text skeleton-price"></div>
                <div className="skeleton-text skeleton-rating"></div>
              </div>
            ))
          ) : (
            visibleProducts.map(product => (
              <div key={product.id} className="product-grid-item">
                <ProductCard product={product} />
              </div>
            ))
          )}
        </div>
      </section>

      {/* Video Section */}
      <section className="video-section">
        <h2 className="section-title elegant-font">Experience Luxury</h2>
        <p className="section-subtitle">See our craftsmanship in action</p>
        <ProductVideo />
      </section>

      {/* Trending Products Section */}
      <section className="products-section">
        <h2 className="section-title elegant-font">Trending Now</h2>
        <p className="section-subtitle">Our most popular premium items</p>
        
        <div className="products-grid">
          {trendingProducts.map(product => (
            <div key={product.id} className="product-grid-item">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </section>

      {/* Featured Section */}
      <section className="featured-section">
        <div className="container">
          <h2 className="section-title elegant-font" style={{color: 'white'}}>Luxury Awaits</h2>
          <p className="section-subtitle" style={{color: 'rgba(255, 255, 255, 0.8)'}}>
            Indulge in our exclusive collection of premium products
          </p>
          <Link to="/shop" className="primary-button" style={{marginTop: '2rem'}}>
            Shop Now
          </Link>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <h2 className="section-title elegant-font">What Our Clients Say</h2>
        <p className="section-subtitle">Hear from our satisfied customers</p>
        
        <div className="testimonials-container">
          {testimonials.map(testimonial => (
            <div key={testimonial.id} className="testimonial">
              <p className="testimonial-text">{testimonial.text}</p>
              <div className="testimonial-author">
                <img src={testimonial.avatar} alt={testimonial.name} className="testimonial-avatar" />
                <div>
                  <h4 className="testimonial-name">{testimonial.name}</h4>
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
          <div className="feature-icon">✓</div>
          <h3>Premium Quality</h3>
          <p>Only the finest materials and craftsmanship</p>
        </div>
        <div className="feature">
          <div className="feature-icon">🔒</div>
          <h3>Secure Shopping</h3>
          <p>Your transactions are always protected</p>
        </div>
        <div className="feature">
          <div className="feature-icon">🚚</div>
          <h3>Fast Delivery</h3>
          <p>Express shipping on all premium items</p>
        </div>
        <div className="feature">
          <div className="feature-icon">↩️</div>
          <h3>Easy Returns</h3>
          <p>30-day hassle-free return policy</p>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="newsletter-section">
        <div className="newsletter-content">
          <h2 className="newsletter-title elegant-font">Join Our VIP List</h2>
          <p className="newsletter-subtitle">Subscribe to receive exclusive offers and updates on new arrivals</p>
          
          <form className="newsletter-form">
            <input type="email" className="newsletter-input" placeholder="Your email address" />
            <button type="submit" className="newsletter-button">Subscribe</button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Body;
