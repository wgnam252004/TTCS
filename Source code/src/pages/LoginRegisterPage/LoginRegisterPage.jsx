import React, { useState } from 'react';
import './LoginRegisterPage.css';
import { Link, NavLink } from 'react-router-dom'

function LoginRegister() {
  const [isActive, setIsActive] = useState(false);

  const handleRegisterClick = () => {
    setIsActive(true);
  };

  const handleLoginClick = () => {
    setIsActive(false);
  };

  return (
    <div className="auth-wrapper">
      <div className={`auth-container ${isActive ? 'auth-active' : ''}`}>
        <div className="auth-form-box auth-login">
          <form>
            <h1>Login</h1>
            <div className="auth-input-box">
              <input type="text" placeholder="Username" required />
              <i className="bi bi-person-fill"></i>
            </div>
            <div className="auth-input-box">
              <input type="password" placeholder="Password" required />
              <i className="bi bi-key-fill"></i>
            </div>
            <div className="auth-forgot-link">
              <a href="#">Forgot password?</a>
            </div>
            <button type="submit" className="auth-btn">Login</button>
          </form>
        </div>

        <div className="auth-form-box auth-register">
          <form>
            <h1>Registration</h1>
            <div className="auth-input-box">
              <input type="text" placeholder="Username" required />
              <i className="bi bi-person-fill"></i>
            </div>
            <div className="auth-input-box">
              <input type="email" placeholder="Email" required />
              <i className="bi bi-envelope-fill"></i>
            </div>
            <div className="auth-input-box">
              <input type="password" placeholder="Password" required />
              <i className="bi bi-key-fill"></i>
            </div>
            <button type="submit" className="auth-btn">Register</button>
          </form>
        </div>

        <div className="auth-toggle-box">
          <div className="auth-toggle-panel auth-toggle-left">
            <h1>Hello, Welcome!</h1>
            <p>Don't have an account?</p>
            <button className="auth-btn auth-register-btn" onClick={handleRegisterClick}>Register</button>
          </div>
          <div className="auth-toggle-panel auth-toggle-right">
            <h1>Welcome Back!</h1>
            <p>Already have an account?</p>
            <button className="auth-btn auth-login-btn" onClick={handleLoginClick}>Login</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginRegister;
