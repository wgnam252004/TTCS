import React from "react";
import { Link } from "react-router-dom";
import YoutubeVid from "../components/youtubeEmbed/youtube-container";
import Showtime from "../components/showTime/showtimes";
import Calendar from "../components/calendar/calendar";
import MovieInfo from "../components/movieInfo/movieInfo";

const ChooseShowTime = () => {
    return (
        <>
            <MovieInfo />

            <YoutubeVid />

            <div className="movie-schedule-section">
                <Showtime />
                <div className="calendar-section">
                    <Calendar />
                </div>
            </div>


        </>
    )
}

export default ChooseShowTime