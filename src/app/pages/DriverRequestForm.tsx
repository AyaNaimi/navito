import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { ArrowLeft, CalendarDays, Car, MapPin, Phone, Send, UserRound } from 'lucide-react';
import BottomNav from '../components/BottomNav';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { useAppContext } from '../context/AppContext';
import {
  createDriverRequest,
  fetchCities,
  fetchDirectoryDrivers,
  type ApiCity,
  type ApiDirectoryDriver,
} from '../services/api';

export default function DriverRequestForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const { authMode, authToken, city, userRole } = useAppContext();
  const [drivers, setDrivers] = useState<ApiDirectoryDriver[]>([]);
  const [cities, setCities] = useState<ApiCity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    date: '',
    pickupLocation: new URLSearchParams(location.search).get('pickup') || city || '',
    destination: new URLSearchParams(location.search).get('destination') || '',
    notes: '',
  });

  useEffect(() => {
    let cancelled = false;

    Promise.all([fetchDirectoryDrivers(), fetchCities()])
      .then(([driversResponse, citiesResponse]) => {
        if (cancelled) {
          return;
        }

        setDrivers(driversResponse.data ?? []);
        setCities(citiesResponse.data ?? []);
      })
      .catch(() => {
        if (!cancelled) {
          setDrivers([]);
          setCities([]);
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
  }, []);

  const driver = useMemo(() => drivers.find((item) => String(item.id) === id), [drivers, id]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (authMode !== 'login' || !authToken) {
      navigate(`/login?redirectTo=${encodeURIComponent(`${location.pathname}${location.search}`)}`);
      return;
    }

    if (userRole !== 'tourist') {
      toast.error('Seuls les touristes peuvent envoyer une demande chauffeur.');
      return;
    }

    if (!driver) {
      toast.error('Chauffeur introuvable.');
      return;
    }

    const matchedCity = cities.find((item) => item.name === (driver.city || city));
    if (!matchedCity) {
      toast.error('Ville du chauffeur introuvable.');
      return;
    }

    setIsSubmitting(true);

    try {
      await createDriverRequest(
        {
          driver_id: driver.id,
          city_id: matchedCity.id,
          pickup_location: form.pickupLocation,
          destination: form.destination || undefined,
          travel_date: form.date || undefined,
          notes: form.notes || undefined,
        },
        authToken,
      );

      toast.success(`Demande envoyee a ${driver.name}.`);
      navigate('/transport');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Impossible d'envoyer la demande.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="size-full flex items-center justify-center bg-white/75 p-6 backdrop-blur-sm">
        <div className="text-center text-gray-600">Chargement du chauffeur...</div>
      </div>
    );
  }

  if (!driver) {
    return (
      <div className="size-full flex items-center justify-center bg-white/75 p-6 backdrop-blur-sm">
        <div className="text-center">
          <p className="text-lg font-semibold text-gray-900">Chauffeur introuvable</p>
          <Button onClick={() => navigate('/transport')} className="mt-4 bg-[#0D9488] hover:bg-[#0D9488]/90">
            Retour au transport
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="size-full flex flex-col bg-white/70 pb-16 backdrop-blur-sm">
      <div className="bg-[#0D9488] px-6 py-6 text-white">
        <button onClick={() => navigate(-1)} className="mb-4 flex items-center gap-2 text-sm text-white/90 hover:text-white">
          <ArrowLeft className="h-4 w-4" />
          Retour
        </button>

        <h1 className="mb-2 text-2xl font-bold">Reserver un chauffeur</h1>
        <p className="text-sm text-white/80">Envoyez une vraie demande au chauffeur selectionne.</p>
      </div>

      <div className="flex-1 overflow-auto px-6 py-6">
        <div className="mb-5 rounded-2xl border border-gray-200 bg-white p-4">
          <div className="flex gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#0D9488]/10 text-[#0D9488]">
              <Car className="h-8 w-8" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="font-bold text-gray-900">{driver.name}</h2>
                  <p className="text-sm text-gray-500">{driver.city || city || 'Ville non renseignee'}</p>
                </div>
                <span className="rounded-full bg-emerald-100 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-emerald-700">
                  {driver.verification_status ?? 'verified'}
                </span>
              </div>

              <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <UserRound className="h-4 w-4 text-[#0D9488]" />
                  <span>{driver.vehicle_type || 'Vehicule non renseigne'}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Phone className="h-4 w-4 text-[#0D9488]" />
                  <span>{driver.phone || 'Telephone non renseigne'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Date souhaitee</label>
            <div className="relative">
              <CalendarDays className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                type="date"
                value={form.date}
                onChange={(e) => setForm((current) => ({ ...current, date: e.target.value }))}
                className="h-11 rounded-xl pl-10"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Point de depart</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                value={form.pickupLocation}
                onChange={(e) => setForm((current) => ({ ...current, pickupLocation: e.target.value }))}
                placeholder="Votre lieu de prise en charge"
                className="h-11 rounded-xl pl-10"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Destination</label>
            <Input
              value={form.destination}
              onChange={(e) => setForm((current) => ({ ...current, destination: e.target.value }))}
              placeholder="Ou souhaitez-vous aller ?"
              className="h-11 rounded-xl"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Notes</label>
            <Textarea
              value={form.notes}
              onChange={(e) => setForm((current) => ({ ...current, notes: e.target.value }))}
              placeholder="Nombre de passagers, bagages, heure souhaitee, etc."
              className="min-h-28 rounded-xl"
            />
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="h-12 w-full rounded-xl bg-[#0D9488] hover:bg-[#0D9488]/90"
          >
            {isSubmitting ? 'Envoi en cours...' : 'Envoyer la demande'}
            <Send className="ml-2 h-4 w-4" />
          </Button>
        </form>
      </div>

      <BottomNav />
    </div>
  );
}
