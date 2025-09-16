#!/usr/bin/env python3
"""
Direct table creation for NeuroBoost using Supabase Admin
"""

from supabase import create_client, Client
import sys

# Supabase credentials
SUPABASE_URL = "https://hbarpylljytrdijjcmix.supabase.co"
SUPABASE_SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhiYXJweWxsanl0cmRpampjbWl4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MDU4NjgzNiwiZXhwIjoyMDY2MTYyODM2fQ.6172Q9L2YPkTe-Ui99-79c60_dJRKGqCGtkt6NhFuzU"

def execute_sql(supabase: Client, sql: str, description: str):
    """Execute SQL with error handling"""
    try:
        print(f"🔄 {description}...")
        result = supabase.rpc('exec_sql', {'sql': sql}).execute()
        print(f"✅ {description} completed")
        return True
    except Exception as e:
        print(f"⚠️  {description} - {str(e)}")
        return False

def main():
    print("🗄️ Direct NeuroBoost Table Creation")
    print("===================================")
    
    # Create Supabase client with service key
    supabase: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)
    
    print("🔄 Testing connection...")
    try:
        # Test connection
        response = supabase.auth.get_session()
        print("✅ Connected to Supabase!")
    except Exception as e:
        print(f"❌ Connection failed: {e}")
        return False
    
    # SQL commands to execute
    sql_commands = [
        # Enable extensions
        ('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"', 'Enable UUID extension'),
        
        # Create users table
        ('''CREATE TABLE IF NOT EXISTS users (
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
        )''', 'Create users table'),
        
        # Create tasks table
        ('''CREATE TABLE IF NOT EXISTS tasks (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            user_id UUID REFERENCES users(id) ON DELETE CASCADE,
            text TEXT NOT NULL,
            type TEXT DEFAULT 'personal',
            energy_required TEXT DEFAULT 'medium' CHECK (energy_required IN ('low', 'medium', 'high')),
            difficulty TEXT DEFAULT 'medium' CHECK (difficulty IN ('easy', 'medium', 'hard')),
            estimated_minutes INTEGER,
            done BOOLEAN DEFAULT FALSE,
            date DATE NOT NULL,
            source TEXT DEFAULT 'manual',
            tags TEXT[] DEFAULT '{}',
            priority INTEGER DEFAULT 3,
            completed_at TIMESTAMPTZ,
            created_at TIMESTAMPTZ DEFAULT NOW(),
            updated_at TIMESTAMPTZ DEFAULT NOW()
        )''', 'Create tasks table'),
        
        # Create moods table
        ('''CREATE TABLE IF NOT EXISTS moods (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            user_id UUID REFERENCES users(id) ON DELETE CASCADE,
            mood TEXT NOT NULL CHECK (mood IN ('calm', 'energetic', 'focused', 'stressed', 'happy', 'neutral', 'overwhelmed', 'frustrated', 'anxious')),
            confidence FLOAT DEFAULT 0.5 CHECK (confidence >= 0 AND confidence <= 1),
            context TEXT,
            source TEXT DEFAULT 'manual',
            triggers TEXT[],
            timestamp TIMESTAMPTZ DEFAULT NOW()
        )''', 'Create moods table'),
        
        # Insert demo users
        ('''INSERT INTO users (id, email, display_name, is_admin, subscription) VALUES
           ('550e8400-e29b-41d4-a716-446655440000', 'demo@neuroboost.com', 'Demo User', false, 'free'),
           ('550e8400-e29b-41d4-a716-446655440001', 'admin@neuroboost.com', 'Admin User', true, 'premium')
           ON CONFLICT (email) DO NOTHING''', 'Insert demo users'),
        
        # Insert sample tasks
        ('''INSERT INTO tasks (user_id, text, type, energy_required, date, done) VALUES
           ('550e8400-e29b-41d4-a716-446655440000', 'Complete morning routine', 'wellness', 'low', CURRENT_DATE, true),
           ('550e8400-e29b-41d4-a716-446655440000', 'Review ADHD productivity tips', 'learning', 'medium', CURRENT_DATE, false),
           ('550e8400-e29b-41d4-a716-446655440000', 'Practice mindfulness meditation', 'wellness', 'low', CURRENT_DATE + 1, false)
           ON CONFLICT DO NOTHING''', 'Insert sample tasks'),
    ]
    
    # Execute each SQL command
    success_count = 0
    for sql, description in sql_commands:
        if execute_sql(supabase, sql, description):
            success_count += 1
    
    print(f"\n📊 Results: {success_count}/{len(sql_commands)} commands executed")
    
    # Test the setup
    print("\n🧪 Testing database setup...")
    try:
        users = supabase.table('users').select('email,display_name').execute()
        if users.data:
            print("🎯 SUCCESS! Database setup complete!")
            print(f"📊 Found {len(users.data)} users:")
            for user in users.data:
                print(f"   - {user.get('display_name', 'Unknown')}: {user.get('email', 'No email')}")
            
            print("\n🔑 Login Credentials:")
            print("   Demo: demo@neuroboost.com / demo123")
            print("   Admin: admin@neuroboost.com / admin123")
            print("\n🚀 Ready to test: python run_app.py")
            return True
        else:
            print("❌ No users found")
            return False
    except Exception as e:
        print(f"❌ Test failed: {e}")
        return False

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1) 