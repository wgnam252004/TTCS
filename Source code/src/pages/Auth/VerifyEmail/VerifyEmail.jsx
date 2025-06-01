import React, { useContext} from 'react';
import './VerifyEmail.css';
import { useNavigate, useParams } from 'react-router-dom';
import AuthContext from '../../../authContext/authContext';
import Swal from 'sweetalert2';


const VerifyEmail = () => {

  const { token } = useParams();
  const { handleSubmit } = useContext(AuthContext);

  const navigate = useNavigate();

  const handleVerifyEmail = async (e) => {
    e.preventDefault();

    try {
      const { status, message } = await handleSubmit(`/verify-email/${token}`, {}, 'GET');
      console.log('verify email token:', token);
      console.log('verify email response:', status, message);

      if (status === 200) {
        Swal.fire({
          title: "Success!",
          text: message || "Xác thực email thành công!",
          icon: "success"
        });
        navigate('/login');
      } else {
        Swal.fire({
          title: "Error!",
          text: message || "Đã có lỗi xảy ra trong quá trình xác thực email!",
          icon: "error"
        });
      }
    } catch (error) {
      console.error('Error verifying email:', error);
      Swal.fire({
        title: "Error!",
        text: "Đã có lỗi xảy ra. Vui lòng thử lại sau.",
        icon: "error"
      });
    }
  };

  return (
    <div className="verify-email-container">
      <div className="verify-email-wrapper">
        <div className="verify-email-content">
          <div className="verify-email-right">
            <h3 className="verify-email-title">
              Xác thực Email
            </h3>
            <p className="verify-email-description">
              Một liên kết xác thực đã được gửi đến email của bạn.
            </p>

            <form className="verify-email-form" onSubmit={handleVerifyEmail}>
              <button
                className="verify-email-button"
              >
                Xác thực
              </button>
            </form>
          </div>

          <div className="verify-email-left">
            <img src="/assets/6310507.jpg" alt="verify email" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;