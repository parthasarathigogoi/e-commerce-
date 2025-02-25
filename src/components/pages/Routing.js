import React from 'react'
import { BrowserRouter,Routes, Route } from 'react-router-dom';
//pages
import Home from './Home';
import Products from './Products';
import Services from './Services';
import ContactUs from './ContactUs';

function Routing() {
  return (
    <>
    <BrowserRouter>
      <Routes>
        <Route path="/" exact={true} element={<Home/>} />
        <Route path="/products" exact={true} element={<Products/>} />
        <Route path="/services" exact={true} element={<Services/>} />
        <Route path="/contact" exact={true} element={<ContactUs/>} />
      </Routes>
    </BrowserRouter>
     
    </>
  )
}

export default Routing
