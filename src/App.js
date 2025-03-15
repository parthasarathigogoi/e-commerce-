import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { BrowserRouter as Router, Routes, Route, useNavigate, Navigate } from "react-router-dom";
import { useState, useEffect, useContext } from "react";

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
import { AuthProvider, useAuth } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { SellerProvider, useSeller } from "./context/SellerContext";
import { AdminProvider } from "./context/AdminContext";
import { ChatbotProvider } from "./context/ChatbotContext";

// Protected Route Component for Seller
const SellerProtectedRoute = ({ children }) => {
  const { isSellerAuthenticated } = useSeller();
  const { isAuthenticated } = useAuth();
  
  // Redirect to home if not authenticated as seller or if authenticated as regular user
  if (!isSellerAuthenticated || isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

// App Content Component (to use hooks inside Router)
function AppContent() {
  const navigate = useNavigate();
  const { isAuthenticated, currentUser, logout } = useAuth();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isSellerAuthModalOpen, setIsSellerAuthModalOpen] = useState(false);
  const [isAdminPasswordModalOpen, setIsAdminPasswordModalOpen] = useState(false);

  // Handle auth modal open
  const handleAuthClick = () => {
    // If user is authenticated, handle logout
    if (isAuthenticated) {
      // Logout user
      logout();
      
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
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AdminProvider>
          <SellerProvider>
            <CartProvider>
              <ChatbotProvider>
                <AppContent />
              </ChatbotProvider>
            </CartProvider>
          </SellerProvider>
        </AdminProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
