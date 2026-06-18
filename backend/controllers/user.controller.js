import User from "../model/user.model.js";
import Listing from "../model/listing.model.js";
import Booking from "../model/booking.model.js";
import { normalizeListing } from "../utils/listingHelper.js";

export const getCurrentUser = async (req, res) => {
    try {
        const user = await User.findById(req.userId)
            .select("-password")
            .populate("listing")
            .populate("wishlist")
            .lean();

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        user.listing = (user.listing || []).map(normalizeListing);
        user.wishlist = (user.wishlist || []).map(normalizeListing);

        let bookings = [];
        if (user.booking?.length) {
            const bookingDocs = await Booking.find({ _id: { $in: user.booking } })
                .populate("listing")
                .lean();

            if (bookingDocs.length > 0) {
                bookings = bookingDocs.map((b) => ({
                    ...b,
                    listing: b.listing ? normalizeListing(b.listing) : null,
                }));
            } else {
                const legacyListings = await Listing.find({ _id: { $in: user.booking } }).lean();
                bookings = legacyListings.map((l) => ({
                    listing: normalizeListing(l),
                    status: "confirmed",
                }));
            }
        }

        user.booking = bookings;

        return res.status(200).json(user);
    } catch (error) {
        console.error("[getCurrentUser]", error.message);
        return res.status(500).json({ message: `getCurrentUser error: ${error.message}` });
    }
};

export const updateProfile = async (req, res) => {
    try {
        const { name, phone } = req.body;
        const update = {};
        if (name) update.name = name;
        if (phone !== undefined) update.phone = phone;

        const user = await User.findByIdAndUpdate(req.userId, update, { new: true }).select("-password");
        return res.status(200).json(user);
    } catch (error) {
        return res.status(500).json({ message: `Update profile error: ${error.message}` });
    }
};

export const updateAvatar = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "Avatar image required" });
        }
        const uploadOnCloudinary = (await import("../config/cloudinary.js")).default;
        const url = await uploadOnCloudinary(req.file.path);
        const user = await User.findByIdAndUpdate(req.userId, { avatar: url }, { new: true }).select("-password");
        return res.status(200).json(user);
    } catch (error) {
        return res.status(500).json({ message: `Avatar upload error: ${error.message}` });
    }
};

export const changePassword = async (req, res) => {
    try {
        const bcrypt = (await import("bcryptjs")).default;
        const { currentPassword, newPassword } = req.body;
        const user = await User.findById(req.userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) return res.status(400).json({ message: "Current password is incorrect" });

        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();
        return res.status(200).json({ message: "Password updated successfully" });
    } catch (error) {
        return res.status(500).json({ message: `Change password error: ${error.message}` });
    }
};

export const addToWishlist = async (req, res) => {
    try {
        const { listingId } = req.params;
        const user = await User.findByIdAndUpdate(
            req.userId,
            { $addToSet: { wishlist: listingId } },
            { new: true }
        ).populate("wishlist");
        return res.status(200).json((user.wishlist || []).map(normalizeListing));
    } catch (error) {
        return res.status(500).json({ message: `Wishlist error: ${error.message}` });
    }
};

export const removeFromWishlist = async (req, res) => {
    try {
        const { listingId } = req.params;
        const user = await User.findByIdAndUpdate(
            req.userId,
            { $pull: { wishlist: listingId } },
            { new: true }
        ).populate("wishlist");
        return res.status(200).json((user.wishlist || []).map(normalizeListing));
    } catch (error) {
        return res.status(500).json({ message: `Wishlist error: ${error.message}` });
    }
};

export const getWishlist = async (req, res) => {
    try {
        const user = await User.findById(req.userId).populate("wishlist");
        return res.status(200).json(user?.wishlist?.map(normalizeListing) || []);
    } catch (error) {
        return res.status(500).json({ message: `Wishlist error: ${error.message}` });
    }
};

export const getNotifications = async (req, res) => {
    try {
        const Notification = (await import("../model/notification.model.js")).default;
        const notifications = await Notification.find({ user: req.userId }).sort({ createdAt: -1 }).limit(50);
        return res.status(200).json(notifications);
    } catch (error) {
        return res.status(500).json({ message: `Notifications error: ${error.message}` });
    }
};

export const markNotificationRead = async (req, res) => {
    try {
        const Notification = (await import("../model/notification.model.js")).default;
        await Notification.findOneAndUpdate(
            { _id: req.params.id, user: req.userId },
            { read: true }
        );
        return res.status(200).json({ message: "Marked as read" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const markAllNotificationsRead = async (req, res) => {
    try {
        const Notification = (await import("../model/notification.model.js")).default;
        await Notification.updateMany({ user: req.userId, read: false }, { read: true });
        return res.status(200).json({ message: "All marked as read" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
