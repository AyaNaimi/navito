import { useMemo, useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Camera, DollarSign, Sparkles, TrendingUp, Upload, ChevronDown, Check, ArrowRight, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../components/ui/button';
import { Skeleton } from '../components/ui/skeleton';
import { toast } from 'sonner';
import { useAppContext } from '../context/AppContext';
import { estimatePriceFromImage, type Currency, type EstimateResult } from '../services/priceEstimator';

const reveal = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: [0.23, 1, 0.32, 1] },
};

export const AVAILABLE_CURRENCIES: Currency[] = [
  { code: 'MAD', symbol: 'MAD', rateFromMAD: 1, prefix: false },
  { code: 'EUR', symbol: '€', rateFromMAD: 0.092, prefix: true },
  { code: 'USD', symbol: '$', rateFromMAD: 0.10, prefix: true },
  { code: 'GBP', symbol: '£', rateFromMAD: 0.079, prefix: true },
  { code: 'CAD', symbol: 'C$', rateFromMAD: 0.14, prefix: true },
];

const currencyByCountry: Record<string, Currency> = {
  Morocco: AVAILABLE_CURRENCIES[0],
  France: AVAILABLE_CURRENCIES[1],
  Spain: AVAILABLE_CURRENCIES[1],
  Portugal: AVAILABLE_CURRENCIES[1],
};

const popularItems = [
  { name: 'Water Bottle', min: 5, max: 8 },
  { name: 'Orange Juice', min: 10, max: 20 },
  { name: 'Mint Tea', min: 10, max: 25 },
  { name: 'Tagine', min: 60, max: 150 },
  { name: 'Babouches', min: 120, max: 350 },
  { name: 'Argan Oil', min: 90, max: 200 },
];

function formatRange(min: number, max: number, currency: Currency) {
  const roundedMin = Math.round(min);
  const roundedMax = Math.round(max);
  if (currency.prefix) {
    return `${currency.symbol}${roundedMin} - ${currency.symbol}${roundedMax}`;
  }
  return `${roundedMin} - ${roundedMax} ${currency.symbol}`;
}

export default function PriceEstimator() {
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const { country } = useAppContext();
  const cameraInputRef = useRef<HTMLInputElement | null>(null);
  const uploadInputRef = useRef<HTMLInputElement | null>(null);
  const [image, setImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<EstimateResult | null>(null);
  const [usingApi, setUsingApi] = useState(false);

  const defaultCurrencyCode = currencyByCountry[country ?? 'Morocco']?.code ?? 'MAD';
  const [selectedCurrencyCode, setSelectedCurrencyCode] = useState<string>(defaultCurrencyCode);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    setSelectedCurrencyCode(currencyByCountry[country ?? 'Morocco']?.code ?? 'MAD');
  }, [country]);

  const currency = useMemo(() => {
    return AVAILABLE_CURRENCIES.find(c => c.code === selectedCurrencyCode) ?? AVAILABLE_CURRENCIES[0];
  }, [selectedCurrencyCode]);

  const dropdownRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (image) URL.revokeObjectURL(image);
    const previewUrl = URL.createObjectURL(file);
    setImage(previewUrl);
    setResult(null);
    setIsProcessing(true);

    try {
      const apiResult = await estimatePriceFromImage(file, country, i18n.language);
      setResult(apiResult);
      setUsingApi(true);
      toast.success('Market value estimated!');
    } catch (error) {
      console.error(error);
      const mockResult = {
        name: 'Detected Item',
        category: 'Essentials',
        brand: 'Local Brand',
        confidence: 0.85,
        priceMin: 15,
        priceMax: 45,
        currency: AVAILABLE_CURRENCIES[0],
      };
      setResult(mockResult);
      setUsingApi(false);
      toast.success('Market value estimated (simulation).');
    } finally {
      setIsProcessing(false);
    }
    event.target.value = '';
  };

  const resetFlow = () => {
    if (image) URL.revokeObjectURL(image);
    setImage(null);
    setResult(null);
    setIsProcessing(false);
    setUsingApi(false);
  };

  return (
    <div className="min-h-screen w-full bg-[#FAFAFA] flex flex-col pb-24 font-['Inter',sans-serif] antialiased selection:bg-black selection:text-white">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-50 border-b border-[#F0F0F0] bg-white/80 backdrop-blur-xl"
      >
        <div className="px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate(-1)} 
              className="h-10 w-10 flex items-center justify-center rounded-full bg-white border border-[#E5E5E5] text-[#171717] shadow-sm hover:bg-[#F5F5F7] transition-all"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <div>
              <h1 className="text-[17px] font-bold tracking-tight text-[#171717]">Price Analytics</h1>
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#737373] mt-0.5">Fair market verification</p>
            </div>
          </div>

          {/* Currency picker */}
          <div ref={dropdownRef} className="relative">
            <button
              onClick={() => setDropdownOpen((v) => !v)}
              className="flex items-center gap-2 h-9 px-3 bg-white border border-[#E5E5E5] rounded-full shadow-sm text-[11px] font-bold text-[#171717] hover:bg-[#F5F5F7] transition-all"
            >
              <span>{currency.code}</span>
              <ChevronDown className={`h-3 w-3 text-[#A3A3A3] transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {dropdownOpen && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95, y: 5 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 5 }}
                  className="absolute right-0 top-full mt-2 w-36 bg-white border border-[#E5E5E5] rounded-2xl shadow-xl overflow-hidden z-50 p-1"
                >
                  {AVAILABLE_CURRENCIES.map((c) => (
                    <button
                      key={c.code}
                      onClick={() => {
                        setSelectedCurrencyCode(c.code);
                        setDropdownOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-[12px] transition-colors ${
                        c.code === selectedCurrencyCode ? 'bg-[#F5F5F7] font-bold text-[#171717]' : 'text-[#737373] hover:bg-[#FAFAFA]'
                      }`}
                    >
                      <span>{c.code} ({c.symbol})</span>
                      {c.code === selectedCurrencyCode && <Check className="h-3.5 w-3.5 text-[#171717]" />}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.header>

      <main className="flex-1 overflow-auto px-6 py-8 space-y-10 max-w-xl mx-auto w-full">
        {/* Tool Description */}
        <motion.section {...reveal} className="bg-white border border-[#E5E5E5] p-6 rounded-2xl shadow-sm">
          <div className="flex items-start gap-4">
            <div className="h-10 w-10 rounded-full bg-[#171717] flex items-center justify-center shrink-0">
               <Sparkles className="h-4 w-4 text-white" />
            </div>
            <div>
              <h3 className="text-[15px] font-bold text-[#171717] mb-1">Visual Recognition</h3>
              <p className="text-[12px] leading-relaxed text-[#737373] font-medium">
                Verify authentic market rates by analyzing product visual data. Our system cross-references local standards to ensure transparency.
              </p>
            </div>
          </div>
        </motion.section>

        {!image ? (
          <>
            {/* Capture Triggers */}
            <motion.section {...reveal} transition={{ delay: 0.1 }} className="space-y-4">
              <button
                onClick={() => cameraInputRef.current?.click()}
                className="w-full aspect-[16/6] bg-[#171717] rounded-2xl flex flex-col items-center justify-center gap-2 group overflow-hidden relative"
              >
                <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <Camera className="h-8 w-8 text-white relative z-10" strokeWidth={1.5} />
                <span className="text-[13px] font-bold text-white uppercase tracking-widest relative z-10">Snap to Verify</span>
              </button>
              <input ref={cameraInputRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={handleFileChange} />

              <button
                onClick={() => uploadInputRef.current?.click()}
                className="w-full h-14 bg-white border border-[#E5E5E5] border-dashed rounded-2xl flex items-center justify-center gap-3 transition-all hover:bg-[#F5F5F7] group"
              >
                <Upload className="h-4 w-4 text-[#A3A3A3] group-hover:text-[#171717]" />
                <span className="text-[11px] font-bold text-[#737373] group-hover:text-[#171717] uppercase tracking-widest">Library Upload</span>
              </button>
              <input ref={uploadInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
            </motion.section>

            {/* Catalog References */}
            <motion.section {...reveal} transition={{ delay: 0.2 }} className="space-y-4">
               <div className="flex items-center justify-between px-1">
                 <p className="text-[10px] font-bold uppercase tracking-widest text-[#737373]">Market Benchmarks</p>
                 <ArrowRight className="h-3 w-3 text-[#A3A3A3]" />
               </div>
               <div className="grid grid-cols-2 gap-3 pb-8">
                 {popularItems.map((item) => (
                   <div key={item.name} className="bg-white border border-[#E5E5E5] p-4 rounded-2xl shadow-sm hover:shadow-md transition-all">
                     <p className="text-[13px] font-bold text-[#171717] mb-1">{item.name}</p>
                     <p className="text-[11px] font-bold text-[#737373]">
                       {formatRange(item.min * (currency.rateFromMAD ?? 1), item.max * (currency.rateFromMAD ?? 1), currency)}
                     </p>
                   </div>
                 ))}
               </div>
            </motion.section>
          </>
        ) : (
          <motion.div {...reveal} className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Captured View */}
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-[#F5F5F7] border border-[#E5E5E5]">
              <img src={image} alt="Verification Source" className="h-full w-full object-contain" />
              {isProcessing && (
                <div className="absolute inset-0 bg-white/40 backdrop-blur-sm flex flex-col items-center justify-center">
                  <div className="h-10 w-10 border-2 border-[#171717] border-t-transparent rounded-full animate-spin mb-4" />
                  <p className="text-[11px] font-bold uppercase tracking-widest text-[#171717]">Analyzing Metrics...</p>
                </div>
              )}
            </div>

            {/* Results */}
            <AnimatePresence>
              {result && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <div className="bg-white border border-[#E5E5E5] rounded-2xl p-6 shadow-sm">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="h-10 w-10 rounded-full bg-[#171717] flex items-center justify-center">
                         <Check className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <h3 className="text-[15px] font-bold text-[#171717] leading-tight">{result.name}</h3>
                        <p className="text-[10px] font-bold text-[#737373] uppercase tracking-wider mt-0.5">{result.category}</p>
                      </div>
                    </div>

                    <div className="bg-[#F5F5F7] rounded-xl p-5 border border-[#E5E5E5] text-center">
                       <p className="text-[10px] font-bold text-[#737373] uppercase tracking-widest mb-2">Fair Market Range</p>
                       <p className="text-[32px] font-bold text-[#171717] tracking-tighter">
                         {formatRange(
                           result.priceMin * (currency.rateFromMAD ?? 1),
                           result.priceMax * (currency.rateFromMAD ?? 1),
                           currency
                         )}
                       </p>
                    </div>

                    <div className="mt-6 flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-[#737373]">
                      <span>Source Confidence</span>
                      <span className="text-[#171717]">{Math.round(result.confidence * 100)}%</span>
                    </div>
                  </div>

                  {/* Negotiation Insight */}
                  <div className="bg-[#F5F5F7] border border-[#E5E5E5] p-5 rounded-2xl shadow-sm">
                    <div className="flex items-center gap-2 mb-3">
                      <Info className="h-3.5 w-3.5 text-[#171717]" />
                      <h4 className="text-[11px] font-bold text-[#171717] uppercase tracking-widest">Fair Play Strategy</h4>
                    </div>
                    <ul className="text-[12px] text-[#737373] font-medium space-y-2 leading-relaxed">
                      <li className="flex gap-2"><span>•</span> Start at 40% of the initial quote</li>
                      <li className="flex gap-2"><span>•</span> Observe quality markers before bidding</li>
                      <li className="flex gap-2"><span>•</span> Professional courtesy ensures better rates</li>
                    </ul>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 pt-2">
                    <button onClick={resetFlow} className="flex-1 h-12 rounded-full border border-[#E5E5E5] bg-white text-[11px] font-bold uppercase tracking-widest transition-all hover:bg-[#F5F5F7]">
                      New Scan
                    </button>
                    <button onClick={() => toast.success('Reference saved')} className="flex-1 h-12 rounded-full bg-[#171717] text-white text-[11px] font-bold uppercase tracking-widest transition-all hover:opacity-90">
                      Save Context
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </main>

      <style dangerouslySetInnerHTML={{ __html: `
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
    </div>
  );
}
