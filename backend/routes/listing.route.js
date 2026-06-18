import express from "express"
import isAuth from "../middleware/isAuth.js"
import upload from "../middleware/multer.js"
import isListingOwner from "../middleware/isListingOwner.js"
import { checkDb } from "../middleware/checkDb.js"
import { addListing, deleteListing, findListing, getListing, ratingListing, search, updateListing } from "../controllers/listing.controller.js"

let listingRouter = express.Router()

listingRouter.post("/add", isAuth, upload.fields([
    { name: "images", maxCount: 10 },
    { name: "image1", maxCount: 1 },
    { name: "image2", maxCount: 1 },
    { name: "image3", maxCount: 1 },
]), addListing)

listingRouter.get("/get", checkDb, getListing)
listingRouter.get("/findlistingbyid/:id", checkDb, findListing)
listingRouter.delete("/delete/:id", isAuth, isListingOwner, deleteListing)
listingRouter.post("/ratings/:id", isAuth, ratingListing)
listingRouter.get("/search", checkDb, search)

listingRouter.post("/update/:id", isAuth, upload.fields([
    { name: "images", maxCount: 10 },
    { name: "image1", maxCount: 1 },
    { name: "image2", maxCount: 1 },
    { name: "image3", maxCount: 1 },
]), isListingOwner, updateListing)

export default listingRouter
