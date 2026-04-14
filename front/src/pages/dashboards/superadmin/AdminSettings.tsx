import { useState, useRef } from "react";
import { Settings, Shield, Bell, User, Lock, Globe, CreditCard, ChevronRight, Save, Trash2, ShieldCheck, Mail, Key, Calendar, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../app/components/ui/card";
import { cn } from "../../../app/components/ui/utils";
import { type SuperAdminNavId } from "./MoroccoSuperAdminShell";

type SettingsTab = "GENERAL" | "ACCOUNT" | "SECURITY" | "NOTIFICATIONS" | "REGIONAL" | "BILLING";

export default function AdminSettings({ onNavigate }: { onNavigate: (id: SuperAdminNavId) => void }) {
  const [activeTab, setActiveTab] = useState<SettingsTab>("GENERAL");
  const [platformLogo, setPlatformLogo] = useState<string>("📍");
  const [adminAvatar, setAdminAvatar] = useState<string>("https://api.dicebear.com/7.x/notionists/svg?seed=Ruben");
  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, setter: (val: string) => void) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setter(reader.result as string);
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleSave = () => {
    setSaveStatus("Paramètres sauvegardés !");
    setTimeout(() => setSaveStatus(null), 3000);
  };

  const NavButton = ({ id, label, icon: Icon }: { id: SettingsTab; label: string; icon: any }) => (
    <button 
      onClick={() => setActiveTab(id)}
      className={cn(
        "w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-sm transition-all duration-200",
        activeTab === id 
          ? "bg-[#0da08b] text-white shadow-lg shadow-[#0da08b]/20" 
          : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
      )}
    >
      <Icon className="size-4" /> {label}
    </button>
  );

  return (
    <div className="flex flex-col lg:flex-row gap-8 h-auto lg:h-[calc(100vh-140px)] animate-in fade-in duration-500">
      {/* Settings Navigation */}
      <Card className="w-full lg:w-72 flex-shrink-0 rounded-[2.5rem] border-0 bg-white shadow-sm overflow-hidden">
        <CardHeader className="border-b border-slate-50 pb-6 pt-8 px-8">
          <CardTitle className="text-xl font-black text-slate-900 uppercase tracking-tighter">Paramètres</CardTitle>
        </CardHeader>
        <CardContent className="p-4 flex flex-col gap-1">
           <NavButton id="GENERAL" label="Général" icon={Settings} />
           <NavButton id="ACCOUNT" label="Mon Compte" icon={User} />
           <NavButton id="SECURITY" label="Sécurité" icon={Lock} />
           <NavButton id="NOTIFICATIONS" label="Notifications" icon={Bell} />
           <NavButton id="REGIONAL" label="Régional" icon={Globe} />
           <NavButton id="BILLING" label="Facturation" icon={CreditCard} />
        </CardContent>
      </Card>

      {/* Settings Content */}
      <Card className="flex-1 rounded-[2.5rem] border-0 bg-white shadow-sm overflow-hidden flex flex-col">
        <CardHeader className="border-b border-slate-50 pb-6 pt-8 px-10">
          <div className="flex items-center justify-between">
             <div>
               <CardTitle className="text-2xl font-black text-slate-900 uppercase tracking-tighter">
                {activeTab === "GENERAL" && "Paramètres Généraux"}
                {activeTab === "ACCOUNT" && "Gestion du Compte"}
                {activeTab === "SECURITY" && "Sécurité & Accès"}
                {activeTab === "NOTIFICATIONS" && "Préférences Alertes"}
                {activeTab === "REGIONAL" && "Langue & Région"}
                {activeTab === "BILLING" && "Facturation & Plans"}
               </CardTitle>
               <p className="text-sm font-medium text-slate-400 mt-1">
                {activeTab === "GENERAL" && "Configurez l'identité et les opérations de base mondiales."}
                {activeTab === "ACCOUNT" && "Gérez vos informations personnelles et votre profil admin."}
                {activeTab === "SECURITY" && "Protégez votre compte avec des mesures avancées."}
                {activeTab === "NOTIFICATIONS" && "Choisissez comment vous souhaitez être informé."}
                {activeTab === "REGIONAL" && "Adaptez l'interface à votre localisation."}
                {activeTab === "BILLING" && "Suivez vos revenus et abonnements partenaires."}
               </p>
             </div>
             <button onClick={handleSave} className="flex items-center gap-2 rounded-2xl bg-[#0da08b] px-6 py-3 text-xs font-black text-white uppercase tracking-widest transition-all hover:bg-[#0d8a78] shadow-xl shadow-[#0da08b]/20 active:scale-95">
                <Save className="size-4" /> Enregistrer
             </button>
          </div>
        </CardHeader>
        
        {saveStatus && (
          <div className="absolute top-8 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-top-4 duration-300">
             <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900 text-white text-xs font-black uppercase tracking-widest shadow-xl border border-slate-700">
                <CheckCircle2 className="size-4 text-[#0da08b]" /> {saveStatus}
             </div>
          </div>
        )}

        <CardContent className="flex-1 overflow-y-auto p-10 space-y-12 hide-scrollbar">
           {activeTab === "GENERAL" && (
             <>
                <div className="space-y-6 max-w-2xl">
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-50 pb-3">Identité de la Plateforme</h3>
                  <div className="flex items-center gap-10">
                     <div className="flex flex-col items-center gap-4">
                        <input type="file" ref={logoInputRef} onChange={(e) => handleImageUpload(e, setPlatformLogo)} className="hidden" accept="image/*" />
                        <div className="flex size-28 items-center justify-center rounded-[2.5rem] bg-[#0da08b] text-4xl font-bold text-white shadow-2xl border-4 border-slate-50 overflow-hidden">
                          {platformLogo.startsWith('data:') ? <img src={platformLogo} alt="Logo" className="w-full h-full object-cover" /> : platformLogo}
                        </div>
                        <button onClick={() => logoInputRef.current?.click()} className="text-[10px] font-black text-[#0da08b] hover:underline uppercase tracking-widest">Changer le Logo</button>
                     </div>
                     <div className="flex-1 grid grid-cols-1 gap-5">
                        <div className="space-y-2">
                           <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Nom de la Plateforme</label>
                           <input type="text" defaultValue="Navito Global" className="w-full h-12 rounded-2xl border border-slate-100 bg-slate-50 px-5 text-sm font-bold text-slate-900 outline-none transition-all focus:border-[#0da08b] focus:bg-white focus:ring-4 focus:ring-[#0da08b]/10" />
                        </div>
                        <div className="space-y-2">
                           <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Email de Support Mondial</label>
                           <input type="email" defaultValue="support@navito-global.com" className="w-full h-12 rounded-2xl border border-slate-100 bg-slate-50 px-5 text-sm font-bold text-slate-900 outline-none transition-all focus:border-[#0da08b] focus:bg-white focus:ring-4 focus:ring-[#0da08b]/10" />
                        </div>
                     </div>
                  </div>
                </div>

                <div className="space-y-6 max-w-2xl">
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-50 pb-3">Opérations</h3>
                  <div className="grid grid-cols-2 gap-8">
                     <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Devise Principale</label>
                        <select className="w-full h-12 rounded-2xl border border-slate-100 bg-slate-50 px-5 text-sm font-bold text-slate-900 outline-none focus:border-[#0da08b] focus:bg-white transition-all">
                           <option>USD ($) - International</option>
                           <option>EUR (€) - Europe</option>
                           <option>MAD (DH) - Maroc</option>
                           <option>JPY (¥) - Japon</option>
                        </select>
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Mode de Maintenance</label>
                        <div className="flex items-center justify-between h-12 px-5 bg-slate-50 rounded-2xl border border-slate-100">
                           <span className="text-xs font-bold text-slate-500">Désactivé</span>
                           <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-slate-200 transition-colors">
                              <span className="inline-block h-4 w-4 translate-x-1 rounded-full bg-white transition-transform" />
                           </button>
                        </div>
                     </div>
                  </div>
                </div>
             </>
           )}

           {activeTab === "ACCOUNT" && (
             <div className="space-y-10 max-w-2xl animate-in slide-in-from-bottom-4 duration-300">
                <div className="flex items-center gap-8 p-8 rounded-[2rem] bg-slate-50 border border-slate-100">
                   <img src={adminAvatar} className="size-24 rounded-3xl bg-white shadow-sm border border-slate-200 object-cover" alt="Avatar" />
                   <div className="space-y-4 flex-1">
                      <div>
                        <input type="file" ref={avatarInputRef} onChange={(e) => handleImageUpload(e, setAdminAvatar)} className="hidden" accept="image/*" />
                        <h4 className="text-sm font-black text-slate-900">Photo de Profil Admin</h4>
                        <p className="text-xs text-slate-400 font-medium">PNG ou JPG, max 10MB.</p>
                      </div>
                      <div className="flex gap-3">
                         <button onClick={() => avatarInputRef.current?.click()} className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-[10px] font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50">Changer</button>
                         <button onClick={() => setAdminAvatar("https://api.dicebear.com/7.x/notionists/svg?seed=Ruben")} className="px-4 py-2 rounded-xl bg-red-50 text-red-600 text-[10px] font-black uppercase tracking-widest hover:bg-red-100">Supprimer</button>
                      </div>
                   </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Prénom</label>
                      <input type="text" defaultValue="Ruben" className="w-full h-12 rounded-2xl border border-slate-100 bg-white px-5 text-sm font-bold outline-none focus:border-[#0da08b] focus:ring-4 focus:ring-[#0da08b]/10 transition-all" />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Nom</label>
                      <input type="text" defaultValue="Herwitz" className="w-full h-12 rounded-2xl border border-slate-100 bg-white px-5 text-sm font-bold outline-none focus:border-[#0da08b] focus:ring-4 focus:ring-[#0da08b]/10 transition-all" />
                   </div>
                   <div className="col-span-2 space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Email Administratif</label>
                      <input type="email" defaultValue="admin@navito-global.com" className="w-full h-12 rounded-2xl border border-slate-100 bg-white px-5 text-sm font-bold outline-none focus:border-[#0da08b] focus:ring-4 focus:ring-[#0da08b]/10 transition-all" />
                   </div>
                </div>
             </div>
           )}

           {activeTab === "SECURITY" && (
             <div className="space-y-8 max-w-2xl animate-in slide-in-from-bottom-4 duration-300">
                <div className="space-y-6">
                   <div className="flex items-center gap-4 p-6 rounded-3xl bg-teal-50 border border-teal-100">
                      <ShieldCheck className="size-8 text-[#0da08b]" />
                      <div>
                         <p className="text-sm font-black text-[#0da08b]">Double Authentification Activée</p>
                         <p className="text-xs text-teal-600 font-medium tracking-tight">Votre accès est protégé par une clé de sécurité matérielle.</p>
                      </div>
                   </div>

                   <div className="p-8 rounded-[2rem] bg-white border border-slate-50 shadow-sm space-y-6">
                      <h4 className="text-sm font-black text-slate-900 border-b border-slate-50 pb-4 flex items-center gap-3 lowercase italic opacity-40">
                         <Key className="size-4" /> mise à jour du mot de passe
                      </h4>
                      <div className="space-y-4">
                         <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Mot de passe actuel</label>
                            <input type="password" placeholder="••••••••" className="w-full h-12 rounded-2xl border border-slate-100 bg-slate-50 px-5 text-sm font-bold outline-none focus:bg-white focus:border-[#0da08b] transition-all" />
                         </div>
                         <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                               <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Nouveau mot de passe</label>
                               <input type="password" placeholder="Min 12 caractères" className="w-full h-12 rounded-2xl border border-slate-100 bg-slate-50 px-5 text-sm font-bold outline-none focus:bg-white focus:border-[#0da08b] transition-all" />
                            </div>
                            <div className="space-y-2">
                               <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Confirmer mot de passe</label>
                               <input type="password" placeholder="Identique au nouveau" className="w-full h-12 rounded-2xl border border-slate-100 bg-slate-50 px-5 text-sm font-bold outline-none focus:bg-white focus:border-[#0da08b] transition-all" />
                            </div>
                         </div>
                      </div>
                   </div>
                </div>
             </div>
           )}

           {activeTab === "NOTIFICATIONS" && (
             <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-300">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl">
                   {[
                     { title: "Inscriptions Guides", desc: "Soyez alerté quand un guide rejoint la plateforme.", icon: User },
                     { title: "Paiements Mondiaux", desc: "Suivi des transactions en temps réel.", icon: CreditCard },
                     { title: "Alertes Systèmes", desc: "Notifications sur l'état de l'infrastructure.", icon: Shield },
                     { title: "Activités & Planning", desc: "Rappels sur les départs et réservations.", icon: Calendar }
                   ].map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-6 rounded-3xl bg-slate-50 border border-slate-100 transition-all hover:border-[#0da08b]/30">
                       <div className="flex items-center gap-4">
                          <div className="size-10 rounded-xl bg-white flex items-center justify-center text-slate-400 shadow-sm">
                             <item.icon className="size-5" />
                          </div>
                          <div>
                             <h4 className="text-sm font-black text-slate-900">{item.title}</h4>
                             <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter mt-0.5">{item.desc}</p>
                          </div>
                       </div>
                       <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-[#0da08b] transition-colors">
                          <span className="inline-block h-4 w-4 translate-x-6 rounded-full bg-white shadow-sm transition-transform" />
                       </button>
                    </div>
                   ))}
                </div>
             </div>
           )}

           {activeTab === "REGIONAL" && (
             <div className="space-y-8 max-w-2xl animate-in slide-in-from-bottom-4 duration-300">
                <div className="grid grid-cols-1 gap-6">
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Langue Systéme</label>
                      <select className="w-full h-12 rounded-2xl border border-slate-100 bg-white px-5 text-sm font-bold outline-none focus:border-[#0da08b] transition-all">
                        <option>Français (International)</option>
                        <option>English (Global)</option>
                        <option>العربية (المغرب)</option>
                        <option>日本語 (Japon)</option>
                      </select>
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Fuseau Horaire de Référence</label>
                      <select className="w-full h-12 rounded-2xl border border-slate-100 bg-white px-5 text-sm font-bold outline-none focus:border-[#0da08b] transition-all">
                        <option>UTC +01:00 (Casablanca / Paris)</option>
                        <option>UTC -05:00 (New York / Québec)</option>
                        <option>UTC +09:00 (Tokyo / Séoul)</option>
                      </select>
                   </div>
                </div>
             </div>
           )}

           {activeTab === "BILLING" && (
             <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-300">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                   <div className="p-8 rounded-[2.5rem] bg-slate-900 text-white space-y-4">
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Revenu Global (Mensuel)</p>
                      <h4 className="text-3xl font-black">424.800 <span className="text-xs text-slate-400">USD</span></h4>
                      <div className="pt-4 flex items-center gap-2 text-teal-400 text-xs font-bold">
                         <ChevronRight className="size-4" /> +18.5% ce mois
                      </div>
                   </div>
                   <div className="p-8 rounded-[2.5rem] bg-white border border-slate-100 space-y-4">
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Commissions Partenaires</p>
                      <h4 className="text-3xl font-black text-slate-900">52.400 <span className="text-xs text-slate-400">USD</span></h4>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Attente de virement</p>
                   </div>
                   <div className="p-8 rounded-[2.5rem] bg-white border border-slate-100 space-y-4">
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Statut Licence</p>
                      <div className="inline-block px-3 py-1 rounded-full bg-teal-50 text-[#0da08b] text-[10px] font-black uppercase tracking-widest">Enterprise Global</div>
                      <p className="text-xs font-bold text-slate-500 mt-2">Expire en : 14 mois</p>
                   </div>
                </div>

                <div className="pt-8">
                   <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-50 pb-3 mb-6">Transactions Internationales Récentes</h3>
                   <div className="space-y-2">
                      {[
                        { title: "Paiement #INT-901 (Maroc)", date: "15 Oct 2024", val: "2.500 MAD" },
                        { title: "Paiement #INT-902 (France)", date: "14 Oct 2024", val: "450 EUR" },
                        { title: "Paiement #INT-903 (USA)", date: "12 Oct 2024", val: "1.200 USD" }
                      ].map((t, idx) => (
                        <div key={idx} className="flex items-center justify-between p-4 rounded-2xl hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100">
                           <div className="flex items-center gap-4">
                              <div className="size-10 rounded-xl bg-slate-50 text-slate-400 flex items-center justify-center">
                                 <Mail className="size-5" />
                              </div>
                              <div>
                                 <p className="text-sm font-bold text-slate-900">{t.title}</p>
                                 <p className="text-xs text-slate-400 font-medium">{t.date}</p>
                               </div>
                           </div>
                           <span className="text-sm font-black text-slate-900">{t.val}</span>
                        </div>
                      ))}
                   </div>
                </div>
             </div>
           )}
        </CardContent>
      </Card>
    </div>
  );
}
