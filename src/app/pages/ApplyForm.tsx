import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { ArrowLeft, CalendarPlus, Car, Send, UserRound } from 'lucide-react';
import BottomNav from '../components/BottomNav';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { useAppContext } from '../context/AppContext';

const formConfig = {
  activity: {
    title: 'Create Activity',
    subtitle: 'Publiez une activite pour rencontrer des voyageurs dans votre ville.',
    icon: CalendarPlus,
    submitLabel: 'Publier',
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
    subtitle: 'Inscrivez-vous comme guide local et recevez des demandes dans votre ville.',
    icon: UserRound,
    submitLabel: 'Envoyer ma candidature',
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
    subtitle: 'Inscrivez-vous comme chauffeur disponible pour les visiteurs.',
    icon: Car,
    submitLabel: 'Envoyer ma candidature',
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
  const { authMode, city, exploreMode } = useAppContext();
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
    toast.success(`${config.title} submitted successfully`);
    navigate(type === 'activity' ? '/community' : type === 'guide' ? '/guide' : '/transport');
  };

  return (
    <div className="size-full bg-gray-50 flex flex-col pb-16">
      <div className="bg-[#0D9488] px-6 py-6 text-white">
        <button onClick={() => navigate(-1)} className="mb-4 flex items-center gap-2 text-sm text-white/90 hover:text-white">
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>

        <div className="flex items-start gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20">
            <Icon className="h-6 w-6" />
          </div>
          <div>
            <h1 className="mb-2 text-2xl font-bold">{config.title}</h1>
            <p className="text-sm text-white/80">
              {exploreMode === 'city' && city ? `${config.subtitle} Ville actuelle: ${city}.` : config.subtitle}
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto px-6 py-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">{config.fields.roleLabel}</label>
              <Input
                value={form.fullName}
                onChange={(e) => setForm((current) => ({ ...current, fullName: e.target.value }))}
                placeholder={type === 'activity' ? 'Organizer name' : 'Your full name'}
                className="h-11 rounded-xl"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">City</label>
              <Input
                value={form.city}
                onChange={(e) => setForm((current) => ({ ...current, city: e.target.value }))}
                placeholder="City"
                className="h-11 rounded-xl"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Phone</label>
              <Input
                value={form.phone}
                onChange={(e) => setForm((current) => ({ ...current, phone: e.target.value }))}
                placeholder="+212 ..."
                className="h-11 rounded-xl"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Email</label>
              <Input
                type="email"
                value={form.email}
                onChange={(e) => setForm((current) => ({ ...current, email: e.target.value }))}
                placeholder="name@email.com"
                className="h-11 rounded-xl"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">{config.fields.expertiseLabel}</label>
              <Input
                value={form.expertise}
                onChange={(e) => setForm((current) => ({ ...current, expertise: e.target.value }))}
                placeholder={config.fields.expertiseLabel}
                className="h-11 rounded-xl"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">{config.fields.priceLabel}</label>
              <Input
                value={form.price}
                onChange={(e) => setForm((current) => ({ ...current, price: e.target.value }))}
                placeholder={config.fields.priceLabel}
                className="h-11 rounded-xl"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">{config.fields.availabilityLabel}</label>
              <Input
                value={form.availability}
                onChange={(e) => setForm((current) => ({ ...current, availability: e.target.value }))}
                placeholder={config.fields.availabilityLabel}
                className="h-11 rounded-xl"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">{config.fields.extraLabel}</label>
              <Input
                value={form.extra}
                onChange={(e) => setForm((current) => ({ ...current, extra: e.target.value }))}
                placeholder={config.fields.extraLabel}
                className="h-11 rounded-xl"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">{config.fields.noteLabel}</label>
            <Textarea
              value={form.notes}
              onChange={(e) => setForm((current) => ({ ...current, notes: e.target.value }))}
              placeholder={config.fields.noteLabel}
              className="min-h-32 rounded-xl"
              required
            />
          </div>

          <Button type="submit" className="h-12 w-full rounded-xl bg-[#0D9488] hover:bg-[#0D9488]/90">
            {config.submitLabel}
            <Send className="ml-2 h-4 w-4" />
          </Button>
        </form>
      </div>

      <BottomNav />
    </div>
  );
}
