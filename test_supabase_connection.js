// Test Supabase Connection
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://hbarpylljytrdijjcmix.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhiYXJweWxsanl0cmRpampjbWl4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA1ODY4MzYsImV4cCI6MjA2NjE2MjgzNn0.o_3fPqCDW-GnKKTr_gA-Hg5qarkWO_sNj76QVEQc95Q';

const supabase = createClient(supabaseUrl, supabaseKey);

console.log('🧪 Testing Supabase Connection...');

try {
  // Test basic connection
  const { data, error } = await supabase.auth.getSession();
  
  if (error) {
    console.error('❌ Connection failed:', error.message);
  } else {
    console.log('✅ Supabase connection successful!');
    console.log('📋 Next step: Run the database schema in Supabase SQL Editor');
    console.log('📁 Copy database/supabase_schema.sql to Supabase dashboard');
  }
} catch (err) {
  console.error('❌ Error:', err.message);
} 