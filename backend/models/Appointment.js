import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema({
  doctorName: String,
  specialist: String,
  patientName: String,
  appointmentDate: String,

  userId: {
    type: String,
    required: true,
  },

  reminderEmailSentAt: Date,
  reminderEmailLastError: String,

  status: {
    type: String,
    default: "Upcoming",
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model(
  "Appointment",
  appointmentSchema
);
