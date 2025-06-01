import express from 'express';
import authRoutes from './authRoutes.js';
import userRoutes from './userRoutes.js';
import bookingRoutes from './bookingRoutes.js';

const router = express.Router();

router.use('/auth', authRoutes);

router.use('/users', userRoutes);

router.use('/bookings', bookingRoutes);

export default router;
