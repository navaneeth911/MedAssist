import type React from "react";
import { useNavigate } from "react-router-dom";
import { Bell } from "lucide-react";

export default function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const scrollToSection = (id: string) => (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    const section = document.getElementById(id);

    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
      window.history.replaceState(null, "", `#${id}`);
    }
  };

  const navLinkStyle = {
    color: "#0f172a",
    cursor: "pointer",
    fontWeight: 500,
    textDecoration: "none",
  };

  const buttonStyle = {
    border: "1px solid #cbd5e1",
    borderRadius: "10px",
    background: "white",
    cursor: "pointer",
    fontWeight: 600,
    padding: "8px 14px",
  };

  return (
    <nav
      style={{
        alignItems: "center",
        background: "white",
        borderBottom: "1px solid #e2e8f0",
        display: "flex",
        justifyContent: "space-between",
        padding: "20px 40px",
        position: "sticky",
        top: 0,
        zIndex: 50,
      }}
    >
      <h2
        style={{
          color: "#2563eb",
          cursor: "pointer",
          fontWeight: "bold",
        }}
        onClick={() => {
          navigate("/");
          window.setTimeout(() => document.getElementById("home")?.scrollIntoView({ behavior: "smooth" }), 0);
        }}
      >
        MedAssist AI
      </h2>

      <div
        style={{
          display: "flex",
          gap: "30px",
        }}
      >
        <a href="#home" onClick={scrollToSection("home")} style={navLinkStyle}>
          Home
        </a>
        <a href="#features" onClick={scrollToSection("features")} style={navLinkStyle}>
          Features
        </a>
        <a href="#how-it-works" onClick={scrollToSection("how-it-works")} style={navLinkStyle}>
          How It Works
        </a>
      </div>

      <div
        style={{
          alignItems: "center",
          display: "flex",
          gap: "12px",
        }}
      >
        {user?.name ? (
          <>
            <button
              type="button"
              onClick={() => navigate("/appointments")}
              style={{ ...buttonStyle, border: "none", padding: "8px" }}
              aria-label="Appointments"
            >
              <Bell className="h-5 w-5" />
            </button>
            <button type="button" onClick={() => navigate("/dashboard")} style={buttonStyle}>
              {user.name}
            </button>
            <button type="button" onClick={handleLogout} style={buttonStyle}>
              Logout
            </button>
          </>
        ) : (
          <>
            <button type="button" onClick={() => navigate("/login")} style={buttonStyle}>
              Login
            </button>
            <button
              type="button"
              onClick={() => navigate("/register")}
              style={{
                ...buttonStyle,
                background: "#2563eb",
                borderColor: "#2563eb",
                color: "white",
              }}
            >
              Register
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
