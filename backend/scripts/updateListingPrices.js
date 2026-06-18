import Listing from "../model/listing.model.js";
import { CATEGORY_PRICES } from "../utils/pricing.js";

export async function updateListingPrices() {
    const listings = await Listing.find();
    let updated = 0;

    for (const listing of listings) {
        const categoryPrice = CATEGORY_PRICES[listing.category];
        if (!categoryPrice) continue;

        if (listing.price !== categoryPrice || listing.rent !== categoryPrice) {
            listing.price = categoryPrice;
            listing.rent = categoryPrice;
            await listing.save();
            updated++;
        }
    }

    if (updated > 0) {
        console.log(`[Prices] Updated ${updated} listings with realistic prices`);
    }
}
