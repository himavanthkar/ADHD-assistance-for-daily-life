#!/usr/bin/env python3
"""
Test script to demonstrate NeuroBoost voice integration and mood detection
"""
import requests
import json
import time

def test_mood_detection():
    """Test the AI mood detection endpoint"""
    print("🧠 Testing Mood Detection...")
    
    test_phrases = [
        ("I'm feeling really stressed about this deadline", "stressed"),
        ("I'm so excited and energetic today!", "energetic"), 
        ("I need to focus and get this done", "focused"),
        ("I'm feeling calm and peaceful", "calm"),
        ("This is making me so happy!", "happy")
    ]
    
    for phrase, expected_mood in test_phrases:
        try:
            response = requests.post('http://localhost:8000/mood/detect', 
                json={'text': phrase, 'timestamp': time.time()})
            
            if response.status_code == 200:
                result = response.json()
                detected_mood = result.get('mood', 'unknown')
                confidence = result.get('confidence', 0)
                
                print(f"  📝 '{phrase}'")
                print(f"     → Detected: {detected_mood} ({confidence:.2f}% confidence)")
                print(f"     → Expected: {expected_mood}")
                print(f"     → {'✅ Match!' if detected_mood == expected_mood else '⚠️  Different'}")
                print()
            else:
                print(f"  ❌ Failed to detect mood: {response.status_code}")
                
        except Exception as e:
            print(f"  ❌ Error: {e}")
    
def test_voice_to_task():
    """Test the voice-to-task conversion"""
    print("📝 Testing Voice-to-Task Conversion...")
    
    test_tasks = [
        {"task": "Buy groceries", "day": "monday", "type": "personal"},
        {"task": "Finish the presentation", "day": "tuesday", "type": "work"},
        {"task": "Go to the gym", "day": "wednesday", "type": "workout"},
        {"task": "Call mom", "day": "thursday", "type": "personal"},
        {"task": "Review project proposal", "day": "friday", "type": "work"}
    ]
    
    for task_data in test_tasks:
        try:
            response = requests.post('http://localhost:8002/tasks/add', 
                json=task_data)
            
            if response.status_code == 200:
                result = response.json()
                print(f"  ✅ Added: '{task_data['task']}' to {task_data['day']}")
                print(f"     → {result.get('message', 'Success')}")
            else:
                print(f"  ❌ Failed to add task: {response.status_code}")
                
        except Exception as e:
            print(f"  ❌ Error: {e}")

def test_task_removal():
    """Test task removal"""
    print("🗑️  Testing Task Removal...")
    
    try:
        response = requests.post('http://localhost:8002/tasks/remove',
            json={"task": "Buy groceries", "day": "monday"})
        
        if response.status_code == 200:
            result = response.json()
            print(f"  ✅ Removed task successfully")
            print(f"     → {result.get('message', 'Success')}")
        else:
            print(f"  ❌ Failed to remove task: {response.status_code}")
            
    except Exception as e:
        print(f"  ❌ Error: {e}")

def test_ai_agents_status():
    """Test AI agents service status"""
    print("🤖 Testing AI Agents Status...")
    
    try:
        response = requests.get('http://localhost:8000/health')
        if response.status_code == 200:
            result = response.json()
            print(f"  ✅ AI Agents Service: {result.get('status', 'unknown')}")
        else:
            print(f"  ❌ AI Agents Service not responding: {response.status_code}")
    except Exception as e:
        print(f"  ❌ Error: {e}")

def main():
    print("🎯 NeuroBoost Integration Test")
    print("=" * 50)
    
    # Test all components
    test_ai_agents_status()
    print()
    
    test_mood_detection()
    print()
    
    test_voice_to_task()
    print()
    
    test_task_removal()
    print()
    
    print("🎉 Integration test completed!")
    print("\n💡 To test the full app:")
    print("   1. Open http://localhost:3000 in your browser")
    print("   2. Click the voice assistant button (bottom right)")
    print("   3. Say: 'Add workout session to Monday'")
    print("   4. Watch the mood change colors based on your tone!")
    print("   5. Check the Settings page for mood controls")

if __name__ == "__main__":
    main() 