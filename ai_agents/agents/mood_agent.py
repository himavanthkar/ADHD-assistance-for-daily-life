import os
import json
from datetime import datetime
from typing import Dict, List, Optional
import anthropic
from groq import Groq

class MoodAgent:
    """
    🎭 MOOD DETECTION AGENT - The Heart of NeuroBoost's Adaptive UI
    
    Detects mood in real-time and triggers instant theme changes across the entire UI.
    This is what makes NeuroBoost special - it adapts to ADHD emotional states!
    """
    
    def __init__(self):
        anthropic_key = os.getenv("ANTHROPIC_API_KEY")
        groq_key = os.getenv("GROQ_API_KEY")
        
        self.anthropic_client = None
        self.groq_client = None
        
        if anthropic_key:
            try:
                self.anthropic_client = anthropic.Anthropic(api_key=anthropic_key)
            except Exception as e:
                print(f"Failed to initialize Anthropic client: {e}")
        
        if groq_key:
            try:
                self.groq_client = Groq(api_key=groq_key)
            except Exception as e:
                print(f"Failed to initialize Groq client: {e}")
        
        # ADHD-specific mood patterns
        self.adhd_mood_patterns = {
            "hyperfocus": {
                "keywords": ["focused", "in the zone", "deep work", "concentrated"],
                "theme": "minimal_focus",
                "ui_changes": {
                    "colors": ["#2563eb", "#1e40af", "#1e3a8a"],  # Deep blues
                    "layout": "minimal",
                    "distractions": "hidden",
                    "spacing": "tight"
                }
            },
            "overwhelmed": {
                "keywords": ["overwhelmed", "too much", "stressed", "chaos"],
                "theme": "calm_zen",
                "ui_changes": {
                    "colors": ["#10b981", "#059669", "#047857"],  # Calming greens
                    "layout": "simplified",
                    "animations": "gentle",
                    "spacing": "generous"
                }
            },
            "energetic": {
                "keywords": ["energetic", "hyper", "excited", "ready"],
                "theme": "vibrant_energy",
                "ui_changes": {
                    "colors": ["#f59e0b", "#d97706", "#b45309"],  # Vibrant oranges
                    "layout": "dynamic",
                    "animations": "bouncy",
                    "interactions": "responsive"
                }
            },
            "tired": {
                "keywords": ["tired", "exhausted", "sleepy", "drained"],
                "theme": "dark_gentle",
                "ui_changes": {
                    "colors": ["#374151", "#4b5563", "#6b7280"],  # Soft grays
                    "brightness": "dimmed",
                    "animations": "slow",
                    "contrast": "high"
                }
            },
            "anxious": {
                "keywords": ["anxious", "worried", "nervous", "scared"],
                "theme": "soothing_purple",
                "ui_changes": {
                    "colors": ["#8b5cf6", "#7c3aed", "#6d28d9"],  # Calming purples
                    "layout": "structured",
                    "animations": "smooth",
                    "messaging": "supportive"
                }
            },
            "frustrated": {
                "keywords": ["frustrated", "angry", "annoyed", "stuck"],
                "theme": "supportive_blue",
                "ui_changes": {
                    "colors": ["#3b82f6", "#2563eb", "#1d4ed8"],  # Supportive blues
                    "layout": "clear",
                    "help": "prominent",
                    "encouragement": "visible"
                }
            }
        }
    
    def detect_mood(self, text: Optional[str] = None, audio_features: Optional[Dict] = None) -> Dict:
        """
        🔍 REAL-TIME MOOD DETECTION
        
        Analyzes text and audio to detect current emotional state.
        Returns mood data with theme changes for instant UI updates.
        """
        mood_data = {
            "timestamp": datetime.now().isoformat(),
            "primary_mood": "neutral",
            "confidence": 0.0,
            "theme_change": None,
            "ui_updates": {},
            "adhd_insights": {}
        }
        
        try:
            # Text-based mood detection using Claude
            if text:
                text_mood = self._analyze_text_mood(text)
                mood_data.update(text_mood)
            
            # Audio-based mood detection (voice tone, pace, etc.)
            if audio_features:
                audio_mood = self._analyze_audio_mood(audio_features)
                mood_data = self._combine_mood_data(mood_data, audio_mood)
            
            # Apply ADHD-specific mood patterns
            mood_data = self._apply_adhd_patterns(mood_data)
            
            return mood_data
            
        except Exception as e:
            print(f"Mood detection error: {e}")
            return mood_data
    
    def _analyze_text_mood(self, text: str) -> Dict:
        """Analyze mood from text using Claude 4"""
        try:
            # Check if Anthropic client is available
            if not self.anthropic_client:
                # Fallback to simple keyword-based analysis
                text_lower = text.lower()
                if any(word in text_lower for word in ["tired", "exhausted", "sleepy"]):
                    return {"primary_mood": "tired", "confidence": 0.7}
                elif any(word in text_lower for word in ["overwhelmed", "stressed", "too much"]):
                    return {"primary_mood": "overwhelmed", "confidence": 0.7}
                elif any(word in text_lower for word in ["energetic", "excited", "ready"]):
                    return {"primary_mood": "energetic", "confidence": 0.7}
                elif any(word in text_lower for word in ["focused", "concentrated", "in the zone"]):
                    return {"primary_mood": "focused", "confidence": 0.7}
                else:
                    return {"primary_mood": "neutral", "confidence": 0.5}
            
            prompt = f"""
            Analyze the emotional state of someone with ADHD from this text: "{text}"
            
            Consider ADHD-specific patterns:
            - Hyperfocus vs scattered attention
            - Emotional dysregulation
            - Task-related frustration
            - Energy level fluctuations
            
            Return JSON with:
            - primary_mood: one of [focused, overwhelmed, energetic, tired, anxious, frustrated, happy, neutral]
            - confidence: 0.0-1.0
            - adhd_indicators: list of ADHD-related emotional patterns detected
            - recommended_theme: suggest UI theme based on mood
            """
            
            response = self.anthropic_client.messages.create(
                model="claude-3-sonnet-20240229",
                max_tokens=500,
                messages=[{"role": "user", "content": prompt}]
            )
            
            # Safely extract and parse Claude's response
            text_content = ""
            for block in response.content:
                if block.type == "text":
                    text_content += block.text
            
            if not text_content:
                raise ValueError("No text content found in the AI response.")

            result = json.loads(text_content)
            return result
            
        except Exception as e:
            print(f"Text mood analysis error: {e}")
            return {"primary_mood": "neutral", "confidence": 0.5}
    
    def _analyze_audio_mood(self, audio_features: Dict) -> Dict:
        """Analyze mood from audio features using Groq for speed"""
        try:
            # Extract audio features like pace, pitch, energy
            pace = audio_features.get("speaking_pace", "normal")
            pitch = audio_features.get("pitch_variation", "normal")
            energy = audio_features.get("energy_level", "medium")
            
            # ADHD-specific audio patterns
            if pace == "fast" and energy == "high":
                return {
                    "audio_mood": "energetic",
                    "confidence": 0.8,  
                    "adhd_indicator": "hyperactive_speech"
                }
            elif pace == "slow" and energy == "low":
                return {
                    "audio_mood": "tired",
                    "confidence": 0.7,
                    "adhd_indicator": "low_dopamine"
                }
            elif pitch == "monotone":
                return {
                    "audio_mood": "overwhelmed",
                    "confidence": 0.6,
                    "adhd_indicator": "emotional_flatness"
                }
            
            return {"audio_mood": "neutral", "confidence": 0.5}
            
        except Exception as e:
            print(f"Audio mood analysis error: {e}")
            return {"audio_mood": "neutral", "confidence": 0.5}
    
    def _apply_adhd_patterns(self, mood_data: Dict) -> Dict:
        """Apply ADHD-specific UI adaptations"""
        primary_mood = mood_data.get("primary_mood", "neutral")
        
        if primary_mood in self.adhd_mood_patterns:
            pattern = self.adhd_mood_patterns[primary_mood]
            mood_data["theme_change"] = pattern["theme"]
            mood_data["ui_updates"] = pattern["ui_changes"]
            
            # Add ADHD-specific insights
            mood_data["adhd_insights"] = {
                "recommended_break": primary_mood in ["overwhelmed", "frustrated"],
                "focus_mode": primary_mood == "hyperfocus",
                "energy_management": primary_mood in ["energetic", "tired"],
                "emotional_support": primary_mood in ["anxious", "frustrated"]
            }
        
        return mood_data
    
    def _combine_mood_data(self, text_mood: Dict, audio_mood: Dict) -> Dict:
        """Combine text and audio mood analysis"""
        # Weighted combination (text slightly more reliable)
        text_confidence = text_mood.get("confidence", 0.5) * 0.6
        audio_confidence = audio_mood.get("confidence", 0.5) * 0.4
        
        combined_confidence = text_confidence + audio_confidence
        
        # Choose primary mood based on confidence
        if text_confidence > audio_confidence:
            primary_mood = text_mood.get("primary_mood", "neutral")
        else:
            primary_mood = audio_mood.get("audio_mood", "neutral")
        
        return {
            **text_mood,
            "primary_mood": primary_mood,
            "confidence": combined_confidence,
            "multimodal": True
        }
    
    def get_mood_history(self, user_id: str, hours: int = 24) -> List[Dict]:
        """Get mood history for ADHD pattern analysis"""
        # TODO: Implement database query for mood history
        # This helps identify ADHD mood cycles and patterns
        return []
    
    def suggest_interventions(self, mood_data: Dict) -> List[str]:
        """Suggest ADHD-specific interventions based on mood"""
        mood = mood_data.get("primary_mood", "neutral")
        
        interventions = {
            "overwhelmed": [
                "Take 5 deep breaths",
                "Break tasks into smaller steps", 
                "Use the 2-minute rule",
                "Declutter your workspace"
            ],
            "tired": [
                "Take a 10-minute walk",
                "Try the 20-20-20 rule",
                "Drink water",
                "Consider a power nap"
            ],
            "anxious": [
                "Practice grounding (5-4-3-2-1 technique)",
                "Listen to calming music",
                "Try progressive muscle relaxation",
                "Journal your thoughts"
            ],
            "frustrated": [
                "Step away for 5 minutes",
                "Try a different approach",
                "Ask for help",
                "Celebrate small wins"
            ]
        }
        
        return interventions.get(mood, ["Stay mindful of your current state"]) 