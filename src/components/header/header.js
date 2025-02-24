import React from 'react';
import '../header/header.css';

const Header = () => {
    return (
        <>
        <header>
            <div className='container-fluid'>
                <div className='row'>
                    <div className='col-md-12'>
                        <nav className='navbar navbar-expand-lg navbar-light bg-light'>
                            <a className='navbar-brand' href='#'>E-Commerce Store</a>
                            <button className='navbar-toggler' type='button' data-toggle='collapse' data-target='#navbarNav' aria-controls='navbarNav' aria-expanded='false' aria-label='Toggle navigation'>
                                <span className='navbar-toggler-icon'></span>
                            </button>
                            <div className='collapse navbar-collapse' id='navbarNav'>
                                <ul className='navbar-nav ml-auto'>
                                    <li className='nav-item active'>
                                        <a className='nav-link' href='#'>Home <span className='sr-only'>(current)</span></a>
                                    </li>
                                    <li className='nav-item'>
                                        <a className='nav-link' href='#'>Products</a>
                                    </li>
                                    <li className='nav-item'>
                                        <a className='nav-link' href='#'>Services</a>
                                    </li>
                                    <li className='nav-item'>
                                        <a className='nav-link' href='#'>Contact Us</a>
                                    </li>       
                                </ul>
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
