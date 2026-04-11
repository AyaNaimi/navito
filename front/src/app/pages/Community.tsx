import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { Calendar, ChevronRight, Clock, MapPin, Plus, Users, ArrowRight, Share2, Heart } from 'lucide-react';
import BottomNav from '../components/BottomNav';
import { Button } from '../components/ui/button';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { groupActivities } from '../data/mockData';
import { useAppContext } from '../context/AppContext';

const reveal = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: [0.23, 1, 0.32, 1] },
};

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
    <div className="min-h-screen w-full bg-[#FAFAFA] flex flex-col pb-24 font-['Inter',sans-serif] antialiased selection:bg-black selection:text-white">
      {/* Header Section */}
      <motion.header
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="sticky top-0 z-50 border-b border-[#F0F0F0] bg-white/80 backdrop-blur-xl"
      >
        <div className="px-6 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-[22px] font-bold tracking-tight text-[#171717]">Community</h1>
            <p className="text-[10px] font-bold text-[#737373] uppercase tracking-widest mt-1">
              {exploreMode === 'city' && city ? `Collaborative experiences in ${city}` : 'Global traveler interactions'}
            </p>
          </div>
          <button 
            onClick={handleSensitiveAction}
            className="h-10 w-10 flex items-center justify-center rounded-full bg-[#171717] text-white shadow-lg shadow-black/10 transition-all active:scale-95"
          >
            <Plus className="h-5 w-5" />
          </button>
        </div>

        <div className="px-6 pb-5">
          <div className="flex p-1 rounded-full bg-[#F5F5F7] border border-[#E5E5E5] w-fit">
            <button
              onClick={() => setActiveTab('all')}
              className={`rounded-full px-4 py-1.5 text-[11px] font-bold uppercase tracking-wider transition-all ${
                activeTab === 'all' ? 'bg-white text-[#171717] shadow-sm' : 'text-[#A3A3A3] hover:text-[#737373]'
              }`}
            >
              Discover
            </button>
            <button
              onClick={() => setActiveTab('my-activities')}
              className={`rounded-full px-4 py-1.5 text-[11px] font-bold uppercase tracking-wider transition-all ${
                activeTab === 'my-activities' ? 'bg-white text-[#171717] shadow-sm' : 'text-[#A3A3A3] hover:text-[#737373]'
              }`}
            >
              My Hub
            </button>
          </div>
        </div>
      </motion.header>

      <main className="flex-1 overflow-auto px-6 py-8 max-w-xl mx-auto w-full">
        <AnimatePresence mode="wait">
          {activeTab === 'all' ? (
            <motion.div 
              key="all"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="space-y-8"
            >
              <div className="flex items-center justify-between px-1">
                 <p className="text-[10px] font-bold uppercase tracking-widest text-[#737373]">Active Gatherings</p>
                 <span className="text-[10px] font-bold text-[#171717]">{visibleActivities.length} available</span>
              </div>

              {visibleActivities.map((activity, idx) => (
                <motion.div 
                  key={activity.id} 
                  {...reveal}
                  transition={{ delay: idx * 0.05 }}
                  className="group cursor-pointer rounded-2xl border border-[#E5E5E5] bg-white shadow-sm hover:shadow-md transition-all overflow-hidden"
                >
                  <div className="relative aspect-[16/8] bg-[#F5F5F7]">
                    <ImageWithFallback src={activity.image} alt={activity.title} className="h-full w-full object-cover grayscale-[10%] group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105" />
                    <div className="absolute top-4 right-4 rounded-full bg-white/90 backdrop-blur-md px-3 py-1 text-[9px] font-bold text-[#171717] border border-white/20 shadow-sm uppercase tracking-widest">
                      {activity.participants}/{activity.maxParticipants} slots
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="mb-6 flex items-center gap-3">
                      <div className="h-10 w-10 p-0.5 rounded-full border border-[#E5E5E5] bg-[#F5F5F7]">
                         <img src={activity.organizerImage} alt={activity.organizer} className="h-full w-full rounded-full object-cover" />
                      </div>
                      <div>
                        <p className="text-[9px] font-bold text-[#A3A3A3] uppercase tracking-widest">Curated by</p>
                        <p className="text-[13px] font-bold text-[#171717]">{activity.organizer}</p>
                      </div>
                    </div>

                    <h3 className="text-[18px] font-bold text-[#171717] leading-tight mb-2">{activity.title}</h3>
                    <p className="text-[12px] text-[#737373] font-medium leading-relaxed mb-6 line-clamp-2">{activity.description}</p>

                    <div className="mb-8 grid grid-cols-2 gap-y-4 gap-x-2 pt-5 border-t border-[#F5F5F7]">
                      <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-[#737373]">
                        <MapPin className="h-3.5 w-3.5" />
                        <span>{activity.city}</span>
                      </div>
                      <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-[#737373]">
                        <Calendar className="h-3.5 w-3.5" />
                        <span>{new Date(activity.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-[#737373]">
                        <Clock className="h-3.5 w-3.5" />
                        <span>{activity.time}</span>
                      </div>
                      <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-[#737373]">
                        <Users className="h-3.5 w-3.5" />
                        <span>{activity.level}</span>
                      </div>
                    </div>

                    <button 
                      onClick={handleJoinActivity} 
                      className="h-12 w-full rounded-full bg-[#171717] text-white text-[11px] font-bold uppercase tracking-widest transition-all hover:opacity-90 active:scale-95 flex items-center justify-center gap-2"
                    >
                      Express Interest <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div 
              key="my"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center py-20 text-center"
            >
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-3xl bg-[#F5F5F7] border border-[#E5E5E5] text-[#A3A3A3]">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="text-[17px] font-bold text-[#171717] mb-2 tracking-tight">Archives empty</h3>
              <p className="mb-8 max-w-[200px] text-[12px] font-medium text-[#737373] leading-relaxed">
                Connect with active threads or initiate a personalized group experience.
              </p>
              <button 
                onClick={handleSensitiveAction} 
                className="h-11 px-8 rounded-full bg-[#171717] text-white text-[11px] font-bold uppercase tracking-widest"
              >
                Launch Activity
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <BottomNav />
    </div>
  );
}
