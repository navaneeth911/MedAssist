import {
  Brain,
  MapPin,
  Stethoscope,
  Shield,
} from "lucide-react";      
export default function HeroDashboard() {
  return (
    <div
      style={{
        background: "rgba(255,255,255,0.6)",
        backdropFilter: "blur(16px)",
        border: "1px solid rgba(255,255,255,0.3)",
        borderRadius: "24px",
        padding: "30px",
        width: "350px",
        boxShadow: "0 8px 32px rgba(31,38,135,0.15)",
      }}
    >
      <h3
  style={{
    display: "flex",
    alignItems: "center",
    gap: "10px",
  }}
>
  <Brain size={24} color="#2563eb" />
  AI Health Analysis
</h3>

      <div
  style={{
    display: "flex",
    alignItems: "center",
    gap: "10px",
  }}
>
  <Shield size={18} color="green" />
  <strong>Risk Level</strong>
</div>

      <div
  style={{
    display: "flex",
    alignItems: "center",
    gap: "10px",
  }}
>
  <Stethoscope size={18} color="#2563eb" />
  <strong>Recommended Specialist</strong>
</div>

      <div
  style={{
    display: "flex",
    alignItems: "center",
    gap: "10px",
  }}
>
  <MapPin size={18} color="red" />
  <strong>Nearby Doctors</strong>
</div>
    </div>
  );
}