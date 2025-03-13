import React from 'react';
import { Link } from 'react-router-dom';
import './footer.css';
import { 
  FaFacebookF, 
  FaTwitter, 
  FaInstagram, 
  FaLinkedinIn, 
  FaMapMarkerAlt, 
  FaPhone, 
  FaEnvelope, 
  FaCreditCard, 
  FaPaypal,
  FaCcVisa,
  FaCcMastercard,
  FaCcAmex,
  FaCcDiscover,
  FaCcApplePay
} from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="footer-container">
          <div className="footer-columns">
            {/* Company Info */}
            <div className="footer-column">
              <h3 className="footer-title">ELEGANCE</h3>
              <p className="footer-description">
                Curating timeless products with sophisticated design and premium quality. Our aesthetic reflects our commitment to elegance and simplicity.
              </p>
              <div className="footer-social">
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-icon">
                  <FaFacebookF />
                </a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-icon">
                  <FaTwitter />
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-icon">
                  <FaInstagram />
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="social-icon">
                  <FaLinkedinIn />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div className="footer-column">
              <h3 className="footer-title">Quick Links</h3>
              <ul className="footer-links">
                <li><Link to="/">Home</Link></li>
                <li><Link to="/shop">Shop</Link></li>
                <li><Link to="/categories">Categories</Link></li>
                <li><Link to="/about">About Us</Link></li>
                <li><Link to="/contact">Contact</Link></li>
              </ul>
            </div>

            {/* Customer Service */}
            <div className="footer-column">
              <h3 className="footer-title">Customer Service</h3>
              <ul className="footer-links">
                <li><Link to="/faq">FAQ</Link></li>
                <li><Link to="/shipping">Shipping & Returns</Link></li>
                <li><Link to="/terms">Terms & Conditions</Link></li>
                <li><Link to="/privacy">Privacy Policy</Link></li>
                <li><Link to="/track-order">Track Order</Link></li>
              </ul>
            </div>

            {/* Contact Info */}
            <div className="footer-column">
              <h3 className="footer-title">Contact Us</h3>
              <ul className="footer-contact">
                <li>
                  <FaMapMarkerAlt className="contact-icon" />
                  <span>123 Elegance Street, Fashion District, NY 10001</span>
                </li>
                <li>
                  <FaPhone className="contact-icon" />
                  <span>+1 (555) 123-4567</span>
                </li>
                <li>
                  <FaEnvelope className="contact-icon" />
                  <span>support@elegance.com</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-container">
          <p className="copyright">
            © {currentYear} ELEGANCE. All rights reserved.
          </p>
          <div className="payment-methods">
            <FaCcVisa className="payment-icon" title="Visa" />
            <FaCcMastercard className="payment-icon" title="MasterCard" />
            <FaCcAmex className="payment-icon" title="American Express" />
            <FaPaypal className="payment-icon" title="PayPal" />
            <FaCcApplePay className="payment-icon" title="Apple Pay" />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
