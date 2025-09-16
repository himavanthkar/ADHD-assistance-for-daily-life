#!/usr/bin/env python3
"""
One-Click Supabase Setup for NeuroBoost
Opens SQL Editor and copies schema to clipboard automatically.
"""

import os
import sys
import webbrowser
import subprocess
from pathlib import Path

def copy_to_clipboard(text):
    """Copy text to system clipboard"""
    try:
        # Try different clipboard methods based on OS
        if sys.platform == "darwin":  # macOS
            process = subprocess.Popen(['pbcopy'], stdin=subprocess.PIPE)
            process.communicate(text.encode('utf-8'))
            return True
        elif sys.platform.startswith("linux"):  # Linux
            try:
                process = subprocess.Popen(['xclip', '-selection', 'clipboard'], stdin=subprocess.PIPE)
                process.communicate(text.encode('utf-8'))
                return True
            except FileNotFoundError:
                try:
                    process = subprocess.Popen(['xsel', '--clipboard', '--input'], stdin=subprocess.PIPE)
                    process.communicate(text.encode('utf-8'))
                    return True
                except FileNotFoundError:
                    return False
        elif sys.platform.startswith("win"):  # Windows
            import subprocess
            process = subprocess.Popen(['clip'], stdin=subprocess.PIPE)
            process.communicate(text.encode('utf-8'))
            return True
    except Exception:
        return False
    return False

def main():
    print("🚀 NeuroBoost One-Click Supabase Setup")
    print("======================================")
    print("")
    
    # Load schema file
    schema_path = Path("database/supabase_schema.sql")
    if not schema_path.exists():
        print("❌ Schema file not found: database/supabase_schema.sql")
        return False
    
    with open(schema_path, 'r') as f:
        schema_content = f.read()
    
    print(f"✅ Loaded schema ({len(schema_content)} characters)")
    print("")
    
    # Copy to clipboard
    print("📋 Copying schema to clipboard...")
    if copy_to_clipboard(schema_content):
        print("✅ Schema copied to clipboard!")
    else:
        print("⚠️  Could not copy to clipboard automatically")
    
    print("")
    print("🌐 Opening Supabase SQL Editor...")
    
    # Open Supabase SQL Editor
    supabase_sql_url = "https://hbarpylljytrdijjcmix.supabase.co/project/hbarpylljytrdijjcmix/sql"
    
    try:
        webbrowser.open(supabase_sql_url)
        print("✅ SQL Editor opened in browser")
    except Exception as e:
        print(f"⚠️  Could not open browser: {str(e)}")
        print(f"   Please manually go to: {supabase_sql_url}")
    
    print("")
    print("📋 SIMPLE STEPS:")
    print("================")
    print("1. ✅ SQL Editor is now open in your browser")
    print("2. ✅ Schema is copied to your clipboard")
    print("3. 📝 Paste (Cmd+V / Ctrl+V) into the SQL Editor")
    print("4. ▶️  Click the 'RUN' button")
    print("5. ⏱️  Wait ~30 seconds for completion")
    print("")
    
    # Wait for user confirmation
    input("Press ENTER after you've run the SQL in Supabase...")
    
    print("")
    print("🧪 Testing database setup...")
    
    # Test the setup
    try:
        from supabase import create_client
        
        SUPABASE_URL = "https://hbarpylljytrdijjcmix.supabase.co"
        SUPABASE_SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhiYXJweWxsanl0cmRpampjbWl4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MDU4NjgzNiwiZXhwIjoyMDY2MTYyODM2fQ.6172Q9L2YPkTe-Ui99-79c60_dJRKGqCGtkt6NhFuzU"
        
        supabase = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)
        
        # Test if users table exists and has data
        users = supabase.table('users').select('email,display_name').execute()
        
        if users.data:
            print("🎯 SUCCESS! Database setup complete!")
            print("====================================")
            print(f"📊 Found {len(users.data)} users:")
            for user in users.data:
                print(f"   - {user.get('display_name', 'Unknown')}: {user.get('email', 'No email')}")
            
            print("")
            print("🔑 Login Credentials:")
            print("   Demo: demo@neuroboost.com / demo123")
            print("   Admin: admin@neuroboost.com / admin123")
            print("")
            print("🚀 Ready to test your app:")
            print("   python run_app.py")
            print("")
            print("✨ New Supabase Features Available:")
            print("   - Advanced ADHD task analytics")
            print("   - Real-time mood theme changes")
            print("   - Voice note full-text search")
            print("   - Energy-based task suggestions")
            print("")
            return True
        else:
            print("❌ No users found. Schema may not have run completely.")
            print("   Please check for errors in Supabase SQL Editor")
            return False
            
    except Exception as e:
        print(f"❌ Database test failed: {str(e)}")
        print("   Please ensure the schema ran successfully in Supabase")
        return False

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1) 