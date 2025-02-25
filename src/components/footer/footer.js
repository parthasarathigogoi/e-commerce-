import React from 'react';
import './footer.css';

const Footer = () => {
  return (
    <footer className="footer text-center">
      <p>© 2025 E-Commerce Store. All Rights Reserved.</p>
      <div className="footer-links">
        <a href="/about">About Us</a> | 
        <a href="/contact">Contact</a> | 
        <a href="/terms">Terms & Conditions</a> | 
        <a href="/privacy">Privacy Policy</a>
      </div>
    </footer>
  );
};

export default Footer;
