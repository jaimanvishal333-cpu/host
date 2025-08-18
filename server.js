const path = require('path');
const fs = require('fs');
const express = require('express');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const session = require('express-session');
const bcrypt = require('bcrypt');
const sqlite3 = require('sqlite3').verbose();
const { nanoid } = require('nanoid');

const app = express();
const PORT = process.env.PORT || 3000;

// Ensure data directory exists
const dataDir = path.join(__dirname, 'data');
fs.mkdirSync(dataDir, { recursive: true });
const dbPath = path.join(dataDir, 'app.db');

// Initialize SQLite database
const db = new sqlite3.Database(dbPath);
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_ref TEXT NOT NULL UNIQUE,
    user_id INTEGER NOT NULL,
    plan TEXT NOT NULL,
    domain TEXT,
    status TEXT NOT NULL DEFAULT 'pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id)
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS tickets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'open',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id)
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS contacts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    message TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);
});

// Helpers: Promisified DB access
function dbRun(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) return reject(err);
      resolve({ id: this.lastID, changes: this.changes });
    });
  });
}

function dbGet(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, function (err, row) {
      if (err) return reject(err);
      resolve(row);
    });
  });
}

function dbAll(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, function (err, rows) {
      if (err) return reject(err);
      resolve(rows);
    });
  });
}

// Middleware
app.use(helmet());
app.use(compression());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const sessionSecret = process.env.SESSION_SECRET || 'dev_session_secret_change_me';
app.use(
  session({
    secret: sessionSecret,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false, // Set true when behind HTTPS/proxy
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    },
  })
);

app.use(express.static(path.join(__dirname, 'public')));

// Auth utils
function requireAuth(req, res, next) {
  if (!req.session.userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
}

function sanitizeEmail(email) {
  return String(email || '').trim().toLowerCase();
}

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Auth
app.post('/api/auth/register', async (req, res) => {
  try {
    const name = String(req.body.name || '').trim();
    const email = sanitizeEmail(req.body.email);
    const password = String(req.body.password || '');

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    const existing = await dbGet('SELECT id FROM users WHERE email = ?', [email]);
    if (existing) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const result = await dbRun(
      'INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)',
      [name, email, passwordHash]
    );

    req.session.userId = result.id;
    res.status(201).json({ id: result.id, name, email });
  } catch (err) {
    console.error('Register error', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const email = sanitizeEmail(req.body.email);
    const password = String(req.body.password || '');
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    const user = await dbGet('SELECT id, password_hash, name, email FROM users WHERE email = ?', [email]);
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });
    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' });
    req.session.userId = user.id;
    res.json({ id: user.id, name: user.name, email: user.email });
  } catch (err) {
    console.error('Login error', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/auth/logout', (req, res) => {
  req.session.destroy(() => {
    res.json({ ok: true });
  });
});

app.get('/api/me', async (req, res) => {
  try {
    if (!req.session.userId) return res.json(null);
    const user = await dbGet('SELECT id, name, email, created_at FROM users WHERE id = ?', [req.session.userId]);
    res.json(user || null);
  } catch (err) {
    console.error('Me error', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Domain availability (mock)
app.get('/api/domain/check', async (req, res) => {
  try {
    const domain = String(req.query.domain || '').trim().toLowerCase();
    if (!domain || !/^([a-z0-9-]+)\.[a-z]{2,}$/i.test(domain)) {
      return res.status(400).json({ error: 'Invalid domain' });
    }
    const existing = await dbGet('SELECT id FROM orders WHERE domain = ?', [domain]);
    const random = Math.random() > 0.5; // pseudo availability
    const available = !existing && random;
    res.json({ domain, available });
  } catch (err) {
    console.error('Domain check error', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Orders
app.post('/api/orders', requireAuth, async (req, res) => {
  try {
    const plan = String(req.body.plan || '').trim();
    const domain = String(req.body.domain || '').trim().toLowerCase();
    if (!plan) return res.status(400).json({ error: 'Plan is required' });
    if (domain && !/^([a-z0-9-]+)\.[a-z]{2,}$/i.test(domain)) {
      return res.status(400).json({ error: 'Invalid domain' });
    }
    const orderRef = nanoid(12);
    const result = await dbRun(
      'INSERT INTO orders (order_ref, user_id, plan, domain, status) VALUES (?, ?, ?, ?, ?)',
      [orderRef, req.session.userId, plan, domain || null, 'pending']
    );
    const order = await dbGet('SELECT id, order_ref, plan, domain, status, created_at FROM orders WHERE id = ?', [result.id]);
    res.status(201).json(order);
  } catch (err) {
    console.error('Create order error', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/orders', requireAuth, async (req, res) => {
  try {
    const rows = await dbAll(
      'SELECT id, order_ref, plan, domain, status, created_at FROM orders WHERE user_id = ? ORDER BY created_at DESC',
      [req.session.userId]
    );
    res.json(rows);
  } catch (err) {
    console.error('List orders error', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Tickets
app.post('/api/tickets', requireAuth, async (req, res) => {
  try {
    const subject = String(req.body.subject || '').trim();
    const message = String(req.body.message || '').trim();
    if (!subject || !message) return res.status(400).json({ error: 'Subject and message are required' });
    const result = await dbRun(
      'INSERT INTO tickets (user_id, subject, message, status) VALUES (?, ?, ?, ?)',
      [req.session.userId, subject, message, 'open']
    );
    const ticket = await dbGet('SELECT id, subject, message, status, created_at FROM tickets WHERE id = ?', [result.id]);
    res.status(201).json(ticket);
  } catch (err) {
    console.error('Create ticket error', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/tickets', requireAuth, async (req, res) => {
  try {
    const rows = await dbAll(
      'SELECT id, subject, message, status, created_at FROM tickets WHERE user_id = ? ORDER BY created_at DESC',
      [req.session.userId]
    );
    res.json(rows);
  } catch (err) {
    console.error('List tickets error', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Contact
app.post('/api/contact', async (req, res) => {
  try {
    const name = String(req.body.name || '').trim();
    const email = sanitizeEmail(req.body.email);
    const message = String(req.body.message || '').trim();
    if (!name || !email || !message) return res.status(400).json({ error: 'Name, email and message are required' });
    await dbRun('INSERT INTO contacts (name, email, message) VALUES (?, ?, ?)', [name, email, message]);
    res.status(201).json({ ok: true });
  } catch (err) {
    console.error('Contact error', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Fallback: serve index.html for root
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});

