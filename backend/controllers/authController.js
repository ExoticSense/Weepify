/**
 * 🔐 Authentication Controller
 * 
 * Handles user registration, login, and JWT token management
 */

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const supabase = require('../supabase/client');

// JWT Secret (should be in environment variables)
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

/**
 * 📝 User Registration
 * Creates a new user account
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

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid email address 📧'
      });
    }

    // Validate password strength
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long 🔒'
      });
    }

    // Validate full name (at least 2 characters, no numbers)
    if (fullName.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Full name must be at least 2 characters long 👤'
      });
    }

    // Check if user already exists
    const { data: existingUser, error: checkError } = await supabase
      .from('users')
      .select('email')
      .eq('email', email.toLowerCase())
      .single();

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'User with this email already exists 👤'
      });
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create new user
    const newUser = {
      email: email.toLowerCase(),
      password_hash: hashedPassword,
      full_name: fullName.trim(),
      created_at: new Date().toISOString()
    };

    const { data: createdUser, error } = await supabase
      .from('users')
      .insert([newUser])
      .select('id, email, full_name, created_at')
      .single();

    if (error) {
      throw error;
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: createdUser.id, 
        email: createdUser.email 
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    res.status(201).json({
      success: true,
      message: 'Account created successfully! Welcome to Weepify! 🎉😭',
      data: {
        user: createdUser,
        token: token,
        expiresIn: JWT_EXPIRES_IN
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
 * 🔑 User Login
 * Authenticates user and returns JWT token
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required 🔑'
      });
    }

    // Find user by email
    const { data: user, error } = await supabase
      .from('users')
      .select('id, email, password_hash, full_name, created_at')
      .eq('email', email.toLowerCase())
      .single();

    if (error || !user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password 🚫'
      });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password 🚫'
      });
    }

    // Update last login
    await supabase
      .from('users')
      .update({ last_login: new Date().toISOString() })
      .eq('id', user.id);

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email 
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    // Remove password from response
    const { password_hash, ...userWithoutPassword } = user;

    res.json({
      success: true,
      message: 'Login successful! Welcome back! 😭💪',
      data: {
        user: userWithoutPassword,
        token: token,
        expiresIn: JWT_EXPIRES_IN
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
 * 👤 Get User Profile
 * Returns current user's profile information
 */
const getProfile = async (req, res) => {
  try {
    const userId = req.user.userId;

    const { data: user, error } = await supabase
      .from('users')
      .select('id, email, full_name, created_at, last_login')
      .eq('id', userId)
      .single();

    if (error || !user) {
      return res.status(404).json({
        success: false,
        message: 'User not found 🤔'
      });
    }

    res.json({
      success: true,
      message: 'Profile retrieved successfully! 👤',
      data: user
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

/**
 * ✏️ Update User Profile
 * Updates user's profile information
 */
const updateProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { fullName } = req.body;

    if (!fullName || fullName.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Full name is required and must be at least 2 characters long 👤'
      });
    }

    const updates = {
      full_name: fullName.trim()
    };

    const { data: updatedUser, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', userId)
      .select('id, email, full_name, created_at, last_login')
      .single();

    if (error) {
      throw error;
    }

    res.json({
      success: true,
      message: 'Profile updated successfully! ✏️👤',
      data: updatedUser
    });

  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update profile 😢',
      error: error.message
    });
  }
};

/**
 * 🔒 Change Password
 * Allows user to change their password
 */
const changePassword = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Current password and new password are required 🔒'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 6 characters long 🔒'
      });
    }

    // Get current user with password
    const { data: user, error } = await supabase
      .from('users')
      .select('password_hash')
      .eq('id', userId)
      .single();

    if (error || !user) {
      return res.status(404).json({
        success: false,
        message: 'User not found 🤔'
      });
    }

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password_hash);
    if (!isCurrentPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect 🚫'
      });
    }

    // Hash new password
    const saltRounds = 12;
    const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);

    // Update password
    const { error: updateError } = await supabase
      .from('users')
      .update({ password_hash: hashedNewPassword })
      .eq('id', userId);

    if (updateError) {
      throw updateError;
    }

    res.json({
      success: true,
      message: 'Password changed successfully! 🔒✅'
    });

  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to change password 😢',
      error: error.message
    });
  }
};

/**
 * 🚪 Logout
 * Provides logout confirmation (client should remove token)
 */
const logout = (req, res) => {
  res.json({
    success: true,
    message: 'Logged out successfully! Take care of yourself! 😭👋'
  });
};

module.exports = {
  register,
  login,
  getProfile,
  updateProfile,
  changePassword,
  logout
};
