import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/header/header';
import Footer from './components/footer/footer';
import Body from './components/body/body';

// // Importing individual category pages (Create these components)
import Groceries from './pages/Groceries';
import Mobile from './pages/Mobile';
import Electronics from './pages/Electronics';
import Furniture from './pages/Furniture';
import Beauty from './pages/Beauty';
import Fashion from './pages/Fashion';

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
