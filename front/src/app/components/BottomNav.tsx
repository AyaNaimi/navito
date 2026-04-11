import { useLocation, useNavigate } from 'react-router-dom';
import { Home, Compass, Car, UserRound, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

export default function BottomNav() {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { path: '/home', icon: Home, label: t('nav.home') },
    { path: '/explore', icon: Compass, label: t('nav.explore') },
    { path: '/transport', icon: Car, label: t('nav.transport') },
    { path: '/guide', icon: UserRound, label: t('nav.guide') },
    { path: '/community', icon: Users, label: t('nav.community') },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-[#E5E5E5] safe-area-bottom z-50 transition-all font-sans">
      <div className="max-w-xl mx-auto w-full grid grid-cols-5 h-16">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className="relative flex flex-col items-center justify-center transition-all group overflow-hidden"
            >
              <div className="relative flex flex-col items-center gap-1 transition-all group-hover:scale-105 active:scale-95">
                <Icon className={`h-5 w-5 transition-colors ${
                  isActive ? 'text-[#171717]' : 'text-[#A3A3A3] group-hover:text-[#171717]'
                }`} />
                <span className={`text-[10px] font-bold uppercase tracking-widest transition-colors ${
                  isActive ? 'text-[#171717]' : 'text-[#A3A3A3] group-hover:text-[#171717]'
                }`}>
                  {item.label}
                </span>
                {isActive && (
                  <motion.div 
                    layoutId="nav-active"
                    className="absolute -bottom-1 h-0.5 w-4 rounded-full bg-[#171717]" 
                  />
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

