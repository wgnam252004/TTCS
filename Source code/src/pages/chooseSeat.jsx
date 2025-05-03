import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from 'react';
import MovieInfo from "../components/movieInfo/movieInfo";
import TicketInfo from "../components/ticketInfo/ticketInfo";
import Seat from "../components/Seat/seat";


const ChooseSeat = () => {
    return (
        <>
            <MovieInfo />

            <div className="ticketBooking__mainContainer">
                <Seat />

                <TicketInfo />
            </div>
        </>
    )
}

export default ChooseSeat