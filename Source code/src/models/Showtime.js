// models/Showtime.js
import mongoose from 'mongoose';

const seatSchema = new mongoose.Schema({
    seat_id: { type: String, required: true },
    row: { type: String, required: true },
    column: { type: Number, required: true },
    status: { type: String, enum: ['available', 'booked', 'reserved'], default: 'available' },
    price_factor: { type: Number, default: 1 }
});

const showtimeSchema = new mongoose.Schema({
    _id: { type: String },
    movie_id: { type: String, required: true },
    cinema_id: { type: String, required: true },
    room_id: { type: String, required: true },
    start_time: { type: Date, required: true },
    end_time: { type: Date, required: true },
    date: { type: String, required: true },
    base_price: { type: Number, required: true },
    seats: [seatSchema], 
    bookedSeats: [{ type: String }],
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
    expireAt: { type: Date }
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

const Showtime = mongoose.model('Showtime', showtimeSchema);
export default Showtime;