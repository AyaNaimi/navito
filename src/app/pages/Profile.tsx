import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Bell, Calendar, Car, Globe, Heart, HelpCircle, LayoutDashboard, LogOut, Settings, Shield, ShieldCheck, User, UserRound } from 'lucide-react';
import { Button } from '../components/ui/button';
import { useAppContext } from '../context/AppContext';

export default function Profile() {
  const navigate = useNavigate();
  const { resetFlow, userEmail, userName, userRole } = useAppContext();

  const roleMeta = {
    tourist: {
      title: 'Tourist Dashboard',
      description: 'Explore cities, request guides, book drivers, and join activities.',
      chips: ['Bookings', 'Saved places', 'Travel support'],
    },
    guide: {
      title: 'Guide Dashboard',
      description: 'Manage guide requests, availability, and your city tours.',
      chips: ['Requests', 'Schedule', 'Reviews'],
    },
    driver: {
      title: 'Driver Dashboard',
      description: 'Manage ride requests, availability, and transport activity.',
      chips: ['Ride queue', 'Availability', 'Earnings'],
    },
    super_admin: {
      title: 'Super Admin Dashboard',
      description: 'Oversee users, operations, and platform-wide settings.',
      chips: ['Users', 'Operations', 'Reports'],
    },
  } as const;

  const roleMenus = {
    tourist: [
      { icon: Heart, label: 'Saved Places', action: () => {} },
      { icon: Calendar, label: 'My Bookings', action: () => {} },
      { icon: Bell, label: 'Notifications', action: () => {} },
    ],
    guide: [
      { icon: LayoutDashboard, label: 'Guide Requests', action: () => navigate('/guide') },
      { icon: Calendar, label: 'My Schedule', action: () => {} },
      { icon: UserRound, label: 'Traveler Reviews', action: () => {} },
    ],
    driver: [
      { icon: Car, label: 'Ride Requests', action: () => navigate('/transport') },
      { icon: Calendar, label: 'Availability', action: () => {} },
      { icon: Bell, label: 'Driver Alerts', action: () => {} },
    ],
    super_admin: [
      { icon: ShieldCheck, label: 'Platform Overview', action: () => {} },
      { icon: User, label: 'User Management', action: () => {} },
      { icon: Settings, label: 'Admin Settings', action: () => {} },
    ],
  } as const;

  const commonMenuItems = [
    { icon: Globe, label: 'Language', action: () => navigate('/language') },
    { icon: Shield, label: 'Privacy & Safety', action: () => {} },
    { icon: HelpCircle, label: 'Help & Support', action: () => {} },
    { icon: Settings, label: 'Settings', action: () => {} },
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
          Sign Out
        </Button>
      </div>
    </div>
  );
}
