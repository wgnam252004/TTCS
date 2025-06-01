import React, { useContext } from 'react';
import './ResetPassword.css';
import { useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2'
import AuthContext from '../../../authContext/authContext';


const ResetPassword = () => {

    const createPasswordRef = useRef('');
    const confirmPasswordRef = useRef('');
    const { token } = useParams();
    const navigate = useNavigate();

    const {handleSubmit} = useContext(AuthContext)

    console.log('reset password token: ', token)



    const handleResetPassword = async (e) => {
        e.preventDefault();

        if (createPasswordRef.current.value === confirmPasswordRef.current.value) {

            const body = {
                password: confirmPasswordRef.current.value,
            };

            const { status, message } = await handleSubmit(`/reset-password/${token}`, body);

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
                    text: message || "Đổi mật khẩu không thành công",
                    icon: "error"
                });
            }


        } else {
            console.log('something wrong?')
        }
    }
    return (
        <div className="reset-password-container">
            <div className="reset-password-wrapper">
                <div className="reset-password-content">
                    <div className="reset-password-right">
                        <h3 className="reset-password-title">
                            Đổi mật khẩu
                        </h3>
                        <p className="reset-password-description">
                            Mật khẩu trước đó của bạn đã được đặt lại. Vui lòng đặt mật khẩu mới cho tài khoản của bạn.
                        </p>

                        <form className="reset-password-form" onSubmit={handleResetPassword}>
                            <input
                                type="password"
                                ref={createPasswordRef}
                                className="reset-password-input"
                                placeholder="Password..." required
                            />
                            <input
                                type="password"
                                ref={confirmPasswordRef}
                                className="reset-password-input"
                                placeholder="Re-enter password..."
                            />
                            <button
                                className="reset-password-button"
                            >
                                Đổi mật khẩu
                            </button>
                        </form>
                    </div>

                    <div className="reset-password-left">
                        <img src="/assets/3293465.jpg" alt="reset password" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;