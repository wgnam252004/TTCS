import React from 'react';
import { Modal, Form, Input, Button, Select } from 'antd';
import axios from 'axios';
import Swal from 'sweetalert2';
import './UserAddModal.css';

const { Option } = Select;

const UserAddModal = ({ isOpen, onClose, onAddSuccess }) => {
    const [form] = Form.useForm();

    const handleSubmit = async (values) => {
        try {
            const usersResponse = await axios.get('/api/users');
            const users = usersResponse.data;
            
            let maxNumber = 0;
            users.forEach(user => {
                const id = user.id;
                if (id.startsWith('U')) {
                    const number = parseInt(id.substring(1));
                    if (number > maxNumber) {
                        maxNumber = number;
                    }
                }
            });
            
            const newNumber = maxNumber + 1;
            const newId = `U${newNumber.toString().padStart(4, '0')}`;
            
            const userData = {
                name: values.name,
                email: values.email,
                password: values.password,
                role: values.role
            };

            const response = await axios.post('/api/users', userData);
            
            if (response.status === 201) {
                onAddSuccess(response.data);
                
                Swal.fire({
                    title: 'Thành công',
                    text: 'Đã thêm người dùng thành công',
                    icon: 'success',
                    draggable: true
                });
                
                form.resetFields();
                onClose();
            } else {
                Swal.fire({
                    title: 'Lỗi',
                    text: response.data.message || 'Thêm người dùng không thành công',
                    icon: 'error'
                });
            }
        } catch (error) {
            console.error('Error adding user:', error);
            Swal.fire({
                title: 'Lỗi',
                text: error.response?.data?.message || 'Có lỗi xảy ra khi thêm người dùng',
                icon: 'error'
            });
        }
    };

    return (
        <Modal
            title={<div className="modal-title">Thêm người dùng</div>}
            open={isOpen}
            onCancel={onClose}
            footer={null}
            width={600}
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                className="user-add-form"
            >
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
                    rules={[
                        { required: true, message: 'Vui lòng nhập email' },
                        { type: 'email', message: 'Email không hợp lệ' }
                    ]}
                >
                    <Input placeholder="Nhập email" />
                </Form.Item>

                <Form.Item
                    name="password"
                    label="Mật khẩu"
                    rules={[{ required: true, message: 'Vui lòng nhập mật khẩu' }]}
                >
                    <Input.Password placeholder="Nhập mật khẩu" />
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
                    <Button type="primary" htmlType="submit" block>
                        Thêm người dùng
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default UserAddModal;
