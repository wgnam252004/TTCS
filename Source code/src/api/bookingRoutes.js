import express from 'express';
import { createBooking, getBookings } from './booking.js';

const bookingRouter = express.Router();

bookingRouter.post('/create', createBooking);
bookingRouter.get('/', getBookings);

export default bookingRouter;
