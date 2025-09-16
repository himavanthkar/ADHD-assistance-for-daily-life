const express = require('express');
const http = require('http');
const { WebSocketServer } = require('ws');
const redis = require('redis');
const cors = require('cors');
const helmet = require('helmet');
const axios = require('axios');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

// --- WebSocket Connection Handling ---
wss.on('connection', (ws) => {
  console.log('Client connected to WebSocket');
  ws.on('close', () => console.log('Client disconnected'));
});

// Function to broadcast messages to all connected clients
const broadcast = (data) => {
  wss.clients.forEach((client) => {
    if (client.readyState === client.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
};

// --- Redis Pub/Sub ---
const redisClient = redis.createClient({
  url: `redis://${process.env.REDIS_HOST || 'localhost'}:${process.env.REDIS_PORT || 6379}`,
  password: process.env.REDIS_PASSWORD
});

(async () => {
  const subscriber = redisClient.duplicate();
  await subscriber.connect();

  await subscriber.subscribe('task_updates', (message) => {
    console.log('Received task update from Redis:', message);
    broadcast(JSON.parse(message));
  });

  await subscriber.subscribe('mood_updates', (message) => {
    console.log('Received mood update from Redis:', message);
    broadcast(JSON.parse(message));
  });

  console.log('Subscribed to Redis channels: task_updates, mood_updates');
})();


// --- Express Middleware ---
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- API Routes ---
const authRoutes = require('./src/routes/auth');
const taskRoutes = require('./src/routes/tasks');
const aiRoutes = require('./src/routes/ai');
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/ai', aiRoutes);

// VAPI Webhook Proxy
const VOICE_SERVICE_URL = process.env.VOICE_SERVICE_URL || 'http://voice-service:8002';
app.post('/api/vapi-webhook', async (req, res) => {
    try {
        console.log('Proxying VAPI webhook to voice-service');
        const response = await axios.post(`${VOICE_SERVICE_URL}/vapi-webhook`, req.body);
        res.status(response.status).json(response.data);
    } catch (error) {
        console.error('Error proxying VAPI webhook:', error.message);
        res.status(500).json({ error: 'Failed to proxy to voice service' });
    }
});

// --- Basic Route ---
app.get('/', (req, res) => {
  res.send('NeuroBoost API Gateway is running! 🚀');
});

// --- Server ---
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`API Gateway and WebSocket server is listening on port ${PORT}`);
});

module.exports = { app, server };
