import {
  activities,
  cities,
  communityItems,
  countries,
  drivers,
  guides,
  languages,
  onboardingSlides,
  restaurants,
  safetyCards,
} from './navitoData';

export type Screen =
  | 'splash'
  | 'onboarding'
  | 'language'
  | 'login'
  | 'register'
  | 'country'
  | 'city'
  | 'home'
  | 'explore'
  | 'activityDetail'
  | 'restaurantDetail'
  | 'checkout'
  | 'transport'
  | 'taxiSimulator'
  | 'restaurants'
  | 'guide'
  | 'safety'
  | 'community'
  | 'profile'
  | 'ocrTranslator'
  | 'priceEstimator'
  | 'applyForm'
  | 'guideRequestForm'
  | 'driverJoin'
  | 'driverVerifyIdentity'
  | 'driverPendingApproval'
  | 'driverProfile';

export type CardItem = {
  title: string;
  subtitle?: string;
  meta?: string;
  action?: Screen;
};

export type ScreenConfig = {
  eyebrow: string;
  title: string;
  subtitle: string;
  cards?: CardItem[];
  actions?: { label: string; target: Screen; secondary?: boolean }[];
};

export const mainTabs: Screen[] = ['home', 'explore', 'transport', 'restaurants', 'guide', 'safety', 'community', 'profile'];

export const screenLabels: Record<Screen, string> = {
  splash: 'Splash',
  onboarding: 'Onboarding',
  language: 'Language',
  login: 'Login',
  register: 'Register',
  country: 'Country',
  city: 'City',
  home: 'Home',
  explore: 'Explore',
  activityDetail: 'Activity',
  restaurantDetail: 'Restaurant',
  checkout: 'Checkout',
  transport: 'Transport',
  taxiSimulator: 'Taxi',
  restaurants: 'Food',
  guide: 'Guide',
  safety: 'Safety',
  community: 'Community',
  profile: 'Profile',
  ocrTranslator: 'OCR',
  priceEstimator: 'Price',
  applyForm: 'Apply',
  guideRequestForm: 'Request',
  driverJoin: 'Driver',
  driverVerifyIdentity: 'Verify',
  driverPendingApproval: 'Pending',
  driverProfile: 'Driver',
};

export const screenConfigs: Record<Screen, ScreenConfig> = {
  splash: {
    eyebrow: 'Navito',
    title: 'One travel companion for Morocco.',
    subtitle: 'Expo mobile now mirrors the main web product structure and design language.',
    actions: [{ label: 'Continue', target: 'onboarding' }],
  },
  onboarding: {
    eyebrow: 'Onboarding',
    title: 'Start with the same entry flow as web.',
    subtitle: 'The onboarding sequence has been recreated for mobile.',
    cards: onboardingSlides.map((title) => ({ title })),
    actions: [{ label: 'Choose language', target: 'language' }],
  },
  language: {
    eyebrow: 'Language',
    title: 'Select your language.',
    subtitle: 'Matches the first configuration step from the web app.',
    cards: languages.map((title) => ({ title })),
    actions: [{ label: 'Continue to login', target: 'login' }],
  },
  login: {
    eyebrow: 'Login',
    title: 'Access your Navito account.',
    subtitle: 'Native login screen aligned with the web flow.',
    cards: [
      { title: 'Email', subtitle: 'name@example.com' },
      { title: 'Password', subtitle: 'Your secure password' },
    ],
    actions: [
      { label: 'Sign in', target: 'country' },
      { label: 'Create account', target: 'register', secondary: true },
    ],
  },
  register: {
    eyebrow: 'Register',
    title: 'Create your account.',
    subtitle: 'Native version of the register screen.',
    cards: [
      { title: 'Full name', subtitle: 'Traveler name' },
      { title: 'Email', subtitle: 'name@example.com' },
      { title: 'Password', subtitle: 'Choose a password' },
    ],
    actions: [{ label: 'Continue', target: 'country' }],
  },
  country: {
    eyebrow: 'Country',
    title: 'Choose your current country.',
    subtitle: 'Country selection step carried over to mobile.',
    cards: countries.map((title) => ({ title })),
    actions: [{ label: 'Continue to city', target: 'city' }],
  },
  city: {
    eyebrow: 'City',
    title: 'Choose your destination city.',
    subtitle: 'City selection page available in mobile.',
    cards: cities.map((item) => ({ title: item.name, subtitle: item.country })),
    actions: [{ label: 'Enter home', target: 'home' }],
  },
  home: {
    eyebrow: 'Home',
    title: 'Welcome to your travel dashboard.',
    subtitle: 'Quick actions, highlights, and nearby experiences from the web home page.',
    cards: [
      { title: 'OCR Translator', subtitle: 'Instant OCR and phrase help', action: 'ocrTranslator' },
      { title: 'Price Estimator', subtitle: 'Fair local market ranges', action: 'priceEstimator' },
      { title: 'Transport', subtitle: 'Trusted local rides', action: 'transport' },
      { title: 'Safety', subtitle: 'Emergency tips and numbers', action: 'safety' },
      { title: activities[0].name, subtitle: activities[0].description, meta: activities[0].price, action: 'activityDetail' },
    ],
  },
  explore: {
    eyebrow: 'Explore',
    title: 'Browse monuments, food, and activities.',
    subtitle: 'Native discovery page aligned with web categories.',
    cards: [
      ...activities.map((item) => ({ title: item.name, subtitle: item.city, meta: item.price, action: 'activityDetail' as Screen })),
      ...restaurants.map((item) => ({ title: item.name, subtitle: `${item.cuisine} • ${item.city}`, meta: item.price, action: 'restaurantDetail' as Screen })),
    ],
  },
  activityDetail: {
    eyebrow: 'Activity Detail',
    title: activities[0].name,
    subtitle: activities[0].description,
    cards: [
      { title: 'Duration', subtitle: activities[0].duration },
      { title: 'Rating', subtitle: activities[0].rating },
      { title: 'Price', subtitle: activities[0].price },
    ],
    actions: [{ label: 'Continue to checkout', target: 'checkout' }],
  },
  restaurantDetail: {
    eyebrow: 'Restaurant Detail',
    title: restaurants[0].name,
    subtitle: restaurants[0].description,
    cards: [
      { title: 'Cuisine', subtitle: restaurants[0].cuisine },
      { title: 'Rating', subtitle: restaurants[0].rating },
      { title: 'Price', subtitle: restaurants[0].price },
    ],
    actions: [{ label: 'Continue to checkout', target: 'checkout' }],
  },
  checkout: {
    eyebrow: 'Checkout',
    title: 'Confirm your booking.',
    subtitle: 'Booking summary and purchase call to action.',
    cards: [{ title: activities[0].name, subtitle: 'Selected experience', meta: activities[0].price }],
    actions: [{ label: 'Book now', target: 'home' }],
  },
  transport: {
    eyebrow: 'Transport',
    title: 'Trusted local mobility.',
    subtitle: 'Drivers, handbook, and simulator flow in native mobile.',
    cards: drivers.map((item) => ({ title: item.name, subtitle: item.type, meta: `${item.price} • ${item.distance} • ${item.rating}` })),
    actions: [{ label: 'Open taxi simulator', target: 'taxiSimulator' }],
  },
  taxiSimulator: {
    eyebrow: 'Taxi Simulator',
    title: 'Estimate your fare.',
    subtitle: 'Native equivalent of the web taxi simulator.',
    cards: [
      { title: 'Pickup', subtitle: 'City center' },
      { title: 'Destination', subtitle: 'Hotel or attraction' },
      { title: 'Estimated fare', subtitle: '48 MAD' },
    ],
  },
  restaurants: {
    eyebrow: 'Restaurants',
    title: 'Find nearby food spots.',
    subtitle: 'Restaurant list and discovery cards in mobile.',
    cards: restaurants.map((item) => ({ title: item.name, subtitle: `${item.cuisine} • ${item.city}`, meta: item.price, action: 'restaurantDetail' })),
  },
  guide: {
    eyebrow: 'Guide',
    title: 'Book a local guide.',
    subtitle: 'Guide listing and request journey reproduced in native mobile.',
    cards: guides.map((item) => ({ title: item.name, subtitle: item.specialty, meta: `${item.city} • ${item.price} • ${item.rating}` })),
    actions: [{ label: 'Request a guide', target: 'guideRequestForm' }],
  },
  safety: {
    eyebrow: 'Safety',
    title: 'Emergency and anti-scam essentials.',
    subtitle: 'Core safety information from the web experience.',
    cards: safetyCards.map((item) => ({ title: item.title, subtitle: item.detail })),
  },
  community: {
    eyebrow: 'Community',
    title: 'Join group activities.',
    subtitle: 'Community feed and collaborative experiences mirrored on mobile.',
    cards: communityItems.map((item) => ({ title: item.title, subtitle: `${item.city} • ${item.date}`, meta: `${item.level} • ${item.participants}` })),
    actions: [{ label: 'Create activity', target: 'applyForm' }],
  },
  profile: {
    eyebrow: 'Profile',
    title: 'Manage account and preferences.',
    subtitle: 'Profile and account actions aligned with the web app.',
    cards: [
      { title: 'Saved places' },
      { title: 'Bookings' },
      { title: 'Notifications' },
      { title: 'Settings' },
      { title: 'Driver profile', action: 'driverProfile' },
    ],
  },
  ocrTranslator: {
    eyebrow: 'OCR Translator',
    title: 'Translate text from images.',
    subtitle: 'Mobile version of the OCR utility screen.',
    cards: [{ title: 'Capture image', subtitle: 'Extract text and translate it instantly.' }],
  },
  priceEstimator: {
    eyebrow: 'Price Estimator',
    title: 'Verify local price fairness.',
    subtitle: 'Mobile equivalent of the pricing utility page.',
    cards: [{ title: 'Detected item', subtitle: '15 - 45 MAD', meta: 'Fair local market range' }],
  },
  applyForm: {
    eyebrow: 'Apply',
    title: 'Submit your application.',
    subtitle: 'Shared application page for activity, guide, and driver flows.',
    cards: [
      { title: 'Full name', subtitle: 'Applicant name' },
      { title: 'Specialty', subtitle: 'Role or offer' },
      { title: 'Price', subtitle: 'Optional pricing' },
      { title: 'Notes', subtitle: 'More details about the experience' },
    ],
    actions: [{ label: 'Submit application', target: 'community' }],
  },
  guideRequestForm: {
    eyebrow: 'Guide Request',
    title: `Request ${guides[0].name}`,
    subtitle: 'Native guide request form equivalent to the web page.',
    cards: [
      { title: 'Type of guidance', subtitle: 'Historical tour' },
      { title: 'Duration', subtitle: 'Half day' },
      { title: 'Meeting point', subtitle: guides[0].city },
    ],
    actions: [{ label: 'Send request', target: 'guide' }],
  },
  driverJoin: {
    eyebrow: 'Driver Join',
    title: 'Join as a driver.',
    subtitle: 'Native onboarding page for driver registration.',
    cards: [
      { title: 'Full name', subtitle: 'Driver profile' },
      { title: 'Vehicle type', subtitle: 'Sedan or SUV' },
      { title: 'Operating city', subtitle: 'Marrakech' },
    ],
    actions: [{ label: 'Continue to verify', target: 'driverVerifyIdentity' }],
  },
  driverVerifyIdentity: {
    eyebrow: 'Driver Verify',
    title: 'Upload driver documents.',
    subtitle: 'Driver verification step mirrored from web.',
    cards: [
      { title: 'Driver license', subtitle: 'PDF, PNG, or JPG' },
      { title: 'Insurance', subtitle: 'Professional insurance document' },
    ],
    actions: [{ label: 'Submit for review', target: 'driverPendingApproval' }],
  },
  driverPendingApproval: {
    eyebrow: 'Driver Pending',
    title: 'Verification in progress.',
    subtitle: 'Pending review status screen for the driver flow.',
    cards: [
      { title: 'Driver license', subtitle: 'Submitted' },
      { title: 'National ID', subtitle: 'Submitted' },
      { title: 'Insurance', subtitle: 'Submitted' },
      { title: 'Vehicle inspection', subtitle: 'Pending' },
    ],
    actions: [{ label: 'Back to home', target: 'home' }],
  },
  driverProfile: {
    eyebrow: 'Driver Profile',
    title: 'Manage driver account.',
    subtitle: 'Native equivalent of the chauffeur profile and documents screen.',
    cards: [
      { title: 'Phone' },
      { title: 'Email' },
      { title: 'Vehicle' },
      { title: 'Plate number' },
      { title: 'Documents' },
      { title: 'Availability' },
    ],
  },
};

