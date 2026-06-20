import { useNavigate } from "react-router-dom";

export default function BackButton() {
  const navigate = useNavigate();

  return (
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
  );
}