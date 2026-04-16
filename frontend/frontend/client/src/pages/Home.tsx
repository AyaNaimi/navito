import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { MapPin, Compass, Truck, UtensilsCrossed, Users, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface City {
  id: string;
  name: string;
  nameAr: string;
  description: string;
  lat: number;
  lng: number;
  region: string;
  population: string;
}

export default function Home() {
  const [, navigate] = useLocation();
  const [cities, setCities] = useState<City[]>([]);
  const [selectedCity, setSelectedCity] = useState<string>("marrakech");
  const [places, setPlaces] = useState<any[]>([]);

  useEffect(() => {
    fetch("/data.json")
      .then((res) => res.json())
      .then((data) => {
        setCities(data.cities);
        setPlaces(data.places);
      })
      .catch((err) => console.error("Failed to load data:", err));
  }, []);

  const currentCity = cities.find((c) => c.id === selectedCity);
  const trendingPlaces = places.filter((p) => p.cityId === selectedCity).slice(0, 4);

  const quickLinks = [
    { label: "Explore", icon: Compass, path: "/explore" },
    { label: "Transport", icon: Truck, path: "/transport" },
    { label: "Food", icon: UtensilsCrossed, path: "/food" },
    { label: "Sorties", icon: Users, path: "/sorties" },
    { label: "Guides", icon: Heart, path: "/find-guide" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border sticky top-0 z-40">
        <div className="container py-4">
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="w-6 h-6 text-teal" />
            <h1 className="text-3xl font-bold text-foreground">Navito</h1>
          </div>
          <p className="text-sm text-muted mb-4">Discover Morocco's best experiences</p>

          {/* City selector */}
          <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4">
            {cities.map((city) => (
              <button
                key={city.id}
                onClick={() => setSelectedCity(city.id)}
                className={`px-4 py-2 rounded-2xl text-sm font-semibold whitespace-nowrap transition-all ${
                  selectedCity === city.id
                    ? "bg-teal text-white"
                    : "bg-secondary text-foreground hover:bg-gray-200"
                }`}
              >
                {city.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Hero Section */}
      {currentCity && (
        <div className="container py-6">
          <Card className="bg-gradient-to-br from-teal to-teal-dark text-white border-0 p-6">
            <h2 className="text-3xl font-bold mb-2">{currentCity.name}</h2>
            <p className="text-white/90 mb-4 text-sm">{currentCity.description}</p>
            <div className="flex gap-6 text-sm">
              <div>
                <p className="text-white/70 text-xs">Region</p>
                <p className="font-semibold">{currentCity?.region}</p>
              </div>
              <div>
                <p className="text-white/70 text-xs">Population</p>
                <p className="font-semibold">{currentCity?.population}</p>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Trending Destinations */}
      <div className="container py-6">
        <h3 className="text-lg font-bold mb-3 text-foreground">Trending in {currentCity?.name}</h3>
        <div className="grid grid-cols-2 gap-3 mb-6">
          {trendingPlaces.slice(0, 2).map((place, idx) => (
            <div
              key={place.id}
              className="trend-card cursor-pointer"
              style={{ backgroundImage: `url('${place.image}')` }}
              onClick={() => navigate("/explore")}
              onError={(e) => {
                (e.currentTarget as HTMLDivElement).style.backgroundImage =
                  "url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400')";
              }}
            >
              <div className="trend-rank">#{idx + 1}</div>
              <div className="trend-label">{place.name}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Access */}
      <div className="container py-4">
        <h3 className="text-lg font-bold mb-3 text-foreground">Quick Access</h3>
        <div className="grid grid-cols-2 gap-3">
          {quickLinks.map((link) => {
            const Icon = link.icon;
            return (
              <button
                key={link.path}
                onClick={() => navigate(link.path)}
                className="card p-4 text-center hover:shadow-lg transition-all"
              >
                <Icon className="w-8 h-8 mx-auto mb-2 text-teal" />
                <p className="font-semibold text-sm text-foreground">{link.label}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Emergency & Tips Section */}
      <div className="container py-6">
        <div className="grid grid-cols-2 gap-3 mb-4">
          <Card className="p-4 bg-red-50 border-red-100">
            <h4 className="font-bold text-red-900 text-sm mb-2">Emergency</h4>
            <div className="space-y-1 text-xs">
              <p>
                <span className="font-semibold">Police:</span> 19
              </p>
              <p>
                <span className="font-semibold">Ambulance:</span> 15
              </p>
            </div>
          </Card>
          <Card className="p-4 bg-blue-50 border-blue-100">
            <h4 className="font-bold text-blue-900 text-sm mb-2">Tips</h4>
            <p className="text-xs text-blue-800">Use meters, bargain respectfully, dress modestly</p>
          </Card>
        </div>
      </div>

      {/* Explore All */}
      <div className="container py-6 pb-24">
        <Button
          onClick={() => navigate("/explore")}
          className="w-full bg-teal hover:bg-teal-dark text-white py-3 rounded-2xl font-semibold text-base"
        >
          Explore All Places
        </Button>
      </div>
    </div>
  );
}
