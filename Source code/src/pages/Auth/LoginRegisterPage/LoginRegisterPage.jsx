import React, { useState, useEffect, useContext, useRef } from 'react';
import './LoginRegisterPage.css';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import AuthContext from '../../../authContext/authContext';
import Swal from 'sweetalert2'

function LoginRegister() {
  const [isActive, setIsActive] = useState(false);
  const [isResetMode, setIsResetMode] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const mode = searchParams.get('mode');
    if (mode === 'register') {
      setIsActive(true);
    } else {
      setIsActive(false);
    }
    setHasMounted(true);
  }, [location.search]);

  const handleRegisterClick = () => {
    setIsActive(true);
    navigate('/LoginOrRegister?mode=register');
  };

  const handleLoginClick = () => {
    setIsActive(false);
    navigate('/LoginOrRegister?mode=login');
  };

  const { handleSubmit } = useContext(AuthContext);

  const nameRef = useRef('');
  const emailRef = useRef('');
  const passwordRef = useRef('');

  const handleRegister = async (e) => {
    e.preventDefault();

    const body = {
      name: nameRef.current.value,
      email: emailRef.current.value,
      password: passwordRef.current.value


    }

    const { status, user } = await handleSubmit('/register', body)

    if (status === 201) {
      Swal.fire({
        title: "Drag me!",
        icon: "success",
        draggable: true
      });
      console.log('user register: ', user)
    }
  }

  return (
    <div className="auth-wrapper">
      <div className={`auth-container ${hasMounted && isActive ? 'auth-active' : ''}`}>
        <div className="auth-form-box auth-login">
          <form>
            <h1>{isResetMode ? 'Forget your password?' : 'Login'}</h1>
            <div className="auth-input-box">
              <input type="email" placeholder="Email" required />
              <i className="bi bi-envelope-fill"></i>
            </div>
            {!isResetMode && (
              <div className="auth-input-box">
                <input type="password" placeholder="Password" required />
                <i className="bi bi-key-fill"></i>
              </div>
            )}
            {isResetMode ? (
              <div className="auth-forgot-link" >
                <a onClick={() => setIsResetMode(false)}>Back to Login</a>
              </div>
            ) : (
              <div className="auth-forgot-link">
                <a onClick={() => setIsResetMode(true)}>Forgot password?</a>
              </div>
            )}
            <button type="submit" className="auth-btn">{isResetMode ? 'Submit' : 'Login'}</button>
          </form>
        </div>

        <div className="auth-form-box auth-register">
          <form onSubmit={handleRegister}>
            <h1>Registration</h1>
            <div className="auth-input-box">
              <input type="text" ref={nameRef} placeholder="Username" required />
              <i className="bi bi-person-fill"></i>
            </div>
            <div className="auth-input-box">
              <input type="email" ref={emailRef} placeholder="Email" required />
              <i className="bi bi-envelope-fill"></i>
            </div>
            <div className="auth-input-box">
              <input type="password" ref={passwordRef} placeholder="Password" required />
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
