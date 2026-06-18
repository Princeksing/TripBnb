import User from "../model/user.model.js";
import Listing from "../model/listing.model.js";
import Booking from "../model/booking.model.js";

export const getStats = async (req, res) => {
    try {
        const [users, properties, bookings] = await Promise.all([
            User.countDocuments(),
            Listing.countDocuments(),
            Booking.countDocuments(),
        ]);

        return res.status(200).json({
            users,
            properties,
            bookings,
        });
    } catch (error) {
        console.error("[getStats]", error.message);
        return res.status(500).json({ message: `Stats error: ${error.message}` });
    }
};
