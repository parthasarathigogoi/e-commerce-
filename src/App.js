import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Components
import Header from './components/header/header';
import Footer from './components/footer/footer';
// import Body from './components/body/body';
//pages
import Home from './components/pages/Home'
import Products from './components/pages/Products'
import Services from './components/pages/Services'
import ContactUs from './components/pages/ContactUs'
// Category Pages
import Groceries from './productlist/Groceries';
import Mobile from './productlist/Mobile';
import Electronics from './productlist/Electronics';
import Furniture from './productlist/Furniture';
import Beauty from './productlist/Beauty';
import Fashion from './productlist/Fashion';

// Product Video Page
import ProductVideo from './components/video/ProductVideo';

function App() {
  return (
    <Router>
      <Header />
      <main className="main-content">
        <Routes>
          <Route path="/" exact={true} element={<Home/>} />
          <Route path="/products" exact={true} element={<Products/>} />
          <Route path="/services" exact={true} element={<Services/>} />
          <Route path="/contact" exact={true} element={<ContactUs/>} />

          {/* <Route path="/body" element={<Body />} /> */}
          <Route path="/groceries" element={<Groceries />} />
          <Route path="/mobile" element={<Mobile />} />
          <Route path="/electronics" element={<Electronics />} />
          <Route path="/furniture" element={<Furniture />} />
          <Route path="/beauty" element={<Beauty />} />
          <Route path="/fashion" element={<Fashion />} />

          {/* Route for Product Video */}
          <Route path="/product-video" element={<ProductVideo />} />
        </Routes>
      </main>
      <Footer />
    </Router>
  );
}

export default App;
