import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const BookingSchema = new Schema({
    id: {
        type: String,
        unique: true,
        required: true
    },
    userId: {
        type: String,
        required: true,
        ref: 'User'
    },
    showtimeId: {
        type: String,
        required: true,
        ref: 'Showtime'
    },
    showtimeDate: {
        type: Date,
        required: true
    },
    cinemaId: {
        type: String,
        required: true,
        ref: 'Cinema'
    },
    seats: [{
        type: String,
        required: true
    }],
    totalAmount: {
        type: Number,
        required: true
    },
    bookingDate: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

const Booking = model('Booking', BookingSchema);
export default Booking;
