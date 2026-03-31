import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Users, CreditCard, Check } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { monuments, activities } from '../data/mockData';
import { toast } from 'sonner';

export default function Checkout() {
  const { type, id } = useParams();
  const navigate = useNavigate();
  const [travelers, setTravelers] = useState(1);
  const [date, setDate] = useState('');
  const [promoCode, setPromoCode] = useState('');

  const monument = monuments.find((m) => m.id === Number(id));
  const activity = activities.find((a) => a.id === Number(id));
  const item = monument || activity;

  if (!item) {
    return null;
  }

  const pricePerPerson = 'price' in item ? item.price : 0;
  const total = pricePerPerson * travelers;

  const handleCheckout = () => {
    toast.success('Booking confirmed! Check your email for details.');
    setTimeout(() => navigate('/home'), 2000);
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
        <h1 className="text-2xl font-bold text-gray-900">Checkout</h1>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto px-6 py-6 space-y-6">
        {/* Booking Details */}
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-4">Booking Details</h2>
          <div className="bg-gray-50 p-4 rounded-xl space-y-3">
            <div>
              <p className="text-sm text-gray-600">Experience</p>
              <p className="font-semibold text-gray-900">{item.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Location</p>
              <p className="font-semibold text-gray-900">{item.city}</p>
            </div>
          </div>
        </div>

        {/* Date Selection */}
        <div className="space-y-2">
          <Label htmlFor="date">Select Date</Label>
          <div className="relative">
            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="pl-12 h-12 rounded-xl"
              min={new Date().toISOString().split('T')[0]}
            />
          </div>
        </div>

        {/* Travelers */}
        <div className="space-y-2">
          <Label>Number of Travelers</Label>
          <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-xl">
            <Users className="h-5 w-5 text-gray-600" />
            <div className="flex-1 flex items-center justify-between">
              <button
                onClick={() => setTravelers(Math.max(1, travelers - 1))}
                className="w-10 h-10 rounded-full bg-white border border-gray-200 hover:border-[#0D9488] transition-colors"
              >
                -
              </button>
              <span className="text-lg font-semibold">{travelers}</span>
              <button
                onClick={() => setTravelers(travelers + 1)}
                className="w-10 h-10 rounded-full bg-white border border-gray-200 hover:border-[#0D9488] transition-colors"
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* Contact Details */}
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-4">Contact Details</h2>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                placeholder="Alex"
                className="h-12 rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="alex@example.com"
                className="h-12 rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+212 6XX XXX XXX"
                className="h-12 rounded-xl"
              />
            </div>
          </div>
        </div>

        {/* Promo Code */}
        <div className="space-y-2">
          <Label htmlFor="promo">Promo Code (Optional)</Label>
          <div className="flex gap-2">
            <Input
              id="promo"
              placeholder="Enter promo code"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
              className="h-12 rounded-xl"
            />
            <Button variant="outline" className="h-12 px-6 rounded-xl">
              Apply
            </Button>
          </div>
        </div>

        {/* Price Breakdown */}
        <div className="bg-gray-50 p-4 rounded-xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-gray-700">Price per person</span>
            <span className="font-semibold">{pricePerPerson} MAD</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-700">Travelers</span>
            <span className="font-semibold">× {travelers}</span>
          </div>
          <div className="border-t border-gray-200 pt-3 flex items-center justify-between">
            <span className="text-lg font-bold text-gray-900">Total</span>
            <span className="text-2xl font-bold text-[#0D9488]">{total} MAD</span>
          </div>
        </div>

        {/* Free Cancellation */}
        <div className="bg-green-50 p-4 rounded-xl border border-green-200">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
              <Check className="h-4 w-4 text-white" />
            </div>
            <div>
              <p className="font-semibold text-green-900 mb-1">Free cancellation</p>
              <p className="text-sm text-green-700">Cancel up to 24 hours before your experience starts for a full refund.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t bg-white px-6 py-4">
        <Button
          onClick={handleCheckout}
          className="w-full h-12 bg-[#0D9488] hover:bg-[#0D9488]/90 rounded-xl"
        >
          <CreditCard className="mr-2 h-5 w-5" />
          Confirm & Pay {total} MAD
        </Button>
      </div>
    </div>
  );
}
