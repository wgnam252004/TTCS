import React, { useState, useEffect } from 'react';
import './cinemaShowtimes.css';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useContext } from 'react';
import AuthContext from '../../authContext/authContext.jsx';

const CinemaShowtimes = ({ cinemaId }) => {
    const [cinemas, setCinemas] = useState([]);
    const [showtimes, setShowtimes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const navigate = useNavigate();
    const authContext = useContext(AuthContext);
    const { token } = authContext;

    useEffect(() => {
        if (!cinemaId) {
            console.error('No cinema ID provided');
            return;
        }

        console.log('Cinema ID:', cinemaId);
        console.log('Selected date:', selectedDate);
        
        const fetchShowtimes = async () => {
            try {
                console.log('Fetching showtimes for cinema:', cinemaId);
                
       
                const date = selectedDate ? selectedDate.toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
                console.log('Date:', date);

          
                const response = await axios.get(`http://localhost:3000/api/cinemaShowtimes/cinema/${cinemaId}`, {
                    params: {
                        date: date
                    }
                });
                console.log('Raw showtimes response:', response.data);

    
                if (response.data && response.data.length > 0) {
                    const movieShowtimes = response.data.reduce((acc, showtime) => {
                        const movieId = showtime.movie_id;
                        if (!acc[movieId]) {
                            acc[movieId] = {
                                movieId: movieId,
                                showtimes: []
                            };
                        }
                        acc[movieId].showtimes.push(showtime);
                        return acc;
                    }, {});
                    console.log('Movie showtimes grouped:', movieShowtimes);

        
                    const showtimesWithMovies = await Promise.all(
                        Object.values(movieShowtimes).map(async movieShowtimes => {
                            try {
                                const movieResponse = await axios.get(`http://localhost:3000/api/movies/${movieShowtimes.movieId}`);
                                console.log('Movie details for:', movieShowtimes.movieId, movieResponse.data);
                                return {
                                    ...movieResponse.data,
                                    showtimes: movieShowtimes.showtimes
                                };
                            } catch (error) {
                                console.error('Error fetching movie details:', movieShowtimes.movieId, error);
                                return null;
                            }
                        })
                    );
                    console.log('Final showtimes with movies:', showtimesWithMovies);

              
                    const validShowtimes = showtimesWithMovies.filter(Boolean);
                    setShowtimes(validShowtimes);
                } else {
                    console.log('No showtimes found for this cinema and date');
                    setShowtimes([]);
                }
                setLoading(false);
            } catch (error) {
                console.error("Error fetching showtimes:", error);
                setError("Không thể tải lịch chiếu");
                setLoading(false);
            }
        };

        fetchShowtimes();
    }, [cinemaId, selectedDate]);

    if (loading) {
        console.log('Still loading...');
        return <div>Loading showtimes...</div>;
    }
    if (error) {
        console.error('Error:', error);
        return <div>Error: {error}</div>;
    }
    console.log('Showtimes data:', showtimes);

    const formatDate = (date) => {
        const options = { weekday: 'short', day: 'numeric', month: 'short' };
        return new Date(date).toLocaleDateString('vi-VN', options);
    };

    const formatTime = (time) => {
        return new Date(time).toLocaleTimeString('vi-VN', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <>
            <div className="showtimes-list">
                {showtimes.map((movie) => {
                    if (movie.showtimes.length === 0) {
                        return (
                            <div className="showtime-card" key={movie._id}>
                                <div className="showtime-header">
                                    <img src="/assets/logo.png" alt="Filmora" className="filmora-logo" />
                                    <div className="showtime-title">
                                        <b>{movie.title}</b><br />
                                        {movie.duration} phút
                                    </div>
                                </div>
                                <div className="no-showtimes-message">
                                    Không có lịch chiếu của ngày hôm nay!!!
                                </div>
                            </div>
                        );
                    }

                    return (
                        <div className="showtime-card" key={movie._id}>
                            <div className="showtime-header">
                                <img src="/assets/logo.png" alt="Filmora" className="filmora-logo" />
                                <div className="showtime-title">
                                    <b>{movie.title}</b><br />
                                    {movie.duration} phút
                                </div>
                            </div>
                            <div className="showtime-buttons">
                                {movie.showtimes.map((showtime) => (
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
                                                        cinemaId: cinemaId,
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
    );
};

export default CinemaShowtimes;
