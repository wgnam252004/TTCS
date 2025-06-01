import React, { useEffect, useState } from 'react';
import { Table, Button, message } from "antd";
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import axios from 'axios';
import Swal from 'sweetalert2';
import './CinemaTable.css';
import CinemaAddModal from './CinemaAddModal';
import ViewCinemaDetail from './ViewCinemaDetail';
import CinemaEditModal from './CinemaEditModal';

const CinemaTable = () => {
    const [cinemas, setCinemas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editCinemaId, setEditCinemaId] = useState(null);
    const [dataDetail, setDataDetail] = useState(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);

    

    // Configure axios base URL using Vite env variables
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
    axios.defaults.baseURL = API_URL;

    const columns = [
        {
            title: 'ID',
            dataIndex: '_id',
            render: (_, record) => {
                return (
                    <a href='#'
                        onClick={() => {
                            setDataDetail(record);
                            setIsDetailOpen(true);
                        }}
                    >
                        {record._id}
                    </a>
                )
            },
            width: 50
        },
        {
            title: 'Tên Rạp',
            dataIndex: 'name',
            key: 'name',
            width: 200
        },
        {
            title: 'Địa chỉ',
            dataIndex: 'address',
            key: 'address',
            width: 200
        },
        {
            title: 'Số điện thoại',
            dataIndex: 'phone',
            key: 'phone',
            width: 150
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            width: 200
        },
        {
            title: 'Actions',
            key: 'actions',
            width: 150,
            render: (text, record) => (
                <div className="action-buttons">
                    <Button
                        type="primary"
                        size="small"
                        icon={<EditOutlined />}
                        onClick={() => handleEdit(record._id)}
                        style={{ marginRight: 8 }}
                    >
                        Sửa
                    </Button>
                    <Button
                        type="danger"
                        size="small"
                        icon={<DeleteOutlined />}
                        onClick={() => handleDelete(record._id)}
                    >
                        Xóa
                    </Button>
                </div>
            )
        }
    ];

    const fetchCinemas = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/api/cinemas');
            setCinemas(response.data);
            setError(null);
        } catch (error) {
            setError('Không thể lấy dữ liệu rạp phim');
            console.error('Error fetching cinemas:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddCinema = () => {
        setIsAddModalOpen(true);
    };

    const handleEdit = (id) => {
        setEditCinemaId(id);
        setIsEditModalOpen(true);
    };

    const handleDelete = async (id) => {
        try {
            const { isConfirmed } = await Swal.fire({
                title: 'Bạn có chắc chắn muốn xóa?',
                text: "Bạn sẽ không thể hoàn tác điều này!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Xóa',
                cancelButtonText: 'Hủy'
            });

            if (isConfirmed) {
                await axios.delete(`/api/cinemas/${id}`);
                message.success('Xóa rạp phim thành công');
                fetchCinemas();
            }
        } catch (error) {
            console.error('Error deleting cinema:', error);
            message.error('Không thể xóa rạp phim');
        }
    };

    useEffect(() => {
        fetchCinemas();
    }, []);

    return (
        <div className="cinema-table-container">
            <div className="table-header">
                <Button 
                    type="primary" 
                    onClick={handleAddCinema}
                    className='add-btn'
                >
                    Thêm rạp phim 
                </Button>
            </div>
            {error && <div className="error-message">{error}</div>}
            <Table
                columns={columns}
                dataSource={cinemas}
                loading={loading}
                rowKey="_id"
                pagination={{ pageSize: 5 }}
            />
            <CinemaAddModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onAddSuccess={fetchCinemas}
                cinema={dataDetail}
            />
            <ViewCinemaDetail
                dataDetail={dataDetail}
                setDataDetail={setDataDetail}
                isDetailOpen={isDetailOpen}
                setIsDetailOpen={setIsDetailOpen}
            />
            {isEditModalOpen && (
                <CinemaEditModal
                    isOpen={isEditModalOpen}
                    onClose={() => setIsEditModalOpen(false)}
                    cinemaId={editCinemaId}
                    onSuccess={fetchCinemas}
                />
            )}
        </div>
    );
};

export default CinemaTable;
