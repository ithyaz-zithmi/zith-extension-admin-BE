import express from "express";
import type { Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";
import pool from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import priceRoutes from "./routes/priceRoutes.js";
import demoRoutes from "./routes/demoRoutes.js";
import statusRoutes from "./routes/statusRoutes.js";
import { initDb } from "./models/userModel.js";
import { initContactTable } from "./models/contactModel.js";
import { initPriceTable } from "./models/priceModel.js";
import { initDemoTable } from "./models/demoModel.js";
import { initStatusTables } from "./models/statusModel.js";

dotenv.config();

if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET environment variable is required");
}

const app = express();

const allowedOrigins = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(',').map(o => o.trim())
    : ['http://localhost:5173'];

app.use(cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(express.json({ limit: '10kb' }));

app.get("/health", async (_req: Request, res: Response) => {
    try {
        await pool.query("SELECT 1");
        res.json({ status: "ok", db: "connected", uptime: process.uptime() });
    } catch {
        res.status(503).json({ status: "error", db: "unreachable", uptime: process.uptime() });
    }
});

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 20,
    message: { success: false, message: 'Too many requests, please try again later' },
    standardHeaders: true,
    legacyHeaders: false,
});

// Initialize Database
initDb();
initContactTable();
initPriceTable();
initDemoTable();
initStatusTables();

// Routes
app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/price-settings", priceRoutes);
app.use("/api/demo-requests", demoRoutes);
app.use("/api/status", statusRoutes);

app.get("/", (req: Request, res: Response) => {
    res.send("Backend running with TypeScript and PostgreSQL 🚀");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});