import Appointment from "../models/Appointment.js";
import User from "../models/User.js";
import { isEmailConfigured, sendEmail } from "./emailService.js";

const ONE_HOUR = 60 * 60 * 1000;

const tomorrowRange = () => {
  const start = new Date();
  start.setDate(start.getDate() + 1);
  start.setHours(0, 0, 0, 0);

  const end = new Date(start);
  end.setDate(end.getDate() + 1);

  return { start, end };
};

const formatAppointmentDate = (value) =>
  new Date(value).toLocaleString("en-IN", {
    dateStyle: "full",
    timeStyle: "short",
  });

export const sendTomorrowAppointmentReminders = async () => {
  if (!isEmailConfigured()) {
    console.log("Appointment reminder email skipped: SMTP is not configured.");
    return;
  }

  const { start, end } = tomorrowRange();
  const candidates = await Appointment.find({
    status: "Upcoming",
    reminderEmailSentAt: { $exists: false },
  });

  const dueAppointments = candidates.filter((appointment) => {
    const date = new Date(appointment.appointmentDate);
    return !Number.isNaN(date.getTime()) && date >= start && date < end;
  });

  for (const appointment of dueAppointments) {
    try {
      const user = await User.findById(appointment.userId);

      if (!user) {
        appointment.reminderEmailLastError = "User not found";
        await appointment.save();
        continue;
      }

      const notifications = user.settings?.notifications;
      const shouldEmail =
        notifications?.emailNotifications !== false &&
        notifications?.appointmentReminders !== false;

      if (!shouldEmail) continue;

      await sendEmail({
        to: user.email,
        subject: "Reminder: Your MedAssist appointment is tomorrow",
        text: `Hi ${user.name},

This is a reminder that your appointment with ${appointment.doctorName} is tomorrow.

Specialist: ${appointment.specialist || "Doctor"}
Date: ${formatAppointmentDate(appointment.appointmentDate)}
Patient: ${appointment.patientName || user.name}

Thank you,
MedAssist AI`,
      });

      appointment.reminderEmailSentAt = new Date();
      appointment.reminderEmailLastError = undefined;
      await appointment.save();
    } catch (error) {
      appointment.reminderEmailLastError =
        error instanceof Error ? error.message : "Failed to send reminder";
      await appointment.save();
      console.error("Failed to send appointment reminder:", error);
    }
  }
};

export const startAppointmentReminderScheduler = () => {
  let running = false;

  const run = async () => {
    if (running) return;
    running = true;

    try {
      await sendTomorrowAppointmentReminders();
    } catch (error) {
      console.error("Appointment reminder scheduler failed:", error);
    } finally {
      running = false;
    }
  };

  setTimeout(run, 5000);
  return setInterval(run, ONE_HOUR);
};
