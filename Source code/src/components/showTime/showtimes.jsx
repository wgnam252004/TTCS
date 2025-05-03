import React from "react"
import './showtimes.css'
import { Link } from "react-router-dom"

const Showtime = () => {
    return (
        <>
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
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((_, i) => (
                                <Link to="/bookingChair">
                                    <button className="showtime-btn" key={i}>12:00</button>
                                </Link>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </>
    )
}

export default Showtime;