import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// Components
import Header from "./components/header/header";
import Footer from "./components/footer/footer";
import HeadRouting from "./AllRouting/HeadRouting";
import ProdRouting from "./AllRouting/ProdRouting";
import Login from "./components/pages/Login"; // Import Login Page

function App() {
  const isAuthenticated = localStorage.getItem("authToken"); // Check if user is logged in

  return (
    <Router>
      {/* Show Header and Footer only if the user is logged in */}
      {isAuthenticated && <Header />}
      
      <Routes>
        {/* Redirect to login if not authenticated */}
        <Route path="/login" element={<Login />} />
        <Route path="/*" element={isAuthenticated ? <> <HeadRouting /> <ProdRouting /> </> : <Navigate to="/login" />} />
      </Routes>

      {isAuthenticated && <Footer />}
    </Router>
  );
}

export default App;
