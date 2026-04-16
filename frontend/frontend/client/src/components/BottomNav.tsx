import { useLocation } from "wouter";
import { Compass, Truck, UtensilsCrossed, Users, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

interface BottomNavProps {
  selectedCity: string;
  setSelectedCity: (city: string) => void;
}

export default function BottomNav({ selectedCity, setSelectedCity }: BottomNavProps) {
  const [location, navigate] = useLocation();

  const navItems = [
    { label: "Home", path: "/", icon: MapPin },
    { label: "Explore", path: "/explore", icon: Compass },
    { label: "Transport", path: "/transport", icon: Truck },
    { label: "Food", path: "/food", icon: UtensilsCrossed },
    { label: "Sorties", path: "/sorties", icon: Users },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50">
      <div className="flex justify-around items-center h-20 max-w-screen-lg mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location === item.path;

          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={cn(
                "flex flex-col items-center justify-center w-16 h-16 transition-all duration-300 rounded-2xl",
                isActive
                  ? "text-white bg-teal scale-105"
                  : "text-muted hover:text-foreground"
              )}
              aria-label={item.label}
            >
              <Icon className="w-6 h-6" />
              <span className="text-xs mt-1 font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
