import express from 'express';
import {
    loginUser, 
    registerUser, 
    refreshAccessToken, 
    getProfile, 
    changePassword
} from '../controllers/authController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Register
router.post('/register', registerUser);

// Login
router.post('/login', loginUser);

// Refresh token
router.post('/refresh-token', refreshAccessToken);

// Profile
router.get('/profile', auth, getProfile);

// Change password
router.post('/change-password', auth, changePassword);

export default router;
