import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CarFront, ChevronLeft, MapPin, Phone, Sparkles, User2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { useAppContext } from '../context/AppContext';

const fieldMeta = {
  fullName: User2,
  phone: Phone,
  vehicleType: CarFront,
  city: MapPin,
} as const;

type FormState = {
  fullName: string;
  phone: string;
  vehicleType: string;
  city: string;
};

export default function DriverJoin() {
  const navigate = useNavigate();
  const { authMode, driverProfile, submitDriverRegistration } = useAppContext();
  const [form, setForm] = useState<FormState>({
    fullName: driverProfile?.fullName ?? '',
    phone: driverProfile?.phone ?? '',
    vehicleType: driverProfile?.vehicleType ?? '',
    city: driverProfile?.city ?? '',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (authMode !== 'login') {
      navigate('/login?redirectTo=/driver/join', { replace: true });
    }
  }, [authMode, navigate]);

  const validate = (values: FormState) => {
    const nextErrors: Partial<Record<keyof FormState, string>> = {};

    if (values.fullName.trim().length < 3) nextErrors.fullName = 'Name must be at least 3 characters';
    if (values.phone.trim().length < 8) nextErrors.phone = 'Phone is required';
    if (values.vehicleType.trim().length < 2) nextErrors.vehicleType = 'Vehicle type is required';
    if (values.city.trim().length < 2) nextErrors.city = 'City is required';

    return nextErrors;
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextErrors = validate(form);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setIsSubmitting(true);
    submitDriverRegistration(form);
    navigate('/driver/verify');
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-background px-6 py-8 text-foreground transition-colors duration-500">
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-0 right-0 h-[38%] w-[45%] rounded-full bg-accent/10 blur-[140px]" />
        <div className="absolute bottom-[10%] left-0 h-[42%] w-[50%] rounded-full bg-emerald-500/[0.06] blur-[120px]" />
      </div>

      <div className="mx-auto max-w-xl space-y-6">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 rounded-2xl border border-border bg-secondary px-4 py-3 text-[11px] font-black uppercase tracking-widest text-muted-foreground transition-all hover:text-foreground"
        >
          <ChevronLeft className="h-4 w-4" />
          Back
        </button>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-[2.8rem] border border-border bg-card p-7 shadow-2xl"
        >
          <div className="mb-8 flex items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-[1.6rem] bg-foreground text-background shadow-2xl">
                <CarFront className="h-6 w-6" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.22em] text-muted-foreground">Driver onboarding</p>
                <h1 className="mt-2 text-2xl font-black uppercase tracking-tight italic">Join Navito Pilot</h1>
              </div>
            </div>
            <Sparkles className="mt-1 h-5 w-5 text-accent" />
          </div>

          <p className="mb-8 text-[13px] font-medium leading-relaxed text-muted-foreground">
            Complete your profile, then continue to the verification flow with the same visual language as the newer pages.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {[
              { id: 'fullName', label: 'Name', placeholder: 'Full legal name' },
              { id: 'phone', label: 'Phone', placeholder: 'Mobile number' },
              { id: 'vehicleType', label: 'Vehicle type', placeholder: 'Sedan, SUV...' },
              { id: 'city', label: 'City', placeholder: 'Operating city' },
            ].map((field) => {
              const key = field.id as keyof FormState;
              const Icon = fieldMeta[key];

              return (
                <div key={field.id} className="space-y-2">
                  <Label htmlFor={field.id} className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                    {field.label}
                  </Label>
                  <div className="relative">
                    <Icon className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id={field.id}
                      value={form[key]}
                      onChange={(e) => setForm((current) => ({ ...current, [key]: e.target.value }))}
                      placeholder={field.placeholder}
                      className="h-14 rounded-[1.4rem] border-border bg-secondary pl-11 font-bold"
                    />
                  </div>
                  {errors[key] ? <p className="text-xs font-medium text-destructive">{errors[key]}</p> : null}
                </div>
              );
            })}

            <Button
              type="submit"
              disabled={isSubmitting}
              className="mt-3 h-14 w-full rounded-[1.6rem] bg-foreground text-background hover:bg-accent hover:text-white font-black uppercase tracking-[0.18em] shadow-2xl shadow-foreground/10"
            >
              Continue to verify identity
            </Button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
