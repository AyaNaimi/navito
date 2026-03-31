import BottomNav from '../components/BottomNav';
import { Phone, ShieldAlert, AlertTriangle, Info, ChevronRight } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { emergencyNumbers, antiScamTips, referencePrices, commonPhrases } from '../data/mockData';

export default function Safety() {
  const handleCall = (number: string) => {
    window.location.href = `tel:${number}`;
  };

  return (
    <div className="size-full bg-gray-50 flex flex-col pb-16">
      {/* Header */}
      <div className="bg-red-600 text-white px-6 py-6">
        <h1 className="text-2xl font-bold mb-2">Safety & Security</h1>
        <p className="text-white/80 text-sm">Emergency contacts and travel safety tips</p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        <Tabs defaultValue="emergency" className="w-full">
          <TabsList className="w-full grid grid-cols-4 bg-gray-100 p-1 m-4 rounded-xl">
            <TabsTrigger value="emergency" className="rounded-lg text-xs">Emergency</TabsTrigger>
            <TabsTrigger value="scams" className="rounded-lg text-xs">Anti-Scam</TabsTrigger>
            <TabsTrigger value="prices" className="rounded-lg text-xs">Prices</TabsTrigger>
            <TabsTrigger value="phrases" className="rounded-lg text-xs">Phrases</TabsTrigger>
          </TabsList>

          {/* Emergency Numbers */}
          <TabsContent value="emergency" className="px-6 pb-6 space-y-4">
            <div className="bg-red-50 p-4 rounded-xl border border-red-200">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-6 w-6 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-red-900 mb-1">In Case of Emergency</h3>
                  <p className="text-sm text-red-700">
                    These numbers work from anywhere in Morocco. Available 24/7.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              {emergencyNumbers.map((emergency, index) => (
                <div
                  key={index}
                  className="bg-white border-2 border-gray-200 rounded-xl p-4 hover:border-red-600 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                        <ShieldAlert className="h-6 w-6 text-red-600" />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900">{emergency.service}</h3>
                        <p className="text-2xl font-bold text-red-600">{emergency.number}</p>
                      </div>
                    </div>
                    <Button
                      onClick={() => handleCall(emergency.number)}
                      className="bg-red-600 hover:bg-red-700 h-12 w-12 p-0 rounded-full"
                    >
                      <Phone className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
              <div className="flex items-start gap-3">
                <Info className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-blue-700">
                  <p className="font-semibold mb-1">Important Notes:</p>
                  <ul className="space-y-1">
                    <li>• These numbers are free to call</li>
                    <li>• French and Arabic are commonly spoken</li>
                    <li>• Keep your location and hotel info ready</li>
                  </ul>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Anti-Scam Guide */}
          <TabsContent value="scams" className="px-6 pb-6 space-y-4">
            <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-200">
              <h3 className="font-bold text-yellow-900 mb-1">Stay Alert, Stay Safe</h3>
              <p className="text-sm text-yellow-700">
                Common tourist scams and how to avoid them
              </p>
            </div>

            <div className="space-y-3">
              {antiScamTips.map((tip) => (
                <div
                  key={tip.id}
                  className={`bg-white border-2 rounded-xl p-4 ${
                    tip.severity === 'high'
                      ? 'border-red-200'
                      : tip.severity === 'medium'
                      ? 'border-orange-200'
                      : 'border-yellow-200'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                        tip.severity === 'high'
                          ? 'bg-red-100'
                          : tip.severity === 'medium'
                          ? 'bg-orange-100'
                          : 'bg-yellow-100'
                      }`}
                    >
                      <AlertTriangle
                        className={`h-5 w-5 ${
                          tip.severity === 'high'
                            ? 'text-red-600'
                            : tip.severity === 'medium'
                            ? 'text-orange-600'
                            : 'text-yellow-600'
                        }`}
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-bold text-gray-900">{tip.title}</h3>
                        <span
                          className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                            tip.severity === 'high'
                              ? 'bg-red-100 text-red-700'
                              : tip.severity === 'medium'
                              ? 'bg-orange-100 text-orange-700'
                              : 'bg-yellow-100 text-yellow-700'
                          }`}
                        >
                          {tip.severity.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700">{tip.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* Reference Prices */}
          <TabsContent value="prices" className="px-6 pb-6 space-y-4">
            <div className="bg-green-50 p-4 rounded-xl border border-green-200">
              <h3 className="font-bold text-green-900 mb-1">Reference Prices</h3>
              <p className="text-sm text-green-700">
                Know the fair prices to avoid overpaying
              </p>
            </div>

            {['Beverages', 'Food', 'Transport', 'Souvenirs'].map((category) => (
              <div key={category}>
                <h3 className="font-bold text-gray-900 mb-3">{category}</h3>
                <div className="space-y-2">
                  {referencePrices
                    .filter((p) => p.category === category)
                    .map((price, index) => (
                      <div
                        key={index}
                        className="bg-white border border-gray-200 rounded-xl p-3 flex items-center justify-between"
                      >
                        <span className="text-gray-700">{price.item}</span>
                        <span className="font-bold text-[#0D9488]">{price.price}</span>
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </TabsContent>

          {/* Common Phrases */}
          <TabsContent value="phrases" className="px-6 pb-6 space-y-4">
            <div className="bg-purple-50 p-4 rounded-xl border border-purple-200">
              <h3 className="font-bold text-purple-900 mb-1">Essential Phrases</h3>
              <p className="text-sm text-purple-700">
                Basic Arabic/Darija phrases for travelers
              </p>
            </div>

            <div className="space-y-2">
              {commonPhrases.map((phrase, index) => (
                <div
                  key={index}
                  className="bg-white border border-gray-200 rounded-xl p-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-2">
                      <div>
                        <p className="text-xs text-gray-500 uppercase">English</p>
                        <p className="font-semibold text-gray-900">{phrase.english}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <p className="text-xs text-gray-500 uppercase">Darija</p>
                          <p className="font-medium text-gray-700">{phrase.darija}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 uppercase">Arabic</p>
                          <p className="font-medium text-gray-700 text-right" dir="rtl">{phrase.arabic}</p>
                        </div>
                      </div>
                    </div>
                    <button className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors flex-shrink-0">
                      <ChevronRight className="h-4 w-4 text-gray-600" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <BottomNav />
    </div>
  );
}
