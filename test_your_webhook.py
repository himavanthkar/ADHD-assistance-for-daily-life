# test_your_webhook.py
import requests
import json
import os

# --- Configuration ---
# Make sure your local server is running and change the port if needed.
BASE_URL = os.getenv("VOICE_SERVICE_URL", "http://localhost:8002")
# --- End Configuration ---

def run_test(test_name, test_function):
    print(f"\n📝 Running Test: {test_name}...")
    try:
        response_json = test_function()
        print(f"✅ {test_name} passed")
        print(f"Response: {json.dumps(response_json, indent=2)}\n")
        return True
    except Exception as e:
        print(f"❌ {test_name} failed with an exception: {e}")
        return False

def test_health_check():
    """Tests if the main endpoint is alive."""
    response = requests.get(BASE_URL + "/")
    response.raise_for_status()
    return response.json()

def test_direct_agent():
    """Test the direct agent endpoint with a sample transcript."""
    response = requests.post(
        BASE_URL + "/test-agent",
        json={"transcript": "add a task to buy milk"}
    )
    response.raise_for_status()
    return response.json()


def test_transcript_final():
    """Simulates a `transcript-final` type webhook from VAPI."""
    payload = {
        "message": {
            "type": "transcript",
            "transcript": "This is a final transcript.",
            "transcriptType": "final"
        }
    }
    response = requests.post(BASE_URL + "/vapi-webhook", json=payload)
    response.raise_for_status()
    return response.json()


def test_function_call():
    """Simulates a `function-call` type webhook from VAPI."""
    payload = {
        "message": {
            "type": "function-call",
            "functionCall": {
                "name": "addTask",
                "parameters": {"task": "buy groceries", "day": "saturday"}
            }
        }
    }
    response = requests.post(BASE_URL + "/vapi-webhook", json=payload)
    response.raise_for_status()
    return response.json()

# --- Main Execution ---
if __name__ == "__main__":
    print("🧪 Testing Your VAPI Integration")
    print("=" * 50)
    
    results = {
        "Health Check": run_test("Health Check", test_health_check),
        "Direct Agent Test": run_test("Direct Agent Test", test_direct_agent),
        "Transcript Final": run_test("Transcript Final", test_transcript_final),
        "Tool Call": run_test("Tool Call", test_function_call)
    }
    
    print("=" * 50)
    print("📊 Test Results Summary:")
    for test_name, success in results.items():
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"  {status} - {test_name}")
    
    print("-" * 50)
    
    if all(results.values()):
        print("✅ All tests passed!")
    else:
        print("🔥 Some tests failed. Please review the output above.")
        
    print("\n🚀 Next Steps:")
    print("1. Make sure your server is running in another terminal: uvicorn voice-service.main:app --reload --port 8002")
    print("2. Run this script to verify functionality: python test_your_webhook.py")
    print("3. Use ngrok to expose your webhook: ngrok http 8002")
    print("4. Configure VAPI with your ngrok URL + /vapi-webhook")