import React, { useState } from "react";
import axios from "axios"; // Import Axios for API requests
import "./Login.css"; // Ensure you have styles for this

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [message, setMessage] = useState("");

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(""); // Reset message

    try {
      const url = isLogin ? "http://localhost:3000/api/login" : "http://localhost:3000/api/register";
      const { data } = await axios.post(url, formData);

      setMessage(data.message);
      if (isLogin && data.token) {
        localStorage.setItem("token", data.token); // Save token after login
      }
    } catch (error) {
      setMessage(error.response?.data?.message || "Something went wrong!");
    }
  };

  return (
    <div className="container">
      {/* Left Panel */}
      <div className="info-panel">
        <h2>{isLogin ? "Haven't connected with us?" : "Already Signed Up?"}</h2>
        <p>{isLogin ? "Sign up now to get started." : "Simply Log In."}</p>
        <button className="switch-btn" onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? "Sign Up" : "Log In"}
        </button>
      </div>

      {/* Authentication Box */}
      <div className="auth-box">
        <h2>{isLogin ? "Welcome Back!" : "Create Account"}</h2>
        <p>{isLogin ? "Please log in with your credentials." : "Enter your details below."}</p>

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <input type="text" name="name" placeholder="Name" required onChange={handleChange} />
          )}
          <input type="email" name="email" placeholder="Email" required onChange={handleChange} />
          <input type="password" name="password" placeholder="Password" required onChange={handleChange} />
          <button type="submit">{isLogin ? "Log In" : "Sign Up"}</button>
        </form>

        {/* Display message */}
        {message && <p className="message">{message}</p>}
      </div>
    </div>
  );
};

export default Login;
