import express from "express";
import mongoose from "mongoose";
import User from "../model/user.model.js";
import Listing from "../model/listing.model.js";
import Booking from "../model/booking.model.js";
import { getDbStatus } from "../config/db.js";

const router = express.Router();

router.get("/database", async (req, res) => {
    const db = getDbStatus();

    if (!db.connected) {
        return res.status(503).json({
            connected: false,
            message: "Database not connected. Check MongoDB Atlas IP whitelist and MONGODB_URL in .env",
            usersCount: 0,
            listingsCount: 0,
            bookingsCount: 0,
        });
    }

    try {
        const [usersCount, listingsCount, bookingsCount] = await Promise.all([
            User.countDocuments(),
            Listing.countDocuments(),
            Booking.countDocuments(),
        ]);

        return res.status(200).json({
            connected: true,
            dbName: db.name,
            usersCount,
            listingsCount,
            bookingsCount,
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});

export default router;
