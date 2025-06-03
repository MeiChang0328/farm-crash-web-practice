const express = require('express');
const fs = require('fs');
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

// 動態首頁（測試用，可移除）
app.get('/', (req, res) => {
    res.send('<h2>Sheep Game Server Running!</h2><p>API: <a href="/api/leaderboard">/api/leaderboard</a></p>');
});

// 取得排行榜
app.get('/api/leaderboard', (req, res) => {
    // 改為回傳前5名，且不顯示時間（前端不需要時間）
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

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

