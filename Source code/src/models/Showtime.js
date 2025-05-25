import mongoose from 'mongoose';

const seatSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true
    },
    row: {
        type: String,
        required: true
    },
    column: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: ['available', 'booked', 'locked']
    },
    price_factor: {
        type: Number,
        required: true
    }
});

const showtimeSchema = new mongoose.Schema({
    _id: {
        type: String,
        required: true
    },
    movie_id: {
        type: String,
        required: true,
        ref: 'Movie'
    },
    cinema_id: {
        type: String,
        required: true
    },
    room_id: {
        type: String,
        required: true,
        ref: 'Room'
    },
    date: {
        type: Date,
        required: true
    },
    start_time: {
        type: Date,
        required: true
    },
    end_time: {
        type: Date,
        required: true
    },
    base_price: {
        type: Number,
        required: true
    },
    seats: {
        type: [seatSchema],
        required: true
    },
    is_active: {
        type: Boolean,
        required: true,
        default: true
    }
}, {
    timestamps: true
});

export default mongoose.model('Showtime', showtimeSchema, 'showtimes');
