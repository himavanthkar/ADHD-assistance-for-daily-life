#!/usr/bin/env python3
"""
Add demo tasks to Supabase for testing
"""
import os
import requests
import json
import uuid
from datetime import datetime, timedelta
from dotenv import load_dotenv

load_dotenv()

SUPABASE_URL = "https://hbarpylljytrdijjcmix.supabase.co"
SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhiYXJweWxsanl0cmRpampjbWl4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA1ODY4MzYsImV4cCI6MjA2NjE2MjgzNn0.o_3fPqCDW-GnKKTr_gA-Hg5qarkWO_sNj76QVEQc95Q"

# Use a consistent demo user ID
DEMO_USER_ID = "550e8400-e29b-41d4-a716-446655440000"  # Fixed UUID for demo

def add_demo_task(task_data):
    """Add a demo task to Supabase"""
    try:
        response = requests.post(
            f"{SUPABASE_URL}/rest/v1/tasks",
            headers={
                "apikey": SUPABASE_ANON_KEY,
                "Authorization": f"Bearer {SUPABASE_ANON_KEY}",
                "Content-Type": "application/json",
                "Prefer": "return=representation"
            },
            json=task_data
        )
        
        if response.status_code == 201:
            print(f"✅ Added task: {task_data['text']}")
            return True
        else:
            print(f"❌ Failed to add task {task_data['text']}: {response.status_code} - {response.text}")
            return False
    except Exception as e:
        print(f"❌ Error adding task {task_data['text']}: {e}")
        return False

def main():
    print("🎯 Adding Demo Tasks to Supabase")
    print("=" * 40)
    
    # Get today's date and next few days
    today = datetime.now()
    tomorrow = today + timedelta(days=1)
    day_after = today + timedelta(days=2)
    sunday = today + timedelta(days=(6 - today.weekday()) % 7)  # Next Sunday
    
    demo_tasks = [
        {
            "user_id": DEMO_USER_ID,
            "text": "Complete math assignment",
            "done": True,
            "date": today.strftime("%Y-%m-%d"),
            "type": "personal",
            "energy_required": "high",
            "difficulty": "hard",
            "source": "manual",
            "priority": 1,
            "created_at": datetime.now().isoformat(),
            "updated_at": datetime.now().isoformat(),
            "completed_at": datetime.now().isoformat()
        },
        {
            "user_id": DEMO_USER_ID,
            "text": "Review chemistry notes",
            "done": False,
            "date": today.strftime("%Y-%m-%d"),
            "type": "personal",
            "energy_required": "medium",
            "difficulty": "medium",
            "source": "manual",
            "priority": 2,
            "created_at": datetime.now().isoformat(),
            "updated_at": datetime.now().isoformat()
        },
        {
            "user_id": DEMO_USER_ID,
            "text": "Write history essay outline",
            "done": False,
            "date": tomorrow.strftime("%Y-%m-%d"),
            "type": "personal",
            "energy_required": "high",
            "difficulty": "hard",
            "source": "manual",
            "priority": 1,
            "created_at": datetime.now().isoformat(),
            "updated_at": datetime.now().isoformat()
        },
        {
            "user_id": DEMO_USER_ID,
            "text": "Buy groceries",
            "done": False,
            "date": sunday.strftime("%Y-%m-%d"),
            "type": "personal",
            "energy_required": "low",
            "difficulty": "easy",
            "source": "voice",
            "priority": 3,
            "created_at": datetime.now().isoformat(),
            "updated_at": datetime.now().isoformat()
        },
        {
            "user_id": DEMO_USER_ID,
            "text": "Call Dr. Smith",
            "done": False,
            "date": day_after.strftime("%Y-%m-%d"),
            "type": "personal",
            "energy_required": "medium",
            "difficulty": "easy",
            "source": "voice",
            "priority": 2,
            "created_at": datetime.now().isoformat(),
            "updated_at": datetime.now().isoformat()
        }
    ]
    
    success_count = 0
    for task in demo_tasks:
        if add_demo_task(task):
            success_count += 1
    
    print(f"\n🎉 Added {success_count}/{len(demo_tasks)} demo tasks!")
    print("You should now see tasks in your calendar and checklist.")

if __name__ == "__main__":
    main() 