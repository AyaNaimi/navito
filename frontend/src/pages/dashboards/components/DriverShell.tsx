import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, ListTodo, MessageSquare, User, Settings, LogOut, Send, Bell, CarFront, FileWarning } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "../../../app/components/ui/sheet";
import { Popover, PopoverContent, PopoverTrigger } from "../../../app/components/ui/popover";
import { cn } from "../../../app/components/ui/utils";

export default function DriverShell({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const [message, setMessage] = useState("");
  const [activeChat] = useState("1");
  const [messages, setMessages] = useState([
    { id: "1", senderId: "customer", text: "Hi there! I just booked you for a trip to the Medina.", time: "10:20 AM" },
    { id: "2", senderId: "driver", text: "Hello Jack! Got your request. I'm about 10 minutes away.", time: "10:21 AM" },
    { id: "3", senderId: "customer", text: "Great! I'm waiting near the north gate. Wearing a blue jacket.", time: "10:24 AM" },
  ]);

  const handleSendMessage = () => {
    if (!message.trim()) return;
    const newMsg = { id: Date.now().toString(), senderId: "driver", text: message, time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) };
    setMessages([...messages, newMsg]);
    setMessage("");

    // Simulate reply
    setTimeout(() => {
       setMessages(prev => [...prev, { id: Date.now().toString(), senderId: "customer", text: "Ok, noted! Take your time.", time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) }]);
    }, 2000);
  };

  const navItems = [
    { name: "Dashboard", path: "/demo/driver-dashboard", icon: LayoutDashboard },
    { name: "Orders", path: "/driver/orders", icon: ListTodo },
    { name: "Profile", path: "/driver/profile", icon: User },
  ];

  const chats = [
    { id: "1", name: "Jack R.", avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Jack", lastMessage: messages[messages.length - 1]?.text || "", time: "10:24 AM", unread: 2 },
    { id: "2", name: "Maria S.", avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Maria", lastMessage: "Perfect, see you in 5 mins", time: "Yesterday", unread: 0 },
  ];

  return (
    <div className="relative min-h-screen bg-[#F8FAFC] text-slate-900 font-sans flex flex-col">
      {/* Mobile Top Header */}
      <header className="sticky top-0 z-40 flex h-20 items-center justify-between border-b border-slate-100 bg-white/80 px-6 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#00897B] text-lg font-black text-white shadow-[0_4px_12px_-2px_rgba(0,137,123,0.3)]">
            N
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold tracking-tight text-slate-900 leading-none">Navito</span>
            <span className="text-[10px] font-bold text-[#00897B] uppercase tracking-widest mt-1">Driver Partner</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Popover>
             <PopoverTrigger asChild>
                <button className="relative flex size-10 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition-all hover:bg-slate-200 active:scale-95">
                  <Bell className="size-5" strokeWidth={1.5} />
                  <span className="absolute right-2.5 top-2.5 size-2 rounded-full bg-rose-500 ring-2 ring-white shadow-sm" />
                </button>
             </PopoverTrigger>
             <PopoverContent className="w-80 p-0 rounded-[24px] border-slate-100 shadow-xl overflow-hidden" align="end" sideOffset={10}>
                <div className="p-4 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
                   <h4 className="text-sm font-black text-slate-900 tracking-tight">Vos Rappels</h4>
                   <span className="text-[10px] font-bold text-slate-400 uppercase">2 Nouveaux</span>
                </div>
                <div className="divide-y divide-slate-50">
                   <div className="p-4 bg-white hover:bg-slate-50 transition-colors flex gap-4 cursor-pointer">
                      <div className="size-10 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center shrink-0">
                         <FileWarning className="size-5" />
                      </div>
                      <div>
                         <p className="text-xs font-bold text-slate-900">Assurance Expire Bientôt</p>
                         <p className="text-[10px] text-slate-500 mt-1 font-medium leading-relaxed">Votre assurance professionnelle expire dans 15 jours. Veuillez la renouveler.</p>
                      </div>
                   </div>
                   <div className="p-4 bg-white hover:bg-slate-50 transition-colors flex gap-4 cursor-pointer">
                      <div className="size-10 rounded-xl bg-[#00897B]/10 text-[#00897B] flex items-center justify-center shrink-0">
                         <CarFront className="size-5" />
                      </div>
                      <div>
                         <p className="text-xs font-bold text-slate-900">Visite Technique Requise</p>
                         <p className="text-[10px] text-slate-500 mt-1 font-medium leading-relaxed">N'oubliez pas l'inspection annuelle de votre Berline prèvue le mois prochain.</p>
                      </div>
                   </div>
                </div>
             </PopoverContent>
          </Popover>
          <img
            src="https://api.dicebear.com/7.x/notionists/svg?seed=Samrat&backgroundColor=e2e8f0"
            alt="Driver Profile"
            className="size-10 rounded-full border-2 border-white shadow-sm ring-1 ring-slate-100"
          />
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 pb-24 md:pb-8">
        <div className="h-full animate-in fade-in duration-500">
          {children}
        </div>
      </main>

      {/* Bottom Nav for Mobile accessibility */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 flex h-20 items-center justify-around border-t border-slate-100 bg-white/95 px-4 backdrop-blur-xl md:hidden">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path || (item.name === "Dashboard" && location.pathname.includes("dashboard"));
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              to={item.path}
              className={cn(
                "group flex flex-col items-center justify-center gap-1 min-w-[64px] transition-all",
                isActive ? "text-[#00897B]" : "text-slate-400"
              )}
            >
              <div className={cn(
                "flex size-10 items-center justify-center rounded-2xl transition-all duration-300",
                isActive ? "bg-[#00897B]/10 text-[#00897B]" : "group-hover:bg-slate-50"
              )}>
                <Icon className={cn("size-6 transition-transform", isActive && "scale-110")} strokeWidth={isActive ? 2.5 : 2} />
              </div>
              <span className="text-[10px] font-bold tracking-tight">{item.name}</span>
            </Link>
          );
        })}

        {/* Messaging Bottom Drawer */}
        <Sheet>
          <SheetTrigger asChild>
            <button className="group flex flex-col items-center justify-center gap-1 min-w-[64px] text-slate-400">
              <div className="relative flex size-10 items-center justify-center rounded-2xl group-hover:bg-slate-50 transition-all active:scale-95">
                <MessageSquare className="size-6" strokeWidth={2} />
                <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-rose-500 ring-2 ring-white shadow-sm" />
              </div>
              <span className="text-[10px] font-bold tracking-tight text-slate-400">Chat</span>
            </button>
          </SheetTrigger>
          <SheetContent side="bottom" className="p-0 h-[85vh] rounded-t-[32px] border-t-0 shadow-2xl">
            <div className="flex h-full flex-col bg-white overflow-hidden">
              <div className="mx-auto mt-3 h-1.5 w-12 rounded-full bg-slate-200" />
              
              <SheetHeader className="px-6 pb-4 pt-4 border-b border-slate-50">
                <div className="flex items-center gap-4">
                  <img src={chats.find((c) => c.id === activeChat)?.avatar} className="size-12 rounded-full bg-slate-50 border border-slate-100 shadow-sm" alt="Avatar" />
                  <div className="text-left flex-1">
                    <SheetTitle className="text-lg font-bold text-slate-900 leading-tight">{chats.find((c) => c.id === activeChat)?.name}</SheetTitle>
                    <p className="text-[10px] font-bold text-[#00897B] uppercase tracking-wider mt-0.5">Active Trip #TRP-1040</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="size-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors"><Settings className="size-5" strokeWidth={1.5} /></button>
                    <button className="size-10 rounded-full bg-rose-50 flex items-center justify-center text-rose-500 hover:bg-rose-100 transition-colors"><LogOut className="size-5" strokeWidth={1.5} /></button>
                  </div>
                </div>
              </SheetHeader>

              <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/20">
                {messages.map((msg) => {
                  const isMe = msg.senderId === "driver";
                  return (
                    <div key={msg.id} className={cn("flex flex-col", isMe ? "items-end" : "items-start")}>
                      <div className={cn(
                        "max-w-[85%] p-4 rounded-3xl text-sm shadow-sm transition-all animate-in slide-in-from-bottom-2 duration-300",
                        isMe 
                          ? "bg-[#00897B] text-white rounded-br-none shadow-[#00897B]/20" 
                          : "bg-white border border-slate-100/50 text-slate-800 rounded-bl-none"
                      )}>
                        <p className="leading-relaxed font-medium">{msg.text}</p>
                      </div>
                      <p className="text-[10px] text-slate-400 mt-1.5 font-bold px-1">{msg.time}</p>
                    </div>
                  );
                })}
              </div>

              <div className="p-6 bg-white border-t border-slate-100/50 pb-[env(safe-area-inset-bottom,24px)]">
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    placeholder="Tapez votre message..."
                    className="flex-1 h-14 bg-slate-50 border-none rounded-2xl px-5 text-sm font-medium outline-none focus:ring-2 focus:ring-[#00897B]/10 transition-all placeholder:text-slate-400"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' ? handleSendMessage() : null}
                  />
                  <button onClick={handleSendMessage} className="size-14 bg-[#00897B] rounded-2xl flex items-center justify-center text-white shadow-[0_8px_16px_-4px_rgba(0,137,123,0.4)] active:scale-95 transition-transform">
                    <Send className="size-6 rotate-12" />
                  </button>
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </nav>
    </div>
  );
}
