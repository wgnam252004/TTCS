import express from 'express';
const router = express.Router();
import Showtime from '../models/Showtime.js';


router.get('/by-date', async (req, res) => {
    try {
        const { date, movieId } = req.query;
        
   
        const searchDate = new Date(date);
        
  
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

     
        const query = {
            date: searchDate,
            is_active: true,
            start_time: {
                $gte: today,
                $lt: tomorrow
            }
        };

        if (movieId) {
            query.movie_id = movieId;
        }

        const showtimes = await Showtime.find(query)
            .populate('movie_id', 'title')
            .populate('cinema_id', 'name')
            .populate('room_id', 'name')
            .lean();

  
        const groupedShowtimes = showtimes.reduce((acc, showtime) => {
            const cinemaId = showtime.cinema_id._id;
            if (!acc[cinemaId]) {
                acc[cinemaId] = {
                    cinema_id: cinemaId,
                    cinema_name: showtime.cinema_id.name,
                    showtimes: []
                };
            }
            acc[cinemaId].showtimes.push({
                _id: showtime._id,
                movie_title: showtime.movie_id.title,
                start_time: showtime.start_time,
                room_name: showtime.room_id.name,
                base_price: showtime.base_price
            });
            return acc;
        }, {});

   
        const result = Object.values(groupedShowtimes);
        
        res.json(result);
    } catch (error) {
        console.error('Error fetching showtimes:', error);
        res.status(500).json({ message: 'Failed to fetch showtimes' });
    }
});

export default router;
