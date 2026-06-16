require("dotenv").config();

const express = require("express");
const mysql = require("mysql2/promise");
const path = require("path");

const app = express();
const rootDir = __dirname;
const port = Number(process.env.PORT || 3000);

const dbSettings = {
  host: process.env.DB_HOST || "127.0.0.1",
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "root123",
  database: process.env.DB_NAME || "misbah_portfolio"
};

let pool;

const normalizeText = (value) => String(value || "").trim().replace(/\s+/g, " ");

const validatePayload = (payload) => {
  const normalized = {
    name: normalizeText(payload.name),
    email: normalizeText(payload.email).toLowerCase(),
    subject: normalizeText(payload.subject),
    message: String(payload.message || "").trim()
  };

  if (!normalized.name || !normalized.email || !normalized.subject || !normalized.message) {
    return {
      ok: false,
      message: "All contact form fields are required."
    };
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized.email)) {
    return {
      ok: false,
      message: "Please provide a valid email address."
    };
  }

  if (normalized.name.length > 120 || normalized.subject.length > 200) {
    return {
      ok: false,
      message: "Name or subject is too long."
    };
  }

  if (normalized.message.length > 5000) {
    return {
      ok: false,
      message: "Message is too long. Please keep it under 5000 characters."
    };
  }

  return {
    ok: true,
    data: normalized
  };
};

const ensureDatabase = async () => {
  const adminConnection = await mysql.createConnection({
    host: dbSettings.host,
    port: dbSettings.port,
    user: dbSettings.user,
    password: dbSettings.password
  });

  await adminConnection.query(
    `CREATE DATABASE IF NOT EXISTS \`${dbSettings.database}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`
  );

  await adminConnection.end();

  const schemaConnection = await mysql.createConnection(dbSettings);

  await schemaConnection.query(`
    CREATE TABLE IF NOT EXISTS contact_messages (
      id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
      name VARCHAR(120) NOT NULL,
      email VARCHAR(190) NOT NULL,
      subject VARCHAR(200) NOT NULL,
      message TEXT NOT NULL,
      submitted_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (id),
      KEY idx_contact_messages_email (email),
      KEY idx_contact_messages_submitted_at (submitted_at)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);

  await schemaConnection.end();
};

const initializePool = async () => {
  await ensureDatabase();

  pool = mysql.createPool({
    ...dbSettings,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });
};

app.disable("x-powered-by");
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: false }));

app.get("/api/health", async (_req, res) => {
  try {
    await pool.query("SELECT 1");
    res.json({
      ok: true,
      database: dbSettings.database,
      message: "Portfolio backend is connected to MySQL."
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      message: "Portfolio backend is not connected to MySQL."
    });
  }
});

app.post("/api/contact", async (req, res) => {
  const validation = validatePayload(req.body || {});

  if (!validation.ok) {
    res.status(400).json({
      ok: false,
      message: validation.message
    });
    return;
  }

  try {
    const { name, email, subject, message } = validation.data;

    const [result] = await pool.execute(
      `
        INSERT INTO contact_messages (name, email, subject, message)
        VALUES (?, ?, ?, ?)
      `,
      [name, email, subject, message]
    );

    res.status(201).json({
      ok: true,
      id: result.insertId,
      message: "Message sent successfully and saved to MySQL."
    });
  } catch (error) {
    console.error("Failed to save contact message:", error);
    res.status(500).json({
      ok: false,
      message: "The server could not save your message right now."
    });
  }
});

app.get("/", (_req, res) => {
  res.sendFile(path.join(rootDir, "index.html"));
});

app.get("/index.html", (_req, res) => {
  res.sendFile(path.join(rootDir, "index.html"));
});

app.get("/style.css", (_req, res) => {
  res.sendFile(path.join(rootDir, "style.css"));
});

app.get("/script.js", (_req, res) => {
  res.sendFile(path.join(rootDir, "script.js"));
});

app.use("/assets", express.static(path.join(rootDir, "assets")));

app.use((req, res) => {
  if (req.path.startsWith("/api/")) {
    res.status(404).json({
      ok: false,
      message: "API endpoint not found."
    });
    return;
  }

  res.sendFile(path.join(rootDir, "index.html"));
});

const startServer = async () => {
  try {
    await initializePool();

    app.listen(port, () => {
      console.log(`Portfolio server running on http://127.0.0.1:${port}`);
      console.log(`Connected to MySQL database: ${dbSettings.database}`);
    });
  } catch (error) {
    console.error("Unable to start the portfolio server:", error);
    process.exit(1);
  }
};

startServer();
