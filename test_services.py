#!/usr/bin/env python3
import requests
import time

def test_service(name, url):
    try:
        response = requests.get(url, timeout=5)
        print(f"✅ {name}: {response.status_code} - {url}")
        return True
    except Exception as e:
        print(f"❌ {name}: ERROR - {e}")
        return False

def main():
    print("🧪 Testing NeuroBoost Services...")
    print("=" * 50)
    
    services = [
        ("API Gateway", "http://localhost:3001/health"),
        ("AI Agents", "http://localhost:8000/health"),
        ("Voice Service", "http://localhost:8002/health"),
    ]
    
    for name, url in services:
        test_service(name, url)
        time.sleep(1)
    
    print("\n🔗 Service URLs:")
    print("  API Gateway:  http://localhost:3001")
    print("  AI Agents:    http://localhost:8000")
    print("  Voice Service: http://localhost:8002")

if __name__ == "__main__":
    main() 