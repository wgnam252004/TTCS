import { Drawer } from "antd";
import React from 'react';
import { Image } from 'antd';

const ViewCinemaDetail = (props) => {
    const {
        dataDetail,
        setDataDetail,
        isDetailOpen,
        setIsDetailOpen
    } = props;

    return (
        <Drawer title="Chi tiết rạp phim"
            onClose={() => {
                setDataDetail(null);
                setIsDetailOpen(false);
            }}
            open={isDetailOpen}
            width={500}
        >
            {dataDetail ? (
                <>
                    {dataDetail.img && (
                        <div style={{ textAlign: 'center' }}>
                            <Image
                                src={dataDetail.img}
                                width={450}
                                height={200}
                                preview={{
                                    mask: 'Xem ảnh lớn hơn'
                                }}
                            />
                        </div>
                    )}
                    <br />
                    <p>Tên rạp: {dataDetail.name}</p>
                    <br />
                    <p>Địa chỉ: {dataDetail.address}</p>
                    <br />
                    <p>Số điện thoại: {dataDetail.phone}</p>
                    <br />
                    <p>Email: {dataDetail.email}</p>
                </>
            ) : (
                <>
                    <p>Không có dữ liệu</p>
                </>
            )}
        </Drawer>
    );
};

export default ViewCinemaDetail