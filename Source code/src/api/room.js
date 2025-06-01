import express from 'express';
const router = express.Router();
import Room from '../models/Room.js';
import Cinema from '../models/Cinema.js';

router.get('/', async (req, res) => {
    try {
        const rooms = await Room.find()
            .sort({ name: 1 });
        res.json(rooms);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/cinema/:cinemaId', async (req, res) => {
    try {
        const { cinemaId } = req.params;
        const cinema = await Cinema.findById(cinemaId);
        if (!cinema) {
            return res.status(404).json({
                message: 'Cinema not found'
            });
        }
        const rooms = await Room.find({ cinema_id: cinemaId })
            .sort({ name: 1 });
        res.json(rooms);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const {
            _id,
            cinema_id,
            name,
            capacity,
            is_active
        } = req.body;
        if (!cinema_id || !name || !capacity || typeof is_active !== 'boolean') {
            return res.status(400).json({
                message: 'Missing required fields',
                required_fields: ['cinema_id', 'name', 'capacity', 'is_active']
            });
        }
        const cinema = await Cinema.findById(cinema_id);
        if (!cinema) {
            return res.status(404).json({
                message: 'Cinema not found'
            });
        }
        const room = new Room(req.body);
        const savedRoom = await room.save();
        res.status(201).json({
            message: 'Room added successfully',
            room: savedRoom
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        const room = await Room.findById(id);
        if (!room) {
            return res.status(404).json({
                message: 'Room not found'
            });
        }
        if (updateData.cinema_id) {
            const cinema = await Cinema.findById(updateData.cinema_id);
            if (!cinema) {
                return res.status(404).json({
                    message: 'New cinema not found'
                });
            }
        }
        const updatedRoom = await Room.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        );
        res.status(200).json({
            message: 'Room updated successfully',
            room: updatedRoom
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const room = await Room.findById(id);
        if (!room) {
            return res.status(404).json({
                message: 'Room not found'
            });
        }
        res.json(room);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const room = await Room.findByIdAndDelete(id);
        if (!room) {
            return res.status(404).json({
                message: 'Room not found'
            });
        }
        res.status(200).json({
            message: 'Room deleted successfully',
            room
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
