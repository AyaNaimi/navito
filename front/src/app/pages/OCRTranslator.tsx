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
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { toast } from 'sonner';
import Tesseract from 'tesseract.js';
import { SUPPORTED_LANGUAGES, translateText } from '../services/translation';

/* ─────────────────────────────────────────────
   Skeleton block component
───────────────────────────────────────────── */
function SkeletonBlock({ className = '' }: { className?: string }) {
  return (
    <div
      className={`rounded-lg bg-gray-200 animate-pulse ${className}`}
      style={{ animationDuration: '1.4s' }}
    />
  );
}

function TranslationSkeleton() {
  return (
    <div className="space-y-4 mt-2">
      {/* Header skeleton */}
      <div className="flex items-center gap-2 mb-4">
        <SkeletonBlock className="w-5 h-5 rounded-full" />
        <SkeletonBlock className="w-32 h-4" />
      </div>
      {/* Card skeleton */}
      <div className="rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-indigo-50 p-5 space-y-3">
        <SkeletonBlock className="w-3/4 h-4" />
        <SkeletonBlock className="w-full h-4" />
        <SkeletonBlock className="w-5/6 h-4" />
        <SkeletonBlock className="w-2/3 h-4" />
      </div>
      {/* OCR progress label */}
      <div className="flex items-center justify-center gap-2 pt-2">
        <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
        <span className="text-xs text-gray-500">Extracting &amp; translating text…</span>
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
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-xl shadow-sm text-sm font-medium text-gray-700 hover:border-blue-400 transition-colors"
      >
        <span className="text-base">{selected.flag}</span>
        <span>{selected.nativeLabel}</span>
        <ChevronDown
          className={`h-4 w-4 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 z-50 w-52 bg-white border border-gray-100 rounded-2xl shadow-2xl overflow-hidden">
          <div className="p-1 max-h-64 overflow-y-auto">
            {SUPPORTED_LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                onClick={() => {
                  onChange(lang.code);
                  setOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-left transition-colors ${
                  lang.code === value
                    ? 'bg-blue-50 text-blue-700 font-semibold'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <span className="text-base">{lang.flag}</span>
                <div>
                  <div className="font-medium">{lang.nativeLabel}</div>
                  <div className="text-xs text-gray-400">{lang.label}</div>
                </div>
                {lang.code === value && (
                  <Check className="h-4 w-4 ml-auto text-blue-500" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
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
    <div className="relative rounded-2xl overflow-hidden border border-blue-100 shadow-lg">
      {/* Gradient header */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-white/80" />
          <span className="text-sm font-semibold text-white">
            {lang ? `${lang.flag} ${lang.label}` : 'Translation'}
          </span>
        </div>
        <button
          onClick={onCopy}
          className="flex items-center gap-1.5 bg-white/20 hover:bg-white/30 text-white text-xs px-3 py-1.5 rounded-lg transition-colors"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" />
              Copy
            </>
          )}
        </button>
      </div>

      {/* Translation body */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 px-5 py-5">
        <p
          className="text-gray-800 text-base leading-relaxed whitespace-pre-wrap font-medium"
          dir={isRTL ? 'rtl' : 'ltr'}
          lang={targetLang}
          style={{ fontFamily: isRTL ? "'Noto Sans Arabic', sans-serif" : undefined }}
        >
          {translation}
        </p>
      </div>
    </div>
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
  const [translation, setTranslation] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [targetLang, setTargetLang] = useState('fr');

  // Cleanup object URLs
  useEffect(() => {
    return () => {
      if (image) URL.revokeObjectURL(image);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const processImage = async (file: File) => {
    if (image) URL.revokeObjectURL(image);
    const previewUrl = URL.createObjectURL(file);
    setImage(previewUrl);
    setTranslation('');
    setCopied(false);
    setIsProcessing(true);

    try {
      // Run OCR (multi-language)
      const { data } = await Tesseract.recognize(file, 'ara+eng+fra+spa+deu+ita+por', {
        logger: () => {}, // silence logger – skeleton handles feedback
      });

      const text = data.text?.trim() ?? '';

      if (!text) {
        toast.error('No text detected in this image. Try a clearer photo.');
        return;
      }

      // Translate with Groq
      const result = await translateText(text, targetLang);
      setTranslation(result);
      toast.success('Translation ready!');
    } catch (error) {
      console.error(error);
      const msg = error instanceof Error ? error.message : 'Unknown error';
      toast.error(`Failed: ${msg}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    void processImage(file);
    event.target.value = '';
  };

  const handleCopy = async () => {
    if (!translation.trim()) {
      toast.error('Nothing to copy.');
      return;
    }
    try {
      await navigator.clipboard.writeText(translation);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Unable to copy to clipboard.');
    }
  };

  const handleReset = () => {
    if (image) URL.revokeObjectURL(image);
    setImage(null);
    setTranslation('');
    setCopied(false);
  };

  return (
    <div className="size-full bg-white flex flex-col">
      {/* ── Header ── */}
      <div className="border-b px-5 py-4">
        <button onClick={() => navigate(-1)} className="mb-4 p-1 -ml-1 rounded-lg hover:bg-gray-100 transition-colors">
          <ArrowLeft className="h-5 w-5 text-gray-700" />
        </button>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-md shadow-blue-200">
              <Camera className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 leading-tight">OCR Translator</h1>
              <p className="text-xs text-gray-500">Scan &amp; translate instantly</p>
            </div>
          </div>

          {/* Language picker */}
          <LanguagePicker value={targetLang} onChange={setTargetLang} />
        </div>
      </div>

      {/* ── Content ── */}
      <div className="flex-1 overflow-auto px-5 py-5 space-y-5">

        {/* Tip banner */}
        {!image && (
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-2xl border border-blue-100">
            <div className="flex items-start gap-3">
              <Sparkles className="h-4 w-4 text-blue-500 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-blue-900 text-sm mb-1">How it works</h3>
                <ul className="text-xs text-blue-700 space-y-0.5 list-none">
                  <li>📸 Take or upload a photo of any sign or menu</li>
                  <li>🔍 AI reads the text automatically</li>
                  <li>⚡ Instant translation via Groq AI</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* ── No image: upload UI ── */}
        {!image ? (
          <div className="space-y-4">
            {/* Camera */}
            <Button
              onClick={() => cameraInputRef.current?.click()}
              className="w-full h-36 bg-gradient-to-br from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 rounded-2xl flex flex-col gap-3 shadow-lg shadow-blue-200"
            >
              <Camera className="h-10 w-10" />
              <span className="text-base font-semibold">Take a Photo</span>
            </Button>
            <input
              ref={cameraInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={handleFileChange}
            />

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-white px-3 text-gray-400">or</span>
              </div>
            </div>

            {/* Upload */}
            <Button
              variant="outline"
              onClick={() => uploadInputRef.current?.click()}
              className="w-full h-20 rounded-2xl border-2 border-dashed border-gray-200 hover:border-blue-400 flex flex-col gap-2 transition-colors"
            >
              <Upload className="h-7 w-7 text-gray-400" />
              <span className="text-sm font-medium text-gray-500">Upload Image</span>
            </Button>
            <input
              ref={uploadInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />

            {/* Supported languages note */}
            <p className="text-center text-xs text-gray-400">
              Detects: Arabic · English · French · Spanish · German · Italian · Portuguese
            </p>
          </div>

        ) : (

          /* ── Image selected: results UI ── */
          <div className="space-y-5">
            {/* Preview */}
            <div className="relative rounded-2xl overflow-hidden bg-gray-100 aspect-[4/3] shadow-md">
              <img
                src={image}
                alt="Captured"
                className="absolute inset-0 size-full object-cover"
              />
              {isProcessing && (
                <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px] flex items-center justify-center">
                  <div className="bg-white/90 rounded-2xl px-5 py-3 flex items-center gap-3 shadow-lg">
                    <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                    <span className="text-sm font-medium text-gray-700">Reading image…</span>
                  </div>
                </div>
              )}
            </div>

            {/* Skeleton or result */}
            {isProcessing ? (
              <TranslationSkeleton />
            ) : translation ? (
              <>
                <TranslationCard
                  translation={translation}
                  targetLang={targetLang}
                  onCopy={handleCopy}
                  copied={copied}
                />

                {/* Actions */}
                <div className="flex gap-3 pt-1">
                  <Button
                    variant="outline"
                    onClick={handleReset}
                    className="flex-1 h-12 rounded-xl gap-2"
                  >
                    <RotateCcw className="h-4 w-4" />
                    Scan Another
                  </Button>
                </div>
              </>
            ) : (
              /* No text found state */
              <div className="rounded-2xl border border-orange-100 bg-orange-50 px-5 py-6 text-center">
                <p className="text-sm font-medium text-orange-700 mb-3">
                  No text was detected in this image.
                </p>
                <Button
                  variant="outline"
                  onClick={handleReset}
                  className="h-10 rounded-xl text-sm gap-2"
                >
                  <RotateCcw className="h-4 w-4" />
                  Try Another Image
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
