import BottomNav from '../components/BottomNav';
import { Phone, ShieldAlert, AlertTriangle, Info, CreditCard, Languages, Copy, Check, Clock, MapPin, AlertCircle, TrendingUp, UtensilsCrossed, Car, Gift, Loader2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { referencePrices, commonPhrases } from '../data/mockData';
import { motion } from 'motion/react';
import { useState, useEffect } from 'react';
import { fetchEmergencyContacts, fetchScamReports, ApiEmergencyContact, ApiScamReport } from '../services/api';

export default function Safety() {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [emergencyContacts, setEmergencyContacts] = useState<ApiEmergencyContact[]>([]);
  const [scamReports, setScamReports] = useState<ApiScamReport[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [emergencyRes, scamRes] = await Promise.all([
          fetchEmergencyContacts(),
          fetchScamReports()
        ]);
        if (emergencyRes.data) setEmergencyContacts(emergencyRes.data);
        if (scamRes.data) setScamReports(scamRes.data);
      } catch (error) {
        console.error('Failed to load safety data:', error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleCall = (number: string) => {
    window.location.href = `tel:${number}`;
  };

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Beverages': return <span className="text-lg">☕</span>;
      case 'Food': return <UtensilsCrossed className="h-4 w-4 text-emerald-600" />;
      case 'Transport': return <Car className="h-4 w-4 text-blue-600" />;
      case 'Souvenirs': return <Gift className="h-4 w-4 text-amber-600" />;
      default: return null;
    }
  };

  return (
    <div className="size-full flex flex-col bg-gradient-to-br from-slate-50 via-red-50/30 to-orange-50/30 pb-16">
      <div className="relative overflow-hidden bg-gradient-to-br from-red-600 via-red-500 to-rose-500 text-white px-4 py-4">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.05%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-30"></div>
        <div className="relative flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
            <ShieldAlert className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold">Safety & Security</h1>
            <p className="text-white/80 text-xs">Emergency contacts and travel tips</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <Tabs defaultValue="emergency" className="w-full">
          <TabsList className="w-full grid grid-cols-4 bg-white/80 backdrop-blur-md p-1 mx-3 mt-3 rounded-xl shadow-sm border border-gray-100">
            <TabsTrigger value="emergency" className="rounded-lg text-[10px] font-semibold py-2 data-[state=active]:bg-gradient-to-br data-[state=active]:from-red-500 data-[state=active]:to-red-600 data-[state=active]:text-white transition-all duration-200">
              <Phone className="h-3.5 w-3.5 mb-0.5 mx-auto" />
              Emergency
            </TabsTrigger>
            <TabsTrigger value="scams" className="rounded-lg text-[10px] font-semibold py-2 data-[state=active]:bg-gradient-to-br data-[state=active]:from-amber-500 data-[state=active]:to-orange-500 data-[state=active]:text-white transition-all duration-200">
              <AlertTriangle className="h-3.5 w-3.5 mb-0.5 mx-auto" />
              Anti-Scam
            </TabsTrigger>
            <TabsTrigger value="prices" className="rounded-lg text-[10px] font-semibold py-2 data-[state=active]:bg-gradient-to-br data-[state=active]:from-emerald-500 data-[state=active]:to-teal-500 data-[state=active]:text-white transition-all duration-200">
              <CreditCard className="h-3.5 w-3.5 mb-0.5 mx-auto" />
              Prices
            </TabsTrigger>
            <TabsTrigger value="phrases" className="rounded-lg text-[10px] font-semibold py-2 data-[state=active]:bg-gradient-to-br data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white transition-all duration-200">
              <Languages className="h-3.5 w-3.5 mb-0.5 mx-auto" />
              Phrases
            </TabsTrigger>
          </TabsList>

          <TabsContent value="emergency" className="px-3 py-3 space-y-3">
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-red-500 to-rose-600 p-3 rounded-2xl shadow-md text-white"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/20 backdrop-blur-sm">
                  <AlertTriangle className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-sm">In Case of Emergency</h3>
                  <p className="text-white/80 text-[10px]">Numbers work anywhere in Morocco. 24/7.</p>
                </div>
              </div>
            </motion.div>

            <div className="space-y-2">
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-red-500" />
                </div>
              ) : emergencyContacts.length > 0 ? (
                emergencyContacts.map((emergency, index) => (
                  <motion.div
                    key={emergency.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="group bg-white rounded-xl p-3 shadow-sm border border-gray-100 hover:shadow-md hover:border-red-200 transition-all duration-200"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-red-50 to-orange-50 rounded-xl flex items-center justify-center border border-red-100">
                          <ShieldAlert className="h-4 w-4 text-red-500" />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-800 text-xs">{emergency.service_name}</h3>
                          <p className="text-lg font-bold text-red-600">{emergency.phone_number}</p>
                        </div>
                      </div>
                      <Button
                        onClick={() => handleCall(emergency.phone_number)}
                        className="bg-gradient-to-br from-red-500 to-red-600 hover:from-red-400 hover:to-red-500 h-9 w-9 p-0 rounded-lg shadow-md transition-all duration-200"
                      >
                        <Phone className="h-4 w-4" />
                      </Button>
                    </div>
                  </motion.div>
                ))
              ) : (
                <p className="text-center text-gray-500 text-xs py-4">No emergency contacts available</p>
              )}
            </div>

            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gradient-to-br from-slate-800 to-slate-900 p-3 rounded-2xl shadow-md text-white overflow-hidden relative"
            >
              <div className="flex items-center gap-2 mb-2">
                <Info className="h-4 w-4 text-blue-400" />
                <p className="font-semibold text-xs">Pro Tips</p>
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 bg-white/5 rounded-lg px-2 py-1.5">
                  <Clock className="h-3.5 w-3.5 text-emerald-400 flex-shrink-0" />
                  <span className="text-[11px] text-gray-300">Free to call</span>
                </div>
                <div className="flex items-center gap-2 bg-white/5 rounded-lg px-2 py-1.5">
                  <Languages className="h-3.5 w-3.5 text-purple-400 flex-shrink-0" />
                  <span className="text-[11px] text-gray-300">French & Arabic spoken</span>
                </div>
                <div className="flex items-center gap-2 bg-white/5 rounded-lg px-2 py-1.5">
                  <MapPin className="h-3.5 w-3.5 text-amber-400 flex-shrink-0" />
                  <span className="text-[11px] text-gray-300">Keep hotel address ready</span>
                </div>
              </div>
            </motion.div>
          </TabsContent>

          <TabsContent value="scams" className="px-3 py-3 space-y-3">
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-amber-500 to-orange-600 p-3 rounded-2xl shadow-md text-white"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/20 backdrop-blur-sm">
                  <AlertCircle className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-sm">Stay Alert, Stay Safe</h3>
                  <p className="text-white/80 text-[10px]">Common scams and how to avoid them</p>
                </div>
              </div>
            </motion.div>

            <div className="space-y-2">
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-amber-500" />
                </div>
              ) : scamReports.length > 0 ? (
                scamReports.map((tip, index) => (
                  <motion.div
                    key={tip.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="group bg-white rounded-xl p-3 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 overflow-hidden relative"
                  >
                    <div className={`absolute top-0 left-0 w-1 h-full rounded-l-xl ${
                      tip.severity === 'high'
                        ? 'bg-gradient-to-b from-red-500 to-rose-600'
                        : tip.severity === 'medium'
                        ? 'bg-gradient-to-b from-amber-500 to-orange-500'
                        : 'bg-gradient-to-b from-yellow-400 to-amber-400'
                    }`}></div>
                    <div className="flex items-start gap-3 pl-2">
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${tip.severity === 'high' ? 'bg-red-50 border border-red-100' : tip.severity === 'medium' ? 'bg-amber-50 border border-amber-100' : 'bg-yellow-50 border border-yellow-100'}`}>
                        <AlertTriangle
                          className={`h-4 w-4 ${
                            tip.severity === 'high'
                              ? 'text-red-500'
                              : tip.severity === 'medium'
                              ? 'text-amber-500'
                              : 'text-yellow-500'
                          }`}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                          <h3 className="font-semibold text-gray-900 text-xs">{tip.title}</h3>
                          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase ${
                            tip.severity === 'high'
                              ? 'bg-red-100 text-red-700'
                              : tip.severity === 'medium'
                              ? 'bg-amber-100 text-amber-700'
                              : 'bg-yellow-100 text-yellow-700'
                          }`}>
                            {tip.severity}
                          </span>
                        </div>
                        <p className="text-[11px] text-gray-600 leading-relaxed">{tip.description}</p>
                        {tip.prevention_tips && (
                          <p className="text-[10px] text-emerald-600 mt-1 italic">Tip: {tip.prevention_tips}</p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <p className="text-center text-gray-500 text-xs py-4">No scam reports available</p>
              )}
            </div>
          </TabsContent>

          <TabsContent value="prices" className="px-3 py-3 space-y-3">
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-emerald-500 to-teal-600 p-3 rounded-2xl shadow-md text-white"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/20 backdrop-blur-sm">
                  <TrendingUp className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-sm">Reference Prices</h3>
                  <p className="text-white/80 text-[10px]">Know fair prices to avoid overpaying</p>
                </div>
              </div>
            </motion.div>

            {['Beverages', 'Food', 'Transport', 'Souvenirs'].map((category, catIndex) => (
              <motion.div 
                key={category}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: catIndex * 0.05 }}
              >
                <h3 className="font-semibold text-gray-900 text-xs mb-2 flex items-center gap-2">
                  <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-emerald-50 border border-emerald-100">
                    {getCategoryIcon(category)}
                  </span>
                  {category}
                </h3>
                <div className="space-y-1.5">
                  {referencePrices
                    .filter((p) => p.category === category)
                    .map((price, index) => (
                      <div
                        key={index}
                        className="bg-white border border-gray-100 rounded-xl px-3 py-2.5 flex items-center justify-between hover:shadow-sm hover:border-emerald-200 transition-all"
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400"></div>
                          <span className="text-gray-700 text-xs">{price.item}</span>
                        </div>
                        <span className="font-semibold text-emerald-600 text-xs bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-100">
                          {price.price}
                        </span>
                      </div>
                    ))}
                </div>
              </motion.div>
            ))}
          </TabsContent>

          <TabsContent value="phrases" className="px-3 py-3 space-y-3">
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-purple-500 via-pink-500 to-rose-600 p-3 rounded-2xl shadow-md text-white"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/20 backdrop-blur-sm">
                  <Languages className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-sm">Essential Phrases</h3>
                  <p className="text-white/80 text-[10px]">Basic Arabic/Darija for travelers</p>
                </div>
              </div>
            </motion.div>

            <div className="space-y-2">
              {commonPhrases.map((phrase, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="group bg-white border border-gray-100 rounded-xl p-3 hover:shadow-md hover:border-purple-200 transition-all duration-200"
                >
                  <div className="flex items-start justify-between gap-3 mb-2.5">
                    <div className="flex items-center gap-2">
                      <span className="text-sm">🇬🇧</span>
                      <p className="text-[9px] text-purple-600 uppercase font-bold tracking-wider">English</p>
                    </div>
                    <button
                      onClick={() => handleCopy(phrase.english, index * 3)}
                      className="flex items-center gap-1 text-[10px] text-gray-400 hover:text-purple-600 transition-colors"
                    >
                      {copiedIndex === index * 3 ? (
                        <Check className="h-3 w-3 text-emerald-500" />
                      ) : (
                        <Copy className="h-3 w-3" />
                      )}
                    </button>
                  </div>
                  <p className="font-semibold text-gray-900 text-sm mb-2.5">{phrase.english}</p>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-2.5 border border-purple-100 relative">
                      <button
                        onClick={() => handleCopy(phrase.darija, index * 3 + 1)}
                        className="absolute top-1.5 right-1.5 p-1 rounded bg-white/80 text-gray-400 hover:text-purple-600 transition-colors"
                      >
                        {copiedIndex === index * 3 + 1 ? (
                          <Check className="h-2.5 w-2.5 text-emerald-500" />
                        ) : (
                          <Copy className="h-2.5 w-2.5" />
                        )}
                      </button>
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="text-xs">🇲🇦</span>
                        <p className="text-[9px] text-purple-600 uppercase font-bold">Darija</p>
                      </div>
                      <p className="text-xs text-gray-800 font-medium">{phrase.darija}</p>
                    </div>
                    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg p-2.5 border border-indigo-100 relative">
                      <button
                        onClick={() => handleCopy(phrase.arabic, index * 3 + 2)}
                        className="absolute top-1.5 right-1.5 p-1 rounded bg-white/80 text-gray-400 hover:text-indigo-600 transition-colors"
                      >
                        {copiedIndex === index * 3 + 2 ? (
                          <Check className="h-2.5 w-2.5 text-emerald-500" />
                        ) : (
                          <Copy className="h-2.5 w-2.5" />
                        )}
                      </button>
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="text-xs">🇸🇦</span>
                        <p className="text-[9px] text-indigo-600 uppercase font-bold">Arabic</p>
                      </div>
                      <p className="text-xs text-gray-800 text-right font-medium" dir="rtl">{phrase.arabic}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <BottomNav />
    </div>
  );
}
