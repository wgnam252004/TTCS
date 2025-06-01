import React, { useState, useEffect } from "react"
import './showtimes.css'
import { Link, useNavigate } from "react-router-dom"
import axios from "axios"
import { useContext } from 'react'
import AuthContext from '../../authContext/authContext.jsx';

const Showtime = ({ movieId, selectedDate }) => {
    const [cinemas, setCinemas] = useState([])
    const [movie, setMovie] = useState(null)
    const [showtimes, setShowtimes] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const navigate = useNavigate();
    const authContext = useContext(AuthContext);
    const { token } = authContext;

    useEffect(() => {
        const fetchShowtimes = async () => {
            try {
                const date = selectedDate ? selectedDate.toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
                const movieResponse = await axios.get(`http://localhost:3000/api/movies/${movieId}`)
                setMovie(movieResponse.data)
                const cinemasResponse = await axios.get('http://localhost:3000/api/cinemas')
                const cinemas = cinemasResponse.data
                setCinemas(cinemas)
                const cinemaShowtimes = []
                for (const cinema of cinemas) {
                    try {
                        const response = await axios.get(`http://localhost:3000/api/showtimes/movie/${movieId}`, {
                            params: {
                                cinema_id: cinema._id,
                                date: date
                            }
                        })
                        if (response.data && response.data.length > 0) {
                            const cinemaShowtimesObj = {
                                cinemaId: cinema._id,
                                cinemaName: cinema.name,
                                showtimes: response.data.filter(showtime => showtime.cinema_id === cinema._id)
                            };
                            cinemaShowtimes.push(cinemaShowtimesObj);
                        }
                    } catch (error) {
                        console.error(`Error fetching showtimes for cinema ${cinema._id}:`, error)
                    }
                }
                setShowtimes(cinemaShowtimes)
                setLoading(false)
            } catch (error) {
                console.error("Error fetching showtimes:", error)
                setError("Không thể tải lịch chiếu")
                setLoading(false)
            }
        }

        fetchShowtimes()
    }, [movieId])

    if (loading) return <div className="showtimes-loading">Đang tải lịch chiếu...</div>
    if (error) return <div className="showtimes-error">Lỗi: {error}</div>
    if (!movie) return <div className="showtimes-error">Không tìm thấy phim</div>

    return (
        <>
            <div className="showtimes-list">
                {cinemas.map((cinema) => {
                    const cinemaShowtimes = showtimes.find(s => s.cinemaId === cinema._id);
                    
                    if (!cinemaShowtimes || cinemaShowtimes.showtimes.length === 0) {
                        return (
                            <div className="showtime-card" key={cinema._id}>
                                <div className="showtime-header">
                                    <img src="/assets/logo.png" alt="Filmora" className="filmora-logo" />
                                    <div className="showtime-title">
                                        <b>{movie.title}</b><br />
                                        {cinema.name}
                                    </div>
                                </div>
                                <div className="no-showtimes-message">
                                    Không có lịch chiếu của ngày hôm nay!!!
                                </div>
                            </div>
                        );
                    }

                    return (
                        <div className="showtime-card" key={cinema._id}>
                            <div className="showtime-header">
                                <img src="/assets/logo.png" alt="Filmora" className="filmora-logo" />
                                <div className="showtime-title">
                                    <b>{movie.title}</b><br />
                                    {cinema.name}
                                </div>
                            </div>
                            <div className="showtime-buttons">
                                {cinemaShowtimes.showtimes.map((showtime) => (
                                    <button 
                                        key={showtime._id}
                                        className="showtime-btn"
                                        onClick={() => {
                                            if (!token) {
                                                navigate('/login', { state: { returnUrl: `/bookingChair/${showtime._id}` } });
                                            } else {
                                                navigate(`/bookingChair/${showtime._id}`, {
                                                    state: {
                                                        showtimeId: showtime._id,
                                                        movieId: movieId,
                                                        cinemaId: cinema._id,
                                                        roomId: showtime.room_id,
                                                        price: showtime.base_price
                                                    }
                                                });
                                            }
                                        }}
                                    >
                                        {new Date(showtime.start_time).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                                    </button>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </>
    )
}

export default Showtime;