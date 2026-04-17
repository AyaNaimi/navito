import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Calendar, ChevronRight, Clock, MapPin, Plus, Users, X } from 'lucide-react';
import BottomNav from '../components/BottomNav';
import { Button } from '../components/ui/button';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { useAppContext } from '../context/AppContext';
import { createCommunityEvent, fetchCities, fetchCommunityEvents, fetchMyProfile, type ApiCity, type ApiCommunityEvent } from '../services/api';

const COMMUNITY_EVENT_IMAGES_KEY = 'navito-community-event-images';
const COMMUNITY_EVENT_JOINS_KEY = 'navito-community-event-joins';

function readImageStore(): Record<string, string> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = window.localStorage.getItem(COMMUNITY_EVENT_IMAGES_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== 'object') return {};
    return parsed as Record<string, string>;
  } catch {
    return {};
  }
}

function writeImageStore(next: Record<string, string>) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(COMMUNITY_EVENT_IMAGES_KEY, JSON.stringify(next));
}

function readJoinStore(): Record<string, number[]> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = window.localStorage.getItem(COMMUNITY_EVENT_JOINS_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== 'object') return {};
    return parsed as Record<string, number[]>;
  } catch {
    return {};
  }
}

function writeJoinStore(next: Record<string, number[]>) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(COMMUNITY_EVENT_JOINS_KEY, JSON.stringify(next));
}

async function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Lecture de fichier impossible.'));
    reader.onload = () => resolve(String(reader.result));
    reader.readAsDataURL(file);
  });
}

export default function Community() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'all' | 'my-activities'>('all');
  const [activities, setActivities] = useState<ApiCommunityEvent[]>([]);
  const [cities, setCities] = useState<ApiCity[]>([]);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [imageStore, setImageStore] = useState<Record<string, string>>(() => readImageStore());
  const [joinStore, setJoinStore] = useState<Record<string, number[]>>(() => readJoinStore());
  const [selectedPhotoDataUrl, setSelectedPhotoDataUrl] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    city_id: '',
    meetup_point: '',
    starts_at: '',
    ends_at: '',
    level: 'beginner' as 'beginner' | 'intermediate' | 'sporty',
    max_participants: '10',
  });
  const { authMode, authToken, city, exploreMode, userEmail } = useAppContext();

  useEffect(() => {
    Promise.all([fetchCommunityEvents(), fetchCities()])
      .then(([eventsResponse, citiesResponse]) => {
        setActivities(eventsResponse.data ?? []);
        setCities(citiesResponse.data ?? []);
      })
      .catch((error) => {
        toast.error(error instanceof Error ? error.message : 'Impossible de charger la communaute.');
      });
  }, []);

  useEffect(() => {
    if (!authToken) return;

    fetchMyProfile(authToken)
      .then((response) => {
        if (response.data?.id) {
          setCurrentUserId(response.data.id);
        }
      })
      .catch(() => {
        setCurrentUserId(null);
      });
  }, [authToken]);

  const handleSensitiveAction = () => {
    if (authMode !== 'login') {
      navigate('/login?redirectTo=/apply/activity');
      return;
    }
    setShowCreateForm(true);
  };

  const handlePhotoChange = async (file: File | null) => {
    if (!file) {
      setSelectedPhotoDataUrl(null);
      return;
    }
    if (!file.type.startsWith('image/')) {
      toast.error('Veuillez choisir une image.');
      return;
    }
    if (file.size > 2_500_000) {
      toast.error('Image trop lourde (max 2.5MB).');
      return;
    }
    try {
      const dataUrl = await fileToDataUrl(file);
      setSelectedPhotoDataUrl(dataUrl);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Image invalide.');
    }
  };

  const handleJoinActivity = (activity: ApiCommunityEvent) => {
    if (authMode !== 'login') {
      navigate('/login?redirectTo=/community');
      return;
    }
    const key = currentUserId != null ? `id:${currentUserId}` : `email:${userEmail}`;
    if (!key || key === 'email:' || key === 'email:undefined') {
      toast.error('Session invalide. Reconnectez-vous.');
      return;
    }

    const currentJoined = new Set(joinStore[key] ?? []);
    if (currentJoined.has(activity.id)) {
      toast.message('Vous avez deja rejoint cette activite.');
      setActiveTab('my-activities');
      return;
    }

    currentJoined.add(activity.id);
    const next = { ...joinStore, [key]: Array.from(currentJoined) };
    setJoinStore(next);
    writeJoinStore(next);
    toast.success('Activite ajoutee a Mes activites.');
    setActiveTab('my-activities');
  };

  const visibleActivities = useMemo(() => {
    const base = exploreMode === 'city' && city
      ? activities.filter((item) => item.city?.name === city)
      : activities;

    if (activeTab === 'my-activities') {
      const key = currentUserId != null ? `id:${currentUserId}` : `email:${userEmail}`;
      const joined = new Set((key && joinStore[key]) ?? []);
      return base.filter((item) => joined.has(item.id));
    }

    return base;
  }, [activeTab, activities, city, currentUserId, exploreMode, joinStore, userEmail]);

  const refreshEvents = async () => {
    const response = await fetchCommunityEvents();
    setActivities(response.data ?? []);
  };

  const handleCreateEvent = async () => {
    if (!authToken) {
      navigate('/login?redirectTo=/community');
      return;
    }

    try {
      const response = await createCommunityEvent({
        city_id: Number(formData.city_id),
        title: formData.title,
        description: formData.description,
        meetup_point: formData.meetup_point || undefined,
        starts_at: new Date(formData.starts_at).toISOString(),
        ends_at: formData.ends_at ? new Date(formData.ends_at).toISOString() : undefined,
        level: formData.level,
        max_participants: Number(formData.max_participants),
      }, authToken);

      toast.success('Activite communautaire creee.');

      if (selectedPhotoDataUrl && response.data?.id != null) {
        const next = { ...imageStore, [String(response.data.id)]: selectedPhotoDataUrl };
        setImageStore(next);
        writeImageStore(next);
      }

      setShowCreateForm(false);
      setSelectedPhotoDataUrl(null);
      setFormData({
        title: '',
        description: '',
        city_id: '',
        meetup_point: '',
        starts_at: '',
        ends_at: '',
        level: 'beginner',
        max_participants: '10',
      });
      await refreshEvents();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Creation impossible.');
    }
  };

  return (
    <div className="size-full bg-white/65 backdrop-blur-sm flex flex-col with-bottom-nav">
      <div className="bg-[#0D9488] px-6 py-6 text-white">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h1 className="mb-2 text-2xl font-bold">Community</h1>
            <p className="text-sm text-white/80">
              {exploreMode === 'city' && city ? `Rencontres et activités à ${city}` : 'Meet fellow travelers and join activities'}
            </p>
          </div>
          <Button onClick={handleSensitiveAction} className="h-12 rounded-full bg-white px-5 text-[#0D9488] hover:bg-white/90">
            <Plus className="mr-2 h-5 w-5" />
            Create New Activity
          </Button>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('all')}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === 'all' ? 'bg-white text-[#0D9488]' : 'bg-white/20 text-white hover:bg-white/30'
            }`}
          >
            All Activities
          </button>
          <button
            onClick={() => setActiveTab('my-activities')}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === 'my-activities' ? 'bg-white text-[#0D9488]' : 'bg-white/20 text-white hover:bg-white/30'
            }`}
          >
            My Activities
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto px-6 py-4">
        {showCreateForm && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/40 p-4">
            <div className="flex max-h-[calc(100vh-6rem)] w-full max-w-xl flex-col overflow-hidden rounded-3xl bg-white shadow-xl">
              <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
                <h2 className="text-xl font-bold text-gray-900">Nouvelle activite</h2>
                <button onClick={() => setShowCreateForm(false)} className="rounded-full p-2 hover:bg-gray-100">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-4 overflow-y-auto px-6 py-4">
                <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold text-gray-900">Photo</p>
                      <p className="text-xs text-gray-500">Optionnel. JPG/PNG/WebP, max 2.5MB.</p>
                    </div>
                    {selectedPhotoDataUrl ? (
                      <button
                        onClick={() => setSelectedPhotoDataUrl(null)}
                        className="text-xs font-semibold text-[#0D9488] hover:underline"
                      >
                        Retirer
                      </button>
                    ) : null}
                  </div>
                  <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handlePhotoChange(e.target.files?.[0] ?? null)}
                      className="w-full rounded-xl border bg-white px-3 py-2 text-sm"
                    />
                    <div className="h-24 overflow-hidden rounded-xl border bg-white">
                      {selectedPhotoDataUrl ? (
                        <img src={selectedPhotoDataUrl} alt="Preview" className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full items-center justify-center text-xs text-gray-400">Apercu</div>
                      )}
                    </div>
                  </div>
                </div>
                <input className="w-full rounded-2xl border px-4 py-3" placeholder="Titre" value={formData.title} onChange={(e) => setFormData((current) => ({ ...current, title: e.target.value }))} />
                <textarea className="w-full rounded-2xl border px-4 py-3" placeholder="Description" rows={4} value={formData.description} onChange={(e) => setFormData((current) => ({ ...current, description: e.target.value }))} />
                <select className="w-full rounded-2xl border px-4 py-3" value={formData.city_id} onChange={(e) => setFormData((current) => ({ ...current, city_id: e.target.value }))}>
                  <option value="">Choisir une ville</option>
                  {cities.map((option) => <option key={option.id} value={option.id}>{option.name}</option>)}
                </select>
                <input className="w-full rounded-2xl border px-4 py-3" placeholder="Point de rencontre" value={formData.meetup_point} onChange={(e) => setFormData((current) => ({ ...current, meetup_point: e.target.value }))} />
                <input className="w-full rounded-2xl border px-4 py-3" type="datetime-local" value={formData.starts_at} onChange={(e) => setFormData((current) => ({ ...current, starts_at: e.target.value }))} />
                <input className="w-full rounded-2xl border px-4 py-3" type="datetime-local" value={formData.ends_at} onChange={(e) => setFormData((current) => ({ ...current, ends_at: e.target.value }))} />
                <div className="grid grid-cols-2 gap-4">
                  <select className="w-full rounded-2xl border px-4 py-3" value={formData.level} onChange={(e) => setFormData((current) => ({ ...current, level: e.target.value as 'beginner' | 'intermediate' | 'sporty' }))}>
                    <option value="beginner">Debutant</option>
                    <option value="intermediate">Intermediaire</option>
                    <option value="sporty">Sportif</option>
                  </select>
                  <input className="w-full rounded-2xl border px-4 py-3" type="number" min="1" value={formData.max_participants} onChange={(e) => setFormData((current) => ({ ...current, max_participants: e.target.value }))} />
                </div>
              </div>

              <div className="sticky bottom-0 border-t border-gray-100 bg-white px-6 py-4 shadow-[0_-8px_24px_rgba(15,23,42,0.06)]">
                <Button
                  onClick={handleCreateEvent}
                  disabled={!formData.title || !formData.description || !formData.city_id || !formData.starts_at}
                  className="h-12 w-full rounded-2xl bg-[#0D9488] hover:bg-[#0D9488]/90"
                >
                  Creer l activite
                </Button>
              </div>
            </div>
          </div>
        )}

        {visibleActivities.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {visibleActivities.map((activity) => (
              <div key={activity.id} className="cursor-pointer overflow-hidden rounded-2xl border border-gray-200 bg-white transition-colors hover:border-[#0D9488]">
                <div className="relative h-52 w-full overflow-hidden bg-gray-100 sm:h-56">
                  <ImageWithFallback
                    src={imageStore[String(activity.id)] ?? `https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&q=80&w=1200&sig=${activity.id}`}
                    alt={activity.title}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute right-3 top-3 rounded-full bg-white/90 px-3 py-1 text-sm font-bold text-gray-900 backdrop-blur-sm">
                    {activity.participants?.length ?? 0}/{activity.max_participants ?? 0} joined
                  </div>
                  <div className="absolute left-3 top-3 rounded-full bg-black/50 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
                    {activity.level ?? 'beginner'}
                  </div>
                </div>

                <div className="p-4">
                  <div className="mb-3 flex items-center gap-2">
                    <img src={`https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(activity.organizer?.name ?? 'Navito')}`} alt={activity.organizer?.name ?? 'Organizer'} className="h-8 w-8 rounded-full object-cover" />
                    <div>
                      <p className="text-xs text-gray-600">Organized by</p>
                      <p className="text-sm font-semibold text-gray-900">{activity.organizer?.name ?? 'Navito'}</p>
                    </div>
                  </div>

                  <h3 className="mb-2 text-lg font-bold text-gray-900">{activity.title}</h3>
                  <p className="mb-4 line-clamp-2 text-sm text-gray-600">{activity.description}</p>

                  <div className="mb-4 grid grid-cols-2 gap-3">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="h-4 w-4 text-[#0D9488]" />
                      <span>{activity.city?.name ?? 'Ville inconnue'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="h-4 w-4 text-[#0D9488]" />
                      <span>{new Date(activity.starts_at).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock className="h-4 w-4 text-[#0D9488]" />
                      <span>{new Date(activity.starts_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Users className="h-4 w-4 text-[#0D9488]" />
                      <span>{activity.max_participants ?? 0} max</span>
                    </div>
                  </div>

                  {activity.meetup_point ? (
                    <div className="mb-4 rounded-xl bg-gray-50 px-3 py-2 text-xs text-gray-700">
                      <span className="font-semibold">Meetup</span>: {activity.meetup_point}
                    </div>
                  ) : null}

                  {(() => {
                    const key = currentUserId != null ? `id:${currentUserId}` : `email:${userEmail}`;
                    const joined = new Set((key && joinStore[key]) ?? []);
                    const isJoined = joined.has(activity.id);
                    return (
                      <Button
                        onClick={() => handleJoinActivity(activity)}
                        variant={isJoined ? 'outline' : 'default'}
                        className={`h-12 w-full rounded-xl ${
                          isJoined
                            ? 'border-2 border-[#0D9488] text-[#0D9488] hover:bg-[#0D9488]/5'
                            : 'bg-[#0D9488] hover:bg-[#0D9488]/90'
                        }`}
                      >
                        {isJoined ? 'Joined' : 'Join Activity'}
                        <ChevronRight className="ml-2 h-5 w-5" />
                      </Button>
                    );
                  })()}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gray-100">
              <Users className="h-10 w-10 text-gray-400" />
            </div>
            <h3 className="mb-2 text-lg font-bold text-gray-900">No Activities Yet</h3>
            <p className="mb-6 max-w-sm text-center text-gray-600">Join or create activities to connect with fellow travelers.</p>
            <Button onClick={handleSensitiveAction} className="bg-[#0D9488] hover:bg-[#0D9488]/90">
              Create Activity
            </Button>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
