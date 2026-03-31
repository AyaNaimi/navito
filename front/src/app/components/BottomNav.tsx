import { useLocation, useNavigate } from 'react-router-dom';
import { Home, Compass, Car, UserRound, Users } from 'lucide-react';
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
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 safe-area-bottom z-50">
      <div className="grid grid-cols-5 h-16">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center justify-center gap-1 transition-colors ${
                isActive ? 'text-[#0D9488]' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
