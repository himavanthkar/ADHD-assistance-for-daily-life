# ADHD-Aware Productivity Assistant (NeuroBoost)

Modern knowledge work rewards output but penalizes cognition. NeuroBoost is a system that treats attention as a managed resource and productivity as a closed loop between human behavior and machine intelligence. The platform ingests unstructured inputs such as voice, email, and calendar artifacts, synthesizes them into task graphs, and generates schedules that reoptimize as the user context shifts. It observes stress and focus signals across modalities and adapts interface and cadence in real time. It was engineered to feel simple while running a layered architecture that spans reasoning models, workflow orchestration, and cloud primitives. The intent is practical leverage for neurodiverse and high performance users without adding another tool to babysit.

---

## Features
- Automated task ingestion from email and calendar with conflict-aware scheduling  
- Voice to notes to timetable pipeline with adaptive rescheduling  
- Multimodal stress and mood detection across voice, face, and keystrokes  
- Gamified progress tracking for sustained engagement  
- Cloud-native deployment with secure defaults  

---

## Architecture
At a glance, NeuroBoost runs as a set of cooperating services:

- Frontend: React/Next.js user interface  
- API Gateway: request routing, sponsor integrations, and authentication  
- AI Agents: reasoning, inference, and persistent agent memory  
- Voice Service: telephony and voice processing  
- Workflow Engine: orchestration and long-running jobs  
- Analytics: optional knowledge graph and insights  
- Core Infrastructure: PostgreSQL database and Redis cache  

**Note**: Only the API Gateway and Frontend are exposed publicly. Databases, caches, and worker services are kept private on the internal bridge network to ensure security.

---

## APIs and Integrations
- Anthropic Claude for complex reasoning  
- Groq for low-latency inference  
- Google Gemini for multimodal reasoning  
- Vapi for telephony and real-time voice  
- Letta for persistent agent memory  
- Orkes for workflow orchestration  
- Email and Calendar APIs for task ingestion and scheduling  

---

## Running Locally
1. Create a `.env` file at the root with required keys (example: POSTGRES_USER, POSTGRES_PASSWORD, ANTHROPIC_API_KEY, etc.).  
2. Build and start services:  
   ```bash
   docker compose up --build
