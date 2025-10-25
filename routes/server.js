const express = require('express');
const db = require('../database');

const router = express.Router();

// Middleware to check authentication
const isAuthenticated = (req, res, next) => {
  if (!req.session.user) {
    return res.redirect('/login');
  }
  next();
};

// Get user servers
router.get('/', isAuthenticated, async (req, res) => {
  try {
    const servers = await db.getServersByUserId(req.session.user.id);
    res.render('servers', { user: req.session.user, servers });
  } catch (error) {
    res.status(500).send('Error loading servers');
  }
});

// Create server page
router.get('/create', isAuthenticated, (req, res) => {
  res.render('create-server', { user: req.session.user });
});

// Create server
router.post('/create', isAuthenticated, async (req, res) => {
  try {
    const { name, port, memory, serverType } = req.body;
    
    const serverId = await db.createServer(
      name,
      req.session.user.id,
      parseInt(port),
      parseInt(memory),
      serverType || 'minecraft'
    );

    res.json({ success: true, serverId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Server details
router.get('/:id', isAuthenticated, async (req, res) => {
  try {
    const server = await db.getServerById(req.params.id);
    
    if (!server) {
      return res.status(404).send('Server not found');
    }

    // Check if user owns the server or is admin
    if (server.user_id !== req.session.user.id && req.session.user.role !== 'admin') {
      return res.status(403).send('Access denied');
    }

    res.render('server-details', { user: req.session.user, server });
  } catch (error) {
    res.status(500).send('Error loading server');
  }
});

// Start server
router.post('/:id/start', isAuthenticated, async (req, res) => {
  try {
    const server = await db.getServerById(req.params.id);
    
    if (!server || (server.user_id !== req.session.user.id && req.session.user.role !== 'admin')) {
      return res.status(403).json({ error: 'Access denied' });
    }

    await db.updateServerStatus(req.params.id, 'running');
    res.json({ success: true, status: 'running' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Stop server
router.post('/:id/stop', isAuthenticated, async (req, res) => {
  try {
    const server = await db.getServerById(req.params.id);
    
    if (!server || (server.user_id !== req.session.user.id && req.session.user.role !== 'admin')) {
      return res.status(403).json({ error: 'Access denied' });
    }

    await db.updateServerStatus(req.params.id, 'stopped');
    res.json({ success: true, status: 'stopped' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Restart server
router.post('/:id/restart', isAuthenticated, async (req, res) => {
  try {
    const server = await db.getServerById(req.params.id);
    
    if (!server || (server.user_id !== req.session.user.id && req.session.user.role !== 'admin')) {
      return res.status(403).json({ error: 'Access denied' });
    }

    await db.updateServerStatus(req.params.id, 'restarting');
    setTimeout(async () => {
      await db.updateServerStatus(req.params.id, 'running');
    }, 3000);

    res.json({ success: true, status: 'restarting' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete server
router.delete('/:id', isAuthenticated, async (req, res) => {
  try {
    const server = await db.getServerById(req.params.id);
    
    if (!server || (server.user_id !== req.session.user.id && req.session.user.role !== 'admin')) {
      return res.status(403).json({ error: 'Access denied' });
    }

    await db.deleteServer(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;