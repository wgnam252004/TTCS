import React, { useState } from 'react';
import '../assets/LoginRegister.css';


function LoginRegister() {
  const [isActive, setIsActive] = useState(false);

  const handleRegisterClick = () => {
    setIsActive(true);
  };

  const handleLoginClick = () => {
    setIsActive(false);
  };

  return (
    <div className={`container ${isActive ? 'active' : ''}`}>
      <div className="form-box login">
        <form>
          <h1>Login</h1>
          <div className="input-box">
            <input type="text" placeholder="Username" required />
            <i className="bi bi-person-fill"></i>
          </div>
          <div className="input-box">
            <input type="password" placeholder="Password" required />
            <i className="bi bi-key-fill"></i>
          </div>
          <div className="forgot-link">
            <a href="#">Forgot password?</a>
          </div>
          <button type="submit" className="btn">Login</button>
        </form>
      </div>

      <div className="form-box register">
        <form>
          <h1>Registration</h1>
          <div className="input-box">
            <input type="text" placeholder="Username" required />
            <i className="bi bi-person-fill"></i>
          </div>
          <div className="input-box">
            <input type="email" placeholder="Email" required />
            <i className="bi bi-envelope-fill"></i>
          </div>
          <div className="input-box">
            <input type="password" placeholder="Password" required />
            <i className="bi bi-key-fill"></i>
          </div>
          <button type="submit" className="btn">Register</button>
        </form>
      </div>

      <div className="toggle-box">
        <div className="toggle-panel toggle-left">
          <h1>Hello, Welcome!</h1>
          <p>Don't have an account?</p>
          <button className="btn register-btn" onClick={handleRegisterClick}>Register</button>
        </div>
        <div className="toggle-panel toggle-right">
          <h1>Welcome Back!</h1>
          <p>Already have an account?</p>
          <button className="btn login-btn" onClick={handleLoginClick}>Login</button>
        </div>
      </div>
    </div>
  );
}

export default LoginRegister;
