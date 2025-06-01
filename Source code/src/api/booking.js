import Booking from '../models/Booking.js';
import Showtime from '../models/Showtime.js';
import Movie from '../models/Movie.js';
import Cinema from '../models/Cinema.js';
import jwt from 'jsonwebtoken';

const createBooking = async (req, res) => {
    try {
        const { showtimeId, seats, totalAmount } = req.body;
        const token = req.headers.authorization?.split(' ')[1];
        let userId;

        try {
            // Kiểm tra token
            if (!token) {
                return res.status(401).json({
                    message: 'Token không hợp lệ'
                });
            }

            // Xác thực token và lấy userId
            const decoded = jwt.verify(token, process.env.ACCESS_TOKEN);
            userId = decoded.userId;

            if (!userId) {
                return res.status(400).json({
                    message: 'Không tìm thấy ID người dùng'
                });
            }
        } catch (error) {
            console.error('Error verifying token:', error);
            return res.status(401).json({
                message: 'Token không hợp lệ'
            });
        }

        // Lấy thông tin suất chiếu
        const showtime = await Showtime.findById(showtimeId);
        if (!showtime) {
            return res.status(404).json({
                message: 'Suất chiếu không tồn tại'
            });
        }

        // Extract seat IDs từ seats array
        const seatIds = seats.map(seat => {
            return typeof seat === 'string' ? seat : seat.seat_id;
        });

        // Kiểm tra xem ghế đã được đặt chưa
        const unavailableSeats = showtime.seats.filter(seat => 
            seatIds.includes(seat.seat_id) && seat.status !== 'available'
        );

        if (unavailableSeats.length > 0) {
            return res.status(400).json({
                message: 'Một số ghế đã được đặt',
                unavailableSeats: unavailableSeats.map(s => s.seat_id)
            });
        }

        // Tạo ID mới cho booking
        const lastBooking = await Booking.findOne().sort({ id: -1 });
        let newId = 'B0001';
        if (lastBooking && lastBooking.id) {
            const currentId = parseInt(lastBooking.id.replace('B', ''));
            newId = `B${(currentId + 1).toString().padStart(4, '0')}`;
        }

        // Tạo booking mới
        const booking = new Booking({
            id: newId,
            userId,
            showtimeId,
            showtimeDate: showtime.start_time,
            cinemaId: showtime.cinema_id,
            seats,
            totalAmount
        });

        // Lưu booking vào database
        await booking.save();

        // Cách 1: Update trực tiếp bằng cách lấy document, modify và save
        try {
            // Update seat status
            showtime.seats.forEach(seat => {
                if (seatIds.includes(seat.seat_id)) {
                    seat.status = 'booked';
                }
            });

            // Add to bookedSeats array
            if (!showtime.bookedSeats) {
                showtime.bookedSeats = [];
            }
            showtime.bookedSeats.push(...seatIds);

            // Save the updated showtime
            await showtime.save();

        } catch (updateError) {
            console.error('Error updating showtime:', updateError);
            // Rollback booking nếu không thể update showtime
            await Booking.findByIdAndDelete(booking._id);
            return res.status(500).json({
                message: 'Không thể cập nhật trạng thái ghế'
            });
        }

        res.status(201).json({
            message: 'Đặt vé thành công',
            booking: {
                id: booking.id,
                userId,
                showtimeId,
                showtimeDate: showtime.start_time,
                cinemaId: showtime.cinema_id,
                seats,
                totalAmount,
                bookingDate: booking.bookingDate
            }
        });
    } catch (error) {
        console.error('Error creating booking:', error);
        res.status(500).json({
            message: 'Đã xảy ra lỗi khi đặt vé',
            error: error.message
        });
    }
};

const getBookings = async (req, res) => {
    try {
        // Lấy tất cả booking
        const bookings = await Booking.find();
        
        // Format lại dữ liệu để hiển thị tốt hơn
        const formattedBookings = bookings.map(booking => ({
            id: booking.id,
            userId: booking.userId,
            showtimeId: booking.showtimeId,
            showtimeDate: booking.showtimeDate,
            cinemaId: booking.cinemaId,
            seats: booking.seats,
            totalAmount: booking.totalAmount,
            bookingDate: booking.bookingDate,
            createdAt: booking.createdAt,
            updatedAt: booking.updatedAt
        }));

        res.status(200).json(formattedBookings);
    } catch (error) {
        console.error('Error fetching bookings:', error);
        res.status(500).json({
            message: 'Lỗi khi lấy danh sách đặt vé',
            error: error.message
        });
    }
};

const getUserBookings = async (req, res) => {
    try {
        const { userId } = req.params;
        
        // Lấy các booking của người dùng
        const bookings = await Booking.find({ userId })
            .populate({
                path: 'showtimeId',
                select: 'movie_id cinema_id',
                populate: [
                    {
                        path: 'movie_id',
                        select: 'title',
                        model: 'Movie'
                    },
                    {
                        path: 'cinema_id',
                        select: 'name',
                        model: 'Cinema'
                    }
                ]
            });
        
        // Format lại dữ liệu để hiển thị tốt hơn
        const formattedBookings = bookings.map(booking => ({
            id: booking.id,
            userId: booking.userId,
            showtimeId: booking.showtimeId,
            showtimeDate: booking.showtimeDate,
            cinemaId: booking.cinemaId,
            seats: booking.seats,
            totalAmount: booking.totalAmount,
            bookingDate: booking.bookingDate,
            createdAt: booking.createdAt,
            updatedAt: booking.updatedAt,
            ...booking.showtimeId,
            movieName: booking.showtimeId.movie_id ? booking.showtimeId.movie_id.title : 'Không xác định',
            cinemaName: booking.showtimeId.cinema_id ? booking.showtimeId.cinema_id.name : 'Không xác định'
        }));


        res.status(200).json(formattedBookings);
    } catch (error) {
        console.error('Error fetching user bookings:', error);
        res.status(500).json({
            message: 'Lỗi khi lấy danh sách vé của người dùng',
            error: error.message
        });
    }
};

export { createBooking, getBookings, getUserBookings };