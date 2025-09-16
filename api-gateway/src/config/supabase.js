const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Supabase configuration
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Helper function to mimic the pg query interface
const query = async (text, params = []) => {
  try {
    // Convert PostgreSQL-style queries to Supabase format
    // This is a simple conversion - you might need to adjust based on your queries
    console.log('Executing query:', text, 'with params:', params);
    
    // For now, return a mock response to test the connection
    return {
      rows: [],
      rowCount: 0
    };
  } catch (error) {
    console.error('Supabase query error:', error);
    throw error;
  }
};

module.exports = {
  supabase,
  query
}; 