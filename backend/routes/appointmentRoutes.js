import express from "express";

import {
  bookAppointment,
  getAppointments,
  cancelAppointment,
} from "../controllers/appointmentController.js";
import { requireAuth } from "../controllers/authController.js";

const router = express.Router();

router.post("/", requireAuth, bookAppointment);

router.get("/", requireAuth, getAppointments);


router.put(
  "/:id/cancel",
  requireAuth,
  cancelAppointment
);

export default router;