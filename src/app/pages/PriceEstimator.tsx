import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Camera, DollarSign, Sparkles, TrendingUp } from 'lucide-react';
import { Button } from '../components/ui/button';
import { referencePrices } from '../data/mockData';
import { toast } from 'sonner';

export default function PriceEstimator() {
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(false);
  const [detectedItem, setDetectedItem] = useState<string | null>(null);
  const [estimatedPrice, setEstimatedPrice] = useState<string | null>(null);

  const handleCapture = () => {
    // Mock AI detection
    setTimeout(() => {
      setSelectedImage(true);
      const randomItem = referencePrices[Math.floor(Math.random() * referencePrices.length)];
      setDetectedItem(randomItem.item);
      setEstimatedPrice(randomItem.price);
      toast.success('Item detected and price estimated!');
    }, 1500);
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
                <li>• Snap a photo of any product</li>
                <li>• AI identifies the item</li>
                <li>• Get instant fair price estimate</li>
              </ul>
            </div>
          </div>
        </div>

        {!selectedImage ? (
          <>
            {/* Camera Button */}
            <Button
              onClick={handleCapture}
              className="w-full h-40 bg-gradient-to-br from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 rounded-2xl flex flex-col gap-3"
            >
              <Camera className="h-16 w-16" />
              <span className="text-lg font-semibold">Take Photo of Item</span>
            </Button>

            {/* Popular Items to Check */}
            <div>
              <h3 className="font-bold text-gray-900 mb-4">Popular Items to Check</h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { name: 'Water Bottle', icon: '💧', price: '5-8 MAD' },
                  { name: 'Orange Juice', icon: '🍊', price: '5-10 MAD' },
                  { name: 'Mint Tea', icon: '🍵', price: '8-15 MAD' },
                  { name: 'Tagine', icon: '🍲', price: '50-120 MAD' },
                  { name: 'Babouches', icon: '👞', price: '100-300 MAD' },
                  { name: 'Argan Oil', icon: '🫒', price: '80-150 MAD' },
                ].map((item) => (
                  <div
                    key={item.name}
                    className="bg-gray-50 border border-gray-200 p-4 rounded-xl hover:border-orange-500 transition-colors cursor-pointer"
                  >
                    <div className="text-3xl mb-2">{item.icon}</div>
                    <p className="font-semibold text-sm text-gray-900 mb-1">{item.name}</p>
                    <p className="text-xs text-orange-600 font-medium">{item.price}</p>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="space-y-6">
            {/* Mock Image */}
            <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 aspect-square flex items-center justify-center">
              <Camera className="h-24 w-24 text-gray-400" />
            </div>

            {/* Detection Result */}
            <div className="bg-green-50 border-2 border-green-500 rounded-2xl p-6 text-center">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Item Detected!</h3>
              <p className="text-gray-600 mb-1">{detectedItem}</p>
              <div className="mt-4 bg-white p-4 rounded-xl">
                <p className="text-sm text-gray-600 mb-2">Fair Price Range</p>
                <p className="text-3xl font-bold text-green-600">{estimatedPrice}</p>
              </div>
            </div>

            {/* Tips */}
            <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
              <h4 className="font-bold text-blue-900 mb-2">Negotiation Tips</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Start at 50% of the asking price</li>
                <li>• Be polite and smile</li>
                <li>• Walk away if price is too high</li>
                <li>• Compare prices at multiple shops</li>
              </ul>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <Button
                onClick={() => {
                  setSelectedImage(false);
                  setDetectedItem(null);
                  setEstimatedPrice(null);
                }}
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
