import User from "../model/user.model.js";
import Listing from "../model/listing.model.js";
import Booking from "../model/booking.model.js";

export const getAdminStats = async (req, res) => {
    try {
        const [totalUsers, totalListings, totalBookings, confirmedBookings] = await Promise.all([
            User.countDocuments(),
            Listing.countDocuments(),
            Booking.countDocuments(),
            Booking.find({ status: "confirmed" })
        ]);

        const revenue = confirmedBookings.reduce((s, b) => s + (b.finalAmount || b.totalRent || 0), 0);

        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);

        const bookingGrowth = await Booking.aggregate([
            { $match: { createdAt: { $gte: sixMonthsAgo } } },
            { $group: { _id: { $month: "$createdAt" }, count: { $sum: 1 }, revenue: { $sum: "$finalAmount" } } },
            { $sort: { _id: 1 } }
        ]);

        const userGrowth = await User.aggregate([
            { $match: { createdAt: { $gte: sixMonthsAgo } } },
            { $group: { _id: { $month: "$createdAt" }, count: { $sum: 1 } } },
            { $sort: { _id: 1 } }
        ]);

        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const chartData = monthNames.map((name, i) => {
            const monthNum = i + 1;
            const booking = bookingGrowth.find((b) => b._id === monthNum);
            const user = userGrowth.find((u) => u._id === monthNum);
            return {
                month: name,
                bookings: booking?.count || 0,
                revenue: booking?.revenue || 0,
                users: user?.count || 0
            };
        });

        return res.status(200).json({
            totalUsers,
            totalListings,
            totalBookings,
            revenue,
            chartData
        });
    } catch (error) {
        return res.status(500).json({ message: `Admin stats error: ${error.message}` });
    }
};

export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select("-password").sort({ createdAt: -1 });
        return res.status(200).json(users);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const getAllListings = async (req, res) => {
    try {
        const listings = await Listing.find().populate("host", "name email").sort({ createdAt: -1 });
        return res.status(200).json(listings);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.find()
            .populate("guest", "name email")
            .populate("host", "name email")
            .populate("listing", "title city")
            .sort({ createdAt: -1 });
        return res.status(200).json(bookings);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const deleteUser = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        return res.status(200).json({ message: "User deleted" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const deleteAdminListing = async (req, res) => {
    try {
        await Listing.findByIdAndDelete(req.params.id);
        return res.status(200).json({ message: "Listing deleted" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const updateUserRole = async (req, res) => {
    try {
        const { role } = req.body;
        const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true }).select("-password");
        return res.status(200).json(user);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
