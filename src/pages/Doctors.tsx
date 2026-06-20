import { MapPin, Star, Stethoscope } from "lucide-react";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
  

export default function Doctors() {
  const location = useLocation();
  const navigate = useNavigate();
  
  const specialist =
  (location.state as { specialist?: string })?.specialist ||
  "General Physician";
  console.log("Specialist:", specialist);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [doctors, setDoctors] = useState<any[]>([]);
  useEffect(() => {
  fetch("http://localhost:5000/api/doctors")
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      setDoctors(data);
      fetch("http://localhost:5000/api/appointments")
  .then((res) => res.json())
  .then((data) => {
    setAppointments(data);
  });
    });
}, []);
  
console.log("AI Specialist:", specialist);

console.log(
  "Available Specialists:",
  [...new Set(doctors.map(d => d.specialist))]
);
const filteredDoctors = doctors.filter(
  (doctor) =>
    specialist
      .toLowerCase()
      .includes(
        doctor.specialist.toLowerCase()
      )
);
console.log("AI Specialist:", specialist);

console.log(
  "Doctor Specialties:",
  doctors.map((d) => d.specialist)
  
);

console.log("Filtered Doctors:", filteredDoctors);
  
   console.log("Doctors:", doctors);
  return (
    <div
    style={{
      maxWidth: "1000px",
      margin: "0 auto",
      padding: "80px 20px",
    }}
  >
    <button
      onClick={() => navigate(-1)}
      style={{
        marginBottom: "20px",
        padding: "10px 16px",
        borderRadius: "8px",
        border: "1px solid #cbd5e1",
        background: "white",
        cursor: "pointer",
      }}
    >
      ← Back
    </button>
      <h1
        style={{
          textAlign: "center",
          marginBottom: "20px",
        }}
      >
        Recommended Doctors
      </h1>

      <div className="mb-8 rounded-2xl border bg-blue-50 p-5">
  <h3 className="font-semibold text-blue-900">
    AI Recommendation
  </h3>

  <p className="mt-2 text-blue-700">
    Based on your assessment, consulting a{" "}
    <strong>{specialist}</strong> is recommended.
  </p>
</div>
      {filteredDoctors.map((doctor) => (
        
        <div
          key={doctor.name}
          style={{
            background: "rgba(255,255,255,0.7)",
            backdropFilter: "blur(16px)",
            border: "1px solid rgba(255,255,255,0.3)",
            padding: "25px",
            marginBottom: "20px",
            borderRadius: "16px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
          }}
          
        >
          <h2
  style={{
    color: "#0f172a",
    fontSize: "1.5rem",
    fontWeight: "700",
    marginBottom: "15px",
  }}

>
  <div
  style={{
    width: "70px",
    height: "70px",
    borderRadius: "50%",
    background: "#2563eb",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "24px",
    fontWeight: "bold",
    marginBottom: "20px",
  }}
>
{doctor.name.split(" ")[1]?.charAt(0) || "D"}
</div>
  {doctor.name}
</h2>

         <div
  style={{
    display: "flex",
    alignItems: "center",
    gap: "8px",
    marginTop: "10px",
  }}
>
  <Stethoscope size={18} />
  <span>{doctor.specialist}</span>
</div>

<div
  style={{
    display: "flex",
    alignItems: "center",
    gap: "8px",
    marginTop: "10px",
  }}
>
  <Star size={18} />
  <span>{doctor.rating}</span>
</div>

<div
  style={{
    display: "flex",
    alignItems: "center",
    gap: "8px",
    marginTop: "10px",
  }}
>
  <MapPin size={18} />
  <span>{doctor.distance}</span>
</div>

         <button
  onClick={() =>
    navigate("/doctor-details", {
      state: { doctor },
    })
  }
  style={{
    marginTop: "10px",
    background: "#2563eb",
    color: "white",
    border: "none",
    padding: "10px 20px",
    borderRadius: "10px",
    cursor: "pointer",
  }}
>
  View Details
</button>
        </div>
      ))}
    </div>
  );
}