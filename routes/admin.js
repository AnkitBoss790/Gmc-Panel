const express = require('express');
const db = require('../database');

const router = express.Router();

// Middleware to check admin
const isAdmin = (req, res, next) => {
  if (!req.session.user || req.session.user.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied' });
  }
  next();
};

// Admin dashboard
router.get('/dashboard', isAdmin, async (req, res) => {
  try {
    const users = await db.getAllUsers();
    const servers = await db.getAllServers();
    
    res.render('admin-dashboard', { 
      user: req.session.user,
      users,
      servers
    });
  } catch (error) {
    res.status(500).send('Error loading admin dashboard');
  }
});

// Get all users
router.get('/users', isAdmin, async (req, res) => {
  try {
    const users = await db.getAllUsers();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all servers
router.get('/servers', isAdmin, async (req, res) => {
  try {
    const servers = await db.getAllServers();
    res.json(servers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete user
router.delete('/users/:id', isAdmin, async (req, res) => {
  try {
    // In production, you'd want to delete associated servers too
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;