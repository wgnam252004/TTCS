import express from 'express';
import  {userRegistration, userLogin, userPasswordForget, userPasswordReset, userVerifyEmail, userLogout } from '../api/user.js';
import authMiddleware from '../middleware/authMiddleware.js';

const authRouter = express.Router();

authRouter.post('/register', userRegistration);
authRouter.post('/login', userLogin);
authRouter.post('/forget-password', userPasswordForget);
authRouter.post('/reset-password/:token', userPasswordReset);
authRouter.get('/verify-email/:token', userVerifyEmail);
authRouter.post('/logout', authMiddleware, userLogout);






export default authRouter;