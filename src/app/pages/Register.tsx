import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react';
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

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState<(typeof roleOptions)[number]['value']>('tourist');
  const navigate = useNavigate();
  const location = useLocation();
  const { setUserSession } = useAppContext();
  const redirectTo = new URLSearchParams(location.search).get('redirectTo') || '/country';
  const isTouristGuideRequestFlow = redirectTo.startsWith('/guide/request/');

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    const effectiveRole = isTouristGuideRequestFlow ? 'tourist' : selectedRole;

    setUserSession({
      name: formData.name,
      email: formData.email,
      role: effectiveRole,
    });

    navigate(redirectTo === '/country' && effectiveRole !== 'tourist' ? '/profile' : redirectTo);
  };

  return (
    <div className="size-full bg-white flex flex-col">
      <div className="p-6 flex items-center gap-4">
        <button onClick={() => navigate(`/login?redirectTo=${encodeURIComponent(redirectTo)}`)} className="text-gray-600 hover:text-gray-900">
          <ArrowLeft className="h-6 w-6" />
        </button>
        <h1 className="text-3xl font-serif text-[#0D9488]">Navito</h1>
      </div>

      <div className="flex-1 overflow-auto px-6 py-8">
        <div className="mx-auto max-w-md space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Creer un compte</h2>
            <p className="mt-1 text-gray-600">
              {isTouristGuideRequestFlow
                ? 'Creez un compte touriste pour envoyer votre demande directement au guide.'
                : 'Inscrivez-vous puis selectionnez votre pays et votre ville.'}
            </p>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
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
              <Label htmlFor="name">Nom complet</Label>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="h-12 rounded-xl"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="h-12 rounded-xl"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="........"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
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

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="........"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className="h-12 rounded-xl"
                required
              />
            </div>

            <Button type="submit" className="h-12 w-full rounded-xl bg-[#0D9488] text-white hover:bg-[#0D9488]/90">
              Creer le compte
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
