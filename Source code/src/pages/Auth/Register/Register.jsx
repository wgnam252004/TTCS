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
                    {/* left wrapper */}
                    <div className="registerpage_left_wrapper">
                        <img src="/assets/register.avif" alt="register" />
                    </div>

                    {/* right wrapper */}
                    <div className="registerpage_right_wrapper">
                        <h3 className="registerpage_heading">
                            Register
                        </h3>
                        <p className="registerpage_subtext">
                            Let's get you all set up so you can access your personal account
                        </p>

                        <form className="registerpage_form_wrapper" onSubmit={handleRegister}>
                            <input
                                type="text"
                                ref={nameRef}
                                className="registerpage_input"
                                placeholder="Your Name....."
                                required
                            />
                            <input
                                type="email"
                                ref={emailRef}
                                className="registerpage_input"
                                placeholder="Your Email....."
                                required
                            />
                            <input
                                type="password"
                                ref={passwordRef}
                                className="registerpage_input"
                                placeholder="Your Password....."
                                required
                            />

                            <button className="registerpage_button">
                                Create Account
                            </button>
                        </form>

                        <p className="registerpage_login_text">
                            Already have an account?{' '}
                            <Link to="/login" className="registerpage_login_link">
                                Login
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
