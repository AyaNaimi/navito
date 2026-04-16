import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Lock, User, Map, Loader2 } from "lucide-react";
import { useAppContext } from "../../../app/context/AppContext";
import { Button } from "../../../app/components/ui/button";

export default function GuideLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { setUserSession, userEmail, guideVerificationStatus } = useAppContext();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulated login delay
    setTimeout(() => {
      // For demo: if they use the registered email or the default mock
      const isRegisteredUser = email.toLowerCase() === userEmail?.toLowerCase();
      const isMockUser = email === "guide@navito.com" && password === "password123";

      if (isRegisteredUser || isMockUser) {
        // Set session
        setUserSession({
          name: isRegisteredUser ? email.split('@')[0] : "Guide Expert",
          email: email,
          role: 'guide'
        });

        // Redirect based on status
        if (isMockUser || guideVerificationStatus === 'verified') {
          navigate("/dashboard/guide");
        } else {
          navigate("/guide/pending");
        }
      } else {
        alert("Utilisateur non trouvé. Veuillez vous inscrire d'abord.");
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] p-4 font-sans text-slate-900 animate-in fade-in duration-700">
      <div className="w-full max-w-md bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-slate-50 overflow-hidden">
        <div className="p-10 text-center bg-[#00897B] text-white relative">
           <div className="flex justify-center mb-6">
             <div className="flex size-20 shrink-0 items-center justify-center rounded-[2rem] bg-white text-[#00897B] shadow-2xl transform rotate-6 hover:rotate-0 transition-transform duration-500">
               <Map className="size-10" />
             </div>
           </div>
           <h1 className="text-3xl font-black tracking-tighter uppercase whitespace-pre-wrap">Accès Guide</h1>
           <p className="text-teal-50 text-xs font-bold mt-2 opacity-80 uppercase tracking-widest">Morocco Travel Assistant</p>
        </div>

        <div className="p-10">
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2 text-left">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Adresse Email</label>
              <div className="relative">
                <User className="absolute left-5 top-1/2 -translate-y-1/2 size-5 text-slate-400" />
                <input
                  type="email"
                  placeholder="guide@navito.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-14 pl-14 pr-5 rounded-2xl border border-slate-100 bg-slate-50 text-sm font-bold outline-none transition-all focus:border-[#00897B] focus:bg-white focus:ring-4 focus:ring-[#00897B]/10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2 text-left">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Mot de Passe</label>
              </div>
              <div className="relative">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 size-5 text-slate-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-14 pl-14 pr-14 rounded-2xl border border-slate-100 bg-slate-50 text-sm font-bold outline-none transition-all focus:border-[#00897B] focus:bg-white focus:ring-4 focus:ring-[#00897B]/10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
                </button>
              </div>
            </div>
            
            <div className="text-xs text-center text-slate-500">
                Mock: <span className="font-bold">guide@navito.com</span> / <span className="font-bold">password123</span>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-14 mt-8 rounded-2xl bg-[#00897B] text-white font-black text-xs uppercase tracking-[0.2em] transition-all hover:bg-[#00796B] hover:shadow-2xl hover:shadow-[#00897B]/20 active:scale-[0.98]"
            >
              {isLoading ? (
                <Loader2 className="size-5 animate-spin mx-auto" />
              ) : (
                "Se Connecter au Dashboard"
              )}
            </Button>
          </form>

          <div className="mt-8 space-y-4 text-center">
            <p className="text-xs font-bold text-slate-500">
               Nouveau guide ? {" "}
               <button 
                onClick={() => navigate('/guide/signup')}
                className="text-[#00897B] hover:underline"
               >
                 Créer un compte
               </button>
            </p>
          </div>

          <p className="mt-8 text-center text-[10px] font-black text-slate-300 uppercase tracking-widest">
            © 2026 NAVITO MOROCCO • TOUS DROITS RÉSERVÉS
          </p>
        </div>
      </div>
    </div>
  );
}
