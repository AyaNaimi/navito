import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Eye, EyeOff, Navigation, Lock, User, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '../../../app/components/ui/button';
import { Input } from '../../../app/components/ui/input';
import { Label } from '../../../app/components/ui/label';
import { useAppContext } from '../../../app/context/AppContext';
import { buildSessionFromAuthResponse, loginRequest } from '../../../app/services/api';

export default function DriverLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { setUserSession } = useAppContext();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await loginRequest({ email, password, role: 'driver' });

      if (!response.user || !response.token) {
        throw new Error('Reponse de connexion invalide.');
      }

      setUserSession(buildSessionFromAuthResponse(response.user, response.token));

      const driverProfile = response.user.driver_profile;
      const profileComplete = Boolean(driverProfile?.phone && driverProfile?.vehicle_type && driverProfile?.city?.name);
      const verificationStatus = driverProfile?.verification_status;

      if (profileComplete) {
        navigate('/dashboard/driver');
      } else if (!verificationStatus || verificationStatus === 'none') {
        navigate('/driver/join');
      } else {
        navigate('/driver/pending');
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Connexion impossible.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-4 selection:bg-teal-500/30 overflow-hidden relative">
      {/* Dynamic Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] size-96 bg-teal-500/10 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] size-96 bg-teal-400/10 rounded-full blur-[120px] animate-pulse delay-700" />
      
      <div className="w-full max-w-[440px] z-10 space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-1000">
        <div className="text-center space-y-4">
            <div className="mx-auto flex size-20 items-center justify-center rounded-[2.5rem] bg-gradient-to-tr from-teal-500 to-emerald-400 text-white shadow-[0_20px_50px_rgba(20,184,166,0.3)] transform transition-transform hover:scale-110 active:scale-95 duration-500">
               <Navigation className="size-10 rotate-45 translate-y-[-2px] translate-x-[-2px]" />
            </div>
            <div className="space-y-1">
               <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic">Navito <span className="text-teal-400 not-italic">Pilot</span></h1>
               <p className="text-slate-400 font-bold text-xs uppercase tracking-[0.3em] opacity-60">Professional Hub</p>
            </div>
        </div>

        <div className="bg-white/5 backdrop-blur-2xl rounded-[3rem] p-10 border border-white/10 shadow-2xl relative">
          <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent rounded-[3rem] pointer-events-none" />
          
          <form onSubmit={handleLogin} className="space-y-7 relative">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-[10px] font-black uppercase tracking-[0.2em] text-teal-400/80 ml-2">Email Pro</Label>
              <div className="relative group">
                <User className="absolute left-5 top-1/2 -translate-y-1/2 size-5 text-slate-500 group-focus-within:text-teal-400 transition-colors" />
                <input
                  id="email"
                  type="email"
                  placeholder="nom.prenom@navito.ma"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-16 rounded-2xl bg-white/5 border border-white/10 pl-14 pr-5 text-white font-bold placeholder:text-slate-600 outline-none transition-all focus:border-teal-500/50 focus:bg-white/10 ring-0 focus:ring-4 focus:ring-teal-500/10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-[10px] font-black uppercase tracking-[0.2em] text-teal-400/80 ml-2">Mot de passe</Label>
                <button type="button" className="text-[9px] font-black uppercase tracking-widest text-slate-500 hover:text-teal-400 transition-colors">
                  Oublié ?
                </button>
              </div>
              <div className="relative group">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 size-5 text-slate-500 group-focus-within:text-teal-400 transition-colors" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-16 rounded-2xl bg-white/5 border border-white/10 pl-14 pr-14 text-white font-bold placeholder:text-slate-600 outline-none transition-all focus:border-teal-500/50 focus:bg-white/10 ring-0 focus:ring-4 focus:ring-teal-500/10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-600 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
                </button>
              </div>
            </div>

            <button 
                type="submit" 
                disabled={isLoading}
                className="group w-full h-16 mt-4 rounded-2xl bg-gradient-to-r from-teal-500 to-emerald-400 p-[1px] transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
            >
              <div className="size-full bg-[#020617]/10 group-hover:bg-transparent rounded-2xl flex items-center justify-center transition-all">
                {isLoading ? (
                    <div className="size-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                    <span className="text-white font-black uppercase tracking-[0.2em] text-sm flex items-center gap-2">
                        Connexion Pilot <ArrowRight className="size-4 animate-in slide-in-from-left-4 repeat-infinite duration-1000" />
                    </span>
                )}
              </div>
            </button>
          </form>

          <div className="mt-10 pt-10 border-t border-white/5 text-center px-4">
             <p className="text-[11px] font-bold text-slate-500 tracking-wide">
               Nouveau partenaire Navito ?{' '}
               <button onClick={() => navigate('/driver/signup')} className="text-white hover:text-teal-400 transition-colors underline underline-offset-4 decoration-teal-500/30">
                 Devenir Pilot
               </button>
             </p>
          </div>
        </div>

        <div className="flex items-center justify-center gap-6 opacity-30 grayscale hover:grayscale-0 transition-all duration-500">
           <div className="flex items-center gap-2 text-[10px] font-black text-white uppercase tracking-widest">
              <CheckCircle2 className="size-3" /> Secure Access
           </div>
           <div className="flex items-center gap-2 text-[10px] font-black text-white uppercase tracking-widest">
              <CheckCircle2 className="size-3" /> Encrypted Data
           </div>
        </div>
      </div>
    </div>
  );
}
