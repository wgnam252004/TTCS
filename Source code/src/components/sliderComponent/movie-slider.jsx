import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import React from 'react';

import './movie-slider.css';

export default function MovieSlider({ id = 'defaultSlider' }) {
  const movies = [
    {
      title: 'CRAYON SHIN-CHAN: BÍ ẨN HỌC VIỆN HOA LỆ TENKASU',
      category: 'Family',
      image: '/assets/phim-Shin-small.png',
    },
    {
      title: 'THÁM TỬ KIÊN: KỲ ÁN KHÔNG ĐẦU',
      category: 'Mystery',
      image: '/assets/phim-Tham-tu-kien-small.jpg',
    },
    {
      title: 'WOOLINA AND THE NO BIRD: MUÔNG THÚ DẠY BÉ CỪU BAY',
      category: 'Family',
      image: '/assets/phim-Woolina-and-the-no-bird-small.jpg',
    },
    {
      title: 'LẬT MẶT 8: VÒNG TAY NẮNG',
      category: 'Horror',
      image: '/assets/phim-Lat-mat-8-small.png',
    },
    {
      title: 'THUNDERBOLTS*: BIỆT ĐỘI SẤM SÉT*',
      category: 'Action',
      image: '/assets/phim-Thunderbolts-small.png',
    },
    {
      title: 'A MINECRAFT MOVIE: MỘT BỘ PHIM MINECRAFT',
      category: 'Sci-Fi',
      image: '/assets/phim-Minecraft-small.jpg',
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isHovering, setIsHovering] = useState(false);
  const sliderRef = useRef(null);
  const trackRef = useRef(null);
  const containerRef = useRef(null);
  const itemWidth = 264; // Chiều rộng mỗi item
  const [itemsPerPage, setItemsPerPage] = useState(4);
  const maxIndex = movies.length;

  // Cập nhật itemsPerPage dựa trên kích thước container
  useEffect(() => {
    const updateItemsPerPage = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.clientWidth;
        setItemsPerPage(Math.floor(containerWidth / itemWidth) || 4);
      }
    };
    
    updateItemsPerPage(); // Chạy ngay khi component mount
    window.addEventListener('resize', updateItemsPerPage);
    
    return () => window.removeEventListener('resize', updateItemsPerPage);
  }, [itemWidth]);

  // Tạo mảng phim mở rộng cho hiệu ứng infinite
  const extendedMovies = [...movies, ...movies.slice(0, itemsPerPage)];

  // Xử lý khi đến slide cuối
  useEffect(() => {
    if (currentIndex >= maxIndex) {
      const timeout = setTimeout(() => {
        if (trackRef.current) {
          trackRef.current.style.transition = 'none';
          setCurrentIndex(0);
        }
        setTimeout(() => {
          if (trackRef.current) {
            trackRef.current.style.transition = 'transform 600ms cubic-bezier(0.25, 0.46, 0.45, 0.94)';
          }
        }, 50);
      }, 600);
      return () => clearTimeout(timeout);
    }
  }, [currentIndex, maxIndex]);

  // Tự động chuyển slide
  useEffect(() => {
    let interval;
    if (isAutoPlaying && !isHovering) {
      interval = setInterval(() => {
        setCurrentIndex((prevIndex) => 
          prevIndex >= maxIndex ? 0 : prevIndex + 1
        );
      }, 4000);
    }
    return () => clearInterval(interval);
  }, [isAutoPlaying, maxIndex, isHovering]);

  const handlePrev = () => {
    setIsAutoPlaying(false);
    setCurrentIndex(prevIndex => 
      prevIndex === 0 ? maxIndex - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setIsAutoPlaying(false);
    setCurrentIndex(prevIndex => 
      prevIndex >= maxIndex ? 1 : prevIndex + 1
    );
  };

  const goToPage = (index) => {
    setIsAutoPlaying(false);
    setCurrentIndex(index);
  };

  return (
    <div className="movie_slider_container" ref={containerRef} id={`movie-slider-${id}`}>
      <div 
        className="movie_slider_wrapper" 
        ref={sliderRef}
        onMouseEnter={() => {
          setIsHovering(true);
          setIsAutoPlaying(false);
        }}
        onMouseLeave={() => {
          setIsHovering(false);
          setIsAutoPlaying(true);
        }}
      >
        <div
          className="movie_slider_track"
          ref={trackRef}
          style={{ 
            transform: `translateX(-${currentIndex * itemWidth}px)`,
            width: `${extendedMovies.length * itemWidth}px`
          }}
        >
          {extendedMovies.map((movie, index) => (
            <div
              key={index}
              className="movie_slider_item"
            >
              <div className="movie_card_container">
                <div className="movie_image_container">
                  <img
                    src={movie.image}
                    alt={movie.title}
                    className="movie_poster_image"
                  />
                </div>
                <div className="movie_info_container">
                  <h3 className="movie_title_text">{movie.title}</h3>
                  <div className="movie_category_container">
                    <span className="movie_category_label">Thể loại phim: </span>
                    <span className="movie_category_value">{movie.category}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={handlePrev}
          className="movie_slider_prev_button"
          aria-label="Previous slide"
        >
          <ChevronLeft size={50} />
        </button>

        <button
          onClick={handleNext}
          className="movie_slider_next_button"
          aria-label="Next slide"
        >
          <ChevronRight size={50} />
        </button>
      </div>

      <div className="movie_slider_pagination">
        {movies.map((_, index) => (
          <button
            key={index}
            onClick={() => goToPage(index)}
            className={`movie_slider_pagination_dot ${currentIndex % maxIndex === index ? "movie_slider_pagination_dot_active" : ""}`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}