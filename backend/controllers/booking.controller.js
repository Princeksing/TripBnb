import Booking from "../model/booking.model.js";
import Listing from "../model/listing.model.js";
import User from "../model/user.model.js";
import { createNotification } from "../utils/notificationHelper.js";
import { calculateBookingPrice } from "../utils/pricing.js";

function generateReference() {
    return `TB${Date.now()}${Math.floor(Math.random() * 1000)}`;
}

export const createBooking = async (req, res) => {
    try {
        const { id } = req.params;
        const { checkIn, checkOut, guestCount = 1 } = req.body;

        const listing = await Listing.findById(id);
        if (!listing) {
            return res.status(404).json({ message: "Listing is not found" });
        }

        if (new Date(checkIn) >= new Date(checkOut)) {
            return res.status(400).json({ message: "Invalid check-in/check-out date" });
        }

        if (listing.isBooked) {
            return res.status(400).json({ message: "Listing is already booked" });
        }

        const nights = Math.ceil((new Date(checkOut) - new Date(checkIn)) / (24 * 60 * 60 * 1000));
        if (nights <= 0) {
            return res.status(400).json({ message: "Invalid booking duration" });
        }

        const pricePerNight = listing.price ?? listing.rent;
        if (!pricePerNight || pricePerNight <= 0) {
            return res.status(400).json({ message: "Property price is not set" });
        }

        const pricing = calculateBookingPrice(pricePerNight, nights, guestCount);

        const booking = await Booking.create({
            checkIn,
            checkOut,
            guestCount: Number(guestCount) || 1,
            totalDays: nights,
            roomBase: pricing.roomBase,
            extraGuestFee: pricing.extraGuestFee,
            basePrice: pricing.basePrice,
            cleaningFee: pricing.cleaningFee,
            platformFee: pricing.platformFee,
            gst: pricing.gst,
            taxes: pricing.gst,
            convenienceFee: pricing.convenienceFee,
            finalAmount: pricing.finalAmount,
            totalRent: pricing.finalAmount,
            bookingReference: generateReference(),
            status: "pending",
            paymentStatus: "pending",
            host: listing.host,
            guest: req.userId,
            listing: listing._id,
        });

        await booking.populate("host", "name email");
        await booking.populate("listing");

        return res.status(201).json(booking);
    } catch (error) {
        console.error("[createBooking]", error.message);
        return res.status(500).json({ message: `Booking error: ${error.message}` });
    }
};

export const confirmPayment = async (req, res) => {
    try {
        const { bookingId } = req.params;

        const booking = await Booking.findById(bookingId).populate("host", "name email").populate("listing");
        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }

        if (booking.guest.toString() !== req.userId) {
            return res.status(403).json({ message: "Unauthorized" });
        }

        if (booking.paymentStatus === "paid") {
            return res.status(400).json({ message: "Payment already completed" });
        }

        const listing = await Listing.findById(booking.listing._id || booking.listing);
        if (listing?.isBooked) {
            return res.status(400).json({ message: "Listing is no longer available" });
        }

        booking.paymentStatus = "paid";
        booking.status = "confirmed";
        await booking.save();

        if (listing) {
            listing.guest = req.userId;
            listing.isBooked = true;
            await listing.save();
        }

        await User.findByIdAndUpdate(req.userId, {
            $push: { booking: booking._id },
        });

        await createNotification({
            userId: req.userId,
            type: "payment_success",
            title: "Payment successful",
            message: `Your booking ${booking.bookingReference} is confirmed.`,
            link: "/mybooking",
        });

        await createNotification({
            userId: booking.host._id || booking.host,
            type: "booking_confirmed",
            title: "New booking confirmed",
            message: `A guest booked your property "${listing?.title}".`,
            link: "/host/dashboard",
        });

        return res.status(200).json(booking);
    } catch (error) {
        console.error("[confirmPayment]", error.message);
        return res.status(500).json({ message: `Payment confirmation error: ${error.message}` });
    }
};

export const cancelBooking = async (req, res) => {
    try {
        const { id } = req.params;
        const listing = await Listing.findById(id);

        if (!listing) {
            return res.status(404).json({ message: "Listing not found" });
        }

        listing.isBooked = false;
        listing.guest = undefined;
        await listing.save();

        const booking = await Booking.findOneAndUpdate(
            { listing: id, status: { $in: ["pending", "confirmed"] } },
            { status: "cancelled", paymentStatus: "failed" },
            { new: true }
        );

        if (booking) {
            await User.findByIdAndUpdate(booking.guest, {
                $pull: { booking: booking._id },
            });

            await createNotification({
                userId: booking.guest,
                type: "booking_cancelled",
                title: "Booking cancelled",
                message: "Your booking has been cancelled successfully.",
                link: "/mybooking",
            });

            if (booking.host) {
                await createNotification({
                    userId: booking.host,
                    type: "booking_cancelled",
                    title: "Booking cancelled",
                    message: "A booking on your property was cancelled.",
                    link: "/host/dashboard",
                });
            }
        } else {
            await User.findByIdAndUpdate(listing.guest, {
                $pull: { booking: listing._id },
            });
        }

        return res.status(200).json({ message: "Booking cancelled" });
    } catch (error) {
        return res.status(500).json({ message: "Booking cancel error" });
    }
};

export const getBookingById = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id)
            .populate("host", "name email")
            .populate("listing");

        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }

        if (booking.guest.toString() !== req.userId) {
            return res.status(403).json({ message: "Unauthorized" });
        }

        return res.status(200).json(booking);
    } catch (error) {
        return res.status(500).json({ message: "Error fetching booking" });
    }
};
