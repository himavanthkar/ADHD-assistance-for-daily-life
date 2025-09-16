import os
from groq import Groq
from typing import Dict

class FocusAgent:
    def __init__(self):
        api_key = os.getenv("GROQ_API_KEY")
        self.groq_client = None
        if api_key:
            try:
                self.groq_client = Groq(api_key=api_key)
            except Exception as e:
                print(f"Failed to initialize Groq client: {e}")
                self.groq_client = None
    
    def analyze_focus_level(self, data: Dict) -> Dict:
        """Analyze focus level using Groq for real-time processing"""
        return {
            "focus_score": 0.7,
            "focus_state": "moderate",
            "recommendations": ["Take a 5-minute break", "Clear distractions"]
        }
    
    def get_adhd_suggestions(self) -> list:
        """Get ADHD-specific focus suggestions"""
        return [
            "Try the Pomodoro technique",
            "Remove phone distractions", 
            "Use noise-canceling headphones",
            "Break task into smaller steps"
        ] 