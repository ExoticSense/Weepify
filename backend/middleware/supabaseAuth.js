/**
 * 🛡️ Supabase Auth Middleware
 * 
 * Protects routes using Supabase JWT tokens
 */

const supabase = require('../supabase/client');

/**
 * 🔐 Authenticate Supabase JWT Token
 */
const authenticateSupabaseToken = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access token required. Please log in. 🔑'
      });
    }

    // Verify token with Supabase
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(403).json({
        success: false,
        message: 'Invalid or expired token. Please log in again. 🚫'
      });
    }

    // Add user info to request object
    req.user = user;
    next();

  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({
      success: false,
      message: 'Authentication error 😢'
    });
  }
};

module.exports = {
  authenticateSupabaseToken
};
