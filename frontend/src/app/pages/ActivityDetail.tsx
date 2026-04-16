import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Star, Clock, Users, Check, Heart, Share2, Calendar, Globe, MessageCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { Button } from '../components/ui/button';
import { monuments, activities } from '../data/mockData';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import BottomNav from '../components/BottomNav';
import { useAppContext } from '../context/AppContext';
import { createConversation } from '../services/api';
import { toast } from 'sonner';

export default function ActivityDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { authMode, authToken, userRole } = useAppContext();

  const monument = monuments.find((m) => m.id === Number(id));
  const activity = activities.find((a) => a.id === Number(id));
  const item = monument || activity;

  if (!item) {
    return (
      <div className="size-full flex items-center justify-center">
        <p>Activite non trouvee</p>
      </div>
    );
  }

  const isMonument = !!monument;

  const handleMessageGuide = async () => {
    if (authMode !== 'login' || !authToken) {
      navigate('/login?redirectTo=/messages');
      return;
    }
    try {
      const guideId = 1;
      const response = await createConversation({ participant_ids: [guideId] }, authToken);
      if (response.data) {
        navigate('/messages', { state: { conversationId: response.data.id } });
        toast.success('Conversation ouverte');
      }
    } catch {
      toast.error('Erreur lors de la creation');
    }
  };

  return (
    <div className="size-full bg-gray-50 flex flex-col pb-16">
      <div className="relative">
        <div className="h-56 overflow-hidden">
          <ImageWithFallback
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        </div>
        
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg"
        >
          <ArrowLeft className="h-5 w-5 text-gray-700" />
        </button>

        <div className="absolute top-4 right-4 flex gap-2">
          <button className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg">
            <Heart className="h-5 w-5 text-gray-700" />
          </button>
          <button className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg">
            <Share2 className="h-5 w-5 text-gray-700" />
          </button>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h1 className="text-2xl font-bold text-white leading-tight">{item.name}</h1>
          <div className="flex items-center gap-3 mt-2">
            <div className="flex items-center gap-1 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1">
              <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
              <span className="font-semibold text-white text-sm">{item.rating}</span>
              <span className="text-white/80 text-xs">({item.reviews})</span>
            </div>
            <div className="flex items-center gap-1 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1">
              <MapPin className="h-4 w-4 text-white" />
              <span className="text-white text-sm">{item.city}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <div className="p-5 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {isMonument ? (
              <>
                <motion.div 
                  whileTap={{ scale: 0.98 }}
                  className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                      <Clock className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Duree</p>
                      <p className="font-semibold text-gray-900">{monument.duration}</p>
                    </div>
                  </div>
                </motion.div>
                <motion.div 
                  whileTap={{ scale: 0.98 }}
                  className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
                      <Calendar className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Horaires</p>
                      <p className="font-semibold text-gray-900 text-sm">{monument.hours}</p>
                    </div>
                  </div>
                </motion.div>
              </>
            ) : (
              <>
                <motion.div 
                  whileTap={{ scale: 0.98 }}
                  className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                      <Clock className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Duree</p>
                      <p className="font-semibold text-gray-900">{activity?.duration}</p>
                    </div>
                  </div>
                </motion.div>
                <motion.div 
                  whileTap={{ scale: 0.98 }}
                  className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
                      <Users className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Groupe</p>
                      <p className="font-semibold text-gray-900">{activity?.groupSize}</p>
                    </div>
                  </div>
                </motion.div>
              </>
            )}
          </div>

          {('isPromoted' in item && item.isPromoted) && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-4 border border-yellow-200"
            >
              <div className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-yellow-600" />
                <span className="font-bold text-yellow-800">EN Vedette</span>
              </div>
            </motion.div>
          )}

          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <h2 className="text-base font-bold text-gray-900 mb-3">Description</h2>
            <p className="text-sm text-gray-600 leading-relaxed">{item.description}</p>
          </div>

          {!isMonument && activity && (
            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
              <h2 className="text-base font-bold text-gray-900 mb-3">Inclus</h2>
              <div className="grid grid-cols-2 gap-3">
                {activity.includes.split(',').map((inc, index) => (
                  <div key={index} className="flex items-center gap-2 bg-green-50 rounded-xl px-3 py-2">
                    <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                      <Check className="h-3 w-3 text-white" />
                    </div>
                    <span className="text-sm text-gray-700">{inc.trim()}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {isMonument && monument && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-5 border border-blue-100"
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                  <Globe className="h-4 w-4 text-blue-600" />
                </div>
                <h2 className="text-base font-bold text-blue-900">Conseils</h2>
              </div>
              <p className="text-sm text-blue-800 leading-relaxed">{monument.tips}</p>
            </motion.div>
          )}

          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <h2 className="text-base font-bold text-gray-900 mb-4">Avis Recents</h2>
            <div className="space-y-4">
              {[
                { name: 'Sarah M.', rating: 5, comment: 'Experience incroyable! Je recommande vivement.' },
                { name: 'John D.', rating: 4, comment: 'Tres bel endroit. Guide tres competent.' },
              ].map((review, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="border-b border-gray-100 pb-4 last:border-0 last:pb-0"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0D9488] to-teal-400 flex items-center justify-center">
                        <span className="text-white text-sm font-bold">{review.name.charAt(0)}</span>
                      </div>
                      <span className="font-semibold text-gray-900">{review.name}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      {[...Array(review.rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 pl-13">{review.comment}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {userRole === 'tourist' && (
            <Button
              onClick={handleMessageGuide}
              variant="outline"
              className="w-full h-12 rounded-xl border-2 border-[#0D9488] text-[#0D9488] hover:bg-[#0D9488]/5"
            >
              <MessageCircle className="mr-2 h-5 w-5" />
              Contacter un guide
            </Button>
          )}
        </div>
      </div>

      <div className="fixed bottom-16 left-0 right-0 bg-white border-t border-gray-100 p-4 safe-area-bottom">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500">Prix</p>
            <p className="text-2xl font-bold text-gray-900">
              {isMonument ? monument.price : `${activity?.price} MAD`}
            </p>
          </div>
          <Button
            onClick={() => navigate(`/checkout/${isMonument ? 'monument' : 'activity'}/${item.id}`)}
            className="h-12 px-8 bg-gradient-to-r from-[#0D9488] to-teal-500 hover:from-[#0891B2] hover:to-[#0D9488] rounded-xl font-semibold shadow-lg shadow-teal-500/30"
          >
            Reserver
          </Button>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
