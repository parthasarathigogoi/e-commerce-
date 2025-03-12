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
  // Track authentication status
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("token"));

  // Listen for auth changes
  useEffect(() => {
    const checkAuth = () => {
      setIsAuthenticated(!!localStorage.getItem("token"));
    };
    window.addEventListener("storage", checkAuth);
    return () => window.removeEventListener("storage", checkAuth);
  }, []);

  return (
    <Router>
      <Routes>
        {/* Show Login Page First If Not Authenticated */}
        {!isAuthenticated ? (
          <Route path="*" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
        ) : (
          <>
            {/* Header & Footer only for authenticated users */}
            <Route path="/*" element={
              <>
                <Header />
                <HeadRouting />
                <ProdRouting />
                <Footer />
              </>
            } />
          </>
        )}

        {/* Catch-all: Redirect unknown routes */}
        <Route path="*" element={<Navigate to={isAuthenticated ? "/" : "/login"} />} />
      </Routes>
    </Router>
  );
}

export default App;
