import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Star, Clock, Users, Check, Heart, Share2, Calendar } from 'lucide-react';
import { Button } from '../components/ui/button';
import { monuments, activities } from '../data/mockData';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

export default function ActivityDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Try to find in both monuments and activities
  const monument = monuments.find((m) => m.id === Number(id));
  const activity = activities.find((a) => a.id === Number(id));
  const item = monument || activity;

  if (!item) {
    return (
      <div className="size-full flex items-center justify-center">
        <p>Activity not found</p>
      </div>
    );
  }

  const isMonument = !!monument;

  return (
    <div className="size-full bg-white flex flex-col">
      {/* Image Header */}
      <div className="relative h-80">
        <ImageWithFallback
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>

        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-6 left-6 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors"
        >
          <ArrowLeft className="h-5 w-5 text-gray-900" />
        </button>

        {/* Action Buttons */}
        <div className="absolute top-6 right-6 flex gap-2">
          <button className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors">
            <Share2 className="h-5 w-5 text-gray-900" />
          </button>
          <button className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors">
            <Heart className="h-5 w-5 text-gray-900" />
          </button>
        </div>

        {('isPromoted' in item && item.isPromoted) && (
          <div className="absolute bottom-6 left-6">
            <div className="bg-yellow-400 text-gray-900 text-sm font-bold px-3 py-1.5 rounded-full">
              FEATURED
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        <div className="px-6 py-6 space-y-6">
          {/* Title and Rating */}
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{item.name}</h1>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                <span>{item.city}</span>
              </div>
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                <span className="font-medium text-gray-900">{item.rating}</span>
                <span>({item.reviews} reviews)</span>
              </div>
            </div>
          </div>

          {/* Quick Info */}
          <div className="grid grid-cols-2 gap-3">
            {isMonument ? (
              <>
                <div className="bg-gray-50 p-4 rounded-xl">
                  <div className="flex items-center gap-2 text-gray-600 mb-1">
                    <Clock className="h-4 w-4" />
                    <span className="text-sm">Duration</span>
                  </div>
                  <p className="font-semibold text-gray-900">{monument.duration}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl">
                  <div className="flex items-center gap-2 text-gray-600 mb-1">
                    <Calendar className="h-4 w-4" />
                    <span className="text-sm">Hours</span>
                  </div>
                  <p className="font-semibold text-gray-900 text-sm">{monument.hours}</p>
                </div>
              </>
            ) : (
              <>
                <div className="bg-gray-50 p-4 rounded-xl">
                  <div className="flex items-center gap-2 text-gray-600 mb-1">
                    <Clock className="h-4 w-4" />
                    <span className="text-sm">Duration</span>
                  </div>
                  <p className="font-semibold text-gray-900">{activity?.duration}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl">
                  <div className="flex items-center gap-2 text-gray-600 mb-1">
                    <Users className="h-4 w-4" />
                    <span className="text-sm">Group Size</span>
                  </div>
                  <p className="font-semibold text-gray-900">{activity?.groupSize}</p>
                </div>
              </>
            )}
          </div>

          {/* Description */}
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-3">Description</h2>
            <p className="text-gray-700 leading-relaxed">{item.description}</p>
          </div>

          {/* What's Included (for activities) */}
          {!isMonument && activity && (
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-3">What's Included</h2>
              <div className="space-y-2">
                {activity.includes.split(',').map((inc, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="h-3 w-3 text-green-600" />
                    </div>
                    <span className="text-gray-700">{inc.trim()}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tips (for monuments) */}
          {isMonument && monument && (
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-3">Tips</h2>
              <div className="bg-blue-50 p-4 rounded-xl">
                <p className="text-gray-700">{monument.tips}</p>
              </div>
            </div>
          )}

          {/* Reviews */}
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-3">Reviews</h2>
            <div className="space-y-4">
              {[
                {
                  name: 'Sarah M.',
                  rating: 5,
                  date: 'March 15, 2026',
                  comment: 'Absolutely amazing experience! Highly recommend to anyone visiting ' + item.city + '.',
                },
                {
                  name: 'John D.',
                  rating: 4,
                  date: 'March 10, 2026',
                  comment: 'Great place to visit. The guide was very knowledgeable and friendly.',
                },
              ].map((review, index) => (
                <div key={index} className="border-b border-gray-100 pb-4 last:border-0">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gray-200"></div>
                      <div>
                        <p className="font-semibold text-sm text-gray-900">{review.name}</p>
                        <p className="text-xs text-gray-500">{review.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                      <span className="font-medium text-sm">{review.rating}</span>
                    </div>
                  </div>
                  <p className="text-gray-700 text-sm">{review.comment}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t bg-white px-6 py-4 safe-area-bottom">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm text-gray-600">Price</p>
            <p className="text-2xl font-bold text-gray-900">
              {isMonument ? monument.price : `${activity?.price} MAD`}
            </p>
          </div>
          <Button
            onClick={() => navigate(`/checkout/${isMonument ? 'monument' : 'activity'}/${item.id}`)}
            className="flex-1 h-12 bg-[#0D9488] hover:bg-[#0D9488]/90 rounded-xl"
          >
            Book Now
          </Button>
        </div>
      </div>
    </div>
  );
}
