import express from 'express';
import Booking from '../models/Booking.js';
import { createBooking, getBookings, getUserBookings } from '../api/booking.js';


const router = express.Router();

router.get('/', getBookings);
router.get('/user/:userId', getUserBookings);

router.post('/create', createBooking);

router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        const booking = await Booking.findOne({ id });
        if (!booking) {
            return res.status(404).json({
                message: 'Đặt vé không tồn tại'
            });
        }

        const result = await Booking.deleteOne({ id });
        
        if (result.deletedCount === 0) {
            return res.status(404).json({
                message: 'Không thể xóa đặt vé'
            });
        }

        res.status(200).json({
            message: 'Đặt vé đã được xóa thành công'
        });
    } catch (error) {
        console.error('Error deleting booking:', error);
        
        if (error.name === 'MongoError' || error.name === 'MongoNetworkError') {
            return res.status(500).json({
                message: 'Không thể kết nối đến cơ sở dữ liệu',
                error: error.message
            });
        }

        res.status(500).json({
            message: 'Lỗi khi xóa đặt vé',
            error: error.message
        });
    }
});

export default router;
