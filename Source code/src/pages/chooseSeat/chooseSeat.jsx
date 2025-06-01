import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from 'react';
import MovieInfo from "../../components/movieInfo/movieInfo";
import TicketInfo from "../../components/ticketInfo/ticketInfo";
import Seat from "../../components/Seat/seat";
import './chooseSeat.css';

const ChooseSeat = () => {
    const [selectedSeats, setSelectedSeats] = useState([]);

    const handleSeatsChange = (seats) => {
        setSelectedSeats(seats);
    };

    return (
        <div className="bookingChair__container">
            <div className="bookingChair__content">
                <div className="bookingChair__seatSection">
                    <Seat onSeatsChange={handleSeatsChange} />
                </div>
                <div className="bookingChair__infoSection">
                    <TicketInfo selectedSeats={selectedSeats} />
                </div>
            </div>
        </div>
    );
}

export default ChooseSeat