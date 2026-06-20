import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    phone: {
      type: String,
      default: "",
    },

    dob: {
      type: String,
      default: "",
    },

    settings: {
      notifications: {
        appointmentReminders: { type: Boolean, default: true },
        assessmentUpdates: { type: Boolean, default: true },
        insightReports: { type: Boolean, default: false },
        emailNotifications: { type: Boolean, default: true },
        pushNotifications: { type: Boolean, default: false },
      },
      theme: {
        type: String,
        enum: ["light", "dark", "system"],
        default: "system",
      },
      twoFA: {
        type: Boolean,
        default: false,
      },
      preferences: {
        language: { type: String, default: "en" },
        specialist: { type: String, default: "general" },
        viewMode: { type: String, default: "comfortable" },
        accessibility: {
          highContrast: { type: Boolean, default: false },
          reducedMotion: { type: Boolean, default: false },
          largeText: { type: Boolean, default: false },
        },
      },
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("User", userSchema);
