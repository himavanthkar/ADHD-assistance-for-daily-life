-- NeuroBoost Supabase Schema
-- ADHD Productivity Platform Database

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "vector";

-- Users table with ADHD-specific fields
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  display_name TEXT,
  avatar_url TEXT,
  adhd_type TEXT CHECK (adhd_type IN ('inattentive', 'hyperactive', 'combined')),
  is_admin BOOLEAN DEFAULT FALSE,
  subscription TEXT DEFAULT 'free',
  preferences JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tasks table with ADHD optimization
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  type TEXT DEFAULT 'personal', -- personal, work, wellness, learning
  energy_required TEXT DEFAULT 'medium' CHECK (energy_required IN ('low', 'medium', 'high')),
  difficulty TEXT DEFAULT 'medium' CHECK (difficulty IN ('easy', 'medium', 'hard')),
  estimated_minutes INTEGER,
  done BOOLEAN DEFAULT FALSE,
  date DATE NOT NULL,
  source TEXT DEFAULT 'manual', -- manual, voice, ai
  tags TEXT[] DEFAULT '{}',
  priority INTEGER DEFAULT 3, -- 1-5 scale
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Mood tracking for real-time theme changes
CREATE TABLE moods (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  mood TEXT NOT NULL CHECK (mood IN ('calm', 'energetic', 'focused', 'stressed', 'happy', 'neutral', 'overwhelmed', 'frustrated', 'anxious')),
  confidence FLOAT DEFAULT 0.5 CHECK (confidence >= 0 AND confidence <= 1),
  context TEXT,
  source TEXT DEFAULT 'manual', -- manual, voice, ai_detection, pattern_analysis
  triggers TEXT[],
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- Voice notes and transcriptions
CREATE TABLE voice_notes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  audio_url TEXT,
  source TEXT DEFAULT 'voice',
  tags TEXT[] DEFAULT '{}',
  searchable TSVECTOR GENERATED ALWAYS AS (to_tsvector('english', text)) STORED,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- CBT and focus sessions
CREATE TABLE focus_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  session_type TEXT DEFAULT 'pomodoro', -- pomodoro, cbt, meditation
  duration_minutes INTEGER NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  mood_before TEXT,
  mood_after TEXT,
  notes TEXT,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- Analytics and insights
CREATE TABLE analytics_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  event_type TEXT NOT NULL, -- task_completed, mood_changed, voice_command, login
  event_data JSONB NOT NULL,
  session_id TEXT,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- AI conversation history
CREATE TABLE ai_conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  agent_type TEXT NOT NULL, -- mood_agent, task_agent, focus_agent, motivate_agent
  query TEXT NOT NULL,
  response JSONB NOT NULL,
  confidence FLOAT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User goals and achievements
CREATE TABLE user_goals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  target_date DATE,
  progress FLOAT DEFAULT 0 CHECK (progress >= 0 AND progress <= 1),
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Gamification: XP and achievements
CREATE TABLE user_achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  achievement_type TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  xp_awarded INTEGER DEFAULT 0,
  unlocked_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_tasks_user_date ON tasks(user_id, date);
CREATE INDEX idx_tasks_done ON tasks(done, date);
CREATE INDEX idx_moods_user_timestamp ON moods(user_id, timestamp DESC);
CREATE INDEX idx_voice_notes_search ON voice_notes USING GIN(searchable);
CREATE INDEX idx_analytics_user_event ON analytics_events(user_id, event_type, timestamp);
CREATE INDEX idx_focus_sessions_user ON focus_sessions(user_id, started_at DESC);

-- Row Level Security (RLS) policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE moods ENABLE ROW LEVEL SECURITY;
ALTER TABLE voice_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE focus_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;

-- Users can only see their own data
CREATE POLICY "Users can view own profile" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can view own tasks" ON tasks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own tasks" ON tasks FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own tasks" ON tasks FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own tasks" ON tasks FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own moods" ON moods FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own moods" ON moods FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own voice notes" ON voice_notes FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own voice notes" ON voice_notes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own voice notes" ON voice_notes FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own focus sessions" ON focus_sessions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own focus sessions" ON focus_sessions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own focus sessions" ON focus_sessions FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own analytics" ON analytics_events FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own analytics" ON analytics_events FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own AI conversations" ON ai_conversations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own AI conversations" ON ai_conversations FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own goals" ON user_goals FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own goals" ON user_goals FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own achievements" ON user_achievements FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own achievements" ON user_achievements FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Admin policies
CREATE POLICY "Admins can view all users" ON users FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid() AND is_admin = true
  )
);

-- Functions for real-time updates
CREATE OR REPLACE FUNCTION notify_mood_change()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM pg_notify('mood_updates', json_build_object(
    'user_id', NEW.user_id,
    'mood', NEW.mood,
    'timestamp', NEW.timestamp
  )::text);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER mood_change_notify
  AFTER INSERT OR UPDATE ON moods
  FOR EACH ROW
  EXECUTE FUNCTION notify_mood_change();

-- Function to calculate productivity score
CREATE OR REPLACE FUNCTION calculate_productivity_score(user_uuid UUID, days_back INTEGER DEFAULT 7)
RETURNS FLOAT AS $$
DECLARE
  total_tasks INTEGER;
  completed_tasks INTEGER;
  score FLOAT;
BEGIN
  SELECT 
    COUNT(*),
    COUNT(*) FILTER (WHERE done = true)
  INTO total_tasks, completed_tasks
  FROM tasks 
  WHERE user_id = user_uuid 
    AND date >= CURRENT_DATE - INTERVAL '1 day' * days_back;
  
  IF total_tasks = 0 THEN
    RETURN 0.0;
  END IF;
  
  score := (completed_tasks::FLOAT / total_tasks::FLOAT) * 100;
  RETURN score;
END;
$$ LANGUAGE plpgsql;

-- Function to get mood trends
CREATE OR REPLACE FUNCTION get_mood_trends(user_uuid UUID, days_back INTEGER DEFAULT 30)
RETURNS TABLE(mood_type TEXT, count BIGINT, avg_confidence FLOAT) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    m.mood,
    COUNT(*),
    AVG(m.confidence)
  FROM moods m
  WHERE m.user_id = user_uuid 
    AND m.timestamp >= NOW() - INTERVAL '1 day' * days_back
  GROUP BY m.mood
  ORDER BY COUNT(*) DESC;
END;
$$ LANGUAGE plpgsql;

-- Seed data for demo user
INSERT INTO users (id, email, display_name, is_admin, subscription) VALUES
('550e8400-e29b-41d4-a716-446655440000', 'demo@neuroboost.com', 'Demo User', false, 'free'),
('550e8400-e29b-41d4-a716-446655440001', 'admin@neuroboost.com', 'Admin User', true, 'premium');

-- Sample tasks for demo user
INSERT INTO tasks (user_id, text, type, energy_required, date, done) VALUES
('550e8400-e29b-41d4-a716-446655440000', 'Complete morning routine', 'wellness', 'low', CURRENT_DATE, true),
('550e8400-e29b-41d4-a716-446655440000', 'Review ADHD productivity tips', 'learning', 'medium', CURRENT_DATE, false),
('550e8400-e29b-41d4-a716-446655440000', 'Practice mindfulness meditation', 'wellness', 'low', CURRENT_DATE + 1, false);

-- Sample moods
INSERT INTO moods (user_id, mood, confidence, context, source) VALUES
('550e8400-e29b-41d4-a716-446655440000', 'focused', 0.9, 'Working on important project', 'ai_detection'),
('550e8400-e29b-41d4-a716-446655440000', 'energetic', 0.8, 'Just had coffee!', 'manual'),
('550e8400-e29b-41d4-a716-446655440000', 'calm', 0.7, 'Finished meditation session', 'ai_detection'); 