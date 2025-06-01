import express from 'express';
const router = express.Router();
import Showtime from '../models/Showtime.js';
import Movie from '../models/Movie.js';
import Cinema from '../models/Cinema.js';
import Room from '../models/Room.js';

// API lấy tất cả các giờ chiếu
router.get('/', async (req, res) => {
    try {
        const showtimes = await Showtime.find()
            .populate('movie_id', 'title')
            .populate('room_id', 'name')
            .sort({ start_time: 1 });
        res.json(showtimes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// API lấy tất cả các giờ chiếu của phim nhất định trong tất cả các rạp
router.get('/movie/:movieId', async (req, res) => {
    try {
        const { movieId } = req.params;

        // Kiểm tra xem phim có tồn tại không
        const movie = await Movie.findById(movieId);
        if (!movie) {
            return res.status(404).json({
                message: 'Movie not found'
            });
        }

        // Lấy các giờ chiếu của phim này
        const showtimes = await Showtime.find({ movie_id: movieId })
            .populate('room_id', 'name')
            .sort({ start_time: 1 });

        res.json(showtimes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// API lấy tất cả các giờ chiếu của rạp phim nhất định trong tất cả các phim
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

        // Lấy các giờ chiếu của rạp phim này
        const showtimes = await Showtime.find({ cinema_id: cinemaId })
            .populate('movie_id', 'title')
            .populate('room_id', 'name')
            .sort({ start_time: 1 });

        res.json(showtimes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// API thêm mới giờ chiếu
router.post('/', async (req, res) => {
    try {
        const {
            _id,
            movie_id,
            cinema_id,
            room_id,
            date,
            start_time,
            end_time,
            base_price,
            seats
        } = req.body;

        // Kiểm tra các trường bắt buộc
        if (!movie_id || !cinema_id || !room_id || !date || !start_time || !end_time || !base_price || !seats) {
            return res.status(400).json({
                message: 'Missing required fields',
                required_fields: ['movie_id', 'cinema_id', 'room_id', 'date', 'start_time', 'end_time', 'base_price', 'seats']
            });
        }

        // Kiểm tra xem phim có tồn tại không
        const movie = await Movie.findById(movie_id);
        if (!movie) {
            return res.status(404).json({
                message: 'Movie not found'
            });
        }

        // Kiểm tra xem rạp phim có tồn tại không
        const cinema = await Cinema.findById(cinema_id);
        if (!cinema) {
            return res.status(404).json({
                message: 'Cinema not found'
            });
        }

        // Kiểm tra xem phòng chiếu có tồn tại và thuộc rạp phim này không
        const room = await Room.findById(room_id);
        if (!room || room.cinema_id !== cinema_id) {
            return res.status(404).json({
                message: 'Room not found or does not belong to this cinema'
            });
        }

        // Kiểm tra xem giờ chiếu có bị trùng không
        const existingShowtime = await Showtime.findOne({
            room_id: room_id,
            start_time: {
                $gte: start_time,
                $lt: end_time
            },
            end_time: {
                $gt: start_time,
                $lte: end_time
            }
        });

        if (existingShowtime) {
            return res.status(400).json({
                message: 'Showtime overlaps with existing showtime'
            });
        }

        // Tạo đối tượng giờ chiếu mới
        const showtime = new Showtime(req.body);

        // Lưu vào database
        const savedShowtime = await showtime.save();

        res.status(201).json({
            message: 'Showtime added successfully',
            showtime: savedShowtime
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// API chỉnh sửa giờ chiếu
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        // Kiểm tra xem giờ chiếu có tồn tại không
        const showtime = await Showtime.findById(id);
        if (!showtime) {
            return res.status(404).json({
                message: 'Showtime not found'
            });
        }

        // Nếu có thay đổi movie_id, cinema_id, room_id, kiểm tra xem chúng có tồn tại không
        if (updateData.movie_id) {
            const movie = await Movie.findById(updateData.movie_id);
            if (!movie) {
                return res.status(404).json({
                    message: 'Movie not found'
                });
            }
        }

        if (updateData.cinema_id) {
            const cinema = await Cinema.findById(updateData.cinema_id);
            if (!cinema) {
                return res.status(404).json({
                    message: 'Cinema not found'
                });
            }
        }

        if (updateData.room_id) {
            const room = await Room.findById(updateData.room_id);
            if (!room || (updateData.cinema_id && room.cinema_id !== updateData.cinema_id)) {
                return res.status(404).json({
                    message: 'Room not found or does not belong to this cinema'
                });
            }
        }

        // Kiểm tra xem giờ chiếu có bị trùng không (nếu thay đổi thời gian)
        if (updateData.start_time || updateData.end_time) {
            const existingShowtime = await Showtime.findOne({
                _id: { $ne: id }, // Bỏ qua bản ghi hiện tại
                room_id: showtime.room_id,
                start_time: {
                    $gte: updateData.start_time || showtime.start_time,
                    $lt: updateData.end_time || showtime.end_time
                },
                end_time: {
                    $gt: updateData.start_time || showtime.start_time,
                    $lte: updateData.end_time || showtime.end_time
                }
            });

            if (existingShowtime) {
                return res.status(400).json({
                    message: 'Showtime overlaps with existing showtime'
                });
            }
        }

        // Cập nhật giờ chiếu
        const updatedShowtime = await Showtime.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        );

        res.status(200).json({
            message: 'Showtime updated successfully',
            showtime: updatedShowtime
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// API xóa giờ chiếu
// API lấy thông tin chi tiết của một giờ chiếu
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const showtime = await Showtime.findById(id)
            .populate('movie_id', 'title')
            .populate('room_id', 'name')
            .populate('cinema_id', 'name');

        if (!showtime) {
            return res.status(404).json({
                message: 'Showtime not found'
            });
        }

        res.json(showtime);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// API xóa giờ chiếu
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // Tìm và xóa giờ chiếu
        const showtime = await Showtime.findByIdAndDelete(id);

        if (!showtime) {
            return res.status(404).json({
                message: 'Showtime not found'
            });
        }

        res.status(200).json({
            message: 'Showtime deleted successfully',
            showtime
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
