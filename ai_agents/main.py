from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import os
import sys
from dotenv import load_dotenv
import redis
import json
import logging
import httpx
from datetime import datetime

# Add current directory to Python path for imports
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from agents.mood_agent import MoodAgent
from agents.task_agent import TaskAgent
from agents.focus_agent import FocusAgent
from agents.motivate_agent import MotivateAgent

load_dotenv()

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="NeuroBoost AI Agents", version="1.0.0")

# CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Supabase configuration
SUPABASE_URL = os.getenv("SUPABASE_URL", "https://hbarpylljytrdijjcmix.supabase.co")
SUPABASE_ANON_KEY = os.getenv("SUPABASE_ANON_KEY", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhiYXJweWxsanl0cmRpampjbWl4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA1ODY4MzYsImV4cCI6MjA2NjE2MjgzNn0.o_3fPqCDW-GnKKTr_gA-Hg5qarkWO_sNj76QVEQc95Q")

# Redis for real-time mood updates (optional for local development)
redis_host = os.getenv("REDIS_HOST", "localhost")
redis_port = int(os.getenv("REDIS_PORT", 6379))
redis_password = os.getenv("REDIS_PASSWORD")

# Try to connect to Redis, but make it optional
redis_client = None
try:
    redis_client = redis.Redis(host=redis_host, port=redis_port, password=redis_password, decode_responses=True)
    redis_client.ping()  # Test connection
    logger.info("Connected to Redis successfully")
except Exception as e:
    logger.warning(f"Could not connect to Redis: {e}. Running without real-time updates.")
    redis_client = None

# Initialize AI Agents
mood_agent = MoodAgent()
task_agent = TaskAgent()
focus_agent = FocusAgent()
motivate_agent = MotivateAgent()

async def save_task_to_supabase(task_data, user_id="demo"):
    """Save task to Supabase database"""
    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{SUPABASE_URL}/rest/v1/tasks",
                headers={
                    "apikey": SUPABASE_ANON_KEY,
                    "Authorization": f"Bearer {SUPABASE_ANON_KEY}",
                    "Content-Type": "application/json",
                    "Prefer": "return=representation"
                },
                json={
                    "user_id": user_id,
                    "text": task_data["text"],
                    "type": task_data.get("type", "personal"),
                    "energy_required": task_data.get("energy_required", "medium"),
                    "difficulty": task_data.get("difficulty", "medium"),
                    "done": task_data.get("done", False),
                    "date": task_data["date"],
                    "source": task_data.get("source", "voice"),
                    "tags": task_data.get("tags", []),
                    "priority": task_data.get("priority", 3),
                    "created_at": datetime.now().isoformat(),
                    "updated_at": datetime.now().isoformat()
                }
            )
            
            if response.status_code == 201:
                logger.info(f"Task saved to Supabase: {task_data['text']}")
                return response.json()[0]  # Supabase returns array
            else:
                logger.error(f"Failed to save task to Supabase: {response.status_code} - {response.text}")
                return None
    except Exception as e:
        logger.error(f"Error saving task to Supabase: {e}")
        return None

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "ai-agents"}

@app.post("/mood/detect")
async def detect_mood(data: dict):
    """Detect mood from voice/text and update theme in real-time"""
    try:
        mood_data = mood_agent.detect_mood(
            text=data.get("text"),
            audio_features=data.get("audio_features")
        )
        
        # Broadcast mood change to frontend via Redis
        if redis_client:
            redis_client.publish("mood_updates", json.dumps(mood_data))
        
        return {"mood": mood_data, "theme_updated": True}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/tasks/from-voice")
async def voice_to_tasks(data: dict):
    """Convert voice transcript to structured tasks"""
    try:
        tasks = task_agent.voice_to_task(data["transcript"])

        # After creating tasks, publish an event to notify the frontend
        if redis_client:
            redis_client.publish("task_updates", json.dumps({"event": "tasks_updated", "tasks": tasks}))
        
        return {"tasks": tasks, "source": "voice"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/tasks/add")
async def add_task(data: dict):
    """
    Adds a new task based on structured data and notifies frontend.
    """
    try:
        day = data.get("day")
        task_text = data.get("task")
        
        if not day or not task_text:
            raise HTTPException(status_code=400, detail="Missing task or day")

        # Map day to actual date
        mapped_date = task_agent.map_day_to_date(day)
        logger.info(f"Mapping '{day}' to date: {mapped_date}")

        # Create a new task object matching the frontend structure
        new_task = {
            "id": f"task_{datetime.now().timestamp()}",
            "text": task_text,
            "done": False,
            "date": mapped_date,
            "completedAt": None,
            "source": "voice",
            "type": data.get("type", "personal"),
            "energy_required": "medium",
            "difficulty": "medium",
            "tags": [],
            "priority": 3
        }

        # Save to Supabase database
        saved_task = await save_task_to_supabase(new_task)
        if saved_task:
            new_task["id"] = saved_task["id"]  # Use the real ID from database
            logger.info(f"Task saved to database with ID: {saved_task['id']}")
        else:
            logger.warning("Failed to save task to database, but continuing with local task")

        # We need to wrap it in the format App.jsx expects
        task_update_payload = {
            "tasks": [new_task]
        }
        
        # Publish the update to Redis
        if redis_client:
            redis_client.publish("task_updates", json.dumps({"event": "task_added", "tasks": task_update_payload}))
        
        return {"success": True, "message": f"Successfully added '{task_text}' to {day} ({mapped_date})", "task": new_task}
    except Exception as e:
        logger.error(f"Error adding task: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/tasks/remove")
async def remove_task(data: dict):
    """
    Removes a task. Note: This is a conceptual implementation.
    A real implementation would require a way to identify the task to remove (e.g., by ID).
    """
    try:
        # For this to work, VAPI would need to know the task ID.
        # This would require a more complex conversational flow.
        task_id_to_remove = data.get("taskId")
        
        # Here you would delete the task from the database
        
        # Then notify the frontend
        if redis_client:
            redis_client.publish("task_updates", json.dumps({"event": "task_removed", "taskId": task_id_to_remove}))
        
        return {"success": True, "message": "Task removal processed."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/focus/analyze")
async def analyze_focus(data: dict):
    """Analyze focus level using Groq for real-time processing"""
    try:
        focus_data = focus_agent.analyze_focus_level(data)
        return {"focus_level": focus_data, "suggestions": focus_agent.get_adhd_suggestions()}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/motivate")
async def get_motivation(data: dict):
    """Get personalized ADHD motivation using Letta memory"""
    try:
        motivation = motivate_agent.get_personalized_motivation(
            user_id=data["user_id"],
            current_mood=data.get("mood"),
            recent_tasks=data.get("tasks", [])
        )
        return {"motivation": motivation, "personalized": True}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/mood/update")
async def update_mood(data: dict):
    """Update mood from voice command"""
    try:
        mood = data.get("mood")
        source = data.get("source", "manual")
        timestamp = data.get("timestamp", datetime.now().isoformat())
        
        # Store mood data
        mood_data = {
            "mood": mood,
            "source": source,
            "timestamp": timestamp,
            "confidence": 0.9  # High confidence for manual updates
        }
        
        # Broadcast to frontend if Redis available
        if redis_client:
            redis_client.publish("mood_updates", json.dumps(mood_data))
        
        return {"success": True, "mood": mood_data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/analyze/productivity")
async def analyze_productivity(data: dict):
    """Analyze productivity and provide suggestions"""
    try:
        tasks = data.get("tasks", [])
        current_mood = data.get("currentMood", "neutral")
        
        # Use task agent to analyze productivity
        analysis = task_agent.analyze_productivity(tasks, current_mood)
        
        return {
            "success": True,
            "analysis": analysis,
            "suggestion": analysis.get("suggestion", "Keep up the great work! Focus on completing your highest priority tasks."),
            "productivity_score": analysis.get("score", 75)
        }
    except Exception as e:
        logger.error(f"Error analyzing productivity: {e}")
        return {
            "success": True,
            "suggestion": "Based on your current tasks, I recommend taking a short break and then focusing on your most important task.",
            "productivity_score": 70
        }

@app.post("/process/general")
async def process_general_query(data: dict):
    """Process general voice queries with AI"""
    try:
        query = data.get("query", "")
        
        # Use motivate agent for general conversation
        response = motivate_agent.process_general_query(query)
        
        return {
            "success": True,
            "response": response,
            "query": query
        }
    except Exception as e:
        logger.error(f"Error processing general query: {e}")
        return {
            "success": True,
            "response": "I understand you're trying to communicate with me. You can ask me to add tasks, change your mood, or analyze your productivity.",
            "query": query
        }

@app.get("/debug/voice-notes")
async def debug_voice_notes():
    """Debug endpoint to return all voice notes (dummy data if DB not available)"""
    # TODO: Replace with real DB query if/when available
    dummy_notes = [
        {"id": 1, "user_id": "demo", "transcript": "Buy groceries", "timestamp": "2024-06-22T10:00:00Z"},
        {"id": 2, "user_id": "demo", "transcript": "Call Dr. Smith", "timestamp": "2024-06-22T11:00:00Z"},
        {"id": 3, "user_id": "admin", "transcript": "Schedule meeting", "timestamp": "2024-06-22T12:00:00Z"}
    ]
    return {"voice_notes": dummy_notes}

@app.get("/debug/day-mapping/{day}")
async def debug_day_mapping(day: str):
    """Debug endpoint to test day to date mapping"""
    mapped_date = task_agent.map_day_to_date(day)
    return {
        "input_day": day,
        "mapped_date": mapped_date,
        "current_date": datetime.now().strftime("%Y-%m-%d"),
        "day_of_week": datetime.now().strftime("%A")
    }

@app.get("/debug/tasks")
async def debug_tasks():
    """Debug endpoint to return all tasks from database"""
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{SUPABASE_URL}/rest/v1/tasks",
                headers={
                    "apikey": SUPABASE_ANON_KEY,
                    "Authorization": f"Bearer {SUPABASE_ANON_KEY}",
                    "Content-Type": "application/json"
                }
            )
            
            if response.status_code == 200:
                tasks = response.json()
                return {"tasks": tasks, "count": len(tasks)}
            else:
                return {"error": f"Failed to fetch tasks: {response.status_code}", "tasks": []}
    except Exception as e:
        return {"error": str(e), "tasks": []}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
