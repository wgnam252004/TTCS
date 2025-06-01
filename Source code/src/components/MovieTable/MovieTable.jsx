import React, { useEffect, useState } from 'react';
import { Table, Button, message } from "antd";
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import axios from 'axios';
import Swal from 'sweetalert2';
import './MovieTable.css';
import { data } from 'react-router-dom';
import ViewMovieDetail from './ViewMovieDetail';
import MovieAddModal from './MovieAddModal';
import MovieEditModal from './MovieEditModal';

const MovieTable = () => {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Phương thức cập nhật danh sách phim sau khi thêm thành công
    const onAddSuccess = (newMovie) => {
        setMovies(prevMovies => [...prevMovies, newMovie]);
    };

    const [dataDetail, setDataDetail] = useState(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editMovieId, setEditMovieId] = useState(null);

    const handleAddMovie = () => {
        setIsAddModalOpen(true);
    };

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
            title: 'Title',
            dataIndex: 'title',
            key: 'title',
            width: 200
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            width: 100
        },
        {
            title: 'Actions',
            key: 'actions',
            width: 100,
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


    const fetchMovies = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/api/movies');
            // Đảm bảo mỗi item có key duy nhất
            const moviesWithKeys = response.data.map(movie => ({
                ...movie,
                key: movie._id
            }));
            setMovies(moviesWithKeys);
            setError(null);
        } catch (error) {
            setError('Không thể lấy dữ liệu phim');
            console.error('Error fetching movies:', error);
        } finally {
            setLoading(false);
        }
    };

    // Hàm xử lý xóa phim
    const handleDelete = async (id) => {
        try {
            const result = await Swal.fire({
                title: 'Bạn có chắc chắn xóa phim này không?',
                text: 'Bạn sẽ không thể khôi phục lại sau khi xóa!',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Có',
                cancelButtonText: 'Không'
            });

            if (result.isConfirmed) {
                await axios.delete(`/api/movies/${id}`);
                Swal.fire({
                    title: 'Đã xóa!',
                    text: 'Phim đã được xóa thành công.',
                    icon: 'success'
                });
                fetchMovies(); // Cập nhật danh sách phim
            }
        } catch (error) {
            Swal.fire({
                title: 'Lỗi!',
                text: 'Không thể xóa phim.',
                icon: 'error'
            });
            console.error('Error deleting movie:', error);
        }
    };

    // Hàm xử lý sửa phim
    const handleEdit = (id) => {
        setEditMovieId(id);
        setIsEditModalOpen(true);
    };

    useEffect(() => {
        fetchMovies();
    }, []);

    return (
        <div className="movie-table-container">
            <Button type='primary' className='add-btn' onClick={handleAddMovie}>
                Thêm Phim Mới
            </Button>
            <Table
                dataSource={movies}
                columns={columns}
                loading={loading}
                rowKey="_id"
                pagination={{ pageSize: 10 }}
            />

            <ViewMovieDetail
                dataDetail={dataDetail}
                setDataDetail={setDataDetail}
                isDetailOpen={isDetailOpen}
                setIsDetailOpen={setIsDetailOpen}
            />

            {isAddModalOpen && (
                <MovieAddModal
                    isOpen={isAddModalOpen}
                    onClose={() => setIsAddModalOpen(false)}
                    onAddSuccess={onAddSuccess}
                />
            )}
            {isEditModalOpen && (
                <MovieEditModal
                    isOpen={isEditModalOpen}
                    onClose={() => setIsEditModalOpen(false)}
                    movieId={editMovieId}
                    onSuccess={fetchMovies}
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

export default MovieTable;
