import { useEffect, useState } from "react";
import { UtensilsCrossed, Star, DollarSign, Sparkles, AlertTriangle, Search, Camera, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface Restaurant {
  id: string;
  cityId: string;
  name: string;
  cuisine: string;
  pricePerPerson: number;
  rating: number;
  halal: boolean;
  lat: number;
  lng: number;
  hours: string;
  specialties: string[];
  image: string;
}

interface PriceGuideItem {
  item: string;
  price: string;
  location: string;
}

export default function Food() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [priceGuide, setPriceGuide] = useState<PriceGuideItem[]>([]);
  const [selectedCity, setSelectedCity] = useState<string>("marrakech");
  const [searchTerm, setSearchTerm] = useState("");
  const [priceFilter, setPriceFilter] = useState<"all" | "budget" | "mid" | "luxury">("all");
  const [halalFilter, setHalalFilter] = useState(false);
  const [showAIChecker, setShowAIChecker] = useState(false);
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);

  useEffect(() => {
    fetch("/data.json")
      .then((res) => res.json())
      .then((data) => {
        setRestaurants(data.restaurants);
        setPriceGuide(data.foodPriceGuide);
      })
      .catch((err) => console.error("Failed to load data:", err));
  }, []);

  const filteredRestaurants = restaurants.filter((rest) => {
    const matchesCity = rest.cityId === selectedCity;
    const matchesSearch =
      rest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rest.cuisine.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPrice =
      priceFilter === "all" ||
      (priceFilter === "budget" && rest.pricePerPerson < 80) ||
      (priceFilter === "mid" && rest.pricePerPerson >= 80 && rest.pricePerPerson < 150) ||
      (priceFilter === "luxury" && rest.pricePerPerson >= 150);
    const matchesHalal = !halalFilter || rest.halal;

    return matchesCity && matchesSearch && matchesPrice && matchesHalal;
  });

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-white border-b border-border sticky top-0 z-40">
        <div className="container py-4">
          <h1 className="text-2xl font-bold mb-3 text-foreground">Food & Restaurants</h1>

          {/* City selector */}
          <div className="flex gap-2 overflow-x-auto pb-3">
            {["marrakech", "fes", "casablanca", "tanger", "chefchaouen", "agadir"].map((city) => (
              <button
                key={city}
                onClick={() => setSelectedCity(city)}
                className={`px-3 py-1 rounded-full text-sm whitespace-nowrap transition-all ${
                  selectedCity === city
                    ? "bg-orange-600 text-white"
                    : "bg-gray-100 text-foreground"
                }`}
              >
                {city.charAt(0).toUpperCase() + city.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="restaurants" className="w-full">
        <TabsList className="w-full justify-start border-b rounded-none bg-white sticky top-16 z-30 px-4">
          <TabsTrigger value="restaurants">Restaurants</TabsTrigger>
          <TabsTrigger value="prices">Price Guide</TabsTrigger>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
        </TabsList>

        {/* Restaurants Tab */}
        <TabsContent value="restaurants" className="container py-4">
          {/* Search and filters */}
          <div className="space-y-3 mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search restaurants or cuisine..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filter buttons */}
            <div className="flex gap-2 overflow-x-auto">
              {[
                { id: "all", label: "All" },
                { id: "budget", label: "Budget" },
                { id: "mid", label: "Mid-range" },
                { id: "luxury", label: "Luxury" },
              ].map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setPriceFilter(filter.id as any)}
                  className={`px-3 py-2 rounded-lg text-sm whitespace-nowrap transition-all ${
                    priceFilter === filter.id
                      ? "bg-orange-100 text-orange-700 border border-orange-300"
                      : "bg-gray-50 text-foreground border border-border"
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>

            {/* Halal filter */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="halal-filter"
                checked={halalFilter}
                onChange={(e) => setHalalFilter(e.target.checked)}
                className="w-4 h-4"
              />
              <label htmlFor="halal-filter" className="text-sm font-semibold text-foreground">
                Halal only
              </label>
            </div>
          </div>

          {/* AI Price Checker */}
          <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200 p-4 mb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-600" />
                <div>
                  <h3 className="font-bold text-purple-900">AI Food Price Checker</h3>
                  <p className="text-xs text-purple-700">Identify food items and check prices</p>
                </div>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowAIChecker(!showAIChecker)}
                className="gap-2"
              >
                <Camera className="w-4 h-4" />
                Try it
              </Button>
            </div>

            {showAIChecker && (
              <div className="mt-4 p-4 bg-white rounded-lg border border-purple-200">
                <p className="text-sm text-foreground mb-3">
                  Take a photo of a food item to identify it and get price estimates.
                </p>
                <input
                  type="file"
                  accept="image/*"
                  className="w-full text-sm"
                  onChange={(e) => {
                    if (e.target.files?.[0]) {
                      console.log("Image selected:", e.target.files[0].name);
                      // In a real app, this would process the image with AI
                    }
                  }}
                />
                <p className="text-xs text-muted-foreground mt-2">
                  ℹ️ This feature uses computer vision to identify food items and estimate prices.
                </p>
              </div>
            )}
          </Card>

          {/* Restaurant list */}
          <div className="space-y-3">
            {filteredRestaurants.length === 0 ? (
              <Card className="p-6 text-center">
                <p className="text-muted-foreground">No restaurants found matching your filters.</p>
              </Card>
            ) : (
              filteredRestaurants.map((rest) => (
                <Card
                  key={rest.id}
                  className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => setSelectedRestaurant(rest)}
                >
                  <div className="flex gap-3">
                    <img
                      src={rest.image}
                      alt={rest.name}
                      className="w-24 h-24 object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=400";
                      }}
                    />
                    <div className="flex-1 p-3">
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="font-bold text-foreground">{rest.name}</h3>
                        {rest.halal && <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">Halal</span>}
                      </div>
                      <p className="text-xs text-muted-foreground mb-2">{rest.cuisine}</p>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                          <span className="text-sm font-semibold">{rest.rating}</span>
                        </div>
                        <span className="text-orange-600 font-semibold">{rest.pricePerPerson} MAD</span>
                      </div>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        {/* Price Guide Tab */}
        <TabsContent value="prices" className="container py-4">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground mb-4">
              Reference prices for common food items in {selectedCity}. Prices may vary by location and vendor.
            </p>
            {priceGuide.map((item, idx) => (
              <Card key={idx} className="p-3">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-foreground text-sm">{item.item}</p>
                    <p className="text-xs text-muted-foreground">{item.location}</p>
                  </div>
                  <p className="text-amber-600 font-bold">{item.price}</p>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Alerts Tab */}
        <TabsContent value="alerts" className="container py-4">
          <div className="space-y-3">
            <Card className="border-l-4 border-l-red-500 p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h4 className="font-bold text-foreground mb-1">Restaurant Overpricing</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    Tourist restaurants may charge 2-3x normal prices for the same dishes.
                  </p>
                  <Accordion type="single" collapsible>
                    <AccordionItem value="overpricing">
                      <AccordionTrigger className="text-sm py-0">
                        <span className="text-amber-600 font-semibold">How to avoid</span>
                      </AccordionTrigger>
                      <AccordionContent className="space-y-2 text-sm pt-2">
                        <ul className="list-disc list-inside text-muted-foreground space-y-1">
                          <li>Eat where locals eat</li>
                          <li>Check prices before ordering</li>
                          <li>Ask for menu prices in writing</li>
                          <li>Compare prices across restaurants</li>
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
              </div>
            </Card>

            <Card className="border-l-4 border-l-red-500 p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h4 className="font-bold text-foreground mb-1">Hidden Charges</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    Some restaurants add service charges or bread/water fees without mentioning them.
                  </p>
                  <Accordion type="single" collapsible>
                    <AccordionItem value="hidden-charges">
                      <AccordionTrigger className="text-sm py-0">
                        <span className="text-amber-600 font-semibold">What to do</span>
                      </AccordionTrigger>
                      <AccordionContent className="space-y-2 text-sm pt-2">
                        <ul className="list-disc list-inside text-muted-foreground space-y-1">
                          <li>Ask about all charges upfront</li>
                          <li>Request itemized bills</li>
                          <li>Refuse unwanted items (bread, water)</li>
                          <li>Negotiate if overcharged</li>
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Restaurant Detail Sheet */}
      {selectedRestaurant && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-end"
          onClick={() => setSelectedRestaurant(null)}
        >
          <Card
            className="w-full rounded-t-3xl max-h-96 overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-4" />
              <img
                src={selectedRestaurant.image}
                alt={selectedRestaurant.name}
                className="w-full h-48 object-cover rounded-lg mb-4"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=400";
                }}
              />
              <h2 className="text-2xl font-bold mb-2">{selectedRestaurant.name}</h2>
              <p className="text-muted-foreground mb-4">{selectedRestaurant.cuisine}</p>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-foreground">Rating</span>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span className="font-bold">{selectedRestaurant.rating}</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-foreground">Price per Person</span>
                  <span className="text-orange-600 font-bold">{selectedRestaurant.pricePerPerson} MAD</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-foreground">Halal</span>
                  <span className={selectedRestaurant.halal ? "text-green-600" : "text-red-600"}>
                    {selectedRestaurant.halal ? "Yes" : "No"}
                  </span>
                </div>
                <div>
                  <p className="font-semibold text-foreground mb-1">Hours</p>
                  <p className="text-muted-foreground">{selectedRestaurant.hours}</p>
                </div>
                <div>
                  <p className="font-semibold text-foreground mb-1">Specialties</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedRestaurant.specialties.map((spec, idx) => (
                      <span key={idx} className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded">
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <Button className="w-full mt-6 bg-orange-600 hover:bg-orange-700">
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
