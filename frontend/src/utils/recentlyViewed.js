const STORAGE_KEY = 'tripbnb_recently_viewed';
const MAX_ITEMS = 8;

export function addRecentlyViewed(listing) {
  if (!listing?._id) return;
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    const filtered = stored.filter((item) => item._id !== listing._id);
    const updated = [
      {
        _id: listing._id,
        title: listing.title,
        city: listing.city,
        landMark: listing.landMark,
        price: listing.price ?? listing.rent,
        category: listing.category,
        images: listing.images,
        image1: listing.image1,
        ratings: listing.ratings,
      },
      ...filtered,
    ].slice(0, MAX_ITEMS);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch {
    // ignore storage errors
  }
}

export function getRecentlyViewed() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
}
