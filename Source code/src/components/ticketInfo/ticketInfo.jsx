import React, { useState, useEffect } from "react";
import './ticketInfo.css';
import { useNavigate, useLocation } from "react-router-dom";
import axios from 'axios';

const TicketInfo = ({ selectedSeats = [] }) => {
    const [showtimeData, setShowtimeData] = useState(null);
    const [movieData, setMovieData] = useState(null);
    const [cinemaData, setCinemaData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();
    
    const showtimeId = location.state?.showtimeId || window.location.pathname.split('/').pop();

    useEffect(() => {
        const fetchData = async () => {
            try {
                console.log("=== Starting API Calls ===");
                console.log("Showtime ID:", showtimeId);
                console.log("Location state:", location.state);
                
                const movieIdFromState = location.state?.movieId;
                const cinemaIdFromState = location.state?.cinemaId;
                
                let showtime = null;
                let movieId = movieIdFromState;
                let cinemaId = cinemaIdFromState;
                
                const showtimeResponse = await axios.get(`http://localhost:3000/api/showtimes/${showtimeId}`);
                showtime = showtimeResponse.data;
                setShowtimeData(showtime);

                if (!movieId && showtime && showtime.movie_id) {
                    movieId = showtime.movie_id;
                }
                
                if (!cinemaId && showtime && showtime.cinema_id) {
                    cinemaId = showtime.cinema_id;
                }

                if (movieId) {
                    const movieResponse = await axios.get(`http://localhost:3000/api/movies/${movieId}`);
                    setMovieData(movieResponse.data);
                } else {
                    setError("Không tìm thấy thông tin phim");
                    return;
                }

                if (cinemaId) {
                    const cinemaResponse = await axios.get(`http://localhost:3000/api/cinemas/${cinemaId}`);
                    setCinemaData(cinemaResponse.data);
                } else {
                    setError("Không tìm thấy thông tin rạp");
                    return;
                }

                setLoading(false);
            } catch (error) {
                console.error("=== API Error ===", error);
                
                if (error.response) {
                    setError(`Lỗi server: ${error.response.status} - ${error.response.data?.message || error.response.statusText || 'Không thể tải dữ liệu'}`);
                } else if (error.request) {
                    setError("Lỗi kết nối mạng - Không thể kết nối đến server");
                } else {
                    setError(`Lỗi: ${error.message}`);
                }
                setLoading(false);
            }
        };

        if (showtimeId) {
            fetchData();
        } else {
            setError("Không tìm thấy mã suất chiếu");
            setLoading(false);
        }
    }, [showtimeId, location.state]);

    const formatDate = (dateString) => {
        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) {
                return dateString; 
            }
            return date.toLocaleDateString('vi-VN', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            });
        } catch (error) {
            console.error("Error formatting date:", error);
            return dateString;
        }
    };

    const formatTime = (timeString) => {
        try {
            const date = new Date(timeString);
            if (isNaN(date.getTime())) {
                return timeString; 
            }
            return date.toLocaleTimeString('vi-VN', {
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch (error) {
            console.error("Error formatting time:", error);
            return timeString;
        }
    };

    const calculateTotal = () => {
        if (!selectedSeats || selectedSeats.length === 0) return 0;
        return selectedSeats.reduce((total, seat) => {
            const price = seat.price || 0;
            return total + price;
        }, 0);
    };

    const formatCurrency = (amount) => {
        if (typeof amount !== 'number') return '0 VND';
        return amount.toLocaleString('vi-VN') + ' VND';
    };



    if (loading) return <div className="ticketBooking__loading">Đang tải...</div>;
    
    if (error) return (
        <div className="ticketBooking__error">
            <p>{error}</p>
            <p>Showtime ID: {showtimeId}</p>
            <button onClick={() => window.location.reload()}>Thử lại</button>
        </div>
    );
    
    if (!showtimeData) {
        return <div className="ticketBooking__error">Không tìm thấy thông tin suất chiếu</div>;
    }
    
    if (!movieData) {
        return <div className="ticketBooking__error">Không tìm thấy thông tin phim</div>;
    }
    
    if (!cinemaData) {
        return <div className="ticketBooking__error">Không tìm thấy thông tin rạp</div>;
    }

    const totalAmount = calculateTotal();
    const selectedSeatIds = selectedSeats.map(seat => seat.seat_id || seat.id || 'Unknown').join(', ');

    return (
        <div className="ticketBooking__infoContainer">
            <div className="ticketBooking__infoHeader">
                <h2 className="ticketBooking__theaterName">
                    {typeof cinemaData.name === 'string' ? cinemaData.name : 
                     typeof cinemaData.name === 'object' ? cinemaData.name.name || JSON.stringify(cinemaData.name) :
                     'Rạp phim'}
                </h2>
                <p className="ticketBooking__screenInfo">
                    {typeof showtimeData.room_id === 'string' ? showtimeData.room_id : 
                     typeof showtimeData.room_id === 'object' ? showtimeData.room_id.name || JSON.stringify(showtimeData.room_id) :
                     'Phòng chiếu'} - {formatDate(showtimeData.date)} - Suất chiếu: {formatTime(showtimeData.start_time)}
                </p>
            </div>

            <div className="ticketBooking__movieInfo">
                <h3 className="ticketBooking__movieTitle">
                    {typeof movieData.title === 'string' ? movieData.title :
                     typeof movieData.name === 'string' ? movieData.name :
                     typeof movieData.title === 'object' ? movieData.title.name || JSON.stringify(movieData.title) :
                     typeof movieData.name === 'object' ? movieData.name.name || JSON.stringify(movieData.name) :
                     'Phim'}
                </h3>
            </div>

            <div className="ticketBooking__ticketDetails">
                {selectedSeats.length > 0 ? (
                    <>
                        <div className="ticketBooking__ticketRow">
                            <span className="ticketBooking__seatInfo">
                                Ghế: {selectedSeatIds}
                            </span>
                            <span></span>
                        </div>
                        
                        <div className="ticketBooking__seatDetails">
                            {selectedSeats.map((seat, index) => (
                                <div key={seat.seat_id || seat.id || index} className="ticketBooking__seatDetail">
                                    <span>Ghế {seat.seat_id || seat.id || `${index + 1}`}</span>
                                    <span>{formatCurrency(seat.price )}</span>
                                </div>
                            ))}
                        </div>
                    </>
                ) : (
                    <div className="ticketBooking__noSeatSelected">
                        <p>Chưa chọn ghế nào</p>
                    </div>
                )}
            </div>

            <div className="ticketBooking__totalRow">
                <span className="ticketBooking__totalLabel">Tổng tiền</span>
                <span className="ticketBooking__totalValue">
                    {formatCurrency(totalAmount)}
                </span>
            </div>

            <div className="ticketBooking__actionButtons">
                <button 
                    className="ticketBooking__payButton" 
                    onClick={() => {
                        localStorage.setItem('ticketPaymentData', JSON.stringify({
                            showtimeId,
                            selectedSeats,
                            totalAmount,
                            movieData,
                            cinemaData,
                            showtimeData
                        }));
                        window.location.href = '/payTicket';
                    }}
                    disabled={selectedSeats.length === 0}
                >
                    Thanh Toán
                </button>
                <button 
                    className="ticketBooking__backButton" 
                    onClick={() => navigate(-1)}
                >
                    ← Trở lại
                </button>
            </div>
        </div>
    );
};

export default TicketInfo;