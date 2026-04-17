import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Hourglass, FileText, Check, ArrowRight, LogOut, Navigation } from 'lucide-react';
import { Button } from '../components/ui/button';
import { useAppContext } from '../context/AppContext';

export default function DriverPendingApproval() {
  const navigate = useNavigate();
  const { authMode, driverVerificationStatus, userName, resetFlow } = useAppContext();

  useEffect(() => {
    if (authMode !== 'login') {
      navigate('/driver/login', { replace: true });
      return;
    }
    if (driverVerificationStatus === 'verified') {
      navigate('/dashboard/driver', { replace: true });
    }
  }, [authMode, driverVerificationStatus, navigate]);

  const documents = [
    { name: "Permis de conduire", status: "verified" },
    { name: "Carte CIN", status: "verified" },
    { name: "Assurance Professionnelle", status: "verified" },
    { name: "Contrôle Technique", status: "pending" },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-6 selection:bg-[#00897B]/10 overflow-hidden relative">
      {/* Decorative Blur */}
      <div className="absolute top-0 right-0 size-96 bg-[#00897B]/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 size-96 bg-[#00897B]/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-[500px] z-10 space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
        
        {/* Navigation / Header */}
        <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-3">
               <div className="flex size-10 items-center justify-center rounded-xl bg-[#00897B] text-white shadow-lg shadow-[#00897B]/20">
                  <Navigation className="size-5 rotate-45 translate-y-[-1px] translate-x-[-1px]" />
               </div>
               <h1 className="text-xl font-black text-slate-900 tracking-tighter uppercase italic">Navito <span className="text-[#00897B] not-italic">Pilot</span></h1>
            </div>
            <button 
                onClick={() => { resetFlow(); navigate('/driver/login'); }}
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
                     <span className="text-[10px] font-black uppercase tracking-widest">Compte en attente de validation</span>
                  </div>
                  <div className="space-y-1">
                     <h2 className="text-2xl font-black text-slate-900 tracking-tight uppercase">Ravi de vous voir, {userName.split(' ')[0]}</h2>
                     <p className="text-slate-400 font-bold text-xs uppercase tracking-widest px-4">Nos administrateurs vérifient vos documents stockés ci-dessous.</p>
                  </div>
               </div>

               {/* Documents List - EXPLICITLY MATCHING THE USER IMAGE */}
               <div className="space-y-6">
                  <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400/80 ml-2">Documents Stockés</h3>
                  <div className="space-y-3">
                     {documents.map((doc, idx) => (
                        <div 
                           key={idx} 
                           className="flex items-center justify-between p-5 rounded-[2rem] bg-white border border-slate-100 hover:border-[#00897B]/20 hover:bg-slate-50/50 transition-all group"
                        >
                           <div className="flex items-center gap-4">
                              <div className="size-12 rounded-2xl flex items-center justify-center bg-slate-50 text-slate-400 border border-slate-100 group-hover:bg-white transition-colors">
                                 <FileText className="size-5" />
                              </div>
                              <span className="text-sm font-black text-slate-900 uppercase tracking-tight">{doc.name}</span>
                           </div>
                           <div className="flex items-center justify-center">
                              {doc.status === 'verified' ? (
                                 <div className="flex size-7 items-center justify-center rounded-full bg-emerald-50 text-emerald-500 shadow-sm border border-emerald-100 ring-4 ring-emerald-50/50">
                                    <Check className="size-4" />
                                 </div>
                              ) : (
                                 <div className="flex size-7 items-center justify-center rounded-full bg-amber-50 text-amber-500 shadow-sm border border-amber-100 ring-4 ring-amber-50/50">
                                    <div className="size-2 rounded-full bg-amber-500 animate-pulse" />
                                 </div>
                              )}
                           </div>
                        </div>
                     ))}
                  </div>
               </div>

               {/* Footer Action */}
               <div className="pt-4">
                  <Button 
                    onClick={() => navigate('/splash')}
                    className="w-full h-14 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-black uppercase tracking-widest text-xs shadow-xl shadow-slate-900/10 active:scale-[0.98] flex items-center justify-center gap-2"
                  >
                     Retourner au catalogue <ArrowRight className="size-4" />
                  </Button>
               </div>
           </div>
        </div>

        <p className="text-center text-[10px] font-black uppercase tracking-[0.3em] text-slate-300">
            Navito Morocco Pilot Core • Verification Engine
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
