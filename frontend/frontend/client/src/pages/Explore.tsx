import { useEffect, useState } from "react";
import { MapPin, Filter, Map as MapIcon, List, Sparkles, Camera, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Place {
  id: string;
  cityId: string;
  name: string;
  category: string;
  lat: number;
  lng: number;
  description: string;
  admissionPrice: string;
  hours: string;
  tips: string;
  dressCode: string;
  duration: string;
  image: string;
}

export default function Explore() {
  const [places, setPlaces] = useState<Place[]>([]);
  const [selectedCity, setSelectedCity] = useState<string>("marrakech");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"list" | "map">("list");
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [showAIPanel, setShowAIPanel] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const categories = [
    { id: "all", label: "All", icon: "🌍" },
    { id: "monument", label: "Monuments", icon: "🏛️" },
    { id: "mosque", label: "Mosques", icon: "🕌" },
    { id: "museum", label: "Museums", icon: "🖼️" },
    { id: "nature", label: "Nature", icon: "🌲" },
    { id: "beach", label: "Beach", icon: "🏖️" },
    { id: "market", label: "Market", icon: "🏪" },
  ];

  useEffect(() => {
    fetch("/data.json")
      .then((res) => res.json())
      .then((data) => setPlaces(data.places))
      .catch((err) => console.error("Failed to load places:", err));
  }, []);

  const filteredPlaces = places.filter((place) => {
    const matchesCity = place.cityId === selectedCity;
    const matchesCategory = selectedCategory === "all" || place.category === selectedCategory;
    const matchesSearch = place.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCity && matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-card border-b border-border sticky top-0 z-40">
        <div className="container py-4">
          <h1 className="text-3xl font-bold mb-3 text-foreground">Explore</h1>

          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-3 w-4 h-4 text-muted" />
            <input
              type="text"
              placeholder="Search places..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input pl-10"
            />
          </div>

          {/* City selector */}
          <div className="flex gap-2 overflow-x-auto pb-3 -mx-4 px-4">
            {["marrakech", "fes", "casablanca", "tanger", "chefchaouen", "agadir"].map((city) => (
              <button
                key={city}
                onClick={() => setSelectedCity(city)}
                className={`px-4 py-2 rounded-2xl text-sm font-semibold whitespace-nowrap transition-all ${
                  selectedCity === city
                    ? "bg-teal text-white"
                    : "bg-secondary text-foreground"
                }`}
              >
                {city.charAt(0).toUpperCase() + city.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Category filters */}
      <div className="bg-card border-b border-border sticky top-16 z-30">
        <div className="container py-3 overflow-x-auto">
          <div className="flex gap-2 -mx-4 px-4">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-2 rounded-2xl text-sm font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === cat.id
                    ? "bg-teal text-white"
                    : "bg-secondary text-foreground"
                }`}
              >
                {cat.icon} {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* AI Monument Recognition */}
      <div className="container py-4">
        <Card className="bg-gradient-to-r from-accent/10 to-teal/10 border-accent/20 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-accent" />
              <div>
                <h3 className="font-bold text-foreground">AI Recognition</h3>
                <p className="text-xs text-muted">Identify monuments with your camera</p>
              </div>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowAIPanel(!showAIPanel)}
              className="gap-2"
            >
              <Camera className="w-4 h-4" />
            </Button>
          </div>

          {showAIPanel && (
            <div className="mt-4 p-4 bg-white rounded-2xl border border-border">
              <p className="text-sm text-foreground mb-3">
                Take a photo of a monument to identify it and get information.
              </p>
              <input
                type="file"
                accept="image/*"
                className="w-full text-sm"
                onChange={(e) => {
                  if (e.target.files?.[0]) {
                    console.log("Image selected:", e.target.files[0].name);
                  }
                }}
              />
            </div>
          )}
        </Card>
      </div>

      {/* Places Grid */}
      <div className="container py-4">
        {filteredPlaces.length === 0 ? (
          <Card className="p-6 text-center">
            <p className="text-muted">No places found matching your filters.</p>
          </Card>
        ) : (
          <div className="dest-grid">
            {filteredPlaces.map((place) => (
              <Card
                key={place.id}
                className="overflow-hidden hover:shadow-lg transition-all cursor-pointer"
                onClick={() => setSelectedPlace(place)}
              >
                <img
                  src={place.image}
                  alt={place.name}
                  className="w-full h-40 object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400";
                  }}
                />
                <div className="dest-card-body">
                  <h3 className="dest-card-title">{place.name}</h3>
                  <p className="dest-card-meta">{place.description.substring(0, 60)}...</p>
                  <div className="flex justify-between items-center pt-2 border-t border-border">
                    <span className="text-sm font-semibold text-teal">{place.admissionPrice}</span>
                    <span className="text-xs text-muted">{place.duration}</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Detail Sheet */}
      {selectedPlace && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-end"
          onClick={() => setSelectedPlace(null)}
        >
          <Card
            className="w-full rounded-t-3xl max-h-96 overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="w-12 h-1 bg-border rounded-full mx-auto mb-4" />
              <img
                src={selectedPlace.image}
                alt={selectedPlace.name}
                className="w-full h-48 object-cover rounded-2xl mb-4"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400";
                }}
              />
              <h2 className="text-2xl font-bold mb-2">{selectedPlace.name}</h2>
              <p className="text-muted mb-4 text-sm">{selectedPlace.description}</p>

              <div className="space-y-3">
                <div>
                  <p className="text-xs font-semibold text-muted uppercase">Admission</p>
                  <p className="text-lg font-bold text-teal">{selectedPlace.admissionPrice}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted uppercase">Hours</p>
                  <p className="text-sm text-foreground">{selectedPlace.hours}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted uppercase">Tips</p>
                  <p className="text-sm text-foreground">{selectedPlace.tips}</p>
                </div>
              </div>

              <Button className="w-full mt-6 bg-teal hover:bg-teal-dark text-white rounded-2xl font-semibold">
                <MapPin className="w-4 h-4 mr-2" />
                Get Directions
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
