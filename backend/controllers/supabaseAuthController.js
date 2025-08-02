/**
 * 🔐 Supabase Auth Controller
 * 
 * Using Supabase built-in authentication instead of custom JWT
 */

const supabase = require('../supabase/client');

/**
 * 📝 User Registration with Supabase Auth
 */
const register = async (req, res) => {
  try {
    const { email, password, fullName } = req.body;

    // Validate required fields
    if (!email || !password || !fullName) {
      return res.status(400).json({
        success: false,
        message: 'Email, password, and full name are required 📝'
      });
    }

    // Use Supabase Auth to create user
    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        data: {
          full_name: fullName
        }
      }
    });

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }

    res.status(201).json({
      success: true,
      message: 'Account created successfully! Check your email for verification 🎉😭',
      data: {
        user: data.user,
        session: data.session
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create account 😢',
      error: error.message
    });
  }
};

/**
 * 🔑 User Login with Supabase Auth
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required 🔑'
      });
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password
    });

    if (error) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password 🚫'
      });
    }

    res.json({
      success: true,
      message: 'Login successful! Welcome back! 😭💪',
      data: {
        user: data.user,
        session: data.session,
        access_token: data.session.access_token
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed 😢',
      error: error.message
    });
  }
};

/**
 * 🚪 Logout with Supabase Auth
 */
const logout = async (req, res) => {
  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      throw error;
    }

    res.json({
      success: true,
      message: 'Logged out successfully! Take care of yourself! 😭👋'
    });

  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Logout failed 😢',
      error: error.message
    });
  }
};

/**
 * 👤 Get User Profile
 */
const getProfile = async (req, res) => {
  try {
    res.json({
      success: true,
      message: 'Profile retrieved successfully! 👤',
      data: req.user
    });

  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get profile 😢',
      error: error.message
    });
  }
};

module.exports = {
  register,
  login,
  logout,
  getProfile
};
