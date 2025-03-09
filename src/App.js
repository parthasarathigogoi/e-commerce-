import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";

// Components
import Header from "./components/header/header";
import Footer from "./components/footer/footer";
import HeadRouting from "./AllRouting/HeadRouting";
import ProdRouting from "./AllRouting/ProdRouting";
import Login from "./components/pages/Login"; // Import Login Page

function App() {
  // State to track authentication status
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("authToken"));

  // Listen for changes in localStorage
  useEffect(() => {
    const checkAuth = () => {
      setIsAuthenticated(!!localStorage.getItem("authToken"));
    };
    window.addEventListener("storage", checkAuth);
    return () => window.removeEventListener("storage", checkAuth);
  }, []);

  return (
    <Router>
      {/* Show Header and Footer only if the user is logged in */}
      {isAuthenticated && <Header />}

      <Routes>
        {/* Redirect to login if not authenticated */}
        <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
        <Route
          path="/*"
          element={isAuthenticated ? (
            <>
              <HeadRouting />
              <ProdRouting />
            </>
          ) : (
            <Navigate to="/login" replace />
          )}
        />
      </Routes>

      {isAuthenticated && <Footer />}
    </Router>
  );
}

export default App;
