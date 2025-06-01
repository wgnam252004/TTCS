import express from 'express';
const router = express.Router();
import Movie from '../models/Movie.js';



router.get('/now-showing', async (req, res) => {
    try {
        const movies = await Movie.find({
            status: 'Phim đang chiếu',
            small_img: { $exists: true, $ne: null }
        });
        res.json(movies);
    } catch (error) {
        console.error('Error fetching now showing movies:', error);
        res.status(500).json({ message: 'Failed to fetch now showing movies' });
    }
});

router.get('/coming-soon', async (req, res) => {
    try {
        const movies = await Movie.find({
            status: 'Phim sắp chiếu',
            small_img: { $exists: true, $ne: null }
        });
        res.json(movies);
    } catch (error) {
        console.error('Error fetching coming soon movies:', error);
        res.status(500).json({ message: 'Failed to fetch coming soon movies' });
    }
});

router.get('/', async (req, res) => {
    try {
        const movies = await Movie.find();
        res.json(movies);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});



router.post('/', async (req, res) => {
    try {
        const { 
            _id,
            title,
            description,
            classify,
            director,
            genre,
            releaseDate,
            duration,
            language,
            status,
            hero_img,
            small_img,
            video_url
        } = req.body;
        const requiredFields = ['title', 'description', 'classify', 'director', 'genre', 'releaseDate', 'duration', 'language', 'status'];
        const missingFields = requiredFields.filter(field => !req.body[field]);
        
        if (missingFields.length > 0) {
            return res.status(400).json({
                message: 'Missing required fields',
                required_fields: missingFields
            });
        }
        if (releaseDate) {
            const date = new Date(releaseDate);
            if (isNaN(date.getTime())) {
                return res.status(400).json({
                    message: 'Invalid date format',
                    field: 'releaseDate'
                });
            }
        }
        console.log('Received movie data:', req.body);
        try {
            const movie = new Movie(req.body);
            const savedMovie = await movie.save();
            res.status(201).json({
                message: 'Movie added successfully',
                movie: savedMovie
            });
        } catch (error) {
            console.error('Error saving movie:', error);
            if (error.name === 'ValidationError') {
                return res.status(400).json({
                    message: 'Validation failed',
                    errors: error.errors
                });
            }
            if (error.code === 11000) {
                return res.status(400).json({
                    message: 'Duplicate movie ID',
                    field: '_id'
                });
            }
            throw error;
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const movie = await Movie.findByIdAndDelete(id);
        if (!movie) {
            return res.status(404).json({
                message: 'Movie not found'
            });
        }
        res.status(200).json({
            message: 'Movie deleted successfully',
            movie
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/recent', async (req, res) => {
    try {
        const currentDate = new Date();
        const movies = await Movie.find({
            status: 'Phim đang chiếu',
            releaseDate: { $lte: currentDate },
            hero_img: { $exists: true, $ne: null }
        })
        .sort({ releaseDate: -1 })
        .limit(5);
        res.json(movies);
    } catch (error) {
        console.error('Error fetching recent movies:', error);
        res.status(500).json({ message: 'Failed to fetch recent movies' });
    }
});


router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        const movie = await Movie.findById(id);
        if (!movie) {
            return res.status(404).json({
                message: 'Movie not found'
            });
        }
        const updatedMovie = await Movie.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        );
        res.status(200).json({
            message: 'Movie updated successfully',
            movie: updatedMovie
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


router.get('/recent', async (req, res) => {
    try {
        const currentDate = new Date();
        const movies = await Movie.find({
            status: 'Phim đang chiếu',
            releaseDate: { $lte: currentDate }
        })
        .sort({ releaseDate: -1 }) 
        .limit(5); 
        
        res.json(movies);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
 
        const movie = await Movie.findById(id);
        
        if (!movie) {
            return res.status(404).json({
                message: 'Movie not found'
            });
        }
        
        res.json(movie);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


router.get('/search', async (req, res) => {
    try {
        const { title } = req.query;
        if (!title) {
            return res.status(400).json({ message: 'Title is required' });
        }
        const movies = await Movie.find({
            title: { $regex: title, $options: 'i' }
        });
        res.json(movies);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
