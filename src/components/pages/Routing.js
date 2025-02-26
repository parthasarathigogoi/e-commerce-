import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Pages
import Home from './Home';
import Products from './Products';
import Services from './Services';
import ContactUs from './ContactUs';
import Groceries from './productlist/Groceries'; // Added Groceries page

function Routing() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/services" element={<Services />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/products/groceries" element={<Groceries />} /> {/* New Route */}
      </Routes>
    </Router>
  );
}

export default Routing;
