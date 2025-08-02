/**
 * 🧮 Weepify Calculator Utilities
 * 
 * Fun helper functions for calculating tear-related analytics!
 * These functions add some humor and interesting stats to the crying data.
 */

/**
 * 💧 Calculate estimated tear volume based on duration and intensity
 * 
 * @param {number} duration - Duration of crying in minutes
 * @param {string} intensity - Intensity level: 'low', 'moderate', or 'high'
 * @returns {number} Estimated tear volume in milliliters
 */
const calculateTearVolume = (duration, intensity) => {
  if (!duration || !intensity) return 0;
  
  // Tear rates in ml/min based on intensity
  const tearRates = { 
    low: 0.2, 
    moderate: 0.5, 
    high: 1.0 
  };
  
  const rate = tearRates[intensity.toLowerCase()] || 0.5;
  const tears_ml = duration * rate;
  
  return Math.round(tears_ml * 100) / 100; // Round to 2 decimal places
};

/**
 * 🌱 Calculate plants watered from tears
 * 1 ml = 0.01 plant watered
 */
const calculatePlantsWatered = (tears_ml) => {
  return Math.round(tears_ml * 0.01 * 100) / 100;
};

/**
 * 💦 Calculate water needed to rehydrate
 * waterToRehydrate = tears_ml * 1.5
 */
const calculateRehydrationWater = (tears_ml) => {
  return Math.round(tears_ml * 1.5 * 100) / 100;
};

/**
 * 📈 Calculate mood trend from crying logs
 * 
 * Analyzes recent crying sessions to determine if mood is improving
 * 
 * @param {Array} logs - Array of crying log objects
 * @returns {string} Mood trend: 'improving', 'stable', or 'declining'
 */
const calculateMoodTrend = (logs) => {
  if (!logs || logs.length < 2) return 'stable';
  
  // Sort logs by date (newest first)
  const sortedLogs = logs.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  
  // Take the last 5 sessions to analyze trend
  const recentLogs = sortedLogs.slice(0, Math.min(5, sortedLogs.length));
  
  // Convert mood to numeric values for trend analysis
  const moodValues = recentLogs.map(log => getMoodValue(log.mood));
  
  if (moodValues.length < 2) return 'stable';
  
  // Calculate average of first half vs second half
  const midPoint = Math.floor(moodValues.length / 2);
  const recentAvg = moodValues.slice(0, midPoint).reduce((a, b) => a + b, 0) / midPoint;
  const olderAvg = moodValues.slice(midPoint).reduce((a, b) => a + b, 0) / (moodValues.length - midPoint);
  
  const difference = recentAvg - olderAvg;
  
  if (difference > 0.5) return 'improving';
  if (difference < -0.5) return 'declining';
  return 'stable';
};

/**
 * 🎭 Convert mood string to numeric value for calculations
 * 
 * @param {string} mood - Mood string
 * @returns {number} Numeric value (higher = better mood)
 */
const getMoodValue = (mood) => {
  const moodMap = {
    'devastated': 1,
    'very sad': 2,
    'sad': 3,
    'upset': 4,
    'overwhelmed': 4,
    'frustrated': 4,
    'angry': 3,
    'disappointed': 3,
    'melancholy': 3,
    'neutral': 5,
    'relieved': 6,
    'content': 7,
    'happy': 8,
    'joyful': 9,
    'ecstatic': 10
  };
  
  return moodMap[mood.toLowerCase()] || 5; // Default to neutral
};

/**
 * 🏆 Calculate "Therapeutic Score"
 * 
 * A fun metric that suggests how therapeutic the crying sessions have been
 * 
 * @param {Array} logs - Array of crying log objects
 * @returns {number} Score from 0-100
 */
const calculateTherapeuticScore = (logs) => {
  if (!logs || logs.length === 0) return 0;
  
  let score = 0;
  
  // Base points for each session (crying is therapeutic!)
  score += logs.length * 5;
  
  // Bonus points for variety in reasons (processing different emotions)
  const reasons = [...new Set(logs.map(log => log.reason))];
  score += reasons.length * 3;
  
  // Bonus points for consistent sessions (regularity is good)
  if (logs.length >= 5) score += 10;
  if (logs.length >= 10) score += 15;
  
  // Bonus for including notes (self-reflection)
  const notesCount = logs.filter(log => log.notes && log.notes.trim().length > 0).length;
  score += notesCount * 2;
  
  // Cap at 100
  return Math.min(100, score);
};

/**
 * 📅 Get crying frequency stats
 * 
 * @param {Array} logs - Array of crying log objects
 * @returns {Object} Frequency statistics
 */
const getCryingFrequency = (logs) => {
  if (!logs || logs.length === 0) {
    return { daily: 0, weekly: 0, monthly: 0 };
  }
  
  const now = new Date();
  const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  
  const daily = logs.filter(log => new Date(log.created_at) > oneDayAgo).length;
  const weekly = logs.filter(log => new Date(log.created_at) > oneWeekAgo).length;
  const monthly = logs.filter(log => new Date(log.created_at) > oneMonthAgo).length;
  
  return { daily, weekly, monthly };
};

/**
 * 🎨 Generate a fun crying summary message
 * 
 * @param {Object} stats - Statistics object
 * @returns {string} Fun summary message
 */
const generateCryingSummary = (stats) => {
  const messages = [
    `You've produced ${stats.total_tear_volume_ml}ml of tears - that's like ${Math.round(stats.total_tear_volume_ml / 15)} eye drops! 💧`,
    `Your crying efficiency is ${stats.crying_efficiency} ml/min - you're getting better at this! 📈`,
    `With ${stats.total_sessions} sessions logged, you're building quite the emotional portfolio! 📊`,
    `Your therapeutic score of ${stats.therapeutic_score}/100 shows you're processing emotions like a pro! 🏆`
  ];
  
  return messages[Math.floor(Math.random() * messages.length)];
};

module.exports = {
  calculateTearVolume,
  calculatePlantsWatered,
  calculateRehydrationWater,
  calculateMoodTrend,
  getMoodValue,
  calculateTherapeuticScore,
  getCryingFrequency,
  generateCryingSummary
};
