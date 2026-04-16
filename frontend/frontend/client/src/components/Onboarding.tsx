import { useState, useEffect } from "react";
import { ChevronRight, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface OnboardingProps {
  onComplete: () => void;
}

export default function Onboarding({ onComplete }: OnboardingProps) {
  const [step, setStep] = useState(0);
  const [selectedRegion, setSelectedRegion] = useState<string>("all");

  const regions = [
    { id: "all", label: "All Destinations" },
    { id: "africa", label: "Africa" },
    { id: "europe", label: "Europe" },
    { id: "asia", label: "Asia" },
    { id: "americas", label: "Americas" },
  ];

  const destinations = [
    {
      name: "Chefchaouen",
      country: "Morocco",
      region: "africa",
      rating: "4.9 ★",
      reviews: "2.5k",
      img: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=400&q=80",
    },
    {
      name: "Marrakech",
      country: "Morocco",
      region: "africa",
      rating: "4.8 ★",
      reviews: "1.9k",
      img: "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?auto=format&fit=crop&w=400&q=80",
    },
    {
      name: "Rome",
      country: "Italy",
      region: "europe",
      rating: "4.7 ★",
      reviews: "3.1k",
      img: "https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&w=400&q=80",
    },
    {
      name: "Paris",
      country: "France",
      region: "europe",
      rating: "4.8 ★",
      reviews: "4.2k",
      img: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=400&q=80",
    },
  ];

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1);
    } else {
      onComplete();
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  return (
    <div className="fixed inset-0 bg-background z-50 flex items-center justify-center overflow-hidden">
      {/* Splash Screen */}
      {step === 0 && (
        <div className="w-full h-full bg-gradient-to-br from-primary to-primary/80 flex flex-col items-center justify-center gap-6 p-6">
          <div className="text-6xl font-bold text-white tracking-wider">Navito</div>
          <div className="w-32 h-1 bg-white/30 rounded-full overflow-hidden">
            <div className="h-full w-1/2 bg-white animate-pulse" />
          </div>
          <p className="text-white/80 text-sm">Your travel companion</p>
          <button
            onClick={handleNext}
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white opacity-50 hover:opacity-100 transition-opacity"
          >
            <ChevronRight className="w-8 h-8" />
          </button>
        </div>
      )}

      {/* Privacy Screen */}
      {step === 1 && (
        <div className="w-full h-full bg-white flex flex-col p-6 overflow-y-auto">
          <div className="flex-1 flex flex-col justify-center gap-6">
            <h1 className="text-3xl font-bold text-foreground">Privacy Notice</h1>
            <p className="text-muted leading-relaxed">
              By selecting "Accept All", you agree to the processing of information to improve experience,
              provide secure payments, and assist in travel planning.
            </p>
            <a href="#" className="text-primary font-semibold hover:underline">
              Privacy and Cookies Statement
            </a>
          </div>

          <div className="space-y-3 mt-auto">
            <Button
              onClick={handleNext}
              className="w-full bg-primary hover:opacity-90 text-white py-3 rounded-2xl font-semibold"
            >
              Accept All
            </Button>
            <Button
              onClick={handleNext}
              variant="outline"
              className="w-full py-3 rounded-2xl font-semibold"
            >
              Change Preferences
            </Button>
          </div>
        </div>
      )}

      {/* Experiences Screen */}
      {step === 2 && (
        <div className="w-full h-full bg-white flex flex-col p-6 overflow-y-auto">
          <div className="flex-1 flex flex-col justify-center gap-6">
            <h1 className="text-3xl font-bold text-foreground text-center">
              One app, 300,000+ experiences.
            </h1>

            <div className="grid grid-cols-3 gap-3">
              {[
                "https://images.unsplash.com/photo-1505761671935-60b3a7427bad?auto=format&fit=crop&w=200&q=80",
                "https://images.unsplash.com/photo-1528909514045-2fa4ac7a08ba?auto=format&fit=crop&w=200&q=80",
                "https://images.unsplash.com/photo-1505761671935-60b3a7427bad?auto=format&fit=crop&w=200&q=80",
              ].map((img, idx) => (
                <div
                  key={idx}
                  className="h-32 rounded-2xl overflow-hidden bg-gray-200"
                  style={{
                    backgroundImage: `url('${img}')`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                />
              ))}
            </div>

            <p className="text-muted text-sm text-center leading-relaxed">
              By proceeding, accept that to finalize bookings we may share data with trusted partners for
              payment, alerts, and support.
            </p>
          </div>

          <div className="space-y-3 mt-auto">
            <Button
              onClick={handleNext}
              className="w-full bg-primary hover:opacity-90 text-white py-3 rounded-2xl font-semibold"
            >
              Get Started
            </Button>
            <Button
              onClick={handleNext}
              variant="outline"
              className="w-full py-3 rounded-2xl font-semibold"
            >
              I have a booking
            </Button>
          </div>
        </div>
      )}

      {/* Notifications Screen */}
      {step === 3 && (
        <div className="w-full h-full bg-white flex flex-col p-6 overflow-y-auto">
          <div className="flex-1 flex flex-col items-center justify-center gap-6">
            <div className="w-48 h-48 bg-gradient-to-br from-blue-100 to-blue-50 rounded-3xl flex items-center justify-center shadow-lg">
              <div className="bg-white rounded-2xl p-4 shadow-lg max-w-40">
                <p className="font-bold text-foreground text-sm mb-2">Navito</p>
                <p className="text-muted text-xs">Your activity starts soon. Grab your tickets now.</p>
              </div>
            </div>

            <div className="text-center">
              <h1 className="text-3xl font-bold text-foreground mb-3">Never miss a thing</h1>
              <p className="text-muted">
                Receive reminders for upcoming trips and important updates related to your reservations.
              </p>
            </div>
          </div>

          <div className="space-y-3 mt-auto">
            <Button
              onClick={handleNext}
              className="w-full bg-primary hover:opacity-90 text-white py-3 rounded-2xl font-semibold gap-2"
            >
              <Bell className="w-4 h-4" />
              Turn on notifications
            </Button>
            <button
              onClick={handleNext}
              className="w-full text-muted font-semibold hover:text-foreground transition-colors"
            >
              Not now
            </button>
          </div>
        </div>
      )}

      {/* Destinations Screen */}
      {step === 4 && (
        <div className="w-full h-full bg-white flex flex-col p-6 overflow-y-auto">
          <h1 className="text-3xl font-bold text-foreground mb-4">Choose your destination</h1>

          {/* Search */}
          <div className="flex gap-2 bg-secondary rounded-2xl px-4 py-3 mb-4">
            <span>🔍</span>
            <input
              type="text"
              placeholder="Explore destinations"
              className="bg-transparent flex-1 outline-none text-foreground placeholder-muted"
            />
          </div>

          {/* Region Tags */}
          <div className="flex gap-2 overflow-x-auto mb-6 pb-2">
            {regions.map((region) => (
              <button
                key={region.id}
                onClick={() => setSelectedRegion(region.id)}
                className={`px-4 py-2 rounded-2xl font-semibold whitespace-nowrap transition-all ${
                  selectedRegion === region.id
                    ? "bg-primary text-white"
                    : "bg-secondary text-foreground hover:bg-gray-200"
                }`}
              >
                {region.label}
              </button>
            ))}
          </div>

          {/* Destinations Grid */}
          <div className="grid grid-cols-2 gap-3 mb-6 flex-1">
            {destinations.map((dest) => (
              <Card key={dest.name} className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow">
                <img
                  src={dest.img}
                  alt={dest.name}
                  className="w-full h-32 object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400";
                  }}
                />
                <div className="p-3">
                  <p className="font-bold text-foreground text-sm">{dest.name}</p>
                  <p className="text-muted text-xs">{dest.country}</p>
                </div>
              </Card>
            ))}
          </div>

          <Button
            onClick={handleNext}
            className="w-full bg-primary hover:opacity-90 text-white py-3 rounded-2xl font-semibold"
          >
            Explore Now
          </Button>
        </div>
      )}

      {/* Skip button (all screens except splash) */}
      {step > 0 && step < 4 && (
        <button
          onClick={handleSkip}
          className="absolute top-6 right-6 text-muted hover:text-foreground transition-colors"
        >
          Skip
        </button>
      )}
    </div>
  );
}
