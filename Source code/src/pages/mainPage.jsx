import ImageSlider from '../components/sliderMainPage/banner-slider';
import NowShowingSlider from '../components/sliderMainPage/NowShowingSlider';
import ComingSoonSlider from '../components/sliderMainPage/ComingSoonSlider';
import React from 'react';
import { Link } from 'react-router-dom'

const MainPage = () => {
    return (
        <div className="container">

            <ImageSlider />

            <div className="section-header">
                <Link to="/movieShowtimes">PHIM ĐANG CHIẾU</Link>
            </div>

            <NowShowingSlider />

            <div className="section-header">
                <Link to="/movieShowtimes">PHIM SẮP CHIẾU</Link>
            </div>

            <ComingSoonSlider />

        </div>
    )
}

export default MainPage;