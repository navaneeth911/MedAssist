import Assessment from "../models/Assessment.js";
import Appointment from "../models/Appointment.js";

export const getInsights = async (req, res) => {
  try {
    const userId = req.user.id;
    const assessments = await Assessment.find({userId});
    const appointments = await Appointment.find({userId});

    const lowRisk = assessments.filter(
      (a) => a.risk === "Low"
    ).length;

    const mediumRisk = assessments.filter(
      (a) => a.risk === "Medium"
    ).length;

    const highRisk = assessments.filter(
      (a) => a.risk === "High"
    ).length;

    const emergencyRisk = assessments.filter(
      (a) => a.risk === "Emergency"
    ).length;

    const specialistCounts = {};

    assessments.forEach((a) => {
      if (!a.specialist) return;

      specialistCounts[a.specialist] =
        (specialistCounts[a.specialist] || 0) + 1;
    });

    const topSpecialist =
      Object.keys(specialistCounts).length > 0
        ? Object.keys(specialistCounts).reduce((a, b) =>
            specialistCounts[a] >
            specialistCounts[b]
              ? a
              : b
          )
        : "No Data";

    res.json({
      totalAssessments:
        assessments.length,

      totalAppointments:
        appointments.length,

      riskBreakdown: {
        low: lowRisk,
        medium: mediumRisk,
        high: highRisk,
        emergency: emergencyRisk,
      },

      topSpecialist,

      recentAssessments:
        assessments.slice(-5).reverse(),
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error:
        "Failed to fetch insights",
    });
  }
};