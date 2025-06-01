import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Button, message, Row, Col } from 'antd';
import axios from 'axios';
import Swal from 'sweetalert2';

const MovieEditModal = ({ isOpen, onClose, movieId, onSuccess }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
    axios.defaults.baseURL = API_URL;

    useEffect(() => {
        if (isOpen && movieId) {
            fetchMovieDetails();
        }
    }, [isOpen, movieId]);

    const fetchMovieDetails = async () => {
        try {
            const response = await axios.get(`/api/movies/${movieId}`);
            form.setFieldsValue(response.data);
        } catch (error) {
            message.error('Không thể lấy thông tin phim');
            console.error('Error fetching movie details:', error);
        }
    };

    const onFinish = async (values) => {
        try {
            const result = await Swal.fire({
                title: 'Bạn có chắc chắn muốn sửa phim này không?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#7F6DF8',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Có',
                cancelButtonText: 'Không'
            });

            if (result.isConfirmed) {
                setLoading(true);
                
                await axios.put(`/api/movies/${movieId}`, values);
                message.success('Cập nhật phim thành công');
                onSuccess();
                onClose();
            }
        } catch (error) {
            message.error('Không thể cập nhật phim');
            console.error('Error updating movie:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        onClose();
    };

    return (
        <Modal
            title={<div className="modal-title">Chỉnh sửa phim</div>}
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
                            name="title"
                            label="Tiêu đề"
                            rules={[{ required: true, message: 'Vui lòng nhập tiêu đề' }]}
                        >
                            <Input placeholder="Nhập tiêu đề phim" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="classify"
                            label="Phân loại"
                            rules={[{ required: true, message: 'Vui lòng nhập phân loại' }]}
                        >
                            <Input placeholder="Nhập phân loại phim" />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            name="director"
                            label="Đạo diễn"
                            rules={[{ required: true, message: 'Vui lòng nhập đạo diễn' }]}
                        >
                            <Input placeholder="Nhập tên đạo diễn" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="genre"
                            label="Thể loại"
                            rules={[{ required: true, message: 'Vui lòng nhập thể loại' }]}
                        >
                            <Input placeholder="Nhập tên thể loại" />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            name="releaseDate"
                            label="Ngày khởi chiếu"
                            rules={[{ required: true, message: 'Vui lòng chọn ngày khởi chiếu' }]}
                        >
                            <Input type="date" placeholder="Chọn ngày khởi chiếu" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="duration"
                            label="Thời gian (phút)"
                            rules={[{ required: true, message: 'Vui lòng nhập thời gian' }]}
                        >
                            <Input type="number" placeholder="Nhập thời lượng phim" />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            name="language"
                            label="Ngôn ngữ"
                            rules={[{ required: true, message: 'Vui lòng nhập ngôn ngữ' }]}
                        >
                            <Input placeholder="Nhập ngôn ngữ phim" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="status"
                            label="Trạng thái"
                            rules={[{ required: true, message: 'Vui lòng nhập trạng thái' }]}
                        >
                            <Input placeholder="Nhập trạng thái phim" />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            name="hero_img"
                            label="Ảnh Hero"
                        >
                            <Input type="url" placeholder="URL của ảnh hero" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="small_img"
                            label="Ảnh Nhỏ"
                        >
                            <Input type="url" placeholder="URL của ảnh nhỏ" />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={24}>
                        <Form.Item
                            name="description"
                            label="Mô tả"
                            rules={[{ required: true, message: 'Vui lòng nhập mô tả' }]}
                        >
                            <Input.TextArea rows={4} placeholder="Nhập mô tả phim" />
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

export default MovieEditModal;
