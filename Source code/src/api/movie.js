import express from 'express';
const router = express.Router();
import Movie from '../models/Movie.js';

// Endpoint để thêm dữ liệu thử nghiệm
router.post('/seed', async (req, res) => {
    try {
        const sampleMovie = {
            _id: "M0001",
            title: "PORORO: THÁM HIỂM ĐẠI DƯƠNG XANH",
            description: "Chú chim cánh cụt đáng yêu Pororo và những người bạn cùng nhau khám ph…",
            classify: "Phim phổ biến với mọi độ tuổi",
            director: "Yoon Ye-Wan",
            genre: "Family",
            releaseDate: new Date("2025-04-04"),
            duration: 71,
            language: "Phụ đề/Lồng tiếng",
            status: "Phim đang chiếu",
            hero_img: "https://res.cloudinary.com/djqx7zem1/image/upload/v1746847607/pororo-h…",
            small_img: "https://res.cloudinary.com/djqx7zem1/image/upload/v1746847607/pororo-s…",
            video_url: "rTsV2tzDv6Y"
        };
        
        const movie = new Movie(sampleMovie);
        await movie.save();
        res.json({ message: "Sample movie added successfully", movie });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// API lấy danh sách phim đang chiếu
router.get('/now-showing', async (req, res) => {
    try {
        const movies = await Movie.find({
            status: 'Phim đang chiếu',
            small_img: { $exists: true, $ne: null }, // Chỉ lấy phim có ảnh small_img
            releaseDate: { $lte: new Date() } // Chỉ lấy phim có ngày phát hành không quá ngày hiện tại
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
            releaseDate: { $gt: new Date() } // Chỉ lấy phim có ngày phát hành sau ngày hiện tại
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
        if (!title || !director || !genre || !releaseDate || !duration || !status || !hero_img || !small_img || !video_url) {
            return res.status(400).json({
                message: 'Missing required fields',
                required_fields: ['title', 'director', 'genre', 'releaseDate', 'duration', 'status', 'hero_img', 'small_img', 'video_url']
            });
        }

        // Tạo đối tượng phim mới
        const movie = new Movie(req.body);
        
        // Lưu vào database
        const savedMovie = await movie.save();
        
        res.status(201).json({
            message: 'Movie added successfully',
            movie: savedMovie
        });
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
