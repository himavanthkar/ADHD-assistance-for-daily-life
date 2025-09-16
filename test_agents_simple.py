#!/usr/bin/env python3
"""
🧪 Simple AI Agents Test - No Dependencies Required!
Test your AI agents locally without installing complex packages.
"""

import sys
import json
from datetime import datetime

# Mock the complex dependencies for testing
class MockAnthropic:
    def __init__(self, api_key):
        self.api_key = api_key
    
    def messages_create(self, model, max_tokens, messages):
        # Mock Claude response for testing
        return type('obj', (object,), {
            'content': [type('obj', (object,), {
                'text': '{"mood": "focused", "confidence": 0.85, "theme": "productivity-blue", "suggestions": ["Great focus! Keep going", "You\'re in the zone"]}'
            })()]
        })()

class MockGroq:
    def __init__(self, api_key):
        self.api_key = api_key

    def chat_completions_create(self, model, messages):
        # Mock Groq response for testing
        return type('obj', (object,), {
            'choices': [type('obj', (object,), {
                'message': type('obj', (object,), {
                    'content': '{"focus_score": 0.7, "focus_state": "moderate", "distractions": 2}'
                })()
            })()]
        })()

# Import and test your agents
sys.path.append('.')

try:
    # Test imports (will use mocks if real packages not available)
    import agents.mood_agent as mood_agent_module
    import agents.task_agent as task_agent_module
    import agents.focus_agent as focus_agent_module
    import agents.motivate_agent as motivate_agent_module
    
    # Patch with mocks
    import builtins
    original_import = builtins.__import__
    
    def mock_import(name, *args, **kwargs):
        if name == 'anthropic':
            return type('module', (), {'Anthropic': MockAnthropic})
        elif name == 'groq':
            return type('module', (), {'Groq': MockGroq})
        else:
            return original_import(name, *args, **kwargs)
    
    builtins.__import__ = mock_import
    
    print("🚀 Testing Your AI Agents...")
    print("=" * 50)
    
    # Test 1: MoodAgent
    print("\n🎭 Testing MoodAgent...")
    try:
        from agents.mood_agent import MoodAgent
        mood_agent = MoodAgent()
        
        # Test mood detection
        test_text = "I'm feeling overwhelmed with all these tasks today"
        result = mood_agent.detect_mood_from_text(test_text)
        
        print(f"   Input: '{test_text}'")
        print(f"   Detected Mood: {result.get('mood', 'unknown')}")
        print(f"   Theme: {result.get('theme', 'default')}")
        print(f"   ✅ MoodAgent works!")
        
    except Exception as e:
        print(f"   ❌ MoodAgent error: {e}")
    
    # Test 2: TaskAgent  
    print("\n📝 Testing TaskAgent...")
    try:
        from agents.task_agent import TaskAgent
        task_agent = TaskAgent()
        
        # Test voice to task conversion
        voice_text = "Hey NeuroBoost, remind me to call mom at 3pm today"
        result = task_agent.voice_to_task(voice_text)
        
        print(f"   Voice Input: '{voice_text}'")
        print(f"   Task Created: {result.get('task', 'No task')}")
        print(f"   Priority: {result.get('priority', 'medium')}")
        print(f"   ✅ TaskAgent works!")
        
    except Exception as e:
        print(f"   ❌ TaskAgent error: {e}")
    
    # Test 3: FocusAgent
    print("\n🎯 Testing FocusAgent...")
    try:
        from agents.focus_agent import FocusAgent
        focus_agent = FocusAgent()
        
        # Test focus analysis
        focus_data = {"typing_speed": 45, "app_switches": 3, "time_focused": 25}
        result = focus_agent.analyze_focus_level(focus_data)
        
        print(f"   Focus Data: {focus_data}")
        print(f"   Focus Score: {result.get('focus_score', 0)}")
        print(f"   State: {result.get('focus_state', 'unknown')}")
        print(f"   ✅ FocusAgent works!")
        
    except Exception as e:
        print(f"   ❌ FocusAgent error: {e}")
    
    # Test 4: MotivateAgent
    print("\n💪 Testing MotivateAgent...")
    try:
        from agents.motivate_agent import MotivateAgent
        motivate_agent = MotivateAgent()
        
        # Test motivation
        result = motivate_agent.get_personalized_motivation("user123", "overwhelmed")
        
        print(f"   User Mood: overwhelmed")
        print(f"   Motivation: {result.get('message', 'No message')}")
        print(f"   ✅ MotivateAgent works!")
        
    except Exception as e:
        print(f"   ❌ MotivateAgent error: {e}")
    
    print("\n" + "=" * 50)
    print("🎉 AI Agents Test Complete!")
    print("\n💡 Next Steps:")
    print("   1. Add your real API keys to .env file")
    print("   2. Install dependencies: pip install -r requirements.txt")
    print("   3. Run: python main.py")
    print("   4. Test at: http://localhost:8000")
    
except ImportError as e:
    print(f"❌ Could not import agents: {e}")
    print("Make sure you're in the ai-agents directory!") 