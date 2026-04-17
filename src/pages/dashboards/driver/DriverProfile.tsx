import { useState } from "react";
import { Edit2, Save, Phone, Mail, Car, MapPin, Hash, Check, FileText, Upload, AlertCircle, ShieldCheck, X } from "lucide-react";
import { Card, CardContent } from "../../../app/components/ui/card";
import { cn } from "../../../app/components/ui/utils";
export default function DriverProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const [formData, setFormData] = useState({
     phone: "+212 661 123 456",
     email: "s.alami@navito.ma",
     city: "Casablanca, Maroc",
     vehicleType: "Berline Luxe",
     plate: "11-A-4432",
  });

  const [documents, setDocuments] = useState([
    { id: 1, title: "Permis de conduire", status: "valide", label: "Validé", expireDate: "12 Oct 2028", colorClass: "text-[#00897B] bg-[#E0F2F1] border-transparent" },
    { id: 2, title: "Carte CIN", status: "valide", label: "Validé", expireDate: "05 Jan 2030", colorClass: "text-[#00897B] bg-[#E0F2F1] border-transparent" },
    { id: 3, title: "Assurance Professionnelle", status: "valide", label: "Validé", expireDate: "20 Oct 2024", colorClass: "text-[#00897B] bg-[#E0F2F1] border-transparent" },
    { id: 4, title: "Contrôle Technique", status: "expire", label: "En attente", expireDate: "1 Sep 2024", colorClass: "text-amber-600 bg-amber-50 border-transparent" },
  ]);

  const handleSave = () => {
     setIsEditing(false);
     setShowToast(true);
     setTimeout(() => setShowToast(false), 3000);
  };



  const handleUpdateDoc = (id: number) => {
    setDocuments(prev => prev.map(doc => {
      if (doc.id === id) {
        return { ...doc, status: "valide", label: "Validé", expireDate: "12 Oct 2029", colorClass: "text-emerald-700 bg-emerald-50 border-emerald-200" };
      }
      return doc;
    }));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in zoom-in-95 duration-500 relative">
      
      {showToast && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-top-4 duration-300 pointer-events-none">
           <div className="flex items-center gap-2 px-6 py-3 rounded-full bg-slate-900 text-white shadow-2xl border border-slate-700">
              <Check className="size-4 text-emerald-400" />
              <span className="text-xs font-black uppercase tracking-widest">Modifications enregistrées !</span>
           </div>
        </div>
      )}

      {/* Hero Section */}
      <div className="bg-white rounded-[40px] p-8 shadow-sm border border-slate-100 flex items-center justify-between">
         <div className="flex items-center gap-6">
            <img src="https://api.dicebear.com/7.x/notionists/svg?seed=Samrat" className="size-24 rounded-[32px] bg-slate-50 border-4 border-white shadow-lg" alt="Profile" />
            <div>
               <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Samrat Alami</h1>
               <div className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-[#00897B]/10 text-[#00897B] text-[10px] font-black uppercase rounded-lg tracking-widest">Chauffeur Premium</span>
                  <span className="text-slate-400 text-xs font-bold">• ID #8849-MA</span>
               </div>
            </div>
         </div>
      </div>

      <Card className="rounded-[40px] border-0 bg-white shadow-sm overflow-hidden">
         <div className="bg-slate-900 px-10 py-8 text-white flex justify-between items-center">
            <h2 className="text-xl font-black tracking-tight">Informations Publiques</h2>
            {isEditing ? (
              <button onClick={handleSave} className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#00897B] hover:bg-[#00796b] text-white text-xs font-black uppercase tracking-widest transition-colors shadow-lg shadow-[#00897B]/20 active:scale-95">
                 <Save className="size-4" /> Enregistrer
              </button>
            ) : (
              <button onClick={() => setIsEditing(true)} className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white text-xs font-black uppercase tracking-widest transition-colors">
                 <Edit2 className="size-4" /> Modifier
              </button>
            )}
         </div>
         
         <CardContent className="p-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               {[
                  { key: "phone", label: "Téléphone", val: formData.phone, icon: Phone },
                  { key: "email", label: "E-mail Professionnel", val: formData.email, icon: Mail },
                  { key: "city", label: "Ville Principale", val: formData.city, icon: MapPin },
                  { key: "vehicleType", label: "Type de Véhicule", val: formData.vehicleType, icon: Car },
                  { key: "plate", label: "Immatriculation", val: formData.plate, icon: Hash },
               ].map((item) => (
                  <div key={item.key} className="flex flex-col gap-2 p-4 rounded-3xl bg-slate-50/50 border border-slate-100 hover:bg-slate-50 transition-colors">
                     <div className="flex items-center gap-2 text-slate-400 mb-1">
                        <item.icon className="size-4" />
                        <span className="text-[10px] font-black uppercase tracking-widest">{item.label}</span>
                     </div>
                     {isEditing ? (
                        <input 
                           type="text"
                           value={item.val}
                           onChange={(e) => setFormData(p => ({...p, [item.key]: e.target.value}))}
                           className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 focus:ring-2 ring-[#00897B]/20 outline-none transition-all shadow-sm focus:border-[#00897B]/40"
                        />
                     ) : (
                        <span className="text-lg font-bold text-slate-900 px-2">{item.val}</span>
                     )}
                  </div>
               ))}
            </div>
         </CardContent>
      </Card>

      {/* Documents Section */}
      <Card className="rounded-[40px] border-0 bg-white shadow-sm overflow-hidden mb-8">
         <div className="bg-slate-50 px-10 py-8 border-b border-slate-100 flex justify-between items-center">
            <h2 className="text-xl font-black tracking-tight text-slate-900 flex items-center gap-3">
               <FileText className="size-6 text-[#00897B]" /> Documents Administratifs
            </h2>
         </div>
         
         <CardContent className="p-10">
            <div className="space-y-4">
               {documents.map((doc) => (
                  <div key={doc.id} className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-6 rounded-[2rem] bg-white border border-slate-100 shadow-sm hover:border-slate-200 transition-colors">
                      <div className="flex items-center gap-5">
                        <div className="size-12 rounded-2xl flex items-center justify-center shrink-0 bg-slate-50 text-slate-400 border border-slate-100">
                           <FileText className="size-5" />
                        </div>
                        <div>
                           <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight">{doc.title}</h3>
                        </div>
                     </div>
                     <div className="flex items-center gap-4">
                        {doc.status === 'valide' ? (
                           <div className="flex size-7 items-center justify-center rounded-full bg-[#E0F2F1] text-[#00897B]">
                              <Check className="size-4" />
                           </div>
                        ) : (
                           <div className="flex size-7 items-center justify-center rounded-full bg-amber-50 text-amber-500">
                              <div className="size-2 rounded-full bg-amber-500 animate-pulse" />
                           </div>
                        )}
                        {doc.status !== 'valide' && (
                           <button onClick={() => { handleUpdateDoc(doc.id); setShowToast(true); setTimeout(() => setShowToast(false), 3000); }} className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-[10px] font-black uppercase tracking-widest transition-transform active:scale-95">
                              Envoi
                           </button>
                        )}
                     </div>
                  </div>
               ))}
            </div>
         </CardContent>
      </Card>



    </div>
  );
}
