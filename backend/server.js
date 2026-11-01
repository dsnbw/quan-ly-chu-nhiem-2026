const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Initialize SQLite database
const dbPath = path.join(__dirname, 'sync_data.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database', err.message);
  } else {
    console.log('Connected to SQLite database.');
    db.run(`CREATE TABLE IF NOT EXISTS store (
      key TEXT PRIMARY KEY,
      value TEXT,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);
  }
});

app.get(['/ping', '/api/v1/ping'], (req, res) => {
  res.send('pong');
});

app.get('/api/v1/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// PULL: Get entire state (simple approach for MVP)
app.get('/api/v1/sync', (req, res) => {
  db.all('SELECT key, value, updated_at FROM store', [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    const data = {};
    rows.forEach(row => {
      try {
        data[row.key] = JSON.parse(row.value);
      } catch (e) {
        data[row.key] = row.value;
      }
    });
    res.json({ success: true, data });
  });
});

// PUSH: Receive state and merge (latest wins based on client timestamp or we just overwrite for MVP)
app.post('/api/v1/sync', (req, res) => {
  const payload = req.body;
  if (!payload || typeof payload !== 'object') {
    return res.status(400).json({ error: 'Invalid payload' });
  }

  const stmt = db.prepare('INSERT OR REPLACE INTO store (key, value, updated_at) VALUES (?, ?, CURRENT_TIMESTAMP)');
  
  db.serialize(() => {
    db.run('BEGIN TRANSACTION');
    Object.keys(payload).forEach(key => {
      stmt.run(key, JSON.stringify(payload[key]));
    });
    db.run('COMMIT', (err) => {
      if (err) {
        res.status(500).json({ error: 'Failed to commit transaction' });
      } else {
        res.json({ success: true, message: 'Sync complete' });
      }
    });
  });
  stmt.finalize();
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`CVA Sync Backend running on port ${PORT}`);
});
