import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { Calendar, ChevronRight, Clock, MapPin, Plus, Users, ArrowRight, Share2, Heart, Sparkles } from 'lucide-react';
import BottomNav from '../components/BottomNav';
import { Button } from '../components/ui/button';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { groupActivities } from '../data/mockData';
import { useAppContext } from '../context/AppContext';

const reveal = {
  initial: { opacity: 0, y: 15 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
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
    <div className="min-h-screen w-full bg-background flex flex-col pb-32 font-sans antialiased text-foreground overflow-x-hidden transition-colors duration-500">
      {/* Ambient Background */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-[20%] right-0 w-[40%] h-[40%] rounded-full bg-purple-500/[0.05] blur-[120px]" />
        <div className="absolute bottom-[10%] left-0 w-[50%] h-[50%] rounded-full bg-blue-500/[0.05] blur-[100px]" />
      </div>

      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-2xl border-b border-border px-6 py-8">
        <div className="max-w-xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black tracking-widest uppercase bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent italic">Community</h1>
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mt-2 flex items-center gap-2">
              <span className="h-1 w-4 bg-accent rounded-full" />
              {exploreMode === 'city' && city ? `Collaborative experiences in ${city}` : 'Global traveler interactions'}
            </p>
          </div>
          <motion.button 
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleSensitiveAction}
            className="h-12 w-12 flex items-center justify-center rounded-2xl bg-foreground text-background shadow-xl shadow-foreground/5 transition-all outline-none"
          >
            <Plus className="h-6 w-6" />
          </motion.button>
        </div>

        <div className="max-w-xl mx-auto mt-8">
          <div className="flex p-1.5 rounded-2xl bg-secondary border border-border w-fit backdrop-blur-xl">
            {(['all', 'my-activities'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`rounded-xl px-6 py-2 text-[10px] font-black uppercase tracking-widest transition-all ${
                  activeTab === tab ? 'bg-foreground text-background shadow-lg' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {tab === 'all' ? 'Discover' : 'My Hub'}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-xl mx-auto w-full px-6 py-10">
        <AnimatePresence mode="wait">
          {activeTab === 'all' ? (
            <motion.div 
              key="all"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-10"
            >
              <div className="flex items-center justify-between px-1">
                 <p className="text-[10px] font-black uppercase tracking-[0.25em] text-muted-foreground flex items-center gap-2">
                   <Sparkles className="h-3 w-3 text-purple-500 animate-pulse" />
                   Active Gatherings
                 </p>
                 <span className="text-[10px] font-black text-muted-foreground/60 uppercase tracking-widest">{visibleActivities.length} available</span>
              </div>

              {visibleActivities.map((activity, idx) => (
                <motion.div
                   key={activity.id}
                   {...reveal}
                   transition={{ delay: idx * 0.1 }}
                   onClick={() => navigate(`/community/activity/${activity.id}`, { state: { activity } })}
                   className="group relative rounded-[2.5rem] border border-border bg-card overflow-hidden shadow-2xl transition-all cursor-pointer"
                >
                  <div className="relative aspect-[16/9] bg-muted">
                    <ImageWithFallback src={activity.image} alt={activity.title} className="h-full w-full object-cover opacity-60 group-hover:opacity-100 transition-all duration-700 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                    <div className="absolute top-6 right-6 rounded-2xl bg-foreground/10 backdrop-blur-lg px-4 py-1.5 text-[9px] font-black text-foreground border border-foreground/10 shadow-xl uppercase tracking-widest">
                      {activity.participants}/{activity.maxParticipants} slots
                    </div>
                  </div>

                  <div className="p-8">
                    <div className="mb-8 flex items-center gap-4">
                      <div className="h-12 w-12 p-0.5 rounded-2xl border border-border bg-secondary flex-shrink-0">
                         <img src={activity.organizerImage} alt={activity.organizer} className="h-full w-full rounded-xl object-cover" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.2em]">Curated by</p>
                        <p className="text-[14px] font-black text-foreground truncate uppercase">{activity.organizer}</p>
                      </div>
                    </div>

                    <h3 className="text-2xl font-black text-foreground leading-tight mb-3 group-hover:text-accent transition-colors uppercase tracking-tight italic underline decoration-accent decoration-2">{activity.title}</h3>
                    <p className="text-[13px] text-muted-foreground font-medium leading-relaxed mb-8 line-clamp-2">{activity.description}</p>

                    <div className="grid grid-cols-2 gap-y-5 gap-x-4 pb-8 mb-8 border-b border-border">
                      <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                        <MapPin className="h-4 w-4 text-accent" />
                        <span>{activity.city}</span>
                      </div>
                      <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                        <Calendar className="h-4 w-4 text-accent" />
                        <span>{activity.date}</span>
                      </div>
                      <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                        <Clock className="h-4 w-4 text-accent" />
                        <span>{activity.time}</span>
                      </div>
                      <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                        <Users className="h-4 w-4 text-accent" />
                        <span>{activity.level}</span>
                      </div>
                    </div>

                    <button 
                      onClick={handleJoinActivity} 
                      className="h-14 w-full rounded-2xl bg-foreground text-background text-[11px] font-black uppercase tracking-widest transition-all hover:bg-accent hover:text-white active:scale-95 flex items-center justify-center gap-3 shadow-xl shadow-foreground/10 outline-none"
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
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center py-32 text-center"
            >
              <div className="mb-8 flex h-24 w-24 items-center justify-center rounded-[2.5rem] bg-secondary border border-border text-muted-foreground shadow-2xl">
                <Users className="h-10 w-10" />
              </div>
              <h3 className="text-xl font-black text-foreground mb-3 uppercase tracking-widest italic font-sans">Archives empty</h3>
              <p className="mb-10 max-w-[280px] text-[13px] font-medium text-muted-foreground leading-relaxed">
                Connect with active threads or initiate a personalized group experience.
              </p>
              <button 
                onClick={handleSensitiveAction} 
                className="h-14 px-10 rounded-2xl bg-foreground text-background text-[11px] font-black uppercase tracking-widest shadow-xl shadow-foreground/5 hover:bg-accent hover:text-white transition-all outline-none"
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
