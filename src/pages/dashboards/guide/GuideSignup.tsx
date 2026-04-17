import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Map, ShieldCheck, MapPin, Phone, User, Mail, Compass, CheckCircle, ChevronRight, BookOpen, Camera, Utensils } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '../../../app/components/ui/button';
import { Input } from '../../../app/components/ui/input';
import { Label } from '../../../app/components/ui/label';
import { useAppContext } from '../../../app/context/AppContext';
import { buildSessionFromAuthResponse, fetchCities, registerRequest } from '../../../app/services/api';

export default function GuideSignup() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    city: 'Marrakech',
    specialty: 'Culture & Histoire',
    password: '',
    confirmPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { setUserSession } = useAppContext();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const citiesResponse = await fetchCities().catch(() => ({ data: [] as Array<{ id: number; name: string }> }));
      const matchedCity = (citiesResponse.data ?? []).find((item) => item.name.toLowerCase() === formData.city.toLowerCase())
        ?? (citiesResponse.data ?? [])[0];

      const response = await registerRequest({
        name: formData.fullName,
        email: formData.email,
        password: formData.password,
        password_confirmation: formData.confirmPassword,
        role: 'guide',
        guide_profile: {
          city_id: matchedCity?.id ?? null,
          phone: formData.phone,
          bio: formData.specialty,
          status: 'pending',
        },
      });

      if (!response.user || !response.token) {
        throw new Error('Reponse d inscription invalide.');
      }

      setUserSession(buildSessionFromAuthResponse(response.user, response.token));
      toast.success('Compte guide cree avec succes.');
      navigate('/dashboard/guide');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Impossible de creer le compte.');
    } finally {
      setIsLoading(false);
    }
  };

  const specialties = [
    { value: 'Culture & Histoire', icon: <BookOpen className="size-4" /> },
    { value: 'Nature & Aventure', icon: <Compass className="size-4" /> },
    { value: 'Gastronomie & Terroir', icon: <Utensils className="size-4" /> },
    { value: 'Photographie & Lifestyle', icon: <Camera className="size-4" /> },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans selection:bg-teal-500/10">
      {/* Left Decoration Panel */}
      <div className="hidden lg:flex w-1/3 bg-[#004D40] p-12 flex-col justify-between relative overflow-hidden">
        <div className="absolute top-0 right-0 w-full h-full opacity-20 pointer-events-none">
           <div className="absolute top-[-20%] right-[-20%] size-96 bg-teal-400 rounded-full blur-[100px]" />
           <div className="absolute bottom-[-20%] left-[-20%] size-96 bg-emerald-400 rounded-full blur-[100px]" />
        </div>
        
        <div className="z-10 animate-in fade-in duration-1000">
           <h2 className="text-3xl font-black text-white uppercase tracking-tighter italic">Navito <span className="text-teal-400 not-italic">Ambassador</span></h2>
        </div>

        <div className="z-10 space-y-8 animate-in slide-in-from-left-8 duration-700">
           <h3 className="text-5xl font-black text-white leading-tight uppercase tracking-tighter">Partagez<br />votre passion.</h3>
           <p className="text-teal-50 font-bold leading-relaxed max-w-sm">Devenez l'ambassadeur de votre ville. Guidez les voyageurs du monde entier et créez des souvenirs inoubliables.</p>
           
           <div className="space-y-4 pt-6">
              {[
                "Gestion simplifiée de vos tours",
                "Paiements sécurisés",
                "Visibilité internationale"
              ].map((text, idx) => (
                <div key={idx} className="flex items-center gap-3 text-white font-black text-[10px] uppercase tracking-widest">
                   <div className="flex size-5 items-center justify-center rounded-full bg-teal-400 text-[#004D40]">
                      <CheckCircle className="size-3" />
                   </div>
                   {text}
                </div>
              ))}
           </div>
        </div>

        <div className="z-10 pt-12 border-t border-white/10">
           <p className="text-[10px] font-black uppercase text-teal-200 tracking-[0.2em]">Navito Guide Network • 2026</p>
        </div>
      </div>

      {/* Right Form Panel */}
      <div className="flex-1 flex items-center justify-center p-8 lg:p-20 bg-white">
        <div className="w-full max-w-lg space-y-10 animate-in fade-in slide-in-from-right-8 duration-700">
          <div className="space-y-2">
             <button 
                onClick={() => navigate('/guide/login')} 
                className="group flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#00897B] hover:text-slate-900 transition-colors"
             >
                <ArrowLeft className="size-3 group-hover:translate-x-[-4px] transition-transform" /> Retour à la connexion
             </button>
             <h4 className="text-4xl font-black text-slate-900 tracking-tighter uppercase mt-4">Nouveau Profil Guide</h4>
             <p className="text-slate-400 font-bold text-sm">Inscrivez-vous pour rejoindre notre communauté de guides experts.</p>
          </div>

          <form onSubmit={handleSignup} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Nom complet</Label>
                    <div className="relative group">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-slate-300 group-focus-within:text-[#00897B] transition-colors" />
                        <Input
                            placeholder="Anas Benjelloun"
                            value={formData.fullName}
                            onChange={(e) => setFormData(p => ({...p, fullName: e.target.value}))}
                            className="h-14 rounded-2xl bg-slate-50 border-0 focus:ring-4 focus:ring-[#00897B]/10 font-bold pl-12 transition-all"
                            required
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Email</Label>
                    <div className="relative group">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-slate-300 group-focus-within:text-[#00897B] transition-colors" />
                        <Input
                            type="email"
                            placeholder="anas@guide.ma"
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
                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Ville de résidence</Label>
                    <div className="relative group">
                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-slate-300 group-focus-within:text-[#00897B] transition-colors" />
                        <Input
                            placeholder="Casablanca"
                            value={formData.city}
                            onChange={(e) => setFormData(p => ({...p, city: e.target.value}))}
                            className="h-14 rounded-2xl bg-slate-50 border-0 focus:ring-4 focus:ring-[#00897B]/10 font-bold pl-12 transition-all"
                            required
                        />
                    </div>
                </div>
            </div>

            <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Votre Spécialité</Label>
                <div className="relative group">
                    <Compass className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-slate-300 group-focus-within:text-[#00897B] transition-colors shadow-sm" />
                    <select 
                        value={formData.specialty}
                        onChange={(e) => setFormData(p => ({...p, specialty: e.target.value}))}
                        className="w-full h-14 rounded-2xl bg-slate-50 border-0 focus:ring-4 focus:ring-[#00897B]/10 font-black pl-12 pr-6 appearance-none transition-all cursor-pointer text-slate-900 text-sm"
                    >
                        {specialties.map((s) => (
                            <option key={s.value} value={s.value}>{s.value}</option>
                        ))}
                    </select>
                    <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 size-4 rotate-90 text-slate-400 pointer-events-none" />
                </div>
            </div>

            <div className="p-6 bg-[#00897B]/5 rounded-[1.5rem] border border-[#00897B]/10">
               <div className="flex items-start gap-3">
                  <ShieldCheck className="size-5 text-[#00897B] shrink-0 mt-0.5" />
                  <p className="text-[11px] font-bold text-slate-600 leading-relaxed uppercase tracking-tight">
                    Votre demande sera examinée par nos administrateurs. Vous recevrez une notification par email dès validation.
                  </p>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Mot de passe</Label>
                <Input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData(p => ({ ...p, password: e.target.value }))}
                  className="h-14 rounded-2xl bg-slate-50 border-0 focus:ring-4 focus:ring-[#00897B]/10 font-bold transition-all"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Confirmer le mot de passe</Label>
                <Input
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData(p => ({ ...p, confirmPassword: e.target.value }))}
                  className="h-14 rounded-2xl bg-slate-50 border-0 focus:ring-4 focus:ring-[#00897B]/10 font-bold transition-all"
                  required
                />
              </div>
            </div>

            <Button type="submit" disabled={isLoading} className="h-16 w-full rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-black uppercase tracking-widest transition-all shadow-xl shadow-slate-900/10 active:scale-[0.98]">
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Création du compte...
                </div>
              ) : "Créer mon Profil Guide"}
            </Button>

            <p className="text-center text-xs font-bold text-slate-500 pt-4">
              Déjà inscrit ? {" "}
              <button 
                type="button"
                onClick={() => navigate('/guide/login')}
                className="text-[#00897B] hover:underline"
              >
                Se connecter ici
              </button>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
