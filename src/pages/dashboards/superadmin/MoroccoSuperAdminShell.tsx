import { useState, type ReactNode } from "react";
import {
  CalendarDays,
  LayoutDashboard,
  Settings,
  Users,
  Search,
  Bell,
  ChevronDown,
  Briefcase,
  Menu,
  X,
  Compass,
  MessageSquare,
  Car,
  LogOut,
  User,
  ShieldCheck,
  Zap
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "../../../app/components/ui/utils";
import { useAppContext } from "../../../app/context/AppContext";

export type SuperAdminNavId = "dashboard" | "packages" | "calendar" | "visitors" | "guides" | "drivers" | "messages" | "settings";

const navItems: Array<{ id: SuperAdminNavId; label: string; icon: typeof LayoutDashboard }> = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "packages", label: "Activities", icon: Briefcase },
  { id: "calendar", label: "Calendar", icon: CalendarDays },
  { id: "visitors", label: "Travelers", icon: Users },
  { id: "guides", label: "Guides", icon: Compass },
  { id: "drivers", label: "Drivers", icon: Car },
  { id: "messages", label: "Messages", icon: MessageSquare },
  { id: "settings", label: "Settings", icon: Settings },
];

const mockNotifications = [
  { id: 101, title: "Nouveau Chauffeur", desc: "Omar Tazi attend votre confirmation d'inscription.", time: "À l'instant", type: "driver" },
  { id: 1, title: "New Registration", desc: "Guide 'Amine' is awaiting your confirmation.", time: "2 min ago", type: "guide" },
  { id: 2, title: "Payment Received", desc: "Booking #401: $250.00 confirmed.", time: "15 min ago", type: "payment" },
];

type MoroccoSuperAdminShellProps = {
  activeNav: SuperAdminNavId;
  onNavigate: (id: SuperAdminNavId) => void;
  children: ReactNode;
};

export default function MoroccoSuperAdminShell({
  activeNav,
  onNavigate,
  children,
}: MoroccoSuperAdminShellProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState<typeof mockNotifications[0] | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const { logout } = useAppContext();

  const closeAllMenus = () => {
    setShowNotifications(false);
    setShowProfileMenu(false);
    setSelectedNotification(null);
  };

  const handleNavigate = (id: SuperAdminNavId) => {
    onNavigate(id);
    setIsMobileMenuOpen(false);
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="relative min-h-screen bg-[#F8FAFC] text-slate-900 font-sans">
      {/* Click-away Backdrop */}
      {(showNotifications || showProfileMenu || selectedNotification) && (
        <div 
          className="fixed inset-0 z-40 bg-transparent" 
          onClick={closeAllMenus}
        />
      )}
      <div className="flex min-h-screen">
        {/* Desktop Sidebar */}
        <aside className="fixed left-0 top-0 z-50 hidden h-screen w-64 flex-col border-r bg-white py-6 md:flex hide-scrollbar overflow-y-auto">
          <div className="mb-10 px-8 flex items-center gap-3">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-[#0da08b] text-sm font-bold text-white shadow-sm">
              <span className="translate-y-[1px]">📍</span>
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">Navito</span>
          </div>

          <nav className="flex flex-1 flex-col gap-1 px-4">
            {navItems.map(({ id, label, icon: Icon }) => {
              const isActive = activeNav === id;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => handleNavigate(id)}
                  className={cn(
                    "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-[#0da08b] text-white shadow-[0_8px_16px_-6px_rgba(13,160,139,0.4)]"
                      : "text-slate-500 hover:bg-slate-50 hover:text-slate-900",
                  )}
                >
                  <Icon className="size-5" strokeWidth={isActive ? 2 : 1.75} />
                  {label}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Mobile Sidebar Overlay */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-50 flex md:hidden h-screen w-screen overflow-hidden">
            <div 
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <div className="relative w-72 bg-white h-full flex flex-col py-6 shadow-2xl animate-in slide-in-from-left duration-300">
               <div className="mb-10 px-6 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-2xl bg-[#0da08b] text-sm font-bold text-white shadow-lg shadow-[#0da08b]/20">
                      <span className="translate-y-[0px]">📍</span>
                    </div>
                    <span className="text-xl font-black tracking-tighter text-slate-900 uppercase">Navito</span>
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
                        isActive 
                          ? "bg-[#0da08b] text-white shadow-lg shadow-[#0da08b]/20" 
                          : "text-slate-500 hover:bg-slate-50 hover:text-slate-900",
                      )}
                    >
                      <Icon className="size-5" strokeWidth={isActive ? 2.5 : 2} />
                      {label}
                    </button>
                  );
                })}
              </nav>

              <div className="p-6 border-t border-slate-50 mt-auto">
                 <button 
                  onClick={() => void handleLogout()}
                  className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl bg-red-50 text-red-600 text-xs font-black uppercase tracking-widest hover:bg-red-100 transition-colors"
                 >
                    <LogOut className="size-4" /> Sign Out
                 </button>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="flex min-h-screen flex-1 flex-col md:pl-64">
          <header className="sticky top-0 z-50 flex h-20 md:h-[88px] items-center justify-between border-b bg-white/80 px-4 md:px-8 backdrop-blur-xl">
            <div className="flex items-center gap-3 md:gap-4">
              <button 
                onClick={() => setIsMobileMenuOpen(true)} 
                className="md:hidden flex size-10 items-center justify-center rounded-xl bg-slate-100 text-slate-500 hover:bg-slate-200 active:scale-90 transition-transform"
              >
                <Menu className="size-5" />
              </button>
              <h1 className="text-lg md:text-2xl font-black tracking-tight text-slate-900 uppercase">Super Admin</h1>
            </div>

            <div className="flex items-center gap-2 md:gap-6">
              <div className="relative hidden sm:block">
                <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search..."
                  className="h-10 w-40 md:w-64 rounded-full bg-slate-100 pl-10 pr-4 text-xs font-bold outline-none transition-all focus:bg-slate-200 focus:ring-4 focus:ring-[#0da08b]/10"
                />
              </div>

              <button className="sm:hidden flex size-10 items-center justify-center rounded-xl bg-slate-100 text-slate-400">
                 <Search className="size-5" />
              </button>

              <div className="relative">
                <button 
                  onClick={() => {
                    const nextState = !showNotifications;
                    closeAllMenus();
                    setShowNotifications(nextState);
                  }}
                  className="relative flex size-9 md:size-10 flex-shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition-all hover:bg-slate-200 active:scale-95"
                >
                  <Bell className="size-4" />
                  <span className="absolute right-2 md:right-2.5 top-2 md:top-2.5 size-2 rounded-full bg-red-500 border-2 border-white animate-pulse" />
                </button>

                {showNotifications && (
                  <div className="absolute right-0 mt-3 w-80 rounded-3xl border bg-white shadow-2xl animate-in fade-in slide-in-from-top-3 duration-200 overflow-hidden">
                    <div className="p-5 border-b flex items-center justify-between">
                      <span className="font-bold text-slate-900">Notifications</span>
                      <span className="text-[10px] font-bold text-[#0da08b] bg-teal-50 px-2 py-0.5 rounded-full uppercase">3 new</span>
                    </div>
                    <div className="p-2 space-y-1">
                      {mockNotifications.map(n => (
                        <div 
                          key={n.id} 
                          onClick={() => { setSelectedNotification(n); setShowNotifications(false); }}
                          className="p-3 rounded-2xl hover:bg-slate-50 transition-colors cursor-pointer group"
                        >
                           <div className="flex gap-3">
                              <div className={cn("size-10 rounded-xl flex items-center justify-center flex-shrink-0", 
                                n.type === 'guide' ? 'bg-teal-50 text-[#0da08b]' : 
                                n.type === 'driver' ? 'bg-[#0da08b] text-white' :
                                n.type === 'payment' ? 'bg-teal-50 text-[#0da08b]' : 'bg-red-50 text-red-500')}>
                                {n.type === 'guide' ? <Compass className="size-5" /> : n.type === 'driver' ? <Car className="size-5" /> : n.type === 'payment' ? <Zap className="size-5" /> : <ShieldCheck className="size-5" />}
                              </div>
                              <div>
                                <p className="text-sm font-bold text-slate-900">{n.title}</p>
                                <p className="text-xs text-slate-500 leading-tight mt-0.5">{n.desc}</p>
                                <p className="text-[10px] text-slate-400 mt-2 font-medium">{n.time}</p>
                              </div>
                           </div>
                        </div>
                      ))}
                    </div>
                    <div className="p-4 bg-slate-50 border-t text-center">
                      <button 
                        onClick={() => { handleNavigate("settings"); setShowNotifications(false); }}
                        className="text-xs font-bold text-[#0da08b] hover:underline"
                      >
                        View all activity
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="relative">
                <button 
                  onClick={() => {
                    const nextState = !showProfileMenu;
                    closeAllMenus();
                    setShowProfileMenu(nextState);
                  }}
                  className="flex items-center gap-3 border-l md:border-l pl-3 md:pl-6 focus:outline-none group active:scale-95 transition-transform"
                >
                  <div className="relative">
                    <img
                      src="https://api.dicebear.com/7.x/notionists/svg?seed=Ruben&backgroundColor=e2e8f0"
                      alt="Ruben Herwitz"
                      className="size-9 md:size-10 rounded-full border border-slate-200 bg-slate-50 group-hover:border-[#0da08b] transition-colors shadow-sm"
                    />
                    <div className="absolute -bottom-0.5 -right-0.5 size-3.5 rounded-full bg-[#0da08b] border-2 border-white shadow-sm" />
                  </div>
                  <div className="hidden flex-col text-left lg:flex">
                    <span className="text-sm font-black text-slate-900 group-hover:text-[#0da08b] transition-colors leading-tight">Admin</span>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Manager</span>
                  </div>
                  <ChevronDown className={cn("hidden md:block size-4 text-slate-400 transition-transform", showProfileMenu && "rotate-180")} />
                </button>

                {showProfileMenu && (
                  <div className="absolute right-0 mt-3 w-64 rounded-[2rem] border-0 bg-white shadow-2xl animate-in fade-in slide-in-from-top-3 duration-200 overflow-hidden ring-1 ring-black/5 z-50">
                    <div className="p-6 bg-slate-50/50 flex items-center gap-4">
                       <img src="https://api.dicebear.com/7.x/notionists/svg?seed=Ruben" className="size-12 rounded-2xl bg-white shadow-sm border border-slate-100" alt="Profile" />
                       <div className="flex-1 overflow-hidden">
                          <p className="text-sm font-black text-slate-900 truncate">Ruben Herwitz</p>
                          <p className="text-[10px] font-bold text-slate-500 truncate">admin@navito.com</p>
                       </div>
                    </div>
                    <div className="p-3">
                        <div className="space-y-1">
                          <button 
                            onClick={() => { handleNavigate("settings"); setShowProfileMenu(false); }}
                            className="w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-[#0da08b]/10 hover:text-[#0da08b] text-xs font-black uppercase tracking-widest text-slate-500 transition-all"
                          >
                             <User className="size-4" /> My Profile
                          </button>
                          <button 
                            onClick={() => { handleNavigate("settings"); setShowProfileMenu(false); }}
                            className="w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-[#0da08b]/10 hover:text-[#0da08b] text-xs font-black uppercase tracking-widest text-slate-500 transition-all"
                          >
                             <Settings className="size-4" /> Settings
                          </button>
                          <button 
                            onClick={() => void handleLogout()}
                            className="w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-red-50 text-red-600 text-xs font-black uppercase tracking-widest transition-all mt-2 group/logout"
                          >
                             <LogOut className="size-4 group-hover/logout:rotate-12 transition-transform" /> Sign Out
                          </button>
                       </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </header>

          <main className="flex-1 p-4 md:p-8">
            {children}
          </main>
        </div>
      </div>

      {/* Notification Detail Pop-up */}
      {selectedNotification && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
           <div 
             className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300"
             onClick={() => setSelectedNotification(null)}
           />
           <div className="relative w-full max-w-sm rounded-[2.5rem] bg-white p-8 shadow-2xl animate-in zoom-in-95 duration-200">
              <button 
                onClick={() => setSelectedNotification(null)}
                className="absolute right-6 top-6 flex size-10 items-center justify-center rounded-full bg-slate-50 text-slate-400 hover:text-slate-600 active:scale-90 transition-transform"
              >
                <X className="size-5" />
              </button>
              
              <div className="flex flex-col items-center text-center space-y-4">
                 <div className={cn("size-20 rounded-3xl flex items-center justify-center shadow-lg transform rotate-6", 
                   selectedNotification.type === 'guide' ? 'bg-teal-50 text-[#0da08b]' : 
                   selectedNotification.type === 'driver' ? 'bg-[#0da08b] text-white' :
                   selectedNotification.type === 'payment' ? 'bg-teal-50 text-[#0da08b]' : 'bg-red-50 text-red-500')}>
                   {selectedNotification.type === 'guide' ? <Compass className="size-10" /> : selectedNotification.type === 'driver' ? <Car className="size-10" /> : selectedNotification.type === 'payment' ? <Zap className="size-10" /> : <ShieldCheck className="size-10" />}
                 </div>
                 <div className="pt-2">
                    <h3 className="text-xl font-black text-slate-900 leading-tight">{selectedNotification.title}</h3>
                    <p className="text-xs font-bold text-[#0da08b] uppercase tracking-widest mt-1">{selectedNotification.time}</p>
                 </div>
                 <p className="text-sm font-medium text-slate-500 leading-relaxed">
                    {selectedNotification.desc} This is an important platform notification. Please take the necessary action.
                 </p>
                 <div className="flex flex-col gap-3 w-full">
                    <button 
                      onClick={() => {
                         const targetId = selectedNotification.type === 'guide' ? 'guides' : 
                                        selectedNotification.type === 'driver' ? 'drivers' :
                                        selectedNotification.type === 'payment' ? 'dashboard' : 'settings';
                        handleNavigate(targetId as SuperAdminNavId);
                        setSelectedNotification(null);
                      }}
                      className="w-full h-14 rounded-2xl bg-[#0da08b] text-white font-bold text-sm uppercase tracking-widest shadow-xl shadow-[#0da08b]/20 hover:bg-[#0d8a78] transition-all"
                    >
                      View Details
                    </button>
                    <button 
                      onClick={() => setSelectedNotification(null)}
                      className="w-full h-12 rounded-2xl bg-slate-50 text-slate-400 font-bold text-[10px] uppercase tracking-widest hover:bg-slate-100 transition-all border border-slate-100"
                    >
                      Mark as Read
                    </button>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}
