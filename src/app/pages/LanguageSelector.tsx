import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check } from 'lucide-react';
import { Button } from '../components/ui/button';
import { useAppContext } from '../context/AppContext';

const languages = [
  { code: 'en', name: 'English', tag: 'EN' },
  { code: 'fr', name: 'Français', tag: 'FR' },
  { code: 'ar', name: 'العربية', tag: 'AR' },
  { code: 'es', name: 'Español', tag: 'ES' },
  { code: 'de', name: 'Deutsch', tag: 'DE' },
  { code: 'zh', name: '中文', tag: 'ZH' },
];

export default function LanguageSelector() {
  const navigate = useNavigate();
  const { language, setLanguage } = useAppContext();
  const [selectedLanguage, setSelectedLanguage] = useState(language);

  return (
    <div className="size-full bg-white flex flex-col">
      <div className="border-b p-6 animate-enter-hero">
        <h1 className="text-2xl font-bold text-gray-900">Choisissez votre langue</h1>
        <p className="mt-1 text-sm text-gray-600">C’est la première étape du flux Navito.</p>
      </div>

      <div className="flex-1 overflow-auto p-6">
        <div className="mx-auto max-w-md space-y-3">
          {languages.map((item, index) => (
            <button
              key={item.code}
              onClick={() => setSelectedLanguage(item.code)}
              className={`animate-enter-card flex w-full items-center justify-between rounded-xl border-2 p-4 transition-all ${
                selectedLanguage === item.code ? 'border-[#0D9488] bg-[#0D9488]/5' : 'border-gray-200 hover:border-gray-300'
              }`}
              style={{ animationDelay: `${index * 70}ms` }}
            >
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0D9488]/10 text-sm font-semibold text-[#0D9488]">
                  {item.tag}
                </span>
                <span className="font-medium text-gray-900">{item.name}</span>
              </div>
              {selectedLanguage === item.code && <Check className="h-5 w-5 text-[#0D9488]" />}
            </button>
          ))}
        </div>
      </div>

      <div className="p-6">
        <Button
          onClick={() => {
            setLanguage(selectedLanguage);
            navigate('/country');
          }}
          className="h-12 w-full rounded-xl bg-[#0D9488] text-white hover:bg-[#0D9488]/90"
        >
          Continuer
        </Button>
      </div>
    </div>
  );
}
