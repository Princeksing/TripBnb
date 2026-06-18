import Listing from "../model/listing.model.js";
import Booking from "../model/booking.model.js";

export const getHostStats = async (req, res) => {
    try {
        const listings = await Listing.find({ host: req.userId });
        const listingIds = listings.map((l) => l._id);

        const bookings = await Booking.find({
            listing: { $in: listingIds },
            status: "confirmed"
        });

        const revenue = bookings.reduce((sum, b) => sum + (b.finalAmount || b.totalRent || 0), 0);
        const activeListings = listings.filter((l) => !l.isBooked).length;

        return res.status(200).json({
            totalListings: listings.length,
            totalBookings: bookings.length,
            revenue,
            activeListings
        });
    } catch (error) {
        return res.status(500).json({ message: `Host stats error: ${error.message}` });
    }
};

export const getHostBookings = async (req, res) => {
    try {
        const listings = await Listing.find({ host: req.userId }).select("_id");
        const listingIds = listings.map((l) => l._id);

        const bookings = await Booking.find({ listing: { $in: listingIds } })
            .populate("guest", "name email")
            .populate("listing", "title city landMark price rent")
            .sort({ createdAt: -1 });

        return res.status(200).json(bookings);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
