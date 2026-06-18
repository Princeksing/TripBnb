import mongoose from "mongoose";

export function checkDb(req, res, next) {
    if (mongoose.connection.readyState !== 1) {
        return res.status(503).json({
            message: "Database not connected. Please check MongoDB Atlas IP whitelist and .env MONGODB_URL",
        });
    }
    next();
}
