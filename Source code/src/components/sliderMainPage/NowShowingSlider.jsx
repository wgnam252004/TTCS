import React from 'react';
import MovieSliderBase from './MovieSliderBase';
import './movie-slider.css';

const NowShowingSlider = () => {
  return (
    <MovieSliderBase
      type="now-showing"
      id="now-showing-slider"
    />
  );
};

export default NowShowingSlider;
