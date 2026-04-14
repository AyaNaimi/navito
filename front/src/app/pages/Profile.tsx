import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Bell, Calendar, Car, Globe, Heart, 
  HelpCircle, LayoutDashboard, LogOut, Settings, 
  Shield, ShieldCheck, User, UserRound, ArrowRight,
  ShieldAlert, Sparkles, MapPin, Sun, Moon, ChevronRight
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '../components/ui/button';
import { Avatar, AvatarFallback } from '../components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Separator } from '../components/ui/separator';
import { useAppContext } from '../context/AppContext';
import { useTranslation } from 'react-i18next';

const reveal = {
  initial: { opacity: 0, y: 15 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
};

export default function Profile() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { resetFlow, userEmail, userName, userRole, theme, toggleTheme } = useAppContext();

  const roleMeta = {
    tourist: {
      title: t('profile.roles.tourist.title'),
      description: t('profile.roles.tourist.description'),
      chips: [t('profile.roles.tourist.chips.bookings'), t('profile.roles.tourist.chips.saved'), t('profile.roles.tourist.chips.support')],
    },
    guide: {
      title: t('profile.roles.guide.title'),
      description: t('profile.roles.guide.description'),
      chips: [t('profile.roles.guide.chips.requests'), t('profile.roles.guide.chips.schedule'), t('profile.roles.guide.chips.reviews')],
    },
    driver: {
      title: t('profile.roles.driver.title'),
      description: t('profile.roles.driver.description'),
      chips: [t('profile.roles.driver.chips.queue'), t('profile.roles.driver.chips.availability'), t('profile.roles.driver.chips.earnings')],
    },
    super_admin: {
      title: t('profile.roles.admin.title'),
      description: t('profile.roles.admin.description'),
      chips: [t('profile.roles.admin.chips.users'), t('profile.roles.admin.chips.operations'), t('profile.roles.admin.chips.reports')],
    },
  };

  const roleMenus = {
    tourist: [
      { icon: Heart, label: t('profile.menu.savedPlaces'), action: () => {} },
      { icon: Calendar, label: t('profile.menu.myBookings'), action: () => {} },
      { icon: Bell, label: t('profile.menu.notifications'), action: () => {} },
    ],
    guide: [
      { icon: LayoutDashboard, label: t('profile.menu.dashboard'), action: () => navigate('/dashboard/guide') },
      { icon: MapPin, label: t('profile.menu.guideRequests'), action: () => navigate('/guide') },
      { icon: Calendar, label: t('profile.menu.mySchedule'), action: () => {} },
    ],
    driver: [
      { icon: LayoutDashboard, label: t('profile.menu.dashboard'), action: () => navigate('/dashboard/driver') },
      { icon: Car, label: t('profile.menu.rideRequests'), action: () => navigate('/transport') },
      { icon: Bell, label: t('profile.menu.driverAlerts'), action: () => {} },
    ],
    super_admin: [
      { icon: LayoutDashboard, label: t('profile.menu.dashboard'), action: () => navigate('/dashboard/superadmin') },
      { icon: ShieldCheck, label: t('profile.menu.platformOverview'), action: () => {} },
      { icon: Settings, label: t('profile.menu.adminSettings'), action: () => {} },
    ],
  };

  const commonMenuItems = [
    { icon: Globe, label: t('profile.menu.language'), action: () => navigate('/language') },
    { icon: ShieldAlert, label: t('profile.menu.privacySafety'), action: () => {} },
    { icon: HelpCircle, label: t('profile.menu.helpSupport'), action: () => {} },
    { icon: Settings, label: t('profile.menu.settings'), action: () => {} },
  ];

  const menuItems = [...(roleMenus[userRole] || roleMenus.tourist), ...commonMenuItems];
  const activeRole = roleMeta[userRole] || roleMeta.tourist;

  return (
    <div className="min-h-screen w-full bg-background flex flex-col font-sans antialiased text-foreground overflow-x-hidden transition-colors duration-500">
      {/* Ambient Background */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-10 right-0 w-[50%] h-[40%] rounded-full bg-blue-500/[0.05] blur-[120px]" />
        <div className="absolute bottom-20 left-0 w-[40%] h-[40%] rounded-full bg-emerald-500/[0.05] blur-[100px]" />
      </div>

      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-50 bg-background/80 backdrop-blur-2xl border-b border-border px-6 py-10"
      >
        <div className="max-w-xl mx-auto w-full">
          <div className="flex items-center justify-between mb-10">
            <motion.button 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => navigate(-1)} 
              className="h-12 w-12 flex items-center justify-center rounded-2xl bg-secondary border border-border"
            >
              <ArrowLeft className="h-5 w-5" />
            </motion.button>
            <h1 className="text-xl font-black uppercase tracking-widest italic">{t('profile.title')}</h1>
            <motion.button 
              whileHover={{ rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={toggleTheme}
              className="h-12 w-12 flex items-center justify-center rounded-2xl bg-secondary border border-border text-foreground"
            >
              {theme === 'dark' ? <Sun className="h-5 w-5 text-accent" /> : <Moon className="h-5 w-5 text-primary" />}
            </motion.button>
          </div>

          <div className="flex items-center gap-6">
            <div className="relative h-24 w-24">
              <Avatar className="h-full w-full rounded-3xl border border-border shadow-2xl">
                <AvatarFallback className="bg-secondary text-foreground">
                  <UserRound className="h-10 w-10" />
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-2 -right-2 h-8 w-8 rounded-xl bg-foreground text-background flex items-center justify-center shadow-2xl border border-border">
                <ShieldCheck className="h-4 w-4" />
              </div>
            </div>
            <div className="min-w-0">
              <h2 className="text-2xl font-black tracking-tight truncate uppercase">{userName}</h2>
              <p className="text-[14px] font-medium text-muted-foreground truncate mt-1">{userEmail}</p>
              <Badge className="mt-3 bg-accent text-accent-foreground border-none font-black text-[10px] uppercase tracking-[0.2em] px-3 py-1">
                {userRole.replace('_', ' ')}
              </Badge>
            </div>
          </div>
        </div>
      </motion.header>

      <main className="flex-1 max-w-xl mx-auto w-full px-6 py-10 space-y-12 pb-32">
        {/* Role Intelligence */}
        <motion.section {...reveal}>
          <Card className="border-border bg-card shadow-2xl overflow-hidden rounded-[2.5rem]">
            <CardHeader className="p-8">
              <CardTitle className="text-[16px] font-black text-foreground uppercase tracking-widest flex items-center gap-3 italic">
                <Sparkles className="h-4 w-4 text-accent" />
                {activeRole.title}
              </CardTitle>
              <CardDescription className="text-[13px] leading-relaxed text-muted-foreground font-medium mt-3">
                {activeRole.description}
              </CardDescription>
            </CardHeader>
            <div className="px-8 pb-8">
              <div className="flex flex-wrap gap-2">
                {activeRole.chips.map((chip) => (
                  <Badge key={chip} className="bg-secondary text-muted-foreground border-none text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-xl transition-all">
                    {chip}
                  </Badge>
                ))}
              </div>
            </div>
          </Card>
        </motion.section>

        {/* Menu Items */}
        <div className="space-y-6">
          <p className="text-[10px] font-black uppercase tracking-[0.25em] text-muted-foreground px-1">Account Management</p>
          <div className="space-y-4">
            {menuItems.map((item, idx) => (
              <motion.button
                key={item.label}
                {...reveal}
                transition={{ delay: idx * 0.05 }}
                onClick={item.action}
                className="w-full h-20 flex items-center justify-between p-6 rounded-[2rem] border border-border bg-card/50 hover:bg-card hover:border-accent/10 transition-all group"
              >
                <div className="flex items-center gap-5">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary group-hover:bg-foreground transition-all group-hover:rotate-12">
                    <item.icon className="h-5 w-5 text-foreground group-hover:text-background transition-colors" />
                  </div>
                  <span className="text-[15px] font-black text-foreground uppercase tracking-tight">{item.label}</span>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-all group-hover:translate-x-1" />
              </motion.button>
            ))}
          </div>
        </div>

        {/* Exit Action */}
        <div className="pt-6">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              resetFlow();
              navigate('/language');
            }}
            className="h-16 w-full rounded-[2rem] border border-destructive/10 bg-destructive/5 text-destructive font-black uppercase tracking-[0.2em] text-[11px] shadow-sm flex items-center justify-center gap-3 active:bg-destructive active:text-white transition-all shadow-xl shadow-destructive/5"
          >
            <LogOut className="h-5 w-5" />
            {t('common.signOut')}
          </motion.button>
        </div>
      </main>
    </div>
  );
}
