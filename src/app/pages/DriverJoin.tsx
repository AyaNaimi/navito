import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { CarFront, ChevronLeft } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { useAppContext } from '../context/AppContext';

const joinSchema = z.object({
  fullName: z.string().min(3, 'Name must be at least 3 characters'),
  phone: z.string().min(8, 'Phone is required'),
  vehicleType: z.string().min(2, 'Vehicle type is required'),
  city: z.string().min(2, 'City is required'),
});

type JoinFormValues = z.infer<typeof joinSchema>;

export default function DriverJoin() {
  const navigate = useNavigate();
  const { authMode, driverProfile, submitDriverRegistration } = useAppContext();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<JoinFormValues>({
    resolver: zodResolver(joinSchema),
    defaultValues: {
      fullName: driverProfile?.fullName ?? '',
      phone: driverProfile?.phone ?? '',
      vehicleType: driverProfile?.vehicleType ?? '',
      city: driverProfile?.city ?? '',
    },
  });

  useEffect(() => {
    if (authMode !== 'login') {
      navigate('/login?redirectTo=/driver/join', { replace: true });
    }
  }, [authMode, navigate]);

  const onSubmit = (values: JoinFormValues) => {
    submitDriverRegistration(values);
    navigate('/driver/verify');
  };

  return (
    <div className="size-full bg-gradient-to-b from-white/80 to-emerald-50/75 backdrop-blur-sm px-6 py-8">
      <div className="mx-auto max-w-xl space-y-6">
        <button onClick={() => navigate(-1)} className="inline-flex items-center gap-2 text-sm text-slate-600">
          <ChevronLeft className="h-4 w-4" />
          Back
        </button>
        <div className="rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100">
              <CarFront className="h-6 w-6 text-emerald-600" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold">Join as Driver</h1>
              <p className="text-sm text-slate-500">Complete your driver profile to start verification.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Name</Label>
              <Input id="fullName" className="h-11 rounded-xl" {...register('fullName')} />
              {errors.fullName ? <p className="text-xs text-red-500">{errors.fullName.message}</p> : null}
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" className="h-11 rounded-xl" {...register('phone')} />
              {errors.phone ? <p className="text-xs text-red-500">{errors.phone.message}</p> : null}
            </div>
            <div className="space-y-2">
              <Label htmlFor="vehicleType">Vehicle Type</Label>
              <Input id="vehicleType" className="h-11 rounded-xl" placeholder="Sedan, SUV..." {...register('vehicleType')} />
              {errors.vehicleType ? <p className="text-xs text-red-500">{errors.vehicleType.message}</p> : null}
            </div>
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input id="city" className="h-11 rounded-xl" {...register('city')} />
              {errors.city ? <p className="text-xs text-red-500">{errors.city.message}</p> : null}
            </div>

            <Button type="submit" disabled={isSubmitting} className="h-11 w-full rounded-xl bg-emerald-600 hover:bg-emerald-700">
              Continue to Verify Identity
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
