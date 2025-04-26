import ImageSlider from '../../components/sliderComponent/banner-slider';
import MovieSlider from '../../components/sliderComponent/movie-slider';
import './mainPage.css'
import React from 'react';
import { Link, NavLink } from 'react-router-dom'

const MainPage = () => {
    return (
        <div className="container">

            <ImageSlider />

            <div className="section-header">
                <a href="#">Phim đang chiếu</a>
            </div>

            <MovieSlider id="nowShowing" />

            <div className="section-header">
                <a href="#">Phim sắp chiếu</a>
            </div>

            <MovieSlider id="comingSoon" />

        </div>
    )
}

export default MainPage;