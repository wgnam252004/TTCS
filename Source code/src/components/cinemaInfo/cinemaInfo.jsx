import React, { useEffect, useState } from "react"
import './cinemaInfo.css'
import { Link, useParams } from "react-router-dom";
import axios from 'axios'

const CinemaInfo = ({ cinemaId }) => {
    const { cinemaId: urlCinemaId } = useParams();
    
    // Use cinemaId from prop if provided, otherwise use URL parameter
    const cinemaIdToUse = cinemaId || urlCinemaId;
    const [cinema, setCinema] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        console.log('CinemaInfo component received props:', { cinemaId, urlCinemaId });
        console.log('Using cinemaId:', cinemaIdToUse);
        
        const fetchCinemaDetails = async () => {
            try {
                if (!cinemaIdToUse) {
                    console.log('No valid cinema ID found');
                    setError("Cinema ID not found");
                    setLoading(false);
                    return;
                }

                console.log('Fetching cinema details from:', `http://localhost:3000/api/cinemas/${cinemaIdToUse}`);
                const response = await axios.get(`http://localhost:3000/api/cinemas/${cinemaIdToUse}`);
                console.log('Received cinema data:', response.data);
                setCinema(response.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching cinema details:", error);
                setError("Failed to load cinema details. Please try again later.");
                setLoading(false);
            }
        };

        fetchCinemaDetails();
    }, [cinemaIdToUse]); // Changed dependency to cinemaIdToUse

    if (loading) {
        console.log('CinemaInfo still loading...');
        return <div className="md-detail-container">Loading cinema details...</div>;
    }
    if (error) {
        console.error('CinemaInfo error:', error);
        return <div className="md-detail-container">Error: {error}</div>;
    }
    if (!cinema) {
        console.log('No cinema data in CinemaInfo');
        return <div className="md-detail-container">Cinema not found</div>;
    }

    return (
        <div className="cinema-info">
            <img src={cinema.img || "/assets/cinema-hero.png"} alt={cinema.name || "Cinema"} className="cinema-img" />
            <div className="cinema-info-content">
                <h3 className="cinema-name">{cinema.name}</h3>
                <p>
                    Địa chỉ: {cinema.address}<br />
                    Điện thoại: {cinema.phone}<br />
                    Email: {cinema.email}
                </p>
                <Link to="/cinema" className="choose-other-cinema-btn">← Chọn rạp khác</Link>
            </div>
        </div>
    )
}

export default CinemaInfo