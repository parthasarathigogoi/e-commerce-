// import React from "react";
// import { Link } from "react-router-dom";
// import "./header.css";
// import SearchIcon from "@mui/icons-material/Search";
// import AccountCircleIcon from "@mui/icons-material/AccountCircle";
// import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

// const Header = () => {
//   let cartIcon = document.getElementById("icon-button")
//   cartIcon.addEventListener("click",()=>{
//     console.log("Button clicked")
//   })
//   return (
//     <header className="header">
//       <div className="container-fluid px-3">
//         <nav className="navbar navbar-expand-lg navbar-light bg-light">
//           <Link className="navbar-brand d-flex align-items-center" to="/">
//             <img
//               src={`${process.env.PUBLIC_URL}/logo_no_bg.png`}
//               alt="Logo"
//               className="logo-img"
//             />
//             <span className="brand-text">Dukan</span>
//           </Link>

//           {/* Navbar Toggler */}
//           <button
//             className="navbar-toggler"
//             type="button"
//             data-bs-toggle="collapse"
//             data-bs-target="#navbarNav"
//             aria-controls="navbarNav"
//             aria-expanded="false"
//             aria-label="Toggle navigation"
//           >
//             <span className="navbar-toggler-icon"></span>
//           </button>

//           {/* Navbar Items */}
//           <div className="collapse navbar-collapse" id="navbarNav">
//             <ul className="navbar-nav me-auto">
//               <li className="nav-item">
//                 <Link className="nav-link" to="/">Home</Link>
//               </li>
//               <li className="nav-item">
//                 <Link className="nav-link" to="/products">Products</Link>
//               </li>
//               <li className="nav-item">
//                 <Link className="nav-link" to="/services">Services</Link>
//               </li>
//               <li className="nav-item">
//                 <Link className="nav-link" to="/contact">Contact Us</Link>
//               </li>
//             </ul>

//             {/* Icons & Search Bar */}
//             <div className="icon-container d-flex align-items-center">
//               <input
//                 type="text"
//                 className="search-bar"
//                 placeholder="Search for products..."
//               />
//               <button className="icon-button" aria-label="Search">
//                 <SearchIcon className="header-icon" />
//               </button>
//               <button className="icon-button" aria-label="Account">
//                 <AccountCircleIcon className="header-icon" />
//               </button>
//               <button className="icon-button" aria-label="Cart">
//                 <ShoppingCartIcon className="header-icon" />
//               </button>
//             </div>
//           </div>
//         </nav>
//       </div>
//     </header>
//   );
// };

// export default Header;

import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import "./header.css";
import SearchIcon from "@mui/icons-material/Search";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

const Header = () => {
  useEffect(() => {
    const cartIcon = document.querySelector(".icon-button[aria-label='Cart']");
    
    if (cartIcon) {
      const handleClick = () => console.log("Button clicked");

      cartIcon.addEventListener("click", handleClick);

      return () => {
        cartIcon.removeEventListener("click", handleClick);
      };
    }
  }, []);

  return (
    <header className="header">
      <div className="container-fluid px-3">
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
          <Link className="navbar-brand d-flex align-items-center" to="/">
            <img
              src={`${process.env.PUBLIC_URL}/logo_no_bg.png`}
              alt="Logo"
              className="logo-img"
            />
            <span className="brand-text">Dukan</span>
          </Link>

          {/* Navbar Toggler */}
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          {/* Navbar Items */}
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav me-auto">
              <li className="nav-item">
                <Link className="nav-link" to="/">Home</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/products">Products</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/services">Services</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/contact">Contact Us</Link>
              </li>
            </ul>

            {/* Icons & Search Bar */}
            <div className="icon-container d-flex align-items-center">
              <input
                type="text"
                className="search-bar"
                placeholder="Search for products..."
              />
              <button className="icon-button" aria-label="Search">
                <SearchIcon className="header-icon" />
              </button>
              <button className="icon-button" aria-label="Account">
                <AccountCircleIcon className="header-icon" />
              </button>
              <button className="icon-button" aria-label="Cart">
                <ShoppingCartIcon className="header-icon" />
              </button>
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
