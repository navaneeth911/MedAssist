import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; 

export default function History() {
     const navigate = useNavigate();
  const [assessments, setAssessments] = useState<any[]>([]);

 useEffect(() => {
  const token = localStorage.getItem("token");

  fetch(
    "http://localhost:5000/api/analysis/history",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  )
    .then((res) => res.json())
    .then((data) => {
      console.log("History Data:", data);

      if (Array.isArray(data)) {
        setAssessments(data);
      } else {
        console.error("Invalid response:", data);
        setAssessments([]);
      }
    })
    .catch((err) => {
      console.error(err);
      setAssessments([]);
    });
}, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">
        Assessment History
      </h1>

      {assessments.length === 0 ? (
        <p>No assessments found.</p>
      ) : (
        <div className="space-y-4">
          {assessments.map((item: any) => (
            <div
  key={item._id}
  className="rounded-2xl border bg-white p-6 shadow-sm"
>
  <div className="flex items-center justify-between">
    <h2 className="text-lg font-bold">
      Assessment Report
    </h2>

    <span
      className={`rounded-full px-3 py-1 text-sm font-medium ${
        item.risk === "High"
          ? "bg-red-100 text-red-700"
          : item.risk === "Medium"
          ? "bg-yellow-100 text-yellow-700"
          : "bg-green-100 text-green-700"
      }`}
    >
      {item.risk}
    </span>
  </div>

  <p className="mt-3 text-sm text-gray-500">
    📅 {new Date(item.createdAt).toLocaleString()}
  </p>

  <div className="mt-4">
    <h3 className="font-semibold">
      Symptoms
    </h3>

    <ul className="mt-2 list-disc pl-5">
      {item.messages
        ?.filter(
          (msg: any) => msg.role === "user"
        )
        .map((msg: any, index: number) => (
          <li key={index}>
            {msg.content}
          </li>
        ))}
    </ul>
  </div>

  <div className="mt-4">
    <p>
      <strong>Condition:</strong>{" "}
      {item.condition}
    </p>

    <p className="mt-2">
      <strong>Recommended Specialist:</strong>{" "}
      {item.specialist}
    </p>
  </div>

  <button
    onClick={() =>
      navigate("/analyze", {
        state: {
          messages: item.messages,
        },
      })
    }
    className="mt-5 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
  >
    Open Conversation
  </button>
</div>
          ))}
        </div>
      )}
    </div>
  );
}