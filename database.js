const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcryptjs');

const dbPath = path.join(__dirname, 'gmcpanel.db');
const db = new sqlite3.Database(dbPath);

// Initialize database tables
const initialize = () => {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // Users table
      db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role TEXT DEFAULT 'user',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`, (err) => {
        if (err) reject(err);
      });

      // Servers table
      db.run(`CREATE TABLE IF NOT EXISTS servers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        user_id INTEGER NOT NULL,
        port INTEGER NOT NULL,
        memory INTEGER DEFAULT 1024,
        status TEXT DEFAULT 'stopped',
        server_type TEXT DEFAULT 'minecraft',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
      )`, (err) => {
        if (err) reject(err);
      });

      // Server logs table
      db.run(`CREATE TABLE IF NOT EXISTS server_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        server_id INTEGER NOT NULL,
        log_text TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (server_id) REFERENCES servers(id)
      )`, (err) => {
        if (err) reject(err);
        resolve();
      });
    });
  });
};

// Database helper functions
const getUser = (email) => {
  return new Promise((resolve, reject) => {
    db.get('SELECT * FROM users WHERE email = ?', [email], (err, row) => {
      if (err) reject(err);
      resolve(row);
    });
  });
};

const getUserById = (id) => {
  return new Promise((resolve, reject) => {
    db.get('SELECT * FROM users WHERE id = ?', [id], (err, row) => {
      if (err) reject(err);
      resolve(row);
    });
  });
};

const createUser = (username, email, password, role = 'user') => {
  return new Promise((resolve, reject) => {
    const hashedPassword = bcrypt.hashSync(password, 10);
    db.run(
      'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)',
      [username, email, hashedPassword, role],
      function(err) {
        if (err) reject(err);
        resolve(this.lastID);
      }
    );
  });
};

const getAllUsers = () => {
  return new Promise((resolve, reject) => {
    db.all('SELECT id, username, email, role, created_at FROM users', (err, rows) => {
      if (err) reject(err);
      resolve(rows);
    });
  });
};

const createServer = (name, userId, port, memory, serverType) => {
  return new Promise((resolve, reject) => {
    db.run(
      'INSERT INTO servers (name, user_id, port, memory, server_type) VALUES (?, ?, ?, ?, ?)',
      [name, userId, port, memory, serverType],
      function(err) {
        if (err) reject(err);
        resolve(this.lastID);
      }
    );
  });
};

const getServersByUserId = (userId) => {
  return new Promise((resolve, reject) => {
    db.all('SELECT * FROM servers WHERE user_id = ?', [userId], (err, rows) => {
      if (err) reject(err);
      resolve(rows);
    });
  });
};

const getAllServers = () => {
  return new Promise((resolve, reject) => {
    db.all('SELECT servers.*, users.username FROM servers JOIN users ON servers.user_id = users.id', (err, rows) => {
      if (err) reject(err);
      resolve(rows);
    });
  });
};

const getServerById = (id) => {
  return new Promise((resolve, reject) => {
    db.get('SELECT * FROM servers WHERE id = ?', [id], (err, row) => {
      if (err) reject(err);
      resolve(row);
    });
  });
};

const updateServerStatus = (id, status) => {
  return new Promise((resolve, reject) => {
    db.run('UPDATE servers SET status = ? WHERE id = ?', [status, id], (err) => {
      if (err) reject(err);
      resolve();
    });
  });
};

const deleteServer = (id) => {
  return new Promise((resolve, reject) => {
    db.run('DELETE FROM servers WHERE id = ?', [id], (err) => {
      if (err) reject(err);
      resolve();
    });
  });
};

module.exports = {
  db,
  initialize,
  getUser,
  getUserById,
  createUser,
  getAllUsers,
  createServer,
  getServersByUserId,
  getAllServers,
  getServerById,
  updateServerStatus,
  deleteServer
};