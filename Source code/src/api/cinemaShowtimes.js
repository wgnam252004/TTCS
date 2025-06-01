import { Router } from 'express';
import Showtime from '../models/Showtime.js';
import Movie from '../models/Movie.js';

const router = Router();

router.get('/cinema/:cinemaId', async (req, res) => {
    try {
        const { cinemaId } = req.params;
        const { date } = req.query;
        const today = date ? new Date(date) : new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const showtimes = await Showtime.find({
            cinema_id: cinemaId,
            start_time: { $gte: today, $lt: tomorrow }
        })
        .sort({ start_time: 1 })
        .lean();
        const movies = await Promise.all(
            showtimes.map(async (showtime) => {
                try {
                    const movie = await Movie.findById(showtime.movie_id);
                    return movie;
                } catch (error) {
                    return null;
                }
            })
        );
        const showtimesWithMovies = showtimes.map((showtime, index) => ({
            ...showtime,
            movie: movies[index]
        })).filter(showtime => showtime.movie !== null);
        res.json(showtimesWithMovies);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
