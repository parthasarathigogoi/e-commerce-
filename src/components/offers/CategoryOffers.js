import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Offers.css';
import { FaFilter, FaArrowRight } from 'react-icons/fa';

// Category offers data
const categoryOffers = [
  {
    id: 1,
    title: "Luxury Watches",
    description: "BUY 1 GET 1 FREE",
    image: "/images/electronics.jpg",
    alternativeImage: "/images/electronics.jpg", // Second image for hover effect
    link: "/shop?category=Watches",
    discount: "50%",
    category: "Watches",
    color: "#1a1a1a",
    textColor: "#d4af37"
  },
  {
    id: 2,
    title: "Designer Clothes",
    description: "ALL AT ₹390",
    image: "/images/fashions.jpeg",
    alternativeImage: "/images/fashions.jpeg", // Second image for hover effect
    link: "/shop?category=Clothes",
    discount: "30%",
    category: "Clothes",
    color: "#222222",
    textColor: "#ffffff"
  },
  {
    id: 3,
    title: "Premium Shoes",
    description: "UPTO 40% OFF",
    image: "/images/mobile.jpg",
    alternativeImage: "/images/mobile.jpg", // Second image for hover effect
    link: "/shop?category=Shoes",
    discount: "40%",
    category: "Shoes",
    color: "#333333",
    textColor: "#d4af37"
  },
  {
    id: 4,
    title: "Luxury Belts",
    description: "BUY 2 GET 1 FREE",
    image: "/images/furniture.png",
    alternativeImage: "/images/furniture.png", // Second image for hover effect
    link: "/shop?category=Belts",
    discount: "33%",
    category: "Belts",
    color: "#444444",
    textColor: "#ffffff"
  },
  {
    id: 5,
    title: "Signature Perfumes",
    description: "FLAT 25% OFF",
    image: "/images/beauty.jpg",
    alternativeImage: "/images/beauty.jpg", // Second image for hover effect
    link: "/shop?category=Perfumes",
    discount: "25%",
    category: "Perfumes",
    color: "#555555",
    textColor: "#d4af37"
  },
  {
    id: 6,
    title: "Premium Accessories",
    description: "3 FOR 2",
    image: "/images/fashions.jpeg",
    alternativeImage: "/images/fashions.jpeg", // Second image for hover effect
    link: "/shop?category=Accessories",
    discount: "33%",
    category: "Accessories",
    color: "#666666",
    textColor: "#ffffff"
  }
];

const CategoryOffers = () => {
  const [visibleOffers, setVisibleOffers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  const [filterOpen, setFilterOpen] = useState(false);

  // Get unique categories
  const categories = ['all', ...new Set(categoryOffers.map(offer => offer.category))];

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setVisibleOffers(categoryOffers);
      setIsLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  // Filter offers by category
  const filterOffers = (category) => {
    setIsLoading(true);
    setActiveFilter(category);
    
    setTimeout(() => {
      if (category === 'all') {
        setVisibleOffers(categoryOffers);
      } else {
        setVisibleOffers(categoryOffers.filter(offer => offer.category === category));
      }
      setIsLoading(false);
      setFilterOpen(false);
    }, 500);
  };

  return (
    <section className="category-offers-section">
      <div className="filter-container">
        <button 
          className="filter-toggle" 
          onClick={() => setFilterOpen(!filterOpen)}
        >
          <FaFilter /> Filter Offers
        </button>
        
        <div className={`filter-dropdown ${filterOpen ? 'open' : ''}`}>
          {categories.map(category => (
            <button
              key={category}
              className={`filter-option ${activeFilter === category ? 'active' : ''}`}
              onClick={() => filterOffers(category)}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>
      </div>
      
      <div className="offers-grid">
        {isLoading ? (
          // Skeleton loading state
          Array(4).fill(0).map((_, index) => (
            <div key={index} className="offer-card skeleton">
              <div className="offer-image-container skeleton-image"></div>
              <div className="offer-content">
                <div className="skeleton-title"></div>
                <div className="skeleton-text"></div>
              </div>
            </div>
          ))
        ) : (
          // Actual offers
          visibleOffers.map((offer, index) => (
            <Link 
              to={offer.link} 
              key={offer.id} 
              className="offer-card animate-fade-in"
              style={{
                animationDelay: `${index * 0.1}s`,
                backgroundColor: offer.color
              }}
            >
              <div className="offer-image-container">
                <img src={offer.image} alt={offer.title} className="offer-image" />
                {offer.alternativeImage && (
                  <img src={offer.alternativeImage} alt={offer.title} className="alternative-image" />
                )}
                <div className="offer-overlay"></div>
              </div>
              <div className="offer-content" style={{ color: offer.textColor }}>
                <h3 className="offer-title">{offer.title}</h3>
                <div className="animated-discount">
                  <span className="discount-text">{offer.description}</span>
                </div>
                <div className="offer-action">
                  <span>Shop Now</span>
                  <FaArrowRight className="arrow-icon" />
                </div>
              </div>
              <div className="discount-badge" style={{ backgroundColor: offer.textColor, color: offer.color }}>
                {offer.discount}
              </div>
            </Link>
          ))
        )}
      </div>
    </section>
  );
};

export default CategoryOffers; 