import { Outlet } from "react-router-dom";
import {DashboardNavbar} from "./Dashboard/Navbar";
import { Sidebar } from "./Dashboard/Sidebar";

export default function Layout() {
  return (
    <div className="min-h-screen bg-background">
      <DashboardNavbar />

      <div className="flex">
        <Sidebar />

        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}