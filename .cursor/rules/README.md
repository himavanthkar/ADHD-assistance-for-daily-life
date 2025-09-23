# NeuroBoost Project Context

## 🧠 About NeuroBoost

NeuroBoost is an AI-powered ADHD productivity platform that combines voice assistants, mood detection, task management, and focus tracking. Built with a microservices architecture using React, Python, and multiple AI providers.

## 🏗️ Architecture Overview

**Frontend**: React/Next.js with TailwindCSS
- Location: `frontend/`
- Entry: `frontend/src/main.jsx`
- Key Components: VoiceAssistantWidget, TaskManager, MoodDetector

**Backend Services**:
- **API Gateway** (`api-gateway/`): Central routing & auth
- **AI Agents** (`ai-agents/`): Multi-LLM system (Claude, Gemini, Groq)
- **Voice Service** (`voice-service/`): Vapi integration
- **Workflow Engine** (`workflow-engine/`): Orkes orchestration
- **Analytics** (`analytics/`): Data processing

## 🎯 Key Features

1. **Voice-to-Task**: Convert speech to organized tasks using Vapi + AI
2. **Mood Detection**: Analyze emotional state from voice/text patterns
3. **Smart Task Management**: Auto-categorization and prioritization
4. **Focus Tracking**: Real-time attention monitoring
5. **Adaptive UI**: Dynamic themes based on user mood

## 🔧 Development Guidelines

**Port Allocation**:
- Frontend: 8080
- API Gateway: 3000
- AI Agents: 8000
- Voice Service: 8002
- Workflow Engine: 8003
- Analytics: 8001
- Database: 5432 (PostgreSQL), 6379 (Redis)

**Key Technologies**:
- **AI/ML**: Anthropic Claude, Google Gemini, Groq, Letta
- **Voice**: Vapi for speech processing
- **Database**: PostgreSQL + Redis + Supabase
- **Orchestration**: Docker Compose + Orkes Conductor

**Environment Variables**:
Critical API keys: `ANTHROPIC_API_KEY`, `GOOGLE_GEMINI_API_KEY`, `VAPI_API_KEY`, `GROQ_API_KEY`, `LETTA_API_KEY`, `ORKES_API_KEY`

## 📁 Important Files

- `run_app.py`: Main application launcher
- `start.sh`: Development environment setup
- `docker-compose.yml`: Service orchestration
- `test_voice_integration.py`: Integration testing
- `NEUROBOOST_SETUP.md`: Detailed setup guide

## 🎪 Contest Context

Built for multiple prize categories:
- Productivity Tools ($5,000)
- Best use of Claude 4, Gemini, Vapi, Groq, Letta, Orkes
- Target: $15,250+ in prizes

## 🔄 Common Tasks

**Starting Services**: `python run_app.py` or `./start.sh`
**Testing**: `python test_voice_integration.py`
**Frontend Dev**: `cd frontend && npm run dev`
**Database Setup**: `python setup_supabase_auto.py`

When working on this project, prioritize ADHD-friendly features like clear feedback, voice interfaces, and adaptive user experiences.
