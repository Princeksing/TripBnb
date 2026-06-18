import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
    host: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    guest: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    listing: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Listing",
        required: true
    },
    status: {
        type: String,
        enum: ["pending", "confirmed", "cancelled", "completed"],
        default: "pending"
    },
    checkIn: {
        type: Date,
        required: true
    },
    checkOut: {
        type: Date,
        required: true
    },
    guestCount: {
        type: Number,
        default: 1,
        min: 1
    },
    totalDays: {
        type: Number,
        required: true
    },
    basePrice: {
        type: Number,
        required: true
    },
    roomBase: {
        type: Number,
        default: 0
    },
    extraGuestFee: {
        type: Number,
        default: 0
    },
    taxes: {
        type: Number,
        required: true
    },
    platformFee: {
        type: Number,
        required: true
    },
    extraGuestFee: {
        type: Number,
        default: 0
    },
    roomBase: {
        type: Number,
        default: 0
    },
    gst: {
        type: Number,
        default: 0
    },
    convenienceFee: {
        type: Number,
        default: 99
    },
    finalAmount: {
        type: Number,
        required: true
    },
    totalRent: {
        type: Number,
        required: true
    },
    bookingReference: {
        type: String,
        unique: true
    },
    paymentStatus: {
        type: String,
        enum: ["pending", "paid", "failed"],
        default: "pending"
    },
    upiId: {
        type: String,
        default: "tripbnb@upi"
    }
}, { timestamps: true });

const Booking = mongoose.model("Booking", bookingSchema);

export default Booking;
