import React from 'react'
import { Routes, Route } from "react-router-dom";
import Home from '../components/pages/Home';
import Products from '../components/pages/Products';
import Services from '../components/pages/Services';
import Shop from '../pages/Shop';
import Categories from '../pages/Categories';
import Contact from '../pages/Contact';
import About from '../pages/About';
import TestPage from '../pages/TestPage';
import ProductDetail from '../pages/ProductDetail';

function HeadRouting() {
  return (
    <Routes>
          <Route path="/" exact={true} element={<Home/>} />
          <Route path="/products" exact={true} element={<Products/>} />
          <Route path="/services" exact={true} element={<Services/>} />
          <Route path="/shop" exact={true} element={<Shop/>} />
          <Route path="/categories" exact={true} element={<Categories/>} />
          <Route path="/contact" exact={true} element={<Contact/>} />
          <Route path="/about" exact={true} element={<About/>} />
          <Route path="/test" exact={true} element={<TestPage/>} />
          <Route path="/product/:productId" element={<ProductDetail/>} />
    </Routes>
  )
}

export default HeadRouting
