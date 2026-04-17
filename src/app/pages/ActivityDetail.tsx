import { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Star, Heart, Share2, Globe, MessageCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { Button } from '../components/ui/button';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import BottomNav from '../components/BottomNav';
import { useAppContext } from '../context/AppContext';
import { createConversation, fetchActivity, type ApiActivity } from '../services/api';
import { toast } from 'sonner';

export default function ActivityDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { authMode, authToken, userRole } = useAppContext();
  const [activity, setActivity] = useState<ApiActivity | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const activityId = Number(id);
    if (!activityId) {
      setIsLoading(false);
      return;
    }

    fetchActivity(activityId)
      .then((response) => setActivity(response.data ?? null))
      .catch((error) => {
        toast.error(error instanceof Error ? error.message : 'Impossible de charger cette activite.');
        setActivity(null);
      })
      .finally(() => setIsLoading(false));
  }, [id]);

  const imageSrc = useMemo(
    () => `https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&q=80&w=1200&sig=${id ?? 'activity'}`,
    [id],
  );

  if (isLoading) {
    return <div className="size-full flex items-center justify-center"><p>Chargement...</p></div>;
  }

  if (!activity) {
    return <div className="size-full flex items-center justify-center"><p>Activite non trouvee</p></div>;
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
                <ImageWithFallback src={imageSrc} alt={activity.name} className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/35 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <h1 className="text-2xl font-bold text-white leading-tight">{activity.name}</h1>
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <div className="flex items-center gap-1 rounded-full bg-white/20 px-3 py-1 text-white backdrop-blur-sm">
                      <Star className="h-4 w-4 text-yellow-300 fill-yellow-300" />
                      <span className="text-sm font-semibold">{activity.rating ?? 'N/A'}</span>
                    </div>
                    <div className="flex items-center gap-1 rounded-full bg-white/20 px-3 py-1 text-white backdrop-blur-sm">
                      <MapPin className="h-4 w-4" />
                      <span className="text-sm">{activity.city?.name ?? 'Ville inconnue'}</span>
                    </div>
                    <div className="rounded-full bg-white/20 px-3 py-1 text-sm text-white backdrop-blur-sm">
                      {activity.is_published ? 'Publiee' : 'Brouillon'}
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
                  <p className="text-xs text-gray-500">Duree</p>
                  <p className="mt-1 font-semibold text-gray-900">{activity.duration_label ?? 'Flexible'}</p>
                </div>
                <div className="rounded-2xl border border-gray-100 p-4">
                  <p className="text-xs text-gray-500">Prix min</p>
                  <p className="mt-1 font-semibold text-gray-900">{activity.price_min != null ? `${activity.price_min} MAD` : 'N/A'}</p>
                </div>
                <div className="rounded-2xl border border-gray-100 p-4">
                  <p className="text-xs text-gray-500">Prix max</p>
                  <p className="mt-1 font-semibold text-gray-900">{activity.price_max != null ? `${activity.price_max} MAD` : 'N/A'}</p>
                </div>
                <div className="rounded-2xl border border-gray-100 p-4">
                  <p className="text-xs text-gray-500">Pays</p>
                  <p className="mt-1 font-semibold text-gray-900">{activity.city?.country?.name ?? 'N/A'}</p>
                </div>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-3xl border border-yellow-200 bg-gradient-to-r from-yellow-50 to-orange-50 p-5"
            >
              <div className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-yellow-600" />
                <span className="font-bold text-yellow-800">
                  {activity.is_published ? 'Disponible a la reservation' : 'Bientot disponible'}
                </span>
              </div>
            </motion.div>

            <div className="rounded-3xl bg-white p-6 shadow-sm">
              <h2 className="mb-3 text-base font-bold text-gray-900">Description</h2>
              <p className="text-sm leading-relaxed text-gray-600">{activity.description ?? 'Description indisponible.'}</p>
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-base font-bold text-gray-900">Avis recents</h2>
              <div className="space-y-4">
                {[
                  { name: 'Sarah M.', rating: 5, comment: 'Experience incroyable! Je recommande vivement.' },
                  { name: 'John D.', rating: 4, comment: 'Tres bel endroit. Guide tres competent.' },
                ].map((review, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="border-b border-gray-100 pb-4 last:border-0 last:pb-0"
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#0D9488] to-teal-400">
                          <span className="text-sm font-bold text-white">{review.name.charAt(0)}</span>
                        </div>
                        <span className="font-semibold text-gray-900">{review.name}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        {[...Array(review.rating)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">{review.comment}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            {userRole === 'tourist' && (
              <Button
                onClick={handleMessageGuide}
                variant="outline"
                className="h-12 w-full rounded-2xl border-2 border-[#0D9488] text-[#0D9488] hover:bg-[#0D9488]/5"
              >
                <MessageCircle className="mr-2 h-5 w-5" />
                Contacter un guide
              </Button>
            )}

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-gray-100 bg-white p-4">
                <p className="text-xs text-gray-500">Prix</p>
                <p className="mt-1 text-2xl font-bold text-gray-900">
                  {activity.price_min != null ? `${activity.price_min} MAD` : 'Sur demande'}
                </p>
              </div>
              <Button
                onClick={() => navigate(`/checkout/activity/${activity.id}`)}
                className="h-12 rounded-2xl bg-gradient-to-r from-[#0D9488] to-teal-500 hover:from-[#0891B2] hover:to-[#0D9488] shadow-lg shadow-teal-500/20"
              >
                Reserver
              </Button>
            </div>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
