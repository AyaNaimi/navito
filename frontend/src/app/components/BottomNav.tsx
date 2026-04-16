import { useLocation, useNavigate } from 'react-router-dom';
import { Home, Compass, Car, UserRound, Users, MessageCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { createPortal } from 'react-dom';

const navItems = [
  { path: '/home', icon: Home, label: 'Accueil' },
  { path: '/explore', icon: Compass, label: 'Explorer' },
  { path: '/transport', icon: Car, label: 'Transport' },
  { path: '/guide', icon: UserRound, label: 'Guide' },
  { path: '/community', icon: Users, label: 'Activites' },
  { path: '/messages', icon: MessageCircle, label: 'Messages' },
];

export default function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();

  const nav = (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 safe-area-bottom z-50 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
      <div className="grid grid-cols-6 h-16 relative">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path || 
            (item.path === '/home' && location.pathname === '/') ||
            (item.path === '/community' && location.pathname.startsWith('/community')) ||
            (item.path === '/guide' && location.pathname.startsWith('/guide')) ||
            (item.path === '/messages' && location.pathname.startsWith('/messages'));

          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`relative flex flex-col items-center justify-center gap-0.5 transition-all duration-200 ${
                isActive ? 'text-[#0D9488]' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute -top-3 w-12 h-12 bg-[#0D9488]/10 rounded-full"
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
              <div className={`relative ${isActive ? 'scale-110' : 'scale-100'} transition-transform duration-200`}>
                <Icon className="h-5 w-5" strokeWidth={isActive ? 2.5 : 2} />
              </div>
              <span className={`text-[9px] font-semibold ${isActive ? 'text-[#0D9488]' : ''}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );

  if (typeof document === 'undefined') {
    return nav;
  }

  return createPortal(nav, document.body);
}
