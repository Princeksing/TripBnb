# TripBnb Audit Report — Booking, Search, Pricing & Interactions

**Date:** June 7, 2026  
**Scope:** Business logic, user interactions, pricing, search, payment, and UI fixes

---

## 1. Bugs Found

### Booking System
| Bug | Impact |
|-----|--------|
| Reserve button clickable when property already booked | User clicks Reserve but modal never opens — confusing UX |
| Continue button disabled when `night <= 0` due to wrong fee math | Fees calculated on single-night price instead of total stay |
| Check-out `min` was today, not day after check-in | Same-day bookings allowed in UI until backend rejected |
| `total` state used 7% tax + 7% platform on per-night price | Mismatch between modal total and payment amount |
| Booking context lost on page refresh | Payment page showed "No booking found" after reload |
| My Bookings cards not clickable | Guests couldn't open booked property details |
| Payment didn't refresh listings after confirm | `isBooked` flag stale on homepage until manual refresh |
| Reserve not blocked when `listingPrice === 0` | Button stayed disabled with no clear reason |

### Pricing
| Bug | Impact |
|-----|--------|
| Seed/fallback prices too low (₹800–₹5800) | Unrealistic for demo/production presentation |
| No cleaning fee, GST breakdown, or convenience fee | Payment didn't match professional Airbnb-style pricing |
| Backend used flat 7% tax + 7% platform | Didn't match requested fee structure |

### Search & Navigation
| Bug | Impact |
|-----|--------|
| Popular destination pills had no click handler | Decorative only — `cursor-default` |
| Nav search button had no `onClick` | Search icon did nothing |
| Debounced search stale closure (`useCallback([], [])`) | Fallback search could fail after API mode switch |
| Duplicate `searchRef` on desktop + mobile | Click-outside closed dropdown unreliably |
| Search didn't include category field | Category searches missed results |

### Buttons & UI
| Bug | Impact |
|-----|--------|
| Home newsletter Subscribe had no handler | Button did nothing |
| Chatbot didn't persist history | Messages lost on close/refresh |

---

## 2. Bugs Fixed

### Booking System ✅
- **Reserve** disabled when property is booked by another guest
- **Continue to payment** validates dates, uses correct night calculation
- Check-out minimum set to **check-in + 1 day**
- Unified pricing via `calculateBookingPrice()` — same logic frontend + backend
- Booking data persisted in **sessionStorage** (survives refresh on payment page)
- After payment: refreshes **user data + listings**, shows toast, redirects to `/booked`
- **My Bookings** refreshes on mount and cards navigate to property detail
- Booked properties show badge; guests can still view their bookings

### Pricing System ✅
- Realistic category-based prices:

| Category | Price |
|----------|-------|
| Villa | ₹9,999/night |
| Farm House | ₹14,999/night |
| Pool House | ₹18,999/night |
| Rooms | ₹3,499/night |
| Flat | ₹7,999/night |
| PG | ₹4,500/month |
| Cabin | ₹8,500/night |
| Shop | ₹6,500/day |

- Professional breakdown: Base + Cleaning (5%) + Platform (3%) + GST (18%) + Convenience (₹99)
- Example: ₹5,000 × 1 night → **Total ₹6,471**
- `updateListingPrices.js` runs on server start to sync DB listings
- No listing can have price = 0 (backend rejects booking)

### Search ✅
- Popular destinations filter listings by city + scroll to results
- Search dropdown navigates to listing, closes dropdown, highlights result
- 300ms debounce with fixed closure dependencies
- Search by title, city, landmark, **category**
- Search button triggers search on click + Enter key

### Payment ✅
- UPI QR (dynamic QR via `qrcode.react`)
- UPI ID input
- Card payment UI (demo)
- Net banking UI (demo)
- Full price breakdown before payment
- Invoice + booking ID on confirmation page

### Map ✅
- OpenStreetMap + Leaflet (no paid API)
- Property marker + nearby attraction markers
- City-specific nearby places list
- Coordinates displayed

### Chatbot ✅
- Topics: Booking help, Cancellation, Refund, Contact host, Property info, Payment help
- Chat history stored in **localStorage**
- Clear chat option

### Other ✅
- Recently viewed section on Home (localStorage)
- Category-aware price labels (/night, /month, /day)
- Subscribe form with validation + toast

---

## 3. Files Modified

### Backend
- `backend/utils/pricing.js` — **NEW** shared pricing calculator
- `backend/controllers/booking.controller.js` — new fee structure, validation
- `backend/model/booking.model.js` — cleaningFee, gst, convenienceFee fields
- `backend/scripts/updateListingPrices.js` — **NEW** price sync on startup
- `backend/scripts/seedDatabase.js` — realistic seed prices
- `backend/controllers/listing.controller.js` — category in search
- `backend/index.js` — runs price update on connect

### Frontend
- `frontend/src/utils/pricing.js` — **NEW**
- `frontend/src/utils/recentlyViewed.js` — **NEW**
- `frontend/src/Component/PriceBreakdown.jsx` — **NEW**
- `frontend/src/Context/BookingContext.jsx` — sessionStorage, validation
- `frontend/src/pages/ViewCard.jsx` — booking modal, pricing, reserve fix
- `frontend/src/pages/Payment.jsx` — multi-method payment UI
- `frontend/src/pages/Booked.jsx` — invoice, booking ID, animation
- `frontend/src/pages/MyBooking.jsx` — auto-refresh, clickable cards
- `frontend/src/pages/Home.jsx` — destinations, recently viewed, subscribe
- `frontend/src/Component/Nav.jsx` — search fixes, highlight, debounce
- `frontend/src/Component/Card.jsx` — price unit, view when booked
- `frontend/src/Component/Chatbot.jsx` — localStorage history
- `frontend/src/Component/PropertyMap.jsx` — nearby attractions, coords
- `frontend/src/data/fallbackListings.js` — updated prices
- `frontend/src/constants/chatbotResponses.js` — new FAQ topics
- `frontend/src/utils/listingHelper.js` — getPriceLabel()
- `frontend/src/Context/ListingContext.jsx` — category search fallback

---

## 4. New Features Added

| Feature | Description |
|---------|-------------|
| Price breakdown component | Reusable Airbnb-style fee summary |
| Multi-method payment UI | UPI QR, UPI ID, Card, Net Banking tabs |
| Booking invoice page | Full breakdown + booking ID on confirmation |
| Recently viewed | localStorage-based, shown on Home |
| Chat history persistence | Survives page refresh |
| City-based map attractions | Nearby places per destination |
| Category price labels | /night, /month, /day based on property type |
| Search result highlight | Visual feedback on selected suggestion |
| Auto price sync | DB listings updated to realistic prices on startup |

---

## 5. Remaining Issues

| Issue | Notes |
|-------|-------|
| Payment is honor-system | No real Razorpay/Stripe — suitable for academic demo |
| Card/Net banking are UI-only | No actual payment gateway integration |
| Single-booking model | One guest per listing (`isBooked` flag) — not date-range availability |
| Availability calendar | Not implemented as interactive calendar (date pickers used instead) |
| Demo fallback IDs | Properties with `demo-*` IDs can't book via API (MongoDB IDs required) |

---

## 6. Performance Improvements

- Debounced search (300ms) reduces API calls while typing
- sessionStorage for booking state avoids re-fetch on payment page refresh
- localStorage for chat + recently viewed — no server round-trips
- Memoized price breakdown in ViewCard (`useMemo`) — fewer recalculations
- My Bookings loads skeleton while refreshing user data
- Separate desktop/mobile search refs — reliable click-outside handling

---

## Testing Checklist

```bash
# Backend
cd backend && npm run dev

# Frontend
cd frontend && npm run dev
```

1. Open property → click **Reserve** → select dates → **Continue to payment**
2. Verify price breakdown matches: Base + 5% + 3% + 18% GST + ₹99
3. Complete payment → confirm → see booking ID on `/booked`
4. Check **My Bookings** shows new booking instantly
5. Property shows **Booked** badge on homepage
6. Click popular destination pill → filters by city
7. Search in nav → click result → navigates to listing
8. Open chatbot → select FAQ → refresh page → history persists

---

*Report generated after full audit of TripBnb booking, search, pricing, and interaction systems.*
