import React, { useState, useEffect } from 'react';
import { Modal, message } from 'antd';
import './ViewSeatDetail.css';

const ViewSeatDetail = ({ showtime, onClose }) => {
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (showtime) {
            setLoading(false);
        }
    }, [showtime]);

    const handleSeatClick = (seat) => {
        if (seat.status !== 'available') {
            message.error('Ghế này đã được đặt');
            return;
        }

        setSelectedSeats(prev => 
            prev.includes(seat.seat_id) 
                ? prev.filter(id => id !== seat.seat_id) 
                : [...prev, seat.seat_id]
        );
    };

    const renderSeats = () => {
        if (!showtime?.seats || loading) {
            return <div>Loading...</div>;
        }

        const groupedSeats = {};
        showtime.seats.forEach(seat => {
            if (!groupedSeats[seat.row]) {
                groupedSeats[seat.row] = [];
            }
            groupedSeats[seat.row].push(seat);
        });

        Object.keys(groupedSeats).forEach(row => {
            groupedSeats[row].sort((a, b) => a.column - b.column);
        });

        return (
            <div className="seat-container">
                <div className="ticketBooking__screen">
                    <div className="ticketBooking__screenText">Màn hình</div>
                </div>
                
                
                {Object.entries(groupedSeats).map(([row, seats]) => (
                    <div key={row} className="seat-row">
                        <div className="row-label">{row}</div>
                        {seats.map((seat) => (
                            <div
                                key={seat.seat_id}
                                className={`ticketBooking__seat ${
                                    seat.status === 'booked' ? 'ticketBooking__seat--booked' :
                                    seat.status === 'available' ? 'ticketBooking__seat--available' : ''
                                }`}
                                title={`Ghế ${seat.seat_id} - ${seat.status === 'available' ? 'Có sẵn' : 'Đã được đặt'}`}
                            >
                                {seat.seat_id}
                            </div>
                        ))}
                    </div>
                ))}

                <div className="ticketBooking__legend">
                    <div className="ticketBooking__legendItem">
                        <div className="ticketBooking__seat ticketBooking__seat--available"></div>
                        <span>Còn trống</span>
                    </div>
                    <div className="ticketBooking__legendItem">
                        <div className="ticketBooking__seat ticketBooking__seat--booked"></div>
                        <span>Đã đặt</span>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <Modal
            title={`Xem ghế - Suất chiếu ${showtime?._id}`}
            visible={showtime !== null}
            onCancel={onClose}
            footer={null}
            width={800}
        >
            {renderSeats()}
        </Modal>
    );
};

export default ViewSeatDetail;
