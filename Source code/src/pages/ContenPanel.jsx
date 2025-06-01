import React from 'react';
import { useNavigate } from 'react-router-dom';
import MovieTable from '../components/MovieTable/MovieTable';
import CinemaTable from '../components/CinemaTable/CinemaTable';
import UserTable from '../components/UserTable/UserTable';
import BookingTable from '../components/BookingTable/BookingTable';
import ShowtimeTable from '../components/ShowtimeTable/ShowtimeTable';
import ProfileInfo from '../components/ProfileInfo/ProfileInfo';
import './ContentPanel.css';

const ContentPanel = ({ activePanel }) => {
    const navigate = useNavigate();

    const panels = {
        'info': (
            <div className="management">
                <h2 className="management-title">Thông tin cá nhân</h2>
                <ProfileInfo />
            </div>
        ),
        'movies': (
            <div className="management">
                <h2 className="management-title">Quản lý phim</h2>

                <MovieTable />

            </div>
        ),
        'showtimes': (
            <div className="management">
                <h2 className="management-title">Quản lý lịch chiếu</h2>
                <ShowtimeTable />
            </div>
        ),
        'cinemas': (
            <div className="management">
                <h2 className="management-title">Quản lý rạp phim</h2>
                
                <CinemaTable />
            </div>
        ),
        'tickets': (
            <div className="management">
                <h2 className="management-title">Quản lý vé</h2>
                <BookingTable />
            </div>
        ),
        'users': (
            <div className="management">
                <h2 className="management-title">Quản lý người dùng</h2>
                
                <UserTable />
            </div>
        )
    };

    return panels[activePanel] || null;
};

export default ContentPanel;
