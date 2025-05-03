import React, { useState, useEffect, useRef } from 'react';
import './banner-slider.css';
import { Link } from 'react-router-dom';

const ImageSlider = () => {
  const [itemActive, setItemActive] = useState(0);
  const [countItem, setCountItem] = useState(0);
  const itemsRef = useRef([]);
  const thumbnailsRef = useRef([]);
  const sliderRef = useRef(null);
  const thumbnailsContainerRef = useRef(null);
  const intervalRef = useRef(null);

  // Dữ liệu slider
  const sliderData = [
    {
      image: "/assets/phim-Shin-hero.png",
      imageSmall: "/assets/phim-Shin-small.png",
      title: "CRAYON SHIN-CHAN: BÍ ẨN HỌC VIỆN HOA LỆ TENKASU",
      description: "Shinnosuke và những người bạn của Shin thuộc Đội đặc nhiệm Kasukabe trải qua một tuần ở lại Học viện Tư nhân Tenkasu Kasukabe được quản lý bởi một AI hiện đại, Otsmun. Tất cả các học sinh ban đầu được trao một huy hiệu với 1000 điểm và điểm của các em"
    },
    {
      image: "/assets/phim-Tham-tu-kien-hero.jpg",
      imageSmall: "/assets/phim-Tham-tu-kien-small.jpg",
      title: "THÁM TỬ KIÊN: KỲ ÁN KHÔNG ĐẦU",
      description: "Thám Tử Kiên là nhân vật được yêu thích trong tác phẩm điện của ăn khách của NGƯỜI VỢ CUỐI CÙNG của Victor Vũ. Thám Tử Kiên: Kỳ Án Không Đầu sẽ là một phim Victor Vũ trở về với thể loại sở trường Kinh Dị – Trinh Thám sau những tác phẩm tình cảm lãng mạn."
    },
    {
      image: "/assets/phim-Woolina-and-the-no-bird-hero.jpg",
      imageSmall: "/assets/phim-Woolina-and-the-no-bird-small.jpg",
      title: "WOOLINA AND THE NO BIRD: MUÔNG THÚ DẠY BÉ CỪU BAY",
      description: "Woolina, một cô cừu non mang trong mình ước mơ được bay lượn trên bầu trời. Bị cả thế giới và cả người cha của mình ngăn cản nhưng Wooline không hề nản lòng. Cùng những người bạn thân, cô theo chân Siêu Cú để giành lấy cơ hội vào trường đào tạo phi công."
    },
    {
      image: "/assets/anh lon trang chu.png",
      imageSmall: "/assets/anh be trang chu.png",
      title: "Pororo: Thám hiểm đại dương xanh",
      description: "Chú chim cánh cụt đáng yêu Pororo và những người bạn cùng nhau khám phá bí ẩn dưới đáy đại dương và tường bước trở thành anh hùng biển cả."
    },
    {
      image: "/assets/phim-Lat-mat-8-hero.jpg",
      imageSmall: "/assets/phim-Lat-mat-8-small.png",
      title: "LẬT MẶT 8: VÒNG TAY NẮNG",
      description: "Một bộ phim về sự khác biệt quan điểm giữa ba thế hệ ông bà cha mẹ con cháu. Ai cũng đúng ở góc nhìn của mình nhưng đứng trước hoài bão của tuổi trẻ, cuối cùng thì ai sẽ là người phải nghe theo người còn lại?"
    },
  ];

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
  }, []);

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
      <Link to="/movieBooking">
        <div className="list">
          {sliderData.map((slide, index) => (
            <div key={index} className={`item ${index === 0 ? 'active' : ''}`}>
              <img src={slide.image} alt={slide.title} />
              <div className="content">
                <h2>{slide.title}</h2>
                <p>{slide.description}</p>
              </div>
            </div>
          ))}
        </div>
      </Link>

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