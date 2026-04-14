import { cities as moroccoCities } from './mockData';

const cityImages = {
  // Morocco
  Marrakech: 'https://images.unsplash.com/photo-1597212618440-806262de4f6b?auto=format&fit=crop&w=1200&q=80',
  Fès: 'https://images.unsplash.com/photo-1578895101408-1a36b834405b?auto=format&fit=crop&w=1200&q=80',
  Casablanca: 'https://images.unsplash.com/photo-1539020140153-e479b8c22e70?auto=format&fit=crop&w=1200&q=80',
  Rabat: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1200&q=80',
  Tanger: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?auto=format&fit=crop&w=1200&q=80',
  Agadir: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
  // France
  Paris: 'https://images.unsplash.com/photo-1502602898657-3e91759c8c5a?auto=format&fit=crop&w=1200&q=80',
  Nice: 'https://images.unsplash.com/photo-1514890547350-a9c9b4e6c6d6?auto=format&fit=crop&w=1200&q=80',
  Lyon: 'https://images.unsplash.com/photo-1550340499-a6aa9a28a9d6?auto=format&fit=crop&w=1200&q=80',
  Marseille: 'https://images.unsplash.com/photo-1534177616072-ef7dc12049c7?auto=format&fit=crop&w=1200&q=80',
  // Spain
  Barcelona: 'https://images.unsplash.com/photo-1583422409516-2895a4efbba8?auto=format&fit=crop&w=1200&q=80',
  Madrid: 'https://images.unsplash.com/photo-1539037116277-4db208895f67?auto=format&fit=crop&w=1200&q=80',
  // Portugal
  Lisbon: 'https://images.unsplash.com/photo-1585208798174-6cedd86e019a?auto=format&fit=crop&w=1200&q=80',
};

export const citiesByCountry: Record<string, Array<{id: number; name: string; country: string; lat: number; lng: number; image: string}>> = {
  Morocco: moroccoCities,
  France: [
    { id: 101, name: 'Paris', country: 'France', lat: 48.8566, lng: 2.3522, image: cityImages.Paris },
    { id: 102, name: 'Nice', country: 'France', lat: 43.7102, lng: 7.262, image: cityImages.Nice },
    { id: 103, name: 'Lyon', country: 'France', lat: 45.764, lng: 4.8357, image: cityImages.Lyon },
    { id: 104, name: 'Marseille', country: 'France', lat: 43.2965, lng: 5.3698, image: cityImages.Marseille },
  ],
  Spain: [
    { id: 201, name: 'Barcelona', country: 'Spain', lat: 41.3874, lng: 2.1685, image: cityImages.Barcelona },
    { id: 202, name: 'Madrid', country: 'Spain', lat: 40.4168, lng: -3.7038, image: cityImages.Madrid },
  ],
  Portugal: [
    { id: 301, name: 'Lisbon', country: 'Portugal', lat: 38.7223, lng: -9.1393, image: cityImages.Lisbon },
  ],
};

export const supportedCountries = [
  {
    code: 'MA',
    name: 'Maroc',
    englishName: 'Morocco',
    description: 'Contenu complet disponible par ville',
  },
  {
    code: 'FR',
    name: 'France',
    englishName: 'France',
    description: 'Exploration via carte et position actuelle',
  },
  {
    code: 'ES',
    name: 'Espagne',
    englishName: 'Spain',
    description: 'Exploration via carte et position actuelle',
  },
  {
    code: 'PT',
    name: 'Portugal',
    englishName: 'Portugal',
    description: 'Exploration via carte et position actuelle',
  },
];

export const supportedCitiesByCountry: Record<string, typeof moroccoCities> = {
  Morocco: moroccoCities,
  France: citiesByCountry.France,
  Spain: citiesByCountry.Spain,
  Portugal: citiesByCountry.Portugal,
};
