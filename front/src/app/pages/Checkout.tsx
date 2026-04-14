import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Users, CreditCard, Check } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { monuments, activities } from '../data/mockData';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';

export default function Checkout() {
  const { t } = useTranslation();
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
    toast.success(t('checkout.success', 'Booking confirmed! Check your email for details.'));
    setTimeout(() => navigate('/home'), 2000);
  };

  return (
    <div className="size-full bg-background flex flex-col text-foreground transition-colors duration-500">
      {/* Header */}
      <div className="border-b border-border px-6 py-4 bg-background/80 backdrop-blur-xl">
        <button
          onClick={() => navigate(-1)}
          className="mb-4 h-10 w-10 flex items-center justify-center rounded-xl bg-secondary border border-border"
        >
          <ArrowLeft className="h-5 w-5 text-foreground" />
        </button>
        <h1 className="text-2xl font-black text-foreground uppercase tracking-tight italic">{t('checkout.title', 'Checkout')}</h1>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto px-6 py-6 space-y-6 scrollbar-hide">
        {/* Booking Details */}
        <div>
          <h2 className="text-[10px] font-black tracking-widest uppercase text-muted-foreground mb-4">{t('checkout.bookingDetails', 'Booking Details')}</h2>
          <div className="bg-card border border-border p-6 rounded-[2rem] shadow-xl space-y-4">
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">{t('checkout.experience', 'Experience')}</p>
              <p className="text-lg font-black text-foreground uppercase tracking-tight">{item.name}</p>
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">{t('checkout.location', 'Location')}</p>
              <p className="text-md font-bold text-foreground flex items-center gap-2">
                <MapPin className="h-4 w-4 text-accent" />
                {item.city}
              </p>
            </div>
          </div>
        </div>

        {/* Date Selection */}
        <div className="space-y-4">
          <Label htmlFor="date" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">{t('checkout.selectDate', 'Select Date')}</Label>
          <div className="relative">
            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="pl-12 h-14 rounded-2xl bg-secondary border-transparent focus:bg-card focus:border-border transition-all font-bold"
              min={new Date().toISOString().split('T')[0]}
            />
          </div>
        </div>

        {/* Travelers */}
        <div className="space-y-4">
          <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">{t('checkout.travelers', 'Number of Travelers')}</Label>
          <div className="flex items-center gap-4 bg-secondary p-4 rounded-2xl border border-border">
            <Users className="h-5 w-5 text-muted-foreground" />
            <div className="flex-1 flex items-center justify-between">
              <button
                onClick={() => setTravelers(Math.max(1, travelers - 1))}
                className="w-12 h-12 rounded-xl bg-card border border-border hover:border-accent transition-colors font-black text-lg"
              >
                -
              </button>
              <span className="text-xl font-black tabular-nums">{travelers}</span>
              <button
                onClick={() => setTravelers(travelers + 1)}
                className="w-12 h-12 rounded-xl bg-card border border-border hover:border-accent transition-colors font-black text-lg"
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* Contact Details */}
        <div className="space-y-6 pt-2">
          <h2 className="text-[10px] font-black tracking-widest uppercase text-muted-foreground ml-1">{t('checkout.contactDetails', 'Contact Details')}</h2>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="firstName" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">{t('checkout.firstName', 'First Name')}</Label>
              <Input
                id="firstName"
                placeholder={t('checkout.firstNamePlaceholder', 'Alex')}
                className="h-14 rounded-2xl bg-secondary border-transparent focus:bg-card focus:border-border transition-all font-bold"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">{t('checkout.email', 'Email')}</Label>
              <Input
                id="email"
                type="email"
                placeholder={t('checkout.emailPlaceholder', 'alex@example.com')}
                className="h-14 rounded-2xl bg-secondary border-transparent focus:bg-card focus:border-border transition-all font-bold"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">{t('checkout.phone', 'Phone Number')}</Label>
              <Input
                id="phone"
                type="tel"
                placeholder={t('checkout.phonePlaceholder', '+212 6XX XXX XXX')}
                className="h-14 rounded-2xl bg-secondary border-transparent focus:bg-card focus:border-border transition-all font-bold"
              />
            </div>
          </div>
        </div>

        {/* Promo Code */}
        <div className="space-y-4 py-2">
          <Label htmlFor="promo" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">{t('checkout.promoCode', 'Promo Code (Optional)')}</Label>
          <div className="flex gap-2">
            <Input
              id="promo"
              placeholder={t('checkout.promoPlaceholder', 'Enter promo code')}
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
              className="h-14 rounded-2xl bg-secondary border-transparent focus:bg-card focus:border-border transition-all font-bold"
            />
            <Button variant="outline" className="h-14 px-8 rounded-2xl font-black uppercase tracking-widest text-[10px] border-border bg-card/50">
              {t('checkout.apply', 'Apply')}
            </Button>
          </div>
        </div>

        {/* Price Breakdown */}
        <div className="bg-card border border-border p-6 rounded-[2rem] shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{t('checkout.pricePerPerson', 'Price per person')}</span>
            <span className="font-black tabular-nums">{pricePerPerson} MAD</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{t('checkout.travelersCount', 'Travelers')}</span>
            <span className="font-black tabular-nums">× {travelers}</span>
          </div>
          <div className="border-t border-border pt-4 flex items-center justify-between">
            <span className="text-lg font-black text-foreground uppercase tracking-tight">{t('checkout.total', 'Total')}</span>
            <span className="text-2xl font-black text-accent tabular-nums">{total} MAD</span>
          </div>
        </div>

        {/* Free Cancellation */}
        <div className="bg-emerald-500/5 p-6 rounded-[2rem] border border-emerald-500/20">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 flex items-center justify-center flex-shrink-0 border border-emerald-500/10">
              <Check className="h-5 w-5 text-emerald-500" />
            </div>
            <div>
              <p className="font-black text-emerald-500 uppercase tracking-widest text-[10px] mb-1">{t('checkout.freeCancellation', 'Free cancellation')}</p>
              <p className="text-[13px] text-muted-foreground font-medium leading-relaxed">{t('checkout.freeCancellationDesc', 'Cancel up to 24 hours before your experience starts for a full refund.')}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-border bg-background/80 backdrop-blur-xl px-6 py-8">
        <Button
          onClick={handleCheckout}
          className="w-full h-16 bg-foreground text-background hover:bg-accent hover:text-white rounded-[2rem] font-black uppercase tracking-widest text-[11px] shadow-2xl shadow-foreground/5 transition-all outline-none"
        >
          <CreditCard className="mr-3 h-5 w-5" />
          {t('checkout.confirmPay', 'Confirm & Pay')} {total} MAD
        </Button>
      </div>
    </div>
  );
}
