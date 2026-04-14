import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import i18n from '../i18n';

type AuthMode = 'guest' | 'login';
type ExploreMode = 'city' | 'current-location';
export type UserRole = 'tourist' | 'guide' | 'driver' | 'super_admin';
export type DriverVerificationStatus = 'none' | 'documents_pending' | 'pending' | 'verified';

type DriverProfile = {
  fullName: string;
  phone: string;
  vehicleType: string;
  city: string;
  rating: number;
  totalTrips: number;
};

type AppState = {
  language: string;
  authMode: AuthMode | null;
  userName: string;
  userEmail: string;
  userRole: UserRole;
  country: string;
  city: string;
  exploreMode: ExploreMode;
  currentPosition: { lat: number; lng: number } | null;
  driverVerificationStatus: DriverVerificationStatus;
  driverProfile: DriverProfile | null;
  theme: 'dark' | 'light';
};

type AppContextValue = AppState & {
  setLanguage: (language: string) => void;
  setTheme: (theme: 'dark' | 'light') => void;
  toggleTheme: () => void;
  setAuthMode: (mode: AuthMode) => void;
  setUserSession: (session: { name: string; email: string; role: UserRole }) => void;
  submitDriverRegistration: (payload: {
    fullName: string;
    phone: string;
    vehicleType: string;
    city: string;
  }) => void;
  submitDriverDocuments: () => void;
  setDriverVerificationStatus: (status: DriverVerificationStatus) => void;
  updateDriverProfile: (payload: Partial<Pick<DriverProfile, 'fullName' | 'phone' | 'vehicleType' | 'city'>>) => void;
  setCountry: (country: string) => void;
  setCity: (city: string) => void;
  useCurrentLocation: (position?: { lat: number; lng: number } | null) => void;
  resetFlow: () => void;
};

const STORAGE_KEY = 'navito-app-state';

const defaultState: AppState = {
  language: 'fr',
  authMode: null,
  userName: 'Voyageur Navito',
  userEmail: 'travel@navito.app',
  userRole: 'tourist',
  country: '',
  city: '',
  exploreMode: 'city',
  currentPosition: null,
  driverVerificationStatus: 'none',
  driverProfile: null,
  theme: 'dark',
};

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(() => {
    if (typeof window === 'undefined') {
      return defaultState;
    }

    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (!saved) {
      return defaultState;
    }

    try {
      return { ...defaultState, ...JSON.parse(saved) };
    } catch {
      return defaultState;
    }
  });

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    i18n.changeLanguage(state.language);
    
    // Manage class on document for CSS triggers
    if (state.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [state]);

  const value = useMemo<AppContextValue>(() => ({
    ...state,
    setLanguage: (language) => setState((current) => ({ ...current, language })),
    setTheme: (theme) => setState((current) => ({ ...current, theme })),
    toggleTheme: () => setState((current) => ({ ...current, theme: current.theme === 'dark' ? 'light' : 'dark' })),
    setAuthMode: (authMode) => setState((current) => ({ ...current, authMode })),
    setUserSession: ({ name, email, role }) =>
      setState((current) => ({
        ...current,
        authMode: 'login',
        userName: name,
        userEmail: email,
        userRole: role,
      })),
    submitDriverRegistration: ({ fullName, phone, vehicleType, city }) =>
      setState((current) => ({
        ...current,
        userName: fullName,
        userRole: 'driver',
        driverVerificationStatus: 'documents_pending',
        driverProfile: {
          fullName,
          phone,
          vehicleType,
          city,
          rating: current.driverProfile?.rating ?? 4.9,
          totalTrips: current.driverProfile?.totalTrips ?? 0,
        },
      })),
    submitDriverDocuments: () =>
      setState((current) => ({
        ...current,
        driverVerificationStatus: 'pending',
      })),
    setDriverVerificationStatus: (status) =>
      setState((current) => ({
        ...current,
        driverVerificationStatus: status,
      })),
    updateDriverProfile: (payload) =>
      setState((current) => ({
        ...current,
        userName: payload.fullName ?? current.userName,
        driverProfile: current.driverProfile
          ? {
              ...current.driverProfile,
              ...payload,
            }
          : current.driverProfile,
      })),
    setCountry: (country) =>
      setState((current) => ({
        ...current,
        country,
        city: current.country === country ? current.city : '',
        exploreMode: 'city',
      })),
    setCity: (city) =>
      setState((current) => ({
        ...current,
        city,
        exploreMode: 'city',
      })),
    useCurrentLocation: (currentPosition) =>
      setState((current) => ({
        ...current,
        city: '',
        exploreMode: 'current-location',
        currentPosition: currentPosition ?? current.currentPosition,
      })),
    resetFlow: () => setState(defaultState),
  }), [state]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }

  return context;
}
