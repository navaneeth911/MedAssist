import express from "express";
import { getInsights } from "../controllers/InsightsController.js";
import { requireAuth } from "../controllers/authController.js";

const router = express.Router();

router.get("/", requireAuth, getInsights);

export default router;