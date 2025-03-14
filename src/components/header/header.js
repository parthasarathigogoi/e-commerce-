// import React from "react";
// import { Link } from "react-router-dom";
// import "./header.css";
// import SearchIcon from "@mui/icons-material/Search";
// import AccountCircleIcon from "@mui/icons-material/AccountCircle";
// import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

// const Header = () => {
//   let cartIcon = document.getElementById("icon-button")
//   cartIcon.addEventListener("click",()=>{
//     console.log("Button clicked")
//   })
//   return (
//     <header className="header">
//       <div className="container-fluid px-3">
//         <nav className="navbar navbar-expand-lg navbar-light bg-light">
//           <Link className="navbar-brand d-flex align-items-center" to="/">
//             <img
//               src={`${process.env.PUBLIC_URL}/logo_no_bg.png`}
//               alt="Logo"
//               className="logo-img"
//             />
//             <span className="brand-text">Dukan</span>
//           </Link>

//           {/* Navbar Toggler */}
//           <button
//             className="navbar-toggler"
//             type="button"
//             data-bs-toggle="collapse"
//             data-bs-target="#navbarNav"
//             aria-controls="navbarNav"
//             aria-expanded="false"
//             aria-label="Toggle navigation"
//           >
//             <span className="navbar-toggler-icon"></span>
//           </button>

//           {/* Navbar Items */}
//           <div className="collapse navbar-collapse" id="navbarNav">
//             <ul className="navbar-nav me-auto">
//               <li className="nav-item">
//                 <Link className="nav-link" to="/">Home</Link>
//               </li>
//               <li className="nav-item">
//                 <Link className="nav-link" to="/products">Products</Link>
//               </li>
//               <li className="nav-item">
//                 <Link className="nav-link" to="/services">Services</Link>
//               </li>
//               <li className="nav-item">
//                 <Link className="nav-link" to="/contact">Contact Us</Link>
//               </li>
//             </ul>

//             {/* Icons & Search Bar */}
//             <div className="icon-container d-flex align-items-center">
//               <input
//                 type="text"
//                 className="search-bar"
//                 placeholder="Search for products..."
//               />
//               <button className="icon-button" aria-label="Search">
//                 <SearchIcon className="header-icon" />
//               </button>
//               <button className="icon-button" aria-label="Account">
//                 <AccountCircleIcon className="header-icon" />
//               </button>
//               <button className="icon-button" aria-label="Cart">
//                 <ShoppingCartIcon className="header-icon" />
//               </button>
//             </div>
//           </div>
//         </nav>
//       </div>
//     </header>
//   );
// };

// export default Header;

import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './header.css';
import { FaSearch, FaShoppingCart, FaUser, FaCrown, FaStore } from 'react-icons/fa';
import { useCart } from '../../context/CartContext';
import { AuthContext } from '../../App';
import { useSeller } from '../../context/SellerContext';
import ProfileDropdown from './ProfileDropdown';

const Header = ({ onCartClick, onAuthClick, onSellerAuthClick }) => {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchActive, setSearchActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const { getCartCount } = useCart();
  const { isAuthenticated } = useContext(AuthContext);
  const { isSellerAuthenticated } = useSeller();

  // Handle scroll event to change header style
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isProfileDropdownOpen && !event.target.closest('.profile-section')) {
        setIsProfileDropdownOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isProfileDropdownOpen]);

  // Toggle search bar
  const toggleSearch = () => {
    setSearchActive(!searchActive);
    if (searchActive) {
      setSearchQuery('');
    }
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Handle search submission
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      console.log('Searching for:', searchQuery);
      // Navigate to shop page with search query parameter
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchActive(false);
      setSearchQuery('');
    }
  };

  // Handle profile button click
  const handleProfileClick = (e) => {
    e.stopPropagation();
    if (isAuthenticated) {
      setIsProfileDropdownOpen(!isProfileDropdownOpen);
    } else {
      onAuthClick();
    }
  };

  // Handle seller button click
  const handleSellerClick = (e) => {
    e.stopPropagation();
    if (isSellerAuthenticated) {
      // Use React Router navigation instead of window.location
      navigate('/seller/dashboard');
    } else {
      onSellerAuthClick();
    }
  };

  return (
    <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
      <div className="header-container">
        {/* Logo */}
        <Link to="/" className="logo">
          <div className="logo-icon">
            <FaCrown className="crown-icon" />
          </div>
          <span className="logo-text">
            <span className="logo-elegant">DIKHOW</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="nav-menu">
          <ul className="nav-list">
            <li className="nav-item">
              <Link to="/" className="nav-link">
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/shop" className="nav-link">
                Shop
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/categories" className="nav-link">
                Categories
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/contact" className="nav-link">
                Contact
              </Link>
            </li>
            {isSellerAuthenticated && !isAuthenticated && (
              <li className="nav-item">
                <Link to="/seller/dashboard" className="nav-link">
                  Seller Dashboard
                </Link>
              </li>
            )}
          </ul>
        </nav>

        {/* Header Actions */}
        <div className="header-actions">
          {/* Search */}
          <div className={`search-container ${searchActive ? 'active' : ''}`}>
            <button className="action-button search-button" onClick={toggleSearch}>
              <FaSearch />
            </button>
            <form className="search-form" onSubmit={handleSearchSubmit}>
              <input
                type="text"
                placeholder="Search for premium products..."
                className="search-input"
                value={searchQuery}
                onChange={handleSearchChange}
              />
              <button type="submit" className="search-submit">
                <FaSearch />
              </button>
            </form>
          </div>

          {/* Seller Button */}
          {!isAuthenticated && (
            <button 
              className={`action-button seller-button ${isSellerAuthenticated ? 'seller-active' : ''}`}
              onClick={handleSellerClick}
              title={isSellerAuthenticated ? 'Seller Dashboard' : 'Become a Seller'}
            >
              <FaStore />
            </button>
          )}

          {/* User Profile / Auth */}
          <div className="profile-section" style={{ position: 'relative' }}>
            <button 
              className={`action-button ${isAuthenticated ? 'profile-button' : 'login-button'}`}
              onClick={handleProfileClick}
              title={isAuthenticated ? 'My Account' : 'Login'}
            >
              <FaUser />
            </button>
            {isAuthenticated && (
              <ProfileDropdown 
                isOpen={isProfileDropdownOpen}
                onClose={() => setIsProfileDropdownOpen(false)}
                onLogout={onAuthClick}
              />
            )}
          </div>

          {/* Cart */}
          <button className="action-button cart-button" onClick={onCartClick}>
            <FaShoppingCart />
            <span className="cart-badge">{getCartCount()}</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
