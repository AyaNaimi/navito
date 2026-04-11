import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Camera,
  Upload,
  Sparkles,
  Copy,
  Check,
  ChevronDown,
  RotateCcw,
  Info,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import BottomNav from '../components/BottomNav';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Skeleton } from '../components/ui/skeleton';
import { toast } from 'sonner';
import Tesseract from 'tesseract.js';
import { SUPPORTED_LANGUAGES, translateText } from '../services/translation';

const reveal = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: [0.23, 1, 0.32, 1] as any },
};

/* ─────────────────────────────────────────────
   Translation skeleton
───────────────────────────────────────────── */
function TranslationSkeleton() {
  return (
    <div className="space-y-4 mt-2">
      <div className="flex items-center gap-2 mb-2">
        <Skeleton className="w-5 h-5 rounded-full" />
        <Skeleton className="w-32 h-3" />
      </div>
      <Card className="rounded-2xl border-[#E5E5E5] bg-white p-6 space-y-4 shadow-sm">
        <Skeleton className="w-3/4 h-3 rounded-full" />
        <Skeleton className="w-full h-3 rounded-full" />
        <Skeleton className="w-5/6 h-3 rounded-full" />
        <Skeleton className="w-2/3 h-3 rounded-full" />
      </Card>
      <div className="flex items-center justify-center gap-2 pt-2">
        <div className="w-3 h-3 border-2 border-[#171717] border-t-transparent rounded-full animate-spin" />
        <span className="text-[11px] font-bold text-[#737373] uppercase tracking-wider">Processing insight…</span>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Language selector dropdown
───────────────────────────────────────────── */
function LanguagePicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (code: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const selected = SUPPORTED_LANGUAGES.find((l) => l.code === value) ?? SUPPORTED_LANGUAGES[0];

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setOpen((v) => !v)}
        className="flex h-9 items-center gap-2 px-3 bg-white border-[#E5E5E5] rounded-full shadow-sm text-[11px] font-bold text-[#171717] hover:bg-[#F5F5F7] transition-all"
      >
        <span>{selected.flag}</span>
        <span className="uppercase tracking-wider">{selected.nativeLabel}</span>
        <ChevronDown
          className={`h-3 w-3 text-[#A3A3A3] transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </Button>

      <AnimatePresence>
        {open && (
          <motion.div 
            initial={{ opacity: 0, y: 5, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 5, scale: 0.95 }}
            className="absolute right-0 top-full mt-2 z-50 w-52 bg-white border border-[#E5E5E5] rounded-2xl shadow-xl overflow-hidden"
          >
            <div className="p-1 max-h-64 overflow-y-auto no-scrollbar">
              {SUPPORTED_LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    onChange(lang.code);
                    setOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all ${
                    lang.code === value
                      ? 'bg-[#F5F5F7] text-[#171717] font-bold'
                      : 'text-[#737373] hover:bg-[#F5F5F7]'
                  }`}
                >
                  <span className="text-sm">{lang.flag}</span>
                  <div>
                    <div className="text-[12px] font-bold">{lang.nativeLabel}</div>
                    <div className="text-[10px] font-medium opacity-60">{lang.label}</div>
                  </div>
                  {lang.code === value && (
                    <Check className="h-3.5 w-3.5 ml-auto text-[#171717]" />
                  )}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Translation result card
───────────────────────────────────────────── */
function TranslationCard({
  translation,
  targetLang,
  onCopy,
  copied,
}: {
  translation: string;
  targetLang: string;
  onCopy: () => void;
  copied: boolean;
}) {
  const lang = SUPPORTED_LANGUAGES.find((l) => l.code === targetLang);
  const isRTL = targetLang === 'ar';

  return (
    <Card className="relative rounded-2xl overflow-hidden border-[#E5E5E5] bg-white shadow-sm transition-all hover:shadow-md">
      {/* Header */}
      <div className="border-b border-[#F5F5F7] px-6 py-4 flex items-center justify-between bg-white/50">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-[#171717]" />
          <span className="text-[11px] font-bold text-[#171717] uppercase tracking-wider">
            {lang ? `${lang.flag} ${lang.label}` : 'Translation'}
          </span>
        </div>
        <Button
          size="sm"
          variant="secondary"
          onClick={onCopy}
          className="flex h-8 items-center gap-1.5 bg-[#F5F5F7] hover:bg-white border border-[#E5E5E5] text-[#171717] text-[10px] font-bold px-4 rounded-full transition-all"
        >
          {copied ? (
            <>
              <Check className="h-3 w-3" />
              Copied
            </>
          ) : (
            <>
              <Copy className="h-3 w-3" />
              Copy
            </>
          )}
        </Button>
      </div>

      {/* Body */}
      <div className="px-6 py-8 bg-[#FAFAFA]">
        <p
          className="text-[#171717] text-[16px] leading-relaxed whitespace-pre-wrap font-medium"
          dir={isRTL ? 'rtl' : 'ltr'}
          lang={targetLang}
          style={{ fontFamily: isRTL ? "'Noto Sans Arabic', sans-serif" : undefined }}
        >
          {translation}
        </p>
      </div>
    </Card>
  );
}

/* ─────────────────────────────────────────────
   Main OCRTranslator page
───────────────────────────────────────────── */
export default function OCRTranslator() {
  const navigate = useNavigate();
  const cameraInputRef = useRef<HTMLInputElement | null>(null);
  const uploadInputRef = useRef<HTMLInputElement | null>(null);

  const [image, setImage] = useState<string | null>(null);
  const [extractedText, setExtractedText] = useState('');
  const [translation, setTranslation] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [targetLang, setTargetLang] = useState('fr');

  useEffect(() => {
    return () => {
      if (image) URL.revokeObjectURL(image);
    };
  }, [image]);

  const processImage = async (file: File) => {
    if (image) URL.revokeObjectURL(image);
    const previewUrl = URL.createObjectURL(file);
    setImage(previewUrl);
    setExtractedText('');
    setTranslation('');
    setCopied(false);
    setIsProcessing(true);

    try {
      const { data } = await Tesseract.recognize(file, 'ara+eng+fra+spa+deu+ita+por', {
        logger: () => {},
      });

      const text = data.text?.trim() ?? '';
      if (!text) {
        toast.error('No text detected. Ensure the image is clear.');
        setIsProcessing(false);
        return;
      }
      setExtractedText(text);
    } catch (error) {
      console.error(error);
      toast.error('Processing failed');
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    if (!extractedText) return;

    let isMounted = true;
    const runTranslation = async () => {
      setIsProcessing(true);
      try {
        const result = await translateText(extractedText, targetLang);
        if (isMounted) {
          setTranslation(result);
          toast.success('Translation ready');
        }
      } catch (error) {
        console.error(error);
        if (isMounted) toast.error('Translation failed');
      } finally {
        if (isMounted) setIsProcessing(false);
      }
    };

    void runTranslation();
    return () => { isMounted = false; };
  }, [extractedText, targetLang]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    void processImage(file);
    event.target.value = '';
  };

  const handleCopy = async () => {
    if (!translation.trim()) return;
    try {
      await navigator.clipboard.writeText(translation);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Unable to copy');
    }
  };

  const handleReset = () => {
    if (image) URL.revokeObjectURL(image);
    setImage(null);
    setExtractedText('');
    setTranslation('');
    setCopied(false);
  };

  return (
    <div className="min-h-screen w-full bg-[#FAFAFA] flex flex-col font-sans antialiased text-[#171717]">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-[#E5E5E5] bg-white/80 backdrop-blur-xl">
        <div className="px-6 py-6 max-w-xl mx-auto w-full">
          <div className="flex items-center justify-between mb-6">
            <Button 
              variant="outline"
              size="icon"
              onClick={() => navigate(-1)} 
              className="h-9 w-9 rounded-full bg-[#F5F5F7] border-[#E5E5E5] text-[#171717] hover:bg-white transition-all shadow-sm"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <LanguagePicker value={targetLang} onChange={setTargetLang} />
          </div>
          
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 bg-[#171717] rounded-2xl flex items-center justify-center shadow-lg shadow-black/10">
              <Camera className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-[18px] font-bold tracking-tight">Insight Translator</h1>
              <p className="text-[10px] font-bold text-[#737373] uppercase tracking-widest leading-none mt-0.5">Automated Intelligence</p>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 overflow-auto px-6 py-8 space-y-8 max-w-xl mx-auto w-full pb-24">

        {/* Tip banner */}
        {!image && (
          <motion.div {...reveal}>
            <Card className="bg-white p-5 rounded-2xl border-[#E5E5E5] shadow-sm">
              <div className="flex items-start gap-4">
                <div className="h-8 w-8 rounded-full bg-[#F5F5F7] border border-[#E5E5E5] flex items-center justify-center shrink-0">
                   <Info className="h-4 w-4 text-[#171717]" />
                </div>
                <div className="space-y-2 pt-1">
                  <h3 className="font-bold text-[#171717] text-[13px] uppercase tracking-wider">Protocol Guidance</h3>
                  <ul className="text-[12px] text-[#737373] leading-relaxed space-y-1.5 font-medium">
                    <li className="flex items-center gap-2">• Capture menu or signage clearly</li>
                    <li className="flex items-center gap-2">• Automated OCR extraction starting</li>
                    <li className="flex items-center gap-2">• Near-instant context translation</li>
                  </ul>
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Capture / Upload */}
        {!image ? (
          <motion.div {...reveal} transition={{ delay: 0.1 }} className="space-y-6">
            <Button
              onClick={() => cameraInputRef.current?.click()}
              className="w-full h-44 bg-[#171717] hover:bg-[#171717]/90 rounded-3xl flex flex-col items-center justify-center gap-4 shadow-xl shadow-black/5 text-white transition-all transform active:scale-[0.99]"
            >
              <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-sm">
                <Camera className="h-8 w-8" />
              </div>
              <span className="text-[13px] font-bold uppercase tracking-[0.2em] pt-1">Capture Sight</span>
            </Button>
            <input
              ref={cameraInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={handleFileChange}
            />

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#E5E5E5]" />
              </div>
              <div className="relative flex justify-center text-[10px]">
                <span className="bg-[#FAFAFA] px-4 font-bold text-[#737373] uppercase tracking-[0.2em]">Synchronization</span>
              </div>
            </div>

            <Button
              variant="outline"
              onClick={() => uploadInputRef.current?.click()}
              className="w-full h-16 rounded-2xl border-dashed border-[#E5E5E5] bg-white hover:bg-[#F5F5F7] hover:border-[#171717]/30 flex items-center justify-center gap-3 transition-all"
            >
              <Upload className="h-5 w-5 text-[#737373]" />
              <span className="text-[11px] font-bold text-[#737373] uppercase tracking-widest">Reference Archive</span>
            </Button>
            <input
              ref={uploadInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />

            <p className="text-center text-[10px] font-bold text-[#A3A3A3] uppercase tracking-[0.3em] pt-4">
              Real-time Global Language Interpretation
            </p>
          </motion.div>

        ) : (

          /* Result UI */
          <div className="space-y-8">
            <motion.div 
              {...reveal}
              className="relative rounded-3xl overflow-hidden bg-[#F5F5F7] border border-[#E5E5E5] aspect-video shadow-lg group shadow-black/5"
            >
              <img
                src={image}
                alt="Captured Source"
                className="absolute inset-0 size-full object-contain grayscale-[20%]"
              />
              <AnimatePresence>
                {isProcessing && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-black/5 backdrop-blur-[4px] flex items-center justify-center"
                  >
                    <div className="bg-white border border-[#E5E5E5] rounded-full px-6 py-3 flex items-center gap-3 shadow-2xl">
                      <div className="w-3.5 h-3.5 border-2 border-[#171717] border-t-transparent rounded-full animate-spin" />
                      <span className="text-[12px] font-bold text-[#171717] uppercase tracking-widest">Analyzing Pattern…</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {isProcessing ? (
              <TranslationSkeleton />
            ) : translation ? (
              <motion.div {...reveal} className="space-y-6">
                <TranslationCard
                  translation={translation}
                  targetLang={targetLang}
                  onCopy={handleCopy}
                  copied={copied}
                />
                <Button
                  variant="outline"
                  onClick={handleReset}
                  className="w-full h-13 rounded-2xl border-[#E5E5E5] bg-white text-[#171717] text-[12px] font-bold flex items-center justify-center gap-2 hover:bg-[#F5F5F7] transition-all py-6 active:scale-[0.99]"
                >
                  <RotateCcw className="h-4 w-4" /> New Interpretation
                </Button>
              </motion.div>
            ) : (
              <motion.div {...reveal} className="rounded-3xl border border-[#E5E5E5] bg-white p-10 text-center space-y-6 shadow-sm border-dashed">
                <div className="h-14 w-14 rounded-full bg-[#F5F5F7] flex items-center justify-center mx-auto text-[#737373]">
                   <Info className="h-7 w-7" />
                </div>
                <div className="space-y-2">
                  <p className="text-[14px] font-bold text-[#171717] uppercase tracking-widest">
                    Extraction Fault
                  </p>
                  <p className="text-[12px] text-[#737373] leading-relaxed max-w-[220px] mx-auto font-medium">
                     No readable text detected from source. Ensure sharpness and lighting conditions.
                  </p>
                </div>
                <Button
                  onClick={handleReset}
                  className="h-11 rounded-full px-8 text-[11px] font-bold uppercase tracking-widest gap-2 bg-[#171717] text-white hover:opacity-90 transition-all shadow-lg shadow-black/10"
                >
                  <RotateCcw className="h-3.5 w-3.5" /> Re-attempt Capture
                </Button>
              </motion.div>
            )}
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
}

