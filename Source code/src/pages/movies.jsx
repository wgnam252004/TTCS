import MovieGridComingSoon from "../components/movieGrid/movieGridComingSoon";
import MovieGridNowShowing from "../components/movieGrid/movieGridNowShowing";
import React from "react";
import { Link, NavLink } from 'react-router-dom'


const MoviesPage = () => {
    return (
        <>
            <div className="section-header">
                <Link>Phim đang chiếu</Link>
            </div>

            <MovieGridNowShowing />

            <div className="section-header">
                <Link>Phim sắp chiếu</Link>
            </div>

            <MovieGridComingSoon />
        </>
    )
}

export default MoviesPage;