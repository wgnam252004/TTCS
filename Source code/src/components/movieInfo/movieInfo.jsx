import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import './movieInfo.css';

const MovieInfo = ({ movieId }) => {
    const { id } = useParams();
    
    // Use movieId from URL parameter
    const movieIdToUse = id;
    const [movie, setMovie] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMovieDetails = async () => {
            try {
                if (!id) {
                    setError("Movie ID not found");
                    setLoading(false);
                    return;
                }

                const response = await axios.get(`http://localhost:3000/api/movies/${id}`);
                setMovie(response.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching movie details:", error);
                setError("Failed to load movie details. Please try again later.");
                setLoading(false);
            }
        };

        fetchMovieDetails();
    }, [id]);

    // Format date function
    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    if (loading) return <div className="md-detail-container">Loading movie details...</div>;
    if (error) return <div className="md-detail-container">Error: {error}</div>;
    if (!movie) return <div className="md-detail-container">Movie not found</div>;

    return (
        <div className="md-detail-container">
            <div className="md-detail-img-container">
                <img 
                    src={movie.small_img || "/assets/default-movie-poster.png"} 
                    alt={movie.title} 
                    className="md-detail-img" 
                />
            </div>
            <div className="md-detail-info-container">
                <div className="md-detail-title">{movie.title}</div>
                <div className="md-detail-desc">{movie.description}</div>
                <div className="md-detail-info-list">
                    <div>Phân loại: <span className="movie-detail-value">{movie.classify}</span></div>
                    <div>Đạo diễn: <span className="movie-detail-value">{movie.director}</span></div>
                    <div>Thể loại: <span className="movie-detail-value">{movie.genre}</span></div>
                    <div>Khởi chiếu: <span className="movie-detail-value">{formatDate(movie.releaseDate)}</span></div>
                    <div>Thời lượng: <span className="movie-detail-value">{movie.duration} phút</span></div>
                    <div>Ngôn ngữ: <span className="movie-detail-value">{movie.language}</span></div>
                </div>
                <Link to="/movies" className="choose-other-movie-btn">← Chọn phim khác</Link>
            </div>
        </div>
    );
};

export default MovieInfo;