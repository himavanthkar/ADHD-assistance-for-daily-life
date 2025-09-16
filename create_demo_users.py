#!/usr/bin/env python3
"""
Create demo users in Supabase for testing
"""
import os
import requests
import json
from dotenv import load_dotenv

load_dotenv()

SUPABASE_URL = "https://hbarpylljytrdijjcmix.supabase.co"
SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhiYXJweWxsanl0cmRpampjbWl4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA1ODY4MzYsImV4cCI6MjA2NjE2MjgzNn0.o_3fPqCDW-GnKKTr_gA-Hg5qarkWO_sNj76QVEQc95Q"

def create_demo_user(email, password, display_name):
    """Create a demo user using Supabase Auth API"""
    
    # Step 1: Sign up the user
    signup_url = f"{SUPABASE_URL}/auth/v1/signup"
    headers = {
        "apikey": SUPABASE_ANON_KEY,
        "Content-Type": "application/json"
    }
    
    signup_data = {
        "email": email,
        "password": password,
        "data": {
            "display_name": display_name
        }
    }
    
    print(f"Creating user: {email}")
    response = requests.post(signup_url, headers=headers, json=signup_data)
    
    if response.status_code == 200:
        print(f"✅ Successfully created user: {email}")
        return True
    else:
        print(f"❌ Failed to create user {email}: {response.status_code} - {response.text}")
        return False

def main():
    print("🎯 Creating Demo Users in Supabase")
    print("=" * 40)
    
    demo_users = [
        {
            "email": "admin@neuroboost.com",
            "password": "admin123",
            "display_name": "Admin User"
        },
        {
            "email": "demo@neuroboost.com", 
            "password": "demo123",
            "display_name": "Demo User"
        }
    ]
    
    for user in demo_users:
        create_demo_user(user["email"], user["password"], user["display_name"])
    
    print("\n🎉 Demo users created! You can now test login with:")
    print("  Admin: admin@neuroboost.com / admin123")
    print("  Demo: demo@neuroboost.com / demo123")

if __name__ == "__main__":
    main() 