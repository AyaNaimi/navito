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
  Orbit,
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
    <div className="space-y-6 mt-4 font-sans">
      <div className="flex items-center gap-3 mb-2 px-1">
        <Skeleton className="w-6 h-6 rounded-lg bg-border" />
        <Skeleton className="w-40 h-3 bg-border" />
      </div>
      <Card className="rounded-[2.5rem] border-border bg-card/40 p-8 space-y-6 shadow-2xl backdrop-blur-md">
        <Skeleton className="w-3/4 h-3 rounded-full bg-border" />
        <Skeleton className="w-full h-3 rounded-full bg-border" />
        <Skeleton className="w-5/6 h-3 rounded-full bg-border" />
        <Skeleton className="w-2/3 h-3 rounded-full bg-border" />
      </Card>
      <div className="flex items-center justify-center gap-3 pt-6">
        <div className="w-4 h-4 border-2 border-accent border-t-transparent rounded-full animate-spin" />
        <span className="text-[11px] font-black text-muted-foreground uppercase tracking-[0.2em] italic">Synthesizing semantic data…</span>
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
    <div ref={ref} className="relative font-sans">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setOpen((v) => !v)}
        className="flex h-11 items-center gap-3 px-5 bg-card border-border rounded-xl shadow-xl text-[11px] font-black text-foreground hover:bg-muted transition-all uppercase tracking-widest border-none"
      >
        <span className="text-sm grayscale-[0.5]">{selected.flag}</span>
        <span>{selected.nativeLabel}</span>
        <ChevronDown
          className={`h-4 w-4 text-accent transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </Button>

      <AnimatePresence>
        {open && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="absolute right-0 top-full mt-4 z-50 w-64 bg-background/95 backdrop-blur-3xl border border-border rounded-[2rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] overflow-hidden"
          >
            <div className="p-3 max-h-80 overflow-y-auto no-scrollbar space-y-1">
              {SUPPORTED_LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    onChange(lang.code);
                    setOpen(false);
                  }}
                  className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-left transition-all ${
                    lang.code === value
                      ? 'bg-foreground text-background font-black'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                >
                  <span className="text-lg grayscale-[0.4]">{lang.flag}</span>
                  <div className="min-w-0">
                    <div className="text-[12px] font-black uppercase tracking-tight">{lang.nativeLabel}</div>
                    <div className="text-[10px] font-bold opacity-60 uppercase tracking-widest">{lang.label}</div>
                  </div>
                  {lang.code === value && (
                    <Check className="h-4 w-4 ml-auto" />
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
    <Card className="relative rounded-[2.5rem] overflow-hidden border-border bg-card/40 shadow-2xl transition-all hover:bg-card/60 backdrop-blur-md group">
      {/* Header */}
      <div className="border-b border-border px-8 py-5 flex items-center justify-between bg-foreground/5">
        <div className="flex items-center gap-3">
          <Sparkles className="h-4 w-4 text-accent" />
          <span className="text-[11px] font-black text-foreground uppercase tracking-[0.2em] italic">
            {lang ? `${lang.label} Output` : 'Translation Protocol'}
          </span>
        </div>
        <Button
          size="sm"
          variant="secondary"
          onClick={onCopy}
          className="flex h-9 items-center gap-2 bg-background border border-border text-foreground text-[10px] font-black px-5 rounded-xl transition-all hover:bg-foreground hover:text-background uppercase tracking-widest border-none"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 text-accent" />
              Cached
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" />
              Extract
            </>
          )}
        </Button>
      </div>

      {/* Body */}
      <div className="px-8 py-10">
        <p
          className="text-foreground text-[18px] leading-[1.6] whitespace-pre-wrap font-bold selection:bg-accent selection:text-white"
          dir={isRTL ? 'rtl' : 'ltr'}
          lang={targetLang}
          style={{ fontFamily: isRTL ? "'Noto Sans Arabic', sans-serif" : undefined }}
        >
          {translation}
        </p>
      </div>
      
      <div className="absolute bottom-4 right-8 opacity-20 group-hover:opacity-40 transition-opacity">
        <div className="text-[8px] font-black uppercase tracking-[0.4em] text-foreground">Semantic Integrity: 100%</div>
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
        toast.error('Zero intelligence detected. Focus on clarity.');
        setIsProcessing(false);
        return;
      }
      setExtractedText(text);
    } catch (error) {
      console.error(error);
      toast.error('Matrix processing failure');
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
          toast.success('Semantic synthesis complete');
        }
      } catch (error) {
        console.error(error);
        if (isMounted) toast.error('Linguistic relay error');
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
      toast.error('Registry access denied');
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
    <div className="min-h-screen w-full bg-background flex flex-col font-sans antialiased text-foreground transition-colors duration-500 overflow-x-hidden">
      {/* Header */}
      <header className="sticky top-0 z-[100] border-b border-border bg-background/80 backdrop-blur-3xl">
        <div className="px-6 py-6 max-w-xl mx-auto w-full">
          <div className="flex items-center justify-between mb-8">
            <Button 
              variant="outline"
              size="icon"
              onClick={() => navigate(-1)} 
              className="h-11 w-11 rounded-2xl bg-secondary border-border text-foreground hover:bg-foreground hover:text-background transition-all shadow-xl active:scale-90"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <LanguagePicker value={targetLang} onChange={setTargetLang} />
          </div>
          
          <div className="flex items-center gap-5">
            <div className="h-14 w-14 bg-foreground text-background rounded-[1.25rem] flex items-center justify-center shadow-2xl shadow-foreground/20 rotate-3 group-hover:rotate-0 transition-transform">
              <Camera className="h-7 w-7" />
            </div>
            <div>
              <h1 className="text-[22px] font-black tracking-tighter uppercase italic underline decoration-accent decoration-3 underline-offset-4 decoration-dashed">Insight Neural</h1>
              <p className="text-[10px] font-black text-accent uppercase tracking-[0.4em] leading-none mt-2">Neural Extraction Node 0.2</p>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 overflow-auto px-6 py-10 space-y-10 max-w-xl mx-auto w-full pb-32">

        {/* Tip banner */}
        {!image && (
          <motion.div {...reveal}>
            <Card className="bg-card/40 p-6 rounded-[2rem] border-border shadow-2xl backdrop-blur-md relative overflow-hidden group">
              <div className="absolute top-0 right-0 h-20 w-20 bg-accent/5 blur-2xl rounded-full" />
              <div className="flex items-start gap-5 relative z-10">
                <div className="h-10 w-10 rounded-xl bg-secondary border border-border flex items-center justify-center shrink-0 text-accent">
                   <Orbit className="h-5 w-5" />
                </div>
                <div className="space-y-3 pt-1">
                  <h3 className="font-black text-foreground text-[13px] uppercase tracking-[0.2em] italic">Calibration Guidance</h3>
                  <ul className="text-[12px] text-muted-foreground leading-relaxed space-y-2 font-bold uppercase italic tracking-wider opacity-80">
                    <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-accent" /> Scan high-contrast text structures</li>
                    <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-accent" /> Automated OCR matrix activation</li>
                    <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-accent" /> Instant semantic relay enabled</li>
                  </ul>
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Capture / Upload */}
        {!image ? (
          <motion.div {...reveal} transition={{ delay: 0.1 }} className="space-y-10">
            <Button
              onClick={() => cameraInputRef.current?.click()}
              className="w-full h-56 bg-foreground hover:bg-accent rounded-[3rem] flex flex-col items-center justify-center gap-5 shadow-[0_45px_100px_-20px_rgba(0,0,0,0.3)] text-background hover:text-white transition-all transform active:scale-[0.98] border-none group"
            >
              <div className="bg-background/10 p-5 rounded-3xl backdrop-blur-sm group-hover:scale-110 transition-transform">
                <Camera className="h-10 w-10" />
              </div>
              <span className="text-[14px] font-black uppercase tracking-[0.3em]">Initialize View</span>
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
                <div className="w-full border-t border-border border-dashed" />
              </div>
              <div className="relative flex justify-center text-[10px]">
                <span className="bg-background px-6 font-black text-muted-foreground uppercase tracking-[0.4em] italic">Telemetry Relay</span>
              </div>
            </div>

            <Button
              variant="outline"
              onClick={() => uploadInputRef.current?.click()}
              className="w-full h-20 rounded-[1.5rem] border-dashed border-border bg-card/40 hover:bg-card hover:border-accent flex items-center justify-center gap-4 transition-all shadow-xl backdrop-blur-sm group border-none"
            >
              <Upload className="h-6 w-6 text-accent group-hover:-translate-y-1 transition-transform" />
              <span className="text-[12px] font-black text-foreground uppercase tracking-[0.25em] italic">Inject Artifact</span>
            </Button>
            <input
              ref={uploadInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />

            <div className="flex items-center justify-center gap-4 opacity-30 pt-4">
              <div className="h-[2px] w-6 bg-accent" />
              <p className="text-[9px] font-black text-foreground uppercase tracking-[0.5em] italic">Universal Neural Bridge</p>
              <div className="h-[2px] w-6 bg-accent" />
            </div>
          </motion.div>

        ) : (

          /* Result UI */
          <div className="space-y-12">
            <motion.div 
              {...reveal}
              className="relative rounded-[3rem] overflow-hidden bg-card border border-border aspect-video shadow-[0_45px_100px_-20px_rgba(0,0,0,0.2)] group"
            >
              <img
                src={image}
                alt="Captured Source"
                className="absolute inset-0 size-full object-contain grayscale-[0.3] hover:grayscale-0 transition-all duration-700"
              />
              <AnimatePresence>
                {isProcessing && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-background/20 backdrop-blur-[10px] flex items-center justify-center"
                  >
                    <div className="bg-background border border-border rounded-[2rem] px-8 py-5 flex items-center gap-5 shadow-2xl">
                      <div className="w-5 h-5 border-2 border-accent border-t-transparent rounded-full animate-spin" />
                      <span className="text-[12px] font-black text-foreground uppercase tracking-[0.3em] italic">Resolving Neural Pattern…</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              
              <div className="absolute top-6 left-8 px-4 py-1.5 rounded-full bg-background/60 backdrop-blur-md border border-white/20 text-[9px] font-black uppercase tracking-widest text-foreground shadow-2xl">
                Source Artifact Alpha
              </div>
            </motion.div>

            {isProcessing ? (
              <TranslationSkeleton />
            ) : translation ? (
              <motion.div {...reveal} className="space-y-10">
                <TranslationCard
                  translation={translation}
                  targetLang={targetLang}
                  onCopy={handleCopy}
                  copied={copied}
                />
                <Button
                  variant="outline"
                  onClick={handleReset}
                  className="w-full h-16 rounded-[1.5rem] border-border bg-card/60 text-foreground text-[12px] font-black flex items-center justify-center gap-3 hover:bg-foreground hover:text-background transition-all shadow-2xl active:scale-[0.98] uppercase tracking-widest border-none"
                >
                  <RotateCcw className="h-5 w-5" /> Flush & Reset Matrix
                </Button>
              </motion.div>
            ) : (
              <motion.div {...reveal} className="rounded-[3rem] border-2 border-border border-dashed bg-card/20 p-12 text-center space-y-8 shadow-2xl backdrop-blur-sm">
                <div className="h-16 w-16 rounded-[1.5rem] bg-secondary border border-border flex items-center justify-center mx-auto text-accent shadow-xl">
                   <Info className="h-8 w-8" />
                </div>
                <div className="space-y-3">
                  <p className="text-[16px] font-black text-foreground uppercase tracking-[0.2em] italic underline decoration-rose-500 decoration-3">
                    Linguistic Breach
                  </p>
                  <p className="text-[13px] text-muted-foreground leading-relaxed max-w-[260px] mx-auto font-bold uppercase tracking-tight opacity-70">
                     Neural sensors failed to extract valid semantic data from the artifact.
                  </p>
                </div>
                <Button
                  onClick={handleReset}
                  className="h-14 rounded-2xl px-10 text-[12px] font-black uppercase tracking-[0.2em] gap-3 bg-foreground text-background hover:bg-accent hover:text-white transition-all shadow-2xl border-none active:scale-95"
                >
                  <RotateCcw className="h-4 w-4" /> Recalibrate Sensor
                </Button>
              </motion.div>
            )}
          </div>
        )}
      </main>

      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute top-[20%] right-[-10%] w-[50%] h-[50%] bg-blue-500/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[20%] left-[-10%] w-[50%] h-[50%] bg-accent/5 blur-[120px] rounded-full" />
      </div>

      <BottomNav />
    </div>
  );
}
