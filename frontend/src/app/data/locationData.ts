import { cities } from './mockData';

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

export const supportedCitiesByCountry: Record<string, typeof cities> = {
  Morocco: cities.filter((city) => city.country === 'Morocco'),
};
