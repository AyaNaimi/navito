import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Globe, ChevronRight, Languages } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { useAppContext } from '../context/AppContext';
import { useTranslation } from 'react-i18next';

const languages = [
  { code: 'en', name: 'English', tag: 'EN', flag: '🇬🇧' },
  { code: 'fr', name: 'Français', tag: 'FR', flag: '🇫🇷' },
  { code: 'ar', name: 'العربية', tag: 'AR', flag: '🇲🇦' },
  { code: 'es', name: 'Español', tag: 'ES', flag: '🇪🇸' },
  { code: 'de', name: 'Deutsch', tag: 'DE', flag: '🇩🇪' },
  { code: 'zh', name: '中文', tag: 'ZH', flag: '🇨🇳' },
];

const reveal = {
  initial: { opacity: 0, y: 15 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as any },
};

export default function LanguageSelector() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { language, setLanguage } = useAppContext();
  const [selectedLanguage, setSelectedLanguage] = useState(language);

  const handleContinue = () => {
    setLanguage(selectedLanguage);
    navigate('/country');
  };

  return (
    <div className="min-h-screen w-full bg-[#020617] flex flex-col font-sans antialiased text-white overflow-hidden relative">
      {/* Background Decor */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[45%] h-[45%] bg-emerald-500/10 blur-[130px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[45%] h-[45%] bg-blue-500/10 blur-[130px] rounded-full" />
      </div>

      {/* Header */}
      <header className="px-6 pt-20 pb-12 max-w-xl mx-auto w-full text-center relative z-10">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0, rotate: -10 }}
          animate={{ scale: 1, opacity: 1, rotate: 0 }}
          className="mx-auto flex h-20 w-20 items-center justify-center rounded-[2rem] bg-white border border-white shadow-2xl mb-8 group"
        >
          <Languages className="h-10 w-10 text-slate-950 group-hover:rotate-12 transition-transform duration-500" />
        </motion.div>
        <motion.div {...reveal}>
          <h1 className="text-3xl font-black tracking-tight uppercase italic italic-none">Navito</h1>
          <p className="mt-4 text-[10px] font-black uppercase tracking-[0.4em] text-emerald-500">
             {t('language.title')}
          </p>
          <p className="mt-6 text-[13px] font-medium text-slate-500 max-w-[240px] mx-auto leading-relaxed">
            {t('language.subtitle')}
          </p>
        </motion.div>
      </header>

      {/* Language List */}
      <main className="flex-1 px-6 max-w-xl mx-auto w-full pb-40 relative z-10 overflow-y-auto">
        <div className="grid grid-cols-1 gap-4">
          {languages.map((item, index) => (
            <motion.button
              key={item.code}
              {...reveal}
              transition={{ ...reveal.transition, delay: index * 0.05 }}
              onClick={() => setSelectedLanguage(item.code)}
              className={`group flex w-full items-center justify-between rounded-[2rem] border px-6 py-5 transition-all outline-none ${
                selectedLanguage === item.code 
                  ? 'border-white bg-white text-slate-950 shadow-[0_20px_40px_rgba(255,255,255,0.1)]' 
                  : 'border-white/5 bg-slate-900/50 text-slate-400 hover:border-white/10 hover:bg-slate-900'
              }`}
            >
              <div className="flex items-center gap-6">
                <div className={`flex h-12 w-12 items-center justify-center rounded-2xl text-[11px] font-black tracking-widest transition-all ${
                  selectedLanguage === item.code 
                    ? 'bg-slate-900 text-white' 
                    : 'bg-white/5 text-slate-500 group-hover:bg-white/10'
                }`}>
                  {item.tag}
                </div>
                <div className="text-left">
                  <span className="text-[16px] font-black uppercase tracking-tight">{item.name}</span>
                  <span className="ml-3 grayscale group-hover:grayscale-0 transition-all opacity-60 group-hover:opacity-100">{item.flag}</span>
                </div>
              </div>
              {selectedLanguage === item.code && (
                <motion.div 
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="flex h-7 w-7 items-center justify-center rounded-xl bg-emerald-500 text-slate-950"
                >
                  <Check className="h-4 w-4" />
                </motion.div>
              )}
            </motion.button>
          ))}
        </div>
      </main>

      {/* Action Area */}
      <footer className="fixed bottom-0 left-0 right-0 p-8 z-50">
        <div className="max-w-xl mx-auto">
          <div className="p-2 rounded-[2.5rem] bg-slate-950/40 backdrop-blur-3xl border border-white/5 shadow-2xl">
            <Button
              onClick={handleContinue}
              className="h-16 w-full rounded-[2rem] bg-white text-slate-950 hover:bg-emerald-500 hover:text-white font-black text-[12px] uppercase tracking-[0.25em] transition-all shadow-2xl group active:scale-[0.98]"
            >
              {t('common.continue')}
              <ChevronRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>
        </div>
      </footer>
    </div>
  );
}
