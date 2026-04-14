import { useEffect, useState } from 'react';
import { ShieldCheck, Phone, Car, MapPin, Camera, FileText, CheckCircle2, User, Mail, Calendar, Hash, CreditCard, Edit2, Save, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import DriverShell from '../../pages/dashboards/components/DriverShell';
import { Switch } from '../../app/components/ui/switch';

export default function DriverProfile() {
  const navigate = useNavigate();
  const { authMode, driverProfile, driverVerificationStatus } = useAppContext();
  const [isOnline, setIsOnline] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [showToast, setShowToast] = useState(false);
  
  const [formData, setFormData] = useState({
     phone: "+212 661 123 456",
     email: "s.alami@navito.ma",
     city: "Marrakech",
     vehicleType: "Berline Luxe",
     plate: "11-A-4432",
     paymentMethod: "Virement Bancaire (RIB)"
  });

  useEffect(() => {
    if (authMode !== 'login') {
      navigate('/login?redirectTo=/driver/profile', { replace: true });
      return;
    }
    if (!driverProfile) {
      navigate('/driver/join', { replace: true });
    }
  }, [authMode, driverProfile, navigate]);

  if (!driverProfile) return null;

  const personalInfo = [
    { key: "phone", label: "Téléphone", value: formData.phone, icon: Phone, editable: true },
    { key: "email", label: "E-mail Professionnel", value: formData.email, icon: Mail, editable: true },
    { key: "city", label: "Ville / Région", value: formData.city, icon: MapPin, editable: true },
    { key: "vehicleType", label: "Type de Véhicule", value: formData.vehicleType, icon: Car, editable: true },
    { key: "plate", label: "Immatriculation", value: formData.plate, icon: Hash, editable: true },
    { key: "date", label: "Date d'inscription", value: "12/01/2026", icon: Calendar, editable: false },
    { key: "paymentMethod", label: "Méthode de Paiement", value: formData.paymentMethod, icon: CreditCard, editable: true },
  ];

  return (
    <DriverShell>
      <div className="h-full w-full bg-[#F8FAFC] overflow-y-auto px-10 pb-20">
         
         <div className="max-w-6xl mx-auto space-y-12 pt-10 relative">
            
            {showToast && (
              <div className="absolute top-0 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-top-4 duration-300 pointer-events-none">
                 <div className="flex items-center gap-2 px-6 py-3 rounded-full bg-slate-900 text-white shadow-2xl border border-slate-700">
                    <Check className="size-4 text-emerald-400" />
                    <span className="text-xs font-black uppercase tracking-widest">Modifications enregistrées !</span>
                 </div>
              </div>
            )}
            
            {/* Header Section */}
            <div className="flex justify-between items-center bg-white p-8 rounded-[35px] shadow-sm border border-slate-100">
               <div className="flex items-center gap-6">
                  <div className="relative">
                    <img src="https://api.dicebear.com/7.x/notionists/svg?seed=youssef" className="size-24 rounded-3xl bg-slate-50 border-4 border-white shadow-xl" alt="Driver Avatar" />
                    <div className="absolute -bottom-1 -right-1 size-8 bg-blue-600 rounded-xl flex items-center justify-center text-white border-2 border-white shadow-lg">
                       <Camera className="size-4" />
                    </div>
                  </div>
                  <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">{driverProfile.fullName || "Samrat Alami"}</h1>
                    <div className="flex items-center gap-2 mt-1">
                       <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase rounded-lg tracking-widest border border-emerald-100">CHAUFFEUR CERTIFIÉ</span>
                       <span className="text-slate-400 text-xs font-bold">• ID #8849-MA</span>
                    </div>
                  </div>
               </div>
               
               <div className="flex items-center gap-4 bg-slate-50 p-3 rounded-2xl border border-slate-100 shadow-inner">
                  <div className="flex flex-col items-end px-2">
                     <span className={`text-[10px] font-black uppercase tracking-widest ${isOnline ? 'text-emerald-500' : 'text-slate-400'}`}>
                        {isOnline ? 'En ligne' : 'Hors ligne'}
                     </span>
                     <span className="text-[9px] font-bold text-slate-300">Statut Actuel</span>
                  </div>
                  <Switch checked={isOnline} onCheckedChange={setIsOnline} className="data-[state=checked]:bg-emerald-500" />
               </div>
            </div>

            <div className="grid grid-cols-12 gap-10">
               
               <div className="col-span-12 lg:col-span-8 bg-white rounded-[40px] shadow-sm border border-slate-100 overflow-hidden">
                  <div className="bg-slate-900 px-10 py-6 text-white flex justify-between items-center">
                     <h2 className="text-lg font-black tracking-tight uppercase">Informations Personnelles</h2>
                     {isEditing ? (
                       <button onClick={() => { setIsEditing(false); setShowToast(true); setTimeout(() => setShowToast(false), 3000); }} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-500 hover:bg-blue-600 text-white text-xs font-black uppercase tracking-widest transition-colors shadow-lg shadow-blue-500/20 active:scale-95">
                          <Save className="size-4" /> Enregistrer
                       </button>
                     ) : (
                       <button onClick={() => setIsEditing(true)} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-black uppercase tracking-widest transition-colors">
                          <Edit2 className="size-4" /> Modifier
                       </button>
                     )}
                  </div>
                  
                  <div className="p-10">
                     <div className="grid grid-cols-1 gap-y-1">
                        {personalInfo.map((info, idx) => (
                          <div key={idx} className="flex items-center group hover:bg-slate-50 transition-colors rounded-2xl overflow-hidden p-2 min-h-[4rem]">
                             <div className="w-1/3 flex items-center gap-3 px-6 border-r border-slate-50">
                                <info.icon className="size-4 text-slate-300 group-hover:text-blue-500 transition-colors" />
                                <span className="text-xs font-black text-slate-400 uppercase tracking-widest">{info.label}</span>
                             </div>
                             <div className="flex-1 px-8">
                                {isEditing && info.editable ? (
                                   <input 
                                     type="text" 
                                     value={info.value} 
                                     onChange={(e) => setFormData(prev => ({ ...prev, [info.key]: e.target.value }))}
                                     className="w-full h-10 px-4 rounded-xl bg-slate-50 border border-slate-200 text-sm font-black text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all"
                                   />
                                ) : (
                                   <span className="text-sm font-black text-slate-800 tracking-tight">{info.value}</span>
                                )}
                             </div>
                          </div>
                        ))}
                     </div>
                  </div>
               </div>

               {/* Side Panel - Documents & Quick Stats */}
               <div className="col-span-12 lg:col-span-4 space-y-8">
                  <div className="bg-white p-8 rounded-[40px] shadow-sm border border-slate-100">
                     <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-8">Documents Stockés</h3>
                     <div className="space-y-4">
                        {[
                          { name: "Permis de conduire", status: "Validé" },
                          { name: "Carte CIN", status: "Validé" },
                          { name: "Assurance Professionnelle", status: "Validé" },
                          { name: "Contrôle Technique", status: "En attente" },
                        ].map((doc, i) => (
                           <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100/50">
                              <div className="flex items-center gap-3">
                                 <FileText className="size-4 text-slate-300" />
                                 <span className="text-[11px] font-black text-slate-700">{doc.name}</span>
                              </div>
                              {doc.status === "Validé" ? (
                                 <CheckCircle2 className="size-4 text-emerald-500" />
                              ) : (
                                 <div className="size-2 bg-amber-400 rounded-full animate-pulse" />
                              )}
                           </div>
                        ))}
                     </div>
                  </div>

                  <div className="bg-gradient-to-br from-blue-600 to-indigo-800 p-8 rounded-[40px] shadow-xl shadow-blue-600/20 text-white relative overflow-hidden group">
                     <div className="absolute -right-8 -top-8 size-32 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
                     <div className="relative z-10">
                        <div className="size-12 bg-white/20 rounded-2xl flex items-center justify-center mb-6">
                           <ShieldCheck className="size-7" />
                        </div>
                        <h4 className="text-lg font-black mb-2">Compte Sécurisé</h4>
                        <p className="text-xs text-blue-100 font-bold leading-relaxed">
                           Vos données sont stockées conformément aux protocoles de sécurité Navito et ne peuvent pas être modifiées sans validation de l'administrateur.
                        </p>
                     </div>
                  </div>
               </div>
            </div>

         </div>
      </div>
    </DriverShell>
  );
}
