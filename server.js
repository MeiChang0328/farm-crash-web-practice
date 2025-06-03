const express = require('express');
const fs = require('fs');
const cors = require('cors');
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const DATA_FILE = './scores.json';

// 動態首頁（測試用，可移除）
app.get('/', (req, res) => {
    res.send('<h2>Sheep Game Server Running!</h2><p>API: <a href="/api/leaderboard">/api/leaderboard</a></p>');
});

// 取得排行榜
app.get('/api/leaderboard', (req, res) => {
    if (!fs.existsSync(DATA_FILE)) return res.json([]);
    const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    res.json(data);
});

// 新增分數
app.post('/api/leaderboard', (req, res) => {
    const { name, score } = req.body;
    let data = [];
    if (fs.existsSync(DATA_FILE)) {
        data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    }
    data.push({ name, score, time: new Date().toLocaleString() });
    data = data.sort((a, b) => b.score - a.score).slice(0, 5);
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
    // 新增：將所有成績紀錄到 .bd 檔案
    const bdLine = `${name},${score},${new Date().toLocaleString()}\n`;
    fs.appendFileSync('./all_scores.bd', bdLine);
    res.json({ success: true });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

