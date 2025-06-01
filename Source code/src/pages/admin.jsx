import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './admin.css';
import ContentPanel from './ContenPanel';
import './ContentPanel.css';

const menuItems = [
    {
        icon: 'bi-person-circle',
        text: 'Thông tin cá nhân',
        tooltip: 'Thông tin cá nhân',
        path: 'info'
    },
    {
        icon: 'bi-film',
        text: 'Quản lý phim',
        tooltip: 'Quản lý phim',
        path: 'movies'
    },
    {
        icon: 'bi-calendar-day',
        text: 'Quản lý lịch chiếu',
        tooltip: 'Quản lý lịch chiếu',
        path: 'showtimes'
    },
    {
        icon: 'bi-easel',
        text: 'Quản lý rạp phim',
        tooltip: 'Quản lý rạp phim',
        path: 'cinemas'
    },
    {
        icon: 'bi-ticket-perforated',
        text: 'Quản lý vé',
        tooltip: 'Quản lý vé',
        path: 'tickets'
    },
    {
        icon: 'bi-person',
        text: 'Quản lý người dùng',
        tooltip: 'Quản lý người dùng',
        path: 'users'
    },
    {
        icon: 'bi-house-door',
        text: 'Trang chủ',
        tooltip: 'Quay lại trang chủ',
        path: 'home'
    }
];

const Sidebar = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [activePanel, setActivePanel] = useState('info');
    const navigate = useNavigate();

    const toggleSidebar = () => {
        setIsCollapsed(!isCollapsed);
    };

    const handleMenuItemClick = (path) => {
        if (path === 'home') {
            navigate('/');
        } else {
            setActivePanel(path);
        }
    };

    return (
        <div className="app-container">
            <div className={`sidebar ${isCollapsed ? 'active' : ''}`}>
                <div className="logo_content">
                    <div className="logo-container">
                        <img src="/assets/logo.png" alt="Logo" />
                    </div>
                    <i className="bi bi-list fs-3" id="btn" onClick={toggleSidebar}>
                    </i>
                </div>
                <ul className="nav_list">
                    {menuItems.map((item, index) => (
                        <li key={index}>
                            <button 
                                className={`nav-link ${activePanel === item.path ? 'active' : ''}`}
                                onClick={() => handleMenuItemClick(item.path)}
                                title={item.tooltip}
                            >
                                <i className={`bi ${item.icon}`}></i>
                                <span className="links_name">{item.text}</span>
                            </button>
                            
                        </li>
                    ))}
                </ul>
            </div>
            <div className="content-con">
                <div className="content-header">
                </div>
                <div >
                    <ContentPanel activePanel={activePanel} />
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
