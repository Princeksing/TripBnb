import mongoose from "mongoose";

const listingSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        default: 0
    },
    category: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    state: {
        type: String,
        default: ""
    },
    country: {
        type: String,
        default: "India"
    },
    address: {
        type: String,
        default: ""
    },
    landMark: {
        type: String,
        required: true
    },
    latitude: {
        type: Number,
        default: 0
    },
    longitude: {
        type: Number,
        default: 0
    },
    images: {
        type: [String],
        default: []
    },
    image1: String,
    image2: String,
    image3: String,
    rent: Number,
    amenities: {
        type: [String],
        default: []
    },
    ratings: {
        type: Number,
        min: 0,
        max: 5,
        default: 0
    },
    reviews: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review"
    }],
    host: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    guest: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    isBooked: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

listingSchema.pre("validate", function(next) {
    const legacyImages = [this.image1, this.image2, this.image3].filter(Boolean);
    if ((!this.images || this.images.length === 0) && legacyImages.length > 0) {
        this.images = legacyImages;
    }
    if (this.price == null && this.rent != null) {
        this.price = this.rent;
    }
    if (this.rent == null && this.price != null) {
        this.rent = this.price;
    }
    next();
});

const Listing = mongoose.model("Listing", listingSchema);

export default Listing;
