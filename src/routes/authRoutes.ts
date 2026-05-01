import { Router } from 'express';
import { signIn, signUp, forgotPassword, getMe } from '../controller/authController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = Router();

router.post('/signup', signUp);
router.post('/signin', signIn);
router.post('/forgot-password', forgotPassword);
router.get('/me', authMiddleware, getMe);

export default router;
