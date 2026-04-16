import { useState } from "react";
import MoroccoSuperAdminShell, {
  type SuperAdminNavId,
} from "./superadmin/MoroccoSuperAdminShell";
import SuperAdminOverview from "./superadmin/SuperAdminOverview";
import AdminCalendar from "./superadmin/AdminCalendar";
import AdminGuides from "./superadmin/AdminGuides";
import AdminTravelers from "./superadmin/AdminTravelers";
import AdminDrivers from "./superadmin/AdminDrivers";
import AdminActivities from "./superadmin/AdminActivities";
import AdminMessages from "./superadmin/AdminMessages";
import AdminSettings from "./superadmin/AdminSettings";

export default function SuperAdminDashboard() {
  const [activeNav, setActiveNav] = useState<SuperAdminNavId>("dashboard");

  return (
    <MoroccoSuperAdminShell activeNav={activeNav} onNavigate={setActiveNav}>
      <div className="w-full">
        {activeNav === "dashboard" && <SuperAdminOverview onNavigate={setActiveNav} />}
        {activeNav === "packages" && <AdminActivities onNavigate={setActiveNav} />}
        {activeNav === "calendar" && <AdminCalendar onNavigate={setActiveNav} />}
        {activeNav === "visitors" && <AdminTravelers onNavigate={setActiveNav} />}
        {activeNav === "guides" && <AdminGuides onNavigate={setActiveNav} />}
        {activeNav === "drivers" && <AdminDrivers onNavigate={setActiveNav} />}
        {activeNav === "messages" && <AdminMessages onNavigate={setActiveNav} />}
        {activeNav === "settings" && <AdminSettings onNavigate={setActiveNav} />}
      </div>
    </MoroccoSuperAdminShell>
  );
}
