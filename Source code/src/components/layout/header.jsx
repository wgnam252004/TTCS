import './header.css';
import React from 'react';
import { Link, NavLink } from 'react-router-dom'
import { useNavigate } from 'react-router-dom';


const Header = () => {
    const navigate = useNavigate();

    return (
        <>
            <nav className="navbar">
                <div className="navbar-container">
                    <Link to="/"><img src="/assets/logo.png" alt="Logo" className="logo" /></Link>
                    <div className="nav-links">
                        <ul className="nav-menu">
                            <li className="dropdown">
                                <Link to="/movieShowTimes" className="nav-link">
                                    LỊCH CHIẾU
                                </Link>
                                <div className="dropdown-content">
                                    <Link to="/movieShowTimes">Phim đang chiếu</Link>
                                    <Link to="/movieShowTimes">Phim sắp chiếu</Link>
                                    <Link to="/theaterShowTimes">Lịch theo rạp</Link>
                                </div>
                            </li>
                            <li>
                                <Link to="/AboutFilmora">VỀ FILMORA</Link>
                            </li>
                        </ul>
                        <div className="auth-buttons">
                            <button
                                className="btn-nav btn-login"
                                onClick={() => navigate('/LoginOrRegister')}
                            >
                                Đăng nhập
                            </button>
                            <button
                                className="btn-nav btn-signup"
                                onClick={() => navigate('/LoginOrRegister')}
                            >
                                Đăng ký
                            </button>
                        </div>
                    </div>
                </div>
            </nav>
        </>
    )
}

export default Header;