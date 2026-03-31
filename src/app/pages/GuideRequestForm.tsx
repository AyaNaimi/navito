import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { ArrowLeft, Clock3, MapPin, Send, Star, UserRound } from 'lucide-react';
import BottomNav from '../components/BottomNav';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
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
      <div className="size-full bg-white flex items-center justify-center p-6">
        <div className="text-center">
          <p className="text-lg font-semibold text-gray-900">Guide not found</p>
          <Button onClick={() => navigate('/guide')} className="mt-4 bg-[#0D9488] hover:bg-[#0D9488]/90">
            Back to guides
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="size-full bg-gray-50 flex flex-col pb-16">
      <div className="bg-[#0D9488] px-6 py-6 text-white">
        <button onClick={() => navigate(-1)} className="mb-4 flex items-center gap-2 text-sm text-white/90 hover:text-white">
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>

        <h1 className="mb-2 text-2xl font-bold">Request a Guide</h1>
        <p className="text-sm text-white/80">Tell us what kind of guidance you need and for how long.</p>
      </div>

      <div className="flex-1 overflow-auto px-6 py-6">
        <div className="mb-5 rounded-2xl border border-gray-200 bg-white p-4">
          <div className="flex gap-4">
            <img src={guide.image} alt={guide.name} className="h-16 w-16 rounded-full object-cover" />
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="font-bold text-gray-900">{guide.name}</h2>
                  <p className="text-sm text-gray-500">{guide.city}</p>
                </div>
                <div className="flex items-center gap-1 text-sm font-semibold text-gray-900">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  {guide.rating}
                </div>
              </div>

              <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <UserRound className="h-4 w-4 text-[#0D9488]" />
                  <span>{guide.specialty}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock3 className="h-4 w-4 text-[#0D9488]" />
                  <span>{guide.responseTime}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Type of guidance</label>
            <div className="grid gap-2">
              {guidanceTypes.map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setForm((current) => ({ ...current, guidanceType: type }))}
                  className={`rounded-xl border px-4 py-3 text-left text-sm font-medium transition-colors ${
                    form.guidanceType === type
                      ? 'border-[#0D9488] bg-[#0D9488]/10 text-[#0D9488]'
                      : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Duration</label>
            <div className="grid grid-cols-2 gap-2">
              {durations.map((duration) => (
                <button
                  key={duration}
                  type="button"
                  onClick={() => setForm((current) => ({ ...current, duration }))}
                  className={`rounded-xl border px-4 py-3 text-sm font-medium transition-colors ${
                    form.duration === duration
                      ? 'border-[#0D9488] bg-[#0D9488]/10 text-[#0D9488]'
                      : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {duration}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Preferred date</label>
              <Input
                type="date"
                value={form.date}
                onChange={(e) => setForm((current) => ({ ...current, date: e.target.value }))}
                className="h-11 rounded-xl"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Meeting point</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  value={form.meetingPoint}
                  onChange={(e) => setForm((current) => ({ ...current, meetingPoint: e.target.value }))}
                  placeholder="Where should the guide meet you?"
                  className="h-11 rounded-xl pl-10"
                  required
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Notes</label>
            <Textarea
              value={form.notes}
              onChange={(e) => setForm((current) => ({ ...current, notes: e.target.value }))}
              placeholder="Add language preference, places you want to visit, or any special request."
              className="min-h-28 rounded-xl"
            />
          </div>

          <Button type="submit" className="h-12 w-full rounded-xl bg-[#0D9488] hover:bg-[#0D9488]/90">
            Send Request
            <Send className="ml-2 h-4 w-4" />
          </Button>
        </form>
      </div>

      <BottomNav />
    </div>
  );
}
