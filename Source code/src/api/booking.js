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
            if (!token) {
                return res.status(401).json({
                    message: 'Token không hợp lệ'
                });
            }

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

        const showtime = await Showtime.findById(showtimeId);
        if (!showtime) {
            return res.status(404).json({
                message: 'Suất chiếu không tồn tại'
            });
        }


        const seatIds = seats.map(seat => {
            return typeof seat === 'string' ? seat : seat.seat_id;
        });

 
        const unavailableSeats = showtime.seats.filter(seat => 
            seatIds.includes(seat.seat_id) && seat.status !== 'available'
        );

        if (unavailableSeats.length > 0) {
            return res.status(400).json({
                message: 'Một số ghế đã được đặt',
                unavailableSeats: unavailableSeats.map(s => s.seat_id)
            });
        }

   
        const lastBooking = await Booking.findOne().sort({ id: -1 });
        let newId = 'B0001';
        if (lastBooking && lastBooking.id) {
            const currentId = parseInt(lastBooking.id.replace('B', ''));
            newId = `B${(currentId + 1).toString().padStart(4, '0')}`;
        }


        const booking = new Booking({
            id: newId,
            userId,
            showtimeId,
            showtimeDate: showtime.start_time,
            cinemaId: showtime.cinema_id,
            movie_id: showtime.movie_id,
            cinema_id: showtime.cinema_id,
            seats,
            totalAmount
        });

   
        await booking.save();

     
        try {
      
            showtime.seats.forEach(seat => {
                if (seatIds.includes(seat.seat_id)) {
                    seat.status = 'booked';
                }
            });

   
            if (!showtime.bookedSeats) {
                showtime.bookedSeats = [];
            }
            showtime.bookedSeats.push(...seatIds);

            await showtime.save();

        } catch (updateError) {
            console.error('Error updating showtime:', updateError);

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
        const bookings = await Booking.find();
        

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
        
        if (!userId) {
            return res.status(400).json({
                message: 'ID người dùng không hợp lệ'
            });
        }

        // Tìm tất cả booking của user
        const bookings = await Booking.find({ userId });

        if (!bookings || bookings.length === 0) {
            return res.status(200).json([]);
        }

        // Tạo một mảng để lưu kết quả
        const results = [];

        // Xử lý từng booking
        for (const booking of bookings) {
            try {
                // Lấy thông tin showtime
                const showtime = await Showtime.findById(booking.showtimeId);
                
                // Lấy thông tin movie
                const movie = showtime ? await Movie.findById(showtime.movie_id) : null;
                
                // Lấy thông tin cinema
                const cinema = showtime ? await Cinema.findById(showtime.cinema_id) : null;

                // Thêm vào kết quả
                results.push({
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
                    movieName: movie ? movie.title : 'Không xác định',
                    cinemaName: cinema ? cinema.name : 'Không xác định'
                });
            } catch (error) {
                console.error(`Error processing booking ${booking.id}:`, error);
            }
        }

        res.status(200).json(results);
    } catch (error) {
        console.error('Error fetching user bookings:', error);
        res.status(500).json({
            message: 'Lỗi khi lấy danh sách vé của người dùng',
            error: error.message
        });
    }
};

export { createBooking, getBookings, getUserBookings };