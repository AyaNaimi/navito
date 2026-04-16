import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Car, ShieldCheck, MapPin, Phone, User, Mail, Navigation, CheckCircle, ChevronRight } from 'lucide-react';
import { Button } from '../../../app/components/ui/button';
import { Input } from '../../../app/components/ui/input';
import { Label } from '../../../app/components/ui/label';
import { useAppContext } from '../../../app/context/AppContext';

export default function DriverSignup() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    city: 'Casablanca',
    vehicleType: 'Sedan',
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { setUserSession, submitDriverRegistration } = useAppContext();

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
        // 1. Submit Registration
        submitDriverRegistration(formData);
        
        // 2. Set Session
        setUserSession({
            name: formData.fullName,
            email: formData.email,
            role: 'driver',
        });

        // 3. Direct to Pending (Skip Join flow as requested)
        navigate('/driver/pending');
        setIsLoading(false);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans selection:bg-teal-500/10">
      {/* Left Decoration Panel */}
      <div className="hidden lg:flex w-1/3 bg-[#020617] p-12 flex-col justify-between relative overflow-hidden">
        <div className="absolute top-0 right-0 w-full h-full opacity-20 pointer-events-none">
           <div className="absolute top-[-20%] right-[-20%] size-96 bg-teal-500 rounded-full blur-[100px]" />
           <div className="absolute bottom-[-20%] left-[-20%] size-96 bg-emerald-500 rounded-full blur-[100px]" />
        </div>
        
        <div className="z-10 animate-in fade-in duration-1000">
           <h2 className="text-3xl font-black text-white uppercase tracking-tighter italic">Navito <span className="text-teal-400 not-italic">Pilot</span></h2>
        </div>

        <div className="z-10 space-y-8 animate-in slide-in-from-left-8 duration-700">
           <h3 className="text-5xl font-black text-white leading-tight uppercase tracking-tighter">Propulsez<br />votre carrière.</h3>
           <p className="text-slate-400 font-bold leading-relaxed max-w-sm">Rejoignez l'élite du transport au Maroc. Gains premium, flexibilité totale et outils de pointe.</p>
           
           <div className="space-y-4 pt-6">
              {[
                "Revenus garantis et paiements directs",
                "Assistance pilote 24/7",
                "Accès au réseau VIP Navito"
              ].map((text, idx) => (
                <div key={idx} className="flex items-center gap-3 text-white font-black text-[10px] uppercase tracking-widest">
                   <div className="flex size-5 items-center justify-center rounded-full bg-teal-500 text-teal-950">
                      <CheckCircle className="size-3" />
                   </div>
                   {text}
                </div>
              ))}
           </div>
        </div>

        <div className="z-10 pt-12 border-t border-white/10">
           <p className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em]">Navito Professional Network • 2026</p>
        </div>
      </div>

      {/* Right Form Panel */}
      <div className="flex-1 flex items-center justify-center p-8 lg:p-20 bg-white">
        <div className="w-full max-w-lg space-y-10 animate-in fade-in slide-in-from-right-8 duration-700">
          <div className="space-y-2">
             <button 
                onClick={() => navigate('/driver/login')} 
                className="group flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#00897B] hover:text-slate-900 transition-colors"
             >
                <ArrowLeft className="size-3 group-hover:translate-x-[-4px] transition-transform" /> Retour à la connexion
             </button>
             <h4 className="text-4xl font-black text-slate-900 tracking-tighter uppercase mt-4">Nouveau Profil Pilot</h4>
             <p className="text-slate-400 font-bold text-sm">Créez votre compte en moins de 2 minutes.</p>
          </div>

          <form onSubmit={handleSignup} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Nom complet</Label>
                    <div className="relative group">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-slate-300 group-focus-within:text-[#00897B] transition-colors" />
                        <Input
                            placeholder="Omar Tazi"
                            value={formData.fullName}
                            onChange={(e) => setFormData(p => ({...p, fullName: e.target.value}))}
                            className="h-14 rounded-2xl bg-slate-50 border-0 focus:ring-4 focus:ring-[#00897B]/10 font-bold pl-12 transition-all"
                            required
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Email Pro</Label>
                    <div className="relative group">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-slate-300 group-focus-within:text-[#00897B] transition-colors" />
                        <Input
                            type="email"
                            placeholder="omar@navito.ma"
                            value={formData.email}
                            onChange={(e) => setFormData(p => ({...p, email: e.target.value}))}
                            className="h-14 rounded-2xl bg-slate-50 border-0 focus:ring-4 focus:ring-[#00897B]/10 font-bold pl-12 transition-all"
                            required
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Mobile</Label>
                    <div className="relative group">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-slate-300 group-focus-within:text-[#00897B] transition-colors" />
                        <Input
                            placeholder="+212 6..."
                            value={formData.phone}
                            onChange={(e) => setFormData(p => ({...p, phone: e.target.value}))}
                            className="h-14 rounded-2xl bg-slate-50 border-0 focus:ring-4 focus:ring-[#00897B]/10 font-bold pl-12 transition-all"
                            required
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Base Opérationnelle</Label>
                    <div className="relative group">
                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-slate-300 group-focus-within:text-[#00897B] transition-colors" />
                        <Input
                            placeholder="Marrakech"
                            value={formData.city}
                            onChange={(e) => setFormData(p => ({...p, city: e.target.value}))}
                            className="h-14 rounded-2xl bg-slate-50 border-0 focus:ring-4 focus:ring-[#00897B]/10 font-bold pl-12 transition-all"
                            required
                        />
                    </div>
                </div>
            </div>

            <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Catégorie de Service</Label>
                <div className="relative group">
                    <Navigation className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-slate-300 group-focus-within:text-[#00897B] transition-colors shadow-sm" />
                    <select 
                        value={formData.vehicleType}
                        onChange={(e) => setFormData(p => ({...p, vehicleType: e.target.value}))}
                        className="w-full h-14 rounded-2xl bg-slate-50 border-0 focus:ring-4 focus:ring-[#00897B]/10 font-black pl-12 pr-6 appearance-none transition-all cursor-pointer text-slate-900 text-sm"
                    >
                        <option value="Sedan">Berline Executive</option>
                        <option value="Premium">Mercedes Classe S / Premium</option>
                        <option value="Van">Van / Minibus VIP</option>
                        <option value="4x4">4x4 d'Expédition</option>
                    </select>
                    <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 size-4 rotate-90 text-slate-400 pointer-events-none" />
                </div>
            </div>

            <div className="p-6 bg-[#00897B]/5 rounded-[1.5rem] border border-[#00897B]/10">
               <div className="flex items-start gap-3">
                  <ShieldCheck className="size-5 text-[#00897B] shrink-0 mt-0.5" />
                  <p className="text-[11px] font-bold text-slate-600 leading-relaxed uppercase tracking-tight">
                    Votre inscription sera soumise à validation par notre équipe SuperAdmin sous 24h.
                  </p>
               </div>
            </div>

            <Button type="submit" disabled={isLoading} className="h-16 w-full rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-black uppercase tracking-widest transition-all shadow-xl shadow-slate-900/10 active:scale-[0.98]">
              {isLoading ? "Traitement..." : "Créer mon Profil Pilot"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
