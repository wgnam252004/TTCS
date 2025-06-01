import React, { useState, useEffect } from 'react';
import { Table, Button, message } from 'antd';
import axios from 'axios';
import ViewSeatDetail from './ViewSeatDetail';
import './ShowtimeTable.css';

const ShowtimeTable = () => {
    const [showtimes, setShowtimes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedShowtime, setSelectedShowtime] = useState(null);

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
    axios.defaults.baseURL = API_URL;

    const columns = [
        {
            title: 'ID',
            dataIndex: '_id',
            width: 100,
            render: (id) => id || 'N/A'
        },
        {
            title: 'Phim',
            dataIndex: 'movie_id',
            width: 150
        },
        {
            title: 'Rạp',
            dataIndex: 'cinema_id',
            width: 150
        },
        {
            title: 'Phòng chiếu',
            dataIndex: 'room_id',
            width: 150
        },
        {
            title: 'Thời gian bắt đầu',
            dataIndex: 'start_time',
            width: 150,
            render: (time) => new Date(time).toLocaleString('vi-VN')
        },
        {
            title: 'Thời gian kết thúc',
            dataIndex: 'end_time',
            width: 150,
            render: (time) => new Date(time).toLocaleString('vi-VN')
        },
        {
            title: 'Actions',
            key: 'actions',
            width: 150,
            render: (text, record) => (
                <Button
                    type="primary"
                    onClick={() => handleViewSeats(record)}
                >
                    Xem ghế
                </Button>
            )
        }
    ];

    const fetchShowtimes = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/api/showtimes');
            setShowtimes(response.data);
            setError(null);
        } catch (error) {
            setError('Không thể lấy dữ liệu suất chiếu');
            console.error('Error fetching showtimes:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleViewSeats = (showtime) => {
        setSelectedShowtime(showtime);
    };

    useEffect(() => {
        fetchShowtimes();
    }, []);

    return (
        <div className="showtime-table-container">
            <Table
                dataSource={showtimes}
                columns={columns}
                loading={loading}
                rowKey="_id"
                pagination={{ pageSize: 5 }}
            />
            
            {selectedShowtime && (
                <ViewSeatDetail
                    showtime={selectedShowtime}
                    onClose={() => setSelectedShowtime(null)}
                />
            )}
            
            {error && (
                <div style={{ color: '#f5222d', marginBottom: '20px' }}>
                    {error}
                </div>
            )}
        </div>
    );
};

export default ShowtimeTable;
