const express = require('express');
const db = require('../database');

const router = express.Router();

// API middleware
const isAuthenticated = (req, res, next) => {
  if (!req.session.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
};

// Get server status
router.get('/servers/:id/status', isAuthenticated, async (req, res) => {
  try {
    const server = await db.getServerById(req.params.id);
    
    if (!server) {
      return res.status(404).json({ error: 'Server not found' });
    }

    res.json({ 
      status: server.status,
      uptime: Math.floor(Math.random() * 10000), // Simulated uptime
      memory: `${Math.floor(Math.random() * server.memory)}/${server.memory}`,
      cpu: Math.floor(Math.random() * 100)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get server console output
router.get('/servers/:id/console', isAuthenticated, async (req, res) => {
  try {
    const server = await db.getServerById(req.params.id);
    
    if (!server) {
      return res.status(404).json({ error: 'Server not found' });
    }

    // Simulated console output
    const logs = [
      '[INFO] Server started successfully',
      '[INFO] Loading world...',
      '[INFO] Preparing spawn area: 100%',
      '[INFO] Done! Server is ready'
    ];

    res.json({ logs });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Send command to server
router.post('/servers/:id/command', isAuthenticated, async (req, res) => {
  try {
    const { command } = req.body;
    const server = await db.getServerById(req.params.id);
    
    if (!server) {
      return res.status(404).json({ error: 'Server not found' });
    }

    // In production, this would send the command to the actual server
    res.json({ success: true, output: `Command executed: ${command}` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;