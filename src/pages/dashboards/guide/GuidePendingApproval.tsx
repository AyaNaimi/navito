import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Hourglass, FileText, Check, ArrowRight, LogOut, Map } from 'lucide-react';
import { Button } from '../../../app/components/ui/button';
import { useAppContext } from '../../../app/context/AppContext';

export default function GuidePendingApproval() {
  const navigate = useNavigate();
  const { authMode, guideVerificationStatus, userName, resetFlow, setGuideVerificationStatus } = useAppContext();

  useEffect(() => {
    if (authMode !== 'login') {
      navigate('/guide/login', { replace: true });
      return;
    }
    if (guideVerificationStatus === 'verified') {
      navigate('/dashboard/guide', { replace: true });
    }
  }, [authMode, guideVerificationStatus, navigate]);

  const steps = [
    { name: "Inscription reçue", status: "verified", desc: "Vos informations de base ont été enregistrées" },
    { name: "Vérification des antécédents", status: "pending", desc: "Notre équipe vérifie votre expérience et vos certifications" },
    { name: "Entretien (Optionnel)", status: "none", desc: "Un court appel pour discuter de vos spécialités" },
    { name: "Activation du compte", status: "none", desc: "Accès complet au dashboard Navito Guide" },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-6 selection:bg-[#00897B]/10 overflow-hidden relative font-sans">
      {/* Decorative Blur */}
      <div className="absolute top-0 right-0 size-96 bg-[#00897B]/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 size-96 bg-[#00897B]/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-[500px] z-10 space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
        
        {/* Navigation / Header */}
        <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-3">
               <div className="flex size-10 items-center justify-center rounded-xl bg-[#00897B] text-white shadow-lg shadow-[#00897B]/20">
                  <Map className="size-5" />
               </div>
               <h1 className="text-xl font-black text-slate-900 tracking-tighter uppercase italic">Navito <span className="text-[#00897B] not-italic">Ambassador</span></h1>
            </div>
            <button 
                onClick={() => { resetFlow(); navigate('/guide/login'); }}
                className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-rose-500 transition-colors"
            >
                <LogOut className="size-3" /> Déconnexion
            </button>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-[3rem] p-10 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.08)] border border-slate-100 overflow-hidden relative">
           <div className="absolute inset-0 bg-gradient-to-b from-slate-50/50 to-transparent pointer-events-none" />
           
           <div className="relative space-y-10">
               {/* Status Header */}
               <div className="text-center space-y-4">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-50 border border-amber-100 text-amber-600">
                     <Hourglass className="size-3.5 animate-spin-slow" />
                     <span className="text-[10px] font-black uppercase tracking-widest">Compte en cours de validation</span>
                  </div>
                  <div className="space-y-1">
                     <h2 className="text-2xl font-black text-slate-900 tracking-tight uppercase">Bienvenue, {userName.split(' ')[0]}</h2>
                     <p className="text-slate-400 font-bold text-xs uppercase tracking-widest px-4 leading-loose">Nous analysons votre profil. Cela prend généralement moins de 24h.</p>
                  </div>
               </div>

               {/* Steps List */}
               <div className="space-y-6">
                  <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400/80 ml-2">État de votre demande</h3>
                  <div className="space-y-4">
                     {steps.map((step, idx) => (
                        <div 
                           key={idx} 
                           className="flex items-start gap-4 p-4 rounded-[1.5rem] bg-white border border-slate-100 transition-all"
                        >
                           <div className="flex items-center justify-center mt-1">
                              {step.status === 'verified' ? (
                                 <div className="flex size-6 items-center justify-center rounded-full bg-emerald-50 text-emerald-500 border border-emerald-100">
                                    <Check className="size-3" />
                                 </div>
                              ) : step.status === 'pending' ? (
                                 <div className="flex size-6 items-center justify-center rounded-full bg-amber-50 text-amber-500 border border-amber-100">
                                    <div className="size-1.5 rounded-full bg-amber-500 animate-pulse" />
                                 </div>
                              ) : (
                                 <div className="flex size-6 items-center justify-center rounded-full bg-slate-50 text-slate-300 border border-slate-100 text-[10px] font-black">
                                    {idx + 1}
                                 </div>
                              )}
                           </div>
                           <div className="space-y-0.5">
                               <div className="text-[11px] font-black text-slate-900 uppercase tracking-tight">{step.name}</div>
                               <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wide leading-tight">{step.desc}</div>
                           </div>
                        </div>
                     ))}
                  </div>
               </div>

                {/* Footer Action */}
                <div className="pt-4 space-y-4">
                   <Button 
                     onClick={() => navigate('/home')}
                     className="w-full h-14 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-black uppercase tracking-widest text-xs shadow-xl shadow-slate-900/10 active:scale-[0.98] flex items-center justify-center gap-2"
                   >
                      Retourner à l'accueil <ArrowRight className="size-4" />
                   </Button>
                   
                   <div className="relative group">
                      <div className="absolute -inset-0.5 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
                      <Button 
                        onClick={() => {
                          setGuideVerificationStatus('verified');
                        }}
                        variant="outline"
                        className="relative w-full h-14 rounded-2xl border-2 border-dashed border-[#00897B]/30 hover:border-[#00897B] text-[#00897B] font-black uppercase tracking-[0.2em] text-[10px] bg-white hover:bg-teal-50/50 transition-all"
                      >
                         Simulation Admin : Confirmer le compte
                      </Button>
                   </div>
                </div>
            </div>
         </div>

        <p className="text-center text-[10px] font-black uppercase tracking-[0.3em] text-slate-300">
            Navito Ambassador Core • Verification Engine
        </p>
      </div>

      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
      `}</style>
    </div>
  );
}
