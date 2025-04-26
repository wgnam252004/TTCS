import MovieGridComingSoon from "../../components/movieGridComponent/movieGridComingSoon";
import MovieGridNowShowing from "../../components/movieGridComponent/movieGridNowShowing";
import React from "react";
import { Link, NavLink } from 'react-router-dom'


const MovieShowtimesPage = () => {
    return (
        <>
            <div className="section-header">
                <a href="#">Phim đang chiếu</a>
            </div>

            <MovieGridNowShowing />

            <div className="section-header">
                <a href="#">Phim sắp chiếu</a>
            </div>

            <MovieGridComingSoon />
        </>
    )
}

export default MovieShowtimesPage;