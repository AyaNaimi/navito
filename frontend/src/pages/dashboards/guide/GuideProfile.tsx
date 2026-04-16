import { useState } from "react";
import { 
  Edit2, 
  Save, 
  Phone, 
  Mail, 
  MapPin, 
  Hash, 
  Check, 
  FileText, 
  Languages, 
  Star, 
  StarHalf,
  ShieldCheck,
  TrendingUp,
  Award,
  ChevronRight,
  Download,
  Eye,
  X
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../app/components/ui/card";
import { cn } from "../../../app/components/ui/utils";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { useAppContext } from "../../../app/context/AppContext";

export default function GuideProfile({ onNavigate }: { onNavigate?: (id: any) => void }) {
  const { userName, userEmail } = useAppContext();
  const [isEditing, setIsEditing] = useState(false);
  const [viewingDoc, setViewingDoc] = useState<{title: string, url: string} | null>(null);
  
  const [formData, setFormData] = useState({
     phone: "+212 661 987 654",
     email: userEmail || "youssef.b@navito.ma",
     city: "Marrakech, Maroc",
     languages: "Arabe, Français, Anglais",
     badge: "Badge N° 9812A",
  });

  const [documents, setDocuments] = useState([
    { 
      id: 1, 
      title: "Carte de Guide Officiel", 
      status: "valide", 
      label: "Validé", 
      expireDate: "12 Oct 2028", 
      url: "/tours/marrakech.png" 
    },
    { 
      id: 2, 
      title: "Certificat Premiers Secours", 
      status: "expire", 
      label: "En attente", 
      expireDate: "1 Sep 2024", 
      url: "/tours/atlas.png" 
    },
    { 
      id: 3, 
      title: "Accréditation Ministère", 
      status: "valide", 
      label: "Validé", 
      expireDate: "20 Oct 2024", 
      url: "/C:/Users/user/.gemini/antigravity/brain/c25e6f3c-43d0-4790-8972-c181229307b6/marrakech_medina_walk_1776152975896.png" 
    },
    { 
      id: 4, 
      title: "Carte CIN", 
      status: "valide", 
      label: "Validé", 
      expireDate: "05 Jan 2030", 
      url: "/tours/sahara.png" 
    },
  ]);

  const handleSave = () => {
     setIsEditing(false);
     toast.success("Succès", { description: "Vos informations ont été mises à jour." });
  };

  const handleUpdateDoc = (id: number) => {
    setDocuments(prev => prev.map(doc => {
      if (doc.id === id) {
        toast.success("Document renouvelé", { description: `La demande pour ${doc.title} a été envoyée.` });
        return { ...doc, status: "valide", label: "Validé", expireDate: "12 Oct 2029" };
      }
      return doc;
    }));
  };

  const downloadFile = (url: string, filename: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Téléchargement", { description: `${filename} est prêt.` });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-16 animate-in fade-in duration-700 relative">
      
      {/* Lightbox / Document Viewer */}
      <AnimatePresence>
        {viewingDoc && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/90 backdrop-blur-md"
            onClick={() => setViewingDoc(null)}
          >
             <motion.div 
               initial={{ scale: 0.9, y: 20 }}
               animate={{ scale: 1, y: 0 }}
               exit={{ scale: 0.9, y: 20 }}
               className="relative max-w-4xl w-full bg-white rounded-[40px] overflow-hidden shadow-2xl"
               onClick={e => e.stopPropagation()}
             >
                <div className="p-8 border-b border-slate-100 flex items-center justify-between">
                   <h3 className="text-xl font-black text-slate-900">{viewingDoc.title}</h3>
                   <button 
                     onClick={() => setViewingDoc(null)}
                     className="size-10 rounded-full bg-slate-50 text-slate-400 hover:text-slate-900 flex items-center justify-center transition-colors"
                   >
                      <X className="size-5" />
                   </button>
                </div>
                <div className="p-4 bg-slate-50 flex items-center justify-center min-h-[400px]">
                   <img src={viewingDoc.url} className="max-h-[70vh] w-auto rounded-2xl shadow-lg border border-slate-200" alt={viewingDoc.title} />
                </div>
                <div className="p-8 flex items-center justify-end gap-4">
                   <button 
                     onClick={() => downloadFile(viewingDoc.url, viewingDoc.title)}
                     className="px-8 py-4 rounded-2xl bg-[#00897B] text-white font-black text-xs uppercase tracking-widest hover:bg-[#00796B] transition-all flex items-center gap-2"
                   >
                      <Download className="size-4" /> Télécharger maintenant
                   </button>
                </div>
             </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Header Section */}
      <div className="relative group">
         <div className="absolute -inset-1 bg-gradient-to-r from-[#00897B] to-emerald-400 rounded-[40px] blur opacity-10 group-hover:opacity-20 transition duration-1000"></div>
         <div className="relative bg-white rounded-[40px] border border-slate-100 shadow-xl p-8 md:p-12 overflow-hidden">
            <div className="flex flex-col md:flex-row items-center gap-10 relative z-10">
               <div className="relative">
                  <div className="absolute -inset-2 bg-gradient-to-tr from-[#00897B] to-transparent rounded-[42px] animate-pulse opacity-20" />
                  <img 
                    src="https://api.dicebear.com/7.x/notionists/svg?seed=Guide&backgroundColor=e2e8f0" 
                    className="size-32 md:size-40 rounded-[36px] bg-slate-50 border-4 border-white shadow-2xl relative" 
                    alt="Profile" 
                  />
                  <div className="absolute -bottom-2 -right-2 size-10 bg-emerald-500 rounded-2xl border-4 border-white shadow-lg flex items-center justify-center text-white">
                     <ShieldCheck className="size-5" />
                  </div>
               </div>
               <div className="flex-1 text-center md:text-left space-y-4">
                  <div className="space-y-1">
                     <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">{userName}</h1>
                     <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                        <span className="px-4 py-1.5 bg-[#00897B] text-white text-[10px] font-black uppercase rounded-xl tracking-[0.2em] shadow-lg shadow-[#00897B]/20">Guide Officiel</span>
                        <span className="flex items-center gap-1.5 text-slate-400 text-xs font-bold">
                           <Award className="size-4 text-emerald-500" /> Partenaire Navito Premium
                        </span>
                     </div>
                  </div>
                  <p className="text-slate-500 font-medium max-w-lg leading-relaxed text-sm">
                     Spécialisé dans l'histoire de la Médina et les randonnées dans l'Atlas. Plus de 10 ans d'expérience au service des voyageurs.
                  </p>
               </div>
               <div className="flex md:flex-col gap-4">
                  <div className="bg-slate-50 p-6 rounded-[32px] border border-slate-100 text-center min-w-[120px]">
                     <p className="text-2xl font-black text-slate-900">4.9</p>
                     <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest mt-1">Note globale</p>
                  </div>
                  <div className="bg-slate-50 p-6 rounded-[32px] border border-slate-100 text-center min-w-[120px]">
                     <p className="text-2xl font-black text-slate-900">128</p>
                     <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest mt-1">Avis clients</p>
                  </div>
               </div>
            </div>
            <div className="absolute top-0 right-0 size-64 bg-[#00897B]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
         <div className="lg:col-span-2 space-y-10">
            <Card className="rounded-[40px] border-0 bg-white shadow-xl shadow-slate-200/50 overflow-hidden">
               <CardHeader className="bg-slate-900 px-10 py-8 text-white flex flex-row justify-between items-center border-none">
                  <h2 className="text-xl font-black tracking-tight">Informations Publiques</h2>
                  {isEditing ? (
                  <button onClick={handleSave} className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#00897B] hover:bg-[#00796b] text-white text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-[#00897B]/20 active:scale-95">
                     <Save className="size-4" /> Enregistrer
                  </button>
                  ) : (
                  <button onClick={() => setIsEditing(true)} className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white text-xs font-black uppercase tracking-widest transition-all active:scale-95">
                     <Edit2 className="size-4" /> Modifier
                  </button>
                  )}
               </CardHeader>
               
               <CardContent className="p-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     {[
                        { key: "phone", label: "Téléphone", val: formData.phone, icon: Phone },
                        { key: "email", label: "E-mail Professionnel", val: formData.email, icon: Mail },
                        { key: "city", label: "Ville Principale", val: formData.city, icon: MapPin },
                        { key: "languages", label: "Langues Parlées", val: formData.languages, icon: Languages },
                        { key: "badge", label: "Badge Ministère", val: formData.badge, icon: Hash },
                     ].map((item) => (
                        <div key={item.key} className="group flex flex-col gap-2 p-6 rounded-[32px] bg-slate-50/50 border border-slate-100 hover:bg-white hover:shadow-xl hover:border-transparent transition-all duration-300">
                           <div className="flex items-center gap-2 text-slate-400 mb-1">
                              <item.icon className="size-4 group-hover:text-[#00897B] transition-colors" />
                              <span className="text-[10px] font-black uppercase tracking-[0.2em]">{item.label}</span>
                           </div>
                           {isEditing ? (
                              <input 
                                 type="text"
                                 value={item.val}
                                 onChange={(e) => setFormData(p => ({...p, [item.key]: e.target.value}))}
                                 className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 focus:ring-4 ring-[#00897B]/5 outline-none transition-all shadow-sm focus:border-[#00897B]/30"
                              />
                           ) : (
                              <span className="text-lg font-black text-slate-900 px-1">{item.val}</span>
                           )}
                        </div>
                     ))}
                  </div>
               </CardContent>
            </Card>

            <Card className="rounded-[40px] border-0 bg-white shadow-xl shadow-slate-200/50 overflow-hidden">
               <CardHeader className="px-10 py-8 border-b border-slate-50 flex flex-row justify-between items-center">
                  <CardTitle className="text-lg font-black flex items-center gap-3">
                     <FileText className="size-5 text-[#00897B]" /> Documents Officiels
                  </CardTitle>
               </CardHeader>
               
               <CardContent className="p-10 space-y-6">
                  {documents.map((doc) => (
                     <div key={doc.id} className="group p-6 rounded-[32px] bg-white border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:shadow-xl hover:border-transparent transition-all duration-500">
                        <div className="flex items-center gap-5">
                           <div className="size-14 rounded-2xl bg-slate-50 text-slate-400 border border-slate-100 flex items-center justify-center shrink-0 group-hover:bg-[#00897B]/10 group-hover:text-[#00897B] transition-colors">
                              <FileText className="size-6" />
                           </div>
                           <div className="space-y-0.5">
                              <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight">{doc.title}</h3>
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Expire le: {doc.expireDate}</p>
                           </div>
                        </div>
                        <div className="flex items-center gap-3">
                           <div className={cn(
                              "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2",
                              doc.status === 'valide' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                           )}>
                              {doc.status === 'valide' ? <Check className="size-3.5" /> : <div className="size-2 bg-amber-500 rounded-full animate-pulse" />}
                              {doc.label}
                           </div>
                           <div className="flex items-center gap-2 pl-2">
                              {doc.status !== 'valide' && (
                                 <button onClick={() => handleUpdateDoc(doc.id)} className="p-3 rounded-xl bg-slate-900 text-white hover:bg-slate-800 transition-all active:scale-95 shadow-lg shadow-slate-900/10">
                                    <TrendingUp className="size-4" />
                                 </button>
                              )}
                              <button 
                                onClick={() => setViewingDoc({title: doc.title, url: doc.url})}
                                className="p-3 rounded-xl bg-slate-50 text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-all"
                              >
                                 <Eye className="size-4" />
                              </button>
                              <button 
                                onClick={() => downloadFile(doc.url, doc.title)}
                                className="p-3 rounded-xl bg-slate-50 text-slate-400 hover:text-[#00897B] hover:bg-[#00897B]/5 transition-all"
                              >
                                 <Download className="size-4" />
                              </button>
                           </div>
                        </div>
                     </div>
                  ))}
               </CardContent>
            </Card>
         </div>

         <div className="space-y-10">
            <div className="bg-slate-900 rounded-[40px] p-8 text-white relative overflow-hidden shadow-2xl">
               <div className="relative z-10 space-y-6">
                  <div className="flex items-center justify-between">
                     <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#00897B]">Performance</span>
                     <TrendingUp className="size-5 text-[#00897B]" />
                  </div>
                  <div className="space-y-1">
                     <p className="text-4xl font-black">98%</p>
                     <p className="text-xs font-bold text-slate-400">Score de satisfaction client</p>
                  </div>
                  <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                     <motion.div 
                       initial={{ width: 0 }}
                       animate={{ width: "98%" }}
                       transition={{ duration: 1.5, ease: "easeOut" }}
                       className="h-full bg-[#00897B] shadow-[0_0_15px_rgba(0,137,123,0.5)]" 
                     />
                  </div>
               </div>
               <div className="absolute -right-20 -bottom-20 size-64 bg-[#00897B]/20 rounded-full blur-[80px]" />
            </div>

            <Card className="rounded-[40px] border-0 bg-white shadow-xl shadow-slate-200/50 overflow-hidden">
               <CardHeader className="px-10 py-8 border-b border-slate-50 space-y-4">
                  <div className="flex items-center justify-between">
                     <CardTitle className="text-lg font-black flex items-center gap-3">
                        <Star className="size-5 text-amber-400 fill-amber-400" /> Avis Clients
                     </CardTitle>
                     <span className="text-sm font-black text-[#00897B]">Voir tout</span>
                  </div>
                  <div className="flex items-center gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                     <span className="text-3xl font-black text-slate-900">4.9</span>
                     <div className="flex -space-x-1 text-amber-400">
                        {[1,2,3,4,5].map((i) => <Star key={i} className="size-4 fill-current" />)}
                     </div>
                  </div>
               </CardHeader>
               
               <CardContent className="p-0">
                  <div className="divide-y divide-slate-50">
                     {[
                        { id: 1, name: "Lucas M.", date: "Il y a 2 jours", rating: 5, comment: "Youssef a été un guide incroyable ! Très passionné." },
                        { id: 2, name: "Sophie & Jean", date: "Semaine dernière", rating: 5, comment: "Parfait de bout en bout. Nous avons beaucoup appris." },
                        { id: 3, name: "Marc D.", date: "Le mois dernier", rating: 4, comment: "Très bonne visite, Youssef connait son sujet." }
                     ].map((review) => (
                        <div key={review.id} className="p-8 hover:bg-slate-50/50 transition-all cursor-pointer group">
                           <div className="flex justify-between items-start mb-4">
                              <div className="flex items-center gap-4">
                                 <div className="size-10 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-xs font-black text-[#00897B] shadow-sm">
                                    {review.name.charAt(0)}
                                 </div>
                                 <div>
                                    <h4 className="text-xs font-black text-slate-900">{review.name}</h4>
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{review.date}</p>
                                 </div>
                              </div>
                              <span className="bg-emerald-50 text-emerald-600 px-2 py-1 rounded-lg text-[9px] font-black">{review.rating}/5</span>
                           </div>
                           <p className="text-xs font-medium text-slate-600 leading-relaxed italic truncate group-hover:whitespace-normal">"{review.comment}"</p>
                        </div>
                     ))}
                  </div>
               </CardContent>
            </Card>
         </div>
      </div>
    </div>
  );
}
