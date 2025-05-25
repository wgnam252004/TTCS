import React, { useState, useEffect, useRef } from 'react';
import './banner-slider.css';
import { Link } from 'react-router-dom';
import axios from 'axios';

const ImageSlider = () => {
  const [itemActive, setItemActive] = useState(0);
  const [countItem, setCountItem] = useState(0);
  const [sliderData, setSliderData] = useState([]);
  const itemsRef = useRef([]);
  const thumbnailsRef = useRef([]);
  const sliderRef = useRef(null);
  const thumbnailsContainerRef = useRef(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    // Lấy dữ liệu từ API khi component mount
    const fetchMovies = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/movies/recent');
        const movies = response.data.map(movie => ({
          id: movie._id,
          image: movie.hero_img,
          imageSmall: movie.small_img,
          title: movie.title,
          description: movie.description || 'No description available'
        }));
        setSliderData(movies);
        setCountItem(movies.length);
      } catch (error) {
        console.error('Error fetching movies:', error);
        // Hiển thị thông báo lỗi
        console.error('Failed to fetch movies:', error);
      }
    };

    fetchMovies();
  }, []);

  useEffect(() => {
    // Khởi tạo số lượng item
    setCountItem(sliderData.length);

    // Thiết lập auto slider
    startAutoSlider();

    // Cleanup khi component unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [sliderData]);

  useEffect(() => {
    // Thiết lập các references sau khi component đã render
    if (sliderRef.current) {
      itemsRef.current = sliderRef.current.querySelectorAll('.list .item');
      thumbnailsRef.current = thumbnailsContainerRef.current.querySelectorAll('.item');
    }
  }, [sliderData]);

  // Hàm chuyển slide tiếp theo
  const handleNext = () => {
    let newActive = itemActive + 1;
    if (newActive >= countItem) {
      newActive = 0;
    }
    setItemActive(newActive);
  };

  // Hàm chuyển slide trước đó
  const handlePrev = () => {
    let newActive = itemActive - 1;
    if (newActive < 0) {
      newActive = countItem - 1;
    }
    setItemActive(newActive);
  };

  // Khởi động lại auto slider
  const startAutoSlider = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    intervalRef.current = setInterval(() => {
      handleNext();
    }, 4000);
  };

  // Hiệu ứng khi itemActive thay đổi
  useEffect(() => {
    if (countItem > 0 && sliderRef.current && thumbnailsContainerRef.current) {
      // Loại bỏ active class từ các phần tử cũ
      const itemActiveOld = sliderRef.current.querySelector('.list .item.active');
      const thumbnailActiveOld = thumbnailsContainerRef.current.querySelector('.item.active');

      if (itemActiveOld) itemActiveOld.classList.remove('active');
      if (thumbnailActiveOld) thumbnailActiveOld.classList.remove('active');

      // Thêm active class vào các phần tử mới
      if (itemsRef.current[itemActive]) {
        itemsRef.current[itemActive].classList.add('active');
      }

      if (thumbnailsRef.current[itemActive]) {
        thumbnailsRef.current[itemActive].classList.add('active');
        setPositionThumbnail();
      }

      // Khởi động lại auto slider
      startAutoSlider();
    }
  }, [itemActive, countItem]);

  // Hàm thiết lập vị trí của thumbnail
  const setPositionThumbnail = () => {
    const thumbnailActive = thumbnailsContainerRef.current.querySelector('.item.active');
    if (thumbnailActive) {
      const rect = thumbnailActive.getBoundingClientRect();
      if (rect.left < 0 || rect.right > window.innerWidth) {
        thumbnailActive.scrollIntoView({ behavior: 'smooth', inline: 'nearest' });
      }
    }
  };

  // Xử lý khi click vào thumbnail
  const handleThumbnailClick = (index) => {
    setItemActive(index);
  };

  return (
    <div className="slider" ref={sliderRef}>
      {/* list Items */}
      <div className="list">
          {sliderData.map((slide, index) => (
            <Link key={index} to={`/chooseShowTimes/${slide.id}`} className={`item ${index === 0 ? 'active' : ''}`}>
              <img src={slide.image} alt={slide.title} />
              <div className="content">
                <h2>{slide.title}</h2>
                <p>{slide.description}</p>
              </div>
            </Link>
          ))}
        </div>

      {/* button arrows */}
      <div className="arrows">
        <button id="prev" onClick={handlePrev}>{'<'}</button>
        <button id="next" onClick={handleNext}>{'>'}</button>
      </div>

      {/* thumbnail */}
      <div className="thumbnail" ref={thumbnailsContainerRef}>
        {sliderData.map((slide, index) => (
          <div
            key={index}
            className={`item ${index === 0 ? 'active' : ''}`}
            onClick={() => handleThumbnailClick(index)}
          >
            <img src={slide.imageSmall} alt={slide.title} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageSlider;