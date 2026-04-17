import { useState, type ReactNode } from "react";
import {
  LayoutDashboard,
  MessageSquare,
  Settings,
  Star,
  Search,
  Bell,
  ChevronDown,
  Menu,
  X,
  LogOut,
  User,
  CarFront,
  Navigation
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { cn } from "../../../app/components/ui/utils";
import { useAppContext } from "../../../app/context/AppContext";

export type DriverAdminNavId = "dashboard" | "messages" | "profile" | "reviews";

const navItems: Array<{ id: DriverAdminNavId; label: string; icon: typeof LayoutDashboard }> = [
  { id: "dashboard", label: "Tableau de bord", icon: LayoutDashboard },
  { id: "messages", label: "Messagerie", icon: MessageSquare },
  { id: "profile", label: "Mon Profil", icon: User },
  { id: "reviews", label: "Avis Clients", icon: Star },
];

const mockNotifications = [
  { id: 1, title: "Assurance Expire BientÃ´t", desc: "Votre assurance professionnelle expire dans 15 jours. Veuillez la renouveler.", time: "2 heures" },
  { id: 2, title: "Visite Technique Requise", desc: "N'oubliez pas l'inspection annuelle de votre vÃ©hicule prÃ©vue le mois prochain.", time: "Hier" },
];

type DriverAdminShellProps = {
  activeNav: DriverAdminNavId;
  onNavigate: (id: DriverAdminNavId) => void;
  children: ReactNode;
};

export default function DriverAdminShell({
  activeNav,
  onNavigate,
  children,
}: DriverAdminShellProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const { userEmail, userName, logout } = useAppContext();

  const closeAllMenus = () => {
    setShowNotifications(false);
    setShowProfileMenu(false);
  };

  const handleNavigate = (id: DriverAdminNavId) => {
    onNavigate(id);
    setIsMobileMenuOpen(false);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login", { replace: true });
      window.setTimeout(() => {
        if (window.location.pathname.startsWith("/dashboard")) {
          window.location.replace("/login");
        }
      }, 50);
    } catch {
      toast.error("Impossible de se deconnecter.");
    }
  };

  return (
    <div className="relative min-h-screen bg-[#F8FAFC] text-slate-900 font-sans">
      {/* Click-away Backdrop */}
      {(showNotifications || showProfileMenu) && (
        <div 
          className="fixed inset-0 z-40 bg-transparent" 
          onClick={closeAllMenus}
        />
      )}
      <div className="flex min-h-screen">
        {/* Desktop Sidebar */}
        <aside className="fixed left-0 top-0 z-50 hidden h-screen w-64 flex-col border-r bg-white py-6 md:flex shadow-[4px_0_24px_-10px_rgba(0,137,123,0.1)]">
          <div className="mb-10 px-8 flex items-center gap-3">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-2xl bg-[#00897B] text-white shadow-lg shadow-[#00897B]/20">
              <Navigation className="size-5 rotate-45 translate-y-[-2px] translate-x-[-2px]" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-tight text-slate-900 leading-none">Navito</span>
              <span className="text-[9px] font-bold text-[#00897B] uppercase tracking-widest mt-1">Chauffeur</span>
            </div>
          </div>

          <nav className="flex flex-1 flex-col gap-2 px-4">
            <p className="px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 mt-4">Menu Principal</p>
            {navItems.map(({ id, label, icon: Icon }) => {
              const isActive = activeNav === id;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => handleNavigate(id)}
                  className={cn(
                    "flex items-center gap-3 rounded-2xl px-4 py-3.5 text-sm font-bold transition-all duration-200",
                    isActive
                      ? "bg-[#00897B] text-white shadow-[0_8px_16px_-6px_rgba(0,137,123,0.4)]"
                      : "text-slate-500 hover:bg-slate-50 hover:text-slate-900",
                  )}
                >
                  <Icon className="size-5" strokeWidth={isActive ? 2 : 1.75} />
                  {label}
                </button>
              );
            })}
          </nav>
          
          <div className="p-6">
             <div className="bg-gradient-to-br from-[#00897B]/10 to-teal-100/50 p-4 rounded-3xl border border-[#00897B]/10">
                <div className="size-10 bg-white rounded-xl shadow-sm flex items-center justify-center mb-3">
                   <CarFront className="size-5 text-[#00897B]" />
                </div>
                <h4 className="text-sm font-black text-slate-900 mb-1">Berline Luxe</h4>
                <p className="text-[10px] text-slate-500 font-bold mix-blend-multiply">Immat. 11-A-4432</p>
             </div>
          </div>
        </aside>

        {/* Mobile Sidebar Overlay */}
        {isMobileMenuOpen && (
           <div className="fixed inset-0 z-50 flex md:hidden h-screen w-screen overflow-hidden">
             <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setIsMobileMenuOpen(false)} />
             <div className="relative w-72 bg-white h-full flex flex-col py-6 shadow-2xl animate-in slide-in-from-left duration-300">
                <div className="mb-10 px-6 flex items-center justify-between">
                   <div className="flex items-center gap-3">
                     <div className="flex size-9 shrink-0 items-center justify-center rounded-2xl bg-[#00897B] text-white shadow-lg shadow-[#00897B]/20">
                       <Navigation className="size-5 rotate-45 translate-y-[-2px] translate-x-[-2px]" />
                     </div>
                     <span className="text-xl font-black tracking-tighter text-slate-900">Navito</span>
                   </div>
                   <button onClick={() => setIsMobileMenuOpen(false)} className="flex size-10 items-center justify-center rounded-full bg-slate-50 text-slate-400 hover:text-slate-600 active:scale-90 transition-transform">
                      <X className="size-5" />
                   </button>
                </div>
                
                <nav className="flex flex-1 flex-col gap-1.5 px-4 overflow-y-auto">
                 {navItems.map(({ id, label, icon: Icon }) => {
                   const isActive = activeNav === id;
                   return (
                     <button
                       key={id}
                       type="button"
                       onClick={() => handleNavigate(id)}
                       className={cn(
                         "flex items-center gap-3 rounded-2xl px-4 py-3.5 text-sm font-bold transition-all duration-200",
                         isActive ? "bg-[#00897B] text-white shadow-lg shadow-[#00897B]/20" : "text-slate-500 hover:bg-slate-50 hover:text-slate-900",
                       )}
                     >
                       <Icon className="size-5" strokeWidth={isActive ? 2.5 : 2} />
                       {label}
                     </button>
                   );
                 })}
               </nav>
             </div>
           </div>
         )}


        {/* Main Content */}
        <div className="flex min-h-screen flex-1 flex-col md:pl-64">
          <header className="sticky top-0 z-30 flex h-20 md:h-[88px] items-center justify-between border-b border-slate-100 bg-white/80 px-4 md:px-8 backdrop-blur-xl">
            <div className="flex items-center gap-3 md:gap-4">
              <button 
                onClick={() => setIsMobileMenuOpen(true)} 
                className="md:hidden flex size-10 items-center justify-center rounded-xl bg-slate-100 text-slate-500 hover:bg-slate-200 active:scale-90 transition-transform"
              >
                <Menu className="size-5" />
              </button>
              <h1 className="text-lg md:text-xl font-black tracking-tight text-slate-900">
                 {navItems.find(n => n.id === activeNav)?.label || "Dashboard"}
              </h1>
            </div>

            <div className="flex items-center gap-3 md:gap-6">
              <div className="relative hidden lg:block">
                <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Recherche..."
                  className="h-11 w-64 rounded-full bg-slate-100 pl-10 pr-4 text-xs font-bold outline-none transition-all focus:bg-slate-200 focus:ring-4 focus:ring-[#00897B]/10"
                />
              </div>

              <div className="relative">
                <button 
                  onClick={() => { const s = !showNotifications; closeAllMenus(); setShowNotifications(s); }}
                  className="relative flex size-11 flex-shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition-all hover:bg-slate-200 active:scale-95"
                >
                  <Bell className="size-5" strokeWidth={1.5} />
                  <span className="absolute right-2.5 top-2.5 size-2.5 rounded-full bg-rose-500 border-2 border-white animate-pulse" />
                </button>

                {showNotifications && (
                  <div className="absolute right-0 mt-3 w-80 rounded-[2rem] border-0 bg-white shadow-2xl animate-in fade-in slide-in-from-top-3 duration-200 overflow-hidden ring-1 ring-slate-100">
                    <div className="p-5 border-b border-slate-50 flex items-center justify-between">
                      <span className="font-black text-slate-900">Vos Rappels</span>
                      <span className="text-[10px] font-black text-[#00897B] bg-[#00897B]/10 px-2 py-0.5 rounded-full uppercase">2 nouveaux</span>
                    </div>
                    <div className="p-2 space-y-1">
                      {mockNotifications.map(n => (
                        <div key={n.id} className="p-4 rounded-3xl hover:bg-slate-50 transition-colors cursor-pointer text-left">
                           <p className="text-sm font-bold text-slate-900 leading-tight">{n.title}</p>
                           <p className="text-[11px] font-medium text-slate-500 leading-relaxed mt-1">{n.desc}</p>
                           <p className="text-[10px] font-black text-[#00897B] mt-2 uppercase tracking-widest">{n.time}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="relative">
                <button 
                  onClick={() => { const s = !showProfileMenu; closeAllMenus(); setShowProfileMenu(s); }}
                  className="flex items-center gap-3 border-l pl-3 md:pl-6 focus:outline-none group active:scale-95 transition-transform"
                >
                  <div className="relative">
                    <img src="https://api.dicebear.com/7.x/notionists/svg?seed=Samrat" alt="Driver" className="size-11 rounded-full border border-slate-200 bg-slate-50 shadow-sm" />
                    <div className="absolute -bottom-0.5 -right-0.5 size-3.5 rounded-full bg-[#00897B] border-2 border-white shadow-sm" />
                  </div>
                  <div className="hidden flex-col text-left lg:flex">
                    <span className="text-sm font-black text-slate-900 group-hover:text-[#00897B] transition-colors leading-tight">{userName}</span>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Driver</span>
                  </div>
                  <ChevronDown className={cn("hidden md:block size-4 text-slate-400 transition-transform", showProfileMenu && "rotate-180")} />
                </button>

                {showProfileMenu && (
                  <div className="absolute right-0 mt-3 w-64 rounded-[2rem] border-0 bg-white shadow-2xl animate-in fade-in slide-in-from-top-3 duration-200 overflow-hidden ring-1 ring-slate-100 z-50">
                    <div className="p-6 bg-slate-50/50 flex items-center gap-4">
                       <img src="https://api.dicebear.com/7.x/notionists/svg?seed=Samrat" className="size-12 rounded-2xl bg-white shadow-sm border border-slate-100" alt="Profile" />
                       <div className="flex-1 overflow-hidden">
                          <p className="text-sm font-black text-slate-900 truncate">{userName}</p>
                          <p className="text-[10px] font-bold text-slate-500 truncate">{userEmail}</p>
                       </div>
                    </div>
                    <div className="p-3 space-y-1">
                        <button onClick={() => { handleNavigate("profile"); closeAllMenus(); }} className="w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-[#00897B]/10 hover:text-[#00897B] text-xs font-black uppercase tracking-widest text-slate-500 transition-all">
                           <User className="size-4" /> Voir le profil
                        </button>
                        <button type="button" onClick={(e) => { e.stopPropagation(); closeAllMenus(); void handleLogout(); }} className="w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-rose-50 text-rose-600 text-xs font-black uppercase tracking-widest transition-all mt-2 group/logout">
                           <LogOut className="size-4 group-hover/logout:rotate-12 transition-transform" /> Deconnexion
                        </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </header>

          <main className="flex-1 p-4 md:p-8 overflow-x-hidden">
            <div className="mx-auto max-w-5xl h-full">
               {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
