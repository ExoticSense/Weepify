/**
 * 🚀 Weepify Backend - Main Entry Point
 * 
 * A fun web app that tracks crying sessions and shows analytics!
 * This is the main server file that sets up Express and connects all routes.
 */

const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Import routes
const authRoutes = require('./routes/auth');
const cryLogsRoutes = require('./routes/cryLogs');

// Create Express app
const app = express();
const PORT = process.env.PORT || 3001;

// 🔧 Middleware setup
app.use(cors()); // Enable CORS for frontend requests
app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// 📝 Request logging middleware (helpful for debugging)
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// 🛣️ Routes
app.use('/api/auth', authRoutes);
app.use('/api/crylogs', cryLogsRoutes);

// 🏠 Welcome route
app.get('/', (req, res) => {
  res.json({
    message: '😭 Welcome to Weepify API! Ready to track those tears! 💧',
    version: '1.0.0',
    endpoints: {
      'POST /api/auth/register': 'User registration',
      'POST /api/auth/login': 'User login',
      'GET /api/auth/profile': 'Get user profile (protected)',
      'PUT /api/auth/profile': 'Update user profile (protected)',
      'PUT /api/auth/change-password': 'Change password (protected)',
      'POST /api/auth/logout': 'User logout (protected)',
      'GET /api/crylogs': 'Get all crying sessions (protected)',
      'POST /api/crylogs': 'Log a new crying session (protected)',
      'GET /api/crylogs/stats': 'Get crying statistics (protected)',
      'GET /api/crylogs/date/:date': 'Get sessions by date (protected)',
      'GET /api/crylogs/:id': 'Get specific session (protected)',
      'PUT /api/crylogs/:id': 'Update session (protected)',
      'DELETE /api/crylogs/:id': 'Delete session (protected)'
    }
  });
});

// 🚫 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    message: 'The endpoint you are looking for does not exist 🤔'
  });
});

// 🔥 Error handling middleware
app.use((error, req, res, next) => {
  console.error('Server Error:', error);
  res.status(500).json({
    error: 'Internal Server Error',
    message: 'Something went wrong on our end 😅'
  });
});

// 🚀 Start the server
app.listen(PORT, () => {
  console.log(`🎉 Weepify Backend is running on port ${PORT}`);
  console.log(`🌐 Visit: http://localhost:${PORT}`);
  console.log(`📊 API Base URL: http://localhost:${PORT}/api`);
});

module.exports = app;
