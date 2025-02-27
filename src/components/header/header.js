import React from "react";
import { Link } from "react-router-dom";
import "./header.css";
import SearchIcon from "@mui/icons-material/Search";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

const Header = () => {
  return (
    <header>
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-12">
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
              <Link className="navbar-brand d-flex align-items-center" to="/">
                <img
                  src={`${process.env.PUBLIC_URL}/logo_no_bg.png`}
                  alt="Logo"
                  className="logo-img"
                />
                Dukan
              </Link>
              <button
                className="navbar-toggler"
                type="button"
                data-toggle="collapse"
                data-target="#navbarNav"
                aria-controls="navbarNav"
                aria-expanded="false"
                aria-label="Toggle navigation"
              >
                <span className="navbar-toggler-icon"></span>
              </button>
              <div className="collapse navbar-collapse" id="navbarNav">
                <ul className="navbar-nav ml-auto">
                  <li className="nav-item">
                    <Link className="nav-link" to="/">
                      Home
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/products">
                      Products
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/services">
                      Services
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/contact">
                      Contact Us
                    </Link>
                  </li>
                </ul>
              
                  <div className="icon-container ml-auto d-flex align-items-center">
                   <input
                      type="text"
                      className="search-bar"
                      placeholder="Search for products..."
                    />
                    <button className="icon-button" aria-label="Search">
                      <SearchIcon className="header-icon" />
                    </button>
                    <button className="icon-button" aria-label="Account">
                      <AccountCircleIcon className="header-icon" />
                    </button>
                    <button className="icon-button" aria-label="Cart">
                      <ShoppingCartIcon className="header-icon" />
                    </button>
                  </div>
                
              </div>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

