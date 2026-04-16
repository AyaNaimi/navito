import { Navigate, useParams } from "react-router-dom";
import RequireAuth from "../../app/components/RequireAuth";
import { type UserRole } from "../../app/context/AppContext";
import PageTransition from "./components/PageTransition";
import DriverDashboard from "./DriverDashboard";
import GuideDashboard from "./GuideDashboard";
import SuperAdminDashboard from "./SuperAdminDashboard";

export default function RoleDashboardRouter() {
  const { role } = useParams();
  const roleMap: Record<string, UserRole> = {
    driver: "driver",
    guide: "guide",
    superadmin: "super_admin",
  };
  const expectedRole = role ? roleMap[role] : undefined;

  if (!expectedRole) {
    return <Navigate to="/dashboard" replace />;
  }

  let dashboard = <Navigate to="/dashboard" replace />;

  if (role === "driver") {
    dashboard = (
      <PageTransition transitionKey={role}>
        <DriverDashboard />
      </PageTransition>
    );
  }

  if (role === "guide") {
    dashboard = (
      <PageTransition transitionKey={role}>
        <GuideDashboard />
      </PageTransition>
    );
  }

  if (role === "superadmin") {
    dashboard = (
      <PageTransition transitionKey={role}>
        <SuperAdminDashboard />
      </PageTransition>
    );
  }

  return <RequireAuth allowedRoles={[expectedRole]}>{dashboard}</RequireAuth>;
}
