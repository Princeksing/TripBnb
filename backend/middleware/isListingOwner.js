import Listing from "../model/listing.model.js";

const isListingOwner = async (req, res, next) => {
    try {
        const listing = await Listing.findById(req.params.id);
        if (!listing) {
            return res.status(404).json({ message: "Listing not found" });
        }
        if (listing.host.toString() !== req.userId && req.userRole !== "admin") {
            return res.status(403).json({ message: "Not authorized to modify this listing" });
        }
        next();
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export default isListingOwner;
