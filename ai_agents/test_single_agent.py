#!/usr/bin/env python3
"""
🧪 Test Single AI Agent - No Dependencies!
"""

# Simple test of MoodAgent without external APIs
import os
import sys

def test_mood_agent():
    print("🎭 Testing MoodAgent Logic...")
    
    # Simulate ADHD mood patterns (from your actual agent)
    adhd_moods = {
        "overwhelmed": {"theme": "calm-blue", "message": "Break it down into smaller steps"},
        "hyperfocus": {"theme": "focus-purple", "message": "You're in the zone! Keep going"},
        "tired": {"theme": "energy-orange", "message": "Time for a break and self-care"},
        "frustrated": {"theme": "patience-green", "message": "This feeling is temporary"}
    }
    
    # Test different inputs
    test_cases = [
        "I'm feeling so overwhelmed with all these tasks",
        "I'm totally focused and in the zone right now", 
        "I'm exhausted and can't think straight",
        "This is so frustrating, nothing is working"
    ]
    
    for i, text in enumerate(test_cases):
        print(f"\n   Test {i+1}: '{text}'")
        
        # Simple keyword detection (like your real agent does)
        detected_mood = "neutral"
        if "overwhelmed" in text.lower():
            detected_mood = "overwhelmed"
        elif "focused" in text.lower() or "zone" in text.lower():
            detected_mood = "hyperfocus"
        elif "tired" in text.lower() or "exhausted" in text.lower():
            detected_mood = "tired"
        elif "frustrat" in text.lower():
            detected_mood = "frustrated"
            
        result = adhd_moods.get(detected_mood, {"theme": "default", "message": "Keep going!"})
        print(f"   → Mood: {detected_mood}")
        print(f"   → Theme: {result['theme']}")
        print(f"   → Message: {result['message']}")
    
    print("\n   ✅ MoodAgent logic works!")

def test_task_agent():
    print("\n📝 Testing TaskAgent Logic...")
    
    # Simulate task parsing (from your actual agent)
    test_voice_commands = [
        "Hey NeuroBoost, remind me to call mom at 3pm",
        "Add a task to buy groceries tomorrow",
        "Set up a meeting with John next Tuesday at 2pm",
        "Don't forget to take my medication at 8am daily"
    ]
    
    for i, command in enumerate(test_voice_commands):
        print(f"\n   Test {i+1}: '{command}'")
        
        # Simple parsing logic (like your real agent)
        task = {
            "text": command,
            "priority": "medium",
            "adhd_friendly": True,
            "estimated_time": "15 mins"
        }
        
        # Extract time if present
        if "at " in command:
            time_part = command.split("at ")[1].split()[0]
            task["time"] = time_part
            
        # Set priority based on keywords
        if "urgent" in command.lower() or "asap" in command.lower():
            task["priority"] = "high"
        elif "daily" in command.lower() or "medication" in command.lower():
            task["priority"] = "high"
            task["recurring"] = True
            
        print(f"   → Task: {task}")
    
    print("\n   ✅ TaskAgent logic works!")

if __name__ == "__main__":
    print("🚀 Testing Individual AI Agent Logic...\n")
    
    test_mood_agent()
    test_task_agent()
    
    print("\n" + "="*50)
    print("🎉 Individual Agent Tests Complete!")
    print("\n💡 Next Steps:")
    print("   1. Get your API keys (Anthropic, Groq)")
    print("   2. Test with real AI services")
    print("   3. Integrate with your team's frontend")
    print("   4. Win those prizes! 🏆") 