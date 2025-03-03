import React, { useState } from "react";
import "./Login.css"; // Make sure to create and style this CSS file

const Login = () => {
  const [isLogin, setIsLogin] = useState(true); // Toggle between Login and Register

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
        {isLogin ? (
          <div>
            <h2>Welcome Back!</h2>
            <p>Please log in with your credentials.</p>
            <form>
              <input type="email" placeholder="Email" required />
              <input type="password" placeholder="Password" required />
              <button type="submit">Log In</button>
            </form>
          </div>
        ) : (
          <div>
            <h2>Create Account</h2>
            <p>Enter your details below.</p>
            <form>
              <input type="text" placeholder="Name" required />
              <input type="email" placeholder="Email" required />
              <input type="password" placeholder="Password" required />
              <button type="submit">Sign Up</button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
