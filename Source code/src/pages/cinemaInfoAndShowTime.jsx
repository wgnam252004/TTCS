import React, { useState, useEffect } from "react";
import axios from 'axios';

import { Link, NavLink, useParams } from 'react-router-dom'
import CinemaShowtimes from "../components/cinemaShowtimes/cinemaShowtimes";
import CinemaInfo from "../components/cinemaInfo/cinemaInfo";
import Calendar from "../components/calendar/calendar";
import "../components/cinemaShowtimes/cinemaShowtimes.css";


const CinemaInfoPage = () => {
    const { cinemaId } = useParams();
    const [cinema, setCinema] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        console.log('Fetching cinema details for cinemaId:', cinemaId);
        const fetchCinemaDetails = async () => {
            try {
                if (!cinemaId) {
                    console.log('No cinema ID provided');
                    return;
                }
                
                const response = await axios.get(`http://localhost:3000/api/cinemas/${cinemaId}`);
                console.log('API Response:', response.data);
                setCinema(response.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching cinema details:", error);
                setError("Failed to load cinema details: " + error.message);
                setLoading(false);
            }
        };

        fetchCinemaDetails();
    }, [cinemaId]);

    if (loading) {
        console.log('Still loading...');
        return <div>Loading cinema details...</div>;
    }
    if (error) {
        console.error('Error state:', error);
        return <div>Error: {error}</div>;
    }
    if (!cinema) {
        console.log('No cinema data found');
        return <div>Cinema not found</div>;
    }

    return (
        <>
            <div className="cinema-detail-container">
                <CinemaInfo cinemaId={cinemaId} />
                <div className="cinema-schedule-section">
                    <CinemaShowtimes cinemaId={cinemaId} />
                    <div className="calendar-section">
                        <Calendar cinemaId={cinemaId} />
                    </div>
                </div>
            </div>
        </>
    );

    
    return (
        <>
            {/* <div className="section-header">
                <Link to={`/cinemaDetail/${id}`} className="section-header-link">
                    Filmora Tây Hồ
                </Link>
            </div> */}


            <div className="cinema-detail-container">

                <CinemaInfo cinemaId={id} />

                <div className="cinema-schedule-section">
                    <Showtime cinemaId={id} />
                    <div className="calendar-section">
                        <Calendar cinemaId={id} />
                    </div>
                </div>
            </div>
        </>
    );
};

export default CinemaInfoPage