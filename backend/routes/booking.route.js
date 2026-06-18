import express from "express";
import isAuth from "../middleware/isAuth.js";
import { cancelBooking, confirmPayment, createBooking, getBookingById } from "../controllers/booking.controller.js";

const bookingRouter = express.Router();

bookingRouter.post("/create/:id", isAuth, createBooking);
bookingRouter.post("/confirm/:bookingId", isAuth, confirmPayment);
bookingRouter.get("/:id", isAuth, getBookingById);
bookingRouter.delete("/cancel/:id", isAuth, cancelBooking);

export default bookingRouter;
