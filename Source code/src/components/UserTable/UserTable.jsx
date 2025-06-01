import React, { useEffect, useState } from 'react';
import { Table, Button, message } from "antd";
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import axios from 'axios';
import Swal from 'sweetalert2';
import './UserTable.css';
import UserAddModal from './UserAddModal';
import UserEditModal from './UserEditModal';

const UserTable = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editUserId, setEditUserId] = useState(null);

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
    axios.defaults.baseURL = API_URL;

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            width: 50
        },
        {
            title: 'Tên',
            dataIndex: 'name',
            key: 'name',
            width: 150
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            width: 200
        },
        {
            title: 'Vai trò',
            dataIndex: 'role',
            key: 'role',
            width: 100
        },
        {
            title: 'Actions',
            key: 'actions',
            width: 150,
            render: (text, record) => (
                <div className="action-buttons">
                    <Button
                        type="danger"
                        size="small"
                        icon={<DeleteOutlined />}
                        onClick={() => handleDelete(record.id)}
                    >
                        Xóa
                    </Button>
                    <Button
                        type="primary"
                        size="small"
                        icon={<EditOutlined />}
                        onClick={() => handleEdit(record.id)}
                        style={{ marginRight: 8 }}
                    >
                        Sửa
                    </Button>
                </div>
            )
        }
    ];

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/api/users');
            setUsers(response.data);
            setError(null);
        } catch (error) {
            setError('Không thể lấy dữ liệu người dùng');
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        try {
            const result = await Swal.fire({
                title: 'Bạn có chắc chắn xóa người dùng này không?',
                text: 'Bạn sẽ không thể khôi phục lại sau khi xóa!',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Có',
                cancelButtonText: 'Không'
            });

            if (result.isConfirmed) {
                const response = await axios.delete(`/api/users/${id}`);
                if (response.status === 200) {
                    message.success('Xóa người dùng thành công');
                    fetchUsers(); 
                } else {
                    throw new Error(response.data.message || 'Không thể xóa người dùng');
                }
            }
        } catch (error) {
            Swal.fire({
                title: 'Lỗi!',
                text: error.response?.data?.message || 'Không thể xóa người dùng.',
                icon: 'error'
            });
            console.error('Error deleting user:', error);
        }
    };

    const onAddSuccess = (newUser) => {
        setUsers(prevUsers => [...prevUsers, newUser]);
    };

    const handleEdit = (id) => {
        setEditUserId(id);
        setIsEditModalOpen(true);
    };

    const handleAddUser = () => {
        setIsAddModalOpen(true);
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    return (
        <div className="user-table-container">
            <Button type='primary' className='add-btn' onClick={handleAddUser}>
                Thêm Người Dùng Mới
            </Button>
            <Table
                dataSource={users}
                columns={columns}
                loading={loading}
                rowKey="id"
                pagination={{ pageSize: 5 }}
            />

            {isAddModalOpen && (
                <UserAddModal
                    isOpen={isAddModalOpen}
                    onClose={() => setIsAddModalOpen(false)}
                    onAddSuccess={onAddSuccess}
                />
            )}
            {isEditModalOpen && (
                <UserEditModal
                    isOpen={isEditModalOpen}
                    onClose={() => setIsEditModalOpen(false)}
                    userId={editUserId}
                    onSuccess={fetchUsers}
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

export default UserTable;
