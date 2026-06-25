import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import analysisRoutes from "./routes/analysisRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import appointmentRoutes from "./routes/appointmentRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import doctorRoutes from "./routes/doctorRoutes.js";
import insightsRoutes from "./routes/InsightsRoutes.js";
import { startAppointmentReminderScheduler } from "./services/appointmentReminderService.js";
import hospitalRoutes from "./routes/hospitalRoutes.js";
dotenv.config();
console.log(process.env.MONGODB_URI);

connectDB();
const app = express();



app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
    ],
    credentials: true,
  })
);

app.use(express.json());
app.use("/api", hospitalRoutes);
app.use(
  "/api/appointments",
  appointmentRoutes
);

app.use("/api/auth", authRoutes);
app.use("/api/analysis", analysisRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/doctors", doctorRoutes);


app.get("/", (req, res) => {
  res.send("MedAssist Backend Running");
});
app.get("/test-mistral", async (req, res) => {
  try {
    const response =
      await mistral.chat.complete({
        model: "mistral-small-latest",
        messages: [
          {
            role: "user",
            content: "Say hello",
          },
        ],
      });

    res.send(
      response.choices[0].message.content
    );
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
});

// =========================
// Analyze Symptoms Endpoint
// =========================

app.use("/analyze", analysisRoutes);

// =========================
// Chat Endpoint (Testing)
// =========================

app.use("/chat", chatRoutes);
app.use("/api/insights", insightsRoutes);




  app.listen(5000, () => {
  console.log("Server running on port 5000");
  startAppointmentReminderScheduler();
});
