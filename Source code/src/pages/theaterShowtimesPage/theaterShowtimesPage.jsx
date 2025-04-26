import React from "react";
import './theaterShowtimesPage.css';
import { Link, NavLink } from 'react-router-dom'

const TheaterShowTimes = () => {
    const movieData = [
        {
            id: 1,
            image: "/assets/theater-small.png",
            title: "Filmora Tây Hồ"
        },
        {
            id: 2,
            image: "/assets/theater-small.png",
            title: "Filmora Tây Hồ"
        },
        {
            id: 3,
            image: "/assets/theater-small.png",
            title: "Filmora Tây Hồ"
        }
    ];

    return (
        <>
            <div className="section-header">
                <a href="#">Lịch chiếu theo rạp</a>
            </div>

            <div className="gallery-wrapper">
                <div className="gallery-container">
                    <div className="theater-list">
                        {movieData.map((movie) => (
                            <div key={movie.id} className="theater-card">
                                <div className="theater-image">
                                    <Link to="/cinemaDetail">
                                        <img
                                            src={movie.image}
                                            alt={movie.title}
                                        />
                                    </Link>
                                </div>
                                <Link to="/cinemaDetail">
                                    <div className="theater-title">
                                        <p>{movie.title}</p>
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}

export default TheaterShowTimes;
