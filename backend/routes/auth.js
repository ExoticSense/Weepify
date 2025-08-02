/**
 * 🔐 Authentication Routes
 * 
 * Routes for user registration, login, and profile management
 */

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticateToken } = require('../middleware/auth');

// 📝 POST /api/auth/register - User registration
router.post('/register', authController.register);

// 🔑 POST /api/auth/login - User login
router.post('/login', authController.login);

// 👤 GET /api/auth/profile - Get user profile (protected)
router.get('/profile', authenticateToken, authController.getProfile);

// ✏️ PUT /api/auth/profile - Update user profile (protected)
router.put('/profile', authenticateToken, authController.updateProfile);

// 🔒 PUT /api/auth/change-password - Change password (protected)
router.put('/change-password', authenticateToken, authController.changePassword);

// 🚪 POST /api/auth/logout - Logout (protected)
router.post('/logout', authenticateToken, authController.logout);

module.exports = router;
