import './header.css';
import React, { useContext, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom'
import { useNavigate } from 'react-router-dom';
import AuthContext from '../../authContext/authContext';
import Swal from 'sweetalert2';
import { useState } from 'react';



const Header = () => {
    const navigate = useNavigate();
    const { isAuthenticated, logout, checkAuth } = useContext(AuthContext);
    const [showDropdown, setShowDropdown] = useState(false);
    const {handleSubmit} = useContext(AuthContext);

    // Kiểm tra lại trạng thái đăng nhập khi component mount
    useEffect(() => {
        checkAuth();
    }, []);

    const handleLogout = async (e) => {
        e.preventDefault();

        try {
            const { status, message } = await handleSubmit(`/logout`, {});

            if (status === 200) {
                Swal.fire({
                    title: message,
                    icon: "success",
                    draggable: true
                });

                console.log('user logout: ', status, message);
                navigate('/');
            } else {
                Swal.fire({
                    title: "Error",
                    text: message || "Đăng nhập không thành công",
                    icon: "error"
                });
            }
        } catch (error) {
            Swal.fire({
                title: "Error",
                text: error.response?.data?.message || "Đã có lỗi xảy ra",
                icon: "error"
            });
        }
    }

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
                            {!isAuthenticated ? (
                                <>
                                    <button
                                        className="btn-nav btn-login"
                                        onClick={() => navigate('/login')}
                                    >
                                        Đăng nhập
                                    </button>
                                    <button
                                        className="btn-nav btn-signup"
                                        onClick={() => navigate('/register')}
                                    >
                                        Đăng ký
                                    </button>
                                </>
                            ) : (
                                <div className="user-profile">
                                    <div 
                                        className="profile-icon"
                                        onClick={() => setShowDropdown(!showDropdown)}
                                    >
                                        <i className="bi bi-person-circle"></i>
                                    </div>
                                    {showDropdown && (
                                        <div className="dropdown-menu">
                                            <button
                                                className="dropdown-item"
                                                onClick={handleLogout}
                                            >
                                                Đăng xuất
                                            </button>
                                            <button
                                                className="dropdown-item"
                                                onClick={handleLogout}
                                            >
                                                Đăng xuất
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </nav>
        </>
    )
}

export default Header;