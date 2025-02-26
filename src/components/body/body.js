import React from 'react';
import { Link } from 'react-router-dom';
import './body.css';

const categories = [
  { name: 'Groceries', image: '/images/grocery.jpg', link: '/category/groceries' },
  { name: 'Mobile', image: '/images/mobile.jpg', link: '/category/mobile' },
  { name: 'Electronics', image: '/images/electronics.jpg', link: '/category/electronics' },
  { name: 'Furniture', image: '/images/furniture.png', link: '/category/furniture' },
  { name: 'Beauty', image: '/images/beauty.jpg', link: '/category/beauty' },
  { name: 'Fashion', image: '/images/fashions.jpeg', link: '/category/fashion' },
];

const Body = () => {
  // Splitting categories into rows of three
  const rows = [];
  for (let i = 0; i < categories.length; i += 3) {
    rows.push(categories.slice(i, i + 3));
  }

  return (
    <div className="body-container">
      <h2 className="section-title">Shop by Category</h2>
      <div className="category-rows">
        {rows.map((row, rowIndex) => (
          <div className="category-row" key={rowIndex}>
            {row.map((category) => (
              <Link to={category.link} key={category.name} className="category-card">
                <img src={category.image} alt={category.name} className="category-image" />
                <h3 className="category-name">{category.name}</h3>
              </Link>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Body;
