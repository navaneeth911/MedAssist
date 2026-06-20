
import { StatCard } from "../components/Dashboard/StatCard";
import { HealthChart } from "../components/Dashboard/HealthChart";
import { AssessmentTable } from "../components/Dashboard/AssessmentTable";
import {
  Users,
  Activity,
  HeartPulse,
  Stethoscope,
  CalendarDays
} from "lucide-react";
import { useEffect, useState } from "react";
export default function Dashboard() {
  
  const [stats, setStats] = useState<any>(null);

useEffect(() => {
  const token = localStorage.getItem("token");

  fetch("http://localhost:5000/api/dashboard", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((res) => res.json())
    .then((data) => {
      console.log("Dashboard Data:", data);
      setStats(data);
    })
    .catch((err) => console.error(err));
}, []);
 

if (!stats) {
  return (
    <main className="flex-1 p-6">
      <h1 className="text-3xl font-bold">
        Loading Dashboard...
      </h1>
    </main>
  );
}
  return (
    

        <main className="flex-1 p-6">
          <h1 className="text-3xl font-bold">
            Welcome to MedAssist AI
          </h1>

          <p className="mt-2 text-muted-foreground">
            AI-powered healthcare dashboard
          </p>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mt-6">
          

<StatCard
  label="Assessments"
  value={stats?.totalAssessments || 0}
  trend={8}
  icon={Activity}
  tint="secondary"
  data={[{ v: 8 }, { v: 12 }, { v: 10 }, { v: 15 }, { v: 18 }]}
/>




<StatCard
  label="Appointments"
  value={stats?.totalAppointments || 0}
  trend={4}
  icon={CalendarDays}
  tint="warning"
  data={[
    { v: 3 },
    { v: 5 },
    { v: 7 },
    { v: 8 },
    { v: 10 },
  ]}
/>
<div className="col-span-1 md:col-span-2 xl:col-span-2 rounded-2xl border bg-white p-6 shadow-sm">
  <h2 className="mb-4 text-xl font-bold">
    Recent Appointment
  </h2>

  {stats?.recentAppointments?.length > 0 ? (
    <div>
      <p>
        <strong>Doctor:</strong>{" "}
        {stats.recentAppointments[0].doctorName}
      </p>

      <p>
        <strong>Patient:</strong>{" "}
        {stats.recentAppointments[0].patientName}
      </p>

      <p>
        <strong>Date:</strong>{" "}
        {stats.recentAppointments[0].appointmentDate}
      </p>
    </div>
  ) : (
    <p>No appointments yet</p>
  )}
</div>
          </div>

          {/* Chart */}
          

          {/* Table */}
            {/* Table */}
<div className="mt-6">
  <AssessmentTable
    assessments={stats?.recentAssessments || []}
  />
</div>
     
        </main>
  );
}