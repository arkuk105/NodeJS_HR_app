import express from 'express';
import { login, changePassword, getProfile } from '../controllers/authController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.post('/login', login);
router.post('/change-password', authenticate, changePassword);
router.get('/profile', authenticate, getProfile);

export default router;
