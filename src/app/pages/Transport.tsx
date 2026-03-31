import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Bus, Calculator, Car, Clock, Languages, MapPin, MessageCircle, Navigation, Phone, Shield, Star, Train, TramFront } from 'lucide-react';
import BottomNav from '../components/BottomNav';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { drivers, transportOptions } from '../data/mockData';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { useAppContext } from '../context/AppContext';

export default function Transport() {
  const navigate = useNavigate();
  const { authMode, city, exploreMode } = useAppContext();
  const [pickup, setPickup] = useState(city || '');
  const [destination, setDestination] = useState('');

  const availableDrivers = useMemo(() => drivers.filter((driver) => driver.available), []);
  const transportIcons = {
    'Petit Taxi': Car,
    'Grand Taxi': TramFront,
    'City Bus': Bus,
    'ONCF Train': Train,
  } as const;

  const handleRequestDriver = () => {
    if (authMode !== 'login') {
      navigate('/login?redirectTo=/transport');
      return;
    }
    toast.success('Driver request sent successfully');
  };

  return (
    <div className="size-full bg-white flex flex-col pb-16">
      <div className="bg-[#0D9488] px-6 py-6 text-white">
        <h1 className="mb-2 text-2xl font-bold">Transport</h1>
        <p className="text-sm text-white/80">
          {exploreMode === 'city' && city ? `Find reliable transportation in ${city}` : 'Find reliable transportation with your current map'}
        </p>
      </div>

      <div className="flex-1 overflow-auto">
        <Tabs defaultValue="drivers" className="w-full">
          <TabsList className="m-4 grid w-full grid-cols-3 rounded-xl bg-gray-100 p-1">
            <TabsTrigger value="drivers" className="rounded-lg">Find Driver</TabsTrigger>
            <TabsTrigger value="guide" className="rounded-lg">Transport Guide</TabsTrigger>
            <TabsTrigger value="simulator" className="rounded-lg">Price Calc</TabsTrigger>
          </TabsList>

          <TabsContent value="drivers" className="space-y-6 px-6 pb-6">
            <div className="space-y-3">
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <Input placeholder="Pickup location" value={pickup} onChange={(e) => setPickup(e.target.value)} className="h-12 rounded-xl pl-12" />
              </div>
              <div className="relative">
                <Navigation className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <Input placeholder="Destination" value={destination} onChange={(e) => setDestination(e.target.value)} className="h-12 rounded-xl pl-12" />
              </div>
            </div>

            <div className="space-y-3">
              {availableDrivers.map((driver) => (
                <div key={driver.id} className="rounded-2xl border-2 border-gray-200 p-4 transition-colors hover:border-[#0D9488]">
                  <div className="flex gap-4">
                    <div className="relative">
                      <img src={driver.image} alt={driver.name} className="h-16 w-16 rounded-full object-cover" />
                      {driver.verified && (
                        <div className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-blue-500">
                          <Shield className="h-3 w-3 text-white" />
                        </div>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="mb-1 flex items-center justify-between">
                        <h3 className="font-bold text-gray-900">{driver.name}</h3>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-semibold">{driver.rating}</span>
                        </div>
                      </div>

                      <div className="mb-2 flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Car className="h-4 w-4" />
                          <span>{driver.vehicleType}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          <span>{driver.distance} km away</span>
                        </div>
                      </div>

                      <div className="mb-3 flex items-center gap-2">
                        <Languages className="h-4 w-4 text-gray-400" />
                        <span className="text-xs text-gray-600">{driver.languages.join(', ')}</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="text-sm">
                          <span className="text-gray-600">From </span>
                          <span className="font-bold text-[#0D9488]">{driver.pricePerKm} MAD/km</span>
                        </div>

                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" className="h-8 w-8 rounded-full p-0">
                            <Phone className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" className="h-8 w-8 rounded-full p-0">
                            <MessageCircle className="h-4 w-4" />
                          </Button>
                          <Button onClick={handleRequestDriver} size="sm" className="bg-[#0D9488] hover:bg-[#0D9488]/90">
                            Request
                          </Button>
                        </div>
                      </div>

                      <div className="mt-2 flex items-center gap-1 text-xs text-gray-500">
                        <Clock className="h-3 w-3" />
                        <span>Typically responds in {driver.responseTime}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="guide" className="space-y-4 px-6 pb-6">
            {transportOptions.map((transport) => (
              <div key={transport.id} className="rounded-2xl border border-gray-200 bg-white p-4">
                <div className="flex gap-4">
                  <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-[#0D9488]/10">
                    <ImageWithFallback src={transport.image} alt={transport.title} className="h-full w-full object-cover" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="mb-1 flex items-center gap-2">
                      {(() => {
                        const Icon = transportIcons[transport.title as keyof typeof transportIcons] ?? Car;
                        return <Icon className="h-4 w-4 text-[#0D9488]" />;
                      })()}
                      <h3 className="font-bold text-gray-900">{transport.title}</h3>
                    </div>
                    <p className="text-sm text-gray-600">{transport.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="simulator" className="px-6 pb-6">
            <div className="py-12 text-center">
              <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-[#0D9488]/10">
                <Calculator className="h-10 w-10 text-[#0D9488]" />
              </div>
              <h3 className="mb-2 text-xl font-bold text-gray-900">Taxi Price Simulator</h3>
              <p className="mx-auto mb-6 max-w-sm text-gray-600">Calculate estimated taxi fares based on distance and time.</p>
              <Button onClick={() => navigate('/taxi-simulator')} className="bg-[#0D9488] hover:bg-[#0D9488]/90">
                Open Simulator
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <BottomNav />
    </div>
  );
}
