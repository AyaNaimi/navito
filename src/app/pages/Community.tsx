import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Calendar, ChevronRight, Clock, MapPin, Plus, Users } from 'lucide-react';
import BottomNav from '../components/BottomNav';
import { Button } from '../components/ui/button';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { groupActivities } from '../data/mockData';
import { useAppContext } from '../context/AppContext';

export default function Community() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'all' | 'my-activities'>('all');
  const { authMode, city, exploreMode } = useAppContext();

  const handleSensitiveAction = () => {
    if (authMode !== 'login') {
      navigate('/login?redirectTo=/apply/activity');
      return;
    }
    navigate('/apply/activity');
  };

  const handleJoinActivity = () => {
    if (authMode !== 'login') {
      navigate('/login?redirectTo=/community');
      return;
    }
    toast.success('Activity joined successfully');
  };

  const visibleActivities = useMemo(() => {
    if (exploreMode === 'city' && city) {
      return groupActivities.filter((item) => item.city === city);
    }

    return groupActivities;
  }, [city, exploreMode]);

  return (
    <div className="size-full bg-gray-50 flex flex-col pb-16">
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
        {activeTab === 'all' ? (
          <div className="space-y-4">
            {visibleActivities.map((activity) => (
              <div key={activity.id} className="cursor-pointer overflow-hidden rounded-2xl border border-gray-200 bg-white transition-colors hover:border-[#0D9488]">
                <div className="relative aspect-[16/9]">
                  <ImageWithFallback src={activity.image} alt={activity.title} className="h-full w-full object-cover" />
                  <div className="absolute right-3 top-3 rounded-full bg-white/90 px-3 py-1 text-sm font-bold text-gray-900 backdrop-blur-sm">
                    {activity.participants}/{activity.maxParticipants} joined
                  </div>
                </div>

                <div className="p-4">
                  <div className="mb-3 flex items-center gap-2">
                    <img src={activity.organizerImage} alt={activity.organizer} className="h-8 w-8 rounded-full object-cover" />
                    <div>
                      <p className="text-xs text-gray-600">Organized by</p>
                      <p className="text-sm font-semibold text-gray-900">{activity.organizer}</p>
                    </div>
                  </div>

                  <h3 className="mb-2 text-lg font-bold text-gray-900">{activity.title}</h3>
                  <p className="mb-4 text-sm text-gray-600">{activity.description}</p>

                  <div className="mb-4 grid grid-cols-2 gap-3">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="h-4 w-4 text-[#0D9488]" />
                      <span>{activity.city}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="h-4 w-4 text-[#0D9488]" />
                      <span>{new Date(activity.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock className="h-4 w-4 text-[#0D9488]" />
                      <span>{activity.time} • {activity.duration}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Users className="h-4 w-4 text-[#0D9488]" />
                      <span>{activity.level}</span>
                    </div>
                  </div>

                  <Button onClick={handleJoinActivity} className="h-12 w-full rounded-xl bg-[#0D9488] hover:bg-[#0D9488]/90">
                    Join Activity
                    <ChevronRight className="ml-2 h-5 w-5" />
                  </Button>
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
