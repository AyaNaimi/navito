import { useMemo, useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  AlertTriangle,
  ArrowLeft,
  Camera,
  Check,
  ChevronDown,
  HelpCircle,
  Loader2,
  MapPin,
  Sparkles,
  Upload,
  ShieldCheck,
  MessageSquarePlus,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { useAppContext } from '../context/AppContext';
import { estimateViaBackend, reportPrice, type BackendEstimateResult } from '../services/backendEstimator';
import type { MarketContext } from '../services/priceEstimator';

// ─── Constants ────────────────────────────────────────────────────────────────
const reveal = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: [0.23, 1, 0.32, 1] as [number,number,number,number] },
};

export const AVAILABLE_CURRENCIES = [
  { code: 'MAD', symbol: 'MAD', prefix: false },
  { code: 'EUR', symbol: '€',   prefix: true  },
  { code: 'USD', symbol: '$',   prefix: true  },
  { code: 'GBP', symbol: '£',   prefix: true  },
  { code: 'CAD', symbol: 'C$',  prefix: true  },
];

const currencyByCountry: Record<string, string> = {
  Morocco: 'MAD', France: 'EUR', Spain: 'EUR',
  Portugal: 'EUR', UK: 'GBP', Canada: 'CAD',
};

const popularItems = [
  { name: 'Water Bottle',  min: 6,  max: 7   },
  { name: 'Orange Juice',  min: 10, max: 15  },
  { name: 'Mint Tea',      min: 10, max: 15  },
  { name: 'Tagine',        min: 70, max: 120 },
  { name: 'Babouches',     min: 120,max: 220 },
  { name: 'Argan Oil',     min: 90, max: 180 },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function fmt(val: number, symbol: string, prefix: boolean): string {
  const r = Math.round(val);
  return prefix ? `${symbol}${r}` : `${r} ${symbol}`;
}

function confidenceColor(v: number): string {
  if (v >= 0.8) return 'text-emerald-500';
  if (v >= 0.6) return 'text-amber-500';
  return 'text-red-500';
}

function confidenceLabel(v: number): string {
  if (v >= 0.8) return 'High';
  if (v >= 0.6) return 'Medium';
  return 'Low';
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function PriceEstimator() {
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const { country } = useAppContext();

  const cameraInputRef = useRef<HTMLInputElement | null>(null);
  const uploadInputRef  = useRef<HTMLInputElement | null>(null);
  const dropdownRef     = useRef<HTMLDivElement>(null);

  const [image,           setImage         ] = useState<string | null>(null);
  const [imageFile,       setImageFile      ] = useState<File | null>(null);
  const [isProcessing,    setIsProcessing   ] = useState(false);
  const [result,          setResult         ] = useState<BackendEstimateResult | null>(null);
  const [marketContext,   setMarketContext   ] = useState<MarketContext>('souk');
  const [condition,       setCondition      ] = useState<'new'|'used'>('new');
  const [city,            setCity           ] = useState('');
  const [dropdownOpen,    setDropdownOpen   ] = useState(false);
  const [showReport,      setShowReport     ] = useState(false);
  const [reportPrice_val, setReportPriceVal ] = useState('');
  const [reportShop,      setReportShop     ] = useState('');

  const defaultCurrency = currencyByCountry[country ?? 'Morocco'] ?? 'MAD';
  const [selectedCurrency, setSelectedCurrency] = useState(defaultCurrency);

  useEffect(() => {
    setSelectedCurrency(currencyByCountry[country ?? 'Morocco'] ?? 'MAD');
  }, [country]);

  const currency = useMemo(() =>
    AVAILABLE_CURRENCIES.find(c => c.code === selectedCurrency) ?? AVAILABLE_CURRENCIES[0],
    [selectedCurrency]
  );

  // Close dropdown on outside click
  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setDropdownOpen(false);
    };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  // ── File handler ─────────────────────────────────────────────
  const handleFile = async (file: File) => {
    if (image) URL.revokeObjectURL(image);
    setImage(URL.createObjectURL(file));
    setImageFile(file);
    setResult(null);
    setIsProcessing(true);
    setShowReport(false);

    try {
      const res = await estimateViaBackend(file, {
        country:       country ?? 'Morocco',
        city:          city || undefined,
        condition,
        marketContext,
        currency:      selectedCurrency,
      });
      setResult(res);
      if (res.status === 'OK') toast.success('Estimation complete');
      else if (res.status === 'INSUFFICIENT_DATA') toast.warning('More info needed');
      else toast.error('No market data found');
    } catch {
      toast.error('Connection error — check backend');
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
    setImage(null); setImageFile(null); setResult(null);
    setShowReport(false); setReportPriceVal(''); setReportShop('');
  };

  const submitReport = async () => {
    const price = parseFloat(reportPrice_val);
    if (!price || price <= 0 || !result?.identified_product) return;
    try {
      await reportPrice({
        country: country ?? 'Morocco',
        city: city || undefined,
        category: result.category ?? 'other',
        product_name: result.identified_product.name,
        price,
        currency_code: selectedCurrency,
        condition,
        market_context: marketContext,
        shop_name: reportShop || undefined,
      });
      toast.success('Price reported — merci!');
      setShowReport(false);
    } catch {
      toast.error('Could not submit report');
    }
  };

  // ── Pricing display helpers ───────────────────────────────────
  const pricing = result?.pricing;
  const meta    = result?.meta;

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-background pb-24 text-foreground selection:bg-accent/20">
      {/* Ambient blobs */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-0 right-0 h-[36%] w-[48%] rounded-full bg-accent/10 blur-[140px]" />
        <div className="absolute bottom-[12%] left-0 h-[38%] w-[45%] rounded-full bg-emerald-500/[0.05] blur-[120px]" />
      </div>

      {/* Header */}
      <motion.header
        initial={{ opacity:0, y:-10 }} animate={{ opacity:1, y:0 }}
        className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-2xl"
      >
        <div className="mx-auto flex max-w-xl items-center justify-between gap-4 px-6 py-5">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate(-1)}
              className="flex h-12 w-12 items-center justify-center rounded-2xl border border-border bg-secondary text-foreground transition-all hover:bg-card"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-muted-foreground">Market tools</p>
              <h1 className="mt-1 text-[18px] font-black uppercase tracking-tight italic">Price analytics</h1>
            </div>
          </div>

          {/* Currency picker */}
          <div ref={dropdownRef} className="relative">
            <button onClick={() => setDropdownOpen(v => !v)}
              className="flex h-11 items-center gap-2 rounded-2xl border border-border bg-secondary px-4 text-[11px] font-black uppercase tracking-widest text-foreground transition-all hover:bg-card"
            >
              <span>{currency.code}</span>
              <ChevronDown className={`h-3 w-3 text-muted-foreground transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence>
              {dropdownOpen && (
                <motion.div initial={{ opacity:0, scale:0.95, y:5 }} animate={{ opacity:1, scale:1, y:0 }} exit={{ opacity:0, scale:0.95, y:5 }}
                  className="absolute right-0 top-full z-50 mt-2 w-40 rounded-[1.4rem] border border-border bg-card p-1 shadow-2xl"
                >
                  {AVAILABLE_CURRENCIES.map(c => (
                    <button key={c.code} onClick={() => { setSelectedCurrency(c.code); setDropdownOpen(false); }}
                      className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-[12px] font-bold transition-colors ${c.code === selectedCurrency ? 'bg-secondary text-foreground' : 'text-muted-foreground hover:bg-secondary'}`}
                    >
                      <span>{c.code} ({c.symbol})</span>
                      {c.code === selectedCurrency && <Check className="h-3.5 w-3.5 text-accent" />}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.header>

      <main className="mx-auto flex max-w-xl flex-1 flex-col gap-6 px-6 py-8">

        {/* Context controls */}
        <motion.div {...reveal} className="space-y-3">
          {/* Market toggle */}
          <div className="flex p-1 bg-secondary rounded-2xl border border-border">
            {(['souk','modern'] as MarketContext[]).map(ctx => (
              <button key={ctx} onClick={() => setMarketContext(ctx)}
                className={`flex-1 py-3 px-4 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${marketContext===ctx ? 'bg-foreground text-background shadow-lg' : 'text-muted-foreground hover:text-foreground'}`}
              >
                {ctx === 'souk' ? 'Souk / Bazaar' : 'Modern Shop'}
              </button>
            ))}
          </div>

          {/* Condition + city row */}
          <div className="flex gap-3">
            <div className="flex flex-1 p-1 bg-secondary rounded-2xl border border-border">
              {(['new','used'] as const).map(c => (
                <button key={c} onClick={() => setCondition(c)}
                  className={`flex-1 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${condition===c ? 'bg-foreground text-background' : 'text-muted-foreground'}`}
                >
                  {c}
                </button>
              ))}
            </div>
            <div className="relative flex-1">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <input
                type="text" placeholder="City (optional)" value={city}
                onChange={e => setCity(e.target.value)}
                className="w-full h-full rounded-2xl border border-border bg-secondary pl-9 pr-3 text-[11px] font-semibold text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-accent"
              />
            </div>
          </div>
        </motion.div>

        {/* Camera / upload — only if no image */}
        {!image && (
          <motion.div {...reveal} transition={{ delay: 0.08 }} className="space-y-4">
            <button onClick={() => cameraInputRef.current?.click()}
              className="relative flex aspect-[16/7] w-full flex-col items-center justify-center gap-3 overflow-hidden rounded-[2.5rem] bg-foreground text-background shadow-[0_35px_80px_-25px_rgba(15,23,42,0.45)]"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
              <Camera className="relative z-10 h-8 w-8" strokeWidth={1.5} />
              <span className="relative z-10 text-[12px] font-black uppercase tracking-[0.2em]">Snap to verify</span>
            </button>
            <input ref={cameraInputRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={handleInputChange} />

            <button onClick={() => uploadInputRef.current?.click()}
              className="flex h-16 w-full items-center justify-center gap-3 rounded-[1.8rem] border border-dashed border-border bg-card/50 text-muted-foreground transition-all hover:bg-card hover:text-foreground"
            >
              <Upload className="h-4 w-4" />
              <span className="text-[11px] font-black uppercase tracking-widest">Upload from library</span>
            </button>
            <input ref={uploadInputRef} type="file" accept="image/*" className="hidden" onChange={handleInputChange} />

            {/* Benchmarks */}
            <div className="space-y-3">
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-muted-foreground px-1">Market benchmarks</p>
              <div className="grid grid-cols-2 gap-3">
                {popularItems.map(item => (
                  <div key={item.name} className="rounded-[1.6rem] border border-border bg-card/70 p-4 shadow-xl">
                    <p className="text-[13px] font-black uppercase tracking-tight text-foreground">{item.name}</p>
                    <p className="mt-2 text-[11px] font-bold text-accent">
                      {item.min} – {item.max} MAD
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Image + result */}
        {image && (
          <motion.div {...reveal} className="space-y-5">
            {/* Preview */}
            <div className="relative aspect-square overflow-hidden rounded-[2.5rem] border border-border bg-card shadow-2xl">
              <img src={image} alt="Item" className="h-full w-full object-contain" />
              {isProcessing && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/60 backdrop-blur-md">
                  <Loader2 className="mb-4 h-10 w-10 animate-spin text-foreground" />
                  <p className="text-[11px] font-black uppercase tracking-widest text-foreground">Identifying &amp; pricing…</p>
                  <p className="mt-1 text-[10px] text-muted-foreground">Two-phase AI analysis</p>
                </div>
              )}
            </div>

            <AnimatePresence mode="wait">

              {/* ── INSUFFICIENT_DATA ── */}
              {result?.status === 'INSUFFICIENT_DATA' && (
                <motion.div key="insufficient" initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}
                  className="rounded-[2.5rem] border border-amber-500/30 bg-amber-500/5 p-6 space-y-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-500/10">
                      <AlertTriangle className="h-5 w-5 text-amber-500" />
                    </div>
                    <div>
                      <h3 className="text-[14px] font-black uppercase tracking-tight text-foreground">Image not clear enough</h3>
                      <p className="text-[10px] font-bold text-amber-600 uppercase tracking-wider">
                        Confidence: {Math.round((result.confidence_identification ?? 0) * 100)}%
                      </p>
                    </div>
                  </div>
                  <p className="text-[13px] font-medium text-muted-foreground leading-relaxed">
                    {result.missing_info}
                  </p>
                  {result.hint && (
                    <p className="text-[11px] font-black uppercase tracking-widest text-amber-600">
                      → {result.hint}
                    </p>
                  )}
                  <button onClick={reset}
                    className="w-full rounded-2xl bg-foreground py-3.5 text-[11px] font-black uppercase tracking-widest text-background"
                  >
                    Try again
                  </button>
                </motion.div>
              )}

              {/* ── NO_MARKET_DATA ── */}
              {result?.status === 'NO_MARKET_DATA' && (
                <motion.div key="nodata" initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}
                  className="rounded-[2.5rem] border border-border bg-card p-6 space-y-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-secondary">
                      <HelpCircle className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <h3 className="text-[14px] font-black uppercase tracking-tight">{result.product}</h3>
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">No market data</p>
                    </div>
                  </div>
                  <p className="text-[13px] text-muted-foreground">{result.message}</p>
                  <p className="text-[11px] font-bold text-muted-foreground">
                    Be the first to report a price for this item in your city!
                  </p>
                  {/* Quick report */}
                  <div className="flex gap-2">
                    <input type="number" placeholder="Your price (MAD)" value={reportPrice_val}
                      onChange={e => setReportPriceVal(e.target.value)}
                      className="flex-1 rounded-xl border border-border bg-secondary px-3 py-2 text-[12px] text-foreground placeholder:text-muted-foreground focus:outline-none"
                    />
                    <button onClick={submitReport}
                      className="rounded-xl bg-foreground px-4 py-2 text-[11px] font-black text-background uppercase"
                    >
                      Submit
                    </button>
                  </div>
                  <button onClick={reset} className="w-full text-center text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                    Scan another item
                  </button>
                </motion.div>
              )}

              {/* ── OK ── */}
              {result?.status === 'OK' && pricing && meta && (
                <motion.div key="ok" initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} className="space-y-4">

                  {/* Result card */}
                  <div className="rounded-[2.5rem] border border-border bg-card p-6 shadow-2xl space-y-5">

                    {/* Header */}
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-foreground text-background">
                        <Check className="h-4 w-4" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-[16px] font-black uppercase tracking-tight">
                            {result.identified_product?.name}
                          </h3>
                          {meta.is_verified && (
                            <span className="flex items-center gap-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5">
                              <ShieldCheck className="h-2.5 w-2.5 text-emerald-500" />
                              <span className="text-[9px] font-black uppercase tracking-widest text-emerald-600">Verified</span>
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                          {result.identified_product?.brand} · {result.category}
                        </p>
                      </div>
                    </div>

                    {/* Price hero */}
                    <div className="rounded-[1.8rem] border border-border bg-secondary p-5 text-center">
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                        {marketContext === 'souk' ? 'Target bargaining price' : 'Retail price'}
                      </p>
                      <p className="mt-3 text-[36px] font-black tracking-tight text-foreground">
                        {fmt(pricing.price_suggested, currency.symbol, currency.prefix)}
                      </p>
                      <div className="mt-3 flex items-center justify-center gap-2">
                        <span className="text-[10px] font-bold uppercase text-muted-foreground">Fair range:</span>
                        <span className="text-[12px] font-black text-accent">
                          {fmt(pricing.price_min, currency.symbol, currency.prefix)}
                          &nbsp;–&nbsp;
                          {fmt(pricing.price_max, currency.symbol, currency.prefix)}
                        </span>
                      </div>
                      {marketContext === 'souk' && (
                        <p className="mt-2 text-[10px] text-muted-foreground">
                          Median: {fmt(pricing.price_median, currency.symbol, currency.prefix)}
                        </p>
                      )}
                    </div>

                    {/* Confidence row */}
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div className="rounded-xl bg-secondary p-3">
                        <p className="text-[9px] font-black uppercase tracking-wider text-muted-foreground">ID confidence</p>
                        <p className={`mt-1 text-[14px] font-black ${confidenceColor(meta.confidence_identification)}`}>
                          {confidenceLabel(meta.confidence_identification)}
                        </p>
                      </div>
                      <div className="rounded-xl bg-secondary p-3">
                        <p className="text-[9px] font-black uppercase tracking-wider text-muted-foreground">Price confidence</p>
                        <p className={`mt-1 text-[14px] font-black ${confidenceColor(meta.confidence_price)}`}>
                          {confidenceLabel(meta.confidence_price)}
                        </p>
                      </div>
                      <div className="rounded-xl bg-secondary p-3">
                        <p className="text-[9px] font-black uppercase tracking-wider text-muted-foreground">Data points</p>
                        <p className="mt-1 text-[14px] font-black text-foreground">{meta.evidence_count}</p>
                      </div>
                    </div>

                    {/* Negotiation tips — souk only */}
                    {marketContext === 'souk' && (
                      <div className="rounded-[2rem] border border-border bg-secondary/60 p-5">
                        <div className="mb-3 flex items-center gap-2">
                          <HelpCircle className="h-4 w-4 text-accent" />
                          <h4 className="text-[11px] font-black uppercase tracking-[0.2em]">Negotiation guidance</h4>
                        </div>
                        <ul className="space-y-2 text-[13px] font-medium leading-relaxed text-muted-foreground">
                          <li>• Start 40–50% below the asking price.</li>
                          <li>• Your target: <span className="font-black text-foreground">{fmt(pricing.price_suggested, currency.symbol, currency.prefix)}</span></li>
                          <li>• Walk away slowly if above <span className="font-black text-foreground">{fmt(pricing.price_max, currency.symbol, currency.prefix)}</span>.</li>
                        </ul>
                      </div>
                    )}

                    {/* Source note */}
                    <p className="text-[11px] text-muted-foreground text-center">
                      {meta.is_verified ? 'Grounded by Navito Market Index' : `AI estimate · Strategy: ${meta.strategy}`}
                    </p>
                  </div>

                  {/* Report price */}
                  <AnimatePresence>
                    {showReport ? (
                      <motion.div initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }}
                        className="rounded-[2rem] border border-border bg-card p-5 space-y-3"
                      >
                        <p className="text-[11px] font-black uppercase tracking-widest text-foreground">Report the real price you paid</p>
                        <div className="flex gap-2">
                          <input type="number" placeholder={`Price (${currency.code})`} value={reportPrice_val}
                            onChange={e => setReportPriceVal(e.target.value)}
                            className="flex-1 rounded-xl border border-border bg-secondary px-3 py-2.5 text-[12px] text-foreground placeholder:text-muted-foreground focus:outline-none"
                          />
                          <input type="text" placeholder="Shop name (opt.)" value={reportShop}
                            onChange={e => setReportShop(e.target.value)}
                            className="flex-1 rounded-xl border border-border bg-secondary px-3 py-2.5 text-[12px] text-foreground placeholder:text-muted-foreground focus:outline-none"
                          />
                        </div>
                        <button onClick={submitReport}
                          className="w-full rounded-2xl bg-foreground py-3 text-[11px] font-black uppercase tracking-widest text-background"
                        >
                          Submit report
                        </button>
                      </motion.div>
                    ) : null}
                  </AnimatePresence>

                  {/* Actions */}
                  <div className="flex gap-3">
                    <button onClick={reset}
                      className="flex-1 rounded-[1.6rem] border border-border bg-card px-4 py-4 text-[11px] font-black uppercase tracking-widest text-foreground transition-all hover:bg-secondary"
                    >
                      New scan
                    </button>
                    <button onClick={() => setShowReport(v => !v)}
                      className="flex items-center gap-2 flex-1 justify-center rounded-[1.6rem] bg-foreground px-4 py-4 text-[11px] font-black uppercase tracking-widest text-background transition-all hover:bg-accent hover:text-white"
                    >
                      <MessageSquarePlus className="h-3.5 w-3.5" />
                      Report price
                    </button>
                  </div>
                </motion.div>
              )}

            </AnimatePresence>
          </motion.div>
        )}
      </main>
    </div>
  );
}
