import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const Login = ({ setIsAuthenticated }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const ADMIN_EMAIL = "admin@gmail.com";
  const ADMIN_PASSWORD = "admin123";

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
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", formData.email === ADMIN_EMAIL && formData.password === ADMIN_PASSWORD ? "admin" : "user");

        setIsAuthenticated(true); // ✅ Update auth state
        navigate("/"); // ✅ Redirect to home
      }
    } catch (error) {
      setMessage(error.response?.data?.message || "Something went wrong!");
    }
  };

  return (
    <div className="container">
      <div className="info-panel">
        <h2>{isLogin ? "Haven't connected with us?" : "Already Signed Up?"}</h2>
        <p>{isLogin ? "Sign up now to get started." : "Simply Log In."}</p>
        <button className="switch-btn" onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? "Sign Up" : "Log In"}
        </button>
      </div>

      <div className="auth-box">
        <h2>{isLogin ? "Welcome Back!" : "Create Account"}</h2>
        <p>{isLogin ? "Please log in with your credentials." : "Enter your details below."}</p>

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <input type="text" name="name" placeholder="Name" value={formData.name} required onChange={handleChange} />
          )}
          <input type="email" name="email" placeholder="Email" value={formData.email} required onChange={handleChange} />
          <div className="password-container">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={formData.password}
              required
              onChange={handleChange}
            />
            <button type="button" className="toggle-password" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? "🙈" : "👁️"}
            </button>
          </div>
          <button type="submit">{isLogin ? "Log In" : "Sign Up"}</button>
        </form>

        {message && <p className="message">{message}</p>}
      </div>
    </div>
  );
};

export default Login;
