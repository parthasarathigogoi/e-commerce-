import React from 'react';
import { useParams } from 'react-router-dom';
import './productCSS/categoryPage.css';
import ProductCard from '../components/ProductCard';

const categoryData = {
  mobile: [
    { 
      _id: 'm1', 
      name: 'iPhone 15 Pro', 
      price: 139900, 
      image: '/images/iphone15.jpg',
      rating: 4.8,
      reviews: 230,
      category: 'Mobile',
      inStock: true,
      isNew: true,
      isTrending: true,
      discount: 0
    },
    { 
      _id: 'm2', 
      name: 'OnePlus 11R', 
      price: 44999, 
      image: '/images/oneplus11r.jpg',
      rating: 4.6,
      reviews: 175,
      category: 'Mobile',
      inStock: true,
      isNew: false,
      isTrending: false,
      discount: 15
    }
  ],
  electronics: [
    { 
      _id: 'e1', 
      name: 'Sony Bravia 55-inch 4K TV', 
      price: 75000, 
      image: '/images/tv.jpg',
      rating: 4.5,
      reviews: 95,
      category: 'Electronics',
      inStock: true,
      isNew: false,
      isTrending: true,
      discount: 5
    },
    { 
      _id: 'e2', 
      name: 'JBL Charge 5 Speaker', 
      price: 14999, 
      image: '/images/speaker.jpg',
      rating: 4.7,
      reviews: 120,
      category: 'Electronics',
      inStock: true,
      isNew: true,
      isTrending: false,
      discount: 0
    }
  ],
  furniture: [
    { 
      _id: 'f1', 
      name: 'Wooden Dining Table', 
      price: 15000, 
      image: '/images/table.jpg',
      rating: 4.3,
      reviews: 65,
      category: 'Furniture',
      inStock: true,
      isNew: false,
      isTrending: false,
      discount: 20
    },
    { 
      _id: 'f2', 
      name: 'Ergonomic Office Chair', 
      price: 8999, 
      image: '/images/chair.jpg',
      rating: 4.6,
      reviews: 85,
      category: 'Furniture',
      inStock: true,
      isNew: true,
      isTrending: true,
      discount: 0
    }
  ],
  beauty: [
    { 
      _id: 'b1', 
      name: 'Lakme Foundation', 
      price: 699, 
      image: '/images/foundation.jpg',
      rating: 4.4,
      reviews: 110,
      category: 'Beauty',
      inStock: true,
      isNew: false,
      isTrending: true,
      discount: 5
    },
    { 
      _id: 'b2', 
      name: 'Maybelline Lipstick', 
      price: 499, 
      image: '/images/lipstick.jpg',
      rating: 4.5,
      reviews: 95,
      category: 'Beauty',
      inStock: true,
      isNew: true,
      isTrending: false,
      discount: 0
    }
  ],
  fashion: [
    { 
      _id: 'fa1', 
      name: "Men's Denim Jacket", 
      price: 2499, 
      image: '/images/jacket.jpg',
      rating: 4.2,
      reviews: 75,
      category: 'Fashion',
      inStock: true,
      isNew: false,
      isTrending: false,
      discount: 10
    },
    { 
      _id: 'fa2', 
      name: "Women's Ethnic Dress", 
      price: 3999, 
      image: '/images/dress.jpg',
      rating: 4.7,
      reviews: 130,
      category: 'Fashion',
      inStock: true,
      isNew: true,
      isTrending: true,
      discount: 15
    }
  ]
};

const CategoryPage = () => {
  const { categoryName } = useParams();
  const products = categoryData[categoryName.toLowerCase()] || [];

  return (
    <div className="category-page">
      <h2 className="category-title">{categoryName.toUpperCase()}</h2>
      <div className="product-grid">
        {products.length > 0 ? (
          products.map((product, index) => (
            <div key={index} className="product-grid-item">
              <ProductCard product={product} />
            </div>
          ))
        ) : (
          <p className="no-products">No products available.</p>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;
