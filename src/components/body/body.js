import React from 'react';
import './body.css';
import { Link } from 'react-router-dom';

const categories = [
  { name: 'Groceries', image: '/images/grocery.jpg', link: '/groceries' },
  { name: 'Mobile', image: '/images/mobile.jpg', link: '/mobile' },
  { name: 'Electronics', image: '/images/electronics.jpg', link: '/electronics' },
  { name: 'Furniture', image: '/images/furniture.png', link: '/furniture' },
  { name: 'Beauty', image: '/images/beauty.jpg', link: '/beauty' },
  { name: 'Fashion', image: '/images/fashions.jpeg', link: '/fashion' },
];

const Body = () => {
  return (
    <div className="body-container">
      <h2 className="section-title">Shop by Category</h2>
      <div className="category-grid">
        {categories.map((category) => (
          <Link to={category.link} key={category.name} className="category-card">
            <img src={category.image} alt={category.name} className="category-image" />
            <h3 className="category-name">{category.name}</h3>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Body;
