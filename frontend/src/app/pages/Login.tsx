import { useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowRight, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { getDashboardPathForRole } from '../components/RequireAuth';
import { useAppContext, type UserRole } from '../context/AppContext';
import { loginRequest } from '../services/api';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { setAuthMode, setUserSession } = useAppContext();

  const redirectTo = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return params.get('redirectTo') || '/country';
  }, [location.search]);

  const isTouristGuideRequestFlow = redirectTo.startsWith('/guide/request/');
  const canContinueAsGuest = redirectTo === '/country';

  const getPostLoginPath = (role: UserRole, verificationStatus?: string) => {
    if (redirectTo !== '/country') {
      return redirectTo;
    }

    if (role === 'driver') {
      if (!verificationStatus || verificationStatus === 'none') {
        return '/driver/join';
      }
      if (verificationStatus === 'verified') {
        return '/dashboard/driver';
      }
      return '/driver/pending';
    }

    if (role === 'guide' || role === 'super_admin') {
      return getDashboardPathForRole(role);
    }

    return '/country';
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await loginRequest({
        email,
        password,
        role: isTouristGuideRequestFlow ? 'tourist' : undefined,
      });

      if (!response.user || !response.token) {
        throw new Error('Reponse de connexion invalide.');
      }

      setUserSession({
        name: response.user.name,
        email: response.user.email,
        role: response.user.role,
        token: response.token,
        country: response.user.last_country?.name,
        city: response.user.last_city?.name,
        driverVerificationStatus: response.user.driver_profile?.verification_status,
        guideVerificationStatus: response.user.guide_profile?.status === 'approved'
          ? 'approved'
          : response.user.guide_profile?.status === 'rejected'
          ? 'rejected'
          : response.user.guide_profile?.status ?? 'none',
        driverProfile: response.user.driver_profile
          ? {
              fullName: response.user.name,
              phone: response.user.driver_profile.phone ?? '',
              vehicleType: response.user.driver_profile.vehicle_type ?? '',
              city: response.user.driver_profile.city?.name ?? response.user.last_city?.name ?? '',
            }
          : null,
      });

      toast.success('Connexion reussie.');
      navigate(getPostLoginPath(response.user.role, response.user.driver_profile?.verification_status));
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Impossible de se connecter.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="size-full bg-white/75 backdrop-blur-sm flex flex-col">
      <div className="p-6 animate-enter-hero">
        <h1 className="text-3xl font-serif text-[#0D9488]">Navito</h1>
      </div>

      <div className="flex-1 px-6 py-8">
        <div className="mx-auto max-w-md space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Connexion</h2>
            <p className="mt-1 text-gray-600">
              {isTouristGuideRequestFlow
                ? 'Connectez-vous ou inscrivez-vous pour envoyer votre demande directement au guide.'
                : redirectTo === '/country'
                ? 'Connectez-vous avec votre email et mot de passe. Navito detecte automatiquement votre role.'
                : 'Cette action est protegee. Connectez-vous pour continuer.'}
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 rounded-xl"
                required
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <button type="button" className="text-sm text-[#0D9488] hover:underline">
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="........"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 rounded-xl pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="h-12 w-full rounded-xl bg-[#0D9488] text-white hover:bg-[#0D9488]/90"
            >
              {isSubmitting ? 'Connexion en cours...' : 'Se connecter'}
            </Button>
          </form>

          <p className="text-center text-sm text-gray-600">
            Pas de compte ?{' '}
            <button
              onClick={() => navigate(`/register?redirectTo=${encodeURIComponent(redirectTo)}`)}
              className="font-medium text-[#0D9488] hover:underline"
            >
              Inscription
            </button>
          </p>

          {canContinueAsGuest && (
            <button
              onClick={() => {
                setAuthMode('guest');
                navigate('/country');
              }}
              className="mx-auto flex items-center gap-2 text-sm font-medium text-[#0D9488] hover:underline"
            >
              Continuer en invite
              <ArrowRight className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
