import React, { useState, useEffect } from 'react';
import './Offers.css';
import { FaGift, FaTag, FaPercent } from 'react-icons/fa';

const offers = [
  {
    id: 1,
    text: "SUMMER SALE: Up to 50% OFF on selected items",
    icon: <FaPercent />,
    color: "#d4af37"
  },
  {
    id: 2,
    text: "BUY 1 GET 1 FREE on all premium watches",
    icon: <FaGift />,
    color: "#d4af37"
  },
  {
    id: 3,
    text: "FREE SHIPPING on orders over $200",
    icon: <FaTag />,
    color: "#d4af37"
  }
];

const StickyOfferBar = () => {
  const [activeOfferIndex, setActiveOfferIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveOfferIndex((prevIndex) => (prevIndex + 1) % offers.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="sticky-offer-bar">
      <div className="offer-slider">
        {offers.map((offer, index) => (
          <div 
            key={offer.id} 
            className={`offer-slide ${index === activeOfferIndex ? 'active' : ''}`}
            style={{ 
              transform: `translateX(${(index - activeOfferIndex) * 100}%)`,
              opacity: index === activeOfferIndex ? 1 : 0
            }}
          >
            <span className="offer-icon" style={{ color: offer.color }}>{offer.icon}</span>
            <span className="offer-text">{offer.text}</span>
          </div>
        ))}
      </div>
      <div className="offer-indicators">
        {offers.map((_, index) => (
          <span 
            key={index} 
            className={`indicator ${index === activeOfferIndex ? 'active' : ''}`}
            onClick={() => setActiveOfferIndex(index)}
          ></span>
        ))}
      </div>
    </div>
  );
};

export default StickyOfferBar; 