#!/usr/bin/env python3
"""
NeuroBoost Application Launcher
Starts all services and provides a unified entry point
"""
import subprocess
import time
import requests
import os
import signal
import sys
from pathlib import Path

class NeuroBoostLauncher:
    def __init__(self):
        self.processes = []
        self.base_dir = Path(__file__).parent
        
    def start_service(self, name, command, cwd=None):
        """Start a service with given command"""
        print(f"🚀 Starting {name}...")
        if cwd is None:
            cwd = self.base_dir
        
        process = subprocess.Popen(
            command,
            shell=True,
            cwd=cwd,
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT,
            text=True,
            bufsize=1
        )
        self.processes.append((name, process))
        return process
    
    def check_health(self, url, name):
        """Check if service is healthy"""
        try:
            response = requests.get(url, timeout=5)
            if response.status_code == 200:
                print(f"✅ {name} is running - {url}")
                return True
        except:
            pass
        print(f"❌ {name} failed to start - {url}")
        return False
    
    def start_all_services(self):
        """Start all NeuroBoost services"""
        print("🎯 NeuroBoost App Launcher")
        print("=" * 40)
        
        # Start AI Agents
        self.start_service(
            "AI Agents",
            "python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload",
            cwd=self.base_dir / "ai_agents"
        )
        
        # Start Voice Service  
        self.start_service(
            "Voice Service",
            "python -m uvicorn main:app --host 0.0.0.0 --port 8002 --reload", 
            cwd=self.base_dir / "voice-service"
        )
        
        # Start Frontend
        self.start_service(
            "Frontend",
            "npm run dev",
            cwd=self.base_dir / "frontend"
        )
        
        print("⏳ Waiting for services to start...")
        time.sleep(8)
        
        # Test services
        print("🧪 Testing Services...")
        frontend_ok = self.check_health("http://localhost:3000", "Frontend")
        ai_agents_ok = self.check_health("http://localhost:8000/health", "AI Agents")
        voice_ok = self.check_health("http://localhost:8002/health", "Voice Service")
        
        print("\n🌐 Access URLs:")
        print(f"  Frontend:     http://localhost:3000")
        print(f"  AI Agents:    http://localhost:8000")
        print(f"  Voice Service: http://localhost:8002")
        
        if frontend_ok and ai_agents_ok and voice_ok:
            print("\n✅ All services started successfully!")
            print("🔑 Login with: demo@neuroboost.com / demo123")
            print("✨ Press Ctrl+C to stop all services")
        else:
            print("\n⚠️  Some services failed to start. Check the logs above.")
        
        return frontend_ok and ai_agents_ok and voice_ok

def main():
    launcher = NeuroBoostLauncher()
    if launcher.start_all_services():
        try:
            # Keep running
            while True:
                time.sleep(1)
        except KeyboardInterrupt:
            print("\n🛑 Stopping all services...")
            for name, proc in launcher.processes:
                print(f"   Stopping {name}...")
                proc.terminate()
            print("✅ All services stopped")
    else:
        print("❌ Some services failed to start. Please check the logs above.")

if __name__ == "__main__":
    main() 