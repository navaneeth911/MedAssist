
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
import { useNavigate } from "react-router-dom";



export default function Dashboard() {
  
  const [stats, setStats] = useState<any>(null);
  const navigate = useNavigate();
  const user = JSON.parse(
  localStorage.getItem("user") || "{}"
  
);
const [location, setLocation] = useState({
  lat: null as number | null,
  lng: null as number | null,
});

const getLocation = () => {
  navigator.geolocation.getCurrentPosition(
    (position) => {
      setLocation({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      });

      console.log("Latitude:", position.coords.latitude);
      console.log("Longitude:", position.coords.longitude);
    },
    (error) => {
      console.error("Location Error:", error);
    }
  );
};

useEffect(() => {
  const token = localStorage.getItem("token");

 fetch("http://localhost:5000/api/dashboard", {
  headers: {
    Authorization: `Bearer ${token}`,
    

  },
  
})
  .then(async (res) => {
    console.log("Dashboard Status:", res.status);

    const text = await res.text();

    console.log("Dashboard Response:", text);

    return JSON.parse(text);
  })
    .then((data) => {
  console.log("Dashboard Data:", data);
  setStats(data);
})
    .catch((err) => console.error(err));
}, []);
 

if (!stats) {
  return (
    <main className="flex-1 p-8 bg-slate-50 min-h-screen">
      <h1 className="text-3xl font-bold">
        Loading Dashboard...
      </h1>
    </main>
  );
}
console.log("Dashboard Stats:", stats);
  return (
    

        <main className="flex-1 p-6">
          <div className="rounded-3xl bg-gradient-to-r from-blue-600 to-cyan-500 p-8 text-white shadow-lg">
  <h1 className="text-4xl font-bold">
    Welcome back, {user?.name}
  </h1>
<div className="mt-4">

  {location.lat && (
  <div className="mt-3 text-white">
    <p>Latitude: {location.lat}</p>
    <p>Longitude: {location.lng}</p>
  </div>
)}
  <div className="mt-4">

</div>
</div>
  <p className="mt-3 text-blue-100">
    Your AI-powered healthcare companion for symptom
    assessment, specialist recommendations and health tracking.
  </p>

 <div className="mt-6 flex gap-4">
  <button
    onClick={() => navigate("/analyze")}
    className="rounded-xl bg-white px-6 py-3 font-semibold text-blue-600 shadow-md transition hover:scale-105 hover:shadow-lg"
  >
    New Assessment
  </button>

  <button
    onClick={() => navigate("/history")}
    className="rounded-xl border border-white/40 bg-white/10 px-6 py-3 font-semibold text-white backdrop-blur-sm transition hover:bg-white/20"
  >
    View History
  </button>
</div>
</div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mt-6">
          

<div className="rounded-2xl border bg-white p-6 shadow-sm">
  <div className="flex items-center gap-3">
    <Activity className="h-6 w-6 text-cyan-500" />
    <h3 className="text-sm text-gray-500">
      Assessments
    </h3>
  </div>

  <div className="mt-4">
    <span className="text-4xl font-bold">
      {stats?.totalAssessments || 0}
    </span>
  </div>
</div>




<div className="rounded-2xl border bg-white p-6 shadow-sm">
  <div className="flex items-center gap-3">
    <CalendarDays className="h-6 w-6 text-orange-500" />
    <h3 className="text-sm text-gray-500">
      Appointments
    </h3>
  </div>

  <div className="mt-4">
    <span className="text-4xl font-bold">
      {stats?.totalAppointments || 0}
    </span>
  </div>
</div>
<div className="rounded-2xl border bg-white p-6 shadow-sm">
  <div className="flex items-center gap-3">
    <HeartPulse className="h-6 w-6 text-red-500" />
    <h3 className="text-sm text-gray-500">
      Latest Risk
    </h3>
  </div>

  <div className="mt-4">
    <span
      className={`px-4 py-2 rounded-full text-lg font-bold ${
        stats?.latestRisk === "Emergency"
          ? "bg-red-100 text-red-600"
          : stats?.latestRisk === "High"
          ? "bg-orange-100 text-orange-600"
          : stats?.latestRisk === "Medium"
          ? "bg-yellow-100 text-yellow-600"
          : "bg-green-100 text-green-600"
      }`}
    >
      {stats?.latestRisk || "No Assessment"}
    </span>
  </div>
</div>
<div className="rounded-2xl border bg-white p-6 shadow-sm">
  <div className="flex items-center gap-3">
    <Stethoscope className="h-6 w-6 text-blue-500" />
    <h3 className="text-sm text-gray-500">
      Specialists
    </h3>
  </div>

  <div className="mt-4">
    <span className="text-4xl font-bold">
      12
    </span>
  </div>
</div>

</div>
<div className="mt-6">
  <div className="mt-6 rounded-2xl border bg-white p-6 shadow-sm">
  <h2 className="text-xl font-bold mb-4">
    Assessment Risk Trend
  </h2>

  <HealthChart
    data={stats?.chartData || []}
  />
</div>
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6"></div>
<div className="col-span-1 md:col-span-2 xl:col-span-2 rounded-2xl border bg-white p-6 shadow-sm">
  <h2 className="mb-4 text-xl font-bold">
    Recent Appointment
  </h2>

  {stats?.recentAppointments?.length > 0 ? (
    <div>
      
        <div className="space-y-3">
  <div className="rounded-xl bg-slate-50 p-3">
    <p className="text-sm text-gray-500">Doctor</p>
    <p className="font-semibold">
      {stats.recentAppointments[0].doctorName}
    </p>
  </div>

  <div className="rounded-xl bg-slate-50 p-3">
    <p className="text-sm text-gray-500">Patient</p>
    <p className="font-semibold">
      {stats.recentAppointments[0].patientName}
    </p>
  </div>

  <div className="rounded-xl bg-slate-50 p-3">
    <p className="text-sm text-gray-500">Date</p>
    <p className="font-semibold">
     {new Date(
      stats.recentAppointments[0].appointmentDate
    ).toLocaleString()}
    </p>
  </div>
</div>
    </div>
  ) : (
    <p>No appointments yet</p>
  )}

  <div className="rounded-2xl border bg-white p-6 shadow-sm">
  <h2 className="text-xl font-bold mb-4">
    AI Health Insights
  </h2>

  <div className="space-y-3">
    <div className="rounded-xl bg-blue-50 p-3">
      Stay hydrated and maintain proper sleep.
    </div>

    <div className="rounded-xl bg-green-50 p-3">
      Recent assessments show stable health trends.
    </div>

    <div className="rounded-xl bg-orange-50 p-3">
      Schedule a specialist consultation if symptoms persist.
    </div>
  </div>
</div>
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