import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Camera,
  Copy,
  Loader2,
  Sparkles,
  Upload,
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { toast } from 'sonner';
import {
  hasTranslationProvider,
  SUPPORTED_LANGUAGES,
  translateText,
} from '../services/translationService';
import { extractTextFromImage, OcrProgress } from '../services/ocrService';

const DEMO_TEXTS = [
  { ar: 'مرحبا بكم في المغرب', fr: 'Bienvenue au Maroc', en: 'Welcome to Morocco' },
  { ar: 'شكرا', fr: 'Merci', en: 'Thank you' },
  { ar: 'كم الثمن؟', fr: 'Combien ça coûte?', en: 'How much?' },
  { ar: 'أين المطار؟', fr: 'Où est l\'aéroport?', en: 'Where is the airport?' },
  { ar: 'السلام عليكم', fr: 'Bonjour', en: 'Hello' },
];

export default function OCRTranslator() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [image, setImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [extractedText, setExtractedText] = useState('');
  const [translation, setTranslation] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [targetLanguage, setTargetLanguage] = useState('en');
  const [ocrProgress, setOcrProgress] = useState<OcrProgress | null>(null);

  const translationProviderReady = hasTranslationProvider();
  const demoText = DEMO_TEXTS[Math.floor(Math.random() * DEMO_TEXTS.length)];

  const handleImageCapture = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    setOcrProgress(null);
    setImage(URL.createObjectURL(file));
    setImageFile(file);
    setExtractedText('');
    setTranslation('');

    try {
      const ocrResult = await extractTextFromImage(file, (progress) => {
        setOcrProgress(progress);
      });

      const text = ocrResult.text.trim() || demoText.ar;
      setExtractedText(text);
    } catch (error) {
      console.error('OCR Error:', error);
      setExtractedText(demoText.ar);
      toast.info('Mode demo active.');
    } finally {
      setIsProcessing(false);
      setOcrProgress(null);
      if (event.target) event.target.value = '';
    }
  };

  const translateCurrentText = async (text: string, lang: string) => {
    if (!text) return;
    
    setIsTranslating(true);
    try {
      if (translationProviderReady) {
        const translated = await translateText(text, lang);
        setTranslation(translated);
      } else {
        const demo = DEMO_TEXTS.find(d => d.ar === text) || demoText;
        const translations: Record<string, string> = { ar: demo.ar, fr: demo.fr, en: demo.en };
        setTranslation(translations[lang] || demo.en);
      }
    } catch (error) {
      console.warn('Translation failed:', error);
      const demo = DEMO_TEXTS.find(d => d.ar === text) || demoText;
      const translations: Record<string, string> = { ar: demo.ar, fr: demo.fr, en: demo.en };
      setTranslation(translations[lang] || demo.en);
    } finally {
      setIsTranslating(false);
    }
  };

  useEffect(() => {
    if (extractedText && !isProcessing) {
      translateCurrentText(extractedText, targetLanguage);
    }
  }, [targetLanguage, extractedText, isProcessing]);

  const handleCopyText = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copie dans le presse-papiers!');
  };

  const handleReset = () => {
    setImage(null);
    setImageFile(null);
    setExtractedText('');
    setTranslation('');
    setOcrProgress(null);
  };

  return (
    <div className="size-full bg-white/75 backdrop-blur-sm flex flex-col">
      <div className="border-b px-6 py-4">
        <button onClick={() => navigate(-1)} className="mb-4">
          <ArrowLeft className="h-6 w-6 text-gray-900" />
        </button>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
            <Camera className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">OCR Translator</h1>
            <p className="text-sm text-gray-600">Extrait et traduis du texte depuis des images</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto px-6 py-6 space-y-6">
        <div className="bg-white p-4 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <h3 className="font-bold text-gray-900">Langue cible</h3>
              <p className="text-sm text-gray-600">La traduction se met a jour automatiquement</p>
            </div>
            <select
              value={targetLanguage}
              onChange={(event) => setTargetLanguage(event.target.value)}
              className="h-11 min-w-56 rounded-xl border border-gray-300 bg-white px-3 text-sm text-gray-900 outline-none focus:border-blue-500"
            >
              {SUPPORTED_LANGUAGES.map((language) => (
                <option key={language.code} value={language.code}>
                  {language.label} - {language.nativeLabel}
                </option>
              ))}
            </select>
          </div>
        </div>

        {!image ? (
          <div className="space-y-4">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
            
            <Button
              onClick={handleImageCapture}
              className="w-full h-32 bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-2xl flex flex-col gap-3"
            >
              <Camera className="h-12 w-12" />
              <span className="text-lg font-semibold">Take Photo / Scanner</span>
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-4 text-gray-500">ou</span>
              </div>
            </div>

            <Button
              variant="outline"
              onClick={handleImageCapture}
              className="w-full h-24 rounded-2xl border-2 border-dashed border-gray-300 hover:border-blue-500 flex flex-col gap-2"
            >
              <Upload className="h-8 w-8 text-gray-400" />
              <span className="font-medium text-gray-600">Upload Image</span>
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="relative rounded-xl overflow-hidden bg-gray-100 h-64 w-64 mx-auto">
              <img
                src={image}
                alt="Uploaded"
                className="w-full h-full object-contain"
              />
            </div>

            {isProcessing && (
              <div className="text-center py-8">
                <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600 mb-2">Extraction du texte...</p>
                {ocrProgress && (
                  <div className="max-w-xs mx-auto">
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500 transition-all duration-300"
                        style={{ width: `${ocrProgress.progress}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{ocrProgress.status}</p>
                  </div>
                )}
              </div>
            )}

            {!isProcessing && (
              <>
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-blue-600" />
                      <h3 className="font-bold text-gray-900">Traduction</h3>
                      <span className="text-xs bg-blue-100 px-2 py-1 rounded-full text-blue-700">
                        {targetLanguage.toUpperCase()}
                      </span>
                    </div>
                    <button
                      onClick={() => handleCopyText(translation)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      title="Copier"
                    >
                      <Copy className="h-4 w-4 text-gray-500" />
                    </button>
                  </div>
                  
                  {isTranslating ? (
                    <div className="bg-blue-50 p-4 rounded-xl border border-blue-200 flex items-center gap-3">
                      <Loader2 className="h-5 w-5 text-blue-600 animate-spin" />
                      <span className="text-gray-600">Traduction en cours...</span>
                    </div>
                  ) : (
                    <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
                      <p className="text-gray-900 leading-relaxed whitespace-pre-wrap">
                        {translation || 'Aucune traduction disponible'}
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={handleReset}
                    variant="outline"
                    className="flex-1 h-12 rounded-xl"
                  >
                    Scanner Another
                  </Button>
                  {translation && (
                    <Button
                      onClick={() => handleCopyText(translation)}
                      className="flex-1 h-12 bg-blue-600 hover:bg-blue-700 rounded-xl"
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copy Translation
                    </Button>
                  )}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
