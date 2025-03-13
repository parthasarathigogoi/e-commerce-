import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Offers.css';
import { FaArrowRight } from 'react-icons/fa';

// Special offers data
const specialOffers = [
  {
    id: 1,
    title: "Luxury Watches",
    description: "BUY 1 GET 1 FREE",
    image: "/images/electronics.jpg",
    link: "/shop?category=Watches",
    discount: "50%",
    color: "#1a1a1a",
    textColor: "#d4af37"
  },
  {
    id: 2,
    title: "Designer Clothes",
    description: "ALL AT ₹390",
    image: "/images/fashions.jpeg",
    link: "/shop?category=Clothes",
    discount: "30%",
    color: "#222222",
    textColor: "#ffffff"
  },
  {
    id: 3,
    title: "Premium Shoes",
    description: "UPTO 40% OFF",
    image: "/images/mobile.jpg",
    link: "/shop?category=Shoes",
    discount: "40%",
    color: "#333333",
    textColor: "#d4af37"
  },
  {
    id: 4,
    title: "Luxury Belts",
    description: "BUY 2 GET 1 FREE",
    image: "/images/furniture.png",
    link: "/shop?category=Belts",
    discount: "33%",
    color: "#444444",
    textColor: "#ffffff"
  }
];

const SpecialOffers = () => {
  const [visibleOffers, setVisibleOffers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setVisibleOffers(specialOffers);
      setIsLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="special-offers-section">
      <h2 className="section-title elegant-font">Special Offers</h2>
      <p className="section-subtitle">Exclusive deals on premium products</p>
      
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
      
      <div className="animated-banner">
        <div className="banner-content">
          <div className="scrolling-text">
            <span>EXCLUSIVE DEALS</span>
            <span>•</span>
            <span>LIMITED TIME OFFERS</span>
            <span>•</span>
            <span>PREMIUM PRODUCTS</span>
            <span>•</span>
            <span>LUXURY COLLECTION</span>
            <span>•</span>
          </div>
          <div className="scrolling-text">
            <span>EXCLUSIVE DEALS</span>
            <span>•</span>
            <span>LIMITED TIME OFFERS</span>
            <span>•</span>
            <span>PREMIUM PRODUCTS</span>
            <span>•</span>
            <span>LUXURY COLLECTION</span>
            <span>•</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SpecialOffers; 