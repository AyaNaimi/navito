import { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Camera,
  Check,
  ChevronDown,
  DollarSign,
  HelpCircle,
  Loader2,
  MapPin,
  Upload,
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { referencePrices } from '../data/mockData';
import { toast } from 'sonner';
import { estimateViaBackend, type MarketContext } from '../services/priceEstimatorService';

const AVAILABLE_CURRENCIES = [
  { code: 'MAD', symbol: 'MAD', prefix: false },
  { code: 'EUR', symbol: '€', prefix: true },
  { code: 'USD', symbol: '$', prefix: true },
];

const popularItems = [
  { name: 'Water Bottle', min: 5, max: 8 },
  { name: 'Orange Juice', min: 5, max: 10 },
  { name: 'Mint Tea', min: 8, max: 15 },
  { name: 'Tagine', min: 50, max: 120 },
  { name: 'Babouches', min: 100, max: 300 },
  { name: 'Argan Oil', min: 80, max: 150 },
];

function fmt(val: number, symbol: string, prefix: boolean): string {
  const r = Math.round(val);
  return prefix ? `${symbol}${r}` : `${r} ${symbol}`;
}

function confidenceLabel(v: number): { label: string; color: string } {
  if (v >= 0.8) return { label: 'Haute', color: 'text-green-600' };
  if (v >= 0.6) return { label: 'Moyenne', color: 'text-amber-600' };
  return { label: 'Basse', color: 'text-red-600' };
}

export default function PriceEstimator() {
  const navigate = useNavigate();
  const cameraInputRef = useRef<HTMLInputElement | null>(null);
  const uploadInputRef = useRef<HTMLInputElement | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [image, setImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<{
    status: 'OK' | 'INSUFFICIENT_DATA' | 'NO_MARKET_DATA' | 'ERROR';
    identified_product?: { name: string; brand: string };
    category?: string;
    pricing?: {
      price_median: number;
      price_suggested: number;
      price_min: number;
      price_max: number;
    };
    meta?: {
      confidence_identification: number;
      confidence_price: number;
      evidence_count: number;
      is_verified: boolean;
    };
    message?: string;
  } | null>(null);
  const [marketContext, setMarketContext] = useState<MarketContext>('souk');
  const [condition, setCondition] = useState<'new' | 'used'>('new');
  const [city, setCity] = useState('');
  const [selectedCurrency, setSelectedCurrency] = useState('MAD');
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const currency = AVAILABLE_CURRENCIES.find(c => c.code === selectedCurrency) ?? AVAILABLE_CURRENCIES[0];

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  const handleFile = async (file: File) => {
    if (image) URL.revokeObjectURL(image);
    setImage(URL.createObjectURL(file));
    setImageFile(file);
    setResult(null);
    setIsProcessing(true);

    try {
      const res = await estimateViaBackend(file, {
        country: 'Morocco',
        city: city || undefined,
        condition,
        marketContext,
        currency: selectedCurrency,
      });
      setResult(res);
      if (res.status === 'OK') toast.success('Analyse terminee!');
      else if (res.status === 'INSUFFICIENT_DATA') toast.warning('Image pas assez claire');
      else toast.error('Pas de donnees de marche');
    } catch {
      toast.error('Erreur de connexion');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    e.target.value = '';
  };

  const reset = () => {
    if (image) URL.revokeObjectURL(image);
    setImage(null);
    setImageFile(null);
    setResult(null);
  };

  const pricing = result?.pricing;
  const meta = result?.meta;

  return (
    <div className="size-full bg-white/75 backdrop-blur-sm flex flex-col">
      <div className="border-b px-6 py-4">
        <button onClick={() => navigate(-1)} className="mb-4">
          <ArrowLeft className="h-6 w-6 text-gray-900" />
        </button>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
              <DollarSign className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Estimateur de Prix</h1>
              <p className="text-sm text-gray-600">Analyse et estime le prix</p>
            </div>
          </div>

          <div ref={dropdownRef} className="relative">
            <button
              onClick={() => setDropdownOpen(v => !v)}
              className="flex items-center gap-2 h-11 rounded-xl border border-gray-300 bg-white px-4 text-sm font-semibold"
            >
              <span>{currency.code}</span>
              <ChevronDown className={`h-4 w-4 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            {dropdownOpen && (
              <div className="absolute right-0 top-full z-50 mt-2 w-32 bg-white rounded-xl border shadow-lg p-1">
                {AVAILABLE_CURRENCIES.map(c => (
                  <button
                    key={c.code}
                    onClick={() => { setSelectedCurrency(c.code); setDropdownOpen(false); }}
                    className={`w-full text-left px-3 py-2 text-sm rounded-lg ${c.code === selectedCurrency ? 'bg-orange-100 font-semibold' : 'hover:bg-gray-50'}`}
                  >
                    {c.code} ({c.symbol})
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto px-6 py-6 space-y-4">
        <div className="space-y-3">
          <div className="flex rounded-xl border border-gray-200 overflow-hidden">
            {(['souk', 'modern'] as MarketContext[]).map(ctx => (
              <button
                key={ctx}
                onClick={() => setMarketContext(ctx)}
                className={`flex-1 py-3 text-sm font-semibold transition-colors ${
                  marketContext === ctx
                    ? 'bg-orange-500 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                {ctx === 'souk' ? 'Souk / Bazaar' : 'Boutique Moderne'}
              </button>
            ))}
          </div>

          <div className="flex gap-3">
            <div className="flex flex-1 rounded-xl border border-gray-200 overflow-hidden">
              {(['new', 'used'] as const).map(c => (
                <button
                  key={c}
                  onClick={() => setCondition(c)}
                  className={`flex-1 py-2 text-sm font-semibold transition-colors ${
                    condition === c
                      ? 'bg-orange-500 text-white'
                      : 'bg-white text-gray-600'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
            <div className="relative flex-1">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Ville (optionnel)"
                value={city}
                onChange={e => setCity(e.target.value)}
                className="w-full h-full rounded-xl border border-gray-200 bg-white pl-9 pr-3 text-sm"
              />
            </div>
          </div>
        </div>

        {!image ? (
          <>
            <input ref={cameraInputRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={handleInputChange} />
            <input ref={uploadInputRef} type="file" accept="image/*" className="hidden" onChange={handleInputChange} />

            <button
              onClick={() => cameraInputRef.current?.click()}
              className="w-full aspect-[16/9] rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 flex flex-col items-center justify-center gap-3 text-white shadow-lg"
            >
              <Camera className="h-10 w-10" />
              <span className="text-sm font-bold uppercase tracking-wider">Prends une Photo</span>
            </button>

            <button
              onClick={() => uploadInputRef.current?.click()}
              className="w-full h-16 rounded-2xl border-2 border-dashed border-gray-300 flex items-center justify-center gap-2 text-gray-500 hover:border-orange-400 hover:text-orange-500"
            >
              <Upload className="h-5 w-5" />
              <span className="text-sm font-semibold uppercase tracking-wider">Upload Image</span>
            </button>

            <div className="space-y-3">
              <p className="text-xs font-bold uppercase text-gray-500 tracking-wider">Prix de Reference</p>
              <div className="grid grid-cols-2 gap-2">
                {popularItems.map(item => (
                  <div key={item.name} className="rounded-xl border border-gray-200 bg-white p-3">
                    <p className="text-sm font-bold text-gray-900">{item.name}</p>
                    <p className="text-sm font-bold text-orange-500">{item.min} – {item.max} MAD</p>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="space-y-4">
            <div className="relative rounded-2xl overflow-hidden bg-gray-100 aspect-square">
              <img src={image} alt="Item" className="w-full h-full object-contain" />
              {isProcessing && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50">
                  <Loader2 className="h-10 w-10 text-white animate-spin mb-2" />
                  <p className="text-white text-sm font-semibold">Identification en cours...</p>
                  <p className="text-white/70 text-xs">Analyse par IA</p>
                </div>
              )}
            </div>

            {result?.status === 'OK' && pricing && meta && (
              <div className="space-y-4">
                <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-lg">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center">
                      <Check className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">{result.identified_product?.name}</h3>
                      <p className="text-xs text-gray-500">
                        {result.identified_product?.brand} · {result.category}
                      </p>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-4 text-center mb-4">
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">
                      {marketContext === 'souk' ? 'Prix cible' : 'Prix retail'}
                    </p>
                    <p className="text-3xl font-bold text-gray-900">
                      {fmt(pricing.price_suggested, currency.symbol, currency.prefix)}
                    </p>
                    <div className="mt-2 flex items-center justify-center gap-2">
                      <span className="text-xs text-gray-500">Fourchette:</span>
                      <span className="text-sm font-bold text-orange-500">
                        {fmt(pricing.price_min, currency.symbol, currency.prefix)}
                        {' – '}
                        {fmt(pricing.price_max, currency.symbol, currency.prefix)}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center mb-4">
                    <div className="bg-gray-50 rounded-lg p-2">
                      <p className="text-[10px] text-gray-500 uppercase">Confiance ID</p>
                      <p className={`text-sm font-bold ${confidenceLabel(meta.confidence_identification).color}`}>
                        {confidenceLabel(meta.confidence_identification).label}
                      </p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-2">
                      <p className="text-[10px] text-gray-500 uppercase">Confiance Prix</p>
                      <p className={`text-sm font-bold ${confidenceLabel(meta.confidence_price).color}`}>
                        {confidenceLabel(meta.confidence_price).label}
                      </p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-2">
                      <p className="text-[10px] text-gray-500 uppercase">Donnees</p>
                      <p className="text-sm font-bold">{meta.evidence_count}</p>
                    </div>
                  </div>

                  {marketContext === 'souk' && (
                    <div className="bg-orange-50 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <HelpCircle className="h-4 w-4 text-orange-500" />
                        <p className="text-xs font-bold uppercase text-orange-700">Conseils de marchandage</p>
                      </div>
                      <ul className="text-sm text-orange-800 space-y-1">
                        <li>• Commencez 40-50% en dessous du prix demande.</li>
                        <li>• Votre cible: <span className="font-bold">{fmt(pricing.price_suggested, currency.symbol, currency.prefix)}</span></li>
                        <li>• Partez si le prix depasse <span className="font-bold">{fmt(pricing.price_max, currency.symbol, currency.prefix)}</span></li>
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}

            {(result?.status === 'NO_MARKET_DATA' || result?.status === 'INSUFFICIENT_DATA') && (
              <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
                <div className="flex items-center gap-3 mb-3">
                  <HelpCircle className="h-6 w-6 text-amber-500" />
                  <h3 className="font-bold text-gray-900">{result.message || 'Donnees insuffisantes'}</h3>
                </div>
                <p className="text-sm text-gray-600">Essayez une autre photo avec un meilleur eclairage.</p>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={reset}
                className="flex-1 h-12 rounded-xl border border-gray-300 font-semibold"
              >
                Nouveau scan
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
