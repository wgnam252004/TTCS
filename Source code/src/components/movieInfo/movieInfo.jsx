import React from "react"
import { Link } from "react-router-dom";
import './movieInfo.css'


const MovieInfo = () => {
    return (
        <div className="md-detail-container">
            <div className="md-detail-img-container">
                <img src="/assets/anh be trang chu.png" alt="Pororo: Thám hiểm đại dương xanh" className="md-detail-img" />
            </div>
            <div className="md-detail-info-container">
                <div className="md-detail-title">PORORO: THÁM HIỂM ĐẠI DƯƠNG XANH</div>
                <div className="md-detail-desc">Chú chim cánh cụt đáng yêu Pororo và những người bạn cùng nhau khám phá bí ẩn dưới đáy đại dương và tưởng bước trở thành anh hùng biển cả.</div>
                <div className="md-detail-info-list">
                    <div>Phân loại: Phim phổ biến với mọi độ tuổi</div>
                    <div>Đạo diễn: Yoon Ye-Wan</div>
                    <div>Thể loại: Family</div>
                    <div>Khởi chiếu: 04/04/2025</div>
                    <div>Thời lượng: 71 phút</div>
                    <div>Ngôn ngữ: Phụ đề/Lồng tiếng</div>
                </div>
                <Link to="/movies" className="choose-other-movie-btn">← Chọn phim khác</Link>
            </div>
        </div>
    )
}

export default MovieInfo