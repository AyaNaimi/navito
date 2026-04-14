import { Navigate, useParams } from "react-router-dom";
import PageTransition from "./components/PageTransition";
import DriverDashboard from "./DriverDashboard";
import GuideDashboard from "./GuideDashboard";
import SuperAdminDashboard from "./SuperAdminDashboard";

export default function RoleDashboardRouter() {
  const { role } = useParams();

  if (role === "driver") {
    return (
      <PageTransition transitionKey={role}>
        <DriverDashboard />
      </PageTransition>
    );
  }

  if (role === "guide") {
    return (
      <PageTransition transitionKey={role}>
        <GuideDashboard />
      </PageTransition>
    );
  }

  if (role === "superadmin") {
    return (
      <PageTransition transitionKey={role}>
        <SuperAdminDashboard />
      </PageTransition>
    );
  }

  return <Navigate to="/splash" replace />;
}
