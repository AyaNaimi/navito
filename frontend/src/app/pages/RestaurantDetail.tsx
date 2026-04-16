import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Star, Clock, Phone, Heart, Share2, DollarSign, Check, Globe, MessageCircle, ExternalLink } from 'lucide-react';
import { motion } from 'motion/react';
import { Button } from '../components/ui/button';
import { restaurants } from '../data/mockData';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import BottomNav from '../components/BottomNav';
import { useAppContext } from '../context/AppContext';
import { createConversation } from '../services/api';
import { toast } from 'sonner';

export default function RestaurantDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { authMode, authToken, userRole } = useAppContext();

  const restaurant = restaurants.find((r) => r.id === Number(id));

  if (!restaurant) {
    return (
      <div className="size-full flex items-center justify-center">
        <p>Restaurant non trouve</p>
      </div>
    );
  }

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

  const handleOpenDirections = () => {
    const destination =
      typeof restaurant.lat === 'number' && typeof restaurant.lng === 'number'
        ? `${restaurant.lat},${restaurant.lng}`
        : encodeURIComponent(`${restaurant.name}, ${restaurant.city}`);

    const mapsUrl =
      typeof restaurant.lat === 'number' && typeof restaurant.lng === 'number'
        ? `https://www.google.com/maps/dir/?api=1&destination=${destination}&travelmode=driving`
        : `https://www.google.com/maps/search/?api=1&query=${destination}`;

    window.open(mapsUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="size-full bg-gray-50 flex flex-col pb-16">
      <div className="relative">
        <div className="h-56 overflow-hidden">
          <ImageWithFallback
            src={restaurant.image}
            alt={restaurant.name}
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
          <h1 className="text-2xl font-bold text-white leading-tight">{restaurant.name}</h1>
          <div className="flex items-center gap-3 mt-2 flex-wrap">
            <div className="flex items-center gap-1 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1">
              <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
              <span className="font-semibold text-white text-sm">{restaurant.rating}</span>
              <span className="text-white/80 text-xs">({restaurant.reviews})</span>
            </div>
            <div className="flex items-center gap-1 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1">
              <MapPin className="h-4 w-4 text-white" />
              <span className="text-white text-sm">{restaurant.city}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <div className="p-5 space-y-4">
          <div className="flex gap-2 flex-wrap">
            <span className="px-3 py-1.5 bg-gray-100 text-gray-700 text-xs font-semibold rounded-full">
              {restaurant.cuisine}
            </span>
            {restaurant.halal && (
              <span className="px-3 py-1.5 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                Halal
              </span>
            )}
          </div>

          <div className="grid grid-cols-3 gap-3">
            <motion.div 
              whileTap={{ scale: 0.98 }}
              className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm text-center"
            >
              <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center mx-auto mb-2">
                <DollarSign className="h-6 w-6 text-emerald-600" />
              </div>
              <p className="text-xs text-gray-500 mb-1">Prix</p>
              <p className="font-bold text-gray-900">{restaurant.priceRange}</p>
            </motion.div>
            <motion.div 
              whileTap={{ scale: 0.98 }}
              className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm text-center"
            >
              <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center mx-auto mb-2">
                <Clock className="h-6 w-6 text-blue-600" />
              </div>
              <p className="text-xs text-gray-500 mb-1">Horaires</p>
              <p className="font-semibold text-gray-900 text-xs">{restaurant.hours}</p>
            </motion.div>
            <motion.div 
              whileTap={{ scale: 0.98 }}
              className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm text-center"
            >
              <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center mx-auto mb-2">
                <Check className="h-6 w-6 text-green-600" />
              </div>
              <p className="text-xs text-gray-500 mb-1">Halal</p>
              <p className="font-bold text-green-600">{restaurant.halal ? 'Oui' : 'Non'}</p>
            </motion.div>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-[#0D9488]/10 to-teal-50 rounded-2xl p-5 border border-[#0D9488]/20"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Prix moyen par personne</p>
                <p className="text-3xl font-bold text-[#0D9488]">{restaurant.avgPrice} MAD</p>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#0D9488] to-teal-500 flex items-center justify-center">
                <DollarSign className="h-7 w-7 text-white" />
              </div>
            </div>
          </motion.div>

          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <h2 className="text-base font-bold text-gray-900 mb-3">A propos</h2>
            <p className="text-sm text-gray-600 leading-relaxed">{restaurant.description}</p>
          </div>

          {restaurant.isPromoted && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-5 border border-yellow-200"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center flex-shrink-0">
                  <Star className="h-6 w-6 text-white fill-white" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">Restaurant Partenaire</h3>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    Ce restaurant est un partenaire verifie recommande pour la qualite du service et l'authenticite de la cuisine.
                  </p>
                </div>
              </div>
            </motion.div>
          )}

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
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            className="flex-1 h-12 rounded-xl border-gray-200 hover:border-[#0D9488] hover:text-[#0D9488]"
          >
            <Phone className="mr-2 h-5 w-5" />
            Appeler
          </Button>
          <Button 
            onClick={handleOpenDirections}
            className="flex-1 h-12 bg-gradient-to-r from-[#0D9488] to-teal-500 hover:from-[#0891B2] hover:to-[#0D9488] rounded-xl shadow-lg shadow-teal-500/30"
          >
            <MapPin className="mr-2 h-5 w-5" />
            Itineraire
          </Button>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
