import { useState, type FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Login.css";

interface User {
  id: number;
  name: string;
  email: string;
  createdAt: string;
}

interface AuthResponse {
  token: string;
  user: User;
}

interface FormErrors {
  email?: string;
  password?: string;
}

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function validate(): boolean {
    const next: FormErrors = {};
    if (!email) {
      next.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      next.email = "Please enter a valid email address.";
    }
    if (!password) {
      next.password = "Password is required.";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setServerError(null);
    if (!validate()) return;

    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    email,
    password,
  }),
});

      const data: AuthResponse | { error: string } = await res.json();

      if (!res.ok) {
        setServerError(
          (data as { error: string }).error ?? "Login failed. Please try again."
        );
        return;
      }

      const { token, user } = data as AuthResponse;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      navigate("/dashboard");
    } catch {
      setServerError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-page">
      {/* Form side */}
      <div className="login-form-side">
        <div className="login-form-wrapper">
          {/* Logo */}
          <div className="login-logo">
            <div className="login-logo-icon">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" />
                <rect x="9" y="3" width="6" height="4" rx="2" />
                <path d="M9 14l2 2 4-4" />
              </svg>
            </div>
            <span className="login-logo-text">MedAssist</span>
          </div>

          {/* Heading */}
          <h1 className="login-heading">Welcome back</h1>
          <p className="login-subheading">
            Please enter your details to access your dashboard.
          </p>

          {/* Server error */}
          {serverError && (
            <div className="login-server-error" data-testid="alert-error">
              {serverError}
            </div>
          )}

          {/* Form */}
          <form className="login-form" onSubmit={handleSubmit} noValidate>
            {/* Email */}
            <div className="login-field">
              <label className="login-label" htmlFor="email">
                Email
              </label>
              <div className="login-input-wrapper">
                <span className="login-input-icon">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect width="20" height="16" x="2" y="4" rx="2" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 01-2.06 0L2 7" />
                  </svg>
                </span>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="name@example.com"
                  value={email}
                  data-testid="input-email"
                  className={`login-input${errors.email ? " login-input--error" : ""}`}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
                  }}
                />
              </div>
              {errors.email && (
                <p className="login-field-error">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div className="login-field">
              <label className="login-label" htmlFor="password">
                Password
              </label>
              <div className="login-input-wrapper">
                <span className="login-input-icon">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0110 0v4" />
                  </svg>
                </span>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={password}
                  data-testid="input-password"
                  className={`login-input login-input--has-toggle${errors.password ? " login-input--error" : ""}`}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password)
                      setErrors((prev) => ({ ...prev, password: undefined }));
                  }}
                />
                <button
                  type="button"
                  tabIndex={-1}
                  className="login-toggle-password"
                  data-testid="button-toggle-password"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" />
                      <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="login-field-error">{errors.password}</p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              data-testid="button-submit"
              className="login-submit"
            >
              {loading && (
                <svg
                  className="login-spinner"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    opacity="0.25"
                  />
                  <path
                    d="M4 12a8 8 0 018-8"
                    stroke="currentColor"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />
                </svg>
              )}
              {loading ? "Signing in..." : "Sign in to your account"}
            </button>
          </form>

          {/* Register link */}
          <p className="login-footer">
            Don't have an account?{" "}
            <Link to="/register" data-testid="link-register" className="login-link">
              Register here
            </Link>
          </p>
        </div>
      </div>

      {/* Decorative panel */}
      <div className="login-panel" aria-hidden="true">
        <div className="login-panel-blob login-panel-blob--1" />
        <div className="login-panel-blob login-panel-blob--2" />

        <div className="login-panel-shapes">
          <div className="login-shape login-shape--square" />
          <div className="login-shape login-shape--circle" />
          <div className="login-shape login-shape--leaf" />
          <div className="login-shape login-shape--pill" />
        </div>

        <div className="login-panel-card">
          <h3 className="login-panel-card-title">Modern Healthcare</h3>
          <p className="login-panel-card-text">
            Experience the future of medical consultation. Our secure,
            AI-powered platform keeps you connected with your health journey.
          </p>
        </div>
      </div>
    </div>
  );
}