import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import Bootstrap and global styles
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

// Import Layout Components
import Header from './components/header/header';
import Footer from './components/footer/footer';

// Import Pages
import Body from './components/body/body';
import Groceries from './productlist/Groceries';
import Mobile from './productlist/Mobile';
import Electronics from './productlist/Electronics';
import Furniture from './productlist/Furniture';
import Beauty from './productlist/Beauty';
import Fashion from './productlist/Fashion';

function App() {
  return (
    <Router>
      <Header />
      <div className="main-content">
        <Routes>
          <Route path="/" element={<Body />} />
          <Route path="/groceries" element={<Groceries />} />
          <Route path="/mobile" element={<Mobile />} />
          <Route path="/electronics" element={<Electronics />} />
          <Route path="/furniture" element={<Furniture />} />
          <Route path="/beauty" element={<Beauty />} />
          <Route path="/fashion" element={<Fashion />} />
        </Routes>
      </div>
      <Footer />
    </Router>
  );
}

export default App;
