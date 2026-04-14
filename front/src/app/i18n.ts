import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const fr = {
  translation: {
    nav: {
      home: "Accueil",
      explore: "Explorer",
      transport: "Transport",
      guide: "Guide",
      community: "Communauté",
    },
    common: {
      yes: "Oui",
      no: "Non",
      cancel: "Annuler",
      continue: "Continuer",
      skip: "Passer",
      change: "Changer",
      seeAll: "Tout voir",
      search: "Rechercher...",
      signOut: "Se déconnecter",
      loading: "Chargement...",
      free: "Gratuit",
    },
    language: {
      title: "Choisissez votre langue",
      subtitle: "C'est la première étape du flux Navito.",
      continue: "Continuer",
    },
    home: {
      welcome: "Bienvenue sur Navito",
      currentMap: "Carte actuelle",
      searchPlaceholder: "Explorer la destination...",
      translator: "OCR Traduction",
      priceCheck: "Prix",
      transport: "Transport",
      safety: "Sécurité",
      otherCities: "Autres villes",
      recommendedAround: "Recommandé autour de vous",
      mustSee: "Incontournables à {{city}}",
      experiences: "Expériences",
    },
    explore: {
      titleWithCity: "Explorer {{city}}",
      titleCurrentMap: "Explorer la Carte",
      searchPlaceholder: "Rechercher attractions, restaurants...",
      filters: "Filtres",
      minRating: "Note minimale",
      anyRating: "Toute note",
      loading: "Curations des résultats...",
      resultsFound: "{{count}} résultats trouvés",
      currentArea: "Votre zone actuelle",
      tabs: {
        all: "Tout",
        monument: "Monuments",
        restaurant: "Restaurants",
        activity: "Activités"
      }
    },
    profile: {
      title: "Profil",
      role: "{{role}}",
      language: "Langue",
      menu: {
        dashboard: "Tableau de Bord",
        guideRequests: "Demandes de Guide",
        mySchedule: "Mon Planning",
        rideRequests: "Demandes de Course",
        driverAlerts: "Alertes Pilote",
        platformOverview: "Aperçu Plateforme",
        adminSettings: "Paramètres Admin",
        notifications: "Notifications",
        settings: "Paramètres",
        support: "Support",
        savedPlaces: "Lieux Enregistrés",
        myBookings: "Mes Réservations",
        privacySafety: "Confidentialité",
        helpSupport: "Aide & Support",
      },
      roles: {
        tourist: {
          title: "Voyageur",
          description: "Explorez et vivez des expériences locales.",
          chips: { bookings: "Réservations", saved: "Enregistrés", support: "Support" }
        },
        guide: {
          title: "Guide Certifié",
          description: "Partagez votre expertise locale.",
          chips: { requests: "Demandes", schedule: "Planning", reviews: "Avis" }
        },
        driver: {
          title: "Chauffeur",
          description: "Assurez la mobilité locale.",
          chips: { queue: "File d'attente", availability: "Disponibilité", earnings: "Gains" }
        },
        admin: {
          title: "Administrateur",
          description: "Gérez la plateforme Navito.",
          chips: { users: "Utilisateurs", operations: "Opérations", reports: "Rapports" }
        }
      }
    }
  }
};

const en = {
  translation: {
    nav: {
      home: "Home",
      explore: "Explore",
      transport: "Transport",
      guide: "Guide",
      community: "Community",
    },
    common: {
      yes: "Yes",
      no: "No",
      cancel: "Cancel",
      continue: "Continue",
      skip: "Skip",
      change: "Change",
      seeAll: "See all",
      search: "Search...",
      signOut: "Sign Out",
      loading: "Loading...",
      free: "Free",
    },
    language: {
      title: "Choose your language",
      subtitle: "This is the first step of the Navito flow.",
      continue: "Continue",
    },
    home: {
      welcome: "Welcome to Navito",
      currentMap: "Current map",
      searchPlaceholder: "Explore destination...",
      translator: "OCR Translate",
      priceCheck: "Price Check",
      transport: "Transport",
      safety: "Safety",
      otherCities: "Other cities",
      recommendedAround: "Recommended around you",
      mustSee: "Must-see in {{city}}",
      experiences: "Experiences",
    },
    explore: {
      titleWithCity: "Explore {{city}}",
      titleCurrentMap: "Explore Map",
      searchPlaceholder: "Search attractions, restaurants...",
      filters: "Filters",
      minRating: "Min Rating",
      anyRating: "Any Rating",
      loading: "Curating results...",
      resultsFound: "{{count}} results found",
      currentArea: "Your current area",
      tabs: {
        all: "All",
        monument: "Monuments",
        restaurant: "Restaurants",
        activity: "Activities"
      }
    },
    profile: {
      title: "Profile",
      role: "{{role}}",
      language: "Language",
      menu: {
        dashboard: "Dashboard",
        guideRequests: "Guide Requests",
        mySchedule: "My Schedule",
        rideRequests: "Ride Requests",
        driverAlerts: "Driver Alerts",
        platformOverview: "Platform Overview",
        adminSettings: "Admin Settings",
        notifications: "Notifications",
        settings: "Settings",
        support: "Support",
        savedPlaces: "Saved Places",
        myBookings: "My Bookings",
        privacySafety: "Privacy & Safety",
        helpSupport: "Help & Support",
      },
      roles: {
        tourist: {
          title: "Traveler",
          description: "Explore and live local experiences.",
          chips: { bookings: "Bookings", saved: "Saved", support: "Support" }
        },
        guide: {
          title: "Certified Guide",
          description: "Share your local expertise.",
          chips: { requests: "Requests", schedule: "Schedule", reviews: "Reviews" }
        },
        driver: {
          title: "Professional Driver",
          description: "Ensure local mobility.",
          chips: { queue: "Queue", availability: "Availability", earnings: "Earnings" }
        },
        admin: {
          title: "Platform Admin",
          description: "Manage the Navito platform.",
          chips: { users: "Users", operations: "Operations", reports: "Reports" }
        }
      }
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources: { fr, en },
    lng: "fr",
    fallbackLng: "en",
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
