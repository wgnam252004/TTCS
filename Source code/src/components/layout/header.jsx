import './header.css';
import React, { useContext, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../../authContext/authContext';
import Swal from 'sweetalert2';
import { useState } from 'react';

const Header = () => {
    const navigate = useNavigate();
    const authContext = useContext(AuthContext);
    const { logout, handleSubmit } = authContext;
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [userName, setUserName] = useState('');
    const [role, setRole] = useState('');
    const [showDropdown, setShowDropdown] = useState(false);

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (storedUser) {
            setUserName(storedUser.name);
            setRole(storedUser.role);
        }
    }, []);

    // Kiểm tra lại trạng thái đăng nhập khi component mount và khi token thay đổi
    useEffect(() => {
        // Không cần gọi checkAuth vì token đã được cập nhật từ context
    }, [token]);

    const [showSuccess, setShowSuccess] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        if (showSuccess && successMessage) {
            Swal.fire({
                title: successMessage,
                icon: "success",
                draggable: true
            });
            // Reset sau khi hiển thị
            setShowSuccess(false);
            setSuccessMessage('');
        }
    }, [showSuccess, successMessage]);

    const handleLogout = async (e) => {
        e.preventDefault();

        try {
            const { status, message } = await handleSubmit(`/logout`, {});

            if (status === 200) {
                // Hiển thị swal trước
                Swal.fire({
                    title: message,
                    icon: "success",
                    draggable: true,
                    showConfirmButton: true,
                    confirmButtonText: 'OK',
                    preConfirm: () => {
                        // Sau khi ấn OK mới thực hiện các bước tiếp theo
                        localStorage.removeItem('token');
                        localStorage.removeItem('user');
                        navigate('/', { replace: true });
                        window.location.reload();
                    }
                });
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
                    <Link to="/">
                        <img src="/assets/logo.png" alt="Logo" className="logo" />
                    </Link>
                    <div className="nav-links">
                        <ul className="nav-menu">
                            <li>
                                <Link to="/movies">
                                    LỊCH CHIẾU
                                </Link>
                            </li>
                            <li>
                                <Link to="/cinema">Rạp phim</Link>
                            </li>
                            <li>
                                <Link to="/AboutFilmora">VỀ FILMORA</Link>
                            </li>
                        </ul>
                        <div className="auth-buttons">
                            {token ? (
                                <div className="user-profile">
                                    <div 
                                        className="user-profile-info"
                                        onClick={() => setShowDropdown(!showDropdown)}
                                    >
                                        <span className="user-name">{userName}</span>
                                        <i className="bi bi-person-circle"></i>
                                        
                                    </div>
                                    {showDropdown && (
                                        <div className="dropdown-menu">
                                            {role === 'User' && (
                                                <Link 
                                                    to="/profile"
                                                    className="dropdown-item"
                                                    onClick={() => setShowDropdown(false)}
                                                >
                                                    Thông tin cá nhân
                                                </Link>
                                            )}
                                            {role === 'Admin' && (
                                                <Link 
                                                    to="/admin"
                                                    className="dropdown-item"
                                                    onClick={() => setShowDropdown(false)}
                                                >
                                                    Trang quản trị
                                                </Link>
                                            )}
                                            <a 
                                                className="dropdown-item"
                                                onClick={handleLogout}
                                            >
                                                Đăng xuất
                                            </a>
                                        </div>
                                    )}
                                </div>
                            ) : (
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
                            )}
                        </div>
                    </div>
                </div>
            </nav>
        </>
    );
};

export default Header;