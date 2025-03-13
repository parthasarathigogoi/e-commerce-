import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import { useState, useEffect, createContext } from "react";

// Components
import Header from "./components/header/header";
import Footer from "./components/footer/footer";
import HeadRouting from "./AllRouting/HeadRouting";
import ProdRouting from "./AllRouting/ProdRouting";
import Cart from "./components/cart/Cart";
import AuthModal from "./components/auth/AuthModal";
import SellerAuthModal from "./components/auth/SellerAuthModal";
import SellerDashboard from "./pages/SellerDashboard";

// Context
import { CartProvider } from "./context/CartContext";
import { SellerProvider } from "./context/SellerContext";

// Create Auth Context
export const AuthContext = createContext({
  isAuthenticated: false,
  setIsAuthenticated: () => {},
  user: null,
  setUser: () => {}
});

// App Content Component (to use hooks inside Router)
function AppContent() {
  const navigate = useNavigate();
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
  const [isSellerAuthModalOpen, setIsSellerAuthModalOpen] = useState(false);

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

  // Effect to check for seller login/logout and update customer auth state
  useEffect(() => {
    const handleStorageChange = () => {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");
      const sellerToken = localStorage.getItem("sellerToken");
      
      // If seller logs in, log out customer
      if (sellerToken && token) {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        setIsAuthenticated(false);
        setUser(null);
      }
      
      // Update customer auth state
      if (token && userId) {
        setIsAuthenticated(true);
        setUser({ id: userId });
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
    };
    
    // Listen for storage changes
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
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
      // Redirect to homepage
      navigate('/');
    } else {
      // Open auth modal
      setIsAuthModalOpen(true);
    }
  };

  // Handle seller authentication modal
  const handleSellerAuthClick = () => {
    setIsSellerAuthModalOpen(true);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, user, setUser }}>
      <SellerProvider>
        <CartProvider>
          <div className="app-container">
            {/* Creative Blobs - PicsArt inspired elements */}
            <div className="creative-blob blob-1"></div>
            <div className="creative-blob blob-2"></div>
            
            <Header 
              onCartClick={() => setIsCartOpen(true)} 
              onAuthClick={handleAuthClick}
              onSellerAuthClick={handleSellerAuthClick}
            />
            <div className="main-content">
              <Routes>
                <Route path="/*" element={
                  <>
                    <HeadRouting />
                    <ProdRouting />
                  </>
                } />
                <Route path="/seller/dashboard" element={<SellerDashboard />} />
              </Routes>
            </div>
            <Footer />
            <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
            <AuthModal 
              isOpen={isAuthModalOpen} 
              onClose={() => setIsAuthModalOpen(false)}
            />
            <SellerAuthModal
              isOpen={isSellerAuthModalOpen}
              onClose={() => setIsSellerAuthModalOpen(false)}
            />
          </div>
        </CartProvider>
      </SellerProvider>
    </AuthContext.Provider>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
