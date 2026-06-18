import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        default: ""
    },
    avatar: {
        type: String,
        default: ""
    },
    role: {
        type: String,
        enum: ["user", "host", "admin"],
        default: "user"
    },
    listing: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Listing"
    }],
    booking: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Booking"
    }],
    wishlist: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Listing"
    }]
}, { timestamps: true });

const User = mongoose.model("User", userSchema);

export default User;
