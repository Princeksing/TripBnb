import Review from "../model/review.model.js";
import Listing from "../model/listing.model.js";
import uploadOnCloudinary from "../config/cloudinary.js";
import { createNotification } from "../utils/notificationHelper.js";

async function updateListingRating(listingId) {
    const reviews = await Review.find({ listing: listingId });
    if (!reviews.length) {
        await Listing.findByIdAndUpdate(listingId, { ratings: 0 });
        return 0;
    }
    const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    const rounded = Math.round(avg * 10) / 10;
    await Listing.findByIdAndUpdate(listingId, {
        ratings: rounded,
        $set: { reviews: reviews.map((r) => r._id) }
    });
    return rounded;
}

export const createReview = async (req, res) => {
    try {
        const { listingId } = req.params;
        const { rating, comment } = req.body;

        const listing = await Listing.findById(listingId);
        if (!listing) {
            return res.status(404).json({ message: "Listing not found" });
        }

        const existing = await Review.findOne({ listing: listingId, user: req.userId });
        if (existing) {
            return res.status(400).json({ message: "You already reviewed this property" });
        }

        let imageUrls = [];
        if (req.files?.images?.length) {
            for (const file of req.files.images) {
                const url = await uploadOnCloudinary(file.path);
                if (url) imageUrls.push(url);
            }
        }

        const review = await Review.create({
            rating: Number(rating),
            comment,
            images: imageUrls,
            user: req.userId,
            listing: listingId
        });

        await review.populate("user", "name avatar");

        const avgRating = await updateListingRating(listingId);

        await createNotification({
            userId: listing.host,
            type: "new_review",
            title: "New review received",
            message: `Your listing "${listing.title}" received a ${rating}-star review.`,
            link: `/listing/${listingId}`
        });

        return res.status(201).json({ review, avgRating });
    } catch (error) {
        return res.status(500).json({ message: `Review error: ${error.message}` });
    }
};

export const getListingReviews = async (req, res) => {
    try {
        const { listingId } = req.params;
        const reviews = await Review.find({ listing: listingId })
            .populate("user", "name avatar")
            .sort({ createdAt: -1 });

        const breakdown = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
        reviews.forEach((r) => { breakdown[r.rating] = (breakdown[r.rating] || 0) + 1; });

        const avgRating = reviews.length
            ? Math.round((reviews.reduce((s, r) => s + r.rating, 0) / reviews.length) * 10) / 10
            : 0;

        return res.status(200).json({
            reviews,
            avgRating,
            reviewCount: reviews.length,
            breakdown
        });
    } catch (error) {
        return res.status(500).json({ message: `Get reviews error: ${error.message}` });
    }
};

export const deleteReview = async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);
        if (!review) {
            return res.status(404).json({ message: "Review not found" });
        }
        if (review.user.toString() !== req.userId && req.userRole !== "admin") {
            return res.status(403).json({ message: "Unauthorized" });
        }

        const listingId = review.listing;
        await review.deleteOne();
        await updateListingRating(listingId);

        return res.status(200).json({ message: "Review deleted" });
    } catch (error) {
        return res.status(500).json({ message: `Delete review error: ${error.message}` });
    }
};
