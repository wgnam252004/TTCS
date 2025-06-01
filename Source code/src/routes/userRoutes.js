import express from 'express';
import { 
    getAllUsers,
    deleteUser,
    addUser,
    updateUser,
    getUserById
} from '../api/user.js';

const router = express.Router();

router.get('/', getAllUsers);

router.get('/:id', getUserById);

router.post('/', addUser);

router.put('/:id', updateUser);

router.delete('/:id', deleteUser);

export default router;
