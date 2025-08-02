 /**
 * 🛡️ Authentication Middleware
 * 
 * Protects routes by verifying JWT tokens
 */

const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production';

/**
 * 🔐 Authenticate JWT Token
 * Middleware to verify JWT token and add user info to request
 */
const authenticateToken = (req, res, next) => {
  // Get token from header
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access token required. Please log in. 🔑'
    });
  }

  // Verify token
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(403).json({
          success: false,
          message: 'Token expired. Please log in again. ⏰'
        });
      }
      
      return res.status(403).json({
        success: false,
        message: 'Invalid token. Please log in again. 🚫'
      });
    }

    // Add user info to request object
    req.user = user;
    next();
  });
};

/**
 * 🔓 Optional Authentication
 * Middleware that adds user info if token is present, but doesn't require it
 */
const optionalAuth = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token) {
    jwt.verify(token, JWT_SECRET, (err, user) => {
      if (!err) {
        req.user = user;
      }
    });
  }

  next();
};

module.exports = {
  authenticateToken,
  optionalAuth
};
