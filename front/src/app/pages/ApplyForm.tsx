import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { ArrowLeft, CalendarPlus, Car, Send, UserRound, MapPin, Globe, CreditCard } from 'lucide-react';
import BottomNav from '../components/BottomNav';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { useAppContext } from '../context/AppContext';
import { motion } from 'framer-motion';

const formConfig = {
  activity: {
    title: 'Create Activity',
    subtitle: 'Share an experience with fellow travelers.',
    icon: CalendarPlus,
    accent: 'emerald',
    submitLabel: 'Publish Activity',
    fields: {
      roleLabel: 'Organizer name',
      expertiseLabel: 'Activity title',
      priceLabel: 'Price (optional)',
      availabilityLabel: 'Date and time',
      extraLabel: 'Meeting point',
      noteLabel: 'Description',
    },
  },
  guide: {
    title: 'Join As Guide',
    subtitle: 'Share your local knowledge as a certified guide.',
    icon: UserRound,
    accent: 'slate',
    submitLabel: 'Submit Application',
    fields: {
      roleLabel: 'Full name',
      expertiseLabel: 'Specialty',
      priceLabel: 'Price per half day',
      availabilityLabel: 'Availability',
      extraLabel: 'Languages',
      noteLabel: 'Experience and presentation',
    },
  },
  driver: {
    title: 'Join As Driver',
    subtitle: 'Earn as a reliable driver for visitors.',
    icon: Car,
    accent: 'slate',
    submitLabel: 'Start Registration',
    fields: {
      roleLabel: 'Full name',
      expertiseLabel: 'Vehicle type',
      priceLabel: 'Price per km',
      availabilityLabel: 'Availability',
      extraLabel: 'Languages',
      noteLabel: 'Driving experience and notes',
    },
  },
} as const;

export default function ApplyForm() {
  const navigate = useNavigate();
  const { type } = useParams();
  const { authMode, city, exploreMode, submitDriverRegistration } = useAppContext();
  const [form, setForm] = useState({
    fullName: '',
    city: city || 'Marrakech',
    phone: '',
    email: '',
    expertise: '',
    price: '',
    availability: '',
    extra: '',
    notes: '',
  });

  const config = useMemo(() => {
    if (type === 'activity' || type === 'guide' || type === 'driver') {
      return formConfig[type];
    }
    return formConfig.activity;
  }, [type]);

  const Icon = config.icon;

  useEffect(() => {
    if (authMode !== 'login') {
      navigate(`/login?redirectTo=${encodeURIComponent(`/apply/${type || 'activity'}`)}`, { replace: true });
    }
  }, [authMode, navigate, type]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    if (type === 'driver') {
      submitDriverRegistration({
        fullName: form.fullName,
        phone: form.phone,
        vehicleType: form.expertise,
        city: form.city,
      });
      toast.success('Registration saved. Let\'s verify your identity.');
      navigate('/driver/verify');
      return;
    }

    toast.success(`${config.title} submitted successfully`);
    navigate(type === 'activity' ? '/community' : type === 'guide' ? '/guide' : '/transport');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col pb-20 selection:bg-accent/10 transition-colors duration-500">
      {/* Dynamic Header */}
      <div className="relative overflow-hidden bg-foreground px-6 py-12 text-background transition-colors duration-500">
        <div className="absolute top-0 right-0 size-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        
        <motion.button 
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate(-1)} 
          className="relative mb-8 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-background/60 hover:text-background transition-colors"
        >
          <ArrowLeft className="h-3 w-3" />
          Back
        </motion.button>

        <div className="relative flex items-center gap-5">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex h-16 w-16 items-center justify-center rounded-[1.5rem] bg-background/10 backdrop-blur-md border border-background/20 shadow-2xl"
          >
            <Icon className="h-8 w-8" />
          </motion.div>
          <div>
            <motion.h1 
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-3xl font-black tracking-tight uppercase"
            >
              {config.title}
            </motion.h1>
            <motion.p 
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-[10px] font-black uppercase tracking-widest text-background/50 mt-1"
            >
              {exploreMode === 'city' && city ? `${config.subtitle} • ${city}` : config.subtitle}
            </motion.p>
          </div>
        </div>
      </div>

      <div className="flex-1 -mt-8 relative z-10 px-6">
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-card rounded-[2.5rem] p-8 shadow-2xl border border-border"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-6">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Basic Information</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">{config.fields.roleLabel}</label>
                  <Input
                    value={form.fullName}
                    onChange={(e) => setForm((current) => ({ ...current, fullName: e.target.value }))}
                    placeholder="e.g. John Doe"
                    className="h-14 rounded-2xl bg-secondary border-transparent focus:bg-card focus:border-border transition-all font-bold"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Current City</label>
                  <div className="relative">
                    <Input
                      value={form.city}
                      onChange={(e) => setForm((current) => ({ ...current, city: e.target.value }))}
                      placeholder="e.g. Marrakech"
                      className="h-14 rounded-2xl bg-secondary border-transparent focus:bg-card focus:border-border transition-all font-bold pl-11"
                      required
                    />
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Email Contact</label>
                  <Input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm((current) => ({ ...current, email: e.target.value }))}
                    placeholder="name@example.com"
                    className="h-14 rounded-2xl bg-secondary border-transparent focus:bg-card focus:border-border transition-all font-bold"
                    required
                  />
                </div>
              </div>

              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground pt-4">Professional Details</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">{config.fields.expertiseLabel}</label>
                  <div className="relative">
                    <Input
                      value={form.expertise}
                      onChange={(e) => setForm((current) => ({ ...current, expertise: e.target.value }))}
                      placeholder={config.fields.expertiseLabel}
                      className="h-14 rounded-2xl bg-secondary border-transparent focus:bg-card focus:border-border transition-all font-bold pl-11"
                      required
                    />
                    <Globe className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">{config.fields.priceLabel}</label>
                  <div className="relative">
                    <Input
                      value={form.price}
                      onChange={(e) => setForm((current) => ({ ...current, price: e.target.value }))}
                      placeholder="e.g. 50"
                      className="h-14 rounded-2xl bg-secondary border-transparent focus:bg-card focus:border-border transition-all font-bold pl-11"
                    />
                    <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">{config.fields.availabilityLabel}</label>
                  <Input
                    value={form.availability}
                    onChange={(e) => setForm((current) => ({ ...current, availability: e.target.value }))}
                    placeholder="e.g. Flexible / Night / Day"
                    className="h-14 rounded-2xl bg-secondary border-transparent focus:bg-card focus:border-border transition-all font-bold"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">{config.fields.extraLabel}</label>
                  <Input
                    value={form.extra}
                    onChange={(e) => setForm((current) => ({ ...current, extra: e.target.value }))}
                    placeholder="e.g. English, French, Arabic"
                    className="h-14 rounded-2xl bg-secondary border-transparent focus:bg-card focus:border-border transition-all font-bold"
                  />
                </div>
              </div>

              <div className="space-y-2 pt-4">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">{config.fields.noteLabel}</label>
                <Textarea
                  value={form.notes}
                  onChange={(e) => setForm((current) => ({ ...current, notes: e.target.value }))}
                  placeholder="Share a bit more about your experience..."
                  className="min-h-32 rounded-2xl bg-secondary border-transparent focus:bg-card focus:border-border transition-all font-bold p-4"
                  required
                />
              </div>
            </div>

            <Button 
                type="submit" 
                className="h-16 w-full rounded-2xl bg-foreground hover:bg-accent text-background font-black uppercase tracking-widest text-xs shadow-xl shadow-foreground/10 active:scale-[0.98] transition-all flex items-center justify-center gap-3"
            >
              {config.submitLabel}
              <Send className="h-4 w-4" />
            </Button>
        </form>
      </motion.div>
    </div>

      <BottomNav />
    </div>
  );
}
