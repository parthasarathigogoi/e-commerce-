import React from 'react';
import { Link } from 'react-router-dom';
import { FaArrowRight } from 'react-icons/fa';
import './Categories.css';
import CategoryOffers from '../components/offers/CategoryOffers';
import StickyOfferBar from '../components/offers/StickyOfferBar';

const categories = [
  {
    id: 1,
    name: 'Watches',
    image: '/images/electronics.jpg',
    description: 'Luxury timepieces and premium watches',
    itemCount: 24,
    featured: true,
    priceRange: '$499 - $5,000+'
  },
  {
    id: 2,
    name: 'Clothes',
    image: '/images/fashions.jpeg',
    description: 'Designer apparel and premium fashion',
    itemCount: 48,
    featured: true,
    priceRange: '$199 - $2,500+'
  },
  {
    id: 3,
    name: 'Shoes',
    image: '/images/mobile.jpg',
    description: 'Handcrafted footwear and designer shoes',
    itemCount: 36,
    featured: true,
    priceRange: '$299 - $1,200+'
  },
  {
    id: 4,
    name: 'Perfumes',
    image: '/images/beauty.jpg',
    description: 'Exclusive fragrances and signature scents',
    itemCount: 18,
    featured: false,
    priceRange: '$89 - $500+'
  },
  {
    id: 5,
    name: 'Belts',
    image: '/images/furniture.png',
    description: 'Luxury leather belts and accessories',
    itemCount: 15,
    featured: false,
    priceRange: '$129 - $450+'
  },
  {
    id: 6,
    name: 'Accessories',
    image: '/images/fashions.jpeg',
    description: 'Premium accessories to complete your look',
    itemCount: 32,
    featured: true,
    priceRange: '$79 - $800+'
  }
];

const Categories = () => {
  const featuredCategories = categories.filter(cat => cat.featured);
  const otherCategories = categories.filter(cat => !cat.featured);

  return (
    <div className="categories-container">
      {/* Sticky Offer Bar */}
      <StickyOfferBar />
      
      <div className="categories-header">
        <h1 className="categories-title elegant-font">Luxury Collections</h1>
        <p className="categories-subtitle">Explore our exclusive range of premium products crafted for the discerning customer</p>
      </div>

      {/* Featured Categories */}
      <section className="featured-categories">
        <h2 className="section-title">Featured Collections</h2>
        <div className="featured-grid">
          {featuredCategories.map((category, index) => (
            <Link 
              to={`/shop?category=${category.name}`} 
              key={category.id}
              className="featured-category-card"
            >
              <div className="category-image-container">
                <img 
                  src={category.image} 
                  alt={category.name} 
                  loading="lazy"
                />
                <div className="category-overlay">
                  <span className="item-count">{category.itemCount} Items</span>
                  <button className="explore-button">
                    Explore <FaArrowRight />
                  </button>
                </div>
              </div>
              <div className="category-content">
                <div>
                  <h3>{category.name}</h3>
                  <p>{category.description}</p>
                </div>
                <div className="price-range">{category.priceRange}</div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Special Category Offers */}
      <section className="special-category-offers">
        <h2 className="section-title">Special Offers</h2>
        <CategoryOffers />
      </section>

      {/* Other Categories */}
      <section className="other-categories">
        <h2 className="section-title">Additional Collections</h2>
        <div className="categories-grid">
          {otherCategories.map((category, index) => (
            <Link 
              to={`/shop?category=${category.name}`} 
              key={category.id}
              className="category-card"
            >
              <div className="category-image-container">
                <img 
                  src={category.image} 
                  alt={category.name} 
                  loading="lazy"
                />
              </div>
              <div className="category-content">
                <div>
                  <h3>{category.name}</h3>
                  <p>{category.description}</p>
                  <span className="item-count">{category.itemCount} Items</span>
                </div>
                <div className="price-range">{category.priceRange}</div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Category Benefits */}
      <section className="category-benefits">
        <div className="benefit-card">
          <div className="benefit-icon">✓</div>
          <h3>Premium Quality</h3>
          <p>Exceptional craftsmanship in every product</p>
        </div>
        <div className="benefit-card">
          <div className="benefit-icon">⚡</div>
          <h3>Exclusive Selection</h3>
          <p>Curated collections from top designers</p>
        </div>
        <div className="benefit-card">
          <div className="benefit-icon">🔄</div>
          <h3>Lifetime Guarantee</h3>
          <p>Quality assurance on all premium items</p>
        </div>
      </section>
    </div>
  );
};

export default Categories; 