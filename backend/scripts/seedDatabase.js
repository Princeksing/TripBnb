import bcrypt from "bcryptjs";
import User from "../model/user.model.js";
import Listing from "../model/listing.model.js";

const demoProperties = [
    {
        slug: "villa1",
        title: "Luxury Sea View Villa",
        description: "Spacious 3BHK villa with private pool and stunning sea views. Perfect for family vacations.",
        price: 9999,
        category: "villa",
        city: "Goa",
        state: "Goa",
        landMark: "Baga Beach",
        amenities: ["WiFi", "Parking", "AC", "Swimming Pool", "Kitchen"],
        latitude: 15.5559,
        longitude: 73.7517,
    },
    {
        slug: "farmhouse1",
        title: "Peaceful Farm Retreat",
        description: "Escape the city in this charming farmhouse surrounded by greenery and fresh air.",
        price: 14999,
        category: "farmHouse",
        city: "Lonavala",
        state: "Maharashtra",
        landMark: "Tiger Point",
        amenities: ["WiFi", "Parking", "Kitchen", "Balcony", "Pet Friendly"],
        latitude: 18.7546,
        longitude: 73.4062,
    },
    {
        slug: "poolhouse1",
        title: "Modern Pool House",
        description: "Stylish pool house with infinity pool, BBQ area, and sunset terrace.",
        price: 18999,
        category: "poolHouse",
        city: "Udaipur",
        state: "Rajasthan",
        landMark: "Lake Pichola",
        amenities: ["WiFi", "Swimming Pool", "AC", "Parking", "Gym"],
        latitude: 24.5854,
        longitude: 73.7125,
    },
    {
        slug: "rooms1",
        title: "Cozy City Room",
        description: "Clean and comfortable private room in the heart of the city. Great for solo travelers.",
        price: 3499,
        category: "rooms",
        city: "Bangalore",
        state: "Karnataka",
        landMark: "Indiranagar",
        amenities: ["WiFi", "AC", "TV", "Kitchen"],
        latitude: 12.9716,
        longitude: 77.6412,
    },
    {
        slug: "flat1",
        title: "Premium City Flat",
        description: "Fully furnished 2BHK flat with modern amenities and metro connectivity.",
        price: 7999,
        category: "flat",
        city: "Mumbai",
        state: "Maharashtra",
        landMark: "Bandra West",
        amenities: ["WiFi", "AC", "TV", "Washing Machine", "Parking"],
        latitude: 19.0596,
        longitude: 72.8295,
    },
    {
        slug: "cabin1",
        title: "Mountain View Cabin",
        description: "Rustic wooden cabin with panoramic mountain views. Ideal for nature lovers.",
        price: 8500,
        category: "cabin",
        city: "Manali",
        state: "Himachal Pradesh",
        landMark: "Old Manali",
        amenities: ["WiFi", "Kitchen", "Balcony", "Parking"],
        latitude: 32.2432,
        longitude: 77.1892,
    },
    {
        slug: "pg1",
        title: "Student Friendly PG",
        description: "Affordable PG with meals, laundry, and high-speed WiFi included.",
        price: 4500,
        category: "pg",
        city: "Pune",
        state: "Maharashtra",
        landMark: "Koregaon Park",
        amenities: ["WiFi", "AC", "Washing Machine", "Kitchen"],
        latitude: 18.5362,
        longitude: 73.8958,
    },
    {
        slug: "shop1",
        title: "Heritage Shop Stay",
        description: "Unique stay above a heritage shop in the old city market area.",
        price: 6500,
        category: "shops",
        city: "Jaipur",
        state: "Rajasthan",
        landMark: "Pink City",
        amenities: ["WiFi", "AC", "Parking"],
        latitude: 26.9124,
        longitude: 75.7873,
    },
];

function buildImages(slug) {
    return [1, 2, 3, 4, 5].map((n) => `/assets/properties/${slug}/${n}.jpg`);
}

export async function seedDatabase() {
    const listingCount = await Listing.countDocuments();
    if (listingCount > 0) {
        console.log(`[Seed] Database already has ${listingCount} listings, skipping seed`);
        return;
    }

    console.log("[Seed] Seeding demo data...");

    let host = await User.findOne({ email: "demo@tripbnb.com" });
    if (!host) {
        const hash = await bcrypt.hash("demo1234", 10);
        host = await User.create({
            name: "Demo Host",
            email: "demo@tripbnb.com",
            password: hash,
            role: "host",
        });
        console.log("[Seed] Created demo host: demo@tripbnb.com / demo1234");
    }

    for (const prop of demoProperties) {
        const images = buildImages(prop.slug);
        await Listing.create({
            ...prop,
            country: "India",
            address: `${prop.landMark}, ${prop.city}`,
            images,
            image1: images[0],
            image2: images[1],
            image3: images[2],
            rent: prop.price,
            host: host._id,
            ratings: 4.5,
        });
    }

    await User.findByIdAndUpdate(host._id, {
        $set: { role: "host" },
    });

    console.log(`[Seed] Created ${demoProperties.length} demo listings with local images`);
}
