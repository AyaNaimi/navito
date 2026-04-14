import { Phone, ShieldAlert, AlertTriangle, Info, ChevronRight, ArrowRight, ShieldCheck, HeartPulse, Zap, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import BottomNav from '../components/BottomNav';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { emergencyNumbers, antiScamTips, referencePrices, commonPhrases } from '../data/mockData';

const reveal = {
  initial: { opacity: 0, y: 15 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
};

export default function Safety() {
  const handleCall = (number: string) => {
    window.location.href = `tel:${number}`;
  };

  return (
    <div className="min-h-screen w-full bg-background flex flex-col pb-32 font-sans antialiased text-foreground overflow-x-hidden transition-colors duration-500">
      {/* Ambient Background */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-[10%] -left-[10%] w-[50%] h-[50%] rounded-full bg-accent/[0.05] blur-[120px]" />
        <div className="absolute bottom-[20%] -right-[10%] w-[40%] h-[40%] rounded-full bg-primary/[0.05] blur-[100px]" />
      </div>

      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-50 bg-background/80 backdrop-blur-2xl border-b border-border px-6 py-10"
      >
        <div className="max-w-xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black tracking-tight uppercase italic underline decoration-rose-500 decoration-4">Protocols</h1>
            <p className="text-[10px] font-black text-rose-500 uppercase tracking-[0.3em] mt-3 flex items-center gap-2">
               <ShieldAlert className="h-3 w-3" />
               Security & Integrity
            </p>
          </div>
          <div className="h-12 w-12 rounded-2xl bg-secondary border border-border flex items-center justify-center text-rose-500 shadow-2xl shadow-rose-500/10">
            <ShieldCheck className="h-6 w-6" />
          </div>
        </div>
      </motion.header>

      <main className="flex-1 max-w-xl mx-auto w-full">
        <Tabs defaultValue="emergency" className="w-full">
          <div className="px-6 pt-10">
            <TabsList className="grid w-full grid-cols-4 h-14 rounded-2xl bg-secondary border border-border p-2 backdrop-blur-xl">
              <TabsTrigger value="emergency" className="rounded-xl text-[9px] font-black uppercase tracking-widest transition-all data-[state=active]:bg-foreground data-[state=active]:text-background shadow-2xl">Help</TabsTrigger>
              <TabsTrigger value="scams" className="rounded-xl text-[9px] font-black uppercase tracking-widest transition-all data-[state=active]:bg-foreground data-[state=active]:text-background shadow-2xl">Alerts</TabsTrigger>
              <TabsTrigger value="prices" className="rounded-xl text-[9px] font-black uppercase tracking-widest transition-all data-[state=active]:bg-foreground data-[state=active]:text-background shadow-2xl">Rates</TabsTrigger>
              <TabsTrigger value="phrases" className="rounded-xl text-[9px] font-black uppercase tracking-widest transition-all data-[state=active]:bg-foreground data-[state=active]:text-background shadow-2xl">Talk</TabsTrigger>
            </TabsList>
          </div>

          <AnimatePresence mode="wait">
            {/* Emergency Numbers */}
            <TabsContent value="emergency" className="px-6 py-10 outline-none space-y-10">
              <motion.div {...reveal} className="bg-card border border-border p-8 rounded-[2.5rem] shadow-2xl backdrop-blur-xl">
                <div className="flex items-start gap-6">
                  <div className="h-12 w-12 rounded-2xl bg-rose-500/10 border border-rose-500/10 flex items-center justify-center shrink-0">
                    <HeartPulse className="h-6 w-6 text-rose-500" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-[16px] font-black text-foreground uppercase tracking-tight italic">Rapid Response Network</h3>
                    <p className="text-[13px] leading-relaxed text-muted-foreground font-medium">
                      Operational 24/7. Immediate connection to national enforcement and medical dispatch.
                    </p>
                  </div>
                </div>
              </motion.div>

              <div className="space-y-4">
                <p className="text-[10px] font-black uppercase tracking-[0.25em] text-muted-foreground ml-1">Universal Channels</p>
                {emergencyNumbers.map((emergency, index) => (
                  <motion.div
                    key={index}
                    {...reveal}
                    transition={{ delay: index * 0.05 }}
                    className="bg-card border border-border rounded-[2.5rem] p-6 shadow-2xl group hover:border-rose-500/20 transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-6">
                        <div className="w-14 h-14 bg-secondary border border-border rounded-2xl flex items-center justify-center transition-all group-hover:rotate-12 group-hover:bg-foreground group-hover:text-background font-black">
                          <ShieldCheck className="h-6 w-6" />
                        </div>
                        <div>
                          <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-1">{emergency.service}</h3>
                          <p className="text-2xl font-black text-foreground tracking-widest tabular-nums">{emergency.number}</p>
                        </div>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleCall(emergency.number)}
                        className="bg-secondary hover:bg-rose-500 h-14 w-14 rounded-2xl flex items-center justify-center text-foreground hover:text-white transition-all shadow-2xl border border-border"
                      >
                        <Phone className="h-5 w-5 fill-current" />
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="bg-secondary/30 border border-border p-8 rounded-[2.5rem]">
                <div className="flex items-start gap-4">
                  <Info className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                  <div className="text-[13px] text-muted-foreground font-medium leading-relaxed">
                    <p className="font-black text-foreground mb-3 uppercase tracking-widest text-[10px] flex items-center gap-2 italic">
                       <Sparkles className="h-3 w-3 text-accent" /> Dispatch Protocol:
                    </p>
                    <ul className="space-y-3">
                      <li className="flex gap-3">
                        <span className="h-1.5 w-1.5 rounded-full bg-border mt-2 shrink-0" />
                        Multilingual support: Arabic, French, and English
                      </li>
                      <li className="flex gap-3">
                        <span className="h-1.5 w-1.5 rounded-full bg-border mt-2 shrink-0" />
                        Public assistance lines are 100% toll-free
                      </li>
                      <li className="flex gap-3">
                        <span className="h-1.5 w-1.5 rounded-full bg-border mt-2 shrink-0" />
                        Enable high-precision GPS for faster response
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Anti-Scam Guide */}
            <TabsContent value="scams" className="px-6 py-10 outline-none space-y-10">
              <motion.div {...reveal} className="bg-card border border-border p-8 rounded-[2.5rem] shadow-2xl">
                <h3 className="text-[16px] font-black text-foreground uppercase tracking-tighter italic">Risk Mitigation</h3>
                <p className="text-[13px] leading-relaxed text-muted-foreground font-medium mt-3">
                  Identifying common market deviations to maintain travel integrity.
                </p>
              </motion.div>

              <div className="space-y-4">
                {antiScamTips.map((tip, idx) => (
                  <motion.div
                    key={tip.id}
                    {...reveal}
                    transition={{ delay: idx * 0.05 }}
                    className="bg-card border border-border rounded-[2.5rem] p-8 shadow-2xl group hover:border-accent/20 transition-all font-sans"
                  >
                    <div className="flex items-start gap-6">
                      <div className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center shrink-0 border border-border group-hover:bg-foreground group-hover:text-background transition-all">
                        <AlertTriangle className={`h-5 w-5 ${tip.severity === 'high' ? 'text-rose-500 group-hover:text-rose-400' : 'text-accent'}`} />
                      </div>
                      <div className="flex-1 space-y-3">
                        <div className="flex items-center justify-between">
                          <h3 className="text-[15px] font-black text-foreground uppercase tracking-tight italic">{tip.title}</h3>
                          <span className={`text-[9px] font-black px-3 py-1 rounded-xl border ${
                            tip.severity === 'high' ? 'border-rose-500/20 bg-rose-500/10 text-rose-500' : 'border-accent/20 bg-accent/10 text-accent'
                          } uppercase tracking-widest`}>
                            {tip.severity}
                          </span>
                        </div>
                        <p className="text-[13px] text-muted-foreground font-medium leading-relaxed">{tip.description}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            {/* Reference Prices */}
            <TabsContent value="prices" className="px-6 py-10 outline-none space-y-12">
              <motion.div {...reveal} className="bg-card border border-border p-8 rounded-[2.5rem] shadow-2xl">
                <h3 className="text-[16px] font-black text-foreground uppercase tracking-tighter italic">Market Indices</h3>
                <p className="text-[13px] leading-relaxed text-muted-foreground font-medium mt-3">
                  Benchmark rates for daily essentials based on current local indexed data.
                </p>
              </motion.div>

              {['Beverages', 'Food', 'Transport', 'Souvenirs'].map((category) => (
                <div key={category} className="space-y-6 px-1">
                  <div className="flex items-center gap-3">
                    <span className="h-1 w-6 bg-accent rounded-full" />
                    <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-muted-foreground">{category}</h3>
                  </div>
                  <div className="grid grid-cols-1 gap-3">
                    {referencePrices
                      .filter((p) => p.category === category)
                      .map((price, index) => (
                        <div
                          key={index}
                          className="bg-card border border-border rounded-2xl px-6 py-4 flex items-center justify-between hover:bg-muted transition-all"
                        >
                          <span className="text-[14px] font-black text-foreground uppercase tracking-tight">{price.item}</span>
                          <span className="text-[14px] font-black text-accent tabular-nums uppercase">{price.price}</span>
                        </div>
                      ))}
                  </div>
                </div>
              ))}
            </TabsContent>

            {/* Common Phrases */}
            <TabsContent value="phrases" className="px-6 py-10 outline-none space-y-8">
              <motion.div {...reveal} className="bg-card border border-border p-8 rounded-[2.5rem] shadow-2xl mb-8">
                <h3 className="text-[16px] font-black text-foreground uppercase tracking-tighter italic">Linguistic Protocols</h3>
                <p className="text-[13px] leading-relaxed text-muted-foreground font-medium mt-3">
                  Essential Darija and Arabic markers for localized interaction sectors.
                </p>
              </motion.div>

              <div className="space-y-6">
                {commonPhrases.map((phrase, index) => (
                  <motion.div
                    key={index}
                    {...reveal}
                    transition={{ delay: index * 0.05 }}
                    className="bg-card border border-border rounded-[2.5rem] p-8 shadow-2xl group hover:border-accent/10 transition-all"
                  >
                    <div className="space-y-6">
                      <div>
                        <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest mb-2">Pivot Translation</p>
                        <p className="text-xl font-black text-foreground group-hover:text-accent transition-colors uppercase tracking-tight italic">{phrase.english}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-8 pt-6 border-t border-border">
                        <div className="space-y-2">
                          <p className="text-[10px] text-muted-foreground/60 font-black uppercase tracking-widest mb-1 italic">Darija</p>
                          <p className="text-[15px] font-black text-foreground tracking-tight">{phrase.darija}</p>
                        </div>
                        <div className="text-right space-y-2">
                          <p className="text-[10px] text-muted-foreground/60 font-black uppercase tracking-widest mb-1 italic">Arabic</p>
                          <p className="text-[18px] font-black text-foreground" dir="rtl">{phrase.arabic}</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </TabsContent>
          </AnimatePresence>
        </Tabs>
      </main>

      <BottomNav />
    </div>
  );
}
