import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Register.css';
import { useContext, useRef } from 'react';
import AuthContext from '../../../authContext/authContext';
import Swal from 'sweetalert2'

const Register = () => {

    const { handleSubmit } = useContext(AuthContext);

    const nameRef = useRef('');
    const emailRef = useRef('');
    const passwordRef = useRef('');

    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();

        const body = {
            name: nameRef.current.value,
            email: emailRef.current.value,
            password: passwordRef.current.value
        };

        const {status, user, error} = await handleSubmit('/register', body);

        if (status === 201) {
            Swal.fire({
                title: "Success!",
                text: "Đăng ký thành công!",
                icon: "success"
            });
            console.log('user register: ', user);

            nameRef.current.value = '';
            emailRef.current.value = '';
            passwordRef.current.value = '';

            navigate('/login')
        } else {
            Swal.fire({
                title: "Error!",
                text: error || "Đã có lỗi xảy ra!",
                icon: "error"
            });
        }
    }

    return (
        <div className="registerpage_wrapper_flex_center_p10">
            <div className="registerpage_container">
                <div className="registerpage_flex_gap16_justifybetween">
                    <div className="registerpage_left_wrapper">
                        <img src="/assets/register.avif" alt="register" />
                    </div>

                    <div className="registerpage_right_wrapper">
                        <h3 className="registerpage_heading">
                            Đăng ký
                        </h3>
                        <p className="registerpage_subtext">
                            Chúng tôi sẽ thiết lập tất cả để bạn có thể truy cập vào tài khoản cá nhân của mình.
                        </p>

                        <form className="registerpage_form_wrapper" onSubmit={handleRegister}>
                            <input
                                type="text"
                                ref={nameRef}
                                className="registerpage_input"
                                placeholder="Tên của bạn....."
                                required
                            />
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
                                placeholder="Mật khẩu....."
                                required
                            />

                            <button className="registerpage_button">
                                Tạo tài khoản
                            </button>
                        </form>

                        <p className="registerpage_login_text">
                            Bạn đã có tài khoản?{' '}
                            <Link to="/login" className="registerpage_login_link">
                                Đăng nhập
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
