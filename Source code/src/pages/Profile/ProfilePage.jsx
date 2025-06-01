import React, { useState, useEffect } from 'react';
import { Table, message } from 'antd';
import './ProfilePage.css';
import axios from 'axios';
import ProfileInfo from '../../components/ProfileInfo/ProfileInfo';

axios.defaults.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
axios.defaults.withCredentials = true;

const ProfilePage = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUserBookings();
    }, []);

    const fetchUserBookings = async () => {
        try {
            const storedUser = JSON.parse(localStorage.getItem('user'));
            if (!storedUser) {
                message.error('Không tìm thấy thông tin người dùng');
                return;
            }

            const response = await axios.get(`/api/bookings/user/${storedUser.id}`);
            
            if (response.status === 200) {
                setBookings(response.data);
            } else {
                message.error('Không thể lấy danh sách vé');
            }
        } catch (error) {
            message.error('Lỗi khi lấy danh sách vé');
            console.error('Error fetching bookings:', error);
        } finally {
            setLoading(false);
        }
    };

    const columns = [
        {
            title: 'Mã vé',
            dataIndex: 'id',
            key: 'id',
            width: 100
        },
        {
            title: 'Tên phim',
            dataIndex: 'movieName',
            key: 'movieName',
            width: 200
        },
        {
            title: 'Rạp',
            dataIndex: 'cinemaName',
            key: 'cinemaName',
            width: 150
        },
        {
            title: 'Ngày chiếu',
            dataIndex: 'showtimeDate',
            key: 'showtimeDate',
            width: 150,
            render: (date) => new Date(date).toLocaleString('vi-VN')
        },
        {
            title: 'Ghế',
            dataIndex: 'seats',
            key: 'seats',
            width: 150,
            render: (seats) => seats.join(', ')
        },
        {
            title: 'Tổng tiền',
            dataIndex: 'totalAmount',
            key: 'totalAmount',
            width: 150,
            render: (amount) => `${amount.toLocaleString('vi-VN')} ₫`
        },
        {
            title: 'Ngày đặt',
            dataIndex: 'bookingDate',
            key: 'bookingDate',
            width: 150,
            render: (date) => new Date(date).toLocaleString('vi-VN')
        }
    ];

    return (
        <div className="profile-page">
            <div className="profile-container">
                    <h2>Thông tin cá nhân</h2>
                <ProfileInfo />
            </div>
            
            <div className="bookings-container">
                <h2>Danh sách vé đã mua</h2>
                <Table
                    columns={columns}
                    dataSource={bookings}
                    loading={loading}
                    rowKey="id"
                    pagination={{ pageSize: 5 }}
                />
            </div>
        </div>
    );
};

export default ProfilePage;
