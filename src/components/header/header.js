import React from 'react';
import '../header/header.css';
import SearchIcon from '@mui/icons-material/Search';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

const Header = () => {
    return (
        <>
            <header>
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-md-12">
                            <nav className="navbar navbar-expand-lg navbar-light bg-light">
                                <a className="navbar-brand d-flex align-items-center" href="#">
                                    <img
                                        src={`${process.env.PUBLIC_URL}/logo_no_bg.png`}
                                        alt="Logo"
                                        className="logo-img"
                                    />
                                    E-Commerce Store
                                </a>
                                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                                    <span className="navbar-toggler-icon"></span>
                                </button>
                                <div className="collapse navbar-collapse" id="navbarNav">
                                    <ul className="navbar-nav ml-auto">
                                        <li className="nav-item active">
                                            <a className="nav-link" href="#">Home</a>
                                        </li>
                                        <li className="nav-item">
                                            <a className="nav-link" href="#">Products</a>
                                        </li>
                                        <li className="nav-item">
                                            <a className="nav-link" href="#">Services</a>
                                        </li>
                                        <li className="nav-item">
                                            <a className="nav-link" href="#">Contact Us</a>
                                        </li>
                                    </ul>
                                    {/* Icons Section */}
                                    <div className="icon-container ml-auto">
                                        <SearchIcon className="header-icon" />
                                        <AccountCircleIcon className="header-icon" />
                                        <ShoppingCartIcon className="header-icon" />
                                    </div>
                                </div>
                            </nav>
                        </div>
                    </div>
                </div>
            </header>
        </>
    );
};

export default Header;
