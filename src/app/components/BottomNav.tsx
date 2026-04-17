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

  const node = (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-100 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 safe-area-bottom shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
      <div className="relative grid grid-cols-6 bottom-nav-h">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            location.pathname === item.path ||
            (item.path === '/home' && location.pathname === '/') ||
            (item.path === '/community' && location.pathname.startsWith('/community')) ||
            (item.path === '/guide' && location.pathname.startsWith('/guide')) ||
            (item.path === '/messages' && location.pathname.startsWith('/messages'));

          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`relative flex flex-col items-center justify-center gap-1 px-1 transition-colors duration-150 ${
                isActive ? 'text-[#0D9488]' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="relative">
                <Icon className="h-5 w-5" strokeWidth={isActive ? 2.5 : 2} />
              </div>
              <span className={`text-[10px] font-semibold leading-none ${isActive ? 'text-[#0D9488]' : ''}`}>
                {item.label}
              </span>
              {isActive ? (
                <motion.div
                  layoutId="activeTabIndicator"
                  className="absolute top-0 h-0.5 w-8 rounded-full bg-[#0D9488]"
                  transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                />
              ) : null}
            </button>
          );
        })}
      </div>
    </div>
  );

  // Portaling avoids `position: fixed` being broken by ancestor transforms (e.g. page transitions).
  if (typeof document !== 'undefined') return createPortal(node, document.body);
  return node;
}
