import { Drawer } from "antd";
import React from 'react';
import { Image } from 'antd';

const ViewMovieDetail = (props) => {
    const {
        dataDetail,
        setDataDetail,
        isDetailOpen,
        setIsDetailOpen
    } = props;

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    return (
        <Drawer title="Chi tiết phim"
            onClose={() => {
                setDataDetail(null);
                setIsDetailOpen(false);
            }}
            open={isDetailOpen}
            width={500}
        >
            {dataDetail ? (
                <>
                    {dataDetail.hero_img && (
                        <div style={{ textAlign: 'center' }}>
                            <h3>Ảnh Hero</h3>
                            <Image
                                src={dataDetail.hero_img}
                                alt="Ảnh hero phim"
                                width={450}
                                height={200}
                                preview={{
                                    mask: 'Xem ảnh lớn hơn'
                                }}
                            />
                        </div>
                    )}
                    <br />
                    {dataDetail.small_img && (
                        <div style={{ textAlign: 'center' }}>
                            <h3>Ảnh Nhỏ</h3>
                            <Image
                                src={dataDetail.small_img}
                                alt="Ảnh nhỏ phim"
                                width={200}
                                height={300}
                                preview={{
                                    mask: 'Xem ảnh lớn hơn'
                                }}
                            />
                        </div>
                    )}
                    <br />
                    <p>Tiêu đề: {dataDetail.title}</p>
                    <br />
                    <p>Mô tả: {dataDetail.description}</p>
                    <br />
                    <p>Phân loại: {dataDetail.classify}</p>
                    <br />
                    <p>Đạo diễn: {dataDetail.director}</p>
                    <br />
                    <p>Thể loại: {dataDetail.genre}</p>
                    <br />
                    <p>Khởi chiếu: {formatDate(dataDetail.releaseDate)}</p>
                    <br />
                    <p>Thời gian: {dataDetail.duration} phút</p>
                    <br />
                    <p>Ngôn ngữ: {dataDetail.language}</p>
                    <br />
                </>
            ) : (
                <>
                    <p>Không có dữ liệu</p>
                </>
            )}
        </Drawer>
    );
};

export default ViewMovieDetail