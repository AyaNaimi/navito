// Navito Mobile - Shared Data
// Adapted from web mockData for React Native

export const cityImages: Record<string, string> = {
  Marrakech: 'https://images.unsplash.com/photo-1597212618440-806262de4f6b?auto=format&fit=crop&w=1200&q=80',
  Fes: 'https://images.unsplash.com/photo-1578895101408-1a36b834405b?auto=format&fit=crop&w=1200&q=80',
  Casablanca: 'https://images.unsplash.com/photo-1539020140153-e479b8c22e70?auto=format&fit=crop&w=1200&q=80',
  Rabat: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1200&q=80',
  Tanger: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?auto=format&fit=crop&w=1200&q=80',
  Agadir: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
  Beijing: 'https://images.unsplash.com/photo-1594522591159-2e7e7d32e4b2?auto=format&fit=crop&w=1200&q=80',
  Shanghai: 'https://images.unsplash.com/photo-1548266652-99cf277df528?auto=format&fit=crop&w=1200&q=80',
  Guangzhou: 'https://images.unsplash.com/photo-1533236531158-86fa9a148e78?auto=format&fit=crop&w=1200&q=80',
  Shenzhen: 'https://images.unsplash.com/photo-1559299167-d3f9e80a7a4f?auto=format&fit=crop&w=1200&q=80',
  Chengdu: 'https://images.unsplash.com/photo-1603927594008-78f8bde14c9e?auto=format&fit=crop&w=1200&q=80',
  Paris: 'https://images.unsplash.com/photo-1502602898657-3e91759c8c5a?auto=format&fit=crop&w=1200&q=80',
  Nice: 'https://images.unsplash.com/photo-1514890547350-a9c9b4e6c6d6?auto=format&fit=crop&w=1200&q=80',
  Lyon: 'https://images.unsplash.com/photo-1550340499-a6aa9a28a9d6?auto=format&fit=crop&w=1200&q=80',
  Barcelona: 'https://images.unsplash.com/photo-1583422409516-2895a4efbba8?auto=format&fit=crop&w=1200&q=80',
  Madrid: 'https://images.unsplash.com/photo-1539037116277-4db208895f67?auto=format&fit=crop&w=1200&q=80',
  Lisbon: 'https://images.unsplash.com/photo-1585208798174-6cedd86e019a?auto=format&fit=crop&w=1200&q=80',
  Tokyo: 'https://images.unsplash.com/photo-1540959733332-eab4deab37af?auto=format&fit=crop&w=1200&q=80',
  Rome: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=1200&q=80',
  London: 'https://images.unsplash.com/photo-1513635269975-2e4d4f76eb6b?auto=format&fit=crop&w=1200&q=80',
  NewYork: 'https://images.unsplash.com/photo-1485871981521-5b1f3807677e?auto=format&fit=crop&w=1200&q=80',
  Dubai: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80',
  Istanbul: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a720d7?auto=format&fit=crop&w=1200&q=80',
  Cairo: 'https://images.unsplash.com/photo-1572252009286-268acec5ca0a7?auto=format&fit=crop&w=1200&q=80',
};

export const cities = [
  { id: 1, name: 'Marrakech', country: 'Morocco', lat: 31.6295, lng: -7.9811, image: cityImages.Marrakech },
  { id: 2, name: 'Fès', country: 'Morocco', lat: 34.0181, lng: -5.0078, image: cityImages.Fes },
  { id: 3, name: 'Casablanca', country: 'Morocco', lat: 33.5731, lng: -7.5898, image: cityImages.Casablanca },
  { id: 4, name: 'Rabat', country: 'Morocco', lat: 34.0209, lng: -6.8416, image: cityImages.Rabat },
  { id: 5, name: 'Tanger', country: 'Morocco', lat: 35.7595, lng: -5.834, image: cityImages.Tanger },
  { id: 6, name: 'Agadir', country: 'Morocco', lat: 30.4278, lng: -9.5981, image: cityImages.Agadir },
  { id: 7, name: 'Beijing', country: 'China', lat: 39.9042, lng: 116.4074, image: cityImages.Beijing },
  { id: 8, name: 'Shanghai', country: 'China', lat: 31.2304, lng: 121.4737, image: cityImages.Shanghai },
  { id: 9, name: 'Guangzhou', country: 'China', lat: 23.1291, lng: 113.2644, image: cityImages.Guangzhou },
  { id: 10, name: 'Shenzhen', country: 'China', lat: 22.5431, lng: 114.0579, image: cityImages.Shenzhen },
  { id: 11, name: 'Chengdu', country: 'China', lat: 30.5728, lng: 104.0668, image: cityImages.Chengdu },
  { id: 12, name: 'Paris', country: 'France', lat: 48.8566, lng: 2.3522, image: cityImages.Paris },
  { id: 13, name: 'Nice', country: 'France', lat: 43.7102, lng: 7.262, image: cityImages.Nice },
  { id: 14, name: 'Lyon', country: 'France', lat: 45.764, lng: 4.8357, image: cityImages.Lyon },
  { id: 15, name: 'Barcelona', country: 'Spain', lat: 41.3874, lng: 2.1685, image: cityImages.Barcelona },
  { id: 16, name: 'Madrid', country: 'Spain', lat: 40.4168, lng: -3.7038, image: cityImages.Madrid },
  { id: 17, name: 'Lisbon', country: 'Portugal', lat: 38.7223, lng: -9.1393, image: cityImages.Lisbon },
  { id: 18, name: 'Tokyo', country: 'Japan', lat: 35.6762, lng: 139.6503, image: cityImages.Tokyo },
  { id: 19, name: 'Rome', country: 'Italy', lat: 41.9028, lng: 12.4964, image: cityImages.Rome },
  { id: 20, name: 'London', country: 'United Kingdom', lat: 51.5074, lng: -0.1278, image: cityImages.London },
  { id: 21, name: 'New York', country: 'United States', lat: 40.7128, lng: -74.006, image: cityImages.NewYork },
  { id: 22, name: 'Dubai', country: 'United Arab Emirates', lat: 25.2048, lng: 55.2708, image: cityImages.Dubai },
  { id: 23, name: 'Istanbul', country: 'Turkey', lat: 41.0082, lng: 28.9784, image: cityImages.Istanbul },
  { id: 24, name: 'Cairo', country: 'Egypt', lat: 30.0444, lng: 31.2357, image: cityImages.Cairo },
];

export const monuments = [
  {
    id: 1,
    name: 'Koutoubia Mosque',
    city: 'Marrakech',
    description: 'The largest mosque in Marrakech, with its iconic 77m minaret visible from miles away.',
    price: 'Free',
    hours: 'Sat-Thu: 9:00 AM - 5:00 PM',
    rating: 4.8,
    reviews: 2847,
    image: cityImages.Marrakech,
    lat: 31.6295,
    lng: -7.9929,
    category: 'Historical',
    duration: '1-2 hours',
    tips: 'Dress modestly. Non-Muslims cannot enter but can admire from outside.',
    isPromoted: false,
  },
  {
    id: 2,
    name: 'Bou Inania Madrasa',
    city: 'Fès',
    description: 'A stunning example of Marinid architecture, this 14th-century madrasa is one of the few religious sites open to non-Muslims.',
    price: '20 MAD',
    hours: 'Daily: 9:00 AM - 5:00 PM',
    rating: 4.7,
    reviews: 1523,
    image: cityImages.Fes,
    lat: 34.0636,
    lng: -4.9761,
    category: 'Historical',
    duration: '45 min - 1 hour',
    tips: 'Visit early morning for the best light and fewer crowds.',
    isPromoted: true,
  },
  {
    id: 3,
    name: 'Hassan II Mosque',
    city: 'Casablanca',
    description: 'One of the largest mosques in the world, featuring stunning oceanfront location.',
    price: '120 MAD',
    hours: 'Guided tours: 9 AM, 10 AM, 11 AM, 2 PM',
    rating: 4.9,
    reviews: 5632,
    image: cityImages.Casablanca,
    lat: 33.6084,
    lng: -7.6321,
    category: 'Religious',
    duration: '2-3 hours',
    tips: 'Book tours in advance. Photography allowed.',
    isPromoted: true,
  },
];

export const restaurants = [
  {
    id: 1,
    name: 'Le Jardin',
    city: 'Marrakech',
    cuisine: 'Moroccan',
    priceRange: '$$',
    avgPrice: 150,
    rating: 4.6,
    reviews: 847,
    image: cityImages.Marrakech,
    lat: 31.6295,
    lng: -7.9929,
    hours: '11:00 AM - 11:00 PM',
    halal: true,
    description: 'Beautiful garden restaurant in the heart of the Medina.',
    isPromoted: true,
    promotionLevel: 'premium',
  },
  {
    id: 2,
    name: 'Café Clock',
    city: 'Fès',
    cuisine: 'Fusion',
    priceRange: '$',
    avgPrice: 80,
    rating: 4.5,
    reviews: 523,
    image: cityImages.Fes,
    lat: 34.0636,
    lng: -4.9761,
    hours: '9:00 AM - 10:00 PM',
    halal: true,
    description: 'Famous for camel burgers and cultural events.',
    isPromoted: false,
    promotionLevel: null,
  },
  {
    id: 3,
    name: "Rick's Café",
    city: 'Casablanca',
    cuisine: 'International',
    priceRange: '$$$',
    avgPrice: 300,
    rating: 4.4,
    reviews: 1256,
    image: cityImages.Casablanca,
    lat: 33.5883,
    lng: -7.6114,
    hours: '12:00 PM - 3:00 PM, 6:30 PM - 11:00 PM',
    halal: false,
    description: 'Inspired by the classic movie Casablanca.',
    isPromoted: true,
    promotionLevel: 'standard',
  },
];

export const activities = [
  {
    id: 1,
    name: 'Hot Air Balloon Ride over Marrakech',
    city: 'Marrakech',
    price: 1800,
    duration: '4 hours',
    rating: 4.9,
    reviews: 342,
    image: cityImages.Marrakech,
    category: 'Adventure',
    groupSize: '2-16 people',
    includes: 'Hotel pickup, breakfast, certificate',
    description: 'Experience breathtaking sunrise views over the Atlas Mountains and Berber villages.',
    isPromoted: true,
  },
  {
    id: 2,
    name: 'Fes Medina Walking Tour',
    city: 'Fès',
    price: 200,
    duration: '3 hours',
    rating: 4.7,
    reviews: 567,
    image: cityImages.Fes,
    category: 'Cultural',
    groupSize: '1-15 people',
    includes: 'Licensed guide, traditional mint tea',
    description: 'Explore the UNESCO World Heritage medina with a local expert guide.',
    isPromoted: false,
  },
];

export const drivers = [
  {
    id: 1,
    name: 'Ahmed Ben Ali',
    rating: 4.8,
    reviews: 247,
    vehicleType: 'Petit Taxi',
    available: true,
    distance: 0.5,
    pricePerKm: 7,
    image: 'https://i.pravatar.cc/150?img=12',
    languages: ['Arabic', 'French', 'English'],
    verified: true,
    responseTime: '2 min',
  },
  {
    id: 2,
    name: 'Fatima Zahra',
    rating: 4.9,
    reviews: 189,
    vehicleType: 'Grand Taxi',
    available: true,
    distance: 1.2,
    pricePerKm: 10,
    image: 'https://i.pravatar.cc/150?img=45',
    languages: ['Arabic', 'French'],
    verified: true,
    responseTime: '5 min',
  },
  {
    id: 3,
    name: 'Youssef Amrani',
    rating: 4.7,
    reviews: 156,
    vehicleType: 'Petit Taxi',
    available: false,
    distance: 2.1,
    pricePerKm: 7,
    image: 'https://i.pravatar.cc/150?img=33',
    languages: ['Arabic', 'English', 'Spanish'],
    verified: true,
    responseTime: '3 min',
  },
];

export const guides = [
  {
    id: 1,
    name: 'Khadija El Mansouri',
    city: 'Marrakech',
    rating: 4.9,
    reviews: 198,
    specialty: 'Medina & souks',
    pricePerHalfDay: 350,
    image: 'https://i.pravatar.cc/150?img=32',
    languages: ['Arabic', 'French', 'English'],
    verified: true,
    responseTime: '4 min',
    experience: '6 years',
    available: true,
  },
  {
    id: 2,
    name: 'Yassine Bennis',
    city: 'Fès',
    rating: 4.8,
    reviews: 164,
    specialty: 'Historical monuments',
    pricePerHalfDay: 320,
    image: 'https://i.pravatar.cc/150?img=15',
    languages: ['Arabic', 'French', 'Spanish'],
    verified: true,
    responseTime: '6 min',
    experience: '5 years',
    available: true,
  },
  {
    id: 3,
    name: 'Salma Chraibi',
    city: 'Casablanca',
    rating: 4.7,
    reviews: 143,
    specialty: 'Art deco & food tours',
    pricePerHalfDay: 300,
    image: 'https://i.pravatar.cc/150?img=20',
    languages: ['Arabic', 'French', 'English'],
    verified: true,
    responseTime: '5 min',
    experience: '4 years',
    available: true,
  },
];

export const transportOptions = [
  {
    id: 1,
    title: 'Petit Taxi',
    description: 'Small taxis for city travel. Use the meter. Avg: 7-8 MAD/km',
    image: 'https://images.unsplash.com/photo-1519003722824-194d4455a60c?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 2,
    title: 'Grand Taxi',
    description: 'Shared taxis for inter-city travel. Avg: 10-12 MAD/km',
    image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 3,
    title: 'City Bus',
    description: 'Affordable public transport. Avg: 4-7 MAD per trip',
    image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 4,
    title: 'ONCF Train',
    description: 'Comfortable inter-city rail travel',
    image: 'https://images.unsplash.com/photo-1474487548417-781cb71495f3?auto=format&fit=crop&w=1200&q=80',
  },
];

export const groupActivities = [
  {
    id: 1,
    title: 'Desert Sunset Photography Walk',
    organizer: 'Sarah Mitchell',
    organizerImage: 'https://i.pravatar.cc/150?img=47',
    city: 'Marrakech',
    date: '2026-03-28',
    time: '17:00',
    duration: '3 hours',
    participants: 4,
    maxParticipants: 8,
    level: 'Beginner',
    description: 'Join us for a magical sunset walk in the Agafay Desert. Perfect for photography enthusiasts!',
    meetingPoint: 'Jemaa el-Fnaa Square',
    image: cityImages.Marrakech,
  },
  {
    id: 2,
    title: 'Traditional Cooking Class',
    organizer: 'Marco Rossi',
    organizerImage: 'https://i.pravatar.cc/150?img=68',
    city: 'Fès',
    date: '2026-03-26',
    time: '10:00',
    duration: '4 hours',
    participants: 6,
    maxParticipants: 10,
    level: 'All levels',
    description: 'Learn to cook authentic Moroccan tagine and couscous with a local chef.',
    meetingPoint: 'Bab Boujloud',
    image: cityImages.Fes,
  },
];

export const emergencyNumbers = [
  { service: 'Police', number: '19', icon: 'shield' },
  { service: 'Gendarmerie Royale', number: '177', icon: 'shield-alert' },
  { service: 'Ambulance', number: '15', icon: 'ambulance' },
  { service: 'Pompiers (Fire)', number: '15', icon: 'flame' },
  { service: 'Protection Civile', number: '150', icon: 'life-buoy' },
];

export const antiScamTips = [
  {
    id: 1,
    title: 'Fake Tour Guides',
    icon: 'user-x',
    description: 'Always use licensed guides with official badges. Politely decline unsolicited guide offers.',
    severity: 'high',
  },
  {
    id: 2,
    title: 'Taxi Without Meter',
    icon: 'car',
    description: 'Insist on using the meter. Normal rate: 7-8 MAD/km. Night rate (after 8 PM): +50%.',
    severity: 'high',
  },
  {
    id: 3,
    title: 'Souk Price Inflation',
    icon: 'shopping-bag',
    description: 'Expect to negotiate. Start at 50% of the asking price. Know reference prices.',
    severity: 'medium',
  },
  {
    id: 4,
    title: 'Photo Fees',
    icon: 'camera',
    description: 'Some people in traditional dress may demand payment after you photograph them.',
    severity: 'low',
  },
  {
    id: 5,
    title: 'Currency Exchange Scams',
    icon: 'banknote',
    description: 'Use official exchange bureaus or banks. Avoid street money changers.',
    severity: 'high',
  },
];

export const referencePrices = [
  { item: 'Bottle of Water (1.5L)', price: '5-8 MAD', category: 'Beverages' },
  { item: 'Fresh Orange Juice', price: '5-10 MAD', category: 'Beverages' },
  { item: 'Mint Tea', price: '8-15 MAD', category: 'Beverages' },
  { item: 'Street Food Sandwich', price: '15-25 MAD', category: 'Food' },
  { item: 'Tagine (Restaurant)', price: '50-120 MAD', category: 'Food' },
  { item: 'Couscous (Restaurant)', price: '60-150 MAD', category: 'Food' },
  { item: 'Petit Taxi (per km)', price: '7-8 MAD', category: 'Transport' },
  { item: 'Grand Taxi (per km)', price: '10-12 MAD', category: 'Transport' },
  { item: 'Bus Ticket (City)', price: '4-7 MAD', category: 'Transport' },
  { item: 'Leather Babouches', price: '100-300 MAD', category: 'Souvenirs' },
  { item: 'Small Carpet', price: '400-1500 MAD', category: 'Souvenirs' },
  { item: 'Argan Oil (100ml)', price: '80-150 MAD', category: 'Souvenirs' },
];

export const commonPhrases = [
  { arabic: 'السلام عليكم', darija: 'Salam alaykum', french: 'Bonjour', english: 'Hello' },
  { arabic: 'شكرا', darija: 'Shukran', french: 'Merci', english: 'Thank you' },
  { arabic: 'من فضلك', darija: 'Afak', french: "S'il vous plaît", english: 'Please' },
  { arabic: 'كم الثمن؟', darija: 'Shhal?', french: 'Combien?', english: 'How much?' },
  { arabic: 'أين...؟', darija: 'Fin...?', french: 'Où est...?', english: 'Where is...?' },
  { arabic: 'لا أفهم', darija: 'Ma fhemt-sh', french: 'Je ne comprends pas', english: "I don't understand" },
  { arabic: 'نعم', darija: 'Iyyeh/Wah', french: 'Oui', english: 'Yes' },
  { arabic: 'لا', darija: 'La', french: 'Non', english: 'No' },
];

export const onboardingSlides = [
  'Smart navigation for travelers in Morocco.',
  'Trusted transport, guides, and local experiences.',
  'Safety, pricing, translation, and community in one app.',
];

export const languages = ['English', 'Français', 'العربية', '中文'];
export const countries = [
  'Morocco', 'France', 'Spain', 'Portugal', 'China',
  'Italy', 'Germany', 'United Kingdom', 'United States',
  'Japan', 'Thailand', 'Turkey', 'Egypt', 'Tunisia',
  'Greece', 'Brazil', 'Mexico', 'India', 'Australia', 'Canada',
  'United Arab Emirates'
];

export const getCitiesByCountry = (country: string) => cities.filter(city => city.country === country);

export const monthlyRevenue = [
  { month: 'Jan', revenue: 8400, trips: 220 },
  { month: 'Feb', revenue: 9200, trips: 248 },
  { month: 'Mar', revenue: 10100, trips: 271 },
  { month: 'Apr', revenue: 11600, trips: 293 },
  { month: 'May', revenue: 12400, trips: 315 },
  { month: 'Jun', revenue: 13600, trips: 348 },
];

export const monthlyStats = [
  { label: 'Réservations Totales', value: '1,284', change: '+12.5%', positive: true },
  { label: 'Nouveaux Visiteurs', value: '842', change: '+8.2%', positive: true },
  { label: 'Revenus', value: '124,500 MAD', change: '+15.3%', positive: true },
];

export const adminUsers = [
  { id: 'USR-001', name: 'Youssef Driver', email: 'youssef.driver@navito.app', role: 'driver', status: 'verified', city: 'Marrakech' },
  { id: 'USR-002', name: 'Amina Guide', email: 'amina.guide@navito.app', role: 'guide', status: 'verified', city: 'Fes' },
  { id: 'USR-003', name: 'Lina Tourist', email: 'lina.tourist@navito.app', role: 'tourist', status: 'active', city: 'Rabat' },
  { id: 'USR-004', name: 'Omar Driver', email: 'omar.driver@navito.app', role: 'driver', status: 'pending', city: 'Casablanca' },
];

export const adminDrivers = [
  { id: 'DRV-101', name: 'Youssef Driver', vehicle: 'Toyota Prius', city: 'Marrakech', rating: 4.9, trips: 238, verification: 'verified' },
  { id: 'DRV-102', name: 'Omar Driver', vehicle: 'Dacia Logan', city: 'Casablanca', rating: 4.6, trips: 96, verification: 'pending' },
  { id: 'DRV-103', name: 'Hassan Driver', vehicle: 'Mercedes Vito', city: 'Tanger', rating: 4.8, trips: 156, verification: 'verified' },
  { id: 'DRV-104', name: 'Ali Driver', vehicle: 'Peugeot 301', city: 'Agadir', rating: 4.5, trips: 72, verification: 'verified' },
];

export const adminGuides = [
  { id: 'GDE-201', name: 'Amina Guide', language: 'French, English, Arabic', city: 'Fes', rating: 4.8, tours: 154, verification: 'verified' },
  { id: 'GDE-202', name: 'Salma Guide', language: 'Spanish, English', city: 'Chefchaouen', rating: 4.7, tours: 88, verification: 'pending' },
  { id: 'GDE-203', name: 'Youssef Guide', language: 'English, Arabic, French', city: 'Marrakech', rating: 4.9, tours: 203, verification: 'verified' },
  { id: 'GDE-204', name: 'Fatima Guide', language: 'German, English', city: 'Casablanca', rating: 4.6, tours: 64, verification: 'verified' },
];

export const adminActivities = [
  { id: 'ACT-301', title: 'Medina Street Food Walk', city: 'Marrakech', host: 'Amina Guide', participants: 14, status: 'published', price: '450 MAD' },
  { id: 'ACT-302', title: 'Atlas Sunrise Tour', city: 'Imlil', host: 'Salma Guide', participants: 7, status: 'review', price: '1200 MAD' },
  { id: 'ACT-303', title: 'Desert Evening Camp', city: 'Merzouga', host: 'Travel Ops', participants: 21, status: 'published', price: '2500 MAD' },
  { id: 'ACT-304', title: 'Blue City Tour', city: 'Chefchaouen', host: 'Youssef Guide', participants: 10, status: 'published', price: '600 MAD' },
  { id: 'ACT-305', title: 'Volubilis Roman Ruins', city: 'Meknes', host: 'Fatima Guide', participants: 8, status: 'published', price: '350 MAD' },
];

export const adminMessages = [
  { id: 'MSG-001', name: 'Hôtel Mamounia', text: 'Confirmation pour la suite VIP', time: '11:03', unread: 1, avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=Mamounia' },
  { id: 'MSG-002', name: 'Yassine Guide', text: 'Le groupe est bien arrivé à Imlil.', time: '14:30', unread: 0, avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=Yassine' },
  { id: 'MSG-003', name: 'Sarah Miller', text: 'Question sur le transfert', time: '09:45', unread: 3, avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=Sarah' },
  { id: 'MSG-004', name: 'Marco Rossi', text: 'Merci pour le circuit', time: '16:20', unread: 0, avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=Marco' },
];

export const driverRequests = [
  { id: 'TRP-1001', origin: 'Airport Terminal 2', destination: 'Old Medina', fare: 70, travelTimeMin: 24, distanceKm: 12.4, status: 'pending', requestedAt: '2 min ago', pickupCoords: [34.0494, -6.7516], destinationCoords: [34.0242, -6.8361] },
  { id: 'TRP-1002', origin: 'City Center', destination: 'Blue Port', fare: 55, travelTimeMin: 14, distanceKm: 7.1, status: 'pending', requestedAt: '5 min ago', pickupCoords: [34.0209, -6.8416], destinationCoords: [34.0072, -6.8289] },
  { id: 'TRP-1003', origin: 'Museum District', destination: 'Sunset Boulevard', fare: 62, travelTimeMin: 18, distanceKm: 9.3, status: 'active', requestedAt: 'Live', pickupCoords: [34.0357, -6.8094], destinationCoords: [34.0491, -6.7747] },
];

export const guideBookings = [
  { id: 'BK-201', touristName: 'Emma Johnson', date: '2026-04-03', destination: 'Historic Quarter Walk', groupSize: 4, status: 'upcoming' },
  { id: 'BK-202', touristName: 'Luca Rossi', date: '2026-04-04', destination: 'Mountain Village Tour', groupSize: 2, status: 'upcoming' },
  { id: 'BK-203', touristName: 'Amina Saeed', date: '2026-03-31', destination: 'Food & Culture Trail', groupSize: 6, status: 'in_progress' },
  { id: 'BK-204', touristName: 'John Smith', date: '2026-04-05', destination: 'Desert Adventure', groupSize: 3, status: 'upcoming' },
];

export const featuredPackages = [
  { id: 'PKG-001', title: 'Dunes de Merzouga', location: 'Erg Chebbi, Maroc', price: '4,500 MAD', image: 'https://images.unsplash.com/photo-1509233725247-49e657c54213?auto=format&fit=crop&q=80&w=300', duration: '3 jours', rating: 4.9 },
  { id: 'PKG-002', title: 'Médina de Fès', location: 'Fès, Maroc', price: '2,800 MAD', image: 'https://images.unsplash.com/photo-1549944850-84e00be4203b?auto=format&fit=crop&q=80&w=300', duration: '2 jours', rating: 4.7 },
  { id: 'PKG-003', title: 'Haut Atlas Trek', location: 'Imlil, Maroc', price: '5,200 MAD', image: 'https://images.unsplash.com/photo-1580741603417-64906354897f?auto=format&fit=crop&q=80&w=300', duration: '4 jours', rating: 4.8 },
  { id: 'PKG-004', title: 'Chefchaouen Blue City', location: 'Chefchaouen, Maroc', price: '1,500 MAD', image: 'https://images.unsplash.com/photo-1548048026-5a1a941d93d3?auto=format&fit=crop&q=80&w=300', duration: '1 jour', rating: 4.6 },
];

export const upcomingTrips = [
  { id: 'TRIP-001', title: 'Escapade Romantique', location: 'Chefchaouen, Maroc', date: '12 - 15 Mai', users: 2, image: 'https://images.unsplash.com/photo-1548048026-5a1a941d93d3?auto=format&fit=crop&q=80&w=150' },
  { id: 'TRIP-002', title: 'Circuit des Villes Impériales', location: 'Rabat & Meknès', date: '18 - 25 Mai', users: 14, image: 'https://images.unsplash.com/photo-1517482813511-df4295982823?auto=format&fit=crop&q=80&w=150' },
];

export const destinationData = [
  { name: 'Marrakech', value: 45 },
  { name: 'Merzouga', value: 25 },
  { name: 'Chefchaouen', value: 20 },
  { name: 'Fès', value: 10 },
];
