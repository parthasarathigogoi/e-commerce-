import React from 'react';
import { Link } from 'react-router-dom';
import { FaArrowRight } from 'react-icons/fa';
import './Categories.css';

const categories = [
  {
    id: 1,
    name: 'Electronics',
    image: '/images/electronics.jpg',
    description: 'Latest gadgets and electronic devices',
    itemCount: 150,
    featured: true
  },
  {
    id: 2,
    name: 'Fashion',
    image: '/images/fashions.jpeg',
    description: 'Trendy clothing and accessories',
    itemCount: 200,
    featured: true
  },
  {
    id: 3,
    name: 'Home & Living',
    image: '/images/furniture.png',
    description: 'Furniture and home decor',
    itemCount: 120,
    featured: false
  },
  {
    id: 4,
    name: 'Beauty',
    image: '/images/beauty.jpg',
    description: 'Skincare and beauty products',
    itemCount: 80,
    featured: true
  },
  {
    id: 5,
    name: 'Groceries',
    image: '/images/grocery.jpg',
    description: 'Fresh and packaged food items',
    itemCount: 300,
    featured: false
  },
  {
    id: 6,
    name: 'Mobile',
    image: '/images/mobile.jpg',
    description: 'Smartphones and accessories',
    itemCount: 100,
    featured: true
  }
];

const Categories = () => {
  const featuredCategories = categories.filter(cat => cat.featured);
  const otherCategories = categories.filter(cat => !cat.featured);

  return (
    <div className="categories-container">
      <div className="categories-header">
        <h1 className="categories-title elegant-font">Shop by Category</h1>
        <p className="categories-subtitle">Explore our wide range of products across various categories</p>
      </div>

      {/* Featured Categories */}
      <section className="featured-categories">
        <h2 className="section-title">Featured Categories</h2>
        <div className="featured-grid">
          {featuredCategories.map(category => (
            <Link 
              to={`/shop?category=${category.name.toLowerCase()}`} 
              key={category.id}
              className="featured-category-card"
            >
              <div className="category-image-container">
                <img src={category.image} alt={category.name} />
                <div className="category-overlay">
                  <span className="item-count">{category.itemCount} Items</span>
                  <button className="explore-button">
                    Explore <FaArrowRight />
                  </button>
                </div>
              </div>
              <div className="category-content">
                <h3>{category.name}</h3>
                <p>{category.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Other Categories */}
      <section className="other-categories">
        <h2 className="section-title">All Categories</h2>
        <div className="categories-grid">
          {otherCategories.map(category => (
            <Link 
              to={`/shop?category=${category.name.toLowerCase()}`} 
              key={category.id}
              className="category-card"
            >
              <div className="category-image-container">
                <img src={category.image} alt={category.name} />
              </div>
              <div className="category-content">
                <h3>{category.name}</h3>
                <p>{category.description}</p>
                <span className="item-count">{category.itemCount} Items</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Category Benefits */}
      <section className="category-benefits">
        <div className="benefit-card">
          <div className="benefit-icon">🎯</div>
          <h3>Curated Selection</h3>
          <p>Handpicked items in each category</p>
        </div>
        <div className="benefit-card">
          <div className="benefit-icon">⚡</div>
          <h3>Quick Navigation</h3>
          <p>Find what you need faster</p>
        </div>
        <div className="benefit-card">
          <div className="benefit-icon">🔄</div>
          <h3>Regular Updates</h3>
          <p>New items added frequently</p>
        </div>
      </section>
    </div>
  );
};

export default Categories; 