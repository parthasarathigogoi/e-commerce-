import React from 'react';
import { Link } from 'react-router-dom';
import './body.css';
import ProductVideo from '../video/ProductVideo';

// Categories
const categories = [
  { name: 'Groceries', image: '/images/grocery.jpg', link: '/groceries' },
  { name: 'Mobile', image: '/images/mobile.jpg', link: '/mobile'},
  { name: 'Electronics', image: '/images/electronics.jpg', link: '/electronics' },
  { name: 'Furniture', image: '/images/furniture.png', link: '/furniture' },
  { name: 'Beauty', image: '/images/beauty.jpg', link: '/beauty' },
  { name: 'Fashion', image: '/images/fashions.jpeg', link: '/fashion' },
];

// Suggested products section
const suggestedProducts = [
  {
    name: 'iPhone 15 Pro',
    image: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-15-src/productlist/Mobile.jspro-finish-select-202309-6-7inch_AV1?wid=1200&hei=630&fmt=jpeg&qlt=95&.v=1692734591452',
    price: '$999',
  },
  {
    name: 'Samsung Galaxy S24 Ultra',
    image: 'https://images.samsung.com/is/image/samsung/assets/in/smartphones/galaxy-s24-ultra/images/galaxy-s24-ultra-highlights-kv.jpg',
    price: '$1199',
  },
  {
    name: 'Google Pixel 8 Pro',
    image: 'https://store.google.com/us/product/pixel_8_pro_images/pixel8pro.png',
    price: '$899',
  },
];

const Body = () => {
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

      {/* Video Section */}
      <ProductVideo />

      {/* Suggested for You */}
      <h2 className="section-title">Suggested for You</h2>
      <div className="suggested-products">
        {suggestedProducts.map((product, index) => (
          <div key={index} className="product-card">
            <img src={product.image} alt={product.name} className="product-image" />
            <h3 className="product-name">{product.name}</h3>
            <p className="product-price">{product.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Body;
