const CATEGORY_ALIASES = {
    villa: ["villa", "villas"],
    farmHouse: ["farmhouse", "farm house", "farm houses", "farm"],
    poolHouse: ["poolhouse", "pool house", "pool houses", "pool"],
    rooms: ["room", "rooms"],
    flat: ["flat", "flats", "apartment", "apartments"],
    pg: ["pg"],
    cabin: ["cabin", "cabins"],
    shops: ["shop", "shops"],
};

export function resolveCategoriesFromQuery(query) {
    const q = query.toLowerCase().trim();
    const matched = [];
    for (const [cat, aliases] of Object.entries(CATEGORY_ALIASES)) {
        if (aliases.some((a) => q.includes(a) || a.includes(q))) {
            matched.push(cat);
        }
    }
    return matched;
}

export { CATEGORY_ALIASES };
