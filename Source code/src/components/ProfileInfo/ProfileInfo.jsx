import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Form, Input, Button, message } from 'antd';
import './ProfileInfo.css';

// Cấu hình API
axios.defaults.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
axios.defaults.withCredentials = true;

const ProfileInfo = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    // Lấy thông tin người dùng từ localStorage
    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (storedUser) {
            setUser(storedUser);
            // Kiểm tra xem người dùng có tồn tại không
            axios.get(`/api/users/${storedUser.id}`)
                .then(response => {
                    if (response.status === 200) {
                        setUser(response.data);
                    } else {
                        message.error('Không thể lấy thông tin người dùng');
                    }
                })
                .catch(error => {
                    message.error('Người dùng không tồn tại hoặc có lỗi xảy ra');
                    console.error('Error fetching user:', error);
                });
        }
    }, []);

    const [form] = Form.useForm();

    const handleEdit = () => {
        setIsEditing(true);
        form.setFieldsValue({
            name: user?.name || '',
            email: user?.email || '',
            password: ''
        });
    };

    const handleCancel = () => {
        setIsEditing(false);
        form.resetFields();
    };

    const handleSave = async () => {
        try {
            setLoading(true);
            const values = await form.validateFields();
            
            // Gọi API cập nhật thông tin
            const response = await axios.put(`/api/users/${user.id}`, {
                name: values.name,
                password: values.password
            });

            if (response.status === 200) {
                message.success('Cập nhật thông tin thành công');
                // Cập nhật lại thông tin người dùng trong localStorage
                const updatedUser = { ...user, name: values.name };
                localStorage.setItem('user', JSON.stringify(updatedUser));
                setUser(updatedUser);
                setIsEditing(false);
            } else {
                throw new Error(response.data.message || 'Cập nhật không thành công');
            }
        } catch (error) {
            message.error(error.response?.data?.message || 'Không thể cập nhật thông tin');
            console.error('Error updating user:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="profile-info">
            
            <div className="profile-content">
                <div className="profile-field">
                    <label>Tên:</label>
                    <div className="profile-value">{user?.name}</div>
                </div>
                <div className="profile-field">
                    <label>Email:</label>
                    <div className="profile-value">{user?.email}</div>
                </div>
            </div>

            <div className="profile-actions">
                <Button type="primary" onClick={handleEdit}>
                    Chỉnh sửa thông tin
                </Button>
            </div>

            <Modal
                title="Cập nhật thông tin"
                open={isEditing}
                onCancel={handleCancel}
                footer={null}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSave}
                >
                    <Form.Item
                        name="name"
                        label="Tên"
                        rules={[{ required: true, message: 'Vui lòng nhập tên' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name="email"
                        label="Email"
                    >
                        <Input value={user?.email} disabled />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        label="Mật khẩu mới"
                    >
                        <Input.Password placeholder="Để trống nếu không muốn thay đổi mật khẩu" />
                    </Form.Item>

                    <Form.Item>
                        <Button type="default" onClick={handleCancel}>
                            Hủy
                        </Button>
                        <Button type="primary" htmlType="submit" loading={loading} style={{ marginLeft: '20px' }}>
                            Lưu thay đổi
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default ProfileInfo;
