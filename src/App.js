import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { BrowserRouter as Router, Routes, Route, useNavigate, Navigate } from "react-router-dom";
import { useState, useEffect, createContext, useContext } from "react";

// Components
import Header from "./components/header/header";
import Footer from "./components/footer/footer";
import HeadRouting from "./AllRouting/HeadRouting";
import ProdRouting from "./AllRouting/ProdRouting";
import AdminRouting from "./AllRouting/AdminRouting";
import Cart from "./components/cart/Cart";
import AuthModal from "./components/auth/AuthModal";
import SellerAuthModal from "./components/auth/SellerAuthModal";
import SellerDashboard from "./pages/SellerDashboard";
import AdminPasswordModal from "./components/admin/AdminPasswordModal";
import Chatbot from "./components/chatbot/Chatbot";

// Context
import { CartProvider } from "./context/CartContext";
import { SellerProvider, useSeller } from "./context/SellerContext";
import { AdminProvider } from "./context/AdminContext";
import { ChatbotProvider } from "./context/ChatbotContext";

// Create Auth Context
export const AuthContext = createContext({
  isAuthenticated: false,
  setIsAuthenticated: () => {},
  user: null,
  setUser: () => {}
});

// Protected Route Component for Seller
const SellerProtectedRoute = ({ children }) => {
  const { isSellerAuthenticated } = useSeller();
  const authContext = useContext(AuthContext);
  
  // Redirect to home if not authenticated as seller or if authenticated as regular user
  if (!isSellerAuthenticated || authContext.isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

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
  const [isAdminPasswordModalOpen, setIsAdminPasswordModalOpen] = useState(false);

  // Effect to handle authentication state changes and check for conflicting logins
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    const sellerToken = localStorage.getItem("sellerToken");
    
    // If both user and seller are logged in, prioritize user and log out seller
    if (token && sellerToken) {
      localStorage.removeItem("sellerToken");
      localStorage.removeItem("sellerData");
      console.log("Conflicting logins detected: User login prioritized, seller logged out");
    }
    
    if (token && userId) {
      setIsAuthenticated(true);
      setUser({ id: userId });
    } else {
      setIsAuthenticated(false);
      setUser(null);
    }
  }, []);

  // Effect to handle storage changes for authentication
  useEffect(() => {
    const handleStorageChange = () => {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");
      const sellerToken = localStorage.getItem("sellerToken");
      
      // If both user and seller are logged in, prioritize user and log out seller
      if (token && sellerToken) {
        localStorage.removeItem("sellerToken");
        localStorage.removeItem("sellerData");
        console.log("Storage change: User login prioritized, seller logged out");
      }
      
      // Update authentication state based on token presence
      if (token && userId) {
        setIsAuthenticated(true);
        setUser({ id: userId });
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Handle auth modal open
  const handleAuthClick = () => {
    // If user is authenticated, handle logout
    if (isAuthenticated) {
      // Remove auth tokens and user data
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      setIsAuthenticated(false);
      setUser(null);
      
      // Close cart if open
      setIsCartOpen(false);
      
      // Redirect to homepage
      navigate('/');
    } else {
      // Open auth modal for login/signup
      setIsAuthModalOpen(true);
    }
  };

  // Handle seller auth modal open
  const handleSellerAuthClick = () => {
    setIsSellerAuthModalOpen(true);
  };

  // Handle logo click to open admin password modal
  const handleLogoClick = () => {
    setIsAdminPasswordModalOpen(true);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, user, setUser }}>
      <AdminProvider>
        <SellerProvider>
          <CartProvider>
            <ChatbotProvider>
              <div className="app-container">
                <div className="creative-blob blob-1"></div>
                <div className="creative-blob blob-2"></div>
                
                <Header 
                  onCartClick={() => setIsCartOpen(true)} 
                  onAuthClick={handleAuthClick}
                  onSellerAuthClick={handleSellerAuthClick}
                  onLogoClick={handleLogoClick}
                />
                <div className="main-content">
                  <Routes>
                    <Route path="/*" element={
                      <>
                        <HeadRouting />
                        <ProdRouting />
                        <AdminRouting />
                      </>
                    } />
                    <Route path="/seller/dashboard" element={
                      <SellerProtectedRoute>
                        <SellerDashboard />
                      </SellerProtectedRoute>
                    } />
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
                <AdminPasswordModal
                  isOpen={isAdminPasswordModalOpen}
                  onClose={() => setIsAdminPasswordModalOpen(false)}
                />
                <Chatbot />
              </div>
            </ChatbotProvider>
          </CartProvider>
        </SellerProvider>
      </AdminProvider>
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
