/**
 * 🗄️ Supabase Client Configuration
 * 
 * This file sets up the connection to Supabase (our database).
 * Make sure to add your Supabase URL and key to the .env file!
 */

const { createClient } = require('@supabase/supabase-js');

// Get environment variables
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

// Validate environment variables
if (!supabaseUrl || !supabaseKey || supabaseUrl.includes('your_supabase') || supabaseKey.includes('your_supabase')) {
  console.warn('⚠️  Supabase credentials not found or not configured in environment variables.');
  console.warn('   Make sure to add SUPABASE_URL and SUPABASE_ANON_KEY to your .env file');
  console.warn('   For now, the app will work with mock data only.');
}

// Create Supabase client
let supabase = null;

if (supabaseUrl && supabaseKey && !supabaseUrl.includes('your_supabase') && !supabaseKey.includes('your_supabase')) {
  try {
    supabase = createClient(supabaseUrl, supabaseKey);
    console.log('✅ Supabase client initialized successfully!');
  } catch (error) {
    console.error('❌ Failed to initialize Supabase client:', error.message);
  }
} else {
  // Create a mock client for development
  supabase = {
    from: () => ({
      select: () => ({ data: [], error: null }),
      insert: () => ({ data: [], error: null }),
      update: () => ({ data: [], error: null }),
      delete: () => ({ error: null })
    }),
    auth: {
      signUp: () => ({ data: null, error: null }),
      signIn: () => ({ data: null, error: null }),
      signOut: () => ({ error: null })
    }
  };
  console.log('🔧 Using mock Supabase client for development');
}

/**
 * 📊 Database Schema Information (for reference)
 * 
 * When you set up your Supabase database, create a table called 'cry_logs' with these columns:
 * 
 * cry_logs:
 * - id (int8, primary key, auto-increment)
 * - user_id (uuid, foreign key to auth.users)
 * - mood (text) - e.g., "sad", "overwhelmed", "happy", "angry"
 * - reason (text) - e.g., "work stress", "movie", "onions", "joy"
 * - duration (int4) - duration in minutes
 * - intensity (int4) - scale of 1-10
 * - notes (text, nullable) - optional user notes
 * - tear_volume (float8, nullable) - calculated tear volume in ml
 * - created_at (timestamptz, default now())
 * - updated_at (timestamptz, default now())
 * 
 * Don't forget to set up Row Level Security (RLS) policies!
 */

module.exports = supabase;
