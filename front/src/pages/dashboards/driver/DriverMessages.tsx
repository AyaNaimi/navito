import { useState } from "react";
import { Send, MoreVertical, Search, CheckCheck } from "lucide-react";
import { Card } from "../../../app/components/ui/card";
import { cn } from "../../../app/components/ui/utils";

const mockChats = [
  { id: "1", name: "Jack R.", avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Jack", route: "Casa Port → Morocco Mall", unread: 0 },
  { id: "2", name: "Maria S.", avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Maria", route: "Anfa Place → Marina", unread: 2 },
];

export default function DriverMessages() {
  const [activeChat, setActiveChat] = useState("1");
  const [chatMessage, setChatMessage] = useState("");
  const [messages, setMessages] = useState([
     { id: "1", senderId: "customer", text: "Je suis devant la gare, près de la porte nord.", time: "16:25" },
     { id: "2", senderId: "driver", text: "D'accord, je suis là dans 2 minutes. Quelle est la couleur de votre veste ?", time: "16:26" },
     { id: "3", senderId: "customer", text: "Bleu marine.", time: "16:28" },
  ]);

  const handleSendMessage = () => {
    if (!chatMessage.trim()) return;
    setMessages(prev => [...prev, { id: Date.now().toString(), senderId: "driver", text: chatMessage, time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) }]);
    setChatMessage("");

    setTimeout(() => {
       setMessages(prev => [...prev, { id: Date.now().toString(), senderId: "customer", text: "Parfait, je vous vois !", time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) }]);
    }, 2000);
  };

  const currentChat = mockChats.find(c => c.id === activeChat);

  return (
    <div className="h-[calc(100vh-140px)] flex bg-white rounded-[32px] shadow-sm border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-500">
       {/* Sidebar des chats */}
       <div className="w-1/3 min-w-[300px] border-r border-slate-100 flex flex-col bg-slate-50/30">
          <div className="p-6 border-b border-slate-100">
             <h2 className="text-xl font-black text-slate-900 tracking-tight mb-4">Messages</h2>
             <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                <input type="text" placeholder="Rechercher..." className="w-full h-12 bg-white rounded-xl pl-11 pr-4 text-sm font-medium border-none shadow-sm focus:ring-2 ring-[#00897B]/20 outline-none transition-all placeholder:text-slate-400" />
             </div>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
             {mockChats.map(chat => (
                <div 
                   key={chat.id} 
                   onClick={() => setActiveChat(chat.id)}
                   className={cn(
                     "flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition-all",
                     activeChat === chat.id ? "bg-white shadow-sm border border-slate-100 ring-1 ring-slate-100" : "hover:bg-slate-100/50"
                   )}
                >
                   <div className="relative">
                      <img src={chat.avatar} className="size-12 rounded-xl bg-slate-100" alt="Avatar" />
                      {chat.unread > 0 && (
                         <div className="absolute -top-1 -right-1 size-4 bg-rose-500 rounded-full border-2 border-white flex items-center justify-center text-[8px] font-black text-white">
                            {chat.unread}
                         </div>
                      )}
                   </div>
                   <div className="flex-1 overflow-hidden">
                      <div className="flex items-center justify-between">
                         <h4 className="text-sm font-bold text-slate-900">{chat.name}</h4>
                         <span className="text-[10px] font-black text-slate-400">16:28</span>
                      </div>
                      <p className="text-[11px] font-bold text-slate-500 truncate mt-0.5">{chat.route}</p>
                   </div>
                </div>
             ))}
          </div>
       </div>

       {/* Fenêtre de chat */}
       <div className="flex-1 flex flex-col bg-white">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white/80 backdrop-blur z-10">
             <div className="flex items-center gap-4">
                <img src={currentChat?.avatar} className="size-12 rounded-2xl bg-slate-50 border border-slate-100 shadow-sm" alt="Avatar" />
                <div>
                   <h3 className="text-lg font-black text-slate-900">{currentChat?.name}</h3>
                   <span className="text-[10px] font-bold text-[#00897B] bg-[#00897B]/10 px-2 py-0.5 rounded-md uppercase tracking-widest">En cours • {currentChat?.route}</span>
                </div>
             </div>
             <button className="size-10 rounded-xl hover:bg-slate-50 flex items-center justify-center text-slate-400 transition-colors">
                <MoreVertical className="size-5" />
             </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6">
             {messages.map((msg) => {
               const isMe = msg.senderId === "driver";
               return (
                  <div key={msg.id} className={cn("flex flex-col max-w-[75%]", isMe ? "ml-auto items-end" : "mr-auto items-start")}>
                     <div className={cn(
                        "p-4 rounded-[20px] text-sm font-medium shadow-sm",
                        isMe 
                          ? "bg-[#00897B] text-white rounded-br-none" 
                          : "bg-slate-50 border border-slate-100 text-slate-800 rounded-bl-none"
                     )}>
                        {msg.text}
                     </div>
                     <div className="flex items-center gap-1 mt-1.5 px-1 text-[10px] font-bold text-slate-400">
                        {msg.time} {isMe && <CheckCheck className="size-3 text-[#00897B]" />}
                     </div>
                  </div>
               );
             })}
          </div>

          <div className="p-6 border-t border-slate-100 bg-slate-50/30">
             <div className="flex items-center gap-3 bg-white p-2 pl-6 rounded-2xl border border-slate-200 shadow-sm focus-within:ring-2 ring-[#00897B]/20 transition-all">
                <input 
                  type="text" 
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
                  placeholder={`Écrire un message à ${currentChat?.name}...`}
                  className="flex-1 bg-transparent border-none outline-none text-sm font-medium text-slate-700 placeholder:text-slate-400"
                />
                <button 
                  onClick={handleSendMessage}
                  className="size-12 rounded-xl bg-[#00897B] hover:bg-[#00796b] text-white flex items-center justify-center shadow-lg shadow-[#00897B]/30 transition-transform active:scale-95"
                >
                   <Send className="size-5 -mt-0.5 -ml-0.5" />
                </button>
             </div>
          </div>
       </div>
    </div>
  );
}
