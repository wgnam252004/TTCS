import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import Movie from './models/Movie.js';
import cookieParser from 'cookie-parser';
import './db.js'; // Import file cấu hình MongoDB
import authRouter from './routes/authRoutes.js';


dotenv.config();

const app = express();

// Middleware
app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: [
        "Content-Type",
        "Authorization"
    ]
}));
app.use(express.json());
app.use(cookieParser())

app.use('/api/v1/auth', authRouter);



// Connect to MongoDB
// Sử dụng mongoose đã được cấu hình trong file db.js
// Không cần gọi connect ở đây vì nó đã được gọi trong file db.js

// Routes
import movieRoutes from './api/movie.js';
import cinemaRoutes from './api/cinema.js';
import roomRoutes from './api/room.js';
import showtimeRoutes from './api/showtime.js';
import cinemaShowtimesRoutes from './api/cinemaShowtimes.js';
import userRoutes from './routes/userRoutes.js';



app.use('/api/movies', movieRoutes);
app.use('/api/cinemas', cinemaRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/showtimes', showtimeRoutes);
app.use('/api/cinemaShowtimes', cinemaShowtimesRoutes);
app.use('/api/users', userRoutes);

// Booking routes
import bookingRoutes from './routes/bookingRoutes.js';
app.use('/api/bookings', bookingRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
    console.log(`Server is running on port ${PORT}`);
    
});
