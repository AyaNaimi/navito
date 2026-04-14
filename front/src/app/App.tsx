import { useEffect } from 'react';
import { BrowserRouter, Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import SplashScreen from './pages/SplashScreen';
import Onboarding from './pages/Onboarding';
import LanguageSelector from './pages/LanguageSelector';
import Login from './pages/Login';
import Register from './pages/Register';
import CountrySelector from './pages/CountrySelector';
import CitySelector from './pages/CitySelector';

import Home from './pages/Home';
import Explore from './pages/Explore';
import ActivityDetail from './pages/ActivityDetail';
import RestaurantDetail from './pages/RestaurantDetail';
import Checkout from './pages/Checkout';

import Transport from './pages/Transport';
import Restaurants from './pages/Restaurants';
import Safety from './pages/Safety';
import Guide from './pages/Guide';
import Community from './pages/Community';
import Profile from './pages/Profile';
import OCRTranslator from './pages/OCRTranslator';
import PriceEstimator from './pages/PriceEstimator';
import TaxiSimulator from './pages/TaxiSimulator';
import ApplyForm from './pages/ApplyForm';
import GuideRequestForm from './pages/GuideRequestForm';
import GroupActivityDetail from './pages/GroupActivityDetail';

// Dashboard Imports
import RoleDashboardRouter from '../pages/dashboards/RoleDashboardRouter';
import DriverDashboard from '../pages/dashboards/DriverDashboard';
import DriverOrders from '../pages/dashboards/DriverOrders';
import DriverJoin from './pages/DriverJoin';
import DriverVerifyIdentity from './pages/DriverVerifyIdentity';
import DriverPendingApproval from './pages/DriverPendingApproval';
import DriverProfile from './pages/DriverProfile';
import SuperAdminLogin from '../pages/dashboards/superadmin/SuperAdminLogin';
import DriverLogin from '../pages/dashboards/driver/DriverLogin';
import DriverSignup from '../pages/dashboards/driver/DriverSignup';

import { useAppContext } from './context/AppContext';
import { useLocation } from 'react-router-dom';
import RequireAuth, { getDashboardPathForRole } from './components/RequireAuth';
import { cn } from './components/ui/utils';

function isDashboardPath(pathname: string) {
  return pathname.startsWith('/dashboard') || pathname.startsWith('/demo/driver-dashboard');
}

// RouteGuard - Protects routes that require city selection
function RouteGuard({ children }: { children: React.ReactNode }) {
  const { city, country, exploreMode } = useAppContext();
  
  console.log('RouteGuard check:', { country, city, exploreMode });
  
  // Allow explore and other discovery pages without city
  const currentPath = window.location.pathname;
  const publicPaths = ['/explore', '/transport', '/restaurants', '/guide', '/safety', '/community', '/profile', '/ocr-translator', '/price-estimator', '/taxi-simulator', '/home'];
  
  // If accessing home without city, redirect to city selector
  if (currentPath === '/home') {
    if (!city) {
      return <Navigate to="/city" replace />;
    }
    // If city is set, allow access to home
    return <>{children}</>;
  }
  
  // If no country and not using current location, redirect to country
  if (!country && exploreMode !== 'current-location') {
    // But allow explore to work with default data
    if (currentPath === '/explore') {
      return <>{children}</>;
    }
    return <Navigate to="/country" replace />;
  }
  
  return <>{children}</>;
}

function AppRoutes() {
  const { userRole, city, country } = useAppContext();
  const { pathname } = useLocation();
  const dashboardBg = isDashboardPath(pathname);

  // Log for debugging
  useEffect(() => {
    console.log('AppRoutes:', { pathname, city, country });
  }, [pathname, city, country]);

  return (
    <div
      className={cn(
        'size-full min-h-screen overflow-x-hidden overflow-y-auto transition-colors duration-500',
        dashboardBg
          ? 'bg-transparent'
          : 'bg-background text-foreground',
      )}
    >
      <Routes>
        <Route path="/splash" element={<SplashScreen />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/language" element={<LanguageSelector />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin/login" element={<SuperAdminLogin />} />
        <Route path="/register" element={<Register />} />
        <Route path="/country" element={<CountrySelector />} />
        <Route path="/city" element={<CitySelector />} />

        {/* All main app routes */}
        <Route path="/home" element={<Home />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/activity/:id" element={<ActivityDetail />} />
        <Route path="/restaurant/:id" element={<RestaurantDetail />} />
        <Route path="/checkout/:type/:id" element={<Checkout />} />
        <Route path="/transport" element={<Transport />} />
        <Route path="/taxi-simulator" element={<TaxiSimulator />} />
        <Route path="/restaurants" element={<Restaurants />} />
        <Route path="/guide" element={<Guide />} />
        <Route path="/safety" element={<Safety />} />
        <Route path="/community" element={<Community />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/ocr-translator" element={<OCRTranslator />} />
        <Route path="/price-estimator" element={<PriceEstimator />} />
        <Route path="/apply/:type" element={<ApplyForm />} />
        <Route path="/guide/request/:id" element={<GuideRequestForm />} />
        <Route path="/community/activity/:id" element={<GroupActivityDetail />} />

        {/* Dashboard Routes */}
        <Route path="/driver/login" element={<DriverLogin />} />
        <Route path="/driver/signup" element={<DriverSignup />} />
        <Route path="/driver/join" element={<DriverJoin />} />
        <Route path="/driver/verify" element={<DriverVerifyIdentity />} />
        <Route path="/driver/pending" element={<DriverPendingApproval />} />
        <Route path="/driver/profile" element={<DriverProfile />} />
        <Route path="/driver/orders" element={<DriverOrders />} />
        
        <Route path="/dashboard" element={<Navigate to={getDashboardPathForRole(userRole)} replace />} />
        <Route
          path="/dashboard/:role"
          element={<RoleDashboardRouter />}
        />

        <Route path="/" element={<Navigate to="/splash" replace />} />
      </Routes>
      <Toaster />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}
