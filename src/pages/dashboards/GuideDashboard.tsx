import { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAppContext } from "../../app/context/AppContext";
import GuideAdminShell, { type GuideAdminNavId } from "./guide/GuideAdminShell";
import GuideOverview from "./guide/GuideOverview";
import GuideTours from "./guide/GuideTours";
import GuideMessages from "./guide/GuideMessages";
import GuideProfile from "./guide/GuideProfile";

export default function GuideDashboard() {
  const [activeNav, setActiveNav] = useState<GuideAdminNavId>("dashboard");
  const { authMode, guideVerificationStatus } = useAppContext();

  if (authMode !== "login") {
    return <Navigate to="/guide/login" replace />;
  }

  if (guideVerificationStatus === 'pending') {
    return <Navigate to="/guide/pending" replace />;
  }

  return (
    <GuideAdminShell activeNav={activeNav} onNavigate={setActiveNav}>
      <div className="w-full h-full">
        {activeNav === "dashboard" && <GuideOverview onNavigate={setActiveNav} />}
        {activeNav === "tours" && <GuideTours onNavigate={setActiveNav} />}
        {activeNav === "messages" && <GuideMessages onNavigate={setActiveNav} />}
        {activeNav === "profile" && <GuideProfile onNavigate={setActiveNav} />}
      </div>
    </GuideAdminShell>
  );
}
