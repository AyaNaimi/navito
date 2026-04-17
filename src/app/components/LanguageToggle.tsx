import { Globe } from 'lucide-react';
import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

const languages = [
  { code: 'fr', label: 'FR', name: 'Francais' },
  { code: 'en', label: 'EN', name: 'English' },
  { code: 'ar', label: 'AR', name: 'Arabic' },
  { code: 'es', label: 'ES', name: 'Espanol' },
] as const;

const hiddenPrefixes = ['/splash', '/dashboard', '/profile', '/messages'];

export default function LanguageToggle() {
  const { pathname } = useLocation();
  const { language, setLanguage } = useAppContext();
  const [isOpen, setIsOpen] = useState(false);

  if (hiddenPrefixes.some((prefix) => pathname.startsWith(prefix))) {
    return null;
  }

  return (
    <div className="fixed left-4 top-4 z-[90] md:left-6 md:top-6">
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen((current) => !current)}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-white/60 bg-white/90 text-slate-700 shadow-lg shadow-slate-900/10 backdrop-blur"
          aria-label="Changer de langue"
        >
          <Globe className="h-5 w-5" />
        </button>

        {isOpen && (
          <>
            <button
              type="button"
              className="fixed inset-0 -z-10 cursor-default"
              onClick={() => setIsOpen(false)}
              aria-label="Fermer"
            />
            <div className="absolute right-0 mt-3 w-44 rounded-2xl border border-slate-200 bg-white p-2 shadow-2xl">
              {languages.map((item) => (
                <button
                  key={item.code}
                  type="button"
                  onClick={() => {
                    setLanguage(item.code);
                    setIsOpen(false);
                  }}
                  className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-sm transition-colors ${
                    language === item.code
                      ? 'bg-[#0D9488]/10 font-semibold text-[#0D9488]'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <span>{item.name}</span>
                  <span className="text-xs">{item.label}</span>
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
