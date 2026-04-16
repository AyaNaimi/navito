import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Explore from "./pages/Explore";
import Transport from "./pages/Transport";
import Food from "./pages/Food";
import Sorties from "./pages/Sorties";
import FindGuide from "./pages/FindGuide";
import BottomNav from "./components/BottomNav";
import Onboarding from "./components/Onboarding";
import { useState, useEffect } from "react";

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/explore"} component={Explore} />
      <Route path={"/transport"} component={Transport} />
      <Route path={"/food"} component={Food} />
      <Route path={"/sorties"} component={Sorties} />
      <Route path={"/find-guide"} component={FindGuide} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

/**
 * Design Philosophy: Premium Onboarding + Nomadic Minimalism
 * - Teal primary (#0e8b6d) with ink text (#0f172a)
 * - SF Pro Display typography for premium feel
 * - 28px rounded corners and modern shadows
 * - Onboarding flow guides new users through features
 */
function App() {
  const [selectedCity, setSelectedCity] = useState<string>("marrakech");
  const [showOnboarding, setShowOnboarding] = useState<boolean>(false);

  useEffect(() => {
    // Check if user has completed onboarding
    const hasCompletedOnboarding = localStorage.getItem("navito_onboarding_complete");
    if (!hasCompletedOnboarding) {
      setShowOnboarding(true);
    }

    // Attempt geolocation on app load
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log("User location:", position.coords);
          // In a real app, we'd map coordinates to city
        },
        (error) => {
          console.log("Geolocation not available:", error);
        }
      );
    }
  }, []);

  const handleOnboardingComplete = () => {
    localStorage.setItem("navito_onboarding_complete", "true");
    setShowOnboarding(false);
  };

  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          {showOnboarding ? (
            <Onboarding onComplete={handleOnboardingComplete} />
          ) : (
            <div className="min-h-screen bg-background text-foreground flex flex-col">
              {/* Main content area with bottom nav space */}
              <main className="flex-1 pb-20 overflow-y-auto">
                <Router />
              </main>
              {/* Bottom Navigation */}
              <BottomNav selectedCity={selectedCity} setSelectedCity={setSelectedCity} />
            </div>
          )}
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
