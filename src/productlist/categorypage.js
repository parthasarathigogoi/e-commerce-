import React from 'react';
import { useParams } from 'react-router-dom';
import './categoryPage.css';

const categoryData = {
  groceries: [
    { name: 'Fortune Basmati Rice', price: '₹120/kg', image: '/images/rice.jpg' },
    { name: 'Aashirvaad Atta', price: '₹240/5kg', image: '/images/flour.jpg' }
  ],
  mobile: [
    { name: 'iPhone 15 Pro', price: '₹1,39,900', image: '/images/iphone15.jpg' },
    { name: 'OnePlus 11R', price: '₹44,999', image: '/images/oneplus11r.jpg' }
  ],
  electronics: [
    { name: 'Sony Bravia 55-inch 4K TV', price: '₹75,000', image: '/images/tv.jpg' },
    { name: 'JBL Charge 5 Speaker', price: '₹14,999', image: '/images/speaker.jpg' }
  ],
  furniture: [
    { name: 'Wooden Dining Table', price: '₹15,000', image: '/images/table.jpg' },
    { name: 'Ergonomic Office Chair', price: '₹8,999', image: '/images/chair.jpg' }
  ],
  beauty: [
    { name: 'Lakme Foundation', price: '₹699', image: '/images/foundation.jpg' },
    { name: 'Maybelline Lipstick', price: '₹499', image: '/images/lipstick.jpg' }
  ],
  fashion: [
    { name: "Men's Denim Jacket", price: '₹2,499', image: '/images/jacket.jpg' },
    { name: "Women's Ethnic Dress", price: '₹3,999', image: '/images/dress.jpg' }
  ]
};

const CategoryPage = () => {
  const { categoryName } = useParams();
  const products = categoryData[categoryName.toLowerCase()] || [];

  return (
    <div className="category-page">
      <h2 className="category-title">{categoryName.toUpperCase()}</h2>
      <div className="product-list">
        {products.length > 0 ? (
          products.map((product, index) => (
            <div key={index} className="product-card">
              <img src={product.image} alt={product.name} className="product-image" />
              <h3 className="product-name">{product.name}</h3>
              <p className="product-price">{product.price}</p>
            </div>
          ))
        ) : (
          <p>No products available.</p>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;
