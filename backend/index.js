import express from "express";
import dotenv from "dotenv";
import connectDb, { getDbStatus } from "./config/db.js";
import authRouter from "./routes/auth.route.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import userRouter from "./routes/user.route.js";
import listingRouter from "./routes/listing.route.js";
import bookingRouter from "./routes/booking.route.js";
import statsRouter from "./routes/stats.route.js";
import reviewRouter from "./routes/review.route.js";
import hostRouter from "./routes/host.route.js";
import adminRouter from "./routes/admin.route.js";
import debugRouter from "./routes/debug.route.js";
import { seedDatabase } from "./scripts/seedDatabase.js";
import { updateListingPrices } from "./scripts/updateListingPrices.js";
import mongoose from "mongoose";

dotenv.config();

const port = process.env.PORT || 8000;
const app = express();

const allowedOrigins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    process.env.CLIENT_URL,
].filter(Boolean);

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(null, allowedOrigins[0]);
        }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
    next();
});

app.get("/api/health", (req, res) => {
    const db = getDbStatus();
    res.status(db.connected ? 200 : 503).json({
        server: "running",
        database: db.connected ? "connected" : "disconnected",
        dbState: db.state,
        dbName: db.name,
    });
});

app.use("/api/debug", debugRouter);
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/listing", listingRouter);
app.use("/api/booking", bookingRouter);
app.use("/api/stats", statsRouter);
app.use("/api/reviews", reviewRouter);
app.use("/api/host", hostRouter);
app.use("/api/admin", adminRouter);

app.use((req, res) => {
    res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
    console.error("[ERROR]", err.message);
    console.error(err.stack);
    res.status(err.status || 500).json({
        message: err.message || "Internal server error",
    });
});

const startServer = async () => {
    const connected = await connectDb();

    if (connected) {
        try {
            await seedDatabase();
            await updateListingPrices();
        } catch (err) {
            console.error("[Seed] Error:", err.message);
        }
    } else {
        console.warn("[Server] Starting without database — API calls will return 503 until MongoDB connects");
    }

    app.listen(port, () => {
        console.log(`[Server] TripBnb API running on http://localhost:${port}`);
        console.log(`[Server] Health check: http://localhost:${port}/api/health`);
    });
};

process.on("SIGINT", async () => {
    await mongoose.connection.close();
    process.exit(0);
});

process.on("unhandledRejection", (err) => {
    console.error("[Unhandled Rejection]", err?.message || err);
});

process.on("uncaughtException", (err) => {
    console.error("[Uncaught Exception]", err?.message || err);
});

startServer();
