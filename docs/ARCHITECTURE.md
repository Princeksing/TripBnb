# TripBnb Architecture

## Overview

TripBnb follows a classic **MERN MVC** architecture with a React SPA frontend and REST API backend.

```
┌─────────────┐     HTTP/REST      ┌─────────────┐     Mongoose     ┌─────────────┐
│   React     │ ◄──────────────► │   Express   │ ◄──────────────► │   MongoDB   │
│   (Vite)    │   JWT Cookies    │   API       │                  │   Atlas     │
└─────────────┘                  └──────┬──────┘                  └─────────────┘
                                        │
                                        ▼
                                 ┌─────────────┐
                                 │  Cloudinary │
                                 │  (Images)   │
                                 └─────────────┘
```

## Frontend Architecture

### State Management
- **AuthContext** — API URL, loading state
- **UserContext** — Current user, auth session
- **ListingContext** — Listings feed, search, listing form
- **BookingContext** — Booking flow, payment data
- **WishlistContext** — Wishlist toggle helpers

### Routing
- Public: Home, Login, Signup, Property details, Static pages
- Protected: Profile, Wishlist, Listings, Bookings, Payment, Dashboards
- Lazy-loaded via `React.lazy()` + `Suspense` for code splitting

### Component Layers
```
pages/          → Full route views
layouts/        → MainLayout, StaticPage wrappers
Component/      → Feature components (Nav, Card, Map, Chatbot)
Component/ui/   → Reusable primitives (Button, Input, Skeleton)
```

## Backend Architecture

### Request Flow
```
Request → helmet + sanitize → CORS → Route → isAuth → Controller → Model → Response
```

### Models
| Model | Purpose |
|-------|---------|
| User | Auth, profile, wishlist, role |
| Listing | Properties with images[], amenities, geo |
| Booking | Reservations with pricing breakdown |
| Review | Ratings + comments + images |
| Notification | In-app alerts |

### Middleware
| Middleware | Purpose |
|------------|---------|
| isAuth | JWT verification, attaches userId + role |
| isAdmin | Admin-only route guard |
| isListingOwner | Host ownership verification |
| multer | File upload to disk → Cloudinary |

## Data Flow Examples

### Booking Flow
1. Guest selects dates → `POST /booking/create/:id` (status: pending)
2. Guest scans UPI QR → `POST /booking/confirm/:id` (status: confirmed)
3. Listing marked booked, notifications sent to guest + host

### Review Flow
1. Guest visits property page after stay
2. Submits review → Cloudinary uploads images → Review saved
3. Listing average rating recalculated → Host notified

## Security

- Passwords hashed with bcrypt (10 rounds)
- JWT stored in httpOnly cookies (7-day expiry)
- MongoDB query sanitization via express-mongo-sanitize
- Helmet security headers
- Listing update/delete restricted to owner
- Admin routes require admin role
- Server-side booking price calculation

## Deployment Architecture

```
[Vercel/Netlify]          [Render/Railway]
   Frontend    ──HTTPS──►    Backend    ──► MongoDB Atlas
   (Static)                  (Node.js)  ──► Cloudinary
```

Environment variables connect the services. CORS `CLIENT_URL` must match the deployed frontend domain.

## Folder Structure

See [FOLDER_STRUCTURE.md](FOLDER_STRUCTURE.md)
