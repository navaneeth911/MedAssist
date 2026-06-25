import { LayoutDashboard, Stethoscope,  ClipboardList, Sparkles, Settings, LogOut } from "lucide-react";
import { NavLink } from "react-router-dom";
import { PanelLeft } from "lucide-react";
import { useState } from "react";
import { Menu } from "lucide-react";
import { CalendarDays } from "lucide-react";
import { Home } from "lucide-react";
import { MapPin } from "lucide-react";
const items = [
  {
  label: "Home",
  icon: Home,
  path: "/",
},
  { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { label: "Symptom Analysis", path: "/analyze", icon: Stethoscope },
  { label: "Assessment History", path: "/history", icon: ClipboardList },
  {
  label: "Appointments",
  path: "/appointments",
  icon: CalendarDays,
},
{
  label: "Nearby Hospitals",
  path: "/nearby-hospitals",
  icon: MapPin,
},
  { label: "Health Insights", path: "/insights", icon: Sparkles },
  { label: "Settings", path: "/settings", icon: Settings },
 
  
  
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <aside
  className={`sticky top-16 hidden h-[calc(100vh-4rem)] shrink-0 border-r border-border/70 bg-card/60 md:block transition-all duration-300 ${
    collapsed ? "w-20" : "w-64"
  }`}
>
  <div className="mb-4 flex justify-end">
  <button
    onClick={() => setCollapsed(!collapsed)}
    className="rounded-lg p-2 hover:bg-muted"
  >
    <PanelLeft size={18} />
  </button>
</div>
      <div className="flex h-full flex-col p-4">
        <nav className="flex-1 space-y-1">
          {items.map(({ label, icon: Icon, path }) => (
  <NavLink
    key={label}
    to={path}
 className={({ isActive }) =>
  `group flex w-full items-center rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
    collapsed ? "justify-center" : "gap-3"
  } ${
    isActive
      ? "bg-primary/10 text-primary shadow-sm"
      : "text-muted-foreground hover:bg-muted hover:text-foreground"
  }`
}
  >
    {({ isActive }) => (
      <>
        <Icon
          className={`h-[18px] w-[18px] ${
            isActive ? "text-primary" : ""
          }`}
        />
        {!collapsed && <span>{label}</span>}
        {isActive && !collapsed && (
  <span className="ml-auto h-1.5 w-1.5 rounded-full bg-primary" />
  
)}
        
      </>
    )}
  </NavLink>
))}
        </nav>

        <div className="border-t border-border/70 pt-4">
          <button
  onClick={() => {
    localStorage.removeItem("user");
    window.location.href = "/";
  }}
  className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
>
  <LogOut size={18} />
  {!collapsed && <span>Log Out</span>}
</button>
         
        </div>
      </div>
    </aside>
  );
}
