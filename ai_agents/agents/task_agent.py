import os
import json
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Union
import anthropic

class TaskAgent:
    """
    📝 TASK AGENT - Claude 4 Powered Task Intelligence
    
    Converts voice commands to structured tasks with ADHD-friendly formatting.
    Uses Claude 4's advanced reasoning for complex task breakdown.
    """
    
    def __init__(self):
        self.anthropic_client = None
        
        # ADHD-specific task templates
        self.adhd_task_templates = {
            "time_estimate": "realistic_with_buffer",
            "break_down": True,
            "priority_system": "dopamine_driven",
            "reminder_style": "positive_reinforcement"
        }
    
    def _get_anthropic_client(self):
        if not self.anthropic_client:
            api_key = os.getenv("ANTHROPIC_API_KEY")
            if api_key:
                try:
                    self.anthropic_client = anthropic.Anthropic(api_key=api_key)
                except Exception as e:
                    print(f"Failed to initialize Anthropic client: {e}")
                    return None
            else:
                print("ANTHROPIC_API_KEY not found, using fallback mode")
                return None
        return self.anthropic_client
    
    def map_day_to_date(self, day_string: str) -> str:
        """
        Maps a day of the week (e.g., "monday") to the next occurrence of that day's date.
        Returns the date in "YYYY-MM-DD" format.
        """
        today = datetime.now()
        day_string = day_string.lower()
        days_of_week = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]
        
        if day_string not in days_of_week:
            return today.strftime("%Y-%m-%d") # Default to today if day is invalid
            
        target_weekday = days_of_week.index(day_string)
        days_ahead = target_weekday - today.weekday()
        
        if days_ahead < 0: # Target day has already passed this week
            days_ahead += 7
            
        target_date = today + timedelta(days=days_ahead)
        return target_date.strftime("%Y-%m-%d")

    def voice_to_task(self, transcript: str) -> Union[Dict, List[Dict]]:
        """
        🎤 VOICE TO STRUCTURED TASKS
        
        Converts voice transcript into ADHD-friendly structured tasks.
        Returns list of tasks with priorities, time estimates, and breakdown.
        """
        try:
            client = self._get_anthropic_client()
            
            # If no client available, use fallback
            if not client:
                return self._fallback_task_creation(transcript)
                
            # Use Claude 4 for intelligent task parsing
            prompt = f"""
            You are an ADHD productivity assistant. Convert this voice input into structured tasks.
            
            Voice input: "{transcript}"
            
            ADHD-specific considerations:
            - Break large tasks into smaller, manageable chunks (2-15 min each)
            - Add realistic time estimates with buffer time
            - Include dopamine-friendly rewards and milestones
            - Use positive, encouraging language
            - Identify potential distractions or challenges
            - Suggest when to take breaks
            
            Return JSON array with this structure:
            {{
                "tasks": [
                    {{
                        "title": "Task name (clear and specific)",
                        "description": "Detailed description with steps",
                        "priority": "high/medium/low",
                        "estimated_time": "minutes",
                        "difficulty": "easy/medium/hard",
                        "energy_required": "low/medium/high",
                        "subtasks": ["Step 1", "Step 2", "Step 3"],
                        "potential_blockers": ["Distraction 1", "Challenge 2"],
                        "reward": "Small reward after completion",
                        "adhd_friendly": true,
                        "break_after": true/false,
                        "due_date": "YYYY-MM-DD or null",
                        "tags": ["category", "context"]
                    }}
                ],
                "overall_strategy": "ADHD-friendly approach for this task set",
                "estimated_total_time": "total minutes",
                "recommended_order": "Priority order explanation"
            }}
            """
            
            response = client.messages.create(
                model="claude-3-sonnet-20240229",
                max_tokens=2000,
                messages=[{"role": "user", "content": prompt}]
            )
            
            # Safely extract text from the response
            text_content = ""
            for block in response.content:
                if block.type == "text":
                    text_content += block.text
            
            if not text_content:
                raise ValueError("No text content found in the response.")

            result = json.loads(text_content)
            
            # Add timestamps and IDs
            for task in result.get("tasks", []):
                task["id"] = f"task_{datetime.now().timestamp()}"
                task["created_at"] = datetime.now().isoformat()
                task["source"] = "voice"
                task["ai_processed"] = True
            
            return result
            
        except Exception as e:
            print(f"Voice to task conversion error: {e}")
            return self._fallback_task_creation(transcript)
    
    def prioritize_adhd_tasks(self, tasks: List[Dict]) -> Union[Dict, List[Dict]]:
        """
        🧠 ADHD-SPECIFIC TASK PRIORITIZATION
        
        Reorders tasks based on ADHD productivity patterns:
        - Energy levels throughout the day
        - Dopamine-driven motivation
        - Hyperfocus opportunities
        - Executive function challenges
        """
        try:
            client = self._get_anthropic_client()
            
            # If no client available, return default ordering
            if not client:
                return {"prioritized_tasks": tasks, "adhd_strategy": "Default ordering"}
                
            prompt = f"""
            Reorder these tasks for someone with ADHD based on optimal productivity patterns:
            
            Tasks: {json.dumps(tasks, indent=2)}
            
            ADHD prioritization factors:
            - Morning = high executive function (complex tasks)
            - Mid-morning = peak focus (deep work)
            - After lunch = low energy (easy tasks)
            - Late afternoon = second wind (medium tasks)
            - Evening = low focus (routine tasks)
            
            Also consider:
            - Start with dopamine-boosting quick wins
            - Group similar tasks to reduce context switching
            - Schedule breaks between demanding tasks
            - Save hyperfocus-requiring tasks for peak hours
            
            Return JSON with:
            {{
                "prioritized_tasks": [ordered task objects],
                "time_blocks": [
                    {{
                        "time_slot": "9:00 AM - 10:00 AM",
                        "task_ids": ["task1", "task2"],
                        "rationale": "Why this timing works for ADHD"
                    }}
                ],
                "adhd_strategy": "Overall approach explanation"
            }}
            """
            
            response = client.messages.create(
                model="claude-3-sonnet-20240229",
                max_tokens=1500,
                messages=[{"role": "user", "content": prompt}]
            )
            
            # Safely extract text from the response
            text_content = ""
            for block in response.content:
                if block.type == "text":
                    text_content += block.text
            
            if not text_content:
                raise ValueError("No text content found in the response.")

            result = json.loads(text_content)
            return result
            
        except Exception as e:
            print(f"Task prioritization error: {e}")
            return {"prioritized_tasks": tasks, "adhd_strategy": "Default ordering"}
    
    def break_down_complex_task(self, task: Dict) -> Dict:
        """
        🔨 COMPLEX TASK BREAKDOWN
        
        Takes a large/complex task and breaks it into ADHD-manageable chunks.
        Each chunk should be 2-15 minutes with clear success criteria.
        """
        try:
            client = self._get_anthropic_client()
            
            # If no client available, return simple breakdown
            if not client:
                return {"micro_tasks": [task], "adhd_benefits": "Simple breakdown due to missing API"}
                
            prompt = f"""
            Break down this complex task into ADHD-friendly micro-tasks:
            
            Task: {json.dumps(task, indent=2)}
            
            ADHD breakdown principles:
            - Each micro-task should be 2-15 minutes
            - Clear, specific action required
            - Obvious completion criteria
            - Minimal context switching
            - Built-in dopamine rewards
            - Identify potential stopping points
            
            Return JSON:
            {{
                "original_task": "Original task title",
                "micro_tasks": [
                    {{
                        "step": 1,
                        "title": "Specific micro-task",
                        "description": "Exact action to take",
                        "time_estimate": "5-10 minutes",
                        "success_criteria": "How to know it's done",
                        "dopamine_reward": "Quick reward",
                        "energy_cost": "low/medium/high",
                        "can_pause_here": true/false
                    }}
                ],
                "total_breakdown_time": "Total estimated time",
                "adhd_benefits": "Why this breakdown helps ADHD"
            }}
            """
            
            response = client.messages.create(
                model="claude-3-sonnet-20240229",
                max_tokens=1500,
                messages=[{"role": "user", "content": prompt}]
            )
            
            # Safely extract text from the response
            text_content = ""
            for block in response.content:
                if block.type == "text":
                    text_content += block.text

            if not text_content:
                raise ValueError("No text content found in the response.")
                        
            result = json.loads(text_content)
            return result
            
        except Exception as e:
            print(f"Task breakdown error: {e}")
            return {"micro_tasks": [task], "adhd_benefits": "Error in breakdown"}
    
    def suggest_task_timing(self, tasks: List[Dict], user_schedule: Optional[Dict] = None) -> Dict:
        """
        ⏰ ADHD-OPTIMIZED TASK TIMING
        
        Suggests optimal timing for tasks based on ADHD energy patterns and existing schedule.
        """
        current_time = datetime.now()
        
        # ADHD energy pattern throughout the day
        adhd_energy_map = {
            "morning": {"energy": "high", "focus": "high", "executive": "high"},
            "late_morning": {"energy": "peak", "focus": "peak", "executive": "medium"},
            "midday": {"energy": "medium", "focus": "medium", "executive": "low"},
            "afternoon": {"energy": "low", "focus": "low", "executive": "low"},
            "late_afternoon": {"energy": "medium", "focus": "medium", "executive": "medium"},
            "evening": {"energy": "low", "focus": "low", "executive": "low"}
        }
        
        suggestions = {
            "immediate": [],  # Can do right now
            "peak_hours": [],  # Save for peak focus
            "low_energy": [],  # Good for tired times
            "any_time": []  # Flexible timing
        }
        
        for task in tasks:
            energy_required = task.get("energy_required", "medium")
            difficulty = task.get("difficulty", "medium")
            
            if energy_required == "low" and difficulty == "easy":
                suggestions["low_energy"].append(task)
            elif energy_required == "high" or difficulty == "hard":
                suggestions["peak_hours"].append(task)
            elif difficulty == "easy":
                suggestions["immediate"].append(task)
            else:
                suggestions["any_time"].append(task)
        
        return {
            "suggested_timing": suggestions,
            "adhd_strategy": "Timing optimized for ADHD energy patterns",
            "next_peak_hours": "10:00 AM - 12:00 PM",
            "current_recommendation": self._get_current_recommendation(suggestions, current_time)
        }
    
    def _get_current_recommendation(self, suggestions: Dict, current_time: datetime) -> str:
        """Get current task recommendation based on time of day"""
        hour = current_time.hour
        
        if 8 <= hour <= 10:
            return "High energy time - tackle challenging tasks"
        elif 10 <= hour <= 12:
            return "Peak focus time - do deep work"
        elif 12 <= hour <= 14:
            return "Post-lunch dip - do easy tasks"
        elif 14 <= hour <= 16:
            return "Low energy - take breaks or do routine tasks"
        elif 16 <= hour <= 18:
            return "Second wind - medium difficulty tasks"
        else:
            return "Evening - wind down with easy tasks"
    
    def _fallback_task_creation(self, transcript: str) -> Dict:
        """Fallback task creation if Claude fails"""
        return {
            "tasks": [{
                "title": transcript[:50] + "..." if len(transcript) > 50 else transcript,
                "description": f"Task created from: {transcript}",
                "priority": "medium",
                "estimated_time": "30",
                "difficulty": "medium",
                "subtasks": ["Review task details", "Break down if needed", "Complete task"],
                "adhd_friendly": False,
                "source": "voice_fallback"
            }],
            "overall_strategy": "Basic task creation - needs manual refinement",
            "estimated_total_time": "30"
        } 