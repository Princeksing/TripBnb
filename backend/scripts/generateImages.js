import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.join(__dirname, "../../frontend/public/assets/properties");

const properties = [
    { slug: "villa1", color: "#FF385C", label: "Sea View Villa" },
    { slug: "farmhouse1", color: "#2E7D32", label: "Farm Retreat" },
    { slug: "poolhouse1", color: "#0288D1", label: "Pool House" },
    { slug: "rooms1", color: "#7B1FA2", label: "City Room" },
    { slug: "flat1", color: "#F57C00", label: "City Flat" },
    { slug: "cabin1", color: "#5D4037", label: "Mountain Cabin" },
    { slug: "pg1", color: "#455A64", label: "Student PG" },
    { slug: "shop1", color: "#C62828", label: "Heritage Shop" },
];

const shades = ["22", "44", "66", "88", "aa"];

for (const prop of properties) {
    const dir = path.join(publicDir, prop.slug);
    fs.mkdirSync(dir, { recursive: true });

    for (let i = 1; i <= 5; i++) {
        const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600">
  <defs>
    <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${prop.color}${shades[i - 1]}"/>
      <stop offset="100%" style="stop-color:${prop.color}"/>
    </linearGradient>
  </defs>
  <rect width="800" height="600" fill="url(#g)"/>
  <text x="400" y="280" text-anchor="middle" fill="white" font-family="Arial,sans-serif" font-size="36" font-weight="bold">${prop.label}</text>
  <text x="400" y="330" text-anchor="middle" fill="white" font-family="Arial,sans-serif" font-size="20" opacity="0.9">Photo ${i}</text>
</svg>`;
        fs.writeFileSync(path.join(dir, `${i}.jpg`), svg);
    }
}

console.log("Generated property images in frontend/public/assets/properties/");
