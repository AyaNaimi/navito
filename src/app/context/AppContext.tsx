import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

type AuthMode = 'guest' | 'login';
type ExploreMode = 'city' | 'current-location';
export type UserRole = 'tourist' | 'guide' | 'driver' | 'super_admin';

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
};

type AppContextValue = AppState & {
  setLanguage: (language: string) => void;
  setAuthMode: (mode: AuthMode) => void;
  setUserSession: (session: { name: string; email: string; role: UserRole }) => void;
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
  }, [state]);

  const value = useMemo<AppContextValue>(() => ({
    ...state,
    setLanguage: (language) => setState((current) => ({ ...current, language })),
    setAuthMode: (authMode) => setState((current) => ({ ...current, authMode })),
    setUserSession: ({ name, email, role }) =>
      setState((current) => ({
        ...current,
        authMode: 'login',
        userName: name,
        userEmail: email,
        userRole: role,
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
