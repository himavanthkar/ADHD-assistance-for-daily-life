const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const app = express();

// --- Middleware ---
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- Test Routes (no database required) ---
app.get('/', (req, res) => {
  res.json({
    message: 'NeuroBoost API Gateway is running! 🚀',
    status: 'healthy',
    timestamp: new Date().toISOString(),
    endpoints: {
      health: 'GET /health',
      webhook: 'POST /vapi-webhook',
      auth: {
        register: 'POST /api/auth/register',
        login: 'POST /api/auth/login'
      },
      ai: {
        status: 'GET /api/ai/status',
        chat: 'POST /api/ai/chat'
      },
      tasks: 'GET /api/tasks'
    }
  });
});

// Basic health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok', 
    message: 'API Gateway is healthy',
    uptime: process.uptime(),
    memory: process.memoryUsage()
  });
});

// VAPI Webhook Endpoint
app.post('/vapi-webhook', (req, res) => {
  console.log('Received webhook call:', JSON.stringify(req.body, null, 2));

  const { message } = req.body;

  if (message) {
    return res.status(200).json({
      message: "Webhook received successfully.",
      received: message,
      timestamp: new Date().toISOString()
    });
  }

  return res.status(400).json({ error: 'Invalid payload' });
});

// Mock auth endpoints (for testing without database)
app.post('/api/auth/register', (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  
  if (!(email && password && firstName && lastName)) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  
  res.status(201).json({
    message: 'User registered successfully (mock)',
    user: { firstName, lastName, email },
    note: 'This is a mock response - database not connected'
  });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  if (!(email && password)) {
    return res.status(400).json({ error: 'Email and password required' });
  }
  
  res.status(200).json({
    message: 'Login successful (mock)',
    token: 'mock-jwt-token-' + Date.now(),
    note: 'This is a mock response - database not connected'
  });
});

// Mock AI endpoints
app.get('/api/ai/status', (req, res) => {
  res.json({
    status: 'AI agents ready (mock)',
    agents: ['MoodAgent', 'TaskAgent', 'FocusAgent', 'MotivateAgent'],
    note: 'This is a mock response - AI service not connected'
  });
});

app.post('/api/ai/chat', (req, res) => {
  const { message } = req.body;
  res.json({
    response: `Echo: ${message} (mock AI response)`,
    agent: 'MockAgent',
    timestamp: new Date().toISOString()
  });
});

// Mock tasks endpoint
app.get('/api/tasks', (req, res) => {
  res.json({
    tasks: [
      { id: 1, title: 'Sample Task 1', completed: false },
      { id: 2, title: 'Sample Task 2', completed: true }
    ],
    note: 'This is mock data - database not connected'
  });
});

// --- Server ---
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 API Gateway test server running on http://localhost:${PORT}`);
  console.log(`📋 Available endpoints:`);
  console.log(`   GET  /           - API info`);
  console.log(`   GET  /health     - Health check`);
  console.log(`   POST /vapi-webhook - VAPI webhook`);
  console.log(`   POST /api/auth/register - Register user`);
  console.log(`   POST /api/auth/login - Login user`);
  console.log(`   GET  /api/ai/status - AI status`);
  console.log(`   POST /api/ai/chat - Chat with AI`);
  console.log(`   GET  /api/tasks - Get tasks`);
});

module.exports = app; 