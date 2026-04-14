import { useLocation, useNavigate } from 'react-router-dom';
import { Home, Compass, Car, UserRound, Users } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { hapticFeedback } from './ui/utils';

const navItems = [
  { path: '/home', icon: Home, label: 'home', touchArea: 'Home' },
  { path: '/explore', icon: Compass, label: 'explore', touchArea: 'Explore' },
  { path: '/transport', icon: Car, label: 'transport', touchArea: 'Transport' },
  { path: '/guide', icon: UserRound, label: 'guide', touchArea: 'Guide' },
  { path: '/community', icon: Users, label: 'community', touchArea: 'Community' },
] as const;

type NavItem = typeof navItems[number];

interface NavItemProps {
  item: NavItem;
  isActive: boolean;
  onClick: () => void;
}

function NavButton({ item, isActive, onClick }: NavItemProps) {
  const Icon = item.icon;
  const { t } = useTranslation();

  const handleClick = () => {
    hapticFeedback('light');
    onClick();
  };

  return (
    <button
      onClick={handleClick}
      className="relative flex flex-col items-center justify-center transition-all group outline-none touch-manipulation"
      aria-label={t(`nav.${item.label}`)}
    >
      {/* Active state background */}
      <AnimatePresence>
        {isActive && (
          <motion.div
            layoutId="nav-bg"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute inset-1.5 bg-gradient-to-t from-foreground/8 to-transparent rounded-2xl"
            transition={{ type: "spring", stiffness: 400, damping: 35 }}
          />
        )}
      </AnimatePresence>

      {/* Icon and label container with enhanced touch target (min 48x48px for mobile) */}
      <div className="relative flex flex-col items-center justify-center gap-1 z-10 px-2 py-2">
        <div className="flex items-center justify-center w-12 h-12 rounded-2xl transition-all duration-300 group-hover:scale-110 active:scale-90">
          <Icon
            className={`h-6 w-6 transition-all duration-300 ${
              isActive
                ? 'text-foreground drop-shadow-sm'
                : 'text-muted-foreground group-hover:text-foreground/80'
            }`}
            strokeWidth={isActive ? 2.5 : 2}
          />
        </div>
        <span
          className={`text-[10px] font-semibold uppercase tracking-wide transition-all duration-300 ${
            isActive ? 'text-foreground' : 'text-muted-foreground group-hover:text-foreground/70'
          }`}
        >
          {t(`nav.${item.label}`)}
        </span>
      </div>

      {/* Active indicator dot - positioned below the label */}
      {isActive && (
        <motion.div
          layoutId="nav-indicator"
          className="absolute -bottom-0.5 h-1.5 w-1.5 rounded-full bg-accent shadow-[0_0_8px_rgba(249,115,22,0.5)]"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
      )}
    </button>
  );
}

export default function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();

  const isDashboard =
    location.pathname.startsWith('/dashboard') ||
    location.pathname.startsWith('/admin/login') ||
    location.pathname.startsWith('/driver/') ||
    location.pathname.startsWith('/demo/driver-dashboard');

  if (isDashboard) return null;

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 px-3 pb-2 pt-2 pointer-events-none"
      style={{ paddingBottom: 'max(calc(env(safe-area-inset-bottom) + 8px), 12px)' }}
      aria-label="Main navigation"
    >
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 25 }}
        className="max-w-md mx-auto w-full pointer-events-auto"
      >
        {/* Glass container with enhanced shadow */}
        <div className="relative">
          {/* Backdrop glow */}
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/5 to-transparent rounded-3xl blur-xl" />

          {/* Main nav container - improved touch targets */}
          <div className="relative bg-background/85 backdrop-blur-2xl border border-border/60 rounded-3xl shadow-2xl shadow-foreground/10 overflow-hidden px-1 transition-colors duration-500">
            <div className="grid grid-cols-5 h-[72px]">
              {navItems.map((item) => (
                <NavButton
                  key={item.path}
                  item={item}
                  isActive={location.pathname === item.path}
                  onClick={() => navigate(item.path)}
                />
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </nav>
  );
}
