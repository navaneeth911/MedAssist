import Appointment from "../models/Appointment.js";
import Assessment from "../models/Assessment.js";

export const getDashboardStats = async (
 
  req,
  res
) => {
   console.log("DASHBOARD USER:", req.user);
  try {
    
    const userId = req.user.id;

    const totalAppointments =
      await Appointment.countDocuments({
        userId,
      });

    const totalAssessments =
      await Assessment.countDocuments({
        userId,
      });

    const recentAppointments =
      await Appointment.find({ userId })
        .sort({ createdAt: -1 })
        .limit(5);

    const recentAssessments =
      await Assessment.find({ userId })
        .sort({ createdAt: -1 })
        .limit(5);

    const latestAssessment =
  recentAssessments.length > 0
    ? recentAssessments[0]
    : null;

    const riskMap = {
  Low: 1,
  Medium: 2,
  High: 3,
  Emergency: 4,
};

const chartData = recentAssessments
  .reverse()
  .map((assessment, index) => ({
    assessment: `A${index + 1}`,
    risk: riskMap[assessment.risk] || 0,
  }));
console.log(chartData);
    res.json({
      totalAppointments,
      totalAssessments,
      recentAppointments,
      recentAssessments,
      latestRisk: latestAssessment?.risk || "None",
       chartData,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};