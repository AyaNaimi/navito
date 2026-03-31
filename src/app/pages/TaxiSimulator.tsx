import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Navigation, Calculator, Clock, Info } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';

export default function TaxiSimulator() {
  const navigate = useNavigate();
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [distance, setDistance] = useState(0);
  const [taxiType, setTaxiType] = useState<'petit' | 'grand'>('petit');
  const [timeOfDay, setTimeOfDay] = useState<'day' | 'night'>('day');
  const [estimatedPrice, setEstimatedPrice] = useState<{ min: number; max: number } | null>(null);

  const calculatePrice = () => {
    if (!from || !to) return;

    // Mock distance calculation
    const mockDistance = Math.floor(Math.random() * 15) + 5;
    setDistance(mockDistance);

    const baseRate = taxiType === 'petit' ? 7 : 10;
    const nightMultiplier = timeOfDay === 'night' ? 1.5 : 1;

    const min = Math.floor(mockDistance * baseRate * nightMultiplier * 0.9);
    const max = Math.ceil(mockDistance * baseRate * nightMultiplier * 1.1);

    setEstimatedPrice({ min, max });
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
          <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
            <Calculator className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Taxi Price Simulator</h1>
            <p className="text-sm text-gray-600">Estimate fair taxi fares</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto px-6 py-6 space-y-6">
        {/* Info Banner */}
        <div className="bg-green-50 p-4 rounded-xl border border-green-200">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-green-900 mb-1">Know Before You Go</h3>
              <p className="text-sm text-green-700">
                Calculate estimated taxi fares to avoid overpaying. Always insist on using the meter!
              </p>
            </div>
          </div>
        </div>

        {/* Route Input */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="from">Pickup Location</Label>
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                id="from"
                placeholder="Enter starting point"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                className="pl-12 h-12 rounded-xl"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="to">Destination</Label>
            <div className="relative">
              <Navigation className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                id="to"
                placeholder="Enter destination"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                className="pl-12 h-12 rounded-xl"
              />
            </div>
          </div>
        </div>

        {/* Taxi Type */}
        <div>
          <Label className="mb-3 block">Taxi Type</Label>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setTaxiType('petit')}
              className={`p-4 rounded-xl border-2 transition-all ${
                taxiType === 'petit'
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="text-center">
                <p className="font-bold text-gray-900 mb-1">Petit Taxi</p>
                <p className="text-sm text-gray-600">7-8 MAD/km</p>
                <p className="text-xs text-gray-500 mt-1">City travel</p>
              </div>
            </button>

            <button
              onClick={() => setTaxiType('grand')}
              className={`p-4 rounded-xl border-2 transition-all ${
                taxiType === 'grand'
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="text-center">
                <p className="font-bold text-gray-900 mb-1">Grand Taxi</p>
                <p className="text-sm text-gray-600">10-12 MAD/km</p>
                <p className="text-xs text-gray-500 mt-1">Inter-city</p>
              </div>
            </button>
          </div>
        </div>

        {/* Time of Day */}
        <div>
          <Label className="mb-3 block">Time of Day</Label>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setTimeOfDay('day')}
              className={`p-4 rounded-xl border-2 transition-all ${
                timeOfDay === 'day'
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="text-center">
                <p className="font-bold text-gray-900 mb-1">Day Rate</p>
                <p className="text-sm text-gray-600">6 AM - 8 PM</p>
              </div>
            </button>

            <button
              onClick={() => setTimeOfDay('night')}
              className={`p-4 rounded-xl border-2 transition-all ${
                timeOfDay === 'night'
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="text-center">
                <p className="font-bold text-gray-900 mb-1">Night Rate</p>
                <p className="text-sm text-gray-600">8 PM - 6 AM</p>
                <p className="text-xs text-orange-600 font-medium mt-1">+50%</p>
              </div>
            </button>
          </div>
        </div>

        {/* Calculate Button */}
        <Button
          onClick={calculatePrice}
          disabled={!from || !to}
          className="w-full h-12 bg-green-600 hover:bg-green-700 rounded-xl"
        >
          <Calculator className="mr-2 h-5 w-5" />
          Calculate Fare
        </Button>

        {/* Results */}
        {estimatedPrice && (
          <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-2xl">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="h-5 w-5" />
              <p className="text-white/90">Estimated distance: {distance} km</p>
            </div>

            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 mb-4">
              <p className="text-white/80 text-sm mb-2">Estimated Fare Range</p>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold">{estimatedPrice.min}</span>
                <span className="text-2xl">-</span>
                <span className="text-4xl font-bold">{estimatedPrice.max}</span>
                <span className="text-xl">MAD</span>
              </div>
            </div>

            <div className="space-y-2 text-sm text-white/90">
              <p>✓ Based on {taxiType === 'petit' ? 'Petit Taxi' : 'Grand Taxi'} rates</p>
              <p>✓ {timeOfDay === 'night' ? 'Night rate (+50%)' : 'Day rate'} applied</p>
              <p>✓ This is an estimate - actual fare may vary</p>
            </div>
          </div>
        )}

        {/* Important Tips */}
        <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-200">
          <h3 className="font-bold text-yellow-900 mb-2">Important Tips</h3>
          <ul className="text-sm text-yellow-700 space-y-1.5">
            <li className="flex items-start gap-2">
              <span className="font-bold">•</span>
              <span>Always insist the driver uses the meter (compteur)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold">•</span>
              <span>Verify the meter is reset to the base fare at start</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold">•</span>
              <span>Night rates apply after 8 PM (50% surcharge)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold">•</span>
              <span>Petit taxis cannot leave city limits</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold">•</span>
              <span>Have small bills ready - drivers may not have change</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
