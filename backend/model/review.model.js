import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    comment: {
        type: String,
        required: true,
        trim: true
    },
    images: {
        type: [String],
        default: []
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    listing: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Listing",
        required: true
    }
}, { timestamps: true });

reviewSchema.index({ listing: 1, user: 1 }, { unique: true });

const Review = mongoose.model("Review", reviewSchema);

export default Review;
