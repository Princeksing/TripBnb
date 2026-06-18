const CATEGORY_ALIASES = {
  villa: ['villa', 'villas', 'luxury villa'],
  farmHouse: ['farmhouse', 'farm house', 'farm houses', 'farm'],
  poolHouse: ['poolhouse', 'pool house', 'pool houses', 'pool'],
  rooms: ['room', 'rooms', 'cozy room'],
  flat: ['flat', 'flats', 'apartment', 'apartments', 'premium flat'],
  pg: ['pg', 'paying guest'],
  cabin: ['cabin', 'cabins', 'mountain cabin'],
  shops: ['shop', 'shops', 'heritage shop'],
};

const CATEGORY_LABELS = {
  villa: 'Villa',
  farmHouse: 'Farm House',
  poolHouse: 'Pool House',
  rooms: 'Rooms',
  flat: 'Flat',
  pg: 'PG',
  cabin: 'Cabin',
  shops: 'Shops',
};

export function getCategoryLabels() {
  return CATEGORY_LABELS;
}

export function resolveCategoryFromQuery(query) {
  const q = query.toLowerCase().trim();
  const matched = [];
  for (const [cat, aliases] of Object.entries(CATEGORY_ALIASES)) {
    if (aliases.some((a) => q.includes(a) || a.includes(q))) {
      matched.push(cat);
    }
  }
  return matched;
}

export function matchesListing(listing, query) {
  const q = query.toLowerCase().trim();
  if (!q) return true;

  const textFields = [
    listing.title,
    listing.city,
    listing.landMark,
    listing.state,
    listing.country,
    listing.category,
    CATEGORY_LABELS[listing.category],
  ];

  if (textFields.some((f) => f && String(f).toLowerCase().includes(q))) {
    return true;
  }

  const cats = resolveCategoryFromQuery(q);
  if (cats.length > 0 && cats.includes(listing.category)) {
    return true;
  }

  return false;
}

export function filterListings(listings, query) {
  if (!query?.trim()) return listings;
  return listings.filter((l) => matchesListing(l, query));
}

export function getSearchSuggestions(listings, query, limit = 6) {
  if (!query?.trim()) return [];
  const results = filterListings(listings, query);
  return results.slice(0, limit);
}

export const QUICK_SUGGESTIONS = [
  'Goa', 'Mumbai', 'Villa', 'Pool House', 'Farm House', 'Cabin', 'Manali', 'Udaipur',
];

export const RECENT_SEARCHES_KEY = 'tripbnb_recent_searches';
const MAX_RECENT = 8;

export function getRecentSearches() {
  try {
    return JSON.parse(localStorage.getItem(RECENT_SEARCHES_KEY) || '[]');
  } catch {
    return [];
  }
}

export function addRecentSearch(term) {
  if (!term?.trim()) return;
  const trimmed = term.trim();
  const updated = [trimmed, ...getRecentSearches().filter((s) => s !== trimmed)].slice(0, MAX_RECENT);
  localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
}

export function clearRecentSearches() {
  localStorage.removeItem(RECENT_SEARCHES_KEY);
}

export { CATEGORY_ALIASES };
