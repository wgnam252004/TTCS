import React from 'react';

import './movieGrid.css';

function MovieGridComingSoon() {
  return (
    <div className="section-wrapper">
      <div className="movie-grid">
        {[...Array(8)].map((_, index) => (
          <div className="movie-grid-item" key={index}>
            <div className="movie-card">
              <div className="movie-card-img-wrapper">
                <img src="../assets/anh be trang chu.png" alt="Pororo: Thám Hiểm Đại Dương Xanh" />
              </div>
              <div className="movie-card-body">
                <div className="movie-card-title">PORORO: THÁM HIỂM ĐẠI DƯƠNG XANH</div>
                <div className="movie-card-category">
                  Thể loại phim: <span className="category-family">Family</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="phantrang">
        <i class="bi bi-arrow-left-circle"></i>
        <i class="bi bi-1-circle"></i>
        <i class="bi bi-2-circle"></i>
        <i class="bi bi-3-circle"></i>
        <i class="bi bi-arrow-right-circle"></i>
      </div>
    </div>
  );
}

export default MovieGridComingSoon;