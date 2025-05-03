import React from "react";
import MovieInfo from "../components/movieInfo/movieInfo";
import TicketInfo from "../components/ticketInfo/ticketInfo";
import { Link } from "react-router-dom";


const PayTicket = () => {

    return (
        <>
            <MovieInfo />

            <div className="ticketBooking__mainContainer">

                <TicketInfo />

            </div>
        </>
    )
}

export default PayTicket