import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Lock, User, ShieldCheck } from "lucide-react";
import { useAppContext } from "../../../app/context/AppContext";

export default function SuperAdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { setUserSession } = useAppContext();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("superAdminAuth", "true");
    setUserSession({
      name: email.split("@")[0] || "SuperAdmin",
      email: email,
      role: "super_admin",
    });
    navigate("/dashboard/superadmin");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] p-4 font-sans text-slate-900 animate-in fade-in duration-700">
      <div className="w-full max-w-md bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-slate-50 overflow-hidden">
        <div className="p-10 text-center bg-[#0da08b] text-white relative">
           <div className="flex justify-center mb-6">
             <div className="flex size-20 shrink-0 items-center justify-center rounded-[2rem] bg-white text-[#0da08b] shadow-2xl transform rotate-6 hover:rotate-0 transition-transform duration-500">
               <ShieldCheck className="size-10" />
             </div>
           </div>
           <h1 className="text-3xl font-black tracking-tighter uppercase whitespace-pre-wrap">Accès SuperAdmin</h1>
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
                  placeholder="admin@navito.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-14 pl-14 pr-5 rounded-2xl border border-slate-100 bg-slate-50 text-sm font-bold outline-none transition-all focus:border-[#0da08b] focus:bg-white focus:ring-4 focus:ring-[#0da08b]/10"
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
                  className="w-full h-14 pl-14 pr-14 rounded-2xl border border-slate-100 bg-slate-50 text-sm font-bold outline-none transition-all focus:border-[#0da08b] focus:bg-white focus:ring-4 focus:ring-[#0da08b]/10"
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

            <button
              type="submit"
              className="w-full h-14 mt-8 rounded-2xl bg-[#0da08b] text-white font-black text-xs uppercase tracking-[0.2em] transition-all hover:bg-[#0d8a78] hover:shadow-2xl hover:shadow-[#0da08b]/20 active:scale-[0.98]"
            >
              Se Connecter au Dashboard
            </button>
          </form>

          <p className="mt-8 text-center text-[10px] font-black text-slate-300 uppercase tracking-widest">
            © 2026 NAVITO MOROCCO • TOUS DROITS RÉSERVÉS
          </p>
        </div>
      </div>
    </div>
  );
}
