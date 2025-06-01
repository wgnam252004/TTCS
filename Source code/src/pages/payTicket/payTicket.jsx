import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import './payTicket.css';
import axios from 'axios';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
const PayTicket = () => {
    const location = useLocation();
    const navigate = useNavigate();
    
    const storedData = localStorage.getItem('ticketPaymentData');
    const paymentData = storedData ? JSON.parse(storedData) : location.state;

    const {
        showtimeId,
        selectedSeats = [],
        totalAmount = 0,
        movieData,
        cinemaData,
        showtimeData
    } = paymentData || {};

    useEffect(() => {
        if (!showtimeId || !selectedSeats.length) {
            console.error("Không có dữ liệu thanh toán");
            navigate(-1);
        }

        localStorage.removeItem('ticketPaymentData');
    }, [showtimeId, selectedSeats, navigate]);

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

    const formatCurrency = (amount) => {
        if (typeof amount !== 'number') return '0 VND';
        return amount.toLocaleString('vi-VN') + ' VND';
    };

    const selectedSeatIds = selectedSeats.map(seat => seat.seat_id || seat.id || 'Unknown').join(', ');

    const user = JSON.parse(localStorage.getItem('user'));
    const token = localStorage.getItem('token');

    const handleConfirmPayment = async () => {
        try {
            if (!user) {
                throw new Error('Không tìm thấy thông tin người dùng');
            }

            const bookingData = {
                userId: user.id, 
                showtimeId,
                seats: selectedSeats.map(seat => seat.seat_id || seat.id),
                totalAmount: parseFloat(totalAmount)
            };

            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
            const response = await axios.post(`${API_URL}/api/bookings/create`, bookingData, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.status === 201) {
                try {
                    navigate('/ticket-confirmation', {
                        state: {
                            bookingId: response.data.bookingId,
                            showtimeId,
                            selectedSeats,
                            totalAmount,
                            movieData,
                            cinemaData,
                            showtimeData
                        }
                    });
                } catch (seatError) {
                    console.error('Error updating seat status:', seatError);
                    navigate('/ticket-confirmation', {
                        state: {
                            bookingId: response.data.bookingId,
                            showtimeId,
                            selectedSeats,
                            totalAmount,
                            movieData,
                            cinemaData,
                            showtimeData
                        }
                    });
                } finally {
                    Swal.fire({
                        title: "Đặt vé thành công!",
                        icon: "success",
                        draggable: true
                    });
                    navigate('/');
                }
            } else {
                throw new Error('Đặt vé không thành công');
            }
        } catch (error) {
            console.error('Lỗi khi đặt vé:', error);
            Swal.fire({
                title: "Error",
                text: error.message || "Đã xảy ra lỗi khi đặt vé. Vui lòng thử lại.",
                icon: "error"
            });
        }
    };

    if (!showtimeId || !selectedSeats.length) {
        return <div className="payTicket__loading">Đang tải...</div>;
    }

    return (
        <div className="payTicket__container">
            <div className="payTicket__content">
                <div className="payTicket__ticketSection">

                    <div className="payTicket__infoContainer">
                        <div className="payTicket__infoHeader">
                            <h2 className="payTicket__theaterName">
                                {typeof cinemaData?.name === 'string' ? cinemaData.name : 
                                 typeof cinemaData?.name === 'object' ? cinemaData.name.name || JSON.stringify(cinemaData.name) :
                                 'Rạp phim'}
                            </h2>
                            <p className="payTicket__screenInfo">
                                {typeof showtimeData?.room_id === 'string' ? showtimeData.room_id : 
                                 typeof showtimeData?.room_id === 'object' ? showtimeData.room_id.name || JSON.stringify(showtimeData.room_id) :
                                 'Phòng chiếu'} - {formatDate(showtimeData?.date)} - Suất chiếu: {formatTime(showtimeData?.start_time)}
                            </p>
                        </div>

                        <div className="payTicket__movieInfo">
                            <h3 className="payTicket__movieTitle">
                                {typeof movieData?.title === 'string' ? movieData.title :
                                 typeof movieData?.name === 'string' ? movieData.name :
                                 typeof movieData?.title === 'object' ? movieData.title.name || JSON.stringify(movieData.title) :
                                 typeof movieData?.name === 'object' ? movieData.name.name || JSON.stringify(movieData.name) :
                                 'Phim'}
                            </h3>
                        </div>

                        <div className="payTicket__ticketDetails">
                            <div className="payTicket__ticketRow">
                                <span className="payTicket__seatInfo">
                                    Ghế: {selectedSeatIds}
                                </span>
                            </div>
                            
                            <div className="payTicket__seatDetails">
                                {selectedSeats.map((seat, index) => (
                                    <div key={seat.seat_id || seat.id || index} className="payTicket__seatDetail">
                                        <span>Ghế {seat.seat_id || seat.id || `${index + 1}`}</span>
                                        <span>{formatCurrency(seat.price)}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="payTicket__totalRow">
                            <span className="payTicket__totalLabel">Tổng tiền</span>
                            <span className="payTicket__totalValue">
                                {formatCurrency(totalAmount)}
                            </span>
                        </div>

                        <div className="payTicket__actionButtons">
                            <button 
                                className="payTicket__confirmButton" 
                                onClick={handleConfirmPayment}
                            >
                                Xác Nhận Thanh Toán
                            </button>
                            <button 
                                className="payTicket__backButton" 
                                onClick={() => navigate(-1)}
                            >
                                ← Trở lại
                            </button>
                        </div>
                    </div>
                </div>

                <div className="payTicket__qrCode">
                            <img 
                                src="/assets/QR.jpg" 
                                alt="QR Code thanh toán" 
                                style={{ width: '350px', height: '350px' }}
                            />
                        </div>
            </div>
        </div>
    );
};

export default PayTicket;