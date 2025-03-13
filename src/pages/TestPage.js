import React from 'react';
import { Link } from 'react-router-dom';

const TestPage = () => {
  return (
    <div style={{ padding: '50px', textAlign: 'center' }}>
      <h1>Test Page</h1>
      <p>This is a test page to verify that routing is working correctly.</p>
      <div style={{ marginTop: '30px' }}>
        <h2>Navigation Links</h2>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li style={{ margin: '10px 0' }}>
            <Link to="/" style={{ textDecoration: 'none', color: 'blue' }}>Home</Link>
          </li>
          <li style={{ margin: '10px 0' }}>
            <Link to="/shop" style={{ textDecoration: 'none', color: 'blue' }}>Shop</Link>
          </li>
          <li style={{ margin: '10px 0' }}>
            <Link to="/categories" style={{ textDecoration: 'none', color: 'blue' }}>Categories</Link>
          </li>
          <li style={{ margin: '10px 0' }}>
            <Link to="/contact" style={{ textDecoration: 'none', color: 'blue' }}>Contact</Link>
          </li>
          <li style={{ margin: '10px 0' }}>
            <Link to="/about" style={{ textDecoration: 'none', color: 'blue' }}>About</Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default TestPage; 