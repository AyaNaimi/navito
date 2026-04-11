import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Globe, ChevronRight } from 'lucide-react';
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
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: [0.23, 1, 0.32, 1] as any },
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
    <div className="min-h-screen w-full bg-[#FAFAFA] flex flex-col font-sans antialiased text-[#171717]">
      {/* Header */}
      <header className="px-6 py-12 max-w-xl mx-auto w-full text-center">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white border border-[#E5E5E5] shadow-sm mb-6"
        >
          <Globe className="h-8 w-8 text-[#171717]" />
        </motion.div>
        <motion.div {...reveal}>
          <h1 className="text-[24px] font-bold tracking-tight">{t('language.title')}</h1>
          <p className="mt-2 text-[14px] font-medium text-[#737373] max-w-[280px] mx-auto">
            {t('language.subtitle')}
          </p>
        </motion.div>
      </header>

      {/* Language List */}
      <main className="flex-1 px-6 max-w-xl mx-auto w-full pb-32">
        <div className="space-y-3">
          {languages.map((item, index) => (
            <motion.div
              key={item.code}
              {...reveal}
              transition={{ ...reveal.transition, delay: index * 0.05 }}
            >
              <Card
                onClick={() => setSelectedLanguage(item.code)}
                className={`group cursor-pointer flex w-full items-center justify-between rounded-2xl border p-4 transition-all ${
                  selectedLanguage === item.code 
                    ? 'border-[#171717] bg-white shadow-md' 
                    : 'border-[#E5E5E5] bg-white hover:border-[#171717]/30 hover:shadow-sm'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`flex h-11 w-11 items-center justify-center rounded-xl text-[13px] font-bold transition-all ${
                    selectedLanguage === item.code 
                      ? 'bg-[#171717] text-white shadow-lg shadow-black/10' 
                      : 'bg-[#F5F5F7] text-[#737373]'
                  }`}>
                    {item.tag}
                  </div>
                  <div>
                    <span className="text-[15px] font-bold text-[#171717]">{item.name}</span>
                    <span className="ml-2 text-[14px] opacity-60">{item.flag}</span>
                  </div>
                </div>
                {selectedLanguage === item.code ? (
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#171717] text-white">
                    <Check className="h-3.5 w-3.5" />
                  </div>
                ) : (
                  <ChevronRight className="h-4 w-4 text-[#E5E5E5] group-hover:text-[#A3A3A3] transition-colors" />
                )}
              </Card>
            </motion.div>
          ))}
        </div>
      </main>

      {/* Footer / Action */}
      <footer className="fixed bottom-0 left-0 right-0 p-6 bg-white/80 backdrop-blur-xl border-t border-[#E5E5E5] z-50">
        <div className="max-w-md mx-auto">
          <Button
            onClick={handleContinue}
            className="h-14 w-full rounded-2xl bg-[#171717] text-white hover:opacity-90 font-bold text-[14px] uppercase tracking-[0.2em] transition-all shadow-xl shadow-black/10 group active:scale-[0.98]"
          >
            {t('language.continue')}
            <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>
      </footer>
    </div>
  );
}

