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
    <div className="app-container">
    <Router>
      {/* Show Header and Footer only if the user is logged in */}
      {isAuthenticated && <Header />}
      <div className="main-content">
      <Routes>
        {/* Show Login Page First If Not Authenticated */}
        {!isAuthenticated ? (
          <Route path="*" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
        ) : (
          <>
            {/* Header & Footer only for authenticated users */}
            <Route path="/*" element={
              <>
                {/* <Header /> */}
              <HeadRouting />
                <ProdRouting />
              </>
            } />
              {/* <Footer /> */}
          </>
        )}

        {/* Catch-all: Redirect unknown routes */}
        <Route path="*" element={<Navigate to={isAuthenticated ? "/" : "/login"} />} />

      </Routes>
      </div>
      
    </Router>

    {isAuthenticated && <Footer />}
    </div>
  );
}

export default App;

// import "bootstrap/dist/css/bootstrap.min.css";
// import "./App.css";
// import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
// import { useState, useEffect, createContext, useContext } from "react";

// // Components
// import Header from "./components/header/header";
// import Footer from "./components/footer/footer";
// import HeadRouting from "./AllRouting/HeadRouting";
// import ProdRouting from "./AllRouting/ProdRouting";
// import Login from "./components/pages/Login"; // Import Login Page

// // Create Auth Context
// const AuthContext = createContext();

// // Auth Provider Component
// const AuthProvider = ({ children }) => {
//   const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("authToken"));

//   useEffect(() => {
//     const checkAuth = () => {
//       setIsAuthenticated(!!localStorage.getItem("authToken"));
//     };

//     // Listen for storage changes across tabs
//     window.addEventListener("storage", checkAuth);

//     // Manually check authentication on component mount
//     checkAuth();

//     return () => {
//       window.removeEventListener("storage", checkAuth);
//     };
//   }, []);

//   return (
//     <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// // Main App Component
// function App() {
//   const { isAuthenticated } = useContext(AuthContext);

//   return (
//     <Router>
//       {isAuthenticated && <Header />}

//       <Routes>
//         <Route path="/login" element={<Login />} />
//         <Route
//           path="/*"
//           element={isAuthenticated ? (
//             <>
//               <HeadRouting />
//               <ProdRouting />
//             </>
//           ) : (
//             <Navigate to="/login" replace />
//           )}
//         />
//       </Routes>

//       {isAuthenticated && <Footer />}
//     </Router>
//   );
// }

// // Wrap App in AuthProvider
// export default function RootApp() {
//   return (
//     <AuthProvider>
//       <App />
//     </AuthProvider>
//   );
// }
