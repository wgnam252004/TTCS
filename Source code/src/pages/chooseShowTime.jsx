import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import YoutubeVid from "../components/youtubeEmbed/youtube-container";
import Showtime from "../components/showTime/showtimes";
import Calendar from "../components/calendar/calendar";
import MovieInfo from "../components/movieInfo/movieInfo";

const ChooseShowTime = () => {
    const { id } = useParams();
    const [movie, setMovie] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMovieDetails = async () => {
            try {
                if (!id) return;
                
                const response = await axios.get(`http://localhost:3000/api/movies/${id}`);
                setMovie(response.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching movie details:", error);
                setError("Failed to load movie details");
                setLoading(false);
            }
        };

        fetchMovieDetails();
    }, [id]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!movie) return <div>Movie not found</div>;

    return (
        <>
            <MovieInfo movieId={id} />

            <YoutubeVid movieId={id} />

            {movie.status === 'Phim đang chiếu' && (
                <div className="movie-schedule-section">
                    <Showtime movieId={id} />
                    <div className="calendar-section">
                        <Calendar />
                    </div>
                </div>
            )}
        </>
    );
};

export default ChooseShowTime;