import { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Star, Phone, Heart, Share2, DollarSign, MessageCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { Button } from '../components/ui/button';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import BottomNav from '../components/BottomNav';
import { useAppContext } from '../context/AppContext';
import { createConversation, fetchRestaurant, type ApiRestaurant } from '../services/api';
import { toast } from 'sonner';

export default function RestaurantDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { authMode, authToken, userRole } = useAppContext();
  const [restaurant, setRestaurant] = useState<ApiRestaurant | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const restaurantId = Number(id);
    if (!restaurantId) {
      setIsLoading(false);
      return;
    }

    fetchRestaurant(restaurantId)
      .then((response) => setRestaurant(response.data ?? null))
      .catch((error) => {
        toast.error(error instanceof Error ? error.message : 'Impossible de charger ce restaurant.');
        setRestaurant(null);
      })
      .finally(() => setIsLoading(false));
  }, [id]);

  const restaurantImage = useMemo(
    () => `https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=1200&sig=${id ?? 'restaurant'}`,
    [id],
  );

  if (isLoading) {
    return <div className="size-full flex items-center justify-center"><p>Chargement...</p></div>;
  }

  if (!restaurant) {
    return <div className="size-full flex items-center justify-center"><p>Restaurant non trouve</p></div>;
  }

  const handleMessageGuide = async () => {
    if (authMode !== 'login' || !authToken) {
      navigate('/login?redirectTo=/messages');
      return;
    }
    try {
      const guideId = 1;
      const response = await createConversation({ participant_ids: [guideId] }, authToken);
      if (response.data) {
        navigate('/messages', { state: { conversationId: response.data.id } });
        toast.success('Conversation ouverte');
      }
    } catch {
      toast.error('Erreur lors de la creation');
    }
  };

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

          <div className="flex gap-2">
            <button className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm hover:bg-gray-50">
              <Heart className="h-5 w-5 text-gray-700" />
            </button>
            <button className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm hover:bg-gray-50">
              <Share2 className="h-5 w-5 text-gray-700" />
            </button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <div className="overflow-hidden rounded-3xl bg-white shadow-sm">
              <div className="relative aspect-[4/3]">
                <ImageWithFallback src={restaurantImage} alt={restaurant.name} className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/35 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <h1 className="text-2xl font-bold text-white leading-tight">{restaurant.name}</h1>
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <div className="flex items-center gap-1 rounded-full bg-white/20 px-3 py-1 text-white backdrop-blur-sm">
                      <Star className="h-4 w-4 text-yellow-300 fill-yellow-300" />
                      <span className="text-sm font-semibold">{restaurant.rating ?? 'N/A'}</span>
                    </div>
                    <div className="flex items-center gap-1 rounded-full bg-white/20 px-3 py-1 text-white backdrop-blur-sm">
                      <MapPin className="h-4 w-4" />
                      <span className="text-sm">{restaurant.city?.name ?? 'Ville inconnue'}</span>
                    </div>
                    {restaurant.is_halal ? (
                      <div className="rounded-full bg-white/20 px-3 py-1 text-sm text-white backdrop-blur-sm">
                        Halal
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4 lg:col-span-3">
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full bg-gray-100 px-3 py-1.5 text-xs font-semibold text-gray-700">
                {restaurant.cuisine ?? 'Cuisine locale'}
              </span>
              {restaurant.is_halal ? (
                <span className="rounded-full bg-green-100 px-3 py-1.5 text-xs font-semibold text-green-700">
                  Halal
                </span>
              ) : null}
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-sm">
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <div className="rounded-2xl border border-gray-100 p-4">
                  <p className="text-xs text-gray-500">Prix moyen</p>
                  <p className="mt-1 font-semibold text-gray-900">{restaurant.average_price ? `${restaurant.average_price} MAD` : 'Sur demande'}</p>
                </div>
                <div className="rounded-2xl border border-gray-100 p-4">
                  <p className="text-xs text-gray-500">Horaires</p>
                  <p className="mt-1 font-semibold text-gray-900">{restaurant.opening_hours ?? 'Non renseignes'}</p>
                </div>
                <div className="rounded-2xl border border-gray-100 p-4">
                  <p className="text-xs text-gray-500">Telephone</p>
                  <p className="mt-1 font-semibold text-gray-900">{restaurant.phone ?? 'N/A'}</p>
                </div>
                <div className="rounded-2xl border border-gray-100 p-4">
                  <p className="text-xs text-gray-500">Adresse</p>
                  <p className="mt-1 line-clamp-2 font-semibold text-gray-900">{restaurant.address ?? 'N/A'}</p>
                </div>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-3xl border border-[#0D9488]/20 bg-gradient-to-br from-[#0D9488]/10 to-teal-50 p-5"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Prix moyen par personne</p>
                  <p className="text-3xl font-bold text-[#0D9488]">{restaurant.average_price ? `${restaurant.average_price} MAD` : 'N/A'}</p>
                </div>
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#0D9488] to-teal-500">
                  <DollarSign className="h-7 w-7 text-white" />
                </div>
              </div>
            </motion.div>

            <div className="rounded-3xl bg-white p-6 shadow-sm">
              <h2 className="mb-3 text-base font-bold text-gray-900">A propos</h2>
              <p className="text-sm leading-relaxed text-gray-600">{restaurant.address ?? restaurant.city?.country?.name ?? 'Description indisponible.'}</p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-3xl border border-yellow-200 bg-gradient-to-br from-yellow-50 to-orange-50 p-5"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-yellow-400 to-orange-500">
                  <Star className="h-6 w-6 text-white fill-white" />
                </div>
                <div>
                  <h3 className="mb-1 font-bold text-gray-900">Informations pratiques</h3>
                  <p className="text-sm leading-relaxed text-gray-700">
                    {restaurant.address ?? 'Adresse indisponible.'}
                  </p>
                </div>
              </div>
            </motion.div>

            {userRole === 'tourist' ? (
              <Button
                onClick={handleMessageGuide}
                variant="outline"
                className="h-12 w-full rounded-2xl border-2 border-[#0D9488] text-[#0D9488] hover:bg-[#0D9488]/5"
              >
                <MessageCircle className="mr-2 h-5 w-5" />
                Contacter un guide
              </Button>
            ) : null}

            <div className="grid gap-3 sm:grid-cols-2">
              <Button
                variant="outline"
                asChild
                className="h-12 rounded-2xl border-gray-200 hover:border-[#0D9488] hover:text-[#0D9488]"
              >
                <a href={restaurant.phone ? `tel:${restaurant.phone}` : undefined} onClick={(event) => !restaurant.phone && event.preventDefault()}>
                  <Phone className="mr-2 h-5 w-5" />
                  {restaurant.phone ? 'Appeler' : 'Pas de numero'}
                </a>
              </Button>
              <Button
                asChild
                className="h-12 rounded-2xl bg-gradient-to-r from-[#0D9488] to-teal-500 hover:from-[#0891B2] hover:to-[#0D9488] shadow-lg shadow-teal-500/20"
              >
                <a
                  href={restaurant.latitude != null && restaurant.longitude != null ? `https://www.google.com/maps/search/?api=1&query=${restaurant.latitude},${restaurant.longitude}` : undefined}
                  target="_blank"
                  rel="noreferrer"
                  onClick={(event) => restaurant.latitude == null || restaurant.longitude == null ? event.preventDefault() : undefined}
                >
                  <MapPin className="mr-2 h-5 w-5" />
                  Itineraire
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
