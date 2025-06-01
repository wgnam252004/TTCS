import React from 'react';
import { Modal, Form, Input, Button, Row, Col } from 'antd';
import axios from 'axios';
import Swal from 'sweetalert2';
import './CinemaAddModal.css';

const CinemaAddModal = ({ isOpen, onClose, onAddSuccess }) => {
    const [form] = Form.useForm();

    const handleSubmit = async (values) => {
        try {
     
            const cinemasResponse = await axios.get('http://localhost:3000/api/cinemas');
            const cinemas = cinemasResponse.data;
            
        
            let maxNumber = 0;
            const validIds = cinemas.filter(cinema => cinema._id && cinema._id.startsWith('C'));
            
            if (validIds.length === 0) {
                maxNumber = 0; 
            } else {
                const numbers = validIds.map(cinema => parseInt(cinema._id.substring(1)));
                maxNumber = Math.max(...numbers);
            }
            

            const newNumber = maxNumber + 1;
            const newId = `C${newNumber.toString().padStart(4, '0')}`;
            

            if (!newId.startsWith('C') || newId.length !== 5) {
                throw new Error('ID không đúng định dạng. ID phải bắt đầu bằng C và có 5 ký tự.');
            }
            
    
            const cinemaData = {
                _id: newId,
                name: values.name,
                address: values.address,
                phone: values.phone,
                email: values.email,
                img: values.img
            };

            const response = await axios.post('http://localhost:3000/api/cinemas', cinemaData);
            
            if (response.status === 201) {
          
                onAddSuccess(response.data);
                
                Swal.fire({
                    title: 'Thành công',
                    text: 'Đã thêm rạp thành công',
                    icon: 'success',
                    draggable: true
                });
                
                onClose();
                form.resetFields();
            } else {
                Swal.fire({
                    title: 'Lỗi',
                    text: response.data.message || 'Thêm rạp phim không thành công',
                    icon: 'error'
                });
            }
        } catch (error) {
            console.error('Error adding cinema:', error);
            Swal.fire({
                title: 'Lỗi',
                text: error.response?.data?.message || 'Có lỗi xảy ra khi thêm rạp phim',
                icon: 'error'
            });
        }
    };

    return (
        <Modal
            title={<div className="modal-title">Thêm Rạp Phim </div>}
            open={isOpen}
            onCancel={onClose}
            footer={null}
            width={1000}
            centered={true}
            style={{
                marginTop: '50px'
            }}
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
            >
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            name="name"
                            label="Tên Rạp"
                            rules={[{ required: true, message: 'Vui lòng nhập tên rạp phim' }]}
                        >
                            <Input placeholder="Nhập tên rạp phim" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="address"
                            label="Địa chỉ"
                            rules={[{ required: true, message: 'Vui lòng nhập địa chỉ' }]}
                        >
                            <Input placeholder="Nhập địa chỉ" />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            name="phone"
                            label="Số điện thoại"
                            rules={[
                                { required: true, message: 'Vui lòng nhập số điện thoại' },
                                { pattern: /^\d{10}$/, message: 'Số điện thoại phải có 10 chữ số' }
                            ]}
                        >
                            <Input placeholder="Nhập số điện thoại" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
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
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            name="img"
                            label="URL Hình ảnh"
                            rules={[{ required: true, message: 'Vui lòng nhập URL hình ảnh' }]}
                        >
                            <Input placeholder="Nhập URL hình ảnh" />
                        </Form.Item>
                    </Col>
                </Row>

                <Form.Item>
                    <div style={{ display: 'flex', gap: 16, justifyContent: 'flex-end' }}>
                        <Button onClick={onClose}>Hủy</Button>
                        <Button
                            type="primary"
                            htmlType="submit"
                            style={{background : '#7F6DF8'}}
                        >
                            Thêm mới
                        </Button>
                    </div>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default CinemaAddModal;
