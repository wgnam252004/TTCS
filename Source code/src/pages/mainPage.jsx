import ImageSlider from '../components/sliderMainPage/banner-slider';
import MovieSlider from '../components/sliderMainPage/movie-slider';
import React from 'react';
import { Link } from 'react-router-dom'

const MainPage = () => {
    return (
        <div className="container">

            <ImageSlider />

            <div className="section-header">
                <Link to="/movieShowtimes">Phim đang chiếu</Link>
            </div>

            <MovieSlider id="nowShowing" />

            <div className="section-header">
                <Link to="/movieShowtimes">Phim sắp chiếu</Link>
            </div>

            <MovieSlider id="comingSoon" />

        </div>
    )
}

export default MainPage;