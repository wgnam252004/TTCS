import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Pagination } from 'antd';
import './movieGrid.css';

const MovieGridBase = ({ type }) => {
  const [movies, setMovies] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/movies/${type}`);
        setMovies(response.data.map(movie => ({
          title: movie.title,
          category: movie.genre,
          image: movie.small_img, 
          id: movie._id
        })));
      } catch (error) {
        console.error('Error fetching movies:', error);
      }
    };

    fetchMovies();
  }, [type]);

  const currentMovies = movies.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="section-wrapper">
      <div className="movie-grid">
        {currentMovies.map((movie) => (
          <Link to={`/chooseShowTimes/${movie.id}`} key={movie.id}>
            <div className="movie-grid-item">
              <div className="movie-card">
                <div className="movie-card-img-wrapper">
                  <img src={movie.image} alt={movie.title} />
                  <div className="img-overlay"></div>
                  {type === 'now-showing' && (
                    <button className="buy-ticket-btn">MUA VÉ NGAY</button>
                  )}
                </div>
                <div className="movie-card-body">
                  <div className="movie-card-title">{movie.title}</div>
                  <div className="movie-card-category">
                    Thể loại phim: <span className="category-family">{movie.category}</span>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="pagination-container">
        <Pagination
          current={currentPage}
          total={movies.length}
          pageSize={itemsPerPage}
          onChange={handlePageChange}
          showSizeChanger={false}
          showQuickJumper={true}
        />
      </div>
    </div>
  );
};

export default MovieGridBase;
