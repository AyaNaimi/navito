import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { Toaster } from 'sonner';
import { cn } from './components/ui/utils';
import SplashScreen from './pages/SplashScreen';
import Onboarding from './pages/Onboarding';
import AuthGateway from './pages/AuthGateway';
import Login from './pages/Login';
import Register from './pages/Register';
import CountrySelector from './pages/CountrySelector';
import CitySelector from './pages/CitySelector';
import Home from './pages/Home';
import Explore from './pages/Explore';
import ActivityDetail from './pages/ActivityDetail';
import RestaurantDetail from './pages/RestaurantDetail';
import PlaceDetail from './pages/PlaceDetail';
import Checkout from './pages/Checkout';
import Transport from './pages/Transport';
import Restaurants from './pages/Restaurants';
import PlacesSearchFinder from './pages/PlacesSearchFinder';
import OpenStreetMapFinder from './pages/OpenStreetMapFinder';
import Safety from './pages/Safety';
import Guide from './pages/Guide';
import Community from './pages/Community';
import Profile from './pages/Profile';
import OCRTranslator from './pages/OCRTranslator';
import PriceEstimator from './pages/PriceEstimator';
import TaxiSimulator from './pages/TaxiSimulator';
import ApplyForm from './pages/ApplyForm';
import GuideRequestForm from './pages/GuideRequestForm';
import RoleDashboardRouter from '../pages/dashboards/RoleDashboardRouter';
import DriverOrders from '../pages/dashboards/DriverOrders';
import DriverJoin from './pages/DriverJoin';
import DriverVerifyIdentity from './pages/DriverVerifyIdentity';
import DriverPendingApproval from './pages/DriverPendingApproval';
import DriverProfile from './pages/DriverProfile';
import { getDashboardPathForRole } from './components/RequireAuth';
import { useAppContext } from './context/AppContext';
import SuperAdminLogin from '../pages/dashboards/superadmin/SuperAdminLogin';
import DriverLogin from '../pages/dashboards/driver/DriverLogin';
import DriverSignup from '../pages/dashboards/driver/DriverSignup';
import GuideLogin from '../pages/dashboards/guide/GuideLogin';
import GuideSignup from '../pages/dashboards/guide/GuideSignup';
import GuidePendingApproval from '../pages/dashboards/guide/GuidePendingApproval';
import DriverRequestForm from './pages/DriverRequestForm';
import Messages from './pages/Messages';

function isDashboardPath(pathname: string) {
  return pathname.startsWith('/dashboard') || pathname.startsWith('/demo/driver-dashboard');
}

function AppRoutes() {
  const { userRole } = useAppContext();
  const { pathname } = useLocation();
  const dashboardBg = isDashboardPath(pathname);

  return (
    <div
      className={cn(
        'size-full min-h-screen',
        dashboardBg
          ? 'bg-transparent dark:bg-slate-950/90'
          : 'bg-white/80 backdrop-blur-[2px] dark:bg-gray-950/95 dark:backdrop-blur-sm',
      )}
      >
        <Routes>
          <Route path="/splash" element={<SplashScreen />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/language" element={<Navigate to="/welcome" replace />} />
          <Route path="/welcome" element={<AuthGateway />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin/login" element={<SuperAdminLogin />} />
          <Route path="/register" element={<Register />} />
          <Route path="/country" element={<CountrySelector />} />
          <Route path="/city" element={<CitySelector />} />

          <Route path="/home" element={<Home />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/place/:id" element={<PlaceDetail />} />
          <Route path="/activity/:id" element={<ActivityDetail />} />
          <Route path="/restaurant/:id" element={<RestaurantDetail />} />
          <Route path="/checkout/:type/:id" element={<Checkout />} />

          <Route path="/transport" element={<Transport />} />
          <Route path="/taxi-simulator" element={<TaxiSimulator />} />
          <Route path="/restaurants" element={<Restaurants />} />
          <Route
            path="/explore/places"
            element={
              <PlacesSearchFinder
                apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ''}
                location={{ lat: 31.6295, lng: -7.9811 }}
                city="Marrakech"
              />
            }
          />
          <Route
            path="/explore/osm"
            element={
              <OpenStreetMapFinder
                location={{ lat: 31.6295, lng: -7.9811 }}
                city="Marrakech"
              />
            }
          />
          <Route path="/guide" element={<Guide />} />
          <Route path="/guide/request/:id" element={<GuideRequestForm />} />
          <Route path="/safety" element={<Safety />} />
          <Route path="/community" element={<Community />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/ocr-translator" element={<OCRTranslator />} />
          <Route path="/price-estimator" element={<PriceEstimator />} />
          <Route path="/apply/:type" element={<ApplyForm />} />
          <Route path="/driver/request/:id" element={<DriverRequestForm />} />
          <Route path="/driver/login" element={<DriverLogin />} />
          <Route path="/driver/signup" element={<DriverSignup />} />
          <Route path="/driver/join" element={<DriverJoin />} />
          <Route path="/driver/verify" element={<DriverVerifyIdentity />} />
          <Route path="/driver/pending" element={<DriverPendingApproval />} />
          <Route path="/driver/profile" element={<DriverProfile />} />
          <Route path="/driver/orders" element={<DriverOrders />} />
          <Route path="/guide/login" element={<GuideLogin />} />
          <Route path="/guide/signup" element={<GuideSignup />} />
          <Route path="/guide/pending" element={<GuidePendingApproval />} />
          
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
