import express from 'express';
const router = express.Router();
import Room from '../models/Room.js';
import Cinema from '../models/Cinema.js';

// API lấy tất cả các phòng chiếu
router.get('/', async (req, res) => {
    try {
        const rooms = await Room.find()
            .sort({ name: 1 }); // Sắp xếp theo tên phòng
        res.json(rooms);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// API lấy tất cả các phòng chiếu của một rạp phim
router.get('/cinema/:cinemaId', async (req, res) => {
    try {
        const { cinemaId } = req.params;
        
        // Kiểm tra xem rạp phim có tồn tại không
        const cinema = await Cinema.findById(cinemaId);
        if (!cinema) {
            return res.status(404).json({
                message: 'Cinema not found'
            });
        }

        // Lấy các phòng chiếu của rạp phim này
        const rooms = await Room.find({ cinema_id: cinemaId })
            .sort({ name: 1 });
        
        res.json(rooms);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// API thêm mới phòng chiếu
router.post('/', async (req, res) => {
    try {
        const {
            _id,
            cinema_id,
            name,
            capacity,
            is_active
        } = req.body;

        // Kiểm tra các trường bắt buộc
        if (!cinema_id || !name || !capacity || typeof is_active !== 'boolean') {
            return res.status(400).json({
                message: 'Missing required fields',
                required_fields: ['cinema_id', 'name', 'capacity', 'is_active']
            });
        }

        // Kiểm tra xem rạp phim có tồn tại không
        const cinema = await Cinema.findById(cinema_id);
        if (!cinema) {
            return res.status(404).json({
                message: 'Cinema not found'
            });
        }

        // Tạo đối tượng phòng chiếu mới
        const room = new Room(req.body);
        
        // Lưu vào database
        const savedRoom = await room.save();
        
        res.status(201).json({
            message: 'Room added successfully',
            room: savedRoom
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// API chỉnh sửa phòng chiếu
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        // Kiểm tra xem phòng chiếu có tồn tại không
        const room = await Room.findById(id);
        if (!room) {
            return res.status(404).json({
                message: 'Room not found'
            });
        }

        // Nếu có thay đổi cinema_id, kiểm tra xem rạp phim mới có tồn tại không
        if (updateData.cinema_id) {
            const cinema = await Cinema.findById(updateData.cinema_id);
            if (!cinema) {
                return res.status(404).json({
                    message: 'New cinema not found'
                });
            }
        }

        // Cập nhật phòng chiếu
        const updatedRoom = await Room.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        );

        res.status(200).json({
            message: 'Room updated successfully',
            room: updatedRoom
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// API xóa phòng chiếu
// API lấy thông tin chi tiết của một phòng chiếu
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        const room = await Room.findById(id);
        
        if (!room) {
            return res.status(404).json({
                message: 'Room not found'
            });
        }
        
        // Nếu bạn muốn lấy thông tin rạp phim liên quan, có thể thêm API riêng để lấy
        res.json(room);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// API xóa phòng chiếu
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        // Tìm và xóa phòng chiếu
        const room = await Room.findByIdAndDelete(id);
        
        if (!room) {
            return res.status(404).json({
                message: 'Room not found'
            });
        }
        
        res.status(200).json({
            message: 'Room deleted successfully',
            room
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
