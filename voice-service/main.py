import os
import json
from typing import Dict, Any, Optional
from fastapi import FastAPI, Request, HTTPException, Header
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
import httpx
import logging

# Load environment variables
load_dotenv()

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="Voice Service", version="1.0.0")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure this properly for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configuration
AI_AGENTS_URL = os.getenv("AI_AGENTS_URL", "http://localhost:8000")  # Fixed port to 8000
VAPI_WEBHOOK_SECRET = os.getenv("VAPI_WEBHOOK_SECRET")

# --- Pydantic Models ---

class TaskRequest(BaseModel):
    task: str
    day: str
    type: Optional[str] = "general"

class RemoveTaskRequest(BaseModel):
    task: str
    day: str

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
        timeout = httpx.Timeout(30.0)  # 30 second timeout
        async with httpx.AsyncClient(timeout=timeout) as client:
            logger.info(f"Forwarding {function_name} to {AI_AGENTS_URL}{endpoint}")
            logger.info(f"Parameters: {parameters}")
            
            response = await client.post(
                f"{AI_AGENTS_URL}{endpoint}",
                json=parameters,
                headers={"Content-Type": "application/json"}
            )
            
            logger.info(f"Response status: {response.status_code}")
            
            if response.status_code == 200:
                result = response.json()
                logger.info(f"Success response: {result}")
                return result
            else:
                error_text = response.text
                logger.error(f"HTTP error {response.status_code}: {error_text}")
                return {"success": False, "message": f"Error processing {function_name}: {error_text}"}
                
    except httpx.TimeoutException:
        logger.error(f"Timeout calling AI agent for {function_name}")
        return {"success": False, "message": f"Request timeout for {function_name}"}
    except httpx.ConnectError:
        logger.error(f"Connection error calling AI agent for {function_name}")
        return {"success": False, "message": f"Cannot connect to AI agents service"}
    except Exception as e:
        logger.error(f"Error forwarding function call '{function_name}': {e}", exc_info=True)
        return {"success": False, "message": "An internal error occurred."}

# --- API Endpoints ---

@app.get("/")
def read_root():
    return {"message": "Voice service is running", "version": "1.0.0"}

@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "voice-service"}

@app.post("/tasks/add")
async def add_task_direct(task_request: TaskRequest):
    """
    Direct endpoint for adding tasks (used by frontend)
    """
    try:
        logger.info(f"Direct task add request: {task_request}")
        
        parameters = {
            "task": task_request.task,
            "day": task_request.day,
            "type": task_request.type
        }
        
        result = await forward_function_call_to_ai_agent("addTask", parameters)
        
        if result.get("success", False):
            return result
        else:
            raise HTTPException(status_code=400, detail=result.get("message", "Failed to add task"))
            
    except Exception as e:
        logger.error(f"Error in direct task add: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/tasks/remove")
async def remove_task_direct(remove_request: RemoveTaskRequest):
    """
    Direct endpoint for removing tasks (used by frontend)
    """
    try:
        logger.info(f"Direct task remove request: {remove_request}")
        
        parameters = {
            "task": remove_request.task,
            "day": remove_request.day
        }
        
        result = await forward_function_call_to_ai_agent("removeTask", parameters)
        
        if result.get("success", False):
            return result
        else:
            raise HTTPException(status_code=400, detail=result.get("message", "Failed to remove task"))
            
    except Exception as e:
        logger.error(f"Error in direct task remove: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/vapi-webhook")
async def vapi_webhook(request: Request, payload: VAPIWebhookRequest):
    """
    Webhook handler for VAPI (if needed for server-side processing)
    """
    try:
        message = payload.message
        logger.info(f"Received VAPI webhook of type: {message.type}")
        
        if message.type == "function-call" and message.functionCall:
            function_name = message.functionCall.name
            parameters = message.functionCall.parameters
            
            logger.info(f"Processing VAPI function: {function_name} with params: {parameters}")
            
            result = await forward_function_call_to_ai_agent(function_name, parameters)
            
            return {
                "result": result.get("message", "Action completed."),
                "success": result.get("success", False)
            }

        elif message.type == "transcript" and message.transcript:
            logger.info(f"Received transcript: {message.transcript}")
            return {"status": "transcript_received"}
        
        elif message.type == "end-of-call-report":
            call_data = message.call or {}
            logger.info(f"Call ended. Duration: {call_data.get('duration', 'unknown')}")
            return {"status": "end_of_call_logged"}
        
        return {"status": "acknowledged"}
        
    except Exception as e:
        logger.error(f"Error processing VAPI webhook: {e}", exc_info=True)
        return {"status": "error", "message": str(e)}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)