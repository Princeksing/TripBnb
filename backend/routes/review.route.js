import express from "express";
import isAuth from "../middleware/isAuth.js";
import upload from "../middleware/multer.js";
import { createReview, deleteReview, getListingReviews } from "../controllers/review.controller.js";

const reviewRouter = express.Router();

reviewRouter.get("/listing/:listingId", getListingReviews);
reviewRouter.post("/listing/:listingId", isAuth, upload.array("images", 5), createReview);
reviewRouter.delete("/:id", isAuth, deleteReview);

export default reviewRouter;
