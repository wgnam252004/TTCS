import mongoose from 'mongoose';

const roomSchema = new mongoose.Schema({
    _id: {
        type: String,
        required: true
    },
    cinema_id: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    capacity: {
        type: Number,
        required: true
    },
    is_active: {
        type: Boolean,
        required: true
    }
}, {
    timestamps: true
});

export default mongoose.model('Room', roomSchema, 'rooms');
