import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { LanguageProvider } from './src/context/LanguageContext';

// Screens
import SplashScreen from './src/pages/SplashScreen';
import OnboardingScreen from './src/pages/OnboardingScreen';
import LanguageScreen from './src/pages/LanguageScreen';
import LoginScreen from './src/pages/LoginScreen';
import RegisterScreen from './src/pages/RegisterScreen';
import CountryScreen from './src/pages/CountryScreen';
import CityScreen from './src/pages/CityScreen';
import HomeScreen from './src/pages/HomeScreen';
import ExploreScreen from './src/pages/ExploreScreen';
import TransportScreen from './src/pages/TransportScreen';
import RestaurantsScreen from './src/pages/RestaurantsScreen';
import GuideScreen from './src/pages/GuideScreen';
import SafetyScreen from './src/pages/SafetyScreen';
import CommunityScreen from './src/pages/CommunityScreen';
import ProfileScreen from './src/pages/ProfileScreen';
import OCRTranslatorScreen from './src/pages/OCRTranslatorScreen';
import PriceEstimatorScreen from './src/pages/PriceEstimatorScreen';
import TaxiSimulatorScreen from './src/pages/TaxiSimulatorScreen';
import ApplyFormScreen from './src/pages/ApplyFormScreen';
import GuideRequestScreen from './src/pages/GuideRequestScreen';
import ActivityDetailScreen from './src/pages/ActivityDetailScreen';
import RestaurantDetailScreen from './src/pages/RestaurantDetailScreen';
import CheckoutScreen from './src/pages/CheckoutScreen';
import DriverJoinScreen from './src/pages/DriverJoinScreen';
import DriverPendingScreen from './src/pages/DriverPendingScreen';
import GroupActivityDetailScreen from './src/pages/GroupActivityDetailScreen';
import DriverDashboardScreen from './src/pages/DriverDashboardScreen';
import GuideDashboardScreen from './src/pages/GuideDashboardScreen';
import DriverLoginScreen from './src/pages/DriverLoginScreen';
import BottomNav from './src/components/BottomNav';

import { MapPlace } from './src/services/mapService';

const DEFAULT_BACKGROUND = '#FAFAFA';
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: DEFAULT_BACKGROUND,
  },
  content: {
    flex: 1,
  },
});

import { Screen } from './src/types/navigation';

const TABS: Screen[] = ['home', 'explore', 'transport', 'restaurants', 'guide', 'safety', 'community', 'profile'];

export default function App() {
  const [screen, setScreen] = useState<Screen>('splash');
  const [selectedCity, setSelectedCity] = useState('Marrakech');
  const [selectedCountry, setSelectedCountry] = useState('Morocco');
  const [selectedActivityId, setSelectedActivityId] = useState<number | undefined>(undefined);
  const [selectedGroupActivityId, setSelectedGroupActivityId] = useState<number | undefined>(undefined);
  const [selectedPlace, setSelectedPlace] = useState<MapPlace | undefined>(undefined);

  const navigate = (next: Screen, params?: any) => {
    if (params?.activityId !== undefined) {
      if (next === 'groupActivityDetail') {
        setSelectedGroupActivityId(params.activityId);
      } else {
        setSelectedActivityId(params.activityId);
      }
    }
    // Handle full place objects from ExploreScreen
    if (params?.place !== undefined) {
      if (next === 'restaurantDetail') {
        setSelectedPlace(params.place);
      } else if (next === 'activityDetail') {
        setSelectedPlace(params.place);
      }
    }
    setScreen(next);
  };

  const handleLogout = () => {
    setScreen('language');
  };

  const renderScreen = () => {
    switch (screen) {
      case 'splash':
        return <SplashScreen onComplete={() => navigate('onboarding')} />;
      case 'onboarding':
        return <OnboardingScreen onComplete={() => navigate('language')} />;
      case 'language':
        return <LanguageScreen onSelect={() => navigate('login')} />;
      case 'login':
        return <LoginScreen
          onLogin={() => navigate('country')}
          onRegister={() => navigate('register')}
          onSkip={() => navigate('country')}
        />;
      case 'register':
        return <RegisterScreen
          onRegister={() => navigate('country')}
          onLogin={() => navigate('login')}
          onBack={() => navigate('login')}
        />;
      case 'country':
        return <CountryScreen 
          onNavigate={navigate} 
          onBack={() => navigate('onboarding')}
          onCitySelect={(city) => { setSelectedCity(city); navigate('explore'); }}
        />;
      case 'city':
        return <CityScreen onSelect={(c) => { setSelectedCity(c); navigate('home'); }} selectedCountry={selectedCountry} />;
      case 'home':
        return <HomeScreen selectedCity={selectedCity} onNavigate={navigate} />;
      case 'explore':
        return <ExploreScreen onNavigate={navigate} selectedCity={selectedCity} selectedCountry={selectedCountry} />;
      case 'transport':
        return <TransportScreen onNavigate={navigate} selectedCity={selectedCity} />;
      case 'restaurants':
        return <RestaurantsScreen onNavigate={navigate} selectedCity={selectedCity} />;
      case 'guide':
        return <GuideScreen onNavigate={navigate} selectedCity={selectedCity} />;
      case 'safety':
        return <SafetyScreen onNavigate={navigate} selectedCity={selectedCity} />;
      case 'community':
        return <CommunityScreen onNavigate={navigate} selectedCity={selectedCity} />;
      case 'profile':
        return <ProfileScreen onNavigate={navigate} onLogout={handleLogout} />;
      case 'ocr':
        return <OCRTranslatorScreen onNavigate={navigate} />;
      case 'price':
        return <PriceEstimatorScreen onNavigate={navigate} />;
      case 'taxiSimulator':
        return <TaxiSimulatorScreen onNavigate={navigate} />;
      case 'applyForm':
        return <ApplyFormScreen onSubmit={() => navigate('community')} onBack={() => navigate('community')} />;
      case 'guideRequest':
        return <GuideRequestScreen onSubmit={() => navigate('guide')} onBack={() => navigate('guide')} />;
      case 'activityDetail':
        return <ActivityDetailScreen
          onBook={() => navigate('checkout')}
          onBack={() => navigate('explore')}
          itemId={selectedActivityId}
          place={selectedPlace}
        />;
      case 'restaurantDetail':
        return <RestaurantDetailScreen 
          onBook={() => navigate('checkout')} 
          onBack={() => navigate('explore')}
          place={selectedPlace}
        />;
      case 'checkout':
        return <CheckoutScreen onConfirm={() => navigate('home')} onBack={() => navigate('home')} />;
      case 'driverJoin':
        return <DriverJoinScreen onNavigate={navigate} />;
      case 'driverPending':
        return <DriverPendingScreen onNavigate={navigate} />;
      case 'groupActivityDetail':
        return <GroupActivityDetailScreen onNavigate={navigate} activityId={selectedGroupActivityId} />;
      case 'driverDashboard':
        return <DriverDashboardScreen onNavigate={navigate} onBack={() => navigate('profile')} />;
      case 'guideDashboard':
        return <GuideDashboardScreen onNavigate={navigate} onBack={() => navigate('profile')} />;
      case 'driverLogin':
        return <DriverLoginScreen onLogin={() => navigate('driverDashboard')} onRegister={() => navigate('driverJoin')} onBack={() => navigate('profile')} />;
      case 'driverMessages':
        return <DriverDashboardScreen onNavigate={navigate} onBack={() => navigate('driverDashboard')} />;
      case 'driverReviews':
        return <DriverDashboardScreen onNavigate={navigate} onBack={() => navigate('driverDashboard')} />;
      default:
        return <HomeScreen selectedCity={selectedCity} onNavigate={navigate} />;
    }
  };

  const showBottomNav = TABS.includes(screen);

  return (
    <SafeAreaProvider>
      <LanguageProvider>
        <View style={styles.container}>
          <StatusBar style="dark" />
          <View style={styles.content}>{renderScreen()}</View>
          {showBottomNav && (
            <BottomNav activeTab={screen} onTabChange={navigate} />
          )}
        </View>
      </LanguageProvider>
    </SafeAreaProvider>
  );
}
