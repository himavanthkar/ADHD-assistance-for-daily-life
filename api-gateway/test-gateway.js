const express = require('express');
const http = require('http');
const { WebSocketServer } = require('ws');
const cors = require('cors');
const helmet = require('helmet');
const axios = require('axios');

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

// --- WebSocket Connection Handling ---
wss.on('connection', (ws) => {
  console.log('Client connected to WebSocket');
  
  // Send welcome message
  ws.send(JSON.stringify({
    type: 'welcome',
    message: 'Connected to NeuroBoost API Gateway WebSocket',
    timestamp: new Date().toISOString()
  }));
  
  ws.on('message', (data) => {
    console.log('Received WebSocket message:', data.toString());
    // Echo back the message
    ws.send(JSON.stringify({
      type: 'echo',
      data: data.toString(),
      timestamp: new Date().toISOString()
    }));
  });
  
  ws.on('close', () => console.log('Client disconnected'));
});

// Function to broadcast messages to all connected clients
const broadcast = (data) => {
  console.log('Broadcasting to', wss.clients.size, 'clients:', data);
  wss.clients.forEach((client) => {
    if (client.readyState === client.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
};

// --- Express Middleware ---
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- Mock API Routes ---

// Basic info endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'NeuroBoost API Gateway is running! 🚀',
    status: 'healthy',
    timestamp: new Date().toISOString(),
    features: {
      websocket: 'enabled',
      redis: 'mock',
      database: 'mock'
    },
    endpoints: {
      health: 'GET /health',
      webhook: 'POST /api/vapi-webhook',
      auth: {
        register: 'POST /api/auth/register',
        login: 'POST /api/auth/login'
      },
      ai: {
        status: 'GET /api/ai/status',
        chat: 'POST /api/ai/chat'
      },
      tasks: 'GET /api/tasks',
      broadcast: 'POST /api/broadcast'
    }
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    websocket_clients: wss.clients.size,
    timestamp: new Date().toISOString()
  });
});

// Mock auth endpoints
app.post('/api/auth/register', (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  
  if (!(email && password && firstName && lastName)) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  
  const mockUser = { id: Date.now(), firstName, lastName, email };
  
  // Broadcast user registration
  broadcast({
    type: 'user_registered',
    user: mockUser,
    timestamp: new Date().toISOString()
  });
  
  res.status(201).json({
    message: 'User registered successfully (mock)',
    user: mockUser,
    note: 'This is a mock response - database not connected'
  });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  if (!(email && password)) {
    return res.status(400).json({ error: 'Email and password required' });
  }
  
  const mockToken = 'mock-jwt-token-' + Date.now();
  
  // Broadcast user login
  broadcast({
    type: 'user_login',
    email: email,
    timestamp: new Date().toISOString()
  });
  
  res.status(200).json({
    message: 'Login successful (mock)',
    token: mockToken,
    note: 'This is a mock response - database not connected'
  });
});

// Mock AI endpoints
app.get('/api/ai/status', (req, res) => {
  res.json({
    status: 'AI agents ready (mock)',
    agents: {
      MoodAgent: 'online',
      TaskAgent: 'online', 
      FocusAgent: 'online',
      MotivateAgent: 'online'
    },
    note: 'This is a mock response - AI service not connected'
  });
});

app.post('/api/ai/chat', (req, res) => {
  const { message } = req.body;
  const response = `Echo: ${message} (mock AI response)`;
  
  // Broadcast AI interaction
  broadcast({
    type: 'ai_chat',
    message: message,
    response: response,
    timestamp: new Date().toISOString()
  });
  
  res.json({
    response: response,
    agent: 'MockAgent',
    timestamp: new Date().toISOString()
  });
});

// Mock tasks endpoint
app.get('/api/tasks', (req, res) => {
  const mockTasks = [
    { id: 1, title: 'Complete project proposal', completed: false, priority: 'high' },
    { id: 2, title: 'Review team feedback', completed: true, priority: 'medium' },
    { id: 3, title: 'Schedule client meeting', completed: false, priority: 'low' }
  ];
  
  res.json({
    tasks: mockTasks,
    count: mockTasks.length,
    note: 'This is mock data - database not connected'
  });
});

// VAPI Webhook (mock)
app.post('/api/vapi-webhook', (req, res) => {
  console.log('Received VAPI webhook:', JSON.stringify(req.body, null, 2));
  
  const { message } = req.body;
  
  // Broadcast webhook received
  broadcast({
    type: 'vapi_webhook',
    payload: req.body,
    timestamp: new Date().toISOString()
  });
  
  if (message) {
    return res.status(200).json({
      message: "Webhook received successfully (mock)",
      received: message,
      timestamp: new Date().toISOString(),
      note: 'This is a mock response - voice service not connected'
    });
  }
  
  return res.status(400).json({ error: 'Invalid payload' });
});

// Test broadcast endpoint
app.post('/api/broadcast', (req, res) => {
  const { message, type } = req.body;
  
  broadcast({
    type: type || 'test_broadcast',
    message: message || 'Test broadcast message',
    timestamp: new Date().toISOString()
  });
  
  res.json({
    message: 'Broadcast sent',
    clients_notified: wss.clients.size,
    timestamp: new Date().toISOString()
  });
});

// --- Server ---
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`🚀 NeuroBoost API Gateway Test Server running on http://localhost:${PORT}`);
  console.log(`🔌 WebSocket server running on ws://localhost:${PORT}`);
  console.log(`📋 Available endpoints:`);
  console.log(`   GET  /           - API info`);
  console.log(`   GET  /health     - Health check`);
  console.log(`   POST /api/vapi-webhook - VAPI webhook`);
  console.log(`   POST /api/auth/register - Register user`);
  console.log(`   POST /api/auth/login - Login user`);
  console.log(`   GET  /api/ai/status - AI status`);
  console.log(`   POST /api/ai/chat - Chat with AI`);
  console.log(`   GET  /api/tasks - Get tasks`);
  console.log(`   POST /api/broadcast - Test broadcast`);
  console.log(`💡 All actions will broadcast to WebSocket clients`);
});

module.exports = { app, server }; 