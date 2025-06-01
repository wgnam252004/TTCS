import React, { useEffect, useState } from 'react';
import { Table, Button, message } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import axios from 'axios';
import Swal from 'sweetalert2';
import './BookingTable.css';

const BookingTable = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Configure axios base URL using Vite env variables
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
    axios.defaults.baseURL = API_URL;

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            width: 80
        },
        {
            title: 'Người dùng',
            dataIndex: 'userId',
            width: 150
        },
        {
            title: 'Suất chiếu',
            dataIndex: 'showtimeId',
            width: 150
        },
        {
            title: 'Ngày suất chiếu',
            dataIndex: 'showtimeDate',
            width: 150,
            render: (date) => new Date(date).toLocaleString('vi-VN')
        },
        {
            title: 'Số ghế',
            dataIndex: 'seats',
            width: 150,
            render: (seats) => seats.join(', ')
        },
        {
            title: 'Tổng tiền',
            dataIndex: 'totalAmount',
            width: 100,
            render: (amount) => `${amount.toLocaleString('vi-VN')} ₫`
        },
        {
            title: 'Ngày đặt',
            dataIndex: 'bookingDate',
            width: 150,
            render: (date) => new Date(date).toLocaleString('vi-VN')
        },
        {
            title: 'Actions',
            key: 'actions',
            width: 100,
            render: (text, record) => (
                <Button
                    type="danger"
                    size="small"
                    icon={<DeleteOutlined />}
                    onClick={() => handleDelete(record.id)}
                >
                    Xóa
                </Button>
            )
        }
    ];

    const fetchBookings = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/api/bookings');
            setBookings(response.data);
            setError(null);
        } catch (error) {
            setError('Không thể lấy dữ liệu đặt vé');
            console.error('Error fetching bookings:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        try {
            const result = await Swal.fire({
                title: 'Bạn có chắc chắn xóa vé này không?',
                text: 'Bạn sẽ không thể khôi phục lại sau khi xóa!',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Có',
                cancelButtonText: 'Không'
            });

            if (result.isConfirmed) {
                const response = await axios.delete(`/api/bookings/${id}`);
                
                if (response.status === 200) {
                    message.success('Xóa vé thành công');
                    fetchBookings(); // Cập nhật danh sách vé
                } else {
                    throw new Error(response.data.message);
                }
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Không thể xóa vé.';
            Swal.fire({
                title: 'Lỗi!',
                text: errorMessage,
                icon: 'error'
            });
            console.error('Error deleting booking:', error);
        }
    };



    useEffect(() => {
        fetchBookings();
    }, []);

    return (
        <div className="booking-table-container">
            <Table
                dataSource={bookings}
                columns={columns}
                loading={loading}
                rowKey="id"
                pagination={{ pageSize: 5 }}
            />
            {error && (
                <div style={{ color: '#f5222d', marginBottom: '20px' }}>
                    {error}
                </div>
            )}
        </div>
    );
};

export default BookingTable;
