import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Activity,
  ShieldAlert,
  Stethoscope,
} from "lucide-react";
import { Send } from "lucide-react";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";

export default function Analyze() {
  const navigate = useNavigate();
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [specialist, setSpecialist] = useState("");
  const [input, setInput] = useState("");
  const [readyForAnalysis, setReadyForAnalysis] =
  useState(false);
  const [deepInterview, setDeepInterview] =
  useState(false);
 const location = useLocation();

const [messages, setMessages] = useState(
  location.state?.messages || [
    {
      role: "assistant",
      content:
        "Hello 👋 What symptoms are you experiencing today?",
    },
  ]
);
 const sendMessage = async () => {
  if (!input.trim()) return;

  const updatedMessages = [
  ...messages,
  {
    role: "user",
    content: input,
  },
];

setMessages(updatedMessages);

const user = JSON.parse(
  localStorage.getItem("user") || "{}"
);

const token = localStorage.getItem("token");

const response = await fetch(
  "http://localhost:5000/api/chat",
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      messages: updatedMessages,
    }),
  }
);
  const data = await response.json();
  console.log(data);
if (
  data.reply.includes("ANALYZE_READY") &&
  !readyForAnalysis
) {
  setReadyForAnalysis(true);

  setMessages([
    ...updatedMessages,
    {
      role: "assistant",
      content:
        "I have enough information to prepare your assessment.",
    },
  ]);

  
  return;
}


  setMessages([
    ...updatedMessages,
    {
      role: "assistant",
      content: data.reply,
    },
  ]);

  setInput("");
};
const ContinueInterview = async () => {
  setDeepInterview(true);

  const updatedMessages = [
    ...messages,
    {
      role: "user",
      content:
        "Please continue the interview and ask more detailed questions.",
    },
  ];

  const response = await fetch(
    "http://localhost:5000/api/chat",
    {
      method: "POST",
      headers: {
        "Content-Type":
          "application/json",
      },
      body: JSON.stringify({
        messages: updatedMessages,
      }),
    }
  );

  const data = await response.json();

  setMessages([
    ...updatedMessages,
    {
      role: "assistant",
      content: data.reply,
    },
  ]);

  setReadyForAnalysis(false);
};
     

  const analyzeSymptoms = async () => {
    console.log("Analyze button clicked");
  setLoading(true);

  try {
   const token = localStorage.getItem("token");

const response = await fetch(
  "http://localhost:5000/api/analysis",
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      messages,
    }),
  }
);
    console.log("Status:", response.status);
console.log("Status Text:", response.statusText);




const data = await response.json();

console.log("FULL RESPONSE:", data);
alert(JSON.stringify(data, null, 2));
setSpecialist(data.specialist);

const aiResult = `
Risk: ${data.risk}

Condition: ${data.condition}

Specialist: ${data.specialist}
`;

setResult(aiResult);

// Save assessment history
const assessment = {
  symptoms: messages
  .filter((m: any) => m.role === "user")
  .map((m: any) => m.content)
    .join(", "),
  result: aiResult,
  specialist: data.specialist,
  date: new Date().toLocaleString(),
};

const existing = JSON.parse(
  localStorage.getItem("assessments") || "[]"
);

existing.unshift(assessment);

localStorage.setItem(
  "assessments",
  JSON.stringify(existing)
);

setLoading(false);

   
   
    console.log(data);

   
  } catch (error) {
    console.error(error);
  }
};


 const riskColor =
  result.includes("High")
    ? "#ef4444"
    : result.includes("Medium")
    ? "#f59e0b"
    : "#22c55e";

    
  return (
    <div
      style={{
        maxWidth: "900px",
        margin: "0 auto",
        padding: "20px",
      }}
    >
     <div
  style={{
    textAlign: "center",
    marginBottom: "40px",
  }}
>
  <Activity
    size={70}
    color="#2563eb"
    style={{ marginBottom: "15px" }}
  />

  <h1
    style={{
      fontSize: "3.5rem",
      marginBottom: "10px",
    }}
  >
    AI Symptom Analysis
  </h1>

  <p
    style={{
      color: "#94a3b8",
      fontSize: "18px",
    }}
  >
    Get preliminary health guidance and
    specialist recommendations in seconds.
  </p>
</div>
      <p
        style={{
          textAlign: "center",
          color: "#64748b",
          marginBottom: "40px",
        }}
      >
        
      </p>
<div
  style={{
    marginBottom: "20px",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  }}
>
  {messages.map((msg: any, index: number) => (
    <div
      key={index}
      style={{
        alignSelf:
          msg.role === "assistant"
            ? "flex-start"
            : "flex-end",

        background:
          msg.role === "assistant"
            ? "#1e293b"
            : "#2563eb",

        padding: "12px 18px",
        borderRadius: "14px",
        color: "white",
        maxWidth: "70%",
      }}
    >
      {msg.content}
    </div>
  ))}
</div>
  

<div
  style={{
    display: "flex",
    alignItems: "center",
    gap: "10px",
    background: "#1e293b",
    border: "1px solid #334155",
    borderRadius: "14px",
    padding: "8px 12px",
    marginTop: "20px",
  }}
>
  <input
    value={input}
    onChange={(e) => setInput(e.target.value)}
    onKeyDown={(e) => {
      if (e.key === "Enter") {
        sendMessage();
      }
    }}
    placeholder="Describe your symptoms. Example: Fever for 3 days, headache, sore throat..."
    style={{
      flex: 1,
      background: "transparent",
      border: "none",
      color: "white",
      fontSize: "15px",
      outline: "none",
    }}
  />

  <button
    onClick={sendMessage}
    style={{
      background: "#2563eb",
      border: "none",
      borderRadius: "10px",
      width: "42px",
      height: "42px",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    <Send size={18} color="white" />
  </button>
</div>

{readyForAnalysis && (
  <div
    style={{
      display: "flex",
      gap: "12px",
      marginTop: "15px",
      justifyContent: "center",
    }}
  >
    <button
      onClick={analyzeSymptoms}
      style={{
        background: "#22c55e",
        color: "white",
        border: "none",
        padding: "12px 24px",
        borderRadius: "12px",
        cursor: "pointer",
      }}
    >
      Generate Assessment
    </button>

    <button
      onClick={ContinueInterview}
      style={{
        background: "#2563eb",
        color: "white",
        border: "none",
        padding: "12px 24px",
        borderRadius: "12px",
        cursor: "pointer",
      }}
    >
      Continue Interview
    </button>
  </div>
)}



{loading && (
  <div
    style={{
      textAlign: "center",
      marginTop: "25px",
      color: "#60a5fa",
      fontWeight: "bold",
    }}
  >
    🤖 AI is analyzing your symptoms...
  </div>
)}
{result && (
  <div
    style={{
      marginTop: "30px",
      background: "#1e293b",
      color: "white",
      padding: "25px",
      borderRadius: "16px",
      whiteSpace: "pre-line",
    }}
  >
    <h3>Analysis Result</h3>
    <div
  style={{
    display: "grid",
    gap: "20px",
    marginTop: "25px",
  }}
>
  

    <div
  style={{
    background: "#0f172a",
    padding: "20px",
    borderRadius: "16px",
  }}
>
  <ShieldAlert
    size={28}
    color={riskColor}
  />

  <h3>Risk Level</h3>

  <p
    style={{
      color: riskColor,
      fontWeight: "bold",
    }}
  >
    {result.split("Risk: ")[1]?.split("\n")[0]}
  </p>
</div>

<div
  style={{
    background: "#0f172a",
    padding: "20px",
    borderRadius: "16px",
  }}
>
  <Activity size={28} color="#60a5fa" />

  <h3>Condition</h3>

  <p>
    {result
      .split("Condition: ")[1]
      ?.split("Specialist")[0]}
  </p>
</div>

<div
  style={{
    background: "#0f172a",
    padding: "20px",
    borderRadius: "16px",
  }}
>
  <Stethoscope
    size={28}
    color="#60a5fa"
  />

  <h3>Recommended Specialist</h3>

  <p>{specialist}</p>
</div>

  <button
  onClick={() => {
  console.log("Doctor button clicked");

  navigate("/doctors", {
    state: {
      specialist,
      messages,
    },
  });
}}
style={{
    marginTop: "20px",
    background: "#2563eb",
    color: "white",
    border: "none",
    padding: "14px 30px",
    borderRadius: "12px",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "16px",
  }}
>
  View Recommended Specialists →
</button>

  </div>

  </div>

)}

</div>

);
}