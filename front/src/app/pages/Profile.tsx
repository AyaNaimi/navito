import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Bell, Calendar, Car, Globe, Heart, HelpCircle, LayoutDashboard, LogOut, Settings, Shield, ShieldCheck, User, UserRound, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '../components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Separator } from '../components/ui/separator';
import { useAppContext } from '../context/AppContext';
import { useTranslation } from 'react-i18next';

const reveal = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: [0.23, 1, 0.32, 1] },
};

export default function Profile() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { resetFlow, userEmail, userName, userRole } = useAppContext();

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
      { icon: LayoutDashboard, label: t('profile.menu.guideRequests'), action: () => navigate('/guide') },
      { icon: Calendar, label: t('profile.menu.mySchedule'), action: () => {} },
      { icon: UserRound, label: t('profile.menu.travelerReviews'), action: () => {} },
    ],
    driver: [
      { icon: Car, label: t('profile.menu.rideRequests'), action: () => navigate('/transport') },
      { icon: Calendar, label: t('profile.menu.availability'), action: () => {} },
      { icon: Bell, label: t('profile.menu.driverAlerts'), action: () => {} },
    ],
    super_admin: [
      { icon: ShieldCheck, label: t('profile.menu.platformOverview'), action: () => {} },
      { icon: User, label: t('profile.menu.userManagement'), action: () => {} },
      { icon: Settings, label: t('profile.menu.adminSettings'), action: () => {} },
    ],
  };

  const commonMenuItems = [
    { icon: Globe, label: t('profile.menu.language'), action: () => navigate('/language') },
    { icon: Shield, label: t('profile.menu.privacySafety'), action: () => {} },
    { icon: HelpCircle, label: t('profile.menu.helpSupport'), action: () => {} },
    { icon: Settings, label: t('profile.menu.settings'), action: () => {} },
  ];

  const menuItems = [...roleMenus[userRole], ...commonMenuItems];
  const activeRole = roleMeta[userRole];

  return (
    <div className="min-h-screen w-full bg-[#FAFAFA] flex flex-col font-sans antialiased text-[#171717]">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-50 border-b border-[#E5E5E5] bg-white/80 backdrop-blur-xl px-6 py-6"
      >
        <div className="max-w-xl mx-auto w-full">
          <div className="flex items-center justify-between mb-8">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={() => navigate(-1)} 
              className="h-10 w-10 rounded-full bg-white border-[#E5E5E5]"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" className="h-10 w-10 rounded-full bg-white border-[#E5E5E5]">
              <Settings className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-center gap-5">
            <div className="relative">
              <Avatar className="h-20 w-20 border border-[#E5E5E5]">
                <AvatarImage src="" />
                <AvatarFallback className="bg-[#F5F5F7] text-[#171717]">
                  <User className="h-8 w-8" />
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-white border border-[#E5E5E5] flex items-center justify-center shadow-sm">
                <ShieldCheck className="h-3 w-3 text-[#171717]" />
              </div>
            </div>
            <div className="space-y-1">
              <h2 className="text-[20px] font-bold tracking-tight">{userName}</h2>
              <p className="text-[13px] font-medium text-[#737373]">{userEmail}</p>
              <Badge variant="secondary" className="mt-1 bg-[#F5F5F7] text-[#171717] border-[#E5E5E5] hover:bg-[#F5F5F7]">
                {userRole.replace('_', ' ')}
              </Badge>
            </div>
          </div>
        </div>
      </motion.header>

      <main className="flex-1 overflow-auto px-6 py-8 space-y-10 max-w-xl mx-auto w-full">
        {/* Role Intelligence */}
        <motion.section {...reveal} className="w-full">
          <Card className="border-[#E5E5E5] bg-white shadow-sm overflow-hidden rounded-2xl">
            <CardHeader className="p-6">
              <CardTitle className="text-[15px] font-bold text-[#171717]">{activeRole.title}</CardTitle>
              <CardDescription className="text-[12px] leading-relaxed text-[#737373] font-medium mt-1">
                {activeRole.description}
              </CardDescription>
            </CardHeader>
            <Separator className="bg-[#F5F5F7]" />
            <CardContent className="p-6">
              <div className="flex flex-wrap gap-2">
                {activeRole.chips.map((chip) => (
                  <Badge key={chip} variant="outline" className="bg-[#F5F5F7] border-[#E5E5E5] text-[10px] font-bold uppercase tracking-wider text-[#171717] px-3 py-1 rounded-full">
                    {chip}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.section>

        {/* Menu Items */}
        <div className="space-y-4">
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#737373] ml-1">Account Management</p>
          <div className="space-y-3">
            {menuItems.map((item, idx) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.label}
                  {...reveal}
                  transition={{ delay: idx * 0.05 }}
                >
                  <Button
                    variant="outline"
                    onClick={item.action}
                    className="w-full h-16 justify-between p-4 rounded-2xl border-[#E5E5E5] bg-white hover:bg-[#F5F5F7] group transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F5F5F7] group-hover:bg-white transition-colors">
                        <Icon className="h-4.5 w-4.5 text-[#171717]" />
                      </div>
                      <span className="text-[14px] font-bold text-[#171717]">{item.label}</span>
                    </div>
                    <ArrowRight className="h-3.5 w-3.5 text-[#A3A3A3] opacity-0 group-hover:opacity-100 transition-all" />
                  </Button>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Exit Action */}
        <div className="pt-4 pb-12">
          <Button
            variant="outline"
            onClick={() => {
              resetFlow();
              navigate('/language');
            }}
            className="h-14 w-full rounded-2xl border-[#E5E5E5] bg-white hover:bg-[#FEF2F2] hover:border-[#FEE2E2] hover:text-[#EF4444] transition-all group shadow-sm flex items-center justify-center gap-3"
          >
            <LogOut className="h-4.5 w-4.5 text-[#737373] group-hover:text-[#EF4444] transition-colors" />
            <span className="text-[13px] font-bold uppercase tracking-widest text-[#737373]">
              {t('profile.menu.signOut')}
            </span>
          </Button>
        </div>
      </main>
    </div>
  );
}

