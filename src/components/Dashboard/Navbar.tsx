import { Bell, Activity, ChevronDown, LogOut, User, Settings } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";

export function DashboardNavbar() {
  const navigate = useNavigate(); 
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/70 bg-card/80 backdrop-blur-xl">
      <div className="flex h-16 items-center gap-6 px-6">
        <div
  className="flex items-center gap-2.5 cursor-pointer"
  onClick={() => navigate("/")}
>
          <div className="grid h-9 w-9 place-items-center rounded-xl gradient-brand shadow-elevated">
            <Activity className="h-5 w-5 text-white" strokeWidth={2.5} />
          </div>
          <div className="leading-tight">
            <div className="text-[15px] font-semibold tracking-tight">MedAssist AI</div>
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Health Intelligence</div>
          </div>
        </div>

        

        <div className="ml-auto flex items-center gap-2">
          <Button variant="ghost" size="icon" className="relative rounded-full">
            <Bell className="h-5 w-5" />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-destructive ring-2 ring-card" />
          </Button>

         <DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button
      variant="ghost"
      className="relative h-10 px-3"
    >
      {user?.name}
    </Button>
  </DropdownMenuTrigger>

  <DropdownMenuContent
    align="end"
    sideOffset={8}
    className="w-56 z-50"
  >
    <div className="px-2 py-2">
      <p className="font-medium">
        {user?.name}
      </p>
      <p className="text-xs text-muted-foreground">
        {user?.email}
      </p>
    </div>

    <DropdownMenuSeparator />

    <DropdownMenuItem
      onClick={() => navigate("/profile")}
    >
      <User className="mr-2 h-4 w-4" />
      Profile
    </DropdownMenuItem>

    <DropdownMenuSeparator />

    <DropdownMenuItem
      className="text-destructive focus:text-destructive"
      onClick={() => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/");
      }}
    >
      <LogOut className="mr-2 h-4 w-4" />
      Log out
    </DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
        </div>
      </div>
    </header>
  );
}
