import { useEffect, useState } from "react";
import PageHeader from "../components/PageHeader";

export default function Appointments() {
  const [appointments, setAppointments] = useState<any[]>([]);

 const fetchAppointments = async () => {
  try {
    const user = JSON.parse(
      localStorage.getItem("user") || "{}"
    );

    const token = localStorage.getItem("token");

const res = await fetch(
  "http://localhost:5000/api/appointments",
  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }

    );

    const data = await res.json();

    setAppointments(data);
  } catch (error) {
    console.error(error);
  }
};

  const cancelAppointment = async (
    id: string
  ) => {
    try {
      const confirmed = window.confirm(
        "Are you sure you want to cancel this appointment?"
      );

      if (!confirmed) return;

      const response = await fetch(
        `http://localhost:5000/api/appointments/${id}/cancel`,
        {
          method: "PUT",
        }
      );

      const data = await response.json();

      alert(data.message);

      fetchAppointments();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  return (
    <div className="p-6">
      <PageHeader title="My Appointments" />

      {appointments.length === 0 ? (
        <div className="rounded-2xl border bg-white p-12 text-center">
          <h2 className="text-xl font-semibold">
            No Appointments Yet
          </h2>

          <p className="mt-2 text-gray-500">
            Book a doctor consultation to see it here.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {appointments.map(
            (appointment: any) => (
              <div
                key={appointment._id}
                className="rounded-2xl border bg-white p-6 shadow-sm"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-xl font-bold">
                      👨‍⚕️{" "}
                      {appointment.doctorName}
                    </h2>

                    <p className="mt-1 text-gray-600">
                      {
                        appointment.specialist
                      }
                    </p>
                  </div>

                  <span
                    className={`rounded-full px-3 py-1 text-sm font-medium ${
                      new Date(
                        appointment.appointmentDate
                      ) >= new Date()
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {new Date(
                      appointment.appointmentDate
                    ) >= new Date()
                      ? "Upcoming"
                      : "Completed"}
                  </span>
                </div>

                <div className="mt-5 grid gap-3 md:grid-cols-2">
                  <div>
                    <span className="font-semibold">
                      🏥 Specialist:
                    </span>{" "}
                    {appointment.specialist}
                  </div>

                  <div>
                    <span className="font-semibold">
                      📅 Appointment Date:
                    </span>{" "}
                    {new Date(
                      appointment.appointmentDate
                    ).toLocaleDateString()}
                  </div>

                  <div>
                    <span className="font-semibold">
                      👤 Patient:
                    </span>{" "}
                    {appointment.patientName}
                  </div>
                </div>

                <div className="mt-5 flex gap-3">
                  <button className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
                    View Doctor
                  </button>

                  {new Date(
                    appointment.appointmentDate
                  ) >= new Date() && (
                    <button
                      onClick={() =>
                        cancelAppointment(
                          appointment._id
                        )
                      }
                      className="rounded-lg border border-red-500 px-4 py-2 text-red-500 hover:bg-red-50"
                    >
                      Cancel Appointment
                    </button>
                  )}
                </div>
              </div>
            )
          )}
          
        </div>
        
      )}
    </div>
    
  );
}
