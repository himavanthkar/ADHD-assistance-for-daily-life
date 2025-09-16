import React from 'react';

const VoiceFeatureDebug = () => {
  const voiceAssistantWidgetCode = `
import React, { useState, useEffect } from 'react';
import Vapi from '@vapi-ai/web';

const vapi = new Vapi(import.meta.env.VITE_VAPI_PUBLIC_KEY || '38a5bc22-1c43-4d10-95b6-29dcad2aa65d');

const vapiAssistantConfig = {
  model: {
    provider: "openai",
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content: \`You are a helpful task management assistant for the NeuroBoost app. 
        You can help users add, modify, and manage their tasks for different days of the week.
        When users want to add tasks, use the addTask function. When they want to remove one, use removeTask.
        Be conversational and confirm actions taken.\`
      }
    ]
  },
  voice: {
    provider: "elevenlabs",
    voiceId: "pNInz6obpgDQGcFmaJgB"
  },
  functions: [
    {
      name: "addTask",
      description: "Add a new task to a specific day of the week",
      parameters: {
        type: "object",
        properties: {
          task: { type: "string", description: "The task description or title" },
          day: { type: "string", description: "Day of the week", enum: ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"] },
          type: { type: "string", description: "Type of task (workout, assignment, etc.)", default: "general" }
        },
        required: ["task", "day"]
      }
    },
    {
      name: "removeTask",
      description: "Remove a task from a specific day",
      parameters: {
        type: "object",
        properties: {
          task: { type: "string", description: "The task to remove" },
          day: { type: "string", description: "Day of the week" }
        },
        required: ["task", "day"]
      }
    }
  ],
  serverUrl: "https://2b59-2607-f140-400-39-3071-598e-3edf-4736.ngrok-free.app/vapi-webhook"
};


const VoiceAssistantWidget = () => {
    const [isCallActive, setIsCallActive] = useState(false);

    useEffect(() => {
        vapi.on('call-start', () => setIsCallActive(true));
        vapi.on('call-end', () => setIsCallActive(false));
        vapi.on('error', (e) => {
            console.error('VAPI Error:', e);
            setIsCallActive(false);
        });

        return () => {
            vapi.removeAllListeners();
        };
    }, []);

    const handleVoiceCall = () => {
        if (isCallActive) {
            vapi.stop();
        } else {
            vapi.start(vapiAssistantConfig);
        }
    };

    return (
        <div className="fixed bottom-10 right-10 z-50">
            <button
                onClick={handleVoiceCall}
                className={\`w-24 h-24 rounded-full text-white shadow-lg transition-all duration-300 ease-in-out flex items-center justify-center
          \${isCallActive ? 'bg-red-500 animate-pulse' : 'bg-green-500 hover:bg-green-600'}\`}
                aria-label={isCallActive ? 'End call' : 'Start voice assistant'}
            >
                {isCallActive ?
                    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.636 18.364a9 9 0 010-12.728m2.828 9.9a5 5 0 010-7.072" /></svg>
                    :
                    <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20"><path d="M7 4a3 3 0 016 0v6a3 3 0 11-6 0V4zm5 9.5a.5.5 0 01.5.5h-5a.5.5 0 010-1h4.5zM3 9a1 1 0 00-1 1v1a7 7 0 0014 0v-1a1 1 0 10-2 0v1a5 5 0 01-10 0v-1a1 1 0 00-1-1z" /></svg>
                }
            </button>
        </div>
    );
};

export default VoiceAssistantWidget;
  `;

  const voiceServiceCode = `
import os
import json
import hmac
import hashlib
from typing import Dict, Any, Optional

from fastapi import FastAPI, Request, HTTPException
from pydantic import BaseModel
from dotenv import load_dotenv
import httpx

# Load environment variables from .env file
load_dotenv()

import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="Voice Service")

AI_AGENTS_URL = os.getenv("AI_AGENTS_URL", "http://ai-agents:8000")
VAPI_WEBHOOK_SECRET = os.getenv("VAPI_WEBHOOK_SECRET", "your_webhook_secret_here")

# --- VAPI Webhook Models ---

class VAPIFunctionCall(BaseModel):
    name: str
    parameters: Dict[str, Any]

class VAPIMessage(BaseModel):
    type: str
    call: Optional[Dict] = None
    transcript: Optional[str] = None
    functionCall: Optional[VAPIFunctionCall] = None

class VAPIWebhookRequest(BaseModel):
    message: VAPIMessage

def verify_vapi_signature(payload: bytes, signature: Optional[str], secret: str) -> bool:
    """Verify the signature of a VAPI webhook request."""
    if not signature:
        return False
    
    mac = hmac.new(secret.encode('utf-8'), msg=payload, digestmod=hashlib.sha256)
    return hmac.compare_digest(mac.hexdigest(), signature)

# --- Task Processing Logic ---

async def forward_function_call_to_ai_agent(function_name: str, parameters: Dict[str, Any]) -> Dict[str, Any]:
    """
    Forwards a function call to the appropriate endpoint on the AI Agents service.
    """
    endpoint_map = {
        "addTask": "/tasks/add",
        "removeTask": "/tasks/remove"
    }
    
    endpoint = endpoint_map.get(function_name)
    if not endpoint:
        logger.warning(f"No endpoint mapping for function: {function_name}")
        return {"success": False, "message": f"Unknown function '{function_name}'"}

    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{AI_AGENTS_URL}{endpoint}",
                json=parameters
            )
            response.raise_for_status()
            return response.json()
    except httpx.HTTPStatusError as e:
        logger.error(f"HTTP error calling AI agent for {function_name}: {e.response.text}")
        return {"success": False, "message": f"Error processing {function_name}: {e.response.text}"}
    except Exception as e:
        logger.error(f"Error forwarding function call '{function_name}': {e}", exc_info=True)
        return {"success": False, "message": "An internal error occurred."}

# --- API Endpoints ---

@app.get("/")
def read_root():
    return {"message": "Voice service is running"}

@app.post("/vapi-webhook")
async def vapi_webhook(request: Request, payload: VAPIWebhookRequest):
    """
    Enhanced webhook handler for VAPI web widget integration.
    """
    message = payload.message
    logger.info(f"Received webhook of type: {message.type}")
    
    if message.type == "function-call" and message.functionCall:
        function_name = message.functionCall.name
        parameters = message.functionCall.parameters
        
        logger.info(f"Executing function: {function_name} with params: {parameters}")
        
        result = await forward_function_call_to_ai_agent(function_name, parameters)
        
        return {"result": result.get("message", "Action completed.")}

    elif message.type == "transcript" and message.transcript:
        logger.info(f"Processed transcript directly: {message.transcript}")
        return {"status": "transcript_received"}
    
    elif message.type == "end-of-call-report":
        call_data = message.call or {}
        logger.info(f"Call ended. Duration: {call_data.get('duration', 'unknown')}")
        return {"status": "end_of_call_logged"}
    
    return {"status": "acknowledged"}
  `;

  const aiAgentsCode = `
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import os
from dotenv import load_dotenv
import redis
import json
import logging
from agents.mood_agent import MoodAgent
from agents.task_agent import TaskAgent
from agents.focus_agent import FocusAgent
from agents.motivate_agent import MotivateAgent
from datetime import datetime

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

# Redis for real-time mood updates
redis_host = os.getenv("REDIS_HOST", "localhost")
redis_port = int(os.getenv("REDIS_PORT", 6379))
redis_password = os.getenv("REDIS_PASSWORD")
redis_client = redis.Redis(host=redis_host, port=redis_port, password=redis_password, decode_responses=True)

# Initialize AI Agents
mood_agent = MoodAgent()
task_agent = TaskAgent()
focus_agent = FocusAgent()
motivate_agent = MotivateAgent()

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

        new_task = {
            "id": f"task_{datetime.now().timestamp()}",
            "text": task_text,
            "done": False,
            "date": task_agent.map_day_to_date(day), 
            "completedAt": None,
            "source": "vapi"
        }

        task_update_payload = {
            "tasks": [new_task]
        }
        
        redis_client.publish("task_updates", json.dumps({"event": "task_added", "tasks": task_update_payload}))
        
        return {"success": True, "message": f"Successfully added '{task_text}' to {day}", "task": new_task}
    except Exception as e:
        logger.error(f"Error adding task: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))
  `;

  return (
    <div>
      <h1>Voice Feature Implementation Summary</h1>
      <p>This document outlines the end-to-end implementation of the voice recognition feature, which allows users to add tasks via voice commands. The feature is composed of three main parts: the frontend widget, a <code>voice-service</code> to handle webhooks, and an <code>ai-agents</code> service to process commands.</p>

      <h2>1. Frontend: <code>frontend/src/components/VoiceAssistantWidget.jsx</code></h2>
      <pre>
        <code>{voiceAssistantWidgetCode}</code>
      </pre>

      <h2>2. Backend: <code>voice-service/main.py</code></h2>
      <pre>
        <code>{voiceServiceCode}</code>
      </pre>

      <h2>3. Backend: <code>ai_agents/main.py</code></h2>
      <pre>
        <code>{aiAgentsCode}</code>
      </pre>
    </div>
  );
};

export default VoiceFeatureDebug; 