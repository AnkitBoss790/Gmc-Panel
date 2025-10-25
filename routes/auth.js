const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('../database');

const router = express.Router();

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await db.getUser(email);
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isValidPassword = bcrypt.compareSync(password, user.password);
    
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    req.session.user = {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role
    };

    res.json({ success: true, redirect: '/dashboard' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Logout
router.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/login');
});

// Register (optional)
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const userId = await db.createUser(username, email, password, 'user');
    
    res.json({ success: true, userId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;