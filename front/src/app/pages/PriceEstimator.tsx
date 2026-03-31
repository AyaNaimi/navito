import { useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Camera, DollarSign, Sparkles, TrendingUp, Upload } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Skeleton } from '../components/ui/skeleton';
import { toast } from 'sonner';
import { useAppContext } from '../context/AppContext';
import { estimatePriceFromImage, type Currency, type EstimateResult } from '../services/priceEstimator';

type CatalogItem = {
  name: string;
  category: string;
  brand: string;
  min: number;
  max: number;
};

const currencyByCountry: Record<string, Currency> = {
  Morocco: { code: 'MAD', symbol: 'MAD', rateFromMAD: 1, prefix: false },
  France: { code: 'EUR', symbol: 'EUR', rateFromMAD: 0.092, prefix: true },
  Spain: { code: 'EUR', symbol: 'EUR', rateFromMAD: 0.092, prefix: true },
  Portugal: { code: 'EUR', symbol: 'EUR', rateFromMAD: 0.092, prefix: true },
};

const mockCatalog: CatalogItem[] = [
  { name: 'Bottle of Water (1.5L)', category: 'Beverages', brand: 'Ain Ifrane', min: 5, max: 8 },
  { name: 'Fresh Orange Juice', category: 'Beverages', brand: 'Local Vendor', min: 5, max: 10 },
  { name: 'Mint Tea', category: 'Beverages', brand: 'Cafe', min: 8, max: 15 },
  { name: 'Tagine (Restaurant)', category: 'Food', brand: 'Restaurant', min: 50, max: 120 },
  { name: 'Leather Babouches', category: 'Souvenirs', brand: 'Artisan', min: 100, max: 300 },
  { name: 'Argan Oil (100ml)', category: 'Souvenirs', brand: 'Cooperative', min: 80, max: 150 },
];

const popularItems = [
  { name: 'Water Bottle', min: 5, max: 8 },
  { name: 'Orange Juice', min: 5, max: 10 },
  { name: 'Mint Tea', min: 8, max: 15 },
  { name: 'Tagine', min: 50, max: 120 },
  { name: 'Babouches', min: 100, max: 300 },
  { name: 'Argan Oil', min: 80, max: 150 },
];

function formatRange(min: number, max: number, currency: Currency) {
  const roundedMin = Math.round(min);
  const roundedMax = Math.round(max);
  if (currency.prefix) {
    return `${currency.symbol} ${roundedMin}-${roundedMax}`;
  }
  return `${roundedMin}-${roundedMax} ${currency.symbol}`;
}

function buildMockResult(country: string | null, item: CatalogItem) {
  const currency = currencyByCountry[country ?? 'Morocco'] ?? currencyByCountry.Morocco;
  const rate = currency.rateFromMAD ?? 1;
  const confidence = 0.72 + Math.random() * 0.2;

  return {
    name: item.name,
    category: item.category,
    brand: item.brand,
    confidence: Math.min(confidence, 0.95),
    priceMin: item.min * rate,
    priceMax: item.max * rate,
    currency,
  } satisfies EstimateResult;
}

export default function PriceEstimator() {
  const navigate = useNavigate();
  const { country } = useAppContext();
  const cameraInputRef = useRef<HTMLInputElement | null>(null);
  const uploadInputRef = useRef<HTMLInputElement | null>(null);
  const [image, setImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<EstimateResult | null>(null);
  const [usingApi, setUsingApi] = useState(false);

  const currency = useMemo(() => {
    return currencyByCountry[country ?? 'Morocco'] ?? currencyByCountry.Morocco;
  }, [country]);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    if (image) {
      URL.revokeObjectURL(image);
    }

    const previewUrl = URL.createObjectURL(file);
    setImage(previewUrl);
    setResult(null);
    setIsProcessing(true);

    try {
      const apiResult = await estimatePriceFromImage(file, country);
      setResult(apiResult);
      setUsingApi(true);
      toast.success('Item detected and price estimated!');
    } catch (error) {
      console.error(error);
      const item = mockCatalog[Math.floor(Math.random() * mockCatalog.length)];
      const mockResult = buildMockResult(country, item);
      setResult(mockResult);
      setUsingApi(false);
      toast.success('Item detected and price estimated (mock).');
    } finally {
      setIsProcessing(false);
    }

    event.target.value = '';
  };

  const resetFlow = () => {
    if (image) {
      URL.revokeObjectURL(image);
    }
    setImage(null);
    setResult(null);
    setIsProcessing(false);
    setUsingApi(false);
  };

  return (
    <div className="size-full bg-white flex flex-col">
      {/* Header */}
      <div className="border-b px-6 py-4">
        <button
          onClick={() => navigate(-1)}
          className="mb-4"
        >
          <ArrowLeft className="h-6 w-6 text-gray-900" />
        </button>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
            <DollarSign className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Price Estimator</h1>
            <p className="text-sm text-gray-600">Check if you're paying fair prices</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto px-6 py-6 space-y-6">
        {/* Info */}
        <div className="bg-orange-50 p-4 rounded-xl border border-orange-200">
          <div className="flex items-start gap-3">
            <Sparkles className="h-5 w-5 text-orange-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-orange-900 mb-1">AI-Powered Price Check</h3>
              <ul className="text-sm text-orange-700 space-y-1">
                <li>* Snap a photo of any product</li>
                <li>* AI identifies the item</li>
                <li>* Get instant fair price estimate</li>
              </ul>
              <p className="mt-2 text-xs text-orange-700">
                Currency based on selected country{country ? `: ${country}.` : '.'}
              </p>
            </div>
          </div>
        </div>

        {!image ? (
          <>
            {/* Camera Button */}
            <Button
              onClick={() => cameraInputRef.current?.click()}
              className="w-full h-40 bg-gradient-to-br from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 rounded-2xl flex flex-col gap-3"
            >
              <Camera className="h-16 w-16" />
              <span className="text-lg font-semibold">Take Photo of Item</span>
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
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-4 text-gray-500">or</span>
              </div>
            </div>

            <Button
              variant="outline"
              onClick={() => uploadInputRef.current?.click()}
              className="w-full h-24 rounded-2xl border-2 border-dashed border-gray-300 hover:border-orange-500 flex flex-col gap-2"
            >
              <Upload className="h-8 w-8 text-gray-400" />
              <span className="font-medium text-gray-600">Upload Image</span>
            </Button>
            <input
              ref={uploadInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />

            {/* Popular Items to Check */}
            <div>
              <h3 className="font-bold text-gray-900 mb-4">Popular Items to Check</h3>
              <div className="grid grid-cols-2 gap-3">
                {popularItems.map((item) => (
                  <div
                    key={item.name}
                    className="bg-gray-50 border border-gray-200 p-4 rounded-xl hover:border-orange-500 transition-colors"
                  >
                    <p className="font-semibold text-sm text-gray-900 mb-1">{item.name}</p>
                    <p className="text-xs text-orange-600 font-medium">
                      {formatRange(item.min * (currency.rateFromMAD ?? 1), item.max * (currency.rateFromMAD ?? 1), currency)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="space-y-6">
            {/* Image */}
            <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 aspect-square flex items-center justify-center">
              {image ? (
                <img src={image} alt="Captured" className="absolute inset-0 size-full object-cover" />
              ) : (
                <Camera className="h-24 w-24 text-gray-400" />
              )}
            </div>

            {/* Processing Skeleton */}
            {isProcessing && (
              <div className="border border-gray-100 rounded-2xl p-6 bg-white shadow-sm">
                <Skeleton className="w-16 h-16 rounded-full mx-auto mb-4" />
                <Skeleton className="h-6 w-1/2 mx-auto mb-6" />
                
                <div className="space-y-3 mb-6 flex flex-col items-center">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                  <Skeleton className="h-4 w-4/6" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
                
                <div className="bg-gray-50 p-4 rounded-xl flex flex-col items-center">
                  <Skeleton className="h-4 w-1/3 mb-3" />
                  <Skeleton className="h-8 w-2/3" />
                </div>
                <p className="text-center text-sm text-gray-500 mt-4 animate-pulse">
                  Analyzing image and estimating price...
                </p>
              </div>
            )}

            {/* Detection Result */}
            {result && (
              <div className="bg-green-50 border-2 border-green-500 rounded-2xl p-6 text-center">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Item Detected</h3>
                <div className="space-y-2 text-sm text-gray-700">
                  <p><span className="font-semibold">Product:</span> {result.name}</p>
                  <p><span className="font-semibold">Category:</span> {result.category}</p>
                  <p><span className="font-semibold">Brand:</span> {result.brand}</p>
                  <p><span className="font-semibold">Confidence:</span> {Math.round(result.confidence * 100)}%</p>
                </div>
                <div className="mt-4 bg-white p-4 rounded-xl">
                  <p className="text-sm text-gray-600 mb-2">Fair Price Range</p>
                  <p className="text-3xl font-bold text-green-600">
                    {formatRange(result.priceMin, result.priceMax, result.currency)}
                  </p>
                  {!usingApi && (
                    <p className="mt-2 text-xs text-gray-500">Mock result (API not available).</p>
                  )}
                </div>
              </div>
            )}

            {/* Tips */}
            <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
              <h4 className="font-bold text-blue-900 mb-2">Negotiation Tips</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>* Start at 50% of the asking price</li>
                <li>* Be polite and smile</li>
                <li>* Walk away if price is too high</li>
                <li>* Compare prices at multiple shops</li>
              </ul>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <Button
                onClick={resetFlow}
                variant="outline"
                className="flex-1 h-12 rounded-xl"
              >
                Check Another Item
              </Button>
              <Button
                onClick={() => toast.success('Price saved for reference!')}
                className="flex-1 h-12 bg-orange-600 hover:bg-orange-700 rounded-xl"
              >
                Save Price
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
