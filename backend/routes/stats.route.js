import express from "express";
import { checkDb } from "../middleware/checkDb.js";
import { getStats } from "../controllers/stats.controller.js";

const statsRouter = express.Router();

statsRouter.get("/", checkDb, getStats);

export default statsRouter;
