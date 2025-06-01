import express from 'express';
const router = express.Router();
import Cinema from '../models/Cinema.js';

router.get('/', async (req, res) => {
    try {
        const cinemas = await Cinema.find();
        res.json(cinemas);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const { 
            _id,
            name,
            address,
            phone,
            email,
            img
        } = req.body;
        const requiredFields = ['name', 'address', 'phone', 'email', 'img'];
        const missingFields = requiredFields.filter(field => !req.body[field]);
        
        if (missingFields.length > 0) {
            return res.status(400).json({
                message: 'Missing required fields',
                required_fields: missingFields
            });
        }
        if (!_id.startsWith('C') || _id.length !== 5) {
            return res.status(400).json({
                message: 'ID không đúng định dạng. ID phải bắt đầu bằng C và có 5 ký tự (ví dụ: C0001)'
            });
        }
        console.log('Received cinema data:', req.body);
        try {
            const cinema = new Cinema(req.body);
            const savedCinema = await cinema.save();
            res.status(201).json({
                message: 'Cinema added successfully',
                cinema: savedCinema
            });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        const cinema = await Cinema.findById(id);
        if (!cinema) {
            return res.status(404).json({
                message: 'Cinema not found'
            });
        }
        const updatedCinema = await Cinema.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        );
        res.status(200).json({
            message: 'Cinema updated successfully',
            cinema: updatedCinema
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const cinema = await Cinema.findById(id);
        if (!cinema) {
            return res.status(404).json({
                message: 'Cinema not found'
            });
        }
        res.json(cinema);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const cinema = await Cinema.findByIdAndDelete(id);
        if (!cinema) {
            return res.status(404).json({
                message: 'Cinema not found'
            });
        }
        res.status(200).json({
            message: 'Cinema deleted successfully',
            cinema
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
