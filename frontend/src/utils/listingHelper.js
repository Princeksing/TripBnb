export const FALLBACK_IMAGE = "/assets/properties/villa1/1.jpg";

export function getListingImages(listing) {
  if (!listing) return [FALLBACK_IMAGE];
  if (listing.images?.length) return listing.images.map(resolveImageUrl);
  const legacy = [listing.image1, listing.image2, listing.image3].filter(Boolean);
  if (legacy.length) return legacy.map(resolveImageUrl);
  return [FALLBACK_IMAGE];
}

export function getListingPrice(listing) {
  return listing?.price ?? listing?.rent ?? 0;
}

export function getPriceLabel(category) {
  if (category === 'pg') return '/ month';
  if (category === 'shops') return '/ day';
  return '/ night';
}

export function resolveImageUrl(url) {
  if (!url) return FALLBACK_IMAGE;
  if (url.startsWith("http") || url.startsWith("/")) return url;
  if (url.startsWith("assets/")) return `/${url}`;
  return url;
}

export function getCoverImage(listing) {
  const images = getListingImages(listing);
  return images[0] || FALLBACK_IMAGE;
}
