import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Star, Clock, Phone, Heart, Share2, DollarSign, Check } from 'lucide-react';
import { Button } from '../components/ui/button';
import { restaurants } from '../data/mockData';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

export default function RestaurantDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const restaurant = restaurants.find((r) => r.id === Number(id));

  if (!restaurant) {
    return (
      <div className="size-full flex items-center justify-center">
        <p>Restaurant not found</p>
      </div>
    );
  }

  return (
    <div className="size-full bg-white flex flex-col">
      {/* Image Header */}
      <div className="relative h-80">
        <ImageWithFallback
          src={restaurant.image}
          alt={restaurant.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>

        <button
          onClick={() => navigate(-1)}
          className="absolute top-6 left-6 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center"
        >
          <ArrowLeft className="h-5 w-5 text-gray-900" />
        </button>

        <div className="absolute top-6 right-6 flex gap-2">
          <button className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center">
            <Share2 className="h-5 w-5 text-gray-900" />
          </button>
          <button className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center">
            <Heart className="h-5 w-5 text-gray-900" />
          </button>
        </div>

        {restaurant.isPromoted && (
          <div className="absolute bottom-6 left-6">
            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-sm font-bold px-4 py-1.5 rounded-full flex items-center gap-2">
              <Star className="h-4 w-4 fill-white" />
              {restaurant.promotionLevel === 'premium' ? 'PREMIUM PARTNER' : 'FEATURED'}
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        <div className="px-6 py-6 space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{restaurant.name}</h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                <span>{restaurant.city}</span>
              </div>
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                <span className="font-medium text-gray-900">{restaurant.rating}</span>
                <span>({restaurant.reviews} reviews)</span>
              </div>
              <div className="bg-gray-100 px-2 py-1 rounded-full">
                <span className="font-medium">{restaurant.cuisine}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="bg-gray-50 p-4 rounded-xl text-center">
              <DollarSign className="h-5 w-5 text-gray-600 mx-auto mb-1" />
              <p className="text-xs text-gray-600">Price</p>
              <p className="font-semibold text-gray-900">{restaurant.priceRange}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-xl text-center">
              <Clock className="h-5 w-5 text-gray-600 mx-auto mb-1" />
              <p className="text-xs text-gray-600">Hours</p>
              <p className="font-semibold text-gray-900 text-xs">{restaurant.hours}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-xl text-center">
              <Check className="h-5 w-5 text-green-600 mx-auto mb-1" />
              <p className="text-xs text-gray-600">Halal</p>
              <p className="font-semibold text-gray-900">{restaurant.halal ? 'Yes' : 'No'}</p>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-3">About</h2>
            <p className="text-gray-700 leading-relaxed">{restaurant.description}</p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-3">Average Price</h2>
            <div className="bg-blue-50 p-4 rounded-xl flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Per Person</p>
                <p className="text-2xl font-bold text-[#0D9488]">{restaurant.avgPrice} MAD</p>
              </div>
              <p className="text-xs text-gray-600 max-w-[180px]">Based on recent customer orders</p>
            </div>
          </div>

          {restaurant.isPromoted && (
            <div className="bg-gradient-to-br from-[#0D9488]/10 to-blue-50 p-4 rounded-xl border border-[#0D9488]/20">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-[#0D9488] flex items-center justify-center flex-shrink-0">
                  <Star className="h-5 w-5 text-white fill-white" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">Promoted Restaurant</h3>
                  <p className="text-sm text-gray-700">
                    This restaurant is a verified partner and has been recommended by our team for quality service and authentic cuisine.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="border-t bg-white px-6 py-4">
        <div className="flex gap-3">
          <Button variant="outline" className="flex-1 h-12 rounded-xl">
            <Phone className="mr-2 h-5 w-5" />
            Call
          </Button>
          <Button className="flex-1 h-12 bg-[#0D9488] hover:bg-[#0D9488]/90 rounded-xl">
            <MapPin className="mr-2 h-5 w-5" />
            Get Directions
          </Button>
        </div>
      </div>
    </div>
  );
}
