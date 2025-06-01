import express from 'express';
const router = express.Router();
import Movie from '../models/Movie.js';



// API lấy danh sách phim đang chiếu
router.get('/now-showing', async (req, res) => {
    try {
        const movies = await Movie.find({
            status: 'Phim đang chiếu',
            small_img: { $exists: true, $ne: null }, // Chỉ lấy phim có ảnh small_img
        });
        res.json(movies);
    } catch (error) {
        console.error('Error fetching now showing movies:', error);
        res.status(500).json({ message: 'Failed to fetch now showing movies' });
    }
});

// API lấy danh sách phim sắp chiếu
router.get('/coming-soon', async (req, res) => {
    try {
        const movies = await Movie.find({
            status: 'Phim sắp chiếu',
            small_img: { $exists: true, $ne: null }, // Chỉ lấy phim có ảnh small_img
        });
        res.json(movies);
    } catch (error) {
        console.error('Error fetching coming soon movies:', error);
        res.status(500).json({ message: 'Failed to fetch coming soon movies' });
    }
});

// API lấy danh sách tất cả các phim
router.get('/', async (req, res) => {
    try {
        const movies = await Movie.find();
        res.json(movies);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});



// API thêm phim mới
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

        // Kiểm tra các trường bắt buộc
        // Kiểm tra các trường bắt buộc
        const requiredFields = ['title', 'description', 'classify', 'director', 'genre', 'releaseDate', 'duration', 'language', 'status'];
        const missingFields = requiredFields.filter(field => !req.body[field]);
        
        if (missingFields.length > 0) {
            return res.status(400).json({
                message: 'Missing required fields',
                required_fields: missingFields
            });
        }

        // Kiểm tra định dạng ngày
        if (releaseDate) {
            const date = new Date(releaseDate);
            if (isNaN(date.getTime())) {
                return res.status(400).json({
                    message: 'Invalid date format',
                    field: 'releaseDate'
                });
            }
        }

        // Log the incoming data
        console.log('Received movie data:', req.body);

        try {
            // Tạo đối tượng phim mới
            const movie = new Movie(req.body);
            
            // Lưu vào database
            const savedMovie = await movie.save();
            
            res.status(201).json({
                message: 'Movie added successfully',
                movie: savedMovie
            });
        } catch (error) {
            console.error('Error saving movie:', error);
            // Check if it's a validation error
            if (error.name === 'ValidationError') {
                return res.status(400).json({
                    message: 'Validation failed',
                    errors: error.errors
                });
            }
            // Check if it's a duplicate key error
            if (error.code === 11000) {
                return res.status(400).json({
                    message: 'Duplicate movie ID',
                    field: '_id'
                });
            }
            // Return generic error
            throw error;
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// API tìm kiếm phim theo tiêu đề
// API xóa phim
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        // Tìm và xóa phim
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

// API tìm kiếm phim theo tiêu đề
// API lấy 5 bộ phim đang chiếu có ngày phát hành gần nhất và có ảnh hero_img
router.get('/recent', async (req, res) => {
    try {
        const currentDate = new Date();
        
        // Lấy 5 phim đang chiếu có ngày phát hành gần nhất và có ảnh hero_img
        const movies = await Movie.find({
            status: 'Phim đang chiếu',
            releaseDate: { $lte: currentDate },
            hero_img: { $exists: true, $ne: null } // Kiểm tra hero_img tồn tại và không null
        })
        .sort({ releaseDate: -1 }) // Sắp xếp giảm dần theo ngày phát hành
        .limit(5); // Giới hạn 5 phim
        
        res.json(movies);
    } catch (error) {
        console.error('Error fetching recent movies:', error);
        res.status(500).json({ message: 'Failed to fetch recent movies' });
    }
});

// API tìm kiếm phim theo tiêu đề
// API chỉnh sửa phim
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        // Kiểm tra xem phim có tồn tại không
        const movie = await Movie.findById(id);
        if (!movie) {
            return res.status(404).json({
                message: 'Movie not found'
            });
        }

        // Cập nhật phim
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

// API lấy 5 phim đang chiếu gần nhất
router.get('/recent', async (req, res) => {
    try {
        const currentDate = new Date();
        const movies = await Movie.find({
            status: 'Phim đang chiếu',
            releaseDate: { $lte: currentDate }
        })
        .sort({ releaseDate: -1 }) // Sắp xếp giảm dần theo ngày phát hành
        .limit(5); // Giới hạn 5 phim
        
        res.json(movies);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// API tìm kiếm phim theo tiêu đề
// API lấy thông tin chi tiết của một phim
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        // Tìm phim theo ID
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

// API tìm kiếm phim theo tiêu đề
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
