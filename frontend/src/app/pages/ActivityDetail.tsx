import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Clock3, Loader2, MapPin, MessageCircle, Star, Tag } from 'lucide-react';
import { toast } from 'sonner';
import BottomNav from '../components/BottomNav';
import { Button } from '../components/ui/button';
import { useAppContext } from '../context/AppContext';
import { createConversation, fetchActivity, fetchDirectoryGuides, type ApiActivity, type ApiDirectoryGuide } from '../services/api';

function formatPrice(activity: ApiActivity | null) {
  if (!activity) {
    return '--';
  }

  if (activity.price_min != null && activity.price_max != null) {
    return `${activity.price_min}-${activity.price_max} MAD`;
  }

  if (activity.price_min != null) {
    return `A partir de ${activity.price_min} MAD`;
  }

  if (activity.price_max != null) {
    return `Jusqu'a ${activity.price_max} MAD`;
  }

  return 'Prix sur demande';
}

export default function ActivityDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { authMode, authToken, userRole } = useAppContext();
  const [activity, setActivity] = useState<ApiActivity | null>(null);
  const [guides, setGuides] = useState<ApiDirectoryGuide[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const activityId = Number(id);

    if (!activityId) {
      setLoading(false);
      return;
    }

    const load = async () => {
      setLoading(true);
      try {
        const activityResponse = await fetchActivity(activityId);
        const nextActivity = activityResponse.data ?? null;
        setActivity(nextActivity);

        if (nextActivity?.city?.name) {
          const guidesResponse = await fetchDirectoryGuides(nextActivity.city.name);
          setGuides(guidesResponse.data ?? []);
        } else {
          setGuides([]);
        }
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'Impossible de charger cette activite.');
        setActivity(null);
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, [id]);

  const featuredGuide = useMemo(
    () => guides.find((guide) => guide.verified) ?? guides[0] ?? null,
    [guides],
  );

  const handleMessageGuide = async () => {
    if (!featuredGuide) {
      toast.error('Aucun guide disponible pour cette ville.');
      return;
    }

    if (authMode !== 'login' || !authToken) {
      navigate(`/login?redirectTo=${encodeURIComponent(`/activity/${id}`)}`);
      return;
    }

    try {
      const response = await createConversation({ participant_ids: [featuredGuide.id] }, authToken);
      if (response.data) {
        navigate('/messages', { state: { conversationId: response.data.id } });
        toast.success(`Conversation ouverte avec ${featuredGuide.name}`);
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Erreur lors de la creation de la conversation.');
    }
  };

  if (loading) {
    return (
      <div className="size-full flex items-center justify-center bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-[#0D9488]" />
      </div>
    );
  }

  if (!activity) {
    return (
      <div className="size-full flex items-center justify-center bg-gray-50">
        <div className="rounded-3xl bg-white p-8 text-center shadow-sm">
          <p className="text-lg font-bold text-slate-900">Activite introuvable</p>
          <Button onClick={() => navigate('/home')} className="mt-4 bg-[#0D9488] hover:bg-[#0D9488]/90">
            Retour a l accueil
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="size-full bg-gray-50 flex flex-col pb-16">
      <div className="relative overflow-hidden bg-gradient-to-br from-[#0D9488] via-teal-600 to-cyan-700 px-5 pb-8 pt-6 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.18),transparent_35%)]" />
        <button
          onClick={() => navigate(-1)}
          className="relative mb-8 inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/15 backdrop-blur-sm"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>

        <div className="relative space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em]">
              {activity.is_published ? 'Disponible' : 'Brouillon'}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-3 py-1 text-xs font-bold">
              <Star className="h-3.5 w-3.5 fill-current" />
              {activity.rating ?? 'N/A'}
            </span>
          </div>
          <h1 className="text-3xl font-black leading-tight">{activity.name}</h1>
          <div className="flex flex-wrap gap-4 text-sm text-white/85">
            <span className="inline-flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              {activity.city?.name ?? 'Ville inconnue'}
            </span>
            <span className="inline-flex items-center gap-2">
              <Clock3 className="h-4 w-4" />
              {activity.duration_label || 'Duree libre'}
            </span>
            <span className="inline-flex items-center gap-2">
              <Tag className="h-4 w-4" />
              {formatPrice(activity)}
            </span>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto px-5 py-5">
        <div className="space-y-4">
          <div className="rounded-[28px] bg-white p-5 shadow-sm">
            <h2 className="text-base font-black text-slate-900">Description</h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              {activity.description || 'Aucune description disponible pour cette activite.'}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-[24px] bg-white p-4 shadow-sm">
              <p className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-400">Ville</p>
              <p className="mt-2 text-base font-black text-slate-900">{activity.city?.name ?? 'Non precisee'}</p>
            </div>
            <div className="rounded-[24px] bg-white p-4 shadow-sm">
              <p className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-400">Duree</p>
              <p className="mt-2 text-base font-black text-slate-900">{activity.duration_label || 'Flexible'}</p>
            </div>
            <div className="rounded-[24px] bg-white p-4 shadow-sm">
              <p className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-400">Tarif</p>
              <p className="mt-2 text-base font-black text-slate-900">{formatPrice(activity)}</p>
            </div>
          </div>

          <div className="rounded-[28px] bg-white p-5 shadow-sm">
            <h2 className="text-base font-black text-slate-900">Guide suggere</h2>
            {featuredGuide ? (
              <div className="mt-4 rounded-[22px] bg-slate-50 p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-lg font-black text-slate-900">{featuredGuide.name}</p>
                    <p className="mt-1 text-sm text-slate-500">{featuredGuide.city || activity.city?.name || 'Ville non precisee'}</p>
                    <p className="mt-3 text-sm leading-6 text-slate-600">
                      {featuredGuide.bio || 'Guide local disponible pour accompagner cette activite.'}
                    </p>
                  </div>
                  {featuredGuide.verified ? (
                    <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-emerald-700">
                      Verifie
                    </span>
                  ) : null}
                </div>
              </div>
            ) : (
              <p className="mt-3 text-sm text-slate-500">Aucun guide verifie n est encore disponible pour cette ville.</p>
            )}
          </div>

          {userRole === 'tourist' && featuredGuide ? (
            <Button
              onClick={handleMessageGuide}
              variant="outline"
              className="w-full h-12 rounded-xl border-2 border-[#0D9488] text-[#0D9488] hover:bg-[#0D9488]/5"
            >
              <MessageCircle className="mr-2 h-5 w-5" />
              Contacter le guide
            </Button>
          ) : null}
        </div>
      </div>

      <div className="fixed bottom-16 left-0 right-0 border-t border-gray-100 bg-white p-4 safe-area-bottom">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs text-gray-500">Prix</p>
            <p className="text-xl font-black text-slate-900">{formatPrice(activity)}</p>
          </div>
          <Button
            onClick={() => navigate(`/checkout/activity/${activity.id}`)}
            className="h-12 px-8 bg-gradient-to-r from-[#0D9488] to-teal-500 hover:from-[#0891B2] hover:to-[#0D9488] rounded-xl font-semibold shadow-lg shadow-teal-500/30"
          >
            Reserver
          </Button>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
