#!/bin/bash

echo "🚀 Starting NeuroBoost Development Environment..."

# Check if .env exists
if [ ! -f .env ]; then
    echo "⚠️  No .env file found. Creating from template..."
    if [ -f .env.example ]; then
        cp .env.example .env
        echo "✅ Created .env file from template"
        echo "🔑 Please edit .env file with your API keys before continuing"
        echo "📝 Required keys: ANTHROPIC_API_KEY, GOOGLE_GEMINI_API_KEY, VAPI_API_KEY, GROQ_API_KEY, LETTA_API_KEY, ORKES_API_KEY"
        exit 1
    else
        echo "❌ No .env.example found. Please create a .env file manually."
        exit 1
    fi
fi

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker and try again."
    exit 1
fi

echo "🐳 Starting Docker containers..."
docker-compose up --build

echo "🎉 NeuroBoost is running!"
echo ""
echo "🌐 Access Points:"
echo "   Frontend:        http://localhost:8080"
echo "   API Gateway:     http://localhost:3000"
echo "   AI Agents:       http://localhost:8000"
echo "   Voice Service:   http://localhost:8002"
echo "   Workflow Engine: http://localhost:8003"
echo "   Analytics:       http://localhost:8001"
echo ""
echo "🗄️  Database:"
echo "   PostgreSQL:      localhost:5432"
echo "   Redis:           localhost:6379"
echo ""
echo "Press Ctrl+C to stop all services"

# Set PYTHONPATH to include the project root directory.
# This ensures that all modules can be found by Python.
export PYTHONPATH=.

# Activate the virtual environment and run the server.
# Using python -m ensures that uvicorn is run from the venv.
venv/bin/python -m uvicorn api-gateway.main:app --reload --port 8000 