import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Bell, Calendar, Car, Heart, HelpCircle, LayoutDashboard, LogOut, MessageSquare, Settings, Shield, ShieldCheck, User, UserRound, ChevronRight } from 'lucide-react';
import { Button } from '../components/ui/button';
import { useAppContext } from '../context/AppContext';
import { motion } from 'motion/react';

export default function Profile() {
  const navigate = useNavigate();
  const { logout, userEmail, userName, userRole } = useAppContext();

  const roleMeta = {
    tourist: {
      title: 'Tourist Dashboard',
      description: 'Explore cities, request guides, book drivers, and join activities.',
      chips: ['Bookings', 'Saved places', 'Travel support'],
      gradient: 'from-[#0D9488] to-[#0891B2]',
    },
    guide: {
      title: 'Guide Dashboard',
      description: 'Manage guide requests, availability, and your city tours.',
      chips: ['Requests', 'Schedule', 'Reviews'],
      gradient: 'from-purple-600 to-pink-600',
    },
    driver: {
      title: 'Driver Dashboard',
      description: 'Manage ride requests, availability, and transport activity.',
      chips: ['Ride queue', 'Availability', 'Earnings'],
      gradient: 'from-amber-600 to-orange-600',
    },
    super_admin: {
      title: 'Super Admin Dashboard',
      description: 'Oversee users, operations, and platform-wide settings.',
      chips: ['Users', 'Operations', 'Reports'],
      gradient: 'from-red-600 to-rose-600',
    },
  } as const;

  const roleMenus = {
    tourist: [
      { icon: Heart, label: 'Saved Places', action: () => {} },
      { icon: Calendar, label: 'My Bookings', action: () => {} },
      { icon: Bell, label: 'Notifications', action: () => {} },
    ],
    guide: [
      { icon: LayoutDashboard, label: 'Guide Dashboard', action: () => navigate('/dashboard/guide') },
      { icon: Calendar, label: 'My Schedule', action: () => {} },
      { icon: UserRound, label: 'Traveler Reviews', action: () => {} },
    ],
    driver: [
      { icon: Car, label: 'Ride Requests', action: () => navigate('/dashboard/driver') },
      { icon: UserRound, label: 'Driver Profile', action: () => navigate('/driver/profile') },
      { icon: Calendar, label: 'Availability', action: () => {} },
      { icon: Bell, label: 'Driver Alerts', action: () => {} },
    ],
    super_admin: [
      { icon: ShieldCheck, label: 'Platform Overview', action: () => navigate('/dashboard/superadmin') },
      { icon: User, label: 'User Management', action: () => {} },
      { icon: Settings, label: 'Admin Settings', action: () => {} },
    ],
  } as const;

  const commonMenuItems = [
    { icon: MessageSquare, label: 'Messages', action: () => navigate('/messages') },
    { icon: Shield, label: 'Privacy & Safety', action: () => {} },
    { icon: HelpCircle, label: 'Help & Support', action: () => {} },
    { icon: Settings, label: 'Settings', action: () => {} },
  ];

  const menuItems = [...roleMenus[userRole], ...commonMenuItems];
  const activeRole = roleMeta[userRole];


  return (
    <div className="size-full flex flex-col bg-gradient-to-b from-gray-50 to-white">
      <div className={`bg-gradient-to-r ${activeRole.gradient} text-white px-6 py-6 shadow-lg`}>
        <button onClick={() => navigate(-1)} className="mb-4 text-white/80 hover:text-white transition-colors">
          <ArrowLeft className="h-6 w-6" />
        </button>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4"
        >
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm shadow-lg">
            <User className="h-10 w-10" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">{userName}</h2>
            <p className="text-white/80 text-sm">{userEmail}</p>
            <p className="mt-1 text-xs uppercase tracking-wider text-white/60">{userRole.replace('_', ' ')}</p>
          </div>
        </motion.div>
      </div>

      <div className="flex-1 overflow-auto px-6 py-4">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6 rounded-2xl bg-white p-5 shadow-sm border border-gray-100"
        >
          <h3 className="text-lg font-bold text-gray-900">{activeRole.title}</h3>
          <p className="mt-1 text-sm text-gray-500">{activeRole.description}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {activeRole.chips.map((chip, index) => (
              <motion.span 
                key={chip}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 + index * 0.05 }}
                className="rounded-full bg-[#0D9488]/10 px-3 py-1.5 text-xs font-semibold text-[#0D9488]"
              >
                {chip}
              </motion.span>
            ))}
          </div>
        </motion.div>

        <div className="space-y-3">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.button
                key={item.label}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 + index * 0.05 }}
                onClick={item.action}
                className="group flex w-full items-center justify-between rounded-2xl border-2 border-gray-100 bg-white p-4 transition-all duration-200 hover:border-[#0D9488]/50 hover:shadow-md active:scale-[0.99]"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-50 group-hover:bg-[#0D9488]/10 transition-colors">
                    <Icon className="h-5 w-5 text-gray-500 group-hover:text-[#0D9488] transition-colors" />
                  </div>
                  <span className="font-semibold text-gray-900 group-hover:text-[#0D9488] transition-colors">{item.label}</span>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-300 group-hover:text-[#0D9488] group-hover:translate-x-1 transition-all" />
              </motion.button>
            );
          })}
        </div>
      </div>

      <div className="border-t border-gray-100 bg-white/80 backdrop-blur-md px-6 py-4">
        <Button
          onClick={async () => {
            await logout();
            navigate('/login', { replace: true });
          }}
          variant="outline"
          className="h-12 w-full rounded-2xl border-2 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 transition-all font-semibold"
        >
          <LogOut className="mr-2 h-5 w-5" />
          Sign Out
        </Button>
      </div>
    </div>
  );
}
