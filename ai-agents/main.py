from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from dotenv import load_dotenv
import os

load_dotenv()

app = FastAPI(
    title="NeuroBoost AI Agents Service",
    description="Service to manage and interact with various AI agents.",
    version="1.0.0"
)

class ChatRequest(BaseModel):
    message: str
    user_id: str = None

@app.get("/")
def read_root():
    return {"message": "AI Agents service is running"}

@app.get("/status")
def get_status():
    return {
        "status": "healthy",
        "service": "ai-agents",
        "version": "1.0.0"
    }

@app.post("/chat")
def chat_with_ai(request: ChatRequest):
    # Basic response - you can enhance this with actual AI integration
    return {
        "response": f"AI Agent received: {request.message}",
        "user_id": request.user_id,
        "timestamp": "2024-01-01T00:00:00Z"
    }

# You can add routes for different agents here
# For example: /chat, /summarize, /analyze-emotion 