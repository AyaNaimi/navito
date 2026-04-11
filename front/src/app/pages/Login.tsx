import { useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowRight, Eye, EyeOff } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { useAppContext } from '../context/AppContext';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

const roleOptions = [
  { value: 'tourist', label: 'Tourist' },
  { value: 'guide', label: 'Guide' },
  { value: 'driver', label: 'Driver' },
  { value: 'super_admin', label: 'Super Admin' },
] as const;

export default function Login() {
  const { t } = useTranslation();
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
    <div className="min-h-screen w-full bg-[#FAFAFA] flex flex-col font-sans antialiased text-[#171717]">
      <header className="px-6 py-10 max-w-md mx-auto w-full text-center">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
          <h1 className="text-[28px] font-bold tracking-tighter text-[#171717]">Navito</h1>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#A3A3A3] mt-1">Global Guest Experience</p>
        </motion.div>
      </header>

      <main className="flex-1 px-6 pb-12">
        <div className="mx-auto max-w-md space-y-10">
          <div className="space-y-3">
            <h2 className="text-[22px] font-bold tracking-tight text-[#171717]">{t('login.title')}</h2>
            <p className="text-[13px] leading-relaxed text-[#737373] font-medium">
              {isTouristGuideRequestFlow
                ? t('login.subtitleGuide')
                : redirectTo === '/country'
                ? t('login.subtitle')
                : t('login.subtitleSensitive')}
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-8">
            {!isTouristGuideRequestFlow && (
              <div className="space-y-4">
                <Label className="text-[11px] font-bold uppercase tracking-widest text-[#737373] ml-1">Access Protocol</Label>
                <div className="grid grid-cols-2 gap-3">
                  {roleOptions.map((role) => (
                    <button
                      key={role.value}
                      type="button"
                      onClick={() => setSelectedRole(role.value)}
                      className={`rounded-2xl border px-4 py-3.5 text-[12px] font-bold uppercase tracking-wider transition-all shadow-sm ${
                        selectedRole === role.value
                          ? 'border-[#171717] bg-[#171717] text-white'
                          : 'border-[#E5E5E5] bg-white text-[#737373] hover:border-[#171717]/30'
                      }`}
                    >
                      {role.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-[11px] font-bold uppercase tracking-widest text-[#737373] ml-1">Email Identifier</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="name@nexus.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 rounded-2xl border-[#E5E5E5] bg-white px-5 text-[14px] font-medium shadow-sm transition-all focus:border-[#171717]/20 focus:ring-0"
                  required
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between px-1">
                  <Label htmlFor="password" className="text-[11px] font-bold uppercase tracking-widest text-[#737373]">{t('login.password')}</Label>
                </div>
                <div className="relative group">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-12 rounded-2xl border-[#E5E5E5] bg-white px-5 text-[14px] font-medium shadow-sm transition-all focus:border-[#171717]/20 focus:ring-0"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#A3A3A3] hover:text-[#171717] transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </div>

            <Button type="submit" className="h-12 w-full rounded-2xl bg-[#171717] text-white font-bold text-[13px] uppercase tracking-[0.2em] shadow-lg shadow-black/10 hover:opacity-90 active:scale-[0.98] transition-all">
              {t('login.loginBtn')}
            </Button>
          </form>

          <footer className="space-y-6 text-center">
            <p className="text-[12px] font-medium text-[#737373]">
              {t('login.noAccount')}{' '}
              <button 
                onClick={() => navigate(`/register?redirectTo=${encodeURIComponent(redirectTo)}`)} 
                className="font-bold text-[#171717] hover:underline underline-offset-4"
              >
                {t('login.registerLink')}
              </button>
            </p>

            <Button
              variant="link"
              onClick={() => navigate('/country')}
              className="text-[11px] font-bold uppercase tracking-widest text-[#A3A3A3] hover:text-[#171717] p-0 h-auto"
            >
              {t('login.skipToCountry')}
              <ArrowRight className="h-3 w-3 ml-2" />
            </Button>
          </footer>
        </div>
      </main>
    </div>
  );
}
