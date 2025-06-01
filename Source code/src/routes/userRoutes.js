import express from 'express';
import { 
    getAllUsers,
    deleteUser,
    addUser,
    updateUser,
    getUserById
} from '../api/user.js';

const router = express.Router();

// Get all users
router.get('/', getAllUsers);

// Get user by ID
router.get('/:id', getUserById);

// Add user
router.post('/', addUser);

// Update user
router.put('/:id', updateUser);

// Delete user
router.delete('/:id', deleteUser);

export default router;
