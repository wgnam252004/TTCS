import React from "react";
import { Link, NavLink } from 'react-router-dom'
import Showtime from "../components/showTime/showtimes";
import CinemaInfo from "../components/cinemaInfo/cinemaInfo";
import Calendar from "../components/calendar/calendar";


const CinemaInfoPage = () => {
    return (
        <>
            <div className="section-header">
                <a href="#">Filmora Tây Hồ</a>
            </div>


            <div className="cinema-detail-container">

                <CinemaInfo />

                <div className="cinema-schedule-section">
                    <Showtime />
                    <div className="calendar-section">
                        <Calendar />
                    </div>
                </div>
            </div>
        </>


    );
};

export default CinemaInfoPage