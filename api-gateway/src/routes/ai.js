const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/auth');
const axios = require('axios');

// Base URL for the AI agents microservice
const AI_SERVICE_URL = process.env.AI_AGENTS_URL || 'http://ai-agents:8000';

// Helper function to proxy requests to AI service
const proxyToAIService = async (req, res, endpoint) => {
  try {
    const response = await axios({
      method: req.method,
      url: `${AI_SERVICE_URL}${endpoint}`,
      data: req.body,
      headers: {
        'Content-Type': 'application/json',
        // Forward any additional headers if needed
      },
      timeout: 10000 // 10 second timeout
    });
    
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error('Error proxying to AI service:', error.message);
    res.status(500).json({ 
      error: 'AI service unavailable',
      message: error.message 
    });
  }
};

// Protected route that proxies to AI agents
router.get('/', verifyToken, async (req, res) => {
  await proxyToAIService(req, res, '/');
});

// Example: Chat with AI agent
router.post('/chat', verifyToken, async (req, res) => {
  await proxyToAIService(req, res, '/chat');
});

// Example: Get AI agent status
router.get('/status', verifyToken, async (req, res) => {
  await proxyToAIService(req, res, '/status');
});

// You can add more AI-related endpoints here:
// router.post('/analyze', verifyToken, async (req, res) => {
//   await proxyToAIService(req, res, '/analyze');
// });

module.exports = router; 