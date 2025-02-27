import React from 'react'
import { Routes, Route } from "react-router-dom";
import Home from '../components/pages/Home';
import Products from '../components/pages/Products';
import Services from '../components/pages/Services';
import ContactUs from '../components/pages/ContactUs';

function HeadRouting() {
  return (
    <Routes>
          <Route path="/" exact={true} element={<Home/>} />
          <Route path="/products" exact={true} element={<Products/>} />
          <Route path="/services" exact={true} element={<Services/>} />
          <Route path="/contact" exact={true} element={<ContactUs/>} />
    </Routes>
  )
}

export default HeadRouting
