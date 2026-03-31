import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronRight, Globe2, MapPinned } from 'lucide-react';
import { Button } from '../components/ui/button';
import { supportedCountries } from '../data/locationData';
import { useAppContext } from '../context/AppContext';

export default function CountrySelector() {
  const navigate = useNavigate();
  const { country, setCountry, useCurrentLocation } = useAppContext();

  const handleCountrySelect = (selectedCountry: string) => {
    setCountry(selectedCountry);
    navigate('/city');
  };

  return (
    <div className="size-full bg-white flex flex-col">
      <div className="p-6 border-b">
        <button onClick={() => navigate(-1)} className="mb-4 text-gray-600 hover:text-gray-900">
          <ArrowLeft className="h-6 w-6" />
        </button>
        <div className="animate-enter-hero">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#0D9488]/10 text-[#0D9488]">
            <Globe2 className="h-7 w-7" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Choisissez le pays</h1>
          <p className="mt-2 text-sm text-gray-600">
            Si la ville est prise en charge, Navito affichera un contenu local ciblé.
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6">
        <div className="mx-auto max-w-lg space-y-3">
          {supportedCountries.map((item, index) => (
            <button
              key={item.code}
              onClick={() => handleCountrySelect(item.englishName)}
              className={`animate-enter-card w-full rounded-3xl border p-5 text-left transition-all hover:border-[#0D9488] hover:bg-[#0D9488]/5 ${
                country === item.englishName ? 'border-[#0D9488] bg-[#0D9488]/5' : 'border-gray-200'
              }`}
              style={{ animationDelay: `${index * 90}ms` }}
            >
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-lg font-semibold text-gray-900">{item.name}</p>
                  <p className="mt-1 text-sm text-gray-600">{item.description}</p>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="border-t p-6">
        <Button
          variant="outline"
          className="h-12 w-full rounded-2xl"
          onClick={() => {
            useCurrentLocation();
            navigate('/explore');
          }}
        >
          <MapPinned className="mr-2 h-5 w-5" />
          Continuer avec la carte actuelle
        </Button>
      </div>
    </div>
  );
}
