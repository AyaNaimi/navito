import { useEffect, useState } from "react";
import DriverAdminShell, { type DriverAdminNavId } from "./driver/DriverAdminShell";
import DriverOverview from "./driver/DriverOverview";
import DriverMessages from "./driver/DriverMessages";
import DriverProfile from "./driver/DriverProfile";
import DriverReviews from "./driver/DriverReviews";
import DriverPendingApproval from "../../app/pages/DriverPendingApproval";
import { useAppContext } from "../../app/context/AppContext";
import { fetchDashboard, type DriverDashboardData } from "../../app/services/api";

export default function DriverDashboard() {
  const [activeNav, setActiveNav] = useState<DriverAdminNavId>("dashboard");
  const [dashboardData, setDashboardData] = useState<DriverDashboardData | null>(null);
  const { authToken, driverVerificationStatus } = useAppContext();

  useEffect(() => {
    if (!authToken) {
      return;
    }

    let cancelled = false;

    fetchDashboard(authToken)
      .then((response) => {
        if (!cancelled && response.data?.role === "driver") {
          setDashboardData(response.data);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setDashboardData(null);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [authToken]);

  if (driverVerificationStatus !== 'verified') {
     return <DriverPendingApproval />;
  }


  return (
    <DriverAdminShell activeNav={activeNav} onNavigate={setActiveNav}>
      <div className="w-full h-full">
        {activeNav === "dashboard" && <DriverOverview dashboardData={dashboardData} />}
        {activeNav === "messages" && <DriverMessages />}
        {activeNav === "profile" && <DriverProfile />}
        {activeNav === "reviews" && <DriverReviews />}
      </div>
    </DriverAdminShell>
  );
}
