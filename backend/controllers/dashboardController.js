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

    res.json({
      totalAppointments,
      totalAssessments,
      recentAppointments,
      recentAssessments,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};