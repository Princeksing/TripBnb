import express from "express";
import isAuth from "../middleware/isAuth.js";
import { checkDb } from "../middleware/checkDb.js";
import upload from "../middleware/multer.js";
import {
    getCurrentUser,
    updateProfile,
    updateAvatar,
    changePassword,
    addToWishlist,
    removeFromWishlist,
    getWishlist,
    getNotifications,
    markNotificationRead,
    markAllNotificationsRead
} from "../controllers/user.controller.js";

const userRouter = express.Router();

userRouter.get("/currentuser", isAuth, checkDb, getCurrentUser);
userRouter.put("/profile", isAuth, updateProfile);
userRouter.put("/password", isAuth, changePassword);
userRouter.post("/avatar", isAuth, upload.single("avatar"), updateAvatar);
userRouter.get("/wishlist", isAuth, getWishlist);
userRouter.post("/wishlist/:listingId", isAuth, addToWishlist);
userRouter.delete("/wishlist/:listingId", isAuth, removeFromWishlist);
userRouter.get("/notifications", isAuth, getNotifications);
userRouter.put("/notifications/read-all", isAuth, markAllNotificationsRead);
userRouter.put("/notifications/:id/read", isAuth, markNotificationRead);

export default userRouter;
