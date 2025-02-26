import React from 'react';
import './categorypage.css';

import { Link } from 'react-router-dom';

const groceries = [
  { name: 'Fortune Basmati Rice', price: '₹120/kg', image: '/images/rice.jpg' },
  { name: 'Aashirvaad Atta', price: '₹240/5kg', image: '/images/flour.jpg' },
  { name: 'Tata Salt', price: '₹20/kg', image: '/images/salt.jpg' },
  { name: 'Amul Butter', price: '₹55/100g', image: '/images/butter.jpg' },
  { name: 'Nestle Milk', price: '₹60/litre', image: '/images/milk.jpg' },
  { name: 'Patanjali Honey', price: '₹199/500g', image: '/images/honey.jpg' },
];

const Groceries = () => {
  return (
    <div className="category-container">
      <h2 className="category-title">Groceries</h2>
      <div className="product-grid">
        {groceries.map((product) => (
          <div key={product.name} className="product-card">
            <img src={product.image} alt={product.name} className="product-image" />
            <h4 className="product-name">{product.name}</h4>
            <p className="product-price">{product.price}</p>
          </div>
        ))}
      </div>
      <Link to="/" className="back-button">Back to Categories</Link>
    </div>
  );
};

export default Groceries;
