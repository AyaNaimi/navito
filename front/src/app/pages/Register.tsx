import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Eye, EyeOff, ArrowRight } from 'lucide-react';
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

export default function Register() {
  const { t } = useTranslation();
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
    <div className="min-h-screen w-full bg-[#FAFAFA] flex flex-col font-sans antialiased text-[#171717]">
      <header className="px-6 py-10 max-w-md mx-auto w-full text-center">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
          <h1 className="text-[28px] font-bold tracking-tighter text-[#171717]">Navito</h1>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#A3A3A3] mt-1">Universal Identity Creation</p>
        </motion.div>
      </header>

      <main className="flex-1 px-6 pb-12">
        <div className="mx-auto max-w-md space-y-10">
          <div className="space-y-3">
            <h2 className="text-[22px] font-bold tracking-tight text-[#171717]">{t('register.title')}</h2>
            <p className="text-[13px] leading-relaxed text-[#737373] font-medium">
              {isTouristGuideRequestFlow ? t('register.subtitleGuide') : t('register.subtitle')}
            </p>
          </div>

          <form onSubmit={handleRegister} className="space-y-8">
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
                <Label htmlFor="name" className="text-[11px] font-bold uppercase tracking-widest text-[#737373] ml-1">{t('register.name')}</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Atlas Bourne"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="h-12 rounded-2xl border-[#E5E5E5] bg-white px-5 text-[14px] font-medium shadow-sm transition-all focus:border-[#171717]/20 focus:ring-0"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-[11px] font-bold uppercase tracking-widest text-[#737373] ml-1">{t('register.email')}</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="name@nexus.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="h-12 rounded-2xl border-[#E5E5E5] bg-white px-5 text-[14px] font-medium shadow-sm transition-all focus:border-[#171717]/20 focus:ring-0"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-[11px] font-bold uppercase tracking-widest text-[#737373] ml-1">{t('register.password')}</Label>
                <div className="relative group">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
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

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-[11px] font-bold uppercase tracking-widest text-[#737373] ml-1">{t('register.confirmPassword')}</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="h-12 rounded-2xl border-[#E5E5E5] bg-white px-5 text-[14px] font-medium shadow-sm transition-all focus:border-[#171717]/20 focus:ring-0"
                  required
                />
              </div>
            </div>

            <Button type="submit" className="h-12 w-full rounded-2xl bg-[#171717] text-white font-bold text-[13px] uppercase tracking-[0.2em] shadow-lg shadow-black/10 hover:opacity-90 active:scale-[0.98] transition-all">
              {t('register.registerBtn')}
            </Button>
          </form>

          <footer className="text-center">
            <p className="text-[12px] font-medium text-[#737373]">
              Already identified?{' '}
              <button 
                onClick={() => navigate(`/login?redirectTo=${encodeURIComponent(redirectTo)}`)} 
                className="font-bold text-[#171717] hover:underline underline-offset-4"
              >
                Sign In
              </button>
            </p>
          </footer>
        </div>
      </main>
    </div>
  );
}
