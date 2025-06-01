import mongoose from 'mongoose';

const movieSchema = new mongoose.Schema({
    _id: {
        type: String,
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    classify: {
        type: String,
        required: true
    },
    director: {
        type: String,
        required: true
    },
    genre: {
        type: String,
        required: true
    },
    releaseDate: {
        type: Date,
        required: true
    },
    duration: {
        type: Number,
        required: true
    },
    language: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    hero_img: {
        type: String,
    },
    small_img: {
        type: String,
        required: true
    },
    video_url: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

export default mongoose.model('Movie', movieSchema, 'Movie');
