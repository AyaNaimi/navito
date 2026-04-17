import { useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, LogIn, MapPinned, UserPlus } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { getDashboardPathForRole } from '../components/RequireAuth';
import { useAppContext, type UserRole } from '../context/AppContext';
import { buildSessionFromAuthResponse, loginRequest } from '../services/api';

export default function AuthGateway() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setAuthMode, setUserSession } = useAppContext();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const redirectTo = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return params.get('redirectTo') || '/country';
  }, [location.search]);

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

  const continueAsGuest = () => {
    setAuthMode('guest');
    navigate('/country');
  };

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await loginRequest({ email, password });

      if (!response.user || !response.token) {
        throw new Error('Reponse de connexion invalide.');
      }

      setUserSession(buildSessionFromAuthResponse(response.user, response.token));

      toast.success('Connexion reussie.');
      navigate(getPostLoginPath(response.user.role, response.user.driver_profile?.verification_status));
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Impossible de se connecter.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(13,148,136,0.14),_transparent_24%),linear-gradient(180deg,_#f8fffe_0%,_#eefbf8_45%,_#f8fafc_100%)] px-4 py-8">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-5xl items-center justify-center">
        <div className="w-full max-w-md rounded-[32px] border border-[#0D9488]/10 bg-white p-7 shadow-[0_25px_70px_-40px_rgba(13,148,136,0.45)] sm:p-8">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#0D9488]/10 text-[#0D9488]">
              <LogIn className="h-7 w-7" />
            </div>
            <p className="text-sm font-semibold uppercase tracking-[0.32em] text-[#0D9488]">Navito</p>
            <h1 className="mt-4 text-3xl font-black tracking-tight text-slate-900">Connexion</h1>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Connectez-vous pour acceder a votre espace, ou continuez en invite pour explorer la plateforme.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="welcome-email" className="text-sm font-medium text-slate-700">
                Email
              </Label>
              <Input
                id="welcome-email"
                type="email"
                placeholder="votre@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 rounded-2xl border-slate-200 bg-slate-50 px-4 focus-visible:ring-[#0D9488]/25"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="welcome-password" className="text-sm font-medium text-slate-700">
                Mot de passe
              </Label>
              <div className="relative">
                <Input
                  id="welcome-password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Votre mot de passe"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 rounded-2xl border-slate-200 bg-slate-50 px-4 pr-10 focus-visible:ring-[#0D9488]/25"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((current) => !current)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="h-12 w-full rounded-2xl bg-[#0D9488] text-white hover:bg-[#0D9488]/90"
            >
              {isSubmitting ? 'Connexion en cours...' : 'Se connecter'}
            </Button>
          </form>

          <div className="my-6 flex items-center gap-4">
            <div className="h-px flex-1 bg-slate-200" />
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Ou</p>
            <div className="h-px flex-1 bg-slate-200" />
          </div>

          <div className="space-y-3">
            <button
              type="button"
              onClick={continueAsGuest}
              className="flex h-12 w-full items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:border-[#0D9488] hover:text-[#0D9488]"
            >
              <MapPinned className="h-5 w-5 text-[#0D9488]" />
              Continuer en invite
            </button>

            <button
              type="button"
              onClick={() => navigate(`/register?redirectTo=${encodeURIComponent(redirectTo)}`)}
              className="flex h-12 w-full items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:border-[#0D9488] hover:text-[#0D9488]"
            >
              <UserPlus className="h-5 w-5 text-[#0D9488]" />
              Creer un compte
            </button>
          </div>

          <p className="mt-6 text-center text-sm leading-6 text-slate-500">
            Les comptes guide, chauffeur et admin restent proteges. Le mode invite donne acces a la partie publique.
          </p>
        </div>
      </div>
    </div>
  );
}
