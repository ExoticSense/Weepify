/**
 * 😭 Cry Logs Routes
 * 
 * This file defines all the API endpoints for crying sessions.
 * Routes are the URLs that clients can hit to interact with our API.
 * All routes are protected and require authentication.
 */

const express = require('express');
const router = express.Router();
const cryLogsController = require('../controllers/cryLogsController');
const { authenticateToken } = require('../middleware/auth');

// Apply authentication middleware to all routes
router.use(authenticateToken);

// 📋 GET /api/crylogs - Get all crying sessions for authenticated user
router.get('/', cryLogsController.getAllCryLogs);

// ➕ POST /api/crylogs - Create a new crying session for authenticated user
router.post('/', cryLogsController.createCryLog);

// 📊 GET /api/crylogs/stats - Get crying statistics and analytics for authenticated user
router.get('/stats', cryLogsController.getCryingStats);

// 📅 GET /api/crylogs/date/:date - Get crying sessions by date for authenticated user
router.get('/date/:date', cryLogsController.getCryLogsByDate);

// 🔍 GET /api/crylogs/:id - Get a specific crying session by ID for authenticated user
router.get('/:id', cryLogsController.getCryLogById);

// ✏️ PUT /api/crylogs/:id - Update a specific crying session for authenticated user
router.put('/:id', cryLogsController.updateCryLog);

// 🗑️ DELETE /api/crylogs/:id - Delete a specific crying session for authenticated user
router.delete('/:id', cryLogsController.deleteCryLog);

module.exports = router;
