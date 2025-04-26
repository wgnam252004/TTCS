import React from "react";
import './CinemaDetailPage.css'
import { Link, NavLink } from 'react-router-dom'
import Calendar from "../../components/calendarComponent/calendar";


const CinemaDetail = () => {
    return (
        <>

            <div className="section-header">
                <a href="#">Filmora Tây Hồ</a>
            </div>

            <div className="cinema-detail-container">

                {/* Thông tin rạp */}
                <div className="cinema-info">
                    <img src="/assets/cinema-hero.png" alt="Cinema" className="cinema-img" />
                    <div className="cinema-info-content">
                        <h3 className="cinema-name">Filmora Tây Hồ</h3>
                        <p>Địa chỉ: Tầng 5 tòa nhà Lotte Tây Hồ<br />
                            Điện thoại: 0123456789<br />
                            Email: cskh@filmora.vn
                        </p>
                        <Link to="/theaterShowTimes" className="choose-other-cinema-btn">← Chọn rạp khác</Link>
                    </div>
                </div>

                {/* Lịch chiếu và lịch ngày */}
                <div className="cinema-schedule-section">
                    <div className="showtimes-list">
                        {[1, 2, 3].map((item, idx) => (
                            <div className="showtime-card" key={idx}>
                                <div className="showtime-header">
                                    <img src="/assets/logo.png" alt="Filmora" className="filmora-logo" />
                                    <div className="showtime-title">
                                        <b>Pororo: Thám hiểm đại dương</b><br />
                                        Filmora Tây Hồ
                                    </div>
                                </div>
                                <div className="showtime-buttons">
                                    {[1, 2, 3, 4, 5, 6, 7 , 8, 9, 10].map((_, i) => (
                                        <button className="showtime-btn" key={i}>12:00</button>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="calendar-section">
                        <Calendar  />
                    </div>
                </div>
            </div>
        </>


    );
};

export default CinemaDetail