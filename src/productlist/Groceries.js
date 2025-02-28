import React from 'react';
import './productCSS/groceries.css';

const Groceries = () => {
  console.log("Groceries Component Loaded");

  const products = [
    { id: 1, name: "Rice (1kg)", price: "₹50", image: "/images/rice.jpg" },
    { id: 2, name: "Wheat Flour (1kg)", price: "₹45", image: "/images/flour.jpg" },
    { id: 3, name: "Salt (1kg)", price: "₹40", image: "/images/salt.jpg" },
    { id: 4, name: "Milk (1L)", price: "₹60", image: "/images/milk.png" },
    { id: 5, name: "Honey (1L)", price: "₹180", image: "/images/honey.jpeg" },
    { id: 6, name: "butter (500g)", price: "₹120", image: "/images/butter.jpeg" },
  ];

  return (
    <div className="groceries-container">
      <h2>Groceries</h2>
      <div className="products-grid">
        {products.map((product) => (
          <div key={product.id} className="product-card">
            <img src={product.image} alt={product.name} className="product-image" />
            <h3>{product.name}</h3>
            <p>{product.price}</p>
            <button>Add to Cart</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Groceries;
