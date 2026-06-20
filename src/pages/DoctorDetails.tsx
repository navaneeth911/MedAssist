import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import BackButton from "../components/BackButton";

const getTomorrowDateInput = () => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return tomorrow.toISOString().slice(0, 10);
};

export default function DoctorDetails() {
  const location = useLocation();
  console.log(location.state);
  const navigate = useNavigate();
  const [alreadyBooked, setAlreadyBooked] =
  useState(false);
  const [appointmentDate, setAppointmentDate] = useState(getTomorrowDateInput);
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  

  const doctor =
    (location.state as any)?.doctor;
    if (!doctor) {
  return (
    <div style={{ padding: "40px" }}>
      <h1>No doctor data found</h1>
    </div>
  );
}


    const bookAppointment = async () => {
  console.log("Booking appointment...");
  const appointmentDateTime = new Date(`${appointmentDate}T10:00:00`).toISOString();

 const token = localStorage.getItem("token");

const response = await fetch(
  "http://localhost:5000/api/appointments",
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      doctorName: doctor.name,
      specialist: doctor.specialist,
      patientName: user.name || "Patient",
      appointmentDate: appointmentDateTime,
    }),
  }
);


const data = await response.json();

console.log(data);

if (!response.ok) {
  alert(data.message);
  return;
}

setAlreadyBooked(true);

alert("Appointment booked successfully!");
};

  if (!doctor) {
    return (
      <div style={{ padding: "40px" }}>
          Doctor not found
        </div>
      );
      
    }
   useEffect(() => {
  const checkAppointment = async () => {
    const token = localStorage.getItem("token");

    const res = await fetch(
      "http://localhost:5000/api/appointments",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const appointments = await res.json();

    const exists = appointments.some(
      (appointment: any) => {
        const bookedDate = new Date(
          appointment.appointmentDate
        )
          .toISOString()
          .slice(0, 10);

        return (
          appointment.doctorName === doctor.name &&
          appointment.patientName ===
            (user.name || "Patient") &&
          bookedDate === appointmentDate
        );
      }
    );

    setAlreadyBooked(exists);
  };

  checkAppointment();
}, [appointmentDate, doctor.name, user.name]);

  return (
    <div
      style={{
        maxWidth: "800px",
        margin: "0 auto",
        padding: "40px",
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



      <div
        style={{
          background: "white",
          padding: "30px",
          borderRadius: "16px",
          boxShadow:
            "0 4px 12px rgba(0,0,0,0.08)",
        }}
      >
        <h1>{doctor.name}</h1>

        <p>
          <strong>Specialist:</strong>{" "}
          {doctor.specialist}
        </p>

        <p>
          <strong>Rating:</strong>{" "}
          {doctor.rating}
        </p>

        <p>
          <strong>Distance:</strong>{" "}
          {doctor.distance}
        </p>

        <p>
          <strong>Experience:</strong> 12 Years
        </p>

        <p>
          <strong>Hospital:</strong> City Care
          Hospital
        </p>

        <p>
          <strong>Consultation Fee:</strong>
          ₹500
        </p>

        <p>
          <strong>Available:</strong> Mon-Sat,
          10 AM - 5 PM
        </p>

        <label
          style={{
            display: "block",
            marginTop: "18px",
            marginBottom: "12px",
            fontWeight: 600,
          }}
        >
          Appointment Date
          <input
            type="date"
            value={appointmentDate}
            min={new Date().toISOString().slice(0, 10)}
            onChange={(event) => setAppointmentDate(event.target.value)}
            style={{
              display: "block",
              marginTop: "8px",
              padding: "10px 12px",
              borderRadius: "8px",
              border: "1px solid #cbd5e1",
              width: "220px",
            }}
          />
        </label>

 
 
  <button
  disabled={alreadyBooked}
  onClick={bookAppointment}
  style={{
    background: alreadyBooked
      ? "#64748b"
      : "#22c55e",
    color: "white",
    border: "none",
    padding: "12px 24px",
    borderRadius: "10px",
    cursor: alreadyBooked
      ? "not-allowed"
      : "pointer",
  }}
>
  {alreadyBooked
    ? "✓ Appointment Booked"
    : "Book Appointment"}
</button>

      </div>
    </div>
  );
}
