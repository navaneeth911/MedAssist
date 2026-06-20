import HeroDashboard from "./HeroDashboard";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
export default function Hero() {
  const navigate = useNavigate();
  return (
    <section
      id="home"
      style={{
        minHeight: "90vh",
        position: "relative",
        overflow: "hidden",
        background:
          "linear-gradient(135deg, #eff6ff 0%, #ffffff 50%, #ecfeff 100%)",
      }}
    >
      {/* Blur Effects */}
      <div
        style={{
          position: "absolute",
          top: "-100px",
          left: "-100px",
          width: "400px",
          height: "400px",
          background: "#2563eb20",
          borderRadius: "50%",
          filter: "blur(120px)",
        }}
      />
<div
  style={{
    display: "flex",
    gap: "20px",
    marginTop: "40px",
  }}
>
  

  
</div>
      <div
        style={{
          position: "absolute",
          bottom: "-100px",
          right: "-100px",
          width: "400px",
          height: "400px",
          background: "#06b6d420",
          borderRadius: "50%",
          filter: "blur(120px)",
        }}
      />

      {/* Main Content */}
      <div
        style={{
          maxWidth: "1300px",
          margin: "0 auto",
          padding: "100px 40px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: "80px",
          position: "relative",
          zIndex: 2,
        }}
      >
        {/* Left Side */}
       <motion.div
  style={{ flex: 1 }}
  initial={{ opacity: 0, x: -50 }}
  animate={{ opacity: 1, x: 0 }}
  transition={{ duration: 0.8 }}
>
          <div
            style={{
              display: "inline-block",
              padding: "10px 18px",
              background: "rgba(37,99,235,0.1)",
              borderRadius: "999px",
              color: "#2563eb",
              fontWeight: "600",
              marginBottom: "25px",
            }}
          >
            ✨ AI-Powered Healthcare Platform
          </div>

          <h1
            style={{
              fontSize: "3.5rem",
              lineHeight: "1.1",
              marginBottom: "25px",
              color: "#0f172a",
              fontWeight: "600",
            }}
          >
            Your Personal
            <br />
            AI Health Assistant
          </h1>

          <p
           style={{
    fontSize: "1.15rem",
    lineHeight: "1.8",
    color: "#64748b",
    maxWidth: "600px",
    marginTop: "20px",
            }}
          >
            Analyze symptoms, discover specialists,
            understand urgency levels, and connect
            with healthcare professionals nearby.
          </p>

          <div
            style={{
              display: "flex",
              gap: "20px",
              marginTop: "40px",
            }}
          >
           <button
  onClick={() => navigate("/analyze")}
  style={{
    background: "#2563eb",
    color: "white",
    border: "none",
    padding: "16px 30px",
    borderRadius: "14px",
    fontWeight: "bold",
    cursor: "pointer",
  }}

  
>
  Start Analysis
</button>

            <button
              style={{
                background: "rgba(255,255,255,0.6)",
                backdropFilter: "blur(12px)",
                border: "1px solid rgba(255,255,255,0.4)",
                padding: "16px 30px",
                borderRadius: "14px",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              Watch Demo
            </button>
          </div>
        </motion.div>

        {/* Right Side */}
        <div style={{ flex: 1 }}>
          <HeroDashboard />
        </div>
      </div>
    </section>
    
  );
}
