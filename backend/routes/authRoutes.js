import express from "express";

import {
  register,
  login,
  requireAuth,
  getMe,
  updateMe,
  updatePassword,
  deleteMe,
} from "../controllers/authController.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", requireAuth, getMe);
router.patch("/me", requireAuth, updateMe);
router.patch("/me/password", requireAuth, updatePassword);
router.delete("/me", requireAuth, deleteMe);

export default router;
