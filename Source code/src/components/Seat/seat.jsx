import React, { useState, useEffect } from "react";
import './seat.css';
import { useNavigate, useLocation } from "react-router-dom";
import axios from 'axios';

// Xóa import Link vì không cần dùng nữa

const Seat = ({ onSeatsChange }) => {
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [showtimeData, setShowtimeData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();
    
    // Lấy showtimeId từ URL params hoặc location state
    const showtimeId = location.state?.showtimeId || window.location.pathname.split('/').pop();

    // Xử lý chuyển hướng không cần tải lại trang
    const handleNavigate = (path) => {
        navigate(path, { replace: true });
    };

    useEffect(() => {
        const fetchShowtimeData = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/api/showtimes/${showtimeId}`);
                setShowtimeData(response.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching showtime data:", error);
                setError("Không thể tải thông tin giờ chiếu");
                setLoading(false);
            }
        };

        if (showtimeId) {
            fetchShowtimeData();
        }
    }, [showtimeId]);

    useEffect(() => {
        // Thông báo về thay đổi ghế đã chọn cho component cha
        if (onSeatsChange && showtimeData) {
            const selectedSeatDetails = selectedSeats.map(seatId => {
                const seat = showtimeData.seats.find(s => s.seat_id === seatId);
                return {
                    seat_id: seatId,
                    price: Math.round(showtimeData.base_price * seat.price_factor)
                };
            });
            onSeatsChange(selectedSeatDetails);
        }
    }, [selectedSeats, showtimeData, onSeatsChange]);

    const handleSeatClick = (seatId) => {
        const seat = showtimeData.seats.find(s => s.seat_id === seatId);
        
        // Kiểm tra trạng thái ghế
        if (seat.status !== 'available') {
            return; // Không cho phép chọn ghế đã được đặt
        }

        if (selectedSeats.includes(seatId)) {
            setSelectedSeats(selectedSeats.filter(s => s !== seatId));
        } else {
            setSelectedSeats([...selectedSeats, seatId]);
        }
    };

    const getSeatClass = (seat) => {
        let className = 'ticketBooking__seat';
        
        if (seat.status === 'booked' || seat.status === 'reserved') {
            className += ' ticketBooking__seat--booked';
        } else if (selectedSeats.includes(seat.seat_id)) {
            className += ' ticketBooking__seat--selected';
        } else if (seat.status === 'available') {
            className += ' ticketBooking__seat--available';
        }
        
        return className;
    };

    const groupSeatsByRow = () => {
        if (!showtimeData?.seats) return {};
        
        const grouped = {};
        showtimeData.seats.forEach(seat => {
            if (!grouped[seat.row]) {
                grouped[seat.row] = [];
            }
            grouped[seat.row].push(seat);
        });
        
        // Sắp xếp ghế theo cột trong mỗi hàng
        Object.keys(grouped).forEach(row => {
            grouped[row].sort((a, b) => a.column - b.column);
        });
        
        return grouped;
    };

    if (loading) return <div className="ticketBooking__loading">Đang tải...</div>;
    if (error) return <div className="ticketBooking__error">{error}</div>;
    if (!showtimeData) return <div className="ticketBooking__error">Không tìm thấy thông tin giờ chiếu</div>;

    const seatsByRow = groupSeatsByRow();
    const rows = Object.keys(seatsByRow).sort();

    return (
        <div className="ticketBooking__seatMapContainer">
            <div className="ticketBooking__screen">
                <div className="ticketBooking__screenText">MÀN HÌNH</div>
            </div>
            
            <div className="ticketBooking__seatGrid">
                {rows.map(row => (
                    <div key={row} className="ticketBooking__seatRow">
                        <div className="ticketBooking__rowLabel">{row}</div>
                        <div className="ticketBooking__rowSeats">
                            {seatsByRow[row].map(seat => (
                                <button
                                    key={seat.seat_id}
                                    className={getSeatClass(seat)}
                                    onClick={() => handleSeatClick(seat.seat_id)}
                                    disabled={seat.status !== 'available'}
                                    title={`${seat.seat_id} - ${Math.round(showtimeData.base_price * seat.price_factor).toLocaleString()} VND`}
                                >
                                    {seat.column}
                                </button>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
            
            <div className="ticketBooking__legend">
                <div className="ticketBooking__legendItem">
                    <div className="ticketBooking__seat ticketBooking__seat--available"></div>
                    <span>Còn trống</span>
                </div>
                <div className="ticketBooking__legendItem">
                    <div className="ticketBooking__seat ticketBooking__seat--selected"></div>
                    <span>Đã chọn</span>
                </div>
                <div className="ticketBooking__legendItem">
                    <div className="ticketBooking__seat ticketBooking__seat--booked"></div>
                    <span>Đã đặt</span>
                </div>
            </div>

        </div>
    );
};

export default Seat;