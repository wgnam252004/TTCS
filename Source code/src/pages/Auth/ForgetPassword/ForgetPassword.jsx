import React, { useContext, useRef } from 'react';
import './ForgetPassword.css';
import AuthContext from '../../../authContext/authContext';
import Swal from 'sweetalert2'


const ForgetPassword = () => {

    const findEmailRef = useRef('');
    const {handleSubmit} = useContext(AuthContext);


    const handleForget = async (e) => {
        e.preventDefault();

        const body = {
            email: findEmailRef.current.value,
        };

        try {
            const { status, message } = await handleSubmit(`/forget-password`, body);

            if (status === 200) {
                Swal.fire({
                    title: message,
                    icon: "success",
                    draggable: true
                });
                console.log('forget user: ', status, message)
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
        <div className="forget-password-container">
            <div className="forget-password-wrapper">
                <div className="forget-password-content">

                    {/* right wrapper */}
                    <div className="forget-password-right">
                        <h3 className="forget-password-title">
                            Quên mật khẩu
                        </h3>
                        <p className="forget-password-description">
                            Đừng lo lắng. Chuyện này xảy ra với tất cả chúng ta. Nhập email của bạn bên dưới để khôi phục mật khẩu
                        </p>

                        <form className="forget-password-form" onSubmit={handleForget}>
                            <input
                                type="email"
                                className="forget-password-input"
                                placeholder="Email....."
                                ref={findEmailRef}
                                required
                            />
                            <button
                                className="forget-password-button"
                            >
                                Gửi
                            </button>
                        </form>
                    </div>

                    {/* left wrapper */}
                    <div class="forget-password-left">
                        <img src="/assets/3293465.jpg" alt="login" />
                    </div>

                </div>
            </div>
        </div>
    );
};

export default ForgetPassword;
