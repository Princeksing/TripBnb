# TripBnb — Airbnb-Style Vacation Rental Platform

A full-stack MERN application for booking unique stays across India. Built as a B.Tech final year / portfolio project with production-ready features.

![Stack](https://img.shields.io/badge/Stack-MERN-green) ![License](https://img.shields.io/badge/License-ISC-blue)

## Features

- **Authentication** — JWT httpOnly cookies, secure signup/login
- **Listings** — 5–10 images via Cloudinary, amenities, geo location, categories
- **Search & Filters** — Debounced search, category pills
- **Booking** — Date range, guest count, server-side price calculation
- **QR Payment** — UPI QR code flow with booking confirmation
- **Reviews** — Star ratings, text reviews, review images, rating breakdown
- **Wishlist** — Save/remove properties with heart icon
- **Maps** — OpenStreetMap + React Leaflet integration
- **Host Dashboard** — Listings, bookings, revenue stats
- **Admin Dashboard** — User/listing/booking management + charts
- **Notifications** — Booking, payment, review alerts
- **Chatbot** — Customer support with predefined responses
- **Responsive UI** — Mobile-first Airbnb-inspired design

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 19, Vite, Tailwind CSS, React Router 7 |
| Backend | Node.js, Express 5, MongoDB, Mongoose |
| Auth | JWT, bcryptjs, cookie-parser |
| Storage | Cloudinary |
| Maps | React Leaflet, OpenStreetMap |

## Quick Start

### Prerequisites
- Node.js 18+
- MongoDB Atlas account
- Cloudinary account

### 1. Clone & install

```bash
git clone <your-repo-url>
cd WanderLust

cd backend && npm install
cd ../frontend && npm install
```

### 2. Backend environment

Copy `backend/.env.example` to `backend/.env` and fill in:

```env
MONGODB_URL=mongodb+srv://...
JWT_SECRET=your_secret_key
PORT=8000
CLIENT_URL=http://localhost:5173
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
ADMIN_EMAIL=admin@tripbnb.com
```

### 3. Frontend environment

Copy `frontend/.env.example` to `frontend/.env`:

```env
VITE_API_URL=https://tripbnb-backend.onrender.com
```

### 4. Run locally

```bash
# Terminal 1 — Backend
cd backend
npm run dev

# Terminal 2 — Frontend
cd frontend
npm run dev
```

Open **http://localhost:5173**

### MongoDB Atlas setup (required)

If APIs return **503** or stats/listings show **0**, MongoDB is not connected:

1. Log in to [MongoDB Atlas](https://cloud.mongodb.com)
2. Go to **Network Access** → **Add IP Address**
3. For development, add `0.0.0.0/0` (allow from anywhere) or your current public IP
4. Go to **Database Access** and confirm the user in `MONGODB_URL` exists with read/write access
5. Copy the connection string into `backend/.env` as `MONGODB_URL`
6. Restart the backend — you should see `[MongoDB] Connected successfully`
7. Verify: `http://localhost:8000/api/health` → `{ "server": "running", "database": "connected" }`

**Demo mode:** If Atlas is unavailable, the frontend loads 8 sample properties from local images in `frontend/public/assets/properties/` automatically.

### Verify APIs

```bash
curl http://localhost:8000/api/health
curl http://localhost:8000/api/debug/database
curl http://localhost:8000/api/listing/get
curl http://localhost:8000/api/stats
```

### 5. Admin access

Sign up with the email set in `ADMIN_EMAIL` — that account gets the **admin** role automatically.

## Deployment

### Backend (Render / Railway / VPS)

1. Set all environment variables from `.env.example`
2. Set `CLIENT_URL` to your frontend URL (e.g. `https://tripbnb.vercel.app`)
3. Set `NODE_ENVIRONMENT=production`
4. Start command: `node index.js`

### Frontend (Vercel / Netlify)

1. Set `VITE_API_URL` to your deployed backend URL
2. Build command: `npm run build`
3. Output directory: `dist`

## Project Structure

```
WanderLust/
├── backend/
│   ├── config/          # DB, JWT, Cloudinary
│   ├── controllers/     # Route handlers
│   ├── middleware/      # Auth, admin, ownership
│   ├── model/           # Mongoose schemas
│   ├── routes/          # API routes
│   └── utils/           # Helpers
├── frontend/
│   └── src/
│       ├── Component/   # UI components
│       ├── Context/     # React Context providers
│       ├── pages/       # Route pages
│       ├── layouts/     # Layout wrappers
│       └── constants/   # Static config
└── docs/                # API & architecture docs
```

## API Documentation

See [docs/API.md](docs/API.md)

## Architecture

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)

## Author

Built for B.Tech Final Year Project / Portfolio showcase.

## License

ISC
