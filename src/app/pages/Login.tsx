import { useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowRight, Eye, EyeOff } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { useAppContext } from '../context/AppContext';

const roleOptions = [
  { value: 'tourist', label: 'Tourist' },
  { value: 'guide', label: 'Guide' },
  { value: 'driver', label: 'Driver' },
  { value: 'super_admin', label: 'Super Admin' },
] as const;

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState<(typeof roleOptions)[number]['value']>('tourist');
  const navigate = useNavigate();
  const location = useLocation();
  const { setUserSession } = useAppContext();
  const redirectTo = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return params.get('redirectTo') || '/country';
  }, [location.search]);
  const isTouristGuideRequestFlow = redirectTo.startsWith('/guide/request/');

  const getPostLoginPath = () => {
    if (redirectTo !== '/country') {
      return redirectTo;
    }

    return (isTouristGuideRequestFlow ? 'tourist' : selectedRole) === 'tourist' ? '/country' : '/profile';
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setUserSession({
      name: email.split('@')[0] || 'Navito User',
      email,
      role: isTouristGuideRequestFlow ? 'tourist' : selectedRole,
    });
    navigate(getPostLoginPath());
  };

  return (
    <div className="size-full bg-white flex flex-col">
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
                ? 'Connectez-vous pour synchroniser votre compte et vos activites.'
                : 'Cette action est sensible. Connectez-vous pour continuer.'}
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {!isTouristGuideRequestFlow && (
              <div className="space-y-2">
                <Label>Role</Label>
                <div className="grid grid-cols-2 gap-2">
                  {roleOptions.map((role) => (
                    <button
                      key={role.value}
                      type="button"
                      onClick={() => setSelectedRole(role.value)}
                      className={`rounded-xl border px-3 py-3 text-sm font-medium transition-colors ${
                        selectedRole === role.value
                          ? 'border-[#0D9488] bg-[#0D9488]/10 text-[#0D9488]'
                          : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      {role.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

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

            <Button type="submit" className="h-12 w-full rounded-xl bg-[#0D9488] text-white hover:bg-[#0D9488]/90">
              Login
            </Button>
          </form>

          <p className="text-center text-sm text-gray-600">
            Pas de compte ?{' '}
            <button onClick={() => navigate(`/register?redirectTo=${encodeURIComponent(redirectTo)}`)} className="font-medium text-[#0D9488] hover:underline">
              Inscription
            </button>
          </p>

          <button
            onClick={() => navigate('/country')}
            className="mx-auto flex items-center gap-2 text-sm font-medium text-[#0D9488] hover:underline"
          >
            Aller directement au choix du pays
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
