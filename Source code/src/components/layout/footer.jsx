import './footer.css';
import React from 'react';
import { Link, NavLink } from 'react-router-dom'

const Footer = () => {
    return (
        <>
            <footer className="footer">
                <div className="footer-row">
                    <div className="footer-col-left">
                        <div className="footer-logo">
                            <img src="/assets/logo.png" alt="Logo" />
                        </div>
                        <div className="footer-tagline">
                            NƠI PHIM CHẠM ĐẾN
                            <br />
                            CẢM XÚC!
                        </div>
                    </div>
                    <div className="footer-col-right">
                        <div className="social-icons">
                            <h2>Mạng xã hội</h2>
                            <div className="social-icons-wrapper">
                                <a href="">
                                    <i className="bi bi-facebook" />
                                </a>
                                <a href="">
                                    <i className="bi bi-instagram" />
                                </a>
                                <a href="">
                                    <i className="bi bi-tiktok" />
                                </a>
                                <a href="">
                                    <i className="bi bi-youtube" />
                                </a>
                            </div>
                        </div>
                        <div className="footer-info">
                            <p>
                                Công ty TNHH MTV Filmora Việt Nam <br />
                                Đăng ký lần đầu ngày 4 tháng 04 năm 2025 <br />
                                Địa Chỉ: Tây Hồ, Hà Nội <br />
                                Hotline: (028) 1234 5678 <br />
                            </p>
                        </div>
                    </div>
                </div>
                <div className="copyright">COPYRIGHT 2025 FILMORA. ALL RIGHTS RESERVED</div>
            </footer>

        </>
    )
}

export default Footer;
