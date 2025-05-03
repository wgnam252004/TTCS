import React from "react";
import './seat.css';
import { Link, useNavigate } from "react-router-dom";
import { useState } from 'react';

const Seat = () => {
    const [selectedSeats, setSelectedSeats] = useState(['C7', 'C8']);
    const navigate = useNavigate();

    // Chỉ hiển thị 7 hàng thay vì toàn bộ alphabet
    const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
    const cols = Array.from({ length: 10 }, (_, i) => i + 1);

    const handleSeatClick = (seat) => {
        if (selectedSeats.includes(seat)) {
            setSelectedSeats(selectedSeats.filter(s => s !== seat));
        } else {
            setSelectedSeats([...selectedSeats, seat]);
        }
    };

    const isSeatSelected = (seat) => selectedSeats.includes(seat);

    return (
        <div className="ticketBooking__seatMapContainer">
            <div className="ticketBooking__seatGrid">
                {rows.map(row => (
                    cols.map(col => {
                        const seatId = `${row}${col}`;
                        return (
                            <button
                                key={seatId}
                                className={`ticketBooking__seat ${isSeatSelected(seatId) ? 'ticketBooking__seat--selected' : ''}`}
                                onClick={() => handleSeatClick(seatId)}
                            >
                                {seatId}
                            </button>
                        );
                    })
                ))}
            </div>
        </div>
    )
}

export default Seat