const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const cors = require("cors");

const app = express();
const PORT = 7799;

app.use(express.json());
app.use(cors());
const dbPath = path.resolve(__dirname, "messages.db");
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
    db.run(`
    CREATE TABLE IF NOT EXISTS messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL,
        content TEXT NOT NULL,
        email TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
    `);
});

app.get("/api/messages", (req, res) => {
    db.all("SELECT * FROM messages ORDER BY created_at DESC", [], (err, rows) => {
        if (err) {
            return res.status(500).json({ code: 1, message: err.message });
        }
        res.json({ code: 0, data: rows });
    });
});

app.post("/api/messages", (req, res) => {
    const { username, content, email } = req.body;
    if (!username || !content) {
        return res.status(400).json({ code: 1, message: "用户名或内容不能为空" });
    }

    const stmt = db.prepare("INSERT INTO messages (username, content, email) VALUES (?, ?, ?)");
    stmt.run(username, content, email, function (err) {
        if (err) {
            return res.status(500).json({ code: 1, message: err.message });
        }
        db.get("SELECT * FROM messages WHERE id = ?", this.lastID, (err, row) => {
            if (err) return res.status(500).json({ code: 1, message: err.message });
            res.json({ code: 0, data: row });
        });
    });
    stmt.finalize();
});

app.use(express.static(path.join(__dirname, "../public")));
app.listen(PORT, () => {
    console.log(`留言板服务启动于 http://localhost:${PORT}`);
});
