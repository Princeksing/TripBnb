export function getListingImages(listing) {
    if (!listing) return [];
    if (listing.images?.length) return listing.images;
    return [listing.image1, listing.image2, listing.image3].filter(Boolean);
}

export function normalizeListing(listing) {
    if (!listing) return listing;
    const obj = listing.toObject ? listing.toObject() : { ...listing };
    const images = getListingImages(obj);
    const price = obj.price ?? obj.rent ?? 0;

    return {
        ...obj,
        images,
        image1: images[0] || obj.image1,
        image2: images[1] || obj.image2,
        image3: images[2] || obj.image3,
        price,
        rent: price,
    };
}

export function validateImageCount(count) {
    return count >= 5 && count <= 10;
}
