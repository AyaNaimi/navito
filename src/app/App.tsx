import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
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

export default function App() {
  return (
    <BrowserRouter>
      <div className="size-full bg-white dark:bg-gray-900">
        <Routes>
          <Route path="/splash" element={<SplashScreen />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/language" element={<LanguageSelector />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/country" element={<CountrySelector />} />
          <Route path="/city" element={<CitySelector />} />

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

          <Route path="/" element={<Navigate to="/splash" replace />} />
        </Routes>
        <Toaster />
      </div>
    </BrowserRouter>
  );
}
