import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState, useEffect, createContext } from "react";

// Components
import Header from "./components/header/header";
import Footer from "./components/footer/footer";
import HeadRouting from "./AllRouting/HeadRouting";
import ProdRouting from "./AllRouting/ProdRouting";
import Cart from "./components/cart/Cart";
import AuthModal from "./components/auth/AuthModal";

// Context
import { CartProvider } from "./context/CartContext";

// Create Auth Context
export const AuthContext = createContext({
  isAuthenticated: false,
  setIsAuthenticated: () => {},
  user: null,
  setUser: () => {}
});

function App() {
  // Track authentication status and user data
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const token = localStorage.getItem("token");
    return !!token;
  });
  const [user, setUser] = useState(() => {
    const userId = localStorage.getItem("userId");
    return userId ? { id: userId } : null;
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Effect to handle authentication state changes
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    
    if (token && userId) {
      setIsAuthenticated(true);
      setUser({ id: userId });
    } else {
      setIsAuthenticated(false);
      setUser(null);
    }
  }, []);

  // Handle authentication modal
  const handleAuthClick = () => {
    if (isAuthenticated) {
      // Handle logout
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      setIsAuthenticated(false);
      setUser(null);
      // Close cart if open
      setIsCartOpen(false);
    } else {
      // Open auth modal
      setIsAuthModalOpen(true);
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, user, setUser }}>
      <CartProvider>
        <div className="app-container">
          {/* Creative Blobs - PicsArt inspired elements */}
          <div className="creative-blob blob-1"></div>
          <div className="creative-blob blob-2"></div>
          
          <Router>
            <Header 
              onCartClick={() => setIsCartOpen(true)} 
              onAuthClick={handleAuthClick}
            />
            <div className="main-content">
              <Routes>
                <Route path="/*" element={
                  <>
                    <HeadRouting />
                    <ProdRouting />
                  </>
                } />
              </Routes>
            </div>
            <Footer />
            <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
            <AuthModal 
              isOpen={isAuthModalOpen} 
              onClose={() => setIsAuthModalOpen(false)}
            />
          </Router>
        </div>
      </CartProvider>
    </AuthContext.Provider>
  );
}

export default App;
