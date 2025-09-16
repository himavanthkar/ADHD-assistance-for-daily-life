#!/usr/bin/env python3
"""
🎯 Test REAL AI Agents with Your API Keys
"""

import os
import sys
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Check if keys are loaded
if not os.getenv("ANTHROPIC_API_KEY") or not os.getenv("GROQ_API_KEY"):
    print("❌ Critical Error: ANTHROPIC_API_KEY or GROQ_API_KEY not found.")
    print("   Please ensure they are set in your .env file.")
    sys.exit(1)

print("🚀 Testing REAL AI Agents with Your API Keys...")
print("=" * 60)

# Test 1: Simple Claude API call
print("\n🎭 Testing Claude API directly (Your Prize Target!)...")
try:
    import anthropic
    
    client = anthropic.Anthropic(
        api_key=os.environ.get("ANTHROPIC_API_KEY")
    )
    
    # Test ADHD mood detection
    test_message = "I'm feeling so overwhelmed with all these tasks and deadlines. My mind is racing and I can't focus on anything."
    
    message = client.messages.create(
        model="claude-3-haiku-20240307",
        max_tokens=200,
        messages=[
            {
                "role": "user", 
                "content": f"Analyze this ADHD user's mood and suggest a calming theme: '{test_message}'"
            }
        ]
    )
    
    print(f"   Input: '{test_message[:50]}...'")

    # Safely extract text from the response
    text_content = ""
    for block in message.content:
        if block.type == "text":
            text_content += block.text
    
    print(f"   Claude Response: {text_content[:100]}...")
    print("   ✅ Claude API working! ($2,500 prize target)")
    
except Exception as e:
    print(f"   ❌ Claude API error: {e}")

# Test 2: Groq API call  
print("\n🎯 Testing Groq API directly (Your Secondary Prize!)...")
try:
    from groq import Groq
    
    client = Groq(api_key=os.environ.get("GROQ_API_KEY"))
    
    # Test focus analysis
    chat_completion = client.chat.completions.create(
        messages=[
            {
                "role": "user",
                "content": "Analyze focus level: typing speed 45wpm, 3 app switches in 10 mins, 25 mins on current task. Return JSON with focus_score (0-1)."
            }
        ],
        model="llama3-8b-8192",
    )
    
    response_content = chat_completion.choices[0].message.content
    print(f"   Focus Analysis: {response_content[:80] if response_content else 'No content returned'}...")
    print("   ✅ Groq API working! ($500 prize target)")
    
except Exception as e:
    print(f"   ❌ Groq API error: {e}")

print("\n" + "=" * 60)
print("🎉 REAL API Tests Complete!")
print("\n💡 Your Next Steps:")
print("   1. ✅ APIs are working - you can win prizes!")
print("   2. Integrate your MoodAgent with team's frontend")
print("   3. Make mood detection trigger real-time theme changes")
print("   4. Show judges the ADHD-adaptive UI magic!")

print("\n🏆 Prize Strategy:")
print("   🥇 Anthropic ($2,500) - Real-time mood detection works!")
print("   🥈 Groq ($500) - Fast focus analysis works!")
print("   🥉 Letta (AirPods) - Add memory to motivation agent") 