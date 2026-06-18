import mongoose from "mongoose";

let isConnected = false;

const connectDb = async () => {
    const uri = process.env.MONGODB_URL;

    if (!uri) {
        console.error("[MongoDB] MONGODB_URL is missing in .env file");
        return false;
    }

    mongoose.connection.on("connected", () => {
        isConnected = true;
        console.log("[MongoDB] Connected successfully");
    });

    mongoose.connection.on("error", (err) => {
        isConnected = false;
        console.error("[MongoDB] Connection error:", err.message);
    });

    mongoose.connection.on("disconnected", () => {
        isConnected = false;
        console.warn("[MongoDB] Disconnected");
    });

    try {
        await mongoose.connect(uri, {
            serverSelectionTimeoutMS: 10000,
            socketTimeoutMS: 45000,
            maxPoolSize: 10,
        });
        isConnected = mongoose.connection.readyState === 1;
        console.log("[MongoDB] Database:", mongoose.connection.name);
        return isConnected;
    } catch (error) {
        isConnected = false;
        console.error("[MongoDB] Failed to connect:", error.message);
        console.error("[MongoDB] Fix steps:");
        console.error("  1. MongoDB Atlas → Network Access → Add IP Address → Allow 0.0.0.0/0 (dev) or your current IP");
        console.error("  2. Verify MONGODB_URL username/password in backend/.env");
        console.error("  3. Ensure cluster is running (not paused)");
        return false;
    }
};

export const getDbStatus = () => ({
    connected: mongoose.connection.readyState === 1,
    state: ["disconnected", "connected", "connecting", "disconnecting"][mongoose.connection.readyState] || "unknown",
    name: mongoose.connection.name || null,
});

export default connectDb;
