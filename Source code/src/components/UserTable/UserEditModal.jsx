import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Button, Select, message } from 'antd';
import axios from 'axios';
import Swal from 'sweetalert2';

const { Option } = Select;

const UserEditModal = ({ isOpen, onClose, userId, onSuccess }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    // Configure axios base URL using Vite env variables
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
    axios.defaults.baseURL = API_URL;

    useEffect(() => {
        if (isOpen && userId) {
            fetchUserDetails();
        }
    }, [isOpen, userId]);

    const fetchUserDetails = async () => {
        try {
            const response = await axios.get(`/api/users/${userId}`);
            form.setFieldsValue(response.data);
        } catch (error) {
            message.error('Không thể lấy thông tin người dùng');
            console.error('Error fetching user details:', error);
        }
    };

    const onFinish = async (values) => {
        try {
            const result = await Swal.fire({
                title: 'Bạn có chắc chắn muốn sửa người dùng này không?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#7F6DF8',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Có',
                cancelButtonText: 'Không'
            });

            if (result.isConfirmed) {
                setLoading(true);
                
                const updateData = {
                    name: values.name,
                    role: values.role
                };

                await axios.put(`/api/users/${userId}`, updateData);
                message.success('Cập nhật người dùng thành công');
                onSuccess();
                onClose();
            }
        } catch (error) {
            message.error('Không thể cập nhật người dùng');
            console.error('Error updating user:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        onClose();
    };

    return (
        <Modal
            title={<div className="modal-title">Chỉnh sửa người dùng</div>}
            open={isOpen}
            onCancel={handleCancel}
            footer={null}
            width={600}
            centered={true}
            style={{
                marginTop: '50px'
            }}
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
            >
                <Form.Item
                    name="id"
                    label="ID"
                >
                    <Input disabled />
                </Form.Item>

                <Form.Item
                    name="name"
                    label="Tên người dùng"
                    rules={[{ required: true, message: 'Vui lòng nhập tên người dùng' }]}
                >
                    <Input placeholder="Nhập tên người dùng" />
                </Form.Item>

                <Form.Item
                    name="email"
                    label="Email"
                >
                    <Input disabled />
                </Form.Item>

                <Form.Item
                    name="role"
                    label="Vai trò"
                    rules={[{ required: true, message: 'Vui lòng chọn vai trò' }]}
                >
                    <Select placeholder="Chọn vai trò">
                        <Option value="User">Người dùng thường</Option>
                        <Option value="Admin">Quản trị viên</Option>
                    </Select>
                </Form.Item>

                <Form.Item>
                    <Button
                        type="default"
                        onClick={handleCancel}
                        style={{ marginRight: 8 }}
                    >
                        Hủy
                    </Button>
                    <Button
                        type="primary"
                        htmlType="submit"
                        loading={loading}
                        style={{ background: '#7F6DF8' }}
                    >
                        Sửa
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default UserEditModal;
