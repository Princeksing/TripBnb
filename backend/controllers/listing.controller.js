import uploadOnCloudinary from "../config/cloudinary.js";
import Listing from "../model/listing.model.js";
import User from "../model/user.model.js";
import { normalizeListing, validateImageCount, getListingImages } from "../utils/listingHelper.js";
import { resolveCategoriesFromQuery } from "../utils/searchHelper.js";

async function uploadImages(files) {
    const urls = [];
    for (const file of files) {
        const url = await uploadOnCloudinary(file.path);
        if (url) urls.push(url);
    }
    return urls;
}

export const addListing = async (req, res) => {
    try {
        const host = req.userId;
        const {
            title, description, rent, price, city, landMark, category,
            state, country, address, latitude, longitude, amenities
        } = req.body;

        let imageUrls = [];

        if (req.files?.images?.length) {
            imageUrls = await uploadImages(req.files.images);
        } else if (req.files?.image1) {
            const legacyFiles = [req.files.image1?.[0], req.files.image2?.[0], req.files.image3?.[0]].filter(Boolean);
            imageUrls = await uploadImages(legacyFiles);
        }

        if (!validateImageCount(imageUrls.length)) {
            return res.status(400).json({ message: "Listing must have between 5 and 10 images" });
        }

        let parsedAmenities = [];
        if (amenities) {
            parsedAmenities = typeof amenities === "string" ? JSON.parse(amenities) : amenities;
        }

        const listingPrice = Number(price || rent);

        const listing = await Listing.create({
            title,
            description,
            price: listingPrice,
            rent: listingPrice,
            city,
            landMark,
            category,
            state: state || "",
            country: country || "India",
            address: address || landMark,
            latitude: Number(latitude) || 0,
            longitude: Number(longitude) || 0,
            amenities: parsedAmenities,
            images: imageUrls,
            image1: imageUrls[0],
            image2: imageUrls[1],
            image3: imageUrls[2],
            host
        });

        const user = await User.findByIdAndUpdate(host, { $push: { listing: listing._id } }, { new: true });

        if (!user) {
            return res.status(404).json({ message: "user is not found" });
        }

        await User.findByIdAndUpdate(host, { role: "host" });

        return res.status(201).json(normalizeListing(listing));
    } catch (error) {
        return res.status(500).json({ message: `AddListing error ${error}` });
    }
};

export const getListing = async (req, res) => {
    try {
        const listings = await Listing.find().sort({ createdAt: -1 });
        return res.status(200).json(listings.map(normalizeListing));
    } catch (error) {
        return res.status(500).json({ message: `getListing error ${error}` });
    }
};

export const findListing = async (req, res) => {
    try {
        const { id } = req.params;
        const listing = await Listing.findById(id).populate("host", "name email createdAt");
        if (!listing) {
            return res.status(404).json({ message: "listing not found" });
        }
        return res.status(200).json(normalizeListing(listing));
    } catch (error) {
        return res.status(500).json({ message: `findListing error ${error}` });
    }
};

export const updateListing = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            title, description, rent, price, city, landMark, category,
            state, country, address, latitude, longitude, amenities
        } = req.body;

        const existing = await Listing.findById(id);
        if (!existing) {
            return res.status(404).json({ message: "listing not found" });
        }

        const updateData = {};
        if (title) updateData.title = title;
        if (description) updateData.description = description;
        if (price || rent) {
            updateData.price = Number(price || rent);
            updateData.rent = Number(price || rent);
        }
        if (city) updateData.city = city;
        if (landMark) updateData.landMark = landMark;
        if (category) updateData.category = category;
        if (state !== undefined) updateData.state = state;
        if (country !== undefined) updateData.country = country;
        if (address !== undefined) updateData.address = address;
        if (latitude !== undefined) updateData.latitude = Number(latitude);
        if (longitude !== undefined) updateData.longitude = Number(longitude);
        if (amenities) {
            updateData.amenities = typeof amenities === "string" ? JSON.parse(amenities) : amenities;
        }

        let newImages = [...(existing.images?.length ? existing.images : getListingImages(existing))];

        if (req.files?.images?.length) {
            const uploaded = await uploadImages(req.files.images);
            newImages = uploaded;
        } else {
            if (req.files?.image1) {
                newImages[0] = await uploadOnCloudinary(req.files.image1[0].path);
            }
            if (req.files?.image2) {
                newImages[1] = await uploadOnCloudinary(req.files.image2[0].path);
            }
            if (req.files?.image3) {
                newImages[2] = await uploadOnCloudinary(req.files.image3[0].path);
            }
        }

        newImages = newImages.filter(Boolean);

        if (newImages.length > 0) {
            if (!validateImageCount(newImages.length)) {
                return res.status(400).json({ message: "Listing must have between 5 and 10 images" });
            }
            updateData.images = newImages;
            updateData.image1 = newImages[0];
            updateData.image2 = newImages[1];
            updateData.image3 = newImages[2];
        }

        const listing = await Listing.findByIdAndUpdate(id, updateData, { new: true });
        return res.status(200).json(normalizeListing(listing));
    } catch (error) {
        return res.status(500).json({ message: `UpdateListing Error ${error}` });
    }
};

export const deleteListing = async (req, res) => {
    try {
        const { id } = req.params;
        const listing = await Listing.findByIdAndDelete(id);
        if (!listing) {
            return res.status(404).json({ message: "listing not found" });
        }
        const user = await User.findByIdAndUpdate(listing.host, {
            $pull: { listing: listing._id }
        }, { new: true });
        if (!user) {
            return res.status(404).json({ message: "user is not found" });
        }
        return res.status(200).json({ message: "Listing deleted" });
    } catch (error) {
        return res.status(500).json({ message: `DeleteListing Error ${error}` });
    }
};

export const ratingListing = async (req, res) => {
    try {
        const { id } = req.params;
        const { ratings } = req.body;

        const listing = await Listing.findById(id);
        if (!listing) {
            return res.status(404).json({ message: "Listing not found" });
        }

        listing.ratings = Number(ratings);
        await listing.save();

        return res.status(200).json({ ratings: listing.ratings });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Rating error" });
    }
};

export const search = async (req, res) => {
    try {
        const { query } = req.query;

        if (!query || query.trim() === "") {
            const listings = await Listing.find().sort({ createdAt: -1 });
            return res.status(200).json(listings.map(normalizeListing));
        }

        const categoryMatches = resolveCategoriesFromQuery(query);

        const orConditions = [
            { landMark: { $regex: query, $options: "i" } },
            { city: { $regex: query, $options: "i" } },
            { title: { $regex: query, $options: "i" } },
            { state: { $regex: query, $options: "i" } },
            { country: { $regex: query, $options: "i" } },
            { category: { $regex: query, $options: "i" } },
        ];

        if (categoryMatches.length > 0) {
            orConditions.push({ category: { $in: categoryMatches } });
        }

        const listings = await Listing.find({ $or: orConditions });

        return res.status(200).json(listings.map(normalizeListing));
    } catch (error) {
        console.error("Search error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
