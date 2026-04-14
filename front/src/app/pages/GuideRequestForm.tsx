import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import {
  ArrowLeft,
  CalendarDays,
  Clock3,
  MapPin,
  Send,
  Sparkles,
  Star,
  UserRound,
} from 'lucide-react';
import { motion } from 'framer-motion';
import BottomNav from '../components/BottomNav';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Badge } from '../components/ui/badge';
import { guides } from '../data/mockData';
import { useAppContext } from '../context/AppContext';

const guidanceTypes = [
  'Historical tour',
  'Food tour',
  'Shopping assistance',
  'City orientation',
  'Custom private guide',
];

const durations = ['2 hours', 'Half day', 'Full day', '2 days', 'Custom duration'];

const reveal = {
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
};

export default function GuideRequestForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { city, userRole } = useAppContext();
  const [form, setForm] = useState({
    guidanceType: guidanceTypes[0],
    duration: durations[1],
    date: '',
    meetingPoint: city || '',
    notes: '',
  });

  const guide = useMemo(() => guides.find((item) => String(item.id) === id), [id]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (userRole !== 'tourist') {
      toast.error('Only tourists can send guide requests from this interface');
      return;
    }

    toast.success('Guide request submitted successfully');
    navigate('/guide');
  };

  if (!guide) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-6">
        <div className="rounded-[2.5rem] border border-border bg-card p-10 text-center shadow-2xl">
          <p className="text-lg font-black uppercase tracking-tight">Guide not found</p>
          <Button onClick={() => navigate('/guide')} className="mt-6 h-12 rounded-2xl bg-foreground text-background hover:bg-accent hover:text-white">
            Back to guides
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col pb-32 overflow-x-hidden transition-colors duration-500">
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-[8%] right-0 h-[36%] w-[45%] rounded-full bg-emerald-500/[0.05] blur-[120px]" />
        <div className="absolute bottom-[10%] left-0 h-[40%] w-[50%] rounded-full bg-orange-500/[0.05] blur-[120px]" />
      </div>

      <motion.header
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-50 border-b border-border bg-background/80 px-6 py-7 backdrop-blur-2xl"
      >
        <div className="mx-auto max-w-xl">
          <button
            onClick={() => navigate(-1)}
            className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl border border-border bg-secondary text-foreground transition-all hover:bg-card"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>

          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.22em] text-muted-foreground">
                <span className="h-1 w-5 rounded-full bg-accent" />
                Guide request
              </p>
              <h1 className="mt-3 text-2xl font-black uppercase tracking-tight italic bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                Build your itinerary
              </h1>
              <p className="mt-3 max-w-md text-[13px] font-medium leading-relaxed text-muted-foreground">
                Define the guidance format, duration, and meeting details before sending your request.
              </p>
            </div>
            <div className="flex h-14 w-14 items-center justify-center rounded-[1.6rem] border border-border bg-foreground text-background shadow-2xl">
              <Sparkles className="h-6 w-6" />
            </div>
          </div>
        </div>
      </motion.header>

      <main className="mx-auto flex w-full max-w-xl flex-1 flex-col gap-6 px-6 py-8">
        <motion.section {...reveal} className="rounded-[2.5rem] border border-border bg-card/80 p-6 shadow-2xl backdrop-blur-md">
          <div className="flex gap-4">
            <img src={guide.image} alt={guide.name} className="h-20 w-20 rounded-[1.5rem] border border-border object-cover" />
            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h2 className="truncate text-[18px] font-black uppercase tracking-tight">{guide.name}</h2>
                  <p className="mt-1 text-[11px] font-black uppercase tracking-[0.16em] text-muted-foreground">{guide.city}</p>
                </div>
                <div className="flex items-center gap-1 rounded-xl border border-accent/10 bg-accent/10 px-3 py-1 text-accent">
                  <Star className="h-3.5 w-3.5 fill-current" />
                  <span className="text-[11px] font-black">{guide.rating}</span>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <Badge className="rounded-xl bg-secondary px-3 py-1 text-[10px] font-black uppercase tracking-widest text-muted-foreground border-none">
                  <UserRound className="mr-1 h-3 w-3" />
                  {guide.specialty}
                </Badge>
                <Badge className="rounded-xl bg-secondary px-3 py-1 text-[10px] font-black uppercase tracking-widest text-muted-foreground border-none">
                  <Clock3 className="mr-1 h-3 w-3" />
                  {guide.responseTime}
                </Badge>
              </div>
            </div>
          </div>
        </motion.section>

        <motion.form
          {...reveal}
          transition={{ delay: 0.08 }}
          onSubmit={handleSubmit}
          className="space-y-6 rounded-[2.5rem] border border-border bg-card p-6 shadow-2xl"
        >
          <section className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Type of guidance</label>
            <div className="grid gap-3">
              {guidanceTypes.map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setForm((current) => ({ ...current, guidanceType: type }))}
                  className={`rounded-[1.4rem] border px-4 py-4 text-left text-[13px] font-black uppercase tracking-tight transition-all ${
                    form.guidanceType === type
                      ? 'border-foreground bg-foreground text-background shadow-xl'
                      : 'border-border bg-secondary text-foreground hover:border-accent/30 hover:bg-card'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </section>

          <section className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Duration</label>
            <div className="grid grid-cols-2 gap-3">
              {durations.map((duration) => (
                <button
                  key={duration}
                  type="button"
                  onClick={() => setForm((current) => ({ ...current, duration }))}
                  className={`rounded-[1.4rem] border px-4 py-4 text-[12px] font-black uppercase tracking-widest transition-all ${
                    form.duration === duration
                      ? 'border-foreground bg-foreground text-background shadow-xl'
                      : 'border-border bg-secondary text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {duration}
                </button>
              ))}
            </div>
          </section>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                <CalendarDays className="h-3.5 w-3.5" />
                Preferred date
              </label>
              <Input
                type="date"
                value={form.date}
                onChange={(e) => setForm((current) => ({ ...current, date: e.target.value }))}
                className="h-14 rounded-[1.4rem] border-border bg-secondary font-bold"
                required
              />
            </div>

            <div className="space-y-3">
              <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                <MapPin className="h-3.5 w-3.5" />
                Meeting point
              </label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={form.meetingPoint}
                  onChange={(e) => setForm((current) => ({ ...current, meetingPoint: e.target.value }))}
                  placeholder="Where should the guide meet you?"
                  className="h-14 rounded-[1.4rem] border-border bg-secondary pl-11 font-bold"
                  required
                />
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Notes</label>
            <Textarea
              value={form.notes}
              onChange={(e) => setForm((current) => ({ ...current, notes: e.target.value }))}
              placeholder="Add language preference, places you want to visit, or any special request."
              className="min-h-32 rounded-[1.6rem] border-border bg-secondary p-4 font-medium"
            />
          </div>

          <Button type="submit" className="h-14 w-full rounded-[1.6rem] bg-foreground text-background hover:bg-accent hover:text-white font-black uppercase tracking-[0.18em] shadow-2xl shadow-foreground/10">
            Send request
            <Send className="ml-2 h-4 w-4" />
          </Button>
        </motion.form>
      </main>

      <BottomNav />
    </div>
  );
}
