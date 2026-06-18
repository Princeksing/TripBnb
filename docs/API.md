# TripBnb API Documentation

Base URL: `http://localhost:8000/api` (development)

All authenticated routes require JWT cookie (`withCredentials: true` in Axios).

---

## Auth

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/auth/signup` | No | Register `{ name, email, password }` |
| POST | `/auth/login` | No | Login `{ email, password }` |
| POST | `/auth/logout` | No | Clear JWT cookie |

---

## User

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/user/currentuser` | Yes | Get logged-in user with listings, bookings, wishlist |
| PUT | `/user/profile` | Yes | Update `{ name, phone }` |
| PUT | `/user/password` | Yes | Change password `{ currentPassword, newPassword }` |
| POST | `/user/avatar` | Yes | Upload profile picture (multipart: `avatar`) |
| GET | `/user/wishlist` | Yes | Get wishlist |
| POST | `/user/wishlist/:listingId` | Yes | Add to wishlist |
| DELETE | `/user/wishlist/:listingId` | Yes | Remove from wishlist |
| GET | `/user/notifications` | Yes | Get notifications |
| PUT | `/user/notifications/:id/read` | Yes | Mark notification read |
| PUT | `/user/notifications/read-all` | Yes | Mark all read |

---

## Listings

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/listing/get` | No | Get all listings |
| GET | `/listing/findlistingbyid/:id` | No | Get single listing |
| GET | `/listing/search?query=` | No | Search listings |
| POST | `/listing/add` | Yes | Create listing (multipart: `images[]` 5–10) |
| POST | `/listing/update/:id` | Yes | Update listing (owner only) |
| DELETE | `/listing/delete/:id` | Yes | Delete listing (owner only) |

**Listing body fields:** `title`, `description`, `price`, `city`, `state`, `country`, `address`, `landMark`, `category`, `latitude`, `longitude`, `amenities` (JSON string)

---

## Bookings

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/booking/create/:listingId` | Yes | Create pending booking `{ checkIn, checkOut, guestCount }` |
| POST | `/booking/confirm/:bookingId` | Yes | Confirm payment & booking |
| GET | `/booking/:id` | Yes | Get booking by ID |
| DELETE | `/booking/cancel/:listingId` | Yes | Cancel booking |

---

## Reviews

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/reviews/listing/:listingId` | No | Get reviews + rating breakdown |
| POST | `/reviews/listing/:listingId` | Yes | Submit review `{ rating, comment }` + optional `images[]` |
| DELETE | `/reviews/:id` | Yes | Delete own review |

---

## Host

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/host/stats` | Yes | Host dashboard stats |
| GET | `/host/bookings` | Yes | Host's property bookings |

---

## Admin (role: admin)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/admin/stats` | Platform analytics + chart data |
| GET | `/admin/users` | All users |
| GET | `/admin/listings` | All listings |
| GET | `/admin/bookings` | All bookings |
| DELETE | `/admin/users/:id` | Delete user |
| DELETE | `/admin/listings/:id` | Delete listing |
| PUT | `/admin/users/:id/role` | Update user role `{ role }` |

---

## Stats

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/stats` | No | Public counters (users, properties, bookings) |
| GET | `/health` | No | Health check |

---

## Response Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Bad request / validation error |
| 401 | Not authenticated |
| 403 | Not authorized |
| 404 | Not found |
| 500 | Server error |
