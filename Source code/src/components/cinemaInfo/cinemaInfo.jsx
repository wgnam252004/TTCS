import React from "react"
import './cinemaInfo.css'
import { Link } from "react-router-dom"

const CinemaInfo = () => {
    return (
        <div className="cinema-info">
            <img src="/assets/cinema-hero.png" alt="Cinema" className="cinema-img" />
            <div className="cinema-info-content">
                <h3 className="cinema-name">Filmora Tây Hồ</h3>
                <p>Địa chỉ: Tầng 5 tòa nhà Lotte Tây Hồ<br />
                    Điện thoại: 0123456789<br />
                    Email: cskh@filmora.vn
                </p>
                <Link to="/theaters" className="choose-other-cinema-btn">← Chọn rạp khác</Link>
            </div>
        </div>
    )
}

export default CinemaInfo