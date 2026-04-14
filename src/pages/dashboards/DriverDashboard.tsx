import { useState } from "react";
import DriverAdminShell, { type DriverAdminNavId } from "./driver/DriverAdminShell";
import DriverOverview from "./driver/DriverOverview";
import DriverMessages from "./driver/DriverMessages";
import DriverProfile from "./driver/DriverProfile";
import DriverReviews from "./driver/DriverReviews";
import DriverPendingApproval from "../../app/pages/DriverPendingApproval";
import { Navigate } from "react-router-dom";


import { useAppContext } from "../../app/context/AppContext";

export default function DriverDashboard() {
  const [activeNav, setActiveNav] = useState<DriverAdminNavId>("dashboard");
  const { driverVerificationStatus } = useAppContext();

  if (driverVerificationStatus !== 'verified') {
     return <DriverPendingApproval />;
  }


  return (
    <DriverAdminShell activeNav={activeNav} onNavigate={setActiveNav}>
      <div className="w-full h-full">
        {activeNav === "dashboard" && <DriverOverview />}
        {activeNav === "messages" && <DriverMessages />}
        {activeNav === "profile" && <DriverProfile />}
        {activeNav === "reviews" && <DriverReviews />}
      </div>
    </DriverAdminShell>
  );
}
