import express from "express";
import isAuth from "../middleware/isAuth.js";
import { getHostStats, getHostBookings } from "../controllers/host.controller.js";

const hostRouter = express.Router();

hostRouter.get("/stats", isAuth, getHostStats);
hostRouter.get("/bookings", isAuth, getHostBookings);

export default hostRouter;
