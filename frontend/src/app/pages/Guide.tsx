import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAppContext } from '../context/AppContext';
import BottomNav from '../components/BottomNav';
import { Button } from '../components/ui/button';
import { BadgeCheck, Languages, Mail, MapPin, MessageCircle, Phone, UserRound, Compass } from 'lucide-react';
import { fetchDirectoryGuides, createConversation, type ApiDirectoryGuide } from '../services/api';
import { motion } from 'motion/react';

function buildGuideLanguages(guide: ApiDirectoryGuide) {
  const languages = ['Francais'];
  if (guide.email.endsWith('.test')) {
    languages.push('Anglais');
  }
  return languages.join(', ');
}

function isApprovedGuide(guide: ApiDirectoryGuide) {
  return guide.verified && (guide.status == null || guide.status === 'approved');
}

export default function Guide() {
  const navigate = useNavigate();
  const { authMode, authToken, city, exploreMode, userRole } = useAppContext();
  const [guides, setGuides] = useState<ApiDirectoryGuide[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const activeCity = city || 'Marrakech';

  useEffect(() => {
    let cancelled = false;

    setIsLoading(true);
    fetchDirectoryGuides(activeCity)
      .then((response) => {
        if (!cancelled) {
          setGuides(response.data ?? []);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setGuides([]);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setIsLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [activeCity]);

  const availableGuides = useMemo(() => guides.filter(isApprovedGuide), [guides]);

  const handleRequestGuide = (guideId: number) => {
    if (authMode !== 'login') {
      navigate(`/login?redirectTo=${encodeURIComponent(`/guide/request/${guideId}`)}`);
      return;
    }
    if (userRole !== 'tourist') {
      toast.error('This request flow is reserved for tourists');
      return;
    }
    navigate(`/guide/request/${guideId}`);
  };

  const handleMessageGuide = async (guideId: number) => {
    if (authMode !== 'login' || !authToken) {
      navigate('/login?redirectTo=/messages');
      return;
    }
    try {
      const response = await createConversation({ participant_ids: [guideId] }, authToken);
      if (response.data) {
        navigate('/messages', { state: { conversationId: response.data.id } });
        toast.success('Conversation opened');
      }
    } catch {
      toast.error('Unable to start conversation');
    }
  };

  return (
    <div className="size-full flex flex-col bg-gradient-to-b from-[#0D9488]/5 via-white to-white pb-16">
      <div className="bg-gradient-to-r from-[#0D9488] to-[#0891B2] text-white px-6 py-6 shadow-lg shadow-[#0D9488]/20">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4"
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
            <Compass className="h-7 w-7" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Local Guides</h1>
            <p className="text-white/80 text-sm">
              {exploreMode === 'city' && city
                ? `Guides verified available in ${city}`
                : 'Find a verified guide near your location'}
            </p>
          </div>
        </motion.div>
      </div>

      <div className="flex-1 overflow-auto px-6 py-6">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6 rounded-2xl bg-gradient-to-r from-[#0D9488]/10 to-transparent p-5 border border-[#0D9488]/10"
        >
          <div className="flex items-start gap-4">
            <div className="mt-1 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#0D9488] to-[#0891B2] text-white shadow-lg shadow-[#0D9488]/20">
              <UserRound className="h-6 w-6" />
            </div>
            <div>
              <h2 className="font-bold text-gray-900 text-lg">Verified Local Guides</h2>
              <p className="mt-1 text-sm text-gray-600">
                {exploreMode === 'city' && city
                  ? `Real guide accounts available in ${city}.`
                  : 'Real guide accounts ready to assist you.'}
              </p>
            </div>
          </div>
        </motion.div>

        {isLoading ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="rounded-2xl border border-gray-200 bg-white p-8 text-center"
          >
            <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-[#0D9488]/20 border-t-[#0D9488]"></div>
            <p className="text-sm text-gray-500">Loading guide profiles...</p>
          </motion.div>
        ) : availableGuides.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-gray-200 bg-white p-8 text-center"
          >
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100">
              <Compass className="h-8 w-8 text-gray-400" />
            </div>
            <p className="text-sm text-gray-500">No verified guides available for this city yet.</p>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {availableGuides.map((guide, index) => (
              <motion.div
                key={guide.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08 }}
                className="rounded-2xl border-2 border-gray-100 bg-white p-5 transition-all duration-200 hover:border-[#0D9488]/50 hover:shadow-lg"
              >
                <div className="flex gap-4">
                  <div className="relative">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#0D9488]/20 to-[#0891B2]/10 text-[#0D9488]">
                      <UserRound className="h-8 w-8" />
                    </div>
                    {guide.verified && (
                      <div className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg">
                        <BadgeCheck className="h-3.5 w-3.5 text-white" />
                      </div>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <div>
                        <h3 className="font-bold text-gray-900 text-lg">{guide.name}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <MapPin className="h-3.5 w-3.5 text-gray-400" />
                          <p className="text-sm text-gray-500">{guide.city ?? activeCity}</p>
                        </div>
                      </div>
                      <span className="rounded-full bg-emerald-100 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-emerald-700">
                        {guide.status ?? 'approved'}
                      </span>
                    </div>

                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{guide.bio || 'Local guide ready to help you explore.'}</p>

                    <div className="flex items-center gap-4 text-sm mb-4">
                      <div className="flex items-center gap-1.5 text-gray-500">
                        <Mail className="h-4 w-4" />
                        <span className="truncate max-w-[150px]">{guide.email}</span>
                      </div>
                    </div>

                    <div className="mb-4 flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-100">
                        <Languages className="h-4 w-4 text-purple-600" />
                      </div>
                      <span className="text-xs text-gray-600">{buildGuideLanguages(guide)}</span>
                    </div>

                    <div className="flex items-center justify-between gap-3 pt-3 border-t border-gray-100">
                      <div className="text-sm">
                        <span className="text-gray-500">Phone </span>
                        <span className="font-bold text-[#0D9488]">{guide.phone || 'Not provided'}</span>
                      </div>

                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="h-9 w-9 rounded-xl p-0 hover:bg-[#0D9488]/10 hover:border-[#0D9488]">
                          <Phone className="h-4 w-4 text-gray-600" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="h-9 w-9 rounded-xl p-0 hover:bg-[#0D9488]/10 hover:border-[#0D9488] hover:text-[#0D9488]"
                          onClick={() => handleMessageGuide(guide.id)}
                        >
                          <MessageCircle className="h-4 w-4 text-gray-600" />
                        </Button>
                        <Button onClick={() => handleRequestGuide(guide.id)} size="sm" className="bg-gradient-to-r from-[#0D9488] to-[#0891B2] hover:from-[#0891B2] hover:to-[#0D9488] rounded-xl shadow-lg shadow-[#0D9488]/20">
                          Request
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
