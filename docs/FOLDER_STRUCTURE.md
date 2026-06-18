# Folder Structure

```
WanderLust/
├── README.md
├── docs/
│   ├── API.md
│   ├── ARCHITECTURE.md
│   └── FOLDER_STRUCTURE.md
│
├── backend/
│   ├── index.js                 # App entry, middleware, routes
│   ├── package.json
│   ├── .env.example
│   ├── config/
│   │   ├── db.js                # MongoDB connection
│   │   ├── token.js             # JWT generation
│   │   └── cloudinary.js        # Image upload helper
│   ├── model/
│   │   ├── user.model.js
│   │   ├── listing.model.js
│   │   ├── booking.model.js
│   │   ├── review.model.js
│   │   └── notification.model.js
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── user.controller.js
│   │   ├── listing.controller.js
│   │   ├── booking.controller.js
│   │   ├── review.controller.js
│   │   ├── host.controller.js
│   │   ├── admin.controller.js
│   │   └── stats.controller.js
│   ├── routes/
│   │   ├── auth.route.js
│   │   ├── user.route.js
│   │   ├── listing.route.js
│   │   ├── booking.route.js
│   │   ├── review.route.js
│   │   ├── host.route.js
│   │   ├── admin.route.js
│   │   └── stats.route.js
│   ├── middleware/
│   │   ├── isAuth.js
│   │   ├── isAdmin.js
│   │   ├── isListingOwner.js
│   │   └── multer.js
│   └── utils/
│       ├── listingHelper.js
│       └── notificationHelper.js
│
└── frontend/
    ├── index.html
    ├── package.json
    ├── .env.example
    ├── vite.config.js
    ├── tailwind.config.js
    └── src/
        ├── main.jsx               # Entry + providers
        ├── App.jsx                # Routes (lazy loaded)
        ├── index.css              # Tailwind + global styles
        ├── Context/
        │   ├── AuthContext.jsx
        │   ├── UserContext.jsx
        │   ├── ListingContext.jsx
        │   ├── BookingContext.jsx
        │   └── WishlistContext.jsx
        ├── layouts/
        │   ├── MainLayout.jsx
        │   └── StaticPage.jsx
        ├── pages/
        │   ├── Home.jsx
        │   ├── Login.jsx / SignUp.jsx
        │   ├── ListingPage1-3.jsx
        │   ├── ViewCard.jsx
        │   ├── Profile.jsx
        │   ├── Wishlist.jsx
        │   ├── Payment.jsx / Booked.jsx
        │   ├── HostDashboard.jsx
        │   ├── AdminDashboard.jsx
        │   └── About, Contact, etc.
        ├── Component/
        │   ├── Nav.jsx / Footer.jsx / Card.jsx
        │   ├── ImageGallery.jsx / PropertyMap.jsx
        │   ├── ReviewSection.jsx / Chatbot.jsx
        │   ├── WishlistButton.jsx / NotificationBell.jsx
        │   └── ui/                  # Button, Input, Skeleton, etc.
        ├── constants/
        │   ├── amenities.js
        │   └── chatbotResponses.js
        └── utils/
            ├── debounce.js
            └── listingHelper.js
```
