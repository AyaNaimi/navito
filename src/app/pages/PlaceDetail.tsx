import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Clock, MapPin, Share2, Star } from 'lucide-react';
import { motion } from 'motion/react';
import BottomNav from '../components/BottomNav';
import { Button } from '../components/ui/button';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { fetchPlace, type ApiPlace } from '../services/api';
import { toast } from 'sonner';

export default function PlaceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [place, setPlace] = useState<ApiPlace | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const placeId = Number(id);
    if (!placeId) {
      setIsLoading(false);
      return;
    }

    fetchPlace(placeId)
      .then((response) => setPlace(response.data ?? null))
      .catch((error) => {
        toast.error(error instanceof Error ? error.message : 'Impossible de charger ce lieu.');
        setPlace(null);
      })
      .finally(() => setIsLoading(false));
  }, [id]);

  const imageSrc = useMemo(
    () => `https://images.unsplash.com/photo-1526772662000-3f88f10405ff?auto=format&fit=crop&q=80&w=1200&sig=${id ?? 'place'}`,
    [id],
  );

  if (isLoading) {
    return <div className="size-full flex items-center justify-center"><p>Chargement...</p></div>;
  }

  if (!place) {
    return <div className="size-full flex items-center justify-center"><p>Lieu non trouve</p></div>;
  }

  return (
    <div className="size-full bg-gray-50 with-bottom-nav">
      <div className="mx-auto w-full max-w-6xl px-5 py-5">
        <div className="mb-4 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour
          </button>

          <button className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm hover:bg-gray-50">
            <Share2 className="h-5 w-5 text-gray-700" />
          </button>
        </div>

        <div className="grid gap-6 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <div className="overflow-hidden rounded-3xl bg-white shadow-sm">
              <div className="relative aspect-[4/3]">
                <ImageWithFallback src={imageSrc} alt={place.name} className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/35 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <h1 className="text-2xl font-bold text-white leading-tight">{place.name}</h1>
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    {place.rating != null ? (
                      <div className="flex items-center gap-1 rounded-full bg-white/20 px-3 py-1 text-white backdrop-blur-sm">
                        <Star className="h-4 w-4 text-yellow-300 fill-yellow-300" />
                        <span className="text-sm font-semibold">{Number(place.rating).toFixed(1)}</span>
                      </div>
                    ) : null}
                    <div className="flex items-center gap-1 rounded-full bg-white/20 px-3 py-1 text-white backdrop-blur-sm">
                      <MapPin className="h-4 w-4" />
                      <span className="text-sm">{place.city?.name ?? 'Ville inconnue'}</span>
                    </div>
                    <div className="rounded-full bg-white/20 px-3 py-1 text-sm text-white backdrop-blur-sm">
                      {place.category}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4 lg:col-span-3">
            <div className="rounded-3xl bg-white p-6 shadow-sm">
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <div className="rounded-2xl border border-gray-100 p-4">
                  <p className="text-xs text-gray-500">Adresse</p>
                  <p className="mt-1 line-clamp-2 font-semibold text-gray-900">{place.address ?? 'N/A'}</p>
                </div>
                <div className="rounded-2xl border border-gray-100 p-4">
                  <p className="text-xs text-gray-500">Horaires</p>
                  <p className="mt-1 font-semibold text-gray-900">{place.opening_hours ?? 'Non renseignes'}</p>
                </div>
                <div className="rounded-2xl border border-gray-100 p-4">
                  <p className="text-xs text-gray-500">Prix entree</p>
                  <p className="mt-1 font-semibold text-gray-900">
                    {place.entry_price_min != null
                      ? `${place.entry_price_min}${place.entry_price_max != null ? `-${place.entry_price_max}` : ''} MAD`
                      : 'Gratuit'}
                  </p>
                </div>
                <div className="rounded-2xl border border-gray-100 p-4">
                  <p className="text-xs text-gray-500">Statut</p>
                  <p className="mt-1 font-semibold text-gray-900">{place.is_published ? 'Publie' : 'Brouillon'}</p>
                </div>
              </div>
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-sm">
              <h2 className="mb-3 text-base font-bold text-gray-900">Description</h2>
              <p className="text-sm leading-relaxed text-gray-600">{place.description ?? 'Description indisponible.'}</p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <Button
                variant="outline"
                className="h-12 rounded-2xl border-gray-200 hover:border-[#0D9488] hover:text-[#0D9488]"
                asChild
              >
                <a
                  href={place.latitude != null && place.longitude != null ? `https://www.google.com/maps/search/?api=1&query=${place.latitude},${place.longitude}` : undefined}
                  target="_blank"
                  rel="noreferrer"
                  onClick={(event) => place.latitude == null || place.longitude == null ? event.preventDefault() : undefined}
                >
                  <MapPin className="mr-2 h-5 w-5" />
                  Itineraire
                </a>
              </Button>

              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="h-12 rounded-2xl bg-gradient-to-r from-[#0D9488] to-teal-500 px-4 text-white shadow-lg shadow-teal-500/20 flex items-center justify-center font-semibold"
              >
                <Clock className="mr-2 h-5 w-5" />
                Visiter
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}

