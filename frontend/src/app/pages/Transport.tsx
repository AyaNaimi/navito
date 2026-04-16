import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Bus, Calculator, Car, Clock, Loader2, Mail, MapPin, MessageCircle, Navigation, Phone, Shield, Train, TramFront, Users } from 'lucide-react';
import BottomNav from '../components/BottomNav';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { useAppContext } from '../context/AppContext';
import { fetchDirectoryDrivers, fetchTransportFares, createConversation, type ApiDirectoryDriver, type ApiTransportFare } from '../services/api';
import { motion } from 'motion/react';

export default function Transport() {
  const navigate = useNavigate();
  const { authMode, authToken, city, exploreMode, userRole } = useAppContext();
  const [pickup, setPickup] = useState(city || '');
  const [destination, setDestination] = useState('');
  const [drivers, setDrivers] = useState<ApiDirectoryDriver[]>([]);
  const [transportFares, setTransportFares] = useState<ApiTransportFare[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingFares, setIsLoadingFares] = useState(true);

  const activeCity = city || 'Marrakech';

  useEffect(() => {
    let cancelled = false;

    setIsLoading(true);
    fetchDirectoryDrivers(activeCity)
      .then((response) => {
        if (!cancelled) {
          setDrivers(response.data ?? []);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setDrivers([]);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setIsLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [activeCity]);

  useEffect(() => {
    let cancelled = false;
    setIsLoadingFares(true);
    fetchTransportFares()
      .then((response) => {
        if (!cancelled) {
          setTransportFares(response.data ?? []);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setTransportFares([]);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setIsLoadingFares(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const availableDrivers = useMemo(
    () =>
      drivers.filter(
        (driver) => driver.verified && (driver.verification_status == null || driver.verification_status === 'verified'),
      ),
    [drivers],
  );

  const transportIcons = {
    'Petit Taxi': Car,
    'Grand Taxi': TramFront,
    'City Bus': Bus,
    'ONCF Train': Train,
  } as const;

  const handleRequestDriver = (driver: ApiDirectoryDriver) => {
    if (authMode !== 'login') {
      const params = new URLSearchParams();
      if (pickup) {
        params.set('pickup', pickup);
      }
      if (destination) {
        params.set('destination', destination);
      }
      navigate(`/login?redirectTo=${encodeURIComponent(`/driver/request/${driver.id}?${params.toString()}`)}`);
      return;
    }

    if (userRole !== 'tourist') {
      toast.error('Seuls les touristes peuvent envoyer une demande chauffeur.');
      return;
    }

    const params = new URLSearchParams();
    if (pickup) {
      params.set('pickup', pickup);
    }
    if (destination) {
      params.set('destination', destination);
    }
    navigate(`/driver/request/${driver.id}?${params.toString()}`);
  };

  const handleMessageDriver = async (driverId: number) => {
    if (authMode !== 'login' || !authToken) {
      navigate('/login?redirectTo=/messages');
      return;
    }
    try {
      const response = await createConversation({ participant_ids: [driverId] }, authToken);
      if (response.data) {
        navigate('/messages', { state: { conversationId: response.data.id } });
        toast.success('Conversation opened');
      }
    } catch {
      toast.error('Unable to start conversation');
    }
  };

  return (
    <div className="size-full flex flex-col bg-gradient-to-b from-[#0D9488]/5 via-white to-white pb-16">
      <div className="bg-gradient-to-r from-[#0D9488] to-[#0891B2] text-white px-6 py-6 shadow-lg shadow-[#0D9488]/20">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4"
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
            <Car className="h-7 w-7" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Transport</h1>
            <p className="text-white/80 text-sm">
              {exploreMode === 'city' && city ? `Find reliable rides in ${city}` : 'Find transport near your location'}
            </p>
          </div>
        </motion.div>
      </div>

      <div className="flex-1 overflow-auto">
        <Tabs defaultValue="drivers" className="w-full">
          <div className="px-4 pt-4">
            <TabsList className="grid w-full grid-cols-3 rounded-2xl bg-white/90 p-1.5 shadow-sm ring-1 ring-gray-200 backdrop-blur-sm">
              <TabsTrigger
                value="drivers"
                className="flex min-h-14 flex-col items-center justify-center gap-1 rounded-xl px-2 text-[11px] font-semibold text-gray-600 data-[state=active]:bg-[#0D9488] data-[state=active]:text-white data-[state=active]:shadow-md sm:min-h-12 sm:flex-row sm:gap-2 sm:text-sm"
              >
                <Users className="h-4 w-4 shrink-0" />
                <span>Drivers</span>
              </TabsTrigger>
              <TabsTrigger
                value="guide"
                className="flex min-h-14 flex-col items-center justify-center gap-1 rounded-xl px-2 text-[11px] font-semibold text-gray-600 data-[state=active]:bg-[#0D9488] data-[state=active]:text-white data-[state=active]:shadow-md sm:min-h-12 sm:flex-row sm:gap-2 sm:text-sm"
              >
                <Car className="h-4 w-4 shrink-0" />
                <span>Tarifs</span>
              </TabsTrigger>
              <TabsTrigger
                value="simulator"
                className="flex min-h-14 flex-col items-center justify-center gap-1 rounded-xl px-2 text-[11px] font-semibold text-gray-600 data-[state=active]:bg-[#0D9488] data-[state=active]:text-white data-[state=active]:shadow-md sm:min-h-12 sm:flex-row sm:gap-2 sm:text-sm"
              >
                <Calculator className="h-4 w-4 shrink-0" />
                <span>Calcul</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="drivers" className="space-y-6 px-6 pb-6">
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-3"
            >
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#0D9488]" />
                <Input placeholder="Pickup location" value={pickup} onChange={(e) => setPickup(e.target.value)} className="h-14 rounded-2xl border-2 border-gray-100 bg-white pl-12 focus:border-[#0D9488] transition-colors" />
              </div>
              <div className="relative">
                <Navigation className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#0D9488]" />
                <Input placeholder="Destination" value={destination} onChange={(e) => setDestination(e.target.value)} className="h-14 rounded-2xl border-2 border-gray-100 bg-white pl-12 focus:border-[#0D9488] transition-colors" />
              </div>
            </motion.div>

            {isLoading ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="rounded-2xl border border-gray-200 bg-white p-8 text-center"
              >
                <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-[#0D9488]/20 border-t-[#0D9488]"></div>
                <p className="text-sm text-gray-500">Loading driver profiles...</p>
              </motion.div>
            ) : availableDrivers.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl border border-gray-200 bg-white p-8 text-center"
              >
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100">
                  <Car className="h-8 w-8 text-gray-400" />
                </div>
                <p className="text-sm text-gray-500">No verified drivers available for this city yet.</p>
              </motion.div>
            ) : (
              <div className="space-y-4">
                {availableDrivers.map((driver, index) => (
                  <motion.div
                    key={driver.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.08 }}
                    className="rounded-2xl border-2 border-gray-100 bg-white p-5 transition-all duration-200 hover:border-[#0D9488]/50 hover:shadow-lg"
                  >
                    <div className="flex gap-4">
                      <div className="relative">
                        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#0D9488]/20 to-[#0891B2]/10 text-[#0D9488]">
                          <Car className="h-8 w-8" />
                        </div>
                        {driver.verified && (
                          <div className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg">
                            <Shield className="h-3 w-3 text-white" />
                          </div>
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="mb-3 flex items-center justify-between gap-3">
                          <div>
                            <h3 className="font-bold text-gray-900 text-lg">{driver.name}</h3>
                            <div className="flex items-center gap-2 mt-1">
                              <MapPin className="h-3.5 w-3.5 text-gray-400" />
                              <p className="text-sm text-gray-500">{driver.city ?? activeCity}</p>
                            </div>
                          </div>
                          <span className="rounded-full bg-emerald-100 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-emerald-700">
                            {driver.verification_status ?? 'verified'}
                          </span>
                        </div>

                        <div className="flex items-center gap-4 text-sm mb-4">
                          <div className="flex items-center gap-1.5 text-gray-500">
                            <Car className="h-4 w-4" />
                            <span>{driver.vehicle_type ?? 'Vehicle not specified'}</span>
                          </div>
                        </div>

                        <div className="mb-4 flex flex-wrap items-center gap-4 text-xs text-gray-500">
                          <div className="flex items-center gap-1">
                            <Mail className="h-3.5 w-3.5 text-gray-400" />
                            {driver.email}
                          </div>
                          <div className="flex items-center gap-1">
                            <Phone className="h-3.5 w-3.5 text-gray-400" />
                            {driver.phone || 'Not provided'}
                          </div>
                        </div>

                        <div className="flex items-center justify-between gap-3 pt-3 border-t border-gray-100">
                          <div className="text-sm">
                            <span className="text-gray-500">Vehicle </span>
                            <span className="font-bold text-[#0D9488]">{driver.vehicle_registration || 'Not registered'}</span>
                          </div>

                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" className="h-9 w-9 rounded-xl p-0 hover:bg-[#0D9488]/10 hover:border-[#0D9488]">
                              <Phone className="h-4 w-4 text-gray-600" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="h-9 w-9 rounded-xl p-0 hover:bg-[#0D9488]/10 hover:border-[#0D9488] hover:text-[#0D9488]"
                              onClick={() => handleMessageDriver(driver.id)}
                            >
                              <MessageCircle className="h-4 w-4 text-gray-600" />
                            </Button>
                            <Button onClick={() => handleRequestDriver(driver)} size="sm" className="bg-gradient-to-r from-[#0D9488] to-[#0891B2] hover:from-[#0891B2] hover:to-[#0D9488] rounded-xl shadow-lg shadow-[#0D9488]/20">
                              Request
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="guide" className="space-y-4 px-6 pb-6">
            {isLoadingFares ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="rounded-2xl border border-gray-200 bg-white p-8 text-center"
              >
                <Loader2 className="h-8 w-8 animate-spin text-[#0D9488] mx-auto mb-3" />
                <p className="text-sm text-gray-500">Loading transport options...</p>
              </motion.div>
            ) : transportFares.length > 0 ? (
              transportFares.map((fare, index) => {
                const Icon = transportIcons[fare.transport_type as keyof typeof transportIcons] ?? Car;
                const priceRange = fare.price_min && fare.price_max
                  ? `${fare.price_min} - ${fare.price_max}`
                  : fare.price_min
                    ? `From ${fare.price_min}`
                    : fare.price_max
                      ? `Up to ${fare.price_max}`
                      : 'Price varies';
                return (
                  <motion.div 
                    key={fare.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.06 }}
                    className="rounded-2xl border border-gray-100 bg-white p-5 hover:shadow-md hover:border-[#0D9488]/30 transition-all"
                  >
                    <div className="flex gap-4">
                      <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-[#0D9488]/10">
                        <Icon className="h-8 w-8 text-[#0D9488]" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="mb-2 flex items-center gap-2">
                          <h3 className="font-bold text-gray-900 text-lg">{fare.label}</h3>
                        </div>
                        <p className="text-sm text-gray-600 leading-relaxed mb-2">{fare.notes || `Transport type: ${fare.transport_type}`}</p>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-[#0D9488] bg-[#0D9488]/10 px-3 py-1 rounded-full">
                            {priceRange} MAD
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })
            ) : (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl border border-gray-200 bg-white p-8 text-center"
              >
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100">
                  <Car className="h-8 w-8 text-gray-400" />
                </div>
                <p className="text-sm text-gray-500">No transport options available for this city yet.</p>
              </motion.div>
            )}
          </TabsContent>

          <TabsContent value="simulator" className="px-6 pb-6">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="py-12 text-center"
            >
              <motion.div 
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1, type: 'spring' }}
                className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-[#0D9488]/20 to-[#0891B2]/10 shadow-lg"
              >
                <Calculator className="h-12 w-12 text-[#0D9488]" />
              </motion.div>
              <h3 className="mb-3 text-xl font-bold text-gray-900">Taxi Price Simulator</h3>
              <p className="mx-auto mb-6 max-w-sm text-gray-600">Calculate estimated taxi fares based on distance and time.</p>
              <Button onClick={() => navigate('/taxi-simulator')} className="bg-gradient-to-r from-[#0D9488] to-[#0891B2] hover:from-[#0891B2] hover:to-[#0D9488] rounded-xl shadow-lg shadow-[#0D9488]/20 px-8">
                Open Simulator
              </Button>
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>

      <BottomNav />
    </div>
  );
}
