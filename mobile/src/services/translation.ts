export type SupportedLanguage = {
  code: string;
  label: string;
  nativeLabel: string;
  flag: string;
};

export const SUPPORTED_LANGUAGES: SupportedLanguage[] = [
  { code: 'en', label: 'English', nativeLabel: 'English', flag: '🇬🇧' },
  { code: 'fr', label: 'French', nativeLabel: 'Français', flag: '🇫🇷' },
  { code: 'ar', label: 'Arabic', nativeLabel: 'العربية', flag: '🇸🇦' },
  { code: 'zh', label: 'Chinese', nativeLabel: '中文', flag: '🇨🇳' },
];

export const DEFAULT_LANGUAGE = 'en';

export const translations = {
  en: {
    common: {
      continue: 'Continue',
      skip: 'Skip',
      cancel: 'Cancel',
      search: 'Search...',
      loading: 'Loading...',
      free: 'Free',
      yes: 'Yes',
      no: 'No',
      change: 'Change',
      seeAll: 'See all',
      signOut: 'Sign Out',
      back: 'Back',
    },
    language: {
      title: 'Choose your language',
      subtitle: 'Select your preferred language to explore Morocco',
    },
    home: {
      welcome: 'Welcome to Navito',
      currentMap: 'Current map',
      searchPlaceholder: 'Explore destination...',
      translator: 'OCR Translate',
      priceCheck: 'Price Check',
      transport: 'Transport',
      safety: 'Safety',
      otherCities: 'Other cities',
      recommendedAround: 'Recommended around you',
      mustSee: 'Must-see in {{city}}',
      experiences: 'Experiences',
    },
    explore: {
      titleWithCity: 'Explore {{city}}',
      searchPlaceholder: 'Search attractions, restaurants...',
      filters: 'Filters',
      minRating: 'Min Rating',
      anyRating: 'Any Rating',
      loading: 'Curating results...',
      resultsFound: '{{count}} results found',
      currentArea: 'Your current area',
      tabs: {
        all: 'All',
        monument: 'Monuments',
        restaurant: 'Restaurants',
        activity: 'Activities',
      },
    },
    transport: {
      title: 'Transport',
      petitTaxi: 'Petit Taxi',
      grandTaxi: 'Grand Taxi',
      cityBus: 'City Bus',
      oncfTrain: 'ONCF Train',
    },
    restaurants: {
      title: 'Restaurants',
      searchPlaceholder: 'Search restaurants...',
    },
    guide: {
      title: 'Guide',
      searchPlaceholder: 'Search guides...',
      bookGuide: 'Book a Guide',
    },
    safety: {
      title: 'Safety Tips',
      emergencyNumbers: 'Emergency Numbers',
      antiScamTips: 'Avoid Scams',
      referencePrices: 'Reference Prices',
      commonPhrases: 'Common Phrases',
    },
    community: {
      title: 'Community',
      groupActivities: 'Group Activities',
      joinActivity: 'Join Activity',
    },
    profile: {
      title: 'Profile',
      dashboard: 'Dashboard',
      settings: 'Settings',
      driverJoin: 'Join as Driver',
      guideRequest: 'Request a Guide',
      driverLogin: 'Driver Login',
      guideLogin: 'Guide Login',
      language: 'Language',
    },
    driver: {
      dashboard: 'Driver Dashboard',
      trips: 'Trips',
      messages: 'Messages',
      profile: 'Profile',
      reviews: 'Reviews',
      online: 'Online',
      offline: 'Offline',
      acceptTrip: 'Accept',
      declineTrip: 'Decline',
      callClient: 'Call',
      messageClient: 'Message',
      earnings: 'Earnings',
      rating: 'Rating',
      hotZone: 'Hot Zone',
      tripRequests: 'Trip Requests',
    },
    checkout: {
      title: 'Checkout',
      confirm: 'Confirm Booking',
      total: 'Total',
    },
    login: {
      title: 'Welcome Back',
      email: 'Email',
      password: 'Password',
      login: 'Login',
      register: 'Register',
      orContinueWith: 'Or continue with',
    },
  },
  fr: {
    common: {
      continue: 'Continuer',
      skip: 'Passer',
      cancel: 'Annuler',
      search: 'Rechercher...',
      loading: 'Chargement...',
      free: 'Gratuit',
      yes: 'Oui',
      no: 'Non',
      change: 'Changer',
      seeAll: 'Tout voir',
      signOut: 'Se déconnecter',
      back: 'Retour',
    },
    language: {
      title: 'Choisissez votre langue',
      subtitle: 'Sélectionnez votre langue préférée pour explorer le Maroc',
    },
    home: {
      welcome: 'Bienvenue sur Navito',
      currentMap: 'Carte actuelle',
      searchPlaceholder: 'Explorer la destination...',
      translator: 'OCR Traduction',
      priceCheck: 'Prix',
      transport: 'Transport',
      safety: 'Sécurité',
      otherCities: 'Autres villes',
      recommendedAround: 'Recommandé autour de vous',
      mustSee: 'Incontournables à {{city}}',
      experiences: 'Expériences',
    },
    explore: {
      titleWithCity: 'Explorer {{city}}',
      searchPlaceholder: 'Rechercher attractions, restaurants...',
      filters: 'Filtres',
      minRating: 'Note minimale',
      anyRating: 'Toute note',
      loading: 'Curations des résultats...',
      resultsFound: '{{count}} résultats trouvés',
      currentArea: 'Votre zone actuelle',
      tabs: {
        all: 'Tout',
        monument: 'Monuments',
        restaurant: 'Restaurants',
        activity: 'Activités',
      },
    },
    transport: {
      title: 'Transport',
      petitTaxi: 'Petit Taxi',
      grandTaxi: 'Grand Taxi',
      cityBus: 'Bus Urbain',
      oncfTrain: 'Train ONCF',
    },
    restaurants: {
      title: 'Restaurants',
      searchPlaceholder: 'Rechercher des restaurants...',
    },
    guide: {
      title: 'Guide',
      searchPlaceholder: 'Rechercher des guides...',
      bookGuide: 'Réserver un Guide',
    },
    safety: {
      title: 'Conseils de Sécurité',
      emergencyNumbers: 'Numéros d\'Urgence',
      antiScamTips: 'Éviter les Arnaques',
      referencePrices: 'Prix de Référence',
      commonPhrases: 'Phrases Courantes',
    },
    community: {
      title: 'Communauté',
      groupActivities: 'Activités de Groupe',
      joinActivity: 'Rejoindre',
    },
    profile: {
      title: 'Profil',
      dashboard: 'Tableau de Bord',
      settings: 'Paramètres',
      driverJoin: 'Rejoindre en tant que Chauffeur',
      guideRequest: 'Demander un Guide',
      driverLogin: 'Connexion Chauffeur',
      guideLogin: 'Connexion Guide',
      language: 'Langue',
    },
    driver: {
      dashboard: 'Tableau de Bord Chauffeur',
      trips: 'Trajets',
      messages: 'Messages',
      profile: 'Compte',
      reviews: 'Avis',
      online: 'En service',
      offline: 'Hors service',
      acceptTrip: 'Accepter',
      declineTrip: 'Refuser',
      callClient: 'Appeler',
      messageClient: 'Message',
      earnings: 'Revenus',
      rating: 'Note',
      hotZone: 'Zone Chaude',
      tripRequests: 'Demandes de Course',
    },
    checkout: {
      title: 'Paiement',
      confirm: 'Confirmer la Réservation',
      total: 'Total',
    },
    login: {
      title: 'Bon Retour',
      email: 'Email',
      password: 'Mot de passe',
      login: 'Connexion',
      register: 'S\'inscrire',
      orContinueWith: 'Ou continuer avec',
    },
  },
  ar: {
    common: {
      continue: 'متابعة',
      skip: 'تخطي',
      cancel: 'إلغاء',
      search: 'بحث...',
      loading: 'جار التحميل...',
      free: 'مجاني',
      yes: 'نعم',
      no: 'لا',
      change: 'تغيير',
      seeAll: 'عرض الكل',
      signOut: 'تسجيل الخروج',
      back: 'رجوع',
    },
    language: {
      title: 'اختر لغتك',
      subtitle: 'اختر لغتك المفضلة لاستكشاف المغرب',
    },
    home: {
      welcome: 'مرحباً بك في Navito',
      currentMap: 'الخريطة الحالية',
      searchPlaceholder: 'استكشف الوجهة...',
      translator: 'ترجمة OCR',
      priceCheck: 'السعر',
      transport: 'النقل',
      safety: 'الأمان',
      otherCities: 'مدن أخرى',
      recommendedAround: 'موصى به حولك',
      mustSee: 'يجب زيارته في {{city}}',
      experiences: 'التجارب',
    },
    explore: {
      titleWithCity: 'استكشف {{city}}',
      searchPlaceholder: 'ابحث عن معالم، مطاعم...',
      filters: 'فلاتر',
      minRating: 'الحد الأدنى للتقييم',
      anyRating: 'أي تقييم',
      loading: 'جار تجهيز النتائج...',
      resultsFound: 'تم العثور على {{count}} نتيجة',
      currentArea: 'منطقتك الحالية',
      tabs: {
        all: 'الكل',
        monument: 'معالم',
        restaurant: 'مطاعم',
        activity: 'أنشطة',
      },
    },
    transport: {
      title: 'النقل',
      petitTaxi: 'تاكسي صغير',
      grandTaxi: 'تاكسي كبير',
      cityBus: 'حافلات المدينة',
      oncfTrain: 'قطار ONCF',
    },
    restaurants: {
      title: 'المطاعم',
      searchPlaceholder: 'ابحث عن مطاعم...',
    },
    guide: {
      title: 'المرشد',
      searchPlaceholder: 'ابحث عن مرشدين...',
      bookGuide: 'احجز مرشد',
    },
    safety: {
      title: 'نصائح الأمان',
      emergencyNumbers: 'أرقام الطوارئ',
      antiScamTips: 'تجنب النصب',
      referencePrices: 'أسعار مرجعية',
      commonPhrases: 'عبارات شائعة',
    },
    community: {
      title: 'المجتمع',
      groupActivities: 'أنشطة جماعية',
      joinActivity: 'انضم',
    },
    profile: {
      title: 'الملف الشخصي',
      dashboard: 'لوحة التحكم',
      settings: 'الإعدادات',
      driverJoin: 'انضم كسائق',
      guideRequest: 'اطلب مرشد',
      driverLogin: 'تسجيل دخول السائق',
      guideLogin: 'تسجيل دخول المرشد',
      language: 'اللغة',
    },
    driver: {
      dashboard: 'لوحة تحكم السائق',
      trips: 'الرحلات',
      messages: 'الرسائل',
      profile: 'الحساب',
      reviews: 'التقييمات',
      online: 'متاح',
      offline: 'غير متاح',
      acceptTrip: 'قبول',
      declineTrip: 'رفض',
      callClient: 'اتصال',
      messageClient: 'رسالة',
      earnings: 'الأرباح',
      rating: 'التقييم',
      hotZone: 'منطقة ساخنة',
      tripRequests: 'طلبات الرحلة',
    },
    checkout: {
      title: 'الدفع',
      confirm: 'تأكيد الحجز',
      total: 'المجموع',
    },
    login: {
      title: 'مرحباً بعودتك',
      email: 'البريد الإلكتروني',
      password: 'كلمة المرور',
      login: 'تسجيل الدخول',
      register: 'تسجيل',
      orContinueWith: 'أو تابع باستخدام',
    },
  },
  zh: {
    common: {
      continue: '继续',
      skip: '跳过',
      cancel: '取消',
      search: '搜索...',
      loading: '加载中...',
      free: '免费',
      yes: '是',
      no: '否',
      change: '更改',
      seeAll: '查看全部',
      signOut: '退出登录',
      back: '返回',
    },
    language: {
      title: '选择您的语言',
      subtitle: '选择您偏好的语言来探索摩洛哥',
    },
    home: {
      welcome: '欢迎使用 Navito',
      currentMap: '当前地图',
      searchPlaceholder: '探索目的地...',
      translator: 'OCR翻译',
      priceCheck: '价格查询',
      transport: '交通',
      safety: '安全',
      otherCities: '其他城市',
      recommendedAround: '为您推荐',
      mustSee: '{{city}}必看',
      experiences: '体验',
    },
    explore: {
      titleWithCity: '探索{{city}}',
      searchPlaceholder: '搜索景点、餐厅...',
      filters: '筛选',
      minRating: '最低评分',
      anyRating: '任何评分',
      loading: '正在整理结果...',
      resultsFound: '找到{{count}}个结果',
      currentArea: '您当前的区域',
      tabs: {
        all: '全部',
        monument: '景点',
        restaurant: '餐厅',
        activity: '活动',
      },
    },
    transport: {
      title: '交通',
      petitTaxi: '小型出租车',
      grandTaxi: '大型出租车',
      cityBus: '城市公交',
      oncfTrain: 'ONCF火车',
    },
    restaurants: {
      title: '餐厅',
      searchPlaceholder: '搜索餐厅...',
    },
    guide: {
      title: '导游',
      searchPlaceholder: '搜索导游...',
      bookGuide: '预订导游',
    },
    safety: {
      title: '安全提示',
      emergencyNumbers: '紧急电话',
      antiScamTips: '防止诈骗',
      referencePrices: '参考价格',
      commonPhrases: '常用短语',
    },
    community: {
      title: '社区',
      groupActivities: '团体活动',
      joinActivity: '加入',
    },
    profile: {
      title: '个人资料',
      dashboard: '控制面板',
      settings: '设置',
      driverJoin: '加入司机',
      guideRequest: '请求导游',
      driverLogin: '司机登录',
      guideLogin: '导游登录',
      language: '语言',
    },
    driver: {
      dashboard: '司机控制面板',
      trips: '行程',
      messages: '消息',
      profile: '账户',
      reviews: '评价',
      online: '在线',
      offline: '离线',
      acceptTrip: '接受',
      declineTrip: '拒绝',
      callClient: '呼叫',
      messageClient: '消息',
      earnings: '收入',
      rating: '评分',
      hotZone: '热门区域',
      tripRequests: '行程请求',
    },
    checkout: {
      title: '结账',
      confirm: '确认预订',
      total: '总计',
    },
    login: {
      title: '欢迎回来',
      email: '邮箱',
      password: '密码',
      login: '登录',
      register: '注册',
      orContinueWith: '或使用以下方式继续',
    },
  },
};

type TranslationKeys = typeof translations.en;

export function getTranslation(lang: string): TranslationKeys {
  return translations[lang as keyof typeof translations] || translations.en;
}

export function t(lang: string, path: string, params?: Record<string, string>): string {
  const trans = getTranslation(lang);
  const keys = path.split('.');
  let value: any = trans;
  
  for (const key of keys) {
    if (value && typeof value === 'object' && key in value) {
      value = value[key];
    } else {
      return path;
    }
  }
  
  if (typeof value !== 'string') {
    return path;
  }
  
  if (params) {
    return value.replace(/\{\{(\w+)\}\}/g, (_, key) => params[key] || '');
  }
  
  return value;
}
