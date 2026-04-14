import {
  CalendarDays,
  CarFront,
  LayoutDashboard,
  MapPinned,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { cn } from "../../../app/components/ui/utils";
import type { UserRole } from "../types";

const links: Array<{ role: UserRole; label: string; icon: typeof LayoutDashboard }> =
  [
    { role: "superadmin", label: "SuperAdmin", icon: ShieldCheck },
    { role: "driver", label: "Driver", icon: CarFront },
    { role: "guide", label: "Guide", icon: UserRound },
  ];

export default function DashboardSidebar() {
  return (
    <aside className="w-full shrink-0 border-b border-white/40 bg-white/70 p-4 backdrop-blur-md md:w-64 md:border-r md:border-b-0 dark:border-slate-800 dark:bg-slate-950/90">
      <div className="mb-6 flex items-center gap-2">
        <MapPinned className="size-5 text-emerald-600" />
        <span className="font-semibold tracking-tight">Travel Ops</span>
      </div>
      <nav className="grid gap-2">
        {links.map(({ role, label, icon: Icon }) => (
          <NavLink
            key={role}
            to={`/dashboard/${role}`}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors",
                isActive
                  ? "bg-emerald-600 text-white"
                  : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-900",
              )
            }
          >
            <Icon className="size-4" />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
      <div className="mt-8 rounded-md bg-slate-100 p-3 text-xs text-slate-600 dark:bg-slate-900 dark:text-slate-300">
        <div className="mb-1 flex items-center gap-1">
          <LayoutDashboard className="size-3.5" />
          Dashboard Modules
        </div>
        <div className="flex items-center gap-1">
          <CalendarDays className="size-3.5" />
          Role-aware panels
        </div>
      </div>
    </aside>
  );
}
