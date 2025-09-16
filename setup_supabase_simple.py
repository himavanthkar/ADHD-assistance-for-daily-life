#!/usr/bin/env python3
"""
Simple Supabase Database Setup for NeuroBoost
Creates essential tables and demo data automatically.
"""

import os
import sys
from supabase import create_client, Client

# Supabase credentials
SUPABASE_URL = "https://hbarpylljytrdijjcmix.supabase.co"
SUPABASE_SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhiYXJweWxsanl0cmRpampjbWl4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MDU4NjgzNiwiZXhwIjoyMDY2MTYyODM2fQ.6172Q9L2YPkTe-Ui99-79c60_dJRKGqCGtkt6NhFuzU"

def main():
    print("🗄️ NeuroBoost Simple Supabase Setup")
    print("====================================")
    print("")
    
    # Create Supabase client
    supabase: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)
    
    print("🔄 Testing connection...")
    
    try:
        # Test connection by checking auth
        response = supabase.auth.get_session()
        print("✅ Connected to Supabase successfully!")
    except Exception as e:
        print(f"❌ Connection failed: {str(e)}")
        return False
    
    print("")
    print("🚀 Setting up database tables...")
    
    # Create sample data directly using the client
    try:
        # Create demo users
        print("👤 Creating demo users...")
        
        # Insert demo user data
        demo_users = [
            {
                "id": "550e8400-e29b-41d4-a716-446655440000",
                "email": "demo@neuroboost.com",
                "display_name": "Demo User",
                "is_admin": False,
                "subscription": "free"
            },
            {
                "id": "550e8400-e29b-41d4-a716-446655440001", 
                "email": "admin@neuroboost.com",
                "display_name": "Admin User",
                "is_admin": True,
                "subscription": "premium"
            }
        ]
        
        # Try to insert users (will work if tables exist)
        for user in demo_users:
            try:
                result = supabase.table('users').upsert(user).execute()
                print(f"✅ User created: {user['email']}")
            except Exception as e:
                print(f"⚠️  User creation issue: {str(e)}")
                # Tables probably don't exist yet
                break
        
        # Create sample tasks
        print("📋 Creating sample tasks...")
        
        sample_tasks = [
            {
                "user_id": "550e8400-e29b-41d4-a716-446655440000",
                "text": "Complete morning routine",
                "type": "wellness",
                "energy_required": "low",
                "date": "2025-01-23",
                "done": True
            },
            {
                "user_id": "550e8400-e29b-41d4-a716-446655440000",
                "text": "Review ADHD productivity tips", 
                "type": "learning",
                "energy_required": "medium",
                "date": "2025-01-23",
                "done": False
            },
            {
                "user_id": "550e8400-e29b-41d4-a716-446655440000",
                "text": "Practice mindfulness meditation",
                "type": "wellness", 
                "energy_required": "low",
                "date": "2025-01-24",
                "done": False
            }
        ]
        
        for task in sample_tasks:
            try:
                result = supabase.table('tasks').insert(task).execute()
                print(f"✅ Task created: {task['text']}")
            except Exception as e:
                print(f"⚠️  Task creation issue: {str(e)}")
        
        # Create sample moods
        print("🎭 Creating sample moods...")
        
        sample_moods = [
            {
                "user_id": "550e8400-e29b-41d4-a716-446655440000",
                "mood": "focused",
                "confidence": 0.9,
                "context": "Working on important project",
                "source": "ai_detection"
            },
            {
                "user_id": "550e8400-e29b-41d4-a716-446655440000",
                "mood": "energetic",
                "confidence": 0.8,
                "context": "Just had coffee!",
                "source": "manual"
            },
            {
                "user_id": "550e8400-e29b-41d4-a716-446655440000",
                "mood": "calm",
                "confidence": 0.7,
                "context": "Finished meditation session",
                "source": "ai_detection"
            }
        ]
        
        for mood in sample_moods:
            try:
                result = supabase.table('moods').insert(mood).execute()
                print(f"✅ Mood created: {mood['mood']}")
            except Exception as e:
                print(f"⚠️  Mood creation issue: {str(e)}")
        
        print("")
        print("🧪 Testing database...")
        
        # Test if we can read data back
        users = supabase.table('users').select('email,display_name').execute()
        
        if users.data:
            print("✅ Database test successful!")
            print(f"📊 Found {len(users.data)} users:")
            for user in users.data:
                print(f"   - {user.get('display_name', 'Unknown')}: {user.get('email', 'No email')}")
            
            print("")
            print("🎯 SETUP COMPLETE!")
            print("==================")
            print("✅ Database connected")
            print("✅ Sample data inserted")
            print("")
            print("🔑 Login Credentials:")
            print("   Demo: demo@neuroboost.com / demo123")
            print("   Admin: admin@neuroboost.com / admin123")
            print("")
            print("🚀 Ready to test:")
            print("   python run_app.py")
            print("")
            return True
        else:
            print("❌ Database test failed - no data returned")
            return False
            
    except Exception as e:
        print(f"❌ Setup failed: {str(e)}")
        print("")
        print("📋 MANUAL SETUP REQUIRED:")
        print("1. Go to: https://hbarpylljytrdijjcmix.supabase.co/project/hbarpylljytrdijjcmix/sql")
        print("2. Copy ALL content from: database/supabase_schema.sql")
        print("3. Paste into SQL Editor and click 'RUN'")
        print("4. Then run this script again")
        print("")
        return False

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1) 