import { Star, MessageCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../app/components/ui/card";

export default function DriverReviews() {
  const reviews = [
    { name: "Jack R.", rating: 5.0, text: "Excellent service! The car was super clean and the driver was very helpful.", seed: "Jack", date: "Oct 8, 2024" },
    { name: "Maria S.", rating: 4.8, text: "Very professional. Arrived exactly on time and knew all the shortcuts.", seed: "Maria", date: "Oct 5, 2024" },
    { name: "Ahmed K.", rating: 5.0, text: "Great conversation and very safe driving. Highly recommended!", seed: "Ahmed", date: "Sep 28, 2024" },
    { name: "Sophie T.", rating: 4.5, text: "Good driving but slightly hard to locate at the train station. Overall good.", seed: "Sophie", date: "Sep 15, 2024" },
    { name: "Omar D.", rating: 5.0, text: "The premium vehicle was flawless.", seed: "Omar", date: "Sep 2, 2024" }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in zoom-in-95 duration-500">
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
         <Card className="rounded-[32px] border-0 bg-[#00897B] text-white shadow-lg shadow-[#00897B]/20 p-8 flex flex-col items-center justify-center text-center">
            <span className="text-[10px] font-black uppercase tracking-widest text-[#00897B] bg-white/20 px-3 py-1 rounded-full mb-4">Note Globale</span>
            <div className="flex items-center gap-2 mb-2">
               <span className="text-5xl font-black">4.9</span>
               <div className="flex flex-col text-white/50">
                  <Star className="size-5 fill-white" />
                  <span className="text-[10px] mt-1 font-bold">/ 5</span>
               </div>
            </div>
            <p className="text-sm font-medium text-white/80 mt-2">Basé sur 124 courses</p>
         </Card>
         
         <div className="md:col-span-2 bg-white rounded-[32px] p-8 shadow-sm border border-slate-100 flex flex-col justify-center">
            <h3 className="text-lg font-black text-slate-900 mb-6">Répartition</h3>
            <div className="space-y-3">
               {[
                 { stars: 5, pct: 85 },
                 { stars: 4, pct: 10 },
                 { stars: 3, pct: 5 },
                 { stars: 2, pct: 0 },
                 { stars: 1, pct: 0 },
               ].map(r => (
                  <div key={r.stars} className="flex items-center gap-4">
                     <span className="text-xs font-black text-slate-500 w-4">{r.stars}</span>
                     <Star className="size-3 text-slate-300 fill-slate-300" />
                     <div className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden">
                        <div className="h-full bg-[#00897B] rounded-full" style={{ width: `${r.pct}%` }} />
                     </div>
                     <span className="text-xs font-bold text-slate-400 w-8 text-right">{r.pct}%</span>
                  </div>
               ))}
            </div>
         </div>
      </div>

      <Card className="rounded-[40px] border-0 bg-white shadow-sm overflow-hidden">
        <CardHeader className="pb-4 pt-8 px-10 border-b border-slate-50 flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-3">
             <MessageCircle className="size-5 text-[#00897B]" /> Commentes Récents
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
           <div className="divide-y divide-slate-50">
             {reviews.map((review, i) => (
               <div key={i} className="p-8 px-10 group hover:bg-slate-50 transition-colors">
                 <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-4">
                       <img src={`https://api.dicebear.com/7.x/notionists/svg?seed=${review.seed}`} className="size-12 rounded-2xl bg-white shadow-sm border border-slate-200" alt="Avatar" />
                       <div>
                          <span className="block text-sm font-bold text-slate-900">{review.name}</span>
                          <span className="block text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">{review.date}</span>
                       </div>
                    </div>
                    <div className="flex items-center gap-1 text-[#00897B] bg-[#00897B]/10 px-3 py-1.5 rounded-xl">
                      <Star className="size-3 fill-[#00897B]" />
                      <span className="text-xs font-black">{review.rating}</span>
                    </div>
                 </div>
                 <p className="text-sm text-slate-600 font-medium leading-relaxed max-w-3xl ml-16">&ldquo;{review.text}&rdquo;</p>
               </div>
             ))}
           </div>
        </CardContent>
      </Card>
      
    </div>
  );
}
