import { useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowRight, Eye, EyeOff, ShieldCheck, Sparkles, Orbit, Mail, Lock } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { useAppContext, UserRole } from '../context/AppContext';
import { getDashboardPathForRole } from '../components/RequireAuth';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { hapticFeedback } from '../components/ui/utils';
import { toast } from 'sonner';

const roleOptions = [
  { value: 'tourist', label: 'Tourist' },
  { value: 'guide', label: 'Guide' },
  { value: 'driver', label: 'Driver' },
  { value: 'super_admin', label: 'Admin' },
] as const;

export default function Login() {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState<(typeof roleOptions)[number]['value']>('tourist');
  const navigate = useNavigate();
  const location = useLocation();
  const { setUserSession, driverProfile, driverVerificationStatus } = useAppContext();
  
  const redirectTo = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return params.get('redirectTo') || '/country';
  }, [location.search]);
  
  const isTouristGuideRequestFlow = redirectTo.startsWith('/guide/request/');

  const getPostLoginPath = (role: UserRole) => {
    if (redirectTo !== '/country') return redirectTo;
    const effectiveRole = isTouristGuideRequestFlow ? 'tourist' : role;
    if (effectiveRole === 'driver') {
      if (!driverProfile || driverVerificationStatus === 'none') return '/driver/join';
      if (driverVerificationStatus === 'verified') return '/dashboard/driver';
      return '/driver/pending';
    }
    if (effectiveRole === 'guide' || effectiveRole === 'super_admin') return getDashboardPathForRole(effectiveRole);
    return effectiveRole === 'tourist' ? '/country' : '/profile';
  };

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const validateForm = () => {
    let isValid = true;

    if (!email || !email.includes('@')) {
      setEmailError('Please enter a valid email');
      isValid = false;
    } else {
      setEmailError('');
    }

    if (!password || password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      isValid = false;
    } else {
      setPasswordError('');
    }

    return isValid;
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      hapticFeedback('error');
      return;
    }

    setIsSubmitting(true);
    hapticFeedback('light');

    // Simulate network delay for better UX
    setTimeout(() => {
      const role = isTouristGuideRequestFlow ? 'tourist' : selectedRole;
      setUserSession({
        name: email.split('@')[0] || 'Navito User',
        email,
        role,
      });
      toast.success('Welcome back!');
      navigate(getPostLoginPath(role));
    }, 800);
  };

  return (
    <div className="min-h-screen w-full bg-background flex flex-col font-sans antialiased text-foreground overflow-hidden relative transition-colors duration-500">
      {/* Background Decor */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-accent/[0.05] blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/[0.05] blur-[120px] rounded-full" />
      </div>

      <header className="px-6 pt-16 pb-8 max-w-md mx-auto w-full text-center relative z-10 font-sans">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }} 
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-secondary border border-border backdrop-blur-xl mb-6 shadow-xl"
        >
          <Orbit className="h-4 w-4 text-accent" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Security Gate 01</span>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <h1 className="text-4xl font-black tracking-tighter text-foreground uppercase italic underline decoration-accent decoration-4 underline-offset-4">Navito</h1>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-accent mt-4">Universal Access protocol</p>
        </motion.div>
      </header>

      <main className="flex-1 px-6 pb-20 relative z-10 font-sans">
        <div className="mx-auto max-w-md space-y-12">
          <div className="space-y-4">
            <h2 className="text-2xl font-black tracking-tight text-foreground uppercase italic">{t('login.title', 'Initialize Session')}</h2>
            <p className="text-[13px] leading-relaxed text-muted-foreground font-medium max-w-[280px]">
              {isTouristGuideRequestFlow
                ? t('login.subtitleGuide', 'Authorize tourist profile for host engagement.')
                : redirectTo === '/country'
                ? t('login.subtitle', 'Access the coordination network.')
                : t('login.subtitleSensitive', 'Elevated permissions required for this sector.')}
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {!isTouristGuideRequestFlow && (
              <div className="space-y-4">
                <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                  <Sparkles className="h-3.5 w-3.5 text-accent" /> Identification Protocol
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {roleOptions.map((role) => (
                    <button
                      key={role.value}
                      type="button"
                      onClick={() => setSelectedRole(role.value)}
                      className={`rounded-2xl border-2 px-5 py-4 text-[12px] font-semibold uppercase tracking-wide transition-all active:scale-[0.98] ${
                        selectedRole === role.value
                          ? 'border-foreground bg-foreground text-background shadow-xl'
                          : 'border-border bg-card/50 text-muted-foreground hover:border-accent/40 active:bg-accent/5'
                      }`}
                    >
                      {role.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-5">
              <div>
                <Input
                  id="email"
                  type="email"
                  label="Universal ID"
                  placeholder="name@nexus.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (emailError) setEmailError('');
                  }}
                  error={emailError}
                  startIcon={<Mail className="h-4 w-4" />}
                  className="bg-card/50"
                  autoComplete="email"
                  autoCapitalize="none"
                  required
                />
              </div>

              <div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    label={t('login.password', 'Secure Key')}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (passwordError) setPasswordError('');
                    }}
                    error={passwordError}
                    endIcon={showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    onEndIconClick={() => {
                      hapticFeedback('light');
                      setShowPassword(!showPassword);
                    }}
                    className="bg-card/50 pr-12"
                    autoComplete="current-password"
                    required
                  />
                </div>
              </div>
            </div>

            <motion.div whileTap={{ scale: 0.98 }}>
              <Button type="submit" className="h-14 w-full rounded-2xl bg-foreground text-background font-bold text-[14px] uppercase tracking-wider shadow-xl hover:bg-accent hover:text-white transition-all border-none">
                {t('login.loginBtn', 'Authorize Access')}
              </Button>
            </motion.div>
          </form>

          <footer className="space-y-8 text-center pt-8 border-t border-border">
            <p className="text-[12px] font-bold text-muted-foreground">
              {t('login.noAccount', 'New to the network?')}{' '}
              <button 
                onClick={() => navigate(`/register?redirectTo=${encodeURIComponent(redirectTo)}`)} 
                className="text-foreground hover:text-accent transition-colors uppercase tracking-widest text-[10px] font-black ml-2 underline underline-offset-4"
              >
                {t('login.registerLink', 'Initialize Registry')}
              </button>
            </p>

            <motion.button
              whileHover={{ x: 3 }}
              onClick={() => navigate('/country')}
              className="inline-flex items-center text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-foreground p-0 h-auto gap-3 transition-colors"
            >
              {t('login.skipToCountry', 'Global Discovery Protocol')}
              <div className="h-8 w-8 rounded-full bg-secondary border border-border flex items-center justify-center">
                <ArrowRight className="h-3 w-3" />
              </div>
            </motion.button>
          </footer>
        </div>
      </main>
    </div>
  );
}
