import { Phone, ShieldAlert, AlertTriangle, Info, ChevronRight, ArrowRight, ShieldCheck, HeartPulse } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import BottomNav from '../components/BottomNav';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { emergencyNumbers, antiScamTips, referencePrices, commonPhrases } from '../data/mockData';

const reveal = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: [0.23, 1, 0.32, 1] },
};

export default function Safety() {
  const handleCall = (number: string) => {
    window.location.href = `tel:${number}`;
  };

  return (
    <div className="min-h-screen w-full bg-[#FAFAFA] flex flex-col pb-24 font-['Inter',sans-serif] antialiased selection:bg-black selection:text-white">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-50 border-b border-[#F0F0F0] bg-white/80 backdrop-blur-xl"
      >
        <div className="px-6 py-5">
          <h1 className="text-[22px] font-bold tracking-tight text-[#171717]">Safety & Protocols</h1>
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#737373] mt-1">
            Global standard assistance & security
          </p>
        </div>
      </motion.header>

      <main className="flex-1 overflow-auto">
        <Tabs defaultValue="emergency" className="w-full">
          <div className="px-6 pt-6">
            <TabsList className="grid w-full grid-cols-4 h-10 rounded-full bg-[#F5F5F7] p-1 border border-[#E5E5E5]">
              <TabsTrigger value="emergency" className="rounded-full text-[10px] font-bold uppercase tracking-wider transition-all data-[state=active]:bg-white data-[state=active]:text-[#171717] data-[state=active]:shadow-sm">Help</TabsTrigger>
              <TabsTrigger value="scams" className="rounded-full text-[10px] font-bold uppercase tracking-wider transition-all data-[state=active]:bg-white data-[state=active]:text-[#171717] data-[state=active]:shadow-sm">Alerts</TabsTrigger>
              <TabsTrigger value="prices" className="rounded-full text-[10px] font-bold uppercase tracking-wider transition-all data-[state=active]:bg-white data-[state=active]:text-[#171717] data-[state=active]:shadow-sm">Rates</TabsTrigger>
              <TabsTrigger value="phrases" className="rounded-full text-[10px] font-bold uppercase tracking-wider transition-all data-[state=active]:bg-white data-[state=active]:text-[#171717] data-[state=active]:shadow-sm">Speak</TabsTrigger>
            </TabsList>
          </div>

          {/* Emergency Numbers */}
          <TabsContent value="emergency" className="px-6 py-8 outline-none space-y-8 max-w-xl mx-auto w-full">
            <motion.div {...reveal} className="bg-white border border-[#E5E5E5] p-6 rounded-2xl shadow-sm">
              <div className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-full bg-[#FEF2F2] border border-[#FEE2E2] flex items-center justify-center shrink-0">
                  <HeartPulse className="h-4 w-4 text-[#EF4444]" />
                </div>
                <div>
                  <h3 className="text-[15px] font-bold text-[#171717] mb-1">Instant Response</h3>
                  <p className="text-[12px] leading-relaxed text-[#737373] font-medium">
                    National emergency services are operational 24/7. These direct lines bridge immediate assistance requirements.
                  </p>
                </div>
              </div>
            </motion.div>

            <div className="space-y-4">
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#737373] ml-1">Universal Channels</p>
              {emergencyNumbers.map((emergency, index) => (
                <motion.div
                  key={index}
                  {...reveal}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white border border-[#E5E5E5] rounded-2xl p-5 shadow-sm group hover:shadow-md transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-[#F5F5F7] border border-[#E5E5E5] rounded-full flex items-center justify-center grayscale-[10%] group-hover:grayscale-0 transition-all">
                        <ShieldCheck className="h-5 w-5 text-[#171717]" />
                      </div>
                      <div>
                        <h3 className="text-[13px] font-bold text-[#737373] uppercase tracking-wider">{emergency.service}</h3>
                        <p className="text-[20px] font-bold text-[#171717] tracking-tighter">{emergency.number}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleCall(emergency.number)}
                      className="bg-[#171717] hover:opacity-90 h-11 w-11 rounded-full flex items-center justify-center text-white transition-all active:scale-95 shadow-lg shadow-black/10"
                    >
                      <Phone className="h-4 w-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="bg-[#F5F5F7] border border-[#E5E5E5] p-5 rounded-2xl">
              <div className="flex items-start gap-3">
                <Info className="h-4 w-4 text-[#171717] shrink-0 mt-0.5" />
                <div className="text-[12px] text-[#737373] font-medium leading-relaxed">
                  <p className="font-bold text-[#171717] mb-2 uppercase tracking-widest text-[9px]">Critical Metadata:</p>
                  <ul className="space-y-2">
                    <li className="flex gap-2"><span>•</span> Communication available in Arabic, French, and English</li>
                    <li className="flex gap-2"><span>•</span> Public assistance lines are toll-free nationwide</li>
                    <li className="flex gap-2"><span>•</span> Retain localized coordinates for dispatcher precision</li>
                  </ul>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Anti-Scam Guide */}
          <TabsContent value="scams" className="px-6 py-8 outline-none space-y-8 max-w-xl mx-auto w-full">
            <motion.div {...reveal} className="bg-white border border-[#E5E5E5] p-6 rounded-2xl shadow-sm">
              <h3 className="text-[15px] font-bold text-[#171717] mb-1">Alert Awareness</h3>
              <p className="text-[12px] leading-relaxed text-[#737373] font-medium">
                Identifying common market deviations helps maintain travel integrity.
              </p>
            </motion.div>

            <div className="space-y-4">
              {antiScamTips.map((tip, idx) => (
                <motion.div
                  key={tip.id}
                  {...reveal}
                  transition={{ delay: idx * 0.05 }}
                  className="bg-white border border-[#E5E5E5] rounded-2xl p-5 shadow-sm"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-9 h-9 rounded-full bg-[#F5F5F7] flex items-center justify-center shrink-0 border border-[#E5E5E5]">
                      <AlertTriangle className={`h-4 w-4 ${tip.severity === 'high' ? 'text-red-500' : 'text-[#171717]'}`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-[14px] font-bold text-[#171717]">{tip.title}</h3>
                        <span className={`text-[8px] font-bold px-2 py-0.5 rounded-full border ${
                          tip.severity === 'high' ? 'border-red-100 bg-red-50 text-red-600' : 'border-[#E5E5E5] bg-[#F5F5F7] text-[#737373]'
                        } uppercase tracking-widest`}>
                          {tip.severity}
                        </span>
                      </div>
                      <p className="text-[12px] text-[#737373] font-medium leading-relaxed">{tip.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* Reference Prices */}
          <TabsContent value="prices" className="px-6 py-8 outline-none space-y-10 max-w-xl mx-auto w-full">
            <motion.div {...reveal} className="bg-white border border-[#E5E5E5] p-6 rounded-2xl shadow-sm">
              <h3 className="text-[15px] font-bold text-[#171717] mb-1">Value Benchmarks</h3>
              <p className="text-[12px] leading-relaxed text-[#737373] font-medium">
                Standard price points for daily essentials based on indexed market data.
              </p>
            </motion.div>

            {['Beverages', 'Food', 'Transport', 'Souvenirs'].map((category) => (
              <div key={category} className="space-y-4">
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-[#737373] ml-1">{category}</h3>
                <div className="grid grid-cols-1 gap-3">
                  {referencePrices
                    .filter((p) => p.category === category)
                    .map((price, index) => (
                      <div
                        key={index}
                        className="bg-white border border-[#E5E5E5] rounded-xl px-4 py-3 flex items-center justify-between"
                      >
                        <span className="text-[13px] font-medium text-[#171717]">{price.item}</span>
                        <span className="text-[13px] font-bold text-[#171717]">{price.price}</span>
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </TabsContent>

          {/* Common Phrases */}
          <TabsContent value="phrases" className="px-6 py-8 outline-none space-y-6 max-w-xl mx-auto w-full">
            <motion.div {...reveal} className="bg-white border border-[#E5E5E5] p-6 rounded-2xl shadow-sm mb-4">
              <h3 className="text-[15px] font-bold text-[#171717] mb-1">Local Dialogue</h3>
              <p className="text-[12px] leading-relaxed text-[#737373] font-medium">
                Essential Darija and Arabic linguistic markers for fluid social interaction.
              </p>
            </motion.div>

            <div className="space-y-4">
              {commonPhrases.map((phrase, index) => (
                <motion.div
                  key={index}
                  {...reveal}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white border border-[#E5E5E5] rounded-2xl p-5 shadow-sm group"
                >
                  <div className="space-y-4">
                    <div>
                      <p className="text-[9px] text-[#A3A3A3] font-bold uppercase tracking-widest mb-1">English</p>
                      <p className="text-[15px] font-bold text-[#171717]">{phrase.english}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-6 pt-3 border-t border-[#F5F5F7]">
                      <div>
                        <p className="text-[9px] text-[#A3A3A3] font-bold uppercase tracking-widest mb-1">Darija</p>
                        <p className="text-[14px] font-bold text-[#171717]">{phrase.darija}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[9px] text-[#A3A3A3] font-bold uppercase tracking-widest mb-1">Arabic</p>
                        <p className="text-[16px] font-bold text-[#171717]" dir="rtl">{phrase.arabic}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>

      <BottomNav />
    </div>
  );
}
