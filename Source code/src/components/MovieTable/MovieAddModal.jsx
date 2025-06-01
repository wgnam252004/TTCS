import React from 'react';
import { Modal, Form, Input, Select, DatePicker, Button, Row, Col } from "antd";
import { useState } from "react";
import axios from 'axios';
import Swal from 'sweetalert2';
import './MovieAddModal.css';

const { Option } = Select;

const AddMovieModal = ({ isOpen, onClose, onAddSuccess }) => {
    const [form] = Form.useForm();

    const handleSubmit = async (values) => {
        try {
            const moviesResponse = await axios.get('http://localhost:3000/api/movies');
            const movies = moviesResponse.data;
            
            let maxNumber = 0;
            movies.forEach(movie => {
                const id = movie._id;
                if (id.startsWith('M')) {
                    const number = parseInt(id.substring(1));
                    if (number > maxNumber) {
                        maxNumber = number;
                    }
                }
            });
            
            const newNumber = maxNumber + 1;
            const newId = `M${newNumber.toString().padStart(4, '0')}`;
            
            const statusMap = {
                'now-showing': 'Phim đang chiếu',
                'coming-soon': 'Phim sắp chiếu'
            };
            
            const formattedDate = values.releaseDate.format('YYYY-MM-DD');
            
            const movieData = {
                _id: newId,
                title: values.title,
                description: values.description,
                classify: values.classify,
                director: values.director,
                genre: values.genre,
                releaseDate: formattedDate,
                duration: values.duration,
                language: values.language,
                status: statusMap[values.status],
                hero_img: values.hero_img || null,
                small_img: values.small_img,
                video_url: values.video_url
            };

            console.log('Sending movie data:', movieData);

            const response = await axios.post('http://localhost:3000/api/movies', movieData);
            
            if (response.status === 201) {
                onAddSuccess(response.data);
                
                Swal.fire({
                    title: 'Thành công',
                    text: 'Đã thêm phim thành công',
                    icon: 'success',
                    draggable: true
                });
                form.resetFields();
                onClose();
            } else {
                Swal.fire({
                    title: 'Lỗi',
                    text: response.data.message || 'Thêm phim không thành công',
                    icon: 'error'
                });
            }
        } catch (error) {
            console.error('Error adding movie:', error);
            Swal.fire({
                title: 'Lỗi',
                text: error.response?.data?.message || 'Có lỗi xảy ra khi thêm phim',
                icon: 'error'
            });
        }
    };

    return (
        <Modal
            title={<div className="modal-title">Thêm Phim Mới</div>}
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
                            name="title"
                            label="Tiêu đề"
                            rules={[{ required: true, message: 'Vui lòng nhập tiêu đề phim' }]}
                        >
                            <Input placeholder="Nhập tiêu đề phim" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="classify"
                            label="Phân loại"
                            rules={[{ required: true, message: 'Vui lòng nhập phân loại phim' }]}
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
                            rules={[{ required: true, message: 'Vui lòng nhập tên đạo diễn' }]}
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
                            label="Ngày phát hành"
                            rules={[{ required: true, message: 'Vui lòng chọn ngày phát hành' }]}
                        >
                            <DatePicker className="date-picker-full-width" placeholder="Chọn ngày phát hành" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="duration"
                            label="Thời lượng (phút)"
                            rules={[{ required: true, message: 'Vui lòng nhập thời lượng phim' }]}
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
                        >
                            <Input placeholder="Nhập ngôn ngữ phim" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="status"
                            label="Trạng thái"
                            rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}
                        >
                            <Select placeholder="Chọn trạng thái">
                                <Option value="now-showing">Phim đang chiếu</Option>
                                <Option value="coming-soon">Phim sắp chiếu</Option>
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            name="hero_img"
                            label="Hình ảnh lớn"
                        >
                            <Input placeholder="Nhập URL hình ảnh lớn" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="small_img"
                            label="Hình ảnh nhỏ"
                            rules={[
                                { required: true, message: 'Vui lòng nhập URL hình ảnh nhỏ' },
                                { pattern: /^https?:\/\/(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(?:\/[^\s]*)?$/, message: 'Vui lòng nhập một URL hợp lệ' }
                            ]}
                        >
                            <Input placeholder="Nhập URL hình ảnh nhỏ" />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            name="video_url"
                            label="URL Video"
                            rules={[
                                { required: true, message: 'Vui lòng nhập URL video' },
                            ]}
                        >
                            <Input placeholder="Nhập URL video" />
                        </Form.Item>
                    </Col>
                </Row>

                <Form.Item
                    name="description"
                    label="Mô tả"
                    rules={[{ required: true, message: 'Vui lòng nhập mô tả phim' }]}
                >
                    <Input.TextArea className="movie-description" placeholder="Nhập mô tả phim" />
                </Form.Item>

                <Form.Item>
                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Button onClick={onClose} style={{ marginRight: 8 }}>
                            Hủy
                        </Button>
                        <Button type="primary" htmlType="submit" style={{background : '#7F6DF8'}}> 
                            Thêm phim
                        </Button>
                    </div>
                </Form.Item>
            </Form>
        </Modal>
    );
};



export default AddMovieModal;