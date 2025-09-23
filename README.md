# 🧠 NeuroBoost - AI-Powered ADHD Productivity Platform

NeuroBoost is an intelligent productivity platform designed specifically for individuals with ADHD. It combines voice assistants, mood detection, task management, and AI-powered focus tracking to create a comprehensive support system for daily productivity.

## ✨ Features

- **🎤 Voice-to-Task Integration**: Convert spoken instructions into organized tasks
- **🎭 Mood Detection**: AI-powered emotional state analysis with adaptive theming
- **📋 Intelligent Task Management**: Smart task organization with priority detection
- **🎯 Focus Tracking**: Real-time focus level monitoring and recommendations
- **💪 Personalized Motivation**: Context-aware motivational support
- **🎨 Adaptive UI**: Dynamic themes that respond to user mood and preferences

## 🚀 Quick Start

### Prerequisites
- Docker and Docker Compose
- Node.js 18+ (for frontend development)
- Python 3.9+ (for AI services)

### 1. Environment Setup
```bash
# Copy environment template
cp .env.example .env

# Edit .env with your API keys
# Required: ANTHROPIC_API_KEY, GOOGLE_GEMINI_API_KEY, VAPI_API_KEY, GROQ_API_KEY, LETTA_API_KEY, ORKES_API_KEY
```

### 2. Start All Services
```bash
# Option 1: Using the start script
./start.sh

# Option 2: Using Python runner
python run_app.py

# Option 3: Direct Docker Compose
docker-compose up --build
```

### 3. Access the Application
- **Frontend**: http://localhost:8080
- **API Gateway**: http://localhost:3000
- **AI Agents**: http://localhost:8000
- **Voice Service**: http://localhost:8002
- **Workflow Engine**: http://localhost:8003
- **Analytics**: http://localhost:8001

### 4. Test Integration
```bash
python test_voice_integration.py
```

## 🏗️ Architecture

NeuroBoost uses a microservices architecture with the following components:

- **Frontend**: React/Next.js with Tailwind CSS
- **API Gateway**: Central routing and authentication
- **AI Agents**: Multi-LLM agent system (Anthropic Claude, Groq, Google Gemini)
- **Voice Service**: Vapi-powered voice processing
- **Workflow Engine**: Orkes-based workflow automation
- **Analytics**: PostgreSQL + Redis data layer

## 🔧 Development

### Frontend Development
```bash
cd frontend
npm install
npm run dev
```

### Backend Services
```bash
# AI Agents
cd ai-agents
pip install -r requirements.txt
uvicorn main:app --reload --port 8000

# Voice Service
cd voice-service
pip install -r requirements.txt
uvicorn main:app --reload --port 8002
```

### Database Setup
```bash
# Automatic setup
python setup_supabase_auto.py

# Manual setup
./setup_supabase.sh
```

## 📱 Usage

1. **Voice Commands**: Click the microphone button and say things like:
   - "Add workout session to Monday"
   - "Remove grocery shopping from Tuesday"
   - "Set reminder to call mom at 3pm"

2. **Mood Detection**: The system automatically detects your emotional state from:
   - Voice tone and patterns
   - Text input analysis
   - Usage patterns

3. **Task Management**: Tasks are automatically categorized and prioritized based on:
   - Content analysis
   - Historical patterns
   - Current mood state

## 🏆 Prize Categories Targeted

This project is designed to compete in multiple hackathon categories:

1. **Productivity and Dev Tools Track** ($5,000) - Main category
2. **Anthropic: Best Use of Claude 4** ($2,500 API credits)
3. **Google: Best Use of Gemini** (Google Pixel Watches)
4. **Vapi: Best Voice-Powered AI Project** (500 credits)
5. **Vapi: Most Ambitious Vapi Project** ($250 + 1000 credits)
6. **Groq: Best Creative Use of Groq** ($500 API credits + interview)
7. **Letta: Most Creative Usage of Letta** (AirPods 4)
8. **Orkes: Best Use of Orkes** ($200)
9. **Unify: Best Use of Multimodal AI Agent** ($2,500)

**Total Potential Winnings**: $15,250+ plus hardware prizes

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Anthropic** for Claude 4 AI capabilities
- **Google** for Gemini multimodal AI
- **Vapi** for voice processing infrastructure
- **Groq** for fast inference capabilities
- **Letta** for persistent agent memory
- **Orkes** for workflow orchestration
- **Supabase** for database and real-time features

## 📞 Support

For support, email your-email@example.com or join our community Discord.

---

**Built with ❤️ for the ADHD community**