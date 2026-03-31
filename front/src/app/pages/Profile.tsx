import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Bell, Calendar, Car, Globe, Heart, HelpCircle, LayoutDashboard, LogOut, Settings, Shield, ShieldCheck, User, UserRound } from 'lucide-react';
import { Button } from '../components/ui/button';
import { useAppContext } from '../context/AppContext';
import { useTranslation } from 'react-i18next';

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
    <div className="size-full bg-gray-50 flex flex-col">
      <div className="bg-[#0D9488] px-6 py-6 text-white">
        <button onClick={() => navigate(-1)} className="mb-4">
          <ArrowLeft className="h-6 w-6" />
        </button>

        <div className="flex items-center gap-4">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/20">
            <User className="h-10 w-10 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">{userName}</h2>
            <p className="text-white/80">{userEmail}</p>
            <p className="mt-1 text-sm uppercase tracking-wide text-white/70">{userRole.replace('_', ' ')}</p>
          </div>
        </div>
      </div>

      <div className="flex-1 space-y-2 overflow-auto px-6 py-4">
        <div className="mb-4 rounded-2xl bg-white p-5 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900">{activeRole.title}</h3>
          <p className="mt-1 text-sm text-gray-600">{activeRole.description}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {activeRole.chips.map((chip) => (
              <span key={chip} className="rounded-full bg-[#0D9488]/10 px-3 py-1 text-xs font-medium text-[#0D9488]">
                {chip}
              </span>
            ))}
          </div>
        </div>

        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.label}
              onClick={item.action}
              className="flex w-full items-center justify-between rounded-xl border border-gray-200 bg-white p-4 transition-colors hover:border-[#0D9488]"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
                  <Icon className="h-5 w-5 text-gray-600" />
                </div>
                <span className="font-medium text-gray-900">{item.label}</span>
              </div>
              <span className="text-gray-400">›</span>
            </button>
          );
        })}
      </div>

      <div className="border-t bg-white px-6 py-4">
        <Button
          onClick={() => {
            resetFlow();
            navigate('/language');
          }}
          variant="outline"
          className="h-12 w-full rounded-xl border-red-200 text-red-600 hover:bg-red-50"
        >
          <LogOut className="mr-2 h-5 w-5" />
          {t('profile.menu.signOut')}
        </Button>
      </div>
    </div>
  );
}
