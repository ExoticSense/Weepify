/**
 * 😭 Cry Logs Controller
 * 
 * This file contains all the logic for handling crying session requests.
 * Controllers are where the actual work happens when a route is called.
 */

const supabase = require('../supabase/client');
const { calculateTearVolume, calculateMoodTrend } = require('../utils/calculator');

// Validation helper
const validIntensityLevels = ['low', 'moderate', 'high'];

const validateIntensity = (intensity) => {
  if (intensity && !validIntensityLevels.includes(intensity.toLowerCase())) {
    return false;
  }
  return true;
};

/**
 * 📋 Get all crying sessions for a user
 * Fetches all crying sessions from Supabase database for the authenticated user
 */
const getAllCryLogs = async (req, res) => {
  try {
    const userId = req.user.userId;

    const { data, error } = await supabase
      .from('cry_logs')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false });

    if (error) {
      throw error;
    }

    res.json({
      success: true,
      message: 'Crying sessions retrieved successfully! 😭',
      data: data || [],
      count: data ? data.length : 0
    });
  } catch (error) {
    console.error('Error fetching cry logs:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch crying sessions 😢',
      error: error.message
    });
  }
};

/**
 * ➕ Create a new crying session
 * This will save a new crying session to the Supabase database
 */
const createCryLog = async (req, res) => {
  try {
    const { date, startTime, duration, moodAfter, reason, intensity } = req.body;

    // Validate required fields
    if (!date || !startTime || !duration || !moodAfter || !reason || !intensity) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required: date, startTime, duration, moodAfter, reason, and intensity 🤔'
      });
    }

    // Validate intensity
    if (!validateIntensity(intensity)) {
      return res.status(400).json({
        error: 'Invalid intensity level',
        message: 'Intensity must be: low, moderate, or high'
      });
    }

    // Validate duration is a positive number
    if (isNaN(duration) || duration <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Duration must be a positive number in minutes 🤔'
      });
    }

    // Validate and parse date
    let parsedDate;
    let formattedDate;
    try {
      parsedDate = new Date(date);
      
      if (isNaN(parsedDate.getTime())) {
        throw new Error('Invalid date');
      }
      
      formattedDate = parsedDate.toISOString().split('T')[0];
      
      // Validate date is not in the future
      const today = new Date();
      today.setHours(23, 59, 59, 999);
      if (parsedDate > today) {
        return res.status(400).json({
          success: false,
          message: 'Cannot log crying sessions for future dates 📅'
        });
      }
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: 'Invalid date format 📅'
      });
    }

    // Validate time format (HH:MM)
    const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (!timeRegex.test(startTime)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid time format. Please use HH:MM format (24-hour) ⏰'
      });
    }

    // Calculate tear volume based on your vision
    const tearRates = { low: 0.2, moderate: 0.5, high: 1.0 }; // ml/min
    const tears_ml = duration * tearRates[intensity.toLowerCase()];
    
    const newCryLog = {
      user_id: req.user.userId,
      date: formattedDate,
      start_time: startTime,
      duration: parseInt(duration),
      mood_after: moodAfter,
      reason: reason,
      intensity: intensity.toLowerCase(),
      tears_ml: Math.round(tears_ml * 100) / 100
    };

    // Insert into Supabase database
    const { data, error } = await supabase
      .from('cry_logs')
      .insert([newCryLog])
      .select();

    if (error) {
      throw error;
    }

    res.status(201).json({
      success: true,
      message: 'Crying session logged successfully! You\'re doing great! 💪😭',
      data: data[0]
    });
  } catch (error) {
    console.error('Error creating cry log:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to log crying session 😢',
      error: error.message
    });
  }
};

/**
 * 📊 Get crying statistics and analytics
 * Returns analytics for the crying history page
 */
const getCryingStats = async (req, res) => {
  try {
    const userId = req.user.userId;

    // Fetch all crying sessions from database for this user
    const { data: cryLogs, error } = await supabase
      .from('cry_logs')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false });

    if (error) {
      throw error;
    }

    if (!cryLogs || cryLogs.length === 0) {
      return res.json({
        success: true,
        message: 'No crying sessions found for statistics 📊',
        data: {
          lifetime_tears_ml: 0,
          plants_watered: 0,
          highest_streak: 0,
          total_sessions: 0,
          daily_stats: [],
          weekly_stats: [],
          monthly_stats: []
        }
      });
    }
    
    // Calculate lifetime tears
    const lifetimeTearsML = cryLogs.reduce((sum, log) => sum + (log.tears_ml || 0), 0);
    
    // Calculate plants watered (1 ml = 0.01 plant watered)
    const plantsWatered = Math.round(lifetimeTearsML * 0.01 * 100) / 100;
    
    // Calculate highest crying streak (consecutive days with crying sessions)
    const streak = calculateHighestStreak(cryLogs);
    
    // Generate chart data
    const dailyStats = generateDailyStats(cryLogs);
    const weeklyStats = generateWeeklyStats(cryLogs);
    const monthlyStats = generateMonthlyStats(cryLogs);

    const stats = {
      lifetime_tears_ml: Math.round(lifetimeTearsML * 100) / 100,
      plants_watered: plantsWatered,
      highest_streak: streak,
      total_sessions: cryLogs.length,
      daily_stats: dailyStats,
      weekly_stats: weeklyStats,
      monthly_stats: monthlyStats
    };

    res.json({
      success: true,
      message: 'Your crying analytics are ready! 📊😭',
      data: stats
    });
  } catch (error) {
    console.error('Error calculating stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to calculate crying statistics 😢',
      error: error.message
    });
  }
};

/**
 * 🔥 Calculate highest crying streak
 */
const calculateHighestStreak = (logs) => {
  if (!logs || logs.length === 0) return 0;
  
  // Group logs by date
  const dates = [...new Set(logs.map(log => log.date))].sort();
  
  let maxStreak = 0;
  let currentStreak = 0;
  let previousDate = null;
  
  for (const date of dates) {
    const currentDate = new Date(date);
    
    if (previousDate) {
      const dayDiff = (currentDate - previousDate) / (1000 * 60 * 60 * 24);
      if (dayDiff === 1) {
        currentStreak++;
      } else {
        currentStreak = 1;
      }
    } else {
      currentStreak = 1;
    }
    
    maxStreak = Math.max(maxStreak, currentStreak);
    previousDate = currentDate;
  }
  
  return maxStreak;
};

/**
 * 📈 Generate daily stats for charts
 */
const generateDailyStats = (logs) => {
  const last7Days = [];
  const today = new Date();
  
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateString = date.toISOString().split('T')[0];
    
    const dayLogs = logs.filter(log => log.date === dateString);
    const dayTearsML = dayLogs.reduce((sum, log) => sum + (log.tears_ml || 0), 0);
    
    last7Days.push({
      date: dateString,
      tears_ml: Math.round(dayTearsML * 100) / 100,
      sessions: dayLogs.length
    });
  }
  
  return last7Days;
};

/**
 * 📊 Generate weekly stats for charts
 */
const generateWeeklyStats = (logs) => {
  const last4Weeks = [];
  const today = new Date();
  
  for (let i = 3; i >= 0; i--) {
    const weekStart = new Date(today);
    weekStart.setDate(weekStart.getDate() - (i * 7) - weekStart.getDay());
    
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);
    
    const weekLogs = logs.filter(log => {
      const logDate = new Date(log.date);
      return logDate >= weekStart && logDate <= weekEnd;
    });
    
    const weekTearsML = weekLogs.reduce((sum, log) => sum + (log.tears_ml || 0), 0);
    
    last4Weeks.push({
      week_start: weekStart.toISOString().split('T')[0],
      week_end: weekEnd.toISOString().split('T')[0],
      tears_ml: Math.round(weekTearsML * 100) / 100,
      sessions: weekLogs.length
    });
  }
  
  return last4Weeks;
};

/**
 * 📅 Generate monthly stats for charts
 */
const generateMonthlyStats = (logs) => {
  const last6Months = [];
  const today = new Date();
  
  for (let i = 5; i >= 0; i--) {
    const monthStart = new Date(today.getFullYear(), today.getMonth() - i, 1);
    const monthEnd = new Date(today.getFullYear(), today.getMonth() - i + 1, 0);
    
    const monthLogs = logs.filter(log => {
      const logDate = new Date(log.date);
      return logDate >= monthStart && logDate <= monthEnd;
    });
    
    const monthTearsML = monthLogs.reduce((sum, log) => sum + (log.tears_ml || 0), 0);
    
    last6Months.push({
      month: monthStart.toISOString().split('T')[0].substring(0, 7), // YYYY-MM
      tears_ml: Math.round(monthTearsML * 100) / 100,
      sessions: monthLogs.length
    });
  }
  
  return last6Months;
};

/**
 * 🔍 Get a specific crying session by ID
 */
const getCryLogById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;
    
    const { data, error } = await supabase
      .from('cry_logs')
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({
          success: false,
          message: 'Crying session not found 🤔'
        });
      }
      throw error;
    }

    res.json({
      success: true,
      message: 'Crying session found! 😭',
      data: data
    });
  } catch (error) {
    console.error('Error fetching cry log:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch crying session 😢',
      error: error.message
    });
  }
};

/**
 * ✏️ Update a specific crying session
 */
const updateCryLog = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;
    const updates = req.body;

    // Validate intensity if provided
    if (updates.intensity && !validateIntensity(updates.intensity)) {
      return res.status(400).json({
        error: 'Invalid intensity level',
        message: 'Intensity must be: low, moderate, or high'
      });
    }

    // If duration or intensity is being updated, recalculate tear volume
    if (updates.duration || updates.intensity) {
      // First get the current record
      const { data: currentLog, error: fetchError } = await supabase
        .from('cry_logs')
        .select('duration, intensity')
        .eq('id', id)
        .eq('user_id', userId)
        .single();

      if (fetchError) {
        throw fetchError;
      }

      const newDuration = updates.duration || currentLog.duration;
      const newIntensity = updates.intensity || currentLog.intensity;
      updates.tear_volume = calculateTearVolume(newDuration, newIntensity);
    }

    const { data, error } = await supabase
      .from('cry_logs')
      .update(updates)
      .eq('id', id)
      .eq('user_id', userId)
      .select();

    if (error) {
      throw error;
    }

    if (!data || data.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Crying session not found 🤔'
      });
    }

    res.json({
      success: true,
      message: 'Crying session updated successfully! ✏️😭',
      data: data[0]
    });
  } catch (error) {
    console.error('Error updating cry log:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update crying session 😢',
      error: error.message
    });
  }
};

/**
 * 🗑️ Delete a specific crying session
 */
const deleteCryLog = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const { error } = await supabase
      .from('cry_logs')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (error) {
      throw error;
    }

    res.json({
      success: true,
      message: 'Crying session deleted successfully! 🗑️😭'
    });
  } catch (error) {
    console.error('Error deleting cry log:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete crying session 😢',
      error: error.message
    });
  }
};

/**
 * 📅 Get crying sessions by date
 * Returns all crying sessions for a specific date from database for the authenticated user
 */
const getCryLogsByDate = async (req, res) => {
  try {
    const { date } = req.params;
    const userId = req.user.userId;
    
    // Parse and validate date
    let parsedDate;
    let formattedDate;
    
    try {
      parsedDate = new Date(date);
      
      if (isNaN(parsedDate.getTime())) {
        throw new Error('Invalid date');
      }
      
      formattedDate = parsedDate.toISOString().split('T')[0];
      
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: 'Invalid date format from calendar 📅'
      });
    }

    // Query database for sessions on specific date for this user
    const { data: cryLogsForDate, error } = await supabase
      .from('cry_logs')
      .select('*')
      .eq('date', formattedDate)
      .eq('user_id', userId)
      .order('start_time', { ascending: true });

    if (error) {
      throw error;
    }

    res.json({
      success: true,
      message: `Found ${cryLogsForDate.length} crying session${cryLogsForDate.length !== 1 ? 's' : ''} for ${formattedDate} 📅😭`,
      data: cryLogsForDate || [],
      date: formattedDate,
      count: cryLogsForDate ? cryLogsForDate.length : 0
    });
  } catch (error) {
    console.error('Error fetching cry logs by date:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch crying sessions for this date 😢',
      error: error.message
    });
  }
};

module.exports = {
  getAllCryLogs,
  createCryLog,
  getCryingStats,
  getCryLogById,
  getCryLogsByDate,
  updateCryLog,
  deleteCryLog
};
