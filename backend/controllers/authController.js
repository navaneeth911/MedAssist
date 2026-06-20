import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Assessment from "../models/Assessment.js";
import Appointment from "../models/Appointment.js";

const publicUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  phone: user.phone || "",
  dob: user.dob || "",
  settings: user.settings,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

export const requireAuth = async (req, res, next) => {
  try {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : null;

    if (!token) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({
      token,
      user: publicUser(user),
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Registration failed",
    });
  }
};

export const login = async (req, res) => {
  try {
    console.log("REGISTER HIT");
    console.log(req.body);
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      user: publicUser(user),
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Login failed",
    });
  }
};

export const getMe = async (req, res) => {
  res.json({ user: publicUser(req.user) });
};

export const updateMe = async (req, res) => {
  try {
    const { name, email, phone, dob, settings } = req.body;

    if (email && email !== req.user.email) {
      const existingUser = await User.findOne({ email, _id: { $ne: req.user._id } });
      if (existingUser) {
        return res.status(400).json({ message: "Email is already in use" });
      }
    }

    if (typeof name === "string") req.user.name = name.trim();
    if (typeof email === "string") req.user.email = email.trim().toLowerCase();
    if (typeof phone === "string") req.user.phone = phone.trim();
    if (typeof dob === "string") req.user.dob = dob;

    if (settings && typeof settings === "object") {
      req.user.settings ||= {};
      req.user.settings.notifications ||= {};
      req.user.settings.preferences ||= {};
      req.user.settings.preferences.accessibility ||= {};

      if (typeof settings.theme === "string") req.user.settings.theme = settings.theme;
      if (typeof settings.twoFA === "boolean") req.user.settings.twoFA = settings.twoFA;

      if (settings.notifications && typeof settings.notifications === "object") {
        const notificationKeys = [
          "appointmentReminders",
          "assessmentUpdates",
          "insightReports",
          "emailNotifications",
          "pushNotifications",
        ];

        for (const [key, value] of Object.entries(settings.notifications)) {
          if (typeof value === "boolean" && notificationKeys.includes(key)) {
            req.user.settings.notifications[key] = value;
          }
        }
      }

      if (settings.preferences && typeof settings.preferences === "object") {
        const { language, specialist, viewMode, accessibility } = settings.preferences;

        if (typeof language === "string") req.user.settings.preferences.language = language;
        if (typeof specialist === "string") req.user.settings.preferences.specialist = specialist;
        if (typeof viewMode === "string") req.user.settings.preferences.viewMode = viewMode;

        if (accessibility && typeof accessibility === "object") {
          const accessibilityKeys = ["highContrast", "reducedMotion", "largeText"];

          for (const [key, value] of Object.entries(accessibility)) {
            if (typeof value === "boolean" && accessibilityKeys.includes(key)) {
              req.user.settings.preferences.accessibility[key] = value;
            }
          }
        }
      }

      req.user.markModified("settings");
    }

    await req.user.save();
    res.json({ user: publicUser(req.user) });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update profile" });
  }
};

export const updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword || newPassword.length < 8) {
      return res.status(400).json({
        message: "Current password and a new password of at least 8 characters are required",
      });
    }

    const isMatch = await bcrypt.compare(currentPassword, req.user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    req.user.password = await bcrypt.hash(newPassword, 10);
    await req.user.save();

    res.json({ message: "Password updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update password" });
  }
};

export const deleteMe = async (req, res) => {
  try {
    await Promise.all([
      Assessment.deleteMany({ userId: req.user._id }),
      Appointment.deleteMany({ userId: req.user._id }),
      User.findByIdAndDelete(req.user._id),
    ]);

    res.json({ message: "Account deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete account" });
  }
};
