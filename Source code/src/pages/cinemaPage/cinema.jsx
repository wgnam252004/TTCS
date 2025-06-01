import React, { useEffect, useState } from "react";
import './cinema.css';
import { Link, NavLink } from 'react-router-dom'

const CinemaPage = () => {
    const [cinemas, setCinemas] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCinemas();
    }, []);

    const fetchCinemas = async () => {
        try {
            // Replace with your actual backend URL
            const response = await fetch('http://localhost:3000/api/cinemas');
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Failed to fetch cinemas');
            }
            setCinemas(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching cinemas:', error);
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="section-header">
                <a href="#">Đang tải rạp phim...</a>
            </div>
        );
    }

    return (
        <>
            <div className="section-header-cinema">
                <a href="#">Lịch chiếu theo rạp</a>
            </div>

            <div className="gallery-wrapper">
                <div className="gallery-container">
                    <div className="theater-list">
                        {cinemas.map((cinema) => (
                            <div key={cinema._id} className="theater-card">
                                <div className="theater-image">
                                    <Link to={`/cinemaDetail/${cinema._id}`}>
                                        <img
                                            src={cinema.img}
                                            alt={cinema.name}
                                        />
                                    </Link>
                                </div>
                                <Link to={`/cinemaDetail/${cinema._id}`}>
                                    <div className="theater-title">
                                        <p>{cinema.name}</p>
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

export default CinemaPage;
