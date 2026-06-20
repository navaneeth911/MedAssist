import express from "express";
import {
  analyze,
  getAssessments,
} from "../controllers/analysisController.js";

import { requireAuth } from "../controllers/authController.js";

const router = express.Router();

router.post("/", requireAuth, analyze);

router.get("/history", requireAuth, getAssessments);

export default router;