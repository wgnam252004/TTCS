import React, { useContext, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css';
import AuthContext from '../../../authContext/authContext';
import Swal from 'sweetalert2'
import Password from 'antd/es/input/Password';


const Login = () => {

    const emailRef = useRef('');
    const passwordRef = useRef('');

    const navigate = useNavigate();
    const {handleSubmit} = useContext(AuthContext);

    const handleLogin = async (e) => {
        e.preventDefault();

        const body = {
            email: emailRef.current.value,
            password: passwordRef.current.value,
        };

        try {
            const {status, message, token} = await handleSubmit(`/login`, body);

            if (status === 200) {
                Swal.fire({
                    title: message,
                    icon: "success",
                    draggable: true
                });
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
        <div className="registerpage_wrapper_flex_center_p10">
            <div className="registerpage_container">
                <div className="registerpage_flex_gap16_justifybetween">
                    <div className="registerpage_right_wrapper">
                        <h3 className="registerpage_heading">
                            Đăng nhập
                        </h3>
                        <p className="registerpage_subtext">
                            Đăng nhập để truy cập tài khoản của bạn
                        </p>

                        <form className="registerpage_form_wrapper" onSubmit={handleLogin}>
                            <input
                                type="email"
                                ref={emailRef}
                                className="registerpage_input"
                                placeholder="Email....."
                                required
                            />
                            <input
                                type="password"
                                ref={passwordRef}
                                className="registerpage_input"
                                placeholder="Password....."
                            />

                            <p className="login-forget-pass">
                            <Link to="/forget-password" className="registerpage_login_link">
                                Quên mật khẩu
                            </Link>
                        </p>

                            <button className="registerpage_button">
                                Đăng nhập
                            </button>
                        </form>

                        <p className="registerpage_login_text">
                            Bạn chưa có tài khoản?{' '}
                            <Link to="/register" className="registerpage_login_link">
                                Đăng ký
                            </Link>
                        </p>
                    </div>

                    <div className="registerpage_left_wrapper">
                        <img src="/assets/login.avif" alt="register" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
