import { useEffect, useState } from "react";
import { Heart, Star, MessageCircle, Globe, Award, Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface Guide {
  id: string;
  name: string;
  nameAr: string;
  cityId: string;
  rating: number;
  reviews: number;
  languages: string[];
  specialties: string[];
  bio: string;
  pricePerDay: number;
  whatsapp: string;
  image: string;
}

export default function FindGuide() {
  const [guides, setGuides] = useState<Guide[]>([]);
  const [selectedCity, setSelectedCity] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [showBecomeGuide, setShowBecomeGuide] = useState(false);

  useEffect(() => {
    fetch("/data.json")
      .then((res) => res.json())
      .then((data) => setGuides(data.guides))
      .catch((err) => console.error("Failed to load guides:", err));
  }, []);

  const filteredGuides = guides.filter((guide) => {
    const matchesCity = selectedCity === "all" || guide.cityId === selectedCity;
    const matchesSearch =
      guide.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      guide.specialties.some((s) => s.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCity && matchesSearch;
  });

  const toggleFavorite = (guideId: string) => {
    setFavorites((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(guideId)) {
        newSet.delete(guideId);
      } else {
        newSet.add(guideId);
      }
      return newSet;
    });
  };

  const handleWhatsApp = (whatsapp: string) => {
    const message = "Hi! I'm interested in booking a tour with you.";
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${whatsapp.replace(/\D/g, "")}?text=${encodedMessage}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-white border-b border-border sticky top-0 z-40">
        <div className="container py-4">
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-2xl font-bold text-foreground">Find a Guide</h1>
            <Dialog open={showBecomeGuide} onOpenChange={setShowBecomeGuide}>
              <DialogTrigger asChild>
                <Button size="sm" className="gap-2 bg-pink-600 hover:bg-pink-700">
                  <Plus className="w-4 h-4" />
                  Become a Guide
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Become a Navito Guide</DialogTitle>
                  <DialogDescription>
                    Share your local expertise and earn money by guiding travelers.
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                  <div className="bg-pink-50 p-4 rounded-lg border border-pink-200">
                    <h4 className="font-semibold text-pink-900 mb-2">Requirements</h4>
                    <ul className="text-sm text-pink-800 space-y-1">
                      <li>✓ 18+ years old</li>
                      <li>✓ Fluent in at least 2 languages</li>
                      <li>✓ Local knowledge of your city</li>
                      <li>✓ Valid ID and background check</li>
                      <li>✓ WhatsApp for communication</li>
                    </ul>
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-foreground block mb-2">
                      Email
                    </label>
                    <Input placeholder="your@email.com" />
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-foreground block mb-2">
                      City
                    </label>
                    <select className="w-full px-3 py-2 border border-border rounded-lg">
                      <option>Marrakech</option>
                      <option>Fès</option>
                      <option>Casablanca</option>
                      <option>Tangier</option>
                      <option>Chefchaouen</option>
                      <option>Agadir</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-foreground block mb-2">
                      Languages (comma-separated)
                    </label>
                    <Input placeholder="Arabic, French, English" />
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-foreground block mb-2">
                      Specialties (comma-separated)
                    </label>
                    <Input placeholder="Medina Tours, Mountain Trekking, Food Tours" />
                  </div>

                  <Button className="w-full bg-pink-600 hover:bg-pink-700">
                    Submit Application
                  </Button>

                  <p className="text-xs text-muted-foreground text-center">
                    We'll review your application within 24 hours.
                  </p>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* City selector */}
          <div className="flex gap-2 overflow-x-auto pb-3">
            <button
              onClick={() => setSelectedCity("all")}
              className={`px-3 py-1 rounded-full text-sm whitespace-nowrap transition-all ${
                selectedCity === "all"
                  ? "bg-pink-600 text-white"
                  : "bg-gray-100 text-foreground"
              }`}
            >
              All Cities
            </button>
            {["marrakech", "fes", "casablanca", "tanger", "chefchaouen", "agadir"].map((city) => (
              <button
                key={city}
                onClick={() => setSelectedCity(city)}
                className={`px-3 py-1 rounded-full text-sm whitespace-nowrap transition-all ${
                  selectedCity === city
                    ? "bg-pink-600 text-white"
                    : "bg-gray-100 text-foreground"
                }`}
              >
                {city.charAt(0).toUpperCase() + city.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="container py-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or specialty..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Guides list */}
      <div className="container py-4">
        {filteredGuides.length === 0 ? (
          <Card className="p-6 text-center">
            <p className="text-muted-foreground">No guides found matching your search.</p>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredGuides.map((guide) => {
              const isFavorite = favorites.has(guide.id);

              return (
                <Card key={guide.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="p-4">
                    <div className="flex gap-4">
                      <img
                        src={guide.image}
                        alt={guide.name}
                        className="w-20 h-20 rounded-lg object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400";
                        }}
                      />

                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-1">
                          <div>
                            <h3 className="font-bold text-foreground">{guide.name}</h3>
                            <p className="text-xs text-muted-foreground">{guide.nameAr}</p>
                          </div>
                          <button
                            onClick={() => toggleFavorite(guide.id)}
                            className="text-pink-600 hover:scale-110 transition-transform"
                          >
                            <Heart
                              className="w-5 h-5"
                              fill={isFavorite ? "currentColor" : "none"}
                            />
                          </button>
                        </div>

                        <div className="flex items-center gap-2 mb-2">
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                            <span className="text-sm font-semibold">{guide.rating}</span>
                            <span className="text-xs text-muted-foreground">({guide.reviews})</span>
                          </div>
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">
                            Verified
                          </span>
                        </div>

                        <div className="flex flex-wrap gap-1 mb-2">
                          {guide.languages.map((lang) => (
                            <span
                              key={lang}
                              className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded"
                            >
                              {lang}
                            </span>
                          ))}
                        </div>

                        <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                          {guide.bio}
                        </p>

                        <div className="flex flex-wrap gap-1 mb-3">
                          {guide.specialties.map((spec) => (
                            <span
                              key={spec}
                              className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded"
                            >
                              {spec}
                            </span>
                          ))}
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-xs text-muted-foreground">Price per day</p>
                            <p className="text-lg font-bold text-pink-600">{guide.pricePerDay} MAD</p>
                          </div>
                          <Button
                            size="sm"
                            onClick={() => handleWhatsApp(guide.whatsapp)}
                            className="gap-2 bg-green-600 hover:bg-green-700"
                          >
                            <MessageCircle className="w-4 h-4" />
                            WhatsApp
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
