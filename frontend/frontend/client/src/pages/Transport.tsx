import { useEffect, useState } from "react";
import { Truck, AlertTriangle, MapPin, DollarSign, MessageCircle, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface TransportData {
  transport: Record<string, any>;
  scamAlerts: Array<any>;
  usefulPhrases: Record<string, any>;
}

export default function Transport() {
  const [data, setData] = useState<TransportData | null>(null);
  const [selectedCity, setSelectedCity] = useState<string>("marrakech");
  const [taxiDistance, setTaxiDistance] = useState(5);
  const [nightSurcharge, setNightSurcharge] = useState(false);

  useEffect(() => {
    fetch("/data.json")
      .then((res) => res.json())
      .then((data) => setData(data))
      .catch((err) => console.error("Failed to load data:", err));
  }, []);

  const estimatedPrice = Math.round(taxiDistance * 3 * (nightSurcharge ? 1.25 : 1));

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-white border-b border-border sticky top-0 z-40">
        <div className="container py-4">
          <h1 className="text-2xl font-bold mb-3 text-foreground">Transport Guide</h1>

          {/* City selector */}
          <div className="flex gap-2 overflow-x-auto pb-3">
            {["marrakech", "fes", "casablanca", "tanger", "chefchaouen", "agadir"].map((city) => (
              <button
                key={city}
                onClick={() => setSelectedCity(city)}
                className={`px-3 py-1 rounded-full text-sm whitespace-nowrap transition-all ${
                  selectedCity === city
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-foreground"
                }`}
              >
                {city.charAt(0).toUpperCase() + city.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs for different sections */}
      <Tabs defaultValue="options" className="w-full">
        <TabsList className="w-full justify-start border-b rounded-none bg-white sticky top-16 z-30 px-4">
          <TabsTrigger value="options">Options</TabsTrigger>
          <TabsTrigger value="estimator">Estimator</TabsTrigger>
          <TabsTrigger value="nearby">Nearby</TabsTrigger>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
          <TabsTrigger value="phrases">Phrases</TabsTrigger>
        </TabsList>

        {/* Transport Options */}
        <TabsContent value="options" className="container py-4">
          <div className="space-y-4">
            {/* Petit Taxi */}
            <Card className="border-l-4 border-l-blue-500 p-4">
              <h3 className="font-bold text-lg mb-2 text-foreground">Petit Taxi (Small Taxi)</h3>
              <p className="text-sm text-muted-foreground mb-3">Red taxis for short trips within city</p>
              <Accordion type="single" collapsible>
                <AccordionItem value="petit-taxi">
                  <AccordionTrigger className="text-sm">
                    <span className="font-semibold">Details & Tips</span>
                  </AccordionTrigger>
                  <AccordionContent className="space-y-2 text-sm">
                    <div>
                      <p className="font-semibold text-foreground">Average Price</p>
                      <p className="text-amber-600">8-15 MAD per trip</p>
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">Tips</p>
                      <ul className="list-disc list-inside text-muted-foreground space-y-1">
                        <li>Always insist on using the meter</li>
                        <li>Avoid unofficial taxis</li>
                        <li>Know approximate prices beforehand</li>
                        <li>Negotiate before boarding if no meter</li>
                      </ul>
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">Zones</p>
                      <p className="text-muted-foreground">Medina, Gueliz, Hivernage, New City</p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </Card>

            {/* Grand Taxi */}
            <Card className="border-l-4 border-l-teal-500 p-4">
              <h3 className="font-bold text-lg mb-2 text-foreground">Grand Taxi (Shared Taxi)</h3>
              <p className="text-sm text-muted-foreground mb-3">Shared taxis for longer inter-city routes</p>
              <Accordion type="single" collapsible>
                <AccordionItem value="grand-taxi">
                  <AccordionTrigger className="text-sm">
                    <span className="font-semibold">Details & Tips</span>
                  </AccordionTrigger>
                  <AccordionContent className="space-y-2 text-sm">
                    <div>
                      <p className="font-semibold text-foreground">Average Price</p>
                      <p className="text-amber-600">20-50 MAD depending on distance</p>
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">Tips</p>
                      <ul className="list-disc list-inside text-muted-foreground space-y-1">
                        <li>Negotiate before boarding</li>
                        <li>Taxi departs when full (usually 6 passengers)</li>
                        <li>Comfortable for longer routes</li>
                      </ul>
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">Popular Routes</p>
                      <p className="text-muted-foreground">Marrakech-Essaouira, Marrakech-Agadir</p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </Card>

            {/* Buses */}
            <Card className="border-l-4 border-l-orange-500 p-4">
              <h3 className="font-bold text-lg mb-2 text-foreground">Buses (M'dina, Alsa, CTM)</h3>
              <p className="text-sm text-muted-foreground mb-3">Urban and long-distance buses</p>
              <Accordion type="single" collapsible>
                <AccordionItem value="buses">
                  <AccordionTrigger className="text-sm">
                    <span className="font-semibold">Details & Tips</span>
                  </AccordionTrigger>
                  <AccordionContent className="space-y-2 text-sm">
                    <div>
                      <p className="font-semibold text-foreground">Urban Buses (M'dina)</p>
                      <p className="text-amber-600">5-8 MAD</p>
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">Long Distance (CTM)</p>
                      <p className="text-amber-600">100-300 MAD depending on route</p>
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">Tips</p>
                      <ul className="list-disc list-inside text-muted-foreground space-y-1">
                        <li>Buy ticket from driver or station</li>
                        <li>Buses crowded during rush hours</li>
                        <li>Long-distance buses are comfortable</li>
                      </ul>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </Card>

            {/* Trains */}
            <Card className="border-l-4 border-l-purple-500 p-4">
              <h3 className="font-bold text-lg mb-2 text-foreground">Trains (ONCF)</h3>
              <p className="text-sm text-muted-foreground mb-3">Reliable inter-city rail service</p>
              <Accordion type="single" collapsible>
                <AccordionItem value="trains">
                  <AccordionTrigger className="text-sm">
                    <span className="font-semibold">Details & Tips</span>
                  </AccordionTrigger>
                  <AccordionContent className="space-y-2 text-sm">
                    <div>
                      <p className="font-semibold text-foreground">Price Range</p>
                      <p className="text-amber-600">80-150 MAD</p>
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">Main Routes</p>
                      <p className="text-muted-foreground">Marrakech-Casablanca, Marrakech-Fès</p>
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">Website</p>
                      <p className="text-blue-600">www.oncf.ma</p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </Card>
          </div>
        </TabsContent>

        {/* Taxi Price Estimator */}
        <TabsContent value="estimator" className="container py-4">
          <Card className="p-6">
            <h3 className="font-bold text-lg mb-4 text-foreground">Taxi Price Estimator</h3>

            <div className="space-y-6">
              <div>
                <label className="text-sm font-semibold text-foreground mb-2 block">
                  Distance: {taxiDistance} km
                </label>
                <input
                  type="range"
                  min="1"
                  max="50"
                  value={taxiDistance}
                  onChange={(e) => setTaxiDistance(Number(e.target.value))}
                  className="w-full"
                />
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="night-surcharge"
                  checked={nightSurcharge}
                  onChange={(e) => setNightSurcharge(e.target.checked)}
                  className="w-4 h-4"
                />
                <label htmlFor="night-surcharge" className="text-sm font-semibold text-foreground">
                  Night Surcharge (after 8 PM) +25%
                </label>
              </div>

              <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-4 rounded-lg border border-amber-200">
                <p className="text-sm text-muted-foreground mb-2">Estimated Price Range</p>
                <p className="text-4xl font-bold text-amber-600">
                  {Math.round(estimatedPrice * 0.9)} - {Math.round(estimatedPrice * 1.1)} MAD
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  ⓘ This is an estimate. Always use the meter or negotiate beforehand.
                </p>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <p className="text-sm font-semibold text-blue-900 mb-2">💡 Pro Tips</p>
                <ul className="text-xs text-blue-800 space-y-1">
                  <li>✓ Insist on the meter</li>
                  <li>✓ Know the price before boarding</li>
                  <li>✓ Night taxis charge 25% more</li>
                  <li>✓ Avoid unofficial taxis</li>
                </ul>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Nearby Transport */}
        <TabsContent value="nearby" className="container py-4">
          <Card className="p-6">
            <h3 className="font-bold text-lg mb-4 text-foreground">Nearby Transport Options</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Enable location to find nearby taxis, buses, and transport stations.
            </p>
            <Button className="w-full gap-2 bg-blue-600 hover:bg-blue-700">
              <MapPin className="w-4 h-4" />
              Enable Location
            </Button>

            <div className="mt-6 space-y-3">
              <div className="p-3 border border-border rounded-lg">
                <p className="font-semibold text-sm text-foreground">Taxi Stand</p>
                <p className="text-xs text-muted-foreground">500m away</p>
              </div>
              <div className="p-3 border border-border rounded-lg">
                <p className="font-semibold text-sm text-foreground">Bus Station</p>
                <p className="text-xs text-muted-foreground">1.2km away</p>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Scam Alerts */}
        <TabsContent value="alerts" className="container py-4">
          <div className="space-y-3">
            {data?.scamAlerts.map((alert) => (
              <Card key={alert.id} className="border-l-4 border-l-red-500 p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="font-bold text-foreground mb-1">{alert.title}</h4>
                    <p className="text-sm text-muted-foreground mb-2">{alert.description}</p>
                    <Accordion type="single" collapsible>
                      <AccordionItem value={alert.id}>
                        <AccordionTrigger className="text-sm py-0">
                          <span className="text-amber-600 font-semibold">How to avoid & what to do</span>
                        </AccordionTrigger>
                        <AccordionContent className="space-y-2 text-sm pt-2">
                          <div>
                            <p className="font-semibold text-foreground">How to Avoid</p>
                            <p className="text-muted-foreground">{alert.howToAvoid}</p>
                          </div>
                          <div>
                            <p className="font-semibold text-foreground">If It Happens</p>
                            <p className="text-muted-foreground">{alert.ifHappens}</p>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Useful Phrases */}
        <TabsContent value="phrases" className="container py-4">
          <div className="space-y-4">
            {data?.usefulPhrases && (
              <>
                {/* Darija */}
                <div>
                  <h4 className="font-bold text-foreground mb-3">Darija (Moroccan Arabic)</h4>
                  <div className="space-y-2">
                    {data.usefulPhrases.darija?.map((phrase: any, idx: number) => (
                      <Card key={idx} className="p-3">
                        <p className="text-sm font-semibold text-foreground">{phrase.english}</p>
                        <p className="text-sm text-amber-600 font-bold">{phrase.darija}</p>
                        <p className="text-xs text-muted-foreground italic">{phrase.pronunciation}</p>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* French */}
                <div>
                  <h4 className="font-bold text-foreground mb-3">French</h4>
                  <div className="space-y-2">
                    {data.usefulPhrases.french?.map((phrase: any, idx: number) => (
                      <Card key={idx} className="p-3">
                        <p className="text-sm font-semibold text-foreground">{phrase.english}</p>
                        <p className="text-sm text-blue-600 font-bold">{phrase.french}</p>
                        <p className="text-xs text-muted-foreground italic">{phrase.pronunciation}</p>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Arabic */}
                <div>
                  <h4 className="font-bold text-foreground mb-3">Arabic</h4>
                  <div className="space-y-2">
                    {data.usefulPhrases.arabic?.map((phrase: any, idx: number) => (
                      <Card key={idx} className="p-3">
                        <p className="text-sm font-semibold text-foreground">{phrase.english}</p>
                        <p className="text-sm text-teal-600 font-bold">{phrase.arabic}</p>
                        <p className="text-xs text-muted-foreground italic">{phrase.pronunciation}</p>
                      </Card>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
