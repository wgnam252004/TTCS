import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Button, message, Row, Col } from 'antd';
import axios from 'axios';
import Swal from 'sweetalert2';

const CinemaEditModal = ({ isOpen, onClose, cinemaId, onSuccess }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    // Configure axios base URL using Vite env variables
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
    axios.defaults.baseURL = API_URL;

    useEffect(() => {
        if (isOpen && cinemaId) {
            fetchCinemaDetails();
        }
    }, [isOpen, cinemaId]);

    const fetchCinemaDetails = async () => {
        try {
            const response = await axios.get(`/api/cinemas/${cinemaId}`);
            form.setFieldsValue(response.data);
        } catch (error) {
            message.error('Không thể lấy thông tin rạp phim');
            console.error('Error fetching cinema details:', error);
        }
    };

    const onFinish = async (values) => {
        try {
            const result = await Swal.fire({
                title: 'Bạn có chắc chắn muốn sửa rạp phim này không?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#7F6DF8',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Có',
                cancelButtonText: 'Không'
            });

            if (result.isConfirmed) {
                setLoading(true);
                
                await axios.put(`/api/cinemas/${cinemaId}`, values);
                message.success('Cập nhật rạp phim thành công');
                onSuccess();
                onClose();
            }
        } catch (error) {
            message.error('Không thể cập nhật rạp phim');
            console.error('Error updating cinema:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        onClose();
    };

    return (
        <Modal
            title={<div className="modal-title">Chỉnh sửa rạp phim</div>}
            open={isOpen}
            onCancel={handleCancel}
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
                onFinish={onFinish}
            >
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            name="name"
                            label="Tên rạp"
                            rules={[{ required: true, message: 'Vui lòng nhập tên rạp' }]}
                        >
                            <Input placeholder="Nhập tên rạp" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="img"
                            label="Ảnh rạp"
                        >
                            <Input type="url" placeholder="URL của ảnh rạp" />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            name="address"
                            label="Địa chỉ"
                            rules={[{ required: true, message: 'Vui lòng nhập địa chỉ' }]}
                        >
                            <Input.TextArea rows={2} placeholder="Nhập địa chỉ" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="phone"
                            label="Số điện thoại"
                            rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}
                        >
                            <Input placeholder="Nhập số điện thoại" />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            name="email"
                            label="Email"
                            rules={[{ required: true, message: 'Vui lòng nhập email' }]}
                        >
                            <Input type="email" placeholder="Nhập email" />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={24} style={{ textAlign: 'right' }}>
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
                                style={{background : '#7F6DF8'}}
                            >
                                Sửa
                            </Button>
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Modal>
    );
};

export default CinemaEditModal;
