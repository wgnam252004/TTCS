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
                            <li>
                                <Link to="/movies" >
                                    LỊCH CHIẾU
                                </Link>
                            </li>
                            <li>
                                <Link to="/theaters">Rạp phim</Link>
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