import express from "express";
import isAuth from "../middleware/isAuth.js";
import isAdmin from "../middleware/isAdmin.js";
import {
    getAdminStats,
    getAllUsers,
    getAllListings,
    getAllBookings,
    deleteUser,
    deleteAdminListing,
    updateUserRole
} from "../controllers/admin.controller.js";

const adminRouter = express.Router();

adminRouter.use(isAuth, isAdmin);

adminRouter.get("/stats", getAdminStats);
adminRouter.get("/users", getAllUsers);
adminRouter.get("/listings", getAllListings);
adminRouter.get("/bookings", getAllBookings);
adminRouter.delete("/users/:id", deleteUser);
adminRouter.delete("/listings/:id", deleteAdminListing);
adminRouter.put("/users/:id/role", updateUserRole);

export default adminRouter;
