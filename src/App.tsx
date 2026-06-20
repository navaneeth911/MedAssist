import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./pages/ProtectedRoute";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Analyze from "./pages/Analyze";
import Dashboard from "./pages/Dashboard";
import Doctors from "./pages/Doctors";
import Layout from "./components/Layout";
import History from "./pages/History";
import DoctorDetails from "./pages/DoctorDetails";
import Appointments from "./pages/Appointments";
import Profile from "./pages/profile";
import Settings from "./pages/Settings";
import HealthInsights from "./pages/HealthInsights";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/analyze" element={<Analyze />} />
          <Route path="/doctors" element={<Doctors />} />
          <Route path="/doctor-details" element={<DoctorDetails />} />
          <Route path="/appointments" element={<Appointments />} />
          <Route path="/history" element={<History />} />
          <Route path="/insights" element={<HealthInsights />} />
          <Route path="/settings" element={<Settings />} />
          <Route
  path="/profile"
  element={<Profile />}
/>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;