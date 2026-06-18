import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    type: {
        type: String,
        enum: ["booking_confirmed", "booking_cancelled", "payment_success", "new_review"],
        required: true
    },
    title: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    link: {
        type: String,
        default: ""
    },
    read: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;
