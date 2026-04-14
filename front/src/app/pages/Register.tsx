import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Eye, EyeOff, ArrowRight, ShieldCheck, UserPlus, Sparkles } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { useAppContext, UserRole } from '../context/AppContext';
import { getDashboardPathForRole } from '../components/RequireAuth';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

const roleOptions = [
  { value: 'tourist', label: 'Tourist' },
  { value: 'guide', label: 'Guide' },
  { value: 'driver', label: 'Driver' },
  { value: 'super_admin', label: 'Admin' },
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
  const [selectedRole, setSelectedRole] = useState<UserRole>('tourist');
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

    if (effectiveRole === 'driver') {
      navigate('/driver/join');
      return;
    }

    if (redirectTo === '/country' && (effectiveRole === 'guide' || effectiveRole === 'super_admin')) {
      navigate(getDashboardPathForRole(effectiveRole));
      return;
    }

    navigate(redirectTo === '/country' && effectiveRole !== 'tourist' ? '/profile' : redirectTo);
  };

  return (
    <div className="min-h-screen w-full bg-background flex flex-col font-sans antialiased text-foreground overflow-x-hidden relative transition-colors duration-500">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[20%] right-[-10%] w-[50%] h-[50%] bg-primary/[0.05] blur-[130px] rounded-full" />
        <div className="absolute bottom-[10%] left-[-5%] w-[40%] h-[40%] bg-accent/[0.05] blur-[110px] rounded-full" />
      </div>

      <header className="px-6 pt-16 pb-8 max-w-md mx-auto w-full text-center relative z-10 font-sans">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }} 
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-secondary border border-border backdrop-blur-xl mb-6 shadow-xl"
        >
          <UserPlus className="h-4 w-4 text-accent" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Registry Activation</span>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <h1 className="text-4xl font-black tracking-tighter text-foreground uppercase italic underline decoration-accent decoration-4 underline-offset-4">Navito</h1>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-accent mt-4">Universal Identity protocol</p>
        </motion.div>
      </header>

      <main className="flex-1 px-6 pb-24 relative z-10 font-sans">
        <div className="mx-auto max-w-md space-y-12">
          <div className="space-y-4">
            <h2 className="text-2xl font-black tracking-tight text-foreground uppercase italic">{t('register.title', 'Create Account')}</h2>
            <p className="text-[13px] leading-relaxed text-muted-foreground font-medium max-w-[300px]">
              {isTouristGuideRequestFlow ? t('register.subtitleGuide', 'Initialize tourist protocol for host request.') : t('register.subtitle', 'Join the global coordination network.')}
            </p>
          </div>

          <form onSubmit={handleRegister} className="space-y-10">
            {!isTouristGuideRequestFlow && (
              <div className="space-y-4">
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2 italic">
                  <Sparkles className="h-3 w-3 text-accent" /> Selection Protocol
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {roleOptions.map((role) => (
                    <button
                      key={role.value}
                      type="button"
                      onClick={() => setSelectedRole(role.value as UserRole)}
                      className={`rounded-2xl border px-4 py-4 text-[10px] font-black uppercase tracking-widest transition-all ${
                        selectedRole === role.value
                          ? 'border-foreground bg-foreground text-background scale-[1.02] shadow-2xl shadow-foreground/10'
                          : 'border-border bg-card/50 text-muted-foreground hover:border-accent/30'
                      }`}
                    >
                      {role.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="name" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Full Identity</Label>
                <Input
                  id="name"
                  placeholder="Atlas Bourne"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="h-14 rounded-2xl border-border bg-card/50 px-6 text-[14px] font-bold text-foreground placeholder:text-muted-foreground transition-all focus:bg-card focus:border-accent ring-0"
                  required
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="email" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Electronic Mail</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@nexus.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="h-14 rounded-2xl border-border bg-card/50 px-6 text-[14px] font-bold text-foreground placeholder:text-muted-foreground transition-all focus:bg-card focus:border-accent ring-0"
                  required
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="password" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Secure Password</Label>
                <div className="relative group">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="h-14 rounded-2xl border-border bg-card/50 px-6 text-[14px] font-bold text-foreground placeholder:text-muted-foreground transition-all focus:bg-card focus:border-accent ring-0"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <Label htmlFor="confirmPassword" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Verify Control</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="h-14 rounded-2xl border-border bg-card/50 px-6 text-[14px] font-bold text-foreground placeholder:text-muted-foreground transition-all focus:bg-card focus:border-accent ring-0"
                  required
                />
              </div>
            </div>

            <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
              <Button type="submit" className="h-16 w-full rounded-2xl bg-foreground text-background font-black text-[12px] uppercase tracking-[0.2em] shadow-2xl hover:bg-accent hover:text-white transition-all border-none">
                {t('register.registerBtn', 'Authorize identity')}
              </Button>
            </motion.div>
          </form>

          <footer className="text-center pt-8 border-t border-border">
            <p className="text-[12px] font-bold text-muted-foreground">
              Already identified?{' '}
              <button 
                onClick={() => navigate(`/login?redirectTo=${encodeURIComponent(redirectTo)}`)} 
                className="text-foreground hover:text-accent transition-colors uppercase tracking-widest text-[10px] font-black ml-2 underline underline-offset-4"
              >
                Sign In Protocol
              </button>
            </p>
          </footer>
        </div>
      </main>
    </div>
  );
}
