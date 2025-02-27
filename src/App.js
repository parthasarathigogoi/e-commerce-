import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { BrowserRouter as Router} from 'react-router-dom';

// Components
import Header from './components/header/header';
import Footer from './components/footer/footer';
import HeadRouting from './AllRouting/HeadRouting';
import ProdRouting from './AllRouting/ProdRouting';

function App() {
  return (
    <Router>
      <Header />
      <HeadRouting/>
      <ProdRouting/>
      <Footer />
    </Router>
  );
}

export default App;
