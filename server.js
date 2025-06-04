const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const DB_FILE = './scores.db';
const db = new sqlite3.Database(DB_FILE);

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS scores (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    score INTEGER,
    time TEXT
  )`);
});

// 取得排行榜
app.get('/api/leaderboard', (req, res) => {
    db.all('SELECT name, score FROM scores ORDER BY score DESC LIMIT 5', (err, rows) => {
        if (err) return res.json([]);
        res.json(rows);
    });
});

// 新增分數
app.post('/api/leaderboard', (req, res) => {
    const { name, score } = req.body;
    const time = new Date().toLocaleString();
    db.run('INSERT INTO scores (name, score, time) VALUES (?, ?, ?)', [name, score, time], function(err) {
        if (err) return res.json({ success: false });
        res.json({ success: true });
    });
});

// 取得所有成績
app.get('/api/all-scores', (req, res) => {
    db.all('SELECT name, score, time FROM scores ORDER BY score DESC', (err, rows) => {
        if (err) return res.json([]);
        res.json(rows);
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

