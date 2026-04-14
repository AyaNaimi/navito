import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Dimensions, Switch, Alert, TextInput, FlatList, Linking, Platform, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import { MapPin, Star, Clock, DollarSign, Navigation, Car, ChevronRight, MessageCircle, CheckCircle2, XCircle, TrendingUp, Home, User, LogOut, Phone, Mail, Send, Search, FileText, MapPinned, Check, Mic, Paperclip, MoreVertical, Camera, ArrowLeft, PhoneCall, Video, Locate, Route, Wallet, Timer, Gauge, Navigation2 } from 'lucide-react-native';
import { StatusBar } from 'expo-status-bar';
import { colors, typography, spacing, borderRadius } from '../theme';
import { Screen } from '../types/navigation';
import { driverRequests } from '../data/mockData';
import { useLanguage } from '../context/LanguageContext';

const { width, height } = Dimensions.get('window');

const CASABLANCA_REGION = {
  latitude: 33.5731,
  longitude: -7.5898,
  latitudeDelta: 0.05,
  longitudeDelta: 0.05,
};

type DriverNavId = 'dashboard' | 'messages' | 'profile' | 'reviews';

const DEFAULT_NAV_ITEMS: Array<{ id: DriverNavId; label: string; icon: typeof Home }> = [
  { id: 'dashboard', label: 'Trips', icon: Car },
  { id: 'messages', label: 'Messages', icon: MessageCircle },
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'reviews', label: 'Reviews', icon: Star },
];

interface DriverDashboardScreenProps {
  onNavigate: (screen: Screen) => void;
  onBack: () => void;
  initialTab?: DriverNavId;
}

const mockChats = [
  { id: '1', name: 'Jack Robinson', avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=Jack', route: 'Casa Port → Morocco Mall', lastMessage: 'Je suis devant la gare', unread: 2, phone: '+212661234567', online: true },
  { id: '2', name: 'Maria Sanchez', avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=Maria', route: 'Anfa Place → Marina', lastMessage: 'Merci pour le trajet!', unread: 0, phone: '+212661234568', online: false },
  { id: '3', name: 'Ahmed Benali', avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=Ahmed', route: 'Aéroport → Médina', lastMessage: 'À tout à l\'heure', unread: 1, phone: '+212661234569', online: true },
];

const mockMessages = [
  { id: '1', senderId: 'customer', text: 'Je suis devant la gare, près de la porte nord.', time: '16:25' },
  { id: '2', senderId: 'driver', text: "D'accord, je suis là dans 2 minutes. Quelle est la couleur de votre veste ?", time: '16:26' },
  { id: '3', senderId: 'customer', text: 'Bleu marine.', time: '16:28' },
  { id: '4', senderId: 'customer', text: 'Je vous vois!', time: '16:30' },
];

const driverDocuments = [
  { id: 1, title: 'Permis de conduire', status: 'valid', label: 'Validé', expireDate: '12 Oct 2028' },
  { id: 2, title: 'Carte CIN', status: 'valid', label: 'Validé', expireDate: '05 Jan 2030' },
  { id: 3, title: 'Assurance', status: 'valid', label: 'Validé', expireDate: '20 Oct 2025' },
  { id: 4, title: 'Contrôle Technique', status: 'pending', label: 'Expiré', expireDate: '1 Sep 2024' },
];

const PRICING = {
  baseFare: 10,
  perKm: 4,
  perMinute: 1,
  serviceFee: 5,
  peakMultiplier: 1.5,
};

const calculatePrice = (distanceKm: number, durationMin: number, isPeakHour: boolean = false): number => {
  const base = PRICING.baseFare;
  const distanceCost = distanceKm * PRICING.perKm;
  const timeCost = durationMin * PRICING.perMinute;
  const fee = PRICING.serviceFee;
  const subtotal = base + distanceCost + timeCost + fee;
  return isPeakHour ? subtotal * PRICING.peakMultiplier : subtotal;
};

export default function DriverDashboardScreen({ onNavigate, onBack, initialTab }: DriverDashboardScreenProps) {
  const [isOnline, setIsOnline] = useState(true);
  const [activeNav, setActiveNav] = useState<DriverNavId>(initialTab || 'dashboard');
  const [selectedTrip, setSelectedTrip] = useState<any>(null);
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const [chatMessage, setChatMessage] = useState('');
  const [messages, setMessages] = useState(mockMessages);
  const mapRef = useRef<MapView>(null);
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const { t: tr } = useLanguage();

  const t = (path: string) => tr(path);

  const navItems = DEFAULT_NAV_ITEMS.map(item => ({
    ...item,
    label: item.id === 'dashboard' ? t('driver.trips') :
           item.id === 'messages' ? t('driver.messages') :
           item.id === 'profile' ? t('driver.profile') :
           t('driver.reviews')
  }));

  useEffect(() => {
    if (isOnline) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1.2, duration: 1000, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
        ])
      ).start();
    }
  }, [isOnline]);

  const formatTime = () => {
    const now = new Date();
    const days = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
    const day = days[now.getDay()];
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${day} ${hours}:${minutes}`;
  };

  const handleNav = (id: DriverNavId) => {
    setActiveNav(id);
    setSelectedTrip(null);
    if (id !== 'messages') setActiveChat(null);
  };

  const handleLogout = () => onBack();

  const handleCall = (phone: string) => {
    const url = Platform.OS === 'android' ? `tel:${phone}` : `telprompt:${phone}`;
    Linking.openURL(url).catch(() => Alert.alert('Erreur', 'Impossible de passer un appel'));
  };

  const handleSendMessage = () => {
    if (!chatMessage.trim() || !activeChat) return;
    setMessages(prev => [...prev, { id: Date.now().toString(), senderId: 'driver', text: chatMessage, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
    setChatMessage('');
    setTimeout(() => {
      setMessages(prev => [...prev, { id: Date.now().toString(), senderId: 'customer', text: 'Parfait, à bientôt!', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
    }, 1500);
  };

  const focusOnLocation = (lat: number, lng: number) => {
    mapRef.current?.animateToRegion({ latitude: lat, longitude: lng, latitudeDelta: 0.02, longitudeDelta: 0.02 }, 500);
  };

  const renderDashboard = () => {
    const tripPrice = selectedTrip ? calculatePrice(selectedTrip.distanceKm, selectedTrip.travelTimeMin, true) : 0;
    const isPeakHour = new Date().getHours() >= 7 && new Date().getHours() <= 9 || new Date().getHours() >= 17 && new Date().getHours() <= 19;

    return (
      <View style={styles.dashboardContent}>
        <View style={styles.statusCard}>
          <View style={styles.statusLeft}>
            <View style={[styles.statusIndicator, isOnline ? styles.statusOnline : styles.statusOffline]} />
            <View>
              <Text style={styles.statusLabel}>{isOnline ? t('driver.online') : t('driver.offline')}</Text>
              <Text style={styles.statusSubtext}>{isOnline ? t('driver.acceptTrip') : 'Not receiving requests' }</Text>
            </View>
          </View>
          <Switch 
            value={isOnline} 
            onValueChange={setIsOnline} 
            trackColor={{ true: colors.secondary[500], false: colors.text.tertiary }} 
            thumbColor={colors.surface.primary} 
          />
        </View>

        <View style={styles.hotAlert}>
          <View style={styles.hotAlertContent}>
            <View style={styles.hotAlertHeader}>
              <TrendingUp size={18} color={colors.text.inverse} />
              <Text style={styles.hotAlertTitle}>🔥 {t('driver.hotZone')}</Text>
            </View>
            <Text style={styles.hotAlertSubtitle}>Médina - Forte demande</Text>
            <Text style={styles.hotAlertDesc}>Bonus 1.5x disponible</Text>
          </View>
          <View style={styles.hotAlertGlow} />
        </View>

        <View style={styles.mapCard}>
          <MapView
            ref={mapRef}
            style={styles.map}
            provider={PROVIDER_GOOGLE}
            initialRegion={CASABLANCA_REGION}
            showsUserLocation={isOnline}
            showsMyLocationButton={false}
            showsCompass={false}
            mapPadding={{ top: 0, right: 0, bottom: 0, left: 0 }}
          >
            {isOnline && (
              <Marker
                coordinate={{ latitude: 33.5731, longitude: -7.5898 }}
                title="Vous"
                description="Position actuelle"
              >
                <View style={styles.driverMarker}>
                  <Animated.View style={[styles.driverMarkerInner, { transform: [{ scale: pulseAnim }] }]} />
                  <View style={styles.driverMarkerCenter}>
                    <Car size={16} color={colors.text.inverse} />
                  </View>
                </View>
              </Marker>
            )}
            {driverRequests.filter(r => r.status === 'pending').map((trip, index) => (
              <Marker
                key={trip.id}
                coordinate={{ latitude: trip.pickupCoords[0], longitude: trip.pickupCoords[1] }}
                title={trip.origin}
                description={trip.destination}
                pinColor={colors.accent[500]}
                onPress={() => setSelectedTrip(trip)}
              >
                <View style={styles.tripMarker}>
                  <MapPin size={20} color={colors.accent[500]} />
                </View>
              </Marker>
            ))}
          </MapView>
          <View style={styles.mapOverlay}>
            <Locate size={20} color={colors.text.inverse} />
            <Text style={styles.mapLocationText}>Casablanca, Maroc</Text>
          </View>
          {isOnline && (
            <View style={styles.mapPerformanceBadge}>
              <Gauge size={16} color={colors.secondary[500]} />
              <Text style={styles.mapPerformanceText}>Performance: Élevée</Text>
            </View>
          )}
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: colors.secondary[500] + '20' }]}>
              <Wallet size={20} color={colors.secondary[500]} />
            </View>
            <Text style={styles.statValue}>2,450</Text>
            <Text style={styles.statSub}>MAD ce mois</Text>
          </View>
          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: colors.accent[500] + '20' }]}>
              <Navigation size={20} color={colors.accent[500]} />
            </View>
            <Text style={styles.statValue}>47</Text>
            <Text style={styles.statSub}>Courses</Text>
          </View>
          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: colors.primary[500] + '20' }]}>
              <Star size={20} color={colors.primary[500]} />
            </View>
            <Text style={styles.statValue}>4.92</Text>
            <Text style={styles.statSub}>Note</Text>
          </View>
        </View>

        {selectedTrip && (
          <View style={styles.priceEstimateCard}>
            <View style={styles.priceEstimateHeader}>
              <Text style={styles.priceEstimateTitle}>💰 Estimation du prix</Text>
              {isPeakHour && <View style={styles.peakBadge}><Text style={styles.peakBadgeText}>Heures pics</Text></View>}
            </View>
            <View style={styles.priceBreakdown}>
              <View style={styles.priceRow}>
                <Text style={styles.priceLabel}>Prix de base</Text>
                <Text style={styles.priceValue}>{PRICING.baseFare} MAD</Text>
              </View>
              <View style={styles.priceRow}>
                <Text style={styles.priceLabel}>Distance ({selectedTrip.distanceKm} km × {PRICING.perKm})</Text>
                <Text style={styles.priceValue}>{selectedTrip.distanceKm * PRICING.perKm} MAD</Text>
              </View>
              <View style={styles.priceRow}>
                <Text style={styles.priceLabel}>Temps ({selectedTrip.travelTimeMin} min × {PRICING.perMinute})</Text>
                <Text style={styles.priceValue}>{selectedTrip.travelTimeMin * PRICING.perMinute} MAD</Text>
              </View>
              <View style={styles.priceRow}>
                <Text style={styles.priceLabel}>Frais de service</Text>
                <Text style={styles.priceValue}>{PRICING.serviceFee} MAD</Text>
              </View>
              {isPeakHour && (
                <View style={styles.priceRow}>
                  <Text style={styles.priceLabel}>Bonus heures pics (×{PRICING.peakMultiplier})</Text>
                  <Text style={styles.priceValue}>+{Math.round(tripPrice * 0.25)} MAD</Text>
                </View>
              )}
              <View style={styles.priceDivider} />
              <View style={styles.priceTotalRow}>
                <Text style={styles.priceTotalLabel}>Total estimé</Text>
                <Text style={styles.priceTotalValue}>{Math.round(tripPrice)} MAD</Text>
              </View>
            </View>
          </View>
        )}

        <Text style={styles.sectionTitle}>{t('driver.tripRequests')} ({driverRequests.filter(r => r.status === 'pending').length})</Text>
        {driverRequests.filter(r => r.status === 'pending').map((trip) => {
          const estPrice = calculatePrice(trip.distanceKm, trip.travelTimeMin, isPeakHour);
          return (
            <Pressable 
              key={trip.id} 
              style={[styles.tripCard, selectedTrip?.id === trip.id && styles.tripCardSelected]} 
              onPress={() => {
                setSelectedTrip(trip);
                focusOnLocation(trip.pickupCoords[0], trip.pickupCoords[1]);
              }}
            >
              <View style={styles.tripCardHeader}>
                <View style={styles.tripRouteIcon}>
                  <Navigation size={18} color={colors.secondary[500]} />
                </View>
                <View style={styles.tripRouteInfo}>
                  <Text style={styles.tripOrigin}>{trip.origin}</Text>
                  <ChevronRight size={14} color={colors.text.tertiary} />
                  <Text style={styles.tripDestination}>{trip.destination}</Text>
                </View>
              </View>
              <View style={styles.tripCardFooter}>
                <View style={styles.tripPriceContainer}>
                  <Text style={styles.tripPrice}>{Math.round(estPrice)} MAD</Text>
                  <Text style={styles.tripDuration}>{trip.travelTimeMin} min • {trip.distanceKm} km</Text>
                </View>
                <View style={styles.tripActions}>
                  <Pressable style={styles.acceptBtn} onPress={() => Alert.alert('Course acceptée', 'Vous pouvez procéder!')}>
                    <CheckCircle2 size={22} color={colors.text.inverse} />
                  </Pressable>
                  <Pressable style={styles.declineBtn} onPress={() => { setSelectedTrip(null); Alert.alert('Décliné', 'Course refusée') }}>
                    <XCircle size={22} color={colors.semantic.error} />
                  </Pressable>
                </View>
              </View>
            </Pressable>
          );
        })}
      </View>
    );
  };

  const renderTripDetail = () => {
    if (!selectedTrip) return null;
    const trip = selectedTrip;
    const chat = mockChats[0];
    const tripPrice = calculatePrice(trip.distanceKm, trip.travelTimeMin, true);
    const routeCoords = [
      { latitude: trip.pickupCoords[0], longitude: trip.pickupCoords[1] },
      { latitude: trip.destinationCoords[0], longitude: trip.destinationCoords[1] },
    ];

    return (
      <View style={styles.tripDetailContainer}>
        <View style={styles.tripDetailHeader}>
          <Pressable onPress={() => setSelectedTrip(null)} style={styles.backBtn}>
            <ArrowLeft size={24} color={colors.text.primary} />
          </Pressable>
          <Text style={styles.tripDetailTitle}>Détails de la course</Text>
        </View>

        <ScrollView style={styles.tripDetailScroll}>
          <View style={styles.tripDetailMap}>
            <MapView
              style={styles.tripMap}
              provider={PROVIDER_GOOGLE}
              initialRegion={{
                latitude: (trip.pickupCoords[0] + trip.destinationCoords[0]) / 2,
                longitude: (trip.pickupCoords[1] + trip.destinationCoords[1]) / 2,
                latitudeDelta: 0.05,
                longitudeDelta: 0.05,
              }}
            >
              <Marker coordinate={{ latitude: trip.pickupCoords[0], longitude: trip.pickupCoords[1] }} title="Départ" pinColor={colors.secondary[500]}>
                <View style={styles.pickupMarker}><MapPin size={20} color={colors.secondary[500]} /></View>
              </Marker>
              <Marker coordinate={{ latitude: trip.destinationCoords[0], longitude: trip.destinationCoords[1] }} title="Arrivée" pinColor={colors.semantic.error}>
                <View style={styles.dropoffMarker}><Navigation2 size={20} color={colors.semantic.error} /></View>
              </Marker>
              <Polyline coordinates={routeCoords} strokeColor={colors.secondary[500]} strokeWidth={3} />
            </MapView>
          </View>

          <View style={styles.tripDetailCard}>
            <View style={styles.tripDetailRow}>
              <View style={styles.locationDot} />
              <View style={styles.locationInfo}>
                <Text style={styles.locationLabel}>Départ</Text>
                <Text style={styles.locationValue}>{trip.origin}</Text>
              </View>
            </View>
            <View style={styles.tripLine} />
            <View style={styles.tripDetailRow}>
              <View style={[styles.locationDot, styles.locationDotEnd]} />
              <View style={styles.locationInfo}>
                <Text style={styles.locationLabel}>Arrivée</Text>
                <Text style={styles.locationValue}>{trip.destination}</Text>
              </View>
            </View>
          </View>

          <View style={styles.tripDetailInfo}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Prix estimé</Text>
              <Text style={styles.infoValueHighlight}>{Math.round(tripPrice)} MAD</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Distance</Text>
              <Text style={styles.infoValue}>{trip.distanceKm} km</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Durée estimée</Text>
              <Text style={styles.infoValue}>{trip.travelTimeMin} min</Text>
            </View>
          </View>

          <View style={styles.quickActions}>
            <Text style={styles.quickActionsTitle}>Contacter le client</Text>
            <View style={styles.quickActionsRow}>
              <Pressable style={styles.quickActionBtn} onPress={() => handleCall(chat.phone)}>
                <PhoneCall size={24} color={colors.text.inverse} />
                <Text style={styles.quickActionText}>Appeler</Text>
              </Pressable>
              <Pressable style={styles.quickActionBtnSecondary} onPress={() => { setActiveChat(chat.id); setActiveNav('messages'); setSelectedTrip(null); }}>
                <MessageCircle size={24} color={colors.secondary[500]} />
                <Text style={styles.quickActionTextSecondary}>Message</Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  };

  const renderMessages = () => {
    if (activeChat) {
      const chat = mockChats.find(c => c.id === activeChat);
      if (!chat) return null;

      return (
        <View style={styles.chatContainer}>
          <View style={styles.chatHeader}>
            <Pressable onPress={() => setActiveChat(null)} style={styles.backBtn}>
              <ArrowLeft size={24} color={colors.text.primary} />
            </Pressable>
            <View style={styles.chatHeaderContent}>
              <View style={styles.chatAvatarSmall}>
                <Text style={styles.chatAvatarSmallText}>{chat.name.charAt(0)}</Text>
                {chat.online && <View style={styles.onlineDot} />}
              </View>
              <View>
                <Text style={styles.chatName}>{chat.name}</Text>
                <Text style={styles.chatStatus}>{chat.online ? 'En ligne' : 'Hors ligne'}</Text>
              </View>
            </View>
            <View style={styles.chatHeaderActions}>
              <Pressable onPress={() => handleCall(chat.phone)} style={styles.headerActionBtn}>
                <PhoneCall size={20} color={colors.secondary[500]} />
              </Pressable>
              <Pressable style={styles.headerActionBtn}>
                <Video size={20} color={colors.secondary[500]} />
              </Pressable>
            </View>
          </View>

          <View style={styles.messagesArea}>
            <FlatList
              data={messages}
              keyExtractor={item => item.id}
              renderItem={({ item }) => {
                const isMe = item.senderId === 'driver';
                return (
                  <View style={[styles.messageWrapper, isMe && styles.messageWrapperSent]}>
                    <View style={[styles.messageBubbleWhatsApp, isMe ? styles.messageSent : styles.messageReceived]}>
                      <Text style={[styles.messageTextWhatsApp, isMe && styles.messageTextSent]}>{item.text}</Text>
                      <View style={styles.messageMeta}>
                        <Text style={[styles.messageTimeWhatsApp, isMe && styles.messageTimeSent]}>{item.time}</Text>
                        {isMe && <Check size={12} color={colors.secondary[500]} />}
                      </View>
                    </View>
                  </View>
                );
              }}
              contentContainerStyle={styles.messagesListContent}
            />
          </View>

          <View style={styles.chatInputArea}>
            <View style={styles.chatInputRow}>
              <Pressable style={styles.attachBtn}>
                <Paperclip size={22} color={colors.text.tertiary} />
              </Pressable>
              <TextInput
                style={styles.chatInputField}
                value={chatMessage}
                onChangeText={setChatMessage}
                placeholder="Message..."
                placeholderTextColor={colors.text.tertiary}
              />
              <Pressable style={styles.voiceBtn}>
                <Mic size={22} color={colors.text.inverse} />
              </Pressable>
              <Pressable 
                style={[styles.sendBtn, !chatMessage.trim() && styles.sendBtnDisabled]} 
                onPress={handleSendMessage}
                disabled={!chatMessage.trim()}
              >
                <Send size={20} color={colors.text.inverse} />
              </Pressable>
            </View>
          </View>
        </View>
      );
    }

    return (
      <View style={styles.chatsListContainer}>
        <View style={styles.chatsListHeader}>
          <Text style={styles.chatsListTitle}>Messages</Text>
        </View>
        <View style={styles.searchBar}>
          <Search size={18} color={colors.text.tertiary} />
          <TextInput style={styles.searchInputField} placeholder="Rechercher..." placeholderTextColor={colors.text.tertiary} />
        </View>
        <FlatList
          data={mockChats}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <Pressable style={styles.chatListItem} onPress={() => setActiveChat(item.id)}>
              <View style={styles.chatListAvatar}>
                <Text style={styles.chatListAvatarText}>{item.name.charAt(0)}</Text>
                {item.online && <View style={styles.onlineIndicator} />}
              </View>
              <View style={styles.chatListContent}>
                <View style={styles.chatListTop}>
                  <Text style={styles.chatListName}>{item.name}</Text>
                  <Text style={styles.chatListTime}>16:28</Text>
                </View>
                <View style={styles.chatListBottom}>
                  <Text style={styles.chatListPreview} numberOfLines={1}>{item.lastMessage}</Text>
                  {item.unread > 0 && (
                    <View style={styles.unreadBadge}>
                      <Text style={styles.unreadText}>{item.unread}</Text>
                    </View>
                  )}
                </View>
              </View>
            </Pressable>
          )}
        />
      </View>
    );
  };

  const renderProfile = () => (
    <ScrollView style={styles.profileScroll} contentContainerStyle={styles.profileContent}>
      <View style={styles.profileHeader}>
        <View style={styles.profileAvatarLarge}>
          <Text style={styles.profileAvatarLargeText}>SA</Text>
        </View>
        <Text style={styles.profileName}>Samrat Alami</Text>
        <View style={styles.profileRating}>
          <Star size={16} color={colors.accent[500]} fill={colors.accent[500]} />
          <Text style={styles.profileRatingText}>4.92</Text>
        </View>
        <Text style={styles.profileId}>ID: 8849-MA</Text>
      </View>

      <View style={styles.profileActions}>
        <Pressable style={styles.profileAction}>
          <User size={20} color={colors.secondary[500]} />
          <Text style={styles.profileActionText}>Modifier profil</Text>
        </Pressable>
        <Pressable style={styles.profileAction}>
          <Car size={20} color={colors.secondary[500]} />
          <Text style={styles.profileActionText}>Mon véhicule</Text>
        </Pressable>
        <Pressable style={styles.profileAction}>
          <FileText size={20} color={colors.secondary[500]} />
          <Text style={styles.profileActionText}>Documents</Text>
        </Pressable>
      </View>

      <View style={styles.profileSection}>
        <Text style={styles.profileSectionTitle}>Informations</Text>
        <View style={styles.profileInfoItem}>
          <Phone size={18} color={colors.secondary[500]} />
          <View>
            <Text style={styles.profileInfoLabel}>Téléphone</Text>
            <Text style={styles.profileInfoValue}>+212 661 123 456</Text>
          </View>
        </View>
        <View style={styles.profileInfoItem}>
          <Mail size={18} color={colors.secondary[500]} />
          <View>
            <Text style={styles.profileInfoLabel}>Email</Text>
            <Text style={styles.profileInfoValue}>s.alami@navito.ma</Text>
          </View>
        </View>
        <View style={styles.profileInfoItem}>
          <MapPin size={18} color={colors.secondary[500]} />
          <View>
            <Text style={styles.profileInfoLabel}>Ville</Text>
            <Text style={styles.profileInfoValue}>Casablanca</Text>
          </View>
        </View>
      </View>

      <View style={styles.profileSection}>
        <Text style={styles.profileSectionTitle}>Véhicule</Text>
        <View style={styles.vehicleCard}>
          <Car size={32} color={colors.secondary[500]} />
          <View style={styles.vehicleInfo}>
            <Text style={styles.vehicleName}>Toyota Camry</Text>
            <Text style={styles.vehiclePlate}>11-A-4432</Text>
          </View>
          <ChevronRight size={20} color={colors.text.tertiary} />
        </View>
      </View>

      <View style={styles.profileSection}>
        <Text style={styles.profileSectionTitle}>État du compte</Text>
        <View style={styles.accountStatusCard}>
          <CheckCircle2 size={24} color={colors.secondary[500]} />
          <View style={styles.accountStatusInfo}>
            <Text style={styles.accountStatusTitle}>Compte vérifié</Text>
            <Text style={styles.accountStatusSub}>Tous vos documents sont validés</Text>
          </View>
        </View>
      </View>

      <Pressable style={styles.logoutBtn} onPress={handleLogout}>
        <LogOut size={20} color={colors.semantic.error} />
        <Text style={styles.logoutBtnText}>Déconnexion</Text>
      </Pressable>
    </ScrollView>
  );

  const renderReviews = () => (
    <View style={styles.reviewsContainer}>
      <View style={styles.reviewsHeader}>
        <Text style={styles.reviewsTitle}>Vos avis</Text>
        <Text style={styles.reviewsSubtitle}>Note globale</Text>
      </View>
      <View style={styles.ratingDisplay}>
        <Text style={styles.ratingNumber}>4.92</Text>
        <View style={styles.ratingStarsRow}>
          {[1, 2, 3, 4, 5].map((s) => (
            <Star key={s} size={32} color={s <= 4 ? colors.accent[500] : colors.text.tertiary} fill={s <= 4 ? colors.accent[500] : 'transparent'} />
          ))}
        </View>
        <Text style={styles.reviewsCount}>127 avis</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style={activeNav === 'dashboard' ? 'light' : 'dark'} />
      
      {activeNav !== 'dashboard' && (
        <View style={styles.topBar}>
          <Text style={styles.topBarTitle}>
            {activeNav === 'messages' ? 'Messages' : 
             activeNav === 'profile' ? 'Mon Compte' : 'Avis Clients'}
          </Text>
        </View>
      )}

      {activeNav === 'dashboard' ? (
        <View style={styles.dashboardContainer}>
          <View style={styles.dashboardHeader}>
            <View>
              <Text style={styles.greeting}>Bonjour, Samrat!</Text>
              <Text style={styles.dateTime}>{formatTime()}</Text>
            </View>
            <View style={styles.profileBtn}>
              <Text style={styles.profileBtnText}>S</Text>
            </View>
          </View>
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            {selectedTrip ? renderTripDetail() : renderDashboard()}
          </ScrollView>
        </View>
      ) : (
        <>
          {activeNav === 'messages' && renderMessages()}
          {activeNav === 'profile' && renderProfile()}
          {activeNav === 'reviews' && renderReviews()}
        </>
      )}

      <View style={styles.bottomNav}>
        {navItems.map(({ id, label, icon: Icon }) => {
          const isActive = activeNav === id;
          return (
            <Pressable key={id} onPress={() => handleNav(id)} style={styles.bottomNavItem}>
              <View style={[styles.bottomNavIcon, isActive && styles.bottomNavIconActive]}>
                <Icon size={22} color={isActive ? colors.secondary[500] : colors.text.tertiary} />
              </View>
              <Text style={[styles.bottomNavLabel, isActive && styles.bottomNavLabelActive]}>{label}</Text>
            </Pressable>
          );
        })}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background.primary },
  topBar: { paddingHorizontal: spacing[4], paddingVertical: spacing[3], backgroundColor: colors.surface.primary, borderBottomWidth: 1, borderBottomColor: colors.border.light },
  topBarTitle: { fontFamily: typography.fontFamily.bold, fontSize: typography.size.xl, color: colors.text.primary },

  dashboardContainer: { flex: 1, backgroundColor: colors.background.primary },
  dashboardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: spacing[4], paddingTop: spacing[4], paddingBottom: spacing[2] },
  greeting: { fontFamily: typography.fontFamily.bold, fontSize: typography.size['2xl'], color: colors.text.primary },
  dateTime: { fontFamily: typography.fontFamily.medium, fontSize: typography.size.sm, color: colors.text.tertiary, marginTop: 2 },
  profileBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.secondary[500], alignItems: 'center', justifyContent: 'center' },
  profileBtnText: { fontFamily: typography.fontFamily.bold, fontSize: typography.size.lg, color: colors.text.inverse },
  scrollContent: { padding: spacing[4], paddingBottom: 100 },

  dashboardContent: { gap: spacing[4] },
  statusCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: colors.surface.primary, padding: spacing[4], borderRadius: borderRadius.xl },
  statusLeft: { flexDirection: 'row', alignItems: 'center', gap: spacing[3] },
  statusIndicator: { width: 12, height: 12, borderRadius: 6 },
  statusOnline: { backgroundColor: colors.secondary[500] },
  statusOffline: { backgroundColor: colors.semantic.error },
  statusLabel: { fontFamily: typography.fontFamily.bold, fontSize: typography.size.base, color: colors.text.primary },
  statusSubtext: { fontFamily: typography.fontFamily.medium, fontSize: typography.size.xs, color: colors.text.tertiary },

  hotAlert: { backgroundColor: colors.secondary[500], borderRadius: borderRadius.xl, padding: spacing[4], overflow: 'hidden' },
  hotAlertContent: { zIndex: 1 },
  hotAlertHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing[2] },
  hotAlertTitle: { fontFamily: typography.fontFamily.bold, fontSize: typography.size.sm, color: colors.text.inverse },
  hotAlertSubtitle: { fontFamily: typography.fontFamily.bold, fontSize: typography.size.lg, color: colors.text.inverse, marginTop: spacing[1] },
  hotAlertDesc: { fontFamily: typography.fontFamily.medium, fontSize: typography.size.sm, color: colors.text.inverse, opacity: 0.9 },
  hotAlertGlow: { position: 'absolute', right: -20, bottom: -20, width: 100, height: 100, borderRadius: 50, backgroundColor: colors.secondary[300], opacity: 0.3 },

  mapCard: { borderRadius: borderRadius.xl, overflow: 'hidden', height: 220 },
  map: { ...StyleSheet.absoluteFillObject },
  mapOverlay: { position: 'absolute', top: spacing[3], left: spacing[3], flexDirection: 'row', alignItems: 'center', gap: spacing[2], backgroundColor: 'rgba(0,0,0,0.6)', paddingHorizontal: spacing[3], paddingVertical: spacing[2], borderRadius: borderRadius.full },
  mapLocationText: { fontFamily: typography.fontFamily.bold, fontSize: typography.size.sm, color: colors.text.inverse },
  mapPerformanceBadge: { position: 'absolute', bottom: spacing[3], left: spacing[3], flexDirection: 'row', alignItems: 'center', gap: spacing[1], backgroundColor: colors.surface.primary, paddingHorizontal: spacing[3], paddingVertical: spacing[2], borderRadius: borderRadius.lg },
  mapPerformanceText: { fontFamily: typography.fontFamily.bold, fontSize: typography.size.xs, color: colors.secondary[500] },

  driverMarker: { alignItems: 'center', justifyContent: 'center' },
  driverMarkerInner: { position: 'absolute', width: 50, height: 50, borderRadius: 25, backgroundColor: colors.secondary[500] + '40' },
  driverMarkerCenter: { width: 36, height: 36, borderRadius: 18, backgroundColor: colors.secondary[500], alignItems: 'center', justifyContent: 'center', borderWidth: 3, borderColor: colors.surface.primary },
  tripMarker: { alignItems: 'center', justifyContent: 'center' },

  statsRow: { flexDirection: 'row', gap: spacing[3] },
  statCard: { flex: 1, backgroundColor: colors.surface.primary, borderRadius: borderRadius.lg, padding: spacing[3], alignItems: 'center' },
  statIcon: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginBottom: spacing[2] },
  statValue: { fontFamily: typography.fontFamily.bold, fontSize: typography.size.lg, color: colors.text.primary },
  statSub: { fontFamily: typography.fontFamily.medium, fontSize: typography.size.xs, color: colors.text.tertiary },

  priceEstimateCard: { backgroundColor: colors.surface.primary, borderRadius: borderRadius.xl, padding: spacing[4] },
  priceEstimateHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing[3] },
  priceEstimateTitle: { fontFamily: typography.fontFamily.bold, fontSize: typography.size.base, color: colors.text.primary },
  peakBadge: { backgroundColor: colors.accent[500] + '20', paddingHorizontal: spacing[2], paddingVertical: spacing[1], borderRadius: borderRadius.sm },
  peakBadgeText: { fontFamily: typography.fontFamily.bold, fontSize: typography.size.xs, color: colors.accent[500] },
  priceBreakdown: { gap: spacing[2] },
  priceRow: { flexDirection: 'row', justifyContent: 'space-between' },
  priceLabel: { fontFamily: typography.fontFamily.medium, fontSize: typography.size.sm, color: colors.text.tertiary },
  priceValue: { fontFamily: typography.fontFamily.medium, fontSize: typography.size.sm, color: colors.text.primary },
  priceDivider: { height: 1, backgroundColor: colors.border.light, marginVertical: spacing[2] },
  priceTotalRow: { flexDirection: 'row', justifyContent: 'space-between' },
  priceTotalLabel: { fontFamily: typography.fontFamily.bold, fontSize: typography.size.base, color: colors.text.primary },
  priceTotalValue: { fontFamily: typography.fontFamily.bold, fontSize: typography.size.lg, color: colors.secondary[500] },

  sectionTitle: { fontFamily: typography.fontFamily.bold, fontSize: typography.size.base, color: colors.text.primary, marginTop: spacing[2] },

  tripCard: { backgroundColor: colors.surface.primary, borderRadius: borderRadius.xl, padding: spacing[4], borderWidth: 2, borderColor: 'transparent' },
  tripCardSelected: { borderColor: colors.secondary[500] },
  tripCardHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing[3], marginBottom: spacing[3] },
  tripRouteIcon: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.secondary[50], alignItems: 'center', justifyContent: 'center' },
  tripRouteInfo: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: spacing[2] },
  tripOrigin: { fontFamily: typography.fontFamily.medium, fontSize: typography.size.sm, color: colors.text.primary, flex: 1 },
  tripDestination: { fontFamily: typography.fontFamily.medium, fontSize: typography.size.sm, color: colors.text.primary, flex: 1 },
  tripCardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  tripPriceContainer: {},
  tripPrice: { fontFamily: typography.fontFamily.bold, fontSize: typography.size.xl, color: colors.secondary[500] },
  tripDuration: { fontFamily: typography.fontFamily.medium, fontSize: typography.size.xs, color: colors.text.tertiary },
  tripActions: { flexDirection: 'row', gap: spacing[2] },
  acceptBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.secondary[500], alignItems: 'center', justifyContent: 'center' },
  declineBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.background.secondary, alignItems: 'center', justifyContent: 'center' },

  tripDetailContainer: { flex: 1 },
  tripDetailHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing[3], marginBottom: spacing[4] },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.surface.primary, alignItems: 'center', justifyContent: 'center' },
  tripDetailTitle: { fontFamily: typography.fontFamily.bold, fontSize: typography.size.lg, color: colors.text.primary },
  tripDetailScroll: { flex: 1 },
  tripDetailMap: { height: 200, borderRadius: borderRadius.xl, overflow: 'hidden', marginBottom: spacing[4] },
  tripMap: { ...StyleSheet.absoluteFillObject },
  pickupMarker: { backgroundColor: colors.surface.primary, borderRadius: 12, padding: 4 },
  dropoffMarker: { backgroundColor: colors.surface.primary, borderRadius: 12, padding: 4 },
  tripDetailCard: { backgroundColor: colors.surface.primary, borderRadius: borderRadius.xl, padding: spacing[4], marginBottom: spacing[4] },
  tripDetailRow: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing[3] },
  locationDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: colors.secondary[500], marginTop: 4 },
  locationDotEnd: { backgroundColor: colors.semantic.error },
  locationInfo: { flex: 1 },
  locationLabel: { fontFamily: typography.fontFamily.medium, fontSize: typography.size.xs, color: colors.text.tertiary },
  locationValue: { fontFamily: typography.fontFamily.bold, fontSize: typography.size.base, color: colors.text.primary },
  tripLine: { width: 2, height: 30, backgroundColor: colors.border.light, marginLeft: 5, marginVertical: spacing[1] },
  tripDetailInfo: { backgroundColor: colors.surface.primary, borderRadius: borderRadius.xl, padding: spacing[4], marginBottom: spacing[4] },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: spacing[2], borderBottomWidth: 1, borderBottomColor: colors.border.light },
  infoLabel: { fontFamily: typography.fontFamily.medium, fontSize: typography.size.sm, color: colors.text.tertiary },
  infoValue: { fontFamily: typography.fontFamily.bold, fontSize: typography.size.sm, color: colors.text.primary },
  infoValueHighlight: { fontFamily: typography.fontFamily.bold, fontSize: typography.size.lg, color: colors.secondary[500] },
  quickActions: { marginTop: spacing[2] },
  quickActionsTitle: { fontFamily: typography.fontFamily.bold, fontSize: typography.size.base, color: colors.text.primary, marginBottom: spacing[3] },
  quickActionsRow: { flexDirection: 'row', gap: spacing[3] },
  quickActionBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing[2], backgroundColor: colors.secondary[500], paddingVertical: spacing[4], borderRadius: borderRadius.xl },
  quickActionText: { fontFamily: typography.fontFamily.bold, fontSize: typography.size.sm, color: colors.text.inverse },
  quickActionBtnSecondary: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing[2], backgroundColor: colors.secondary[50], paddingVertical: spacing[4], borderRadius: borderRadius.xl, borderWidth: 1, borderColor: colors.secondary[500] },
  quickActionTextSecondary: { fontFamily: typography.fontFamily.bold, fontSize: typography.size.sm, color: colors.secondary[500] },

  chatsListContainer: { flex: 1, backgroundColor: colors.background.primary },
  chatsListHeader: { padding: spacing[4], paddingBottom: spacing[2] },
  chatsListTitle: { fontFamily: typography.fontFamily.bold, fontSize: typography.size.xl, color: colors.text.primary },
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface.primary, marginHorizontal: spacing[4], marginBottom: spacing[3], paddingHorizontal: spacing[3], borderRadius: borderRadius.lg },
  searchInputField: { flex: 1, paddingVertical: spacing[3], fontFamily: typography.fontFamily.medium, fontSize: typography.size.sm, color: colors.text.primary, marginLeft: spacing[2] },
  chatListItem: { flexDirection: 'row', alignItems: 'center', gap: spacing[3], paddingHorizontal: spacing[4], paddingVertical: spacing[3], borderBottomWidth: 1, borderBottomColor: colors.border.light },
  chatListAvatar: { width: 56, height: 56, borderRadius: 28, backgroundColor: colors.secondary[200], alignItems: 'center', justifyContent: 'center', position: 'relative' },
  chatListAvatarText: { fontFamily: typography.fontFamily.bold, fontSize: typography.size.lg, color: colors.secondary[500] },
  onlineIndicator: { position: 'absolute', bottom: 2, right: 2, width: 14, height: 14, borderRadius: 7, backgroundColor: colors.secondary[500], borderWidth: 2, borderColor: colors.surface.primary },
  chatListContent: { flex: 1 },
  chatListTop: { flexDirection: 'row', justifyContent: 'space-between' },
  chatListName: { fontFamily: typography.fontFamily.bold, fontSize: typography.size.base, color: colors.text.primary },
  chatListTime: { fontFamily: typography.fontFamily.medium, fontSize: typography.size.xs, color: colors.text.tertiary },
  chatListBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 2 },
  chatListPreview: { fontFamily: typography.fontFamily.medium, fontSize: typography.size.sm, color: colors.text.tertiary, flex: 1 },
  unreadBadge: { minWidth: 20, height: 20, borderRadius: 10, backgroundColor: colors.secondary[500], alignItems: 'center', justifyContent: 'center', paddingHorizontal: 6 },
  unreadText: { fontFamily: typography.fontFamily.bold, fontSize: 10, color: colors.text.inverse },

  chatContainer: { flex: 1, backgroundColor: colors.background.primary },
  chatHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing[3], padding: spacing[3], backgroundColor: colors.surface.primary, borderBottomWidth: 1, borderBottomColor: colors.border.light },
  chatHeaderContent: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: spacing[3] },
  chatAvatarSmall: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.secondary[200], alignItems: 'center', justifyContent: 'center', position: 'relative' },
  chatAvatarSmallText: { fontFamily: typography.fontFamily.bold, fontSize: typography.size.base, color: colors.secondary[500] },
  onlineDot: { position: 'absolute', bottom: 0, right: 0, width: 12, height: 12, borderRadius: 6, backgroundColor: colors.secondary[500], borderWidth: 2, borderColor: colors.surface.primary },
  chatName: { fontFamily: typography.fontFamily.bold, fontSize: typography.size.base, color: colors.text.primary },
  chatStatus: { fontFamily: typography.fontFamily.medium, fontSize: typography.size.xs, color: colors.secondary[500] },
  chatHeaderActions: { flexDirection: 'row', gap: spacing[2] },
  headerActionBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.secondary[50], alignItems: 'center', justifyContent: 'center' },

  messagesArea: { flex: 1, padding: spacing[3] },
  messagesListContent: { gap: spacing[2] },
  messageWrapper: { flexDirection: 'row', marginBottom: spacing[2] },
  messageWrapperSent: { justifyContent: 'flex-end' },
  messageBubbleWhatsApp: { maxWidth: '80%', paddingHorizontal: spacing[3], paddingVertical: spacing[2], borderRadius: borderRadius.lg },
  messageSent: { backgroundColor: colors.secondary[500], borderBottomRightRadius: 4 },
  messageReceived: { backgroundColor: colors.surface.primary, borderBottomLeftRadius: 4 },
  messageTextWhatsApp: { fontFamily: typography.fontFamily.medium, fontSize: typography.size.sm, color: colors.text.primary },
  messageTextSent: { color: colors.text.inverse },
  messageMeta: { flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', gap: 4, marginTop: 4 },
  messageTimeWhatsApp: { fontFamily: typography.fontFamily.medium, fontSize: 10, color: colors.text.tertiary },
  messageTimeSent: { color: colors.text.inverse, opacity: 0.7 },

  chatInputArea: { padding: spacing[3], backgroundColor: colors.surface.primary, borderTopWidth: 1, borderTopColor: colors.border.light },
  chatInputRow: { flexDirection: 'row', alignItems: 'center', gap: spacing[2] },
  attachBtn: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  chatInputField: { flex: 1, backgroundColor: colors.background.secondary, paddingHorizontal: spacing[4], paddingVertical: spacing[3], borderRadius: borderRadius.xl, fontFamily: typography.fontFamily.medium, fontSize: typography.size.sm },
  voiceBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.secondary[500], alignItems: 'center', justifyContent: 'center' },
  sendBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.secondary[500], alignItems: 'center', justifyContent: 'center' },
  sendBtnDisabled: { backgroundColor: colors.text.tertiary },

  profileScroll: { flex: 1 },
  profileContent: { paddingBottom: 100 },
  profileHeader: { alignItems: 'center', padding: spacing[8], backgroundColor: colors.secondary[500] },
  profileAvatarLarge: { width: 90, height: 90, borderRadius: 45, backgroundColor: 'rgba(255,255,255,0.3)', alignItems: 'center', justifyContent: 'center', marginBottom: spacing[3] },
  profileAvatarLargeText: { fontFamily: typography.fontFamily.bold, fontSize: typography.size['3xl'], color: colors.text.inverse },
  profileName: { fontFamily: typography.fontFamily.bold, fontSize: typography.size.xl, color: colors.text.inverse },
  profileRating: { flexDirection: 'row', alignItems: 'center', gap: spacing[1], marginTop: spacing[2] },
  profileRatingText: { fontFamily: typography.fontFamily.bold, fontSize: typography.size.base, color: colors.text.inverse },
  profileId: { fontFamily: typography.fontFamily.medium, fontSize: typography.size.sm, color: colors.text.inverse, opacity: 0.7, marginTop: spacing[2] },

  profileActions: { flexDirection: 'row', justifyContent: 'center', gap: spacing[3], marginTop: -spacing[4], paddingHorizontal: spacing[4] },
  profileAction: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing[2], backgroundColor: colors.surface.primary, paddingVertical: spacing[3], borderRadius: borderRadius.lg },
  profileActionText: { fontFamily: typography.fontFamily.medium, fontSize: typography.size.xs, color: colors.text.primary },

  profileSection: { backgroundColor: colors.surface.primary, marginHorizontal: spacing[4], marginTop: spacing[4], borderRadius: borderRadius.xl, padding: spacing[4] },
  profileSectionTitle: { fontFamily: typography.fontFamily.bold, fontSize: typography.size.base, color: colors.text.primary, marginBottom: spacing[3] },
  profileInfoItem: { flexDirection: 'row', alignItems: 'center', gap: spacing[3], paddingVertical: spacing[3], borderBottomWidth: 1, borderBottomColor: colors.border.light },
  profileInfoLabel: { fontFamily: typography.fontFamily.medium, fontSize: typography.size.xs, color: colors.text.tertiary },
  profileInfoValue: { fontFamily: typography.fontFamily.bold, fontSize: typography.size.sm, color: colors.text.primary },

  vehicleCard: { flexDirection: 'row', alignItems: 'center', gap: spacing[3], backgroundColor: colors.secondary[50], padding: spacing[4], borderRadius: borderRadius.lg },
  vehicleInfo: { flex: 1 },
  vehicleName: { fontFamily: typography.fontFamily.bold, fontSize: typography.size.base, color: colors.text.primary },
  vehiclePlate: { fontFamily: typography.fontFamily.medium, fontSize: typography.size.sm, color: colors.text.tertiary },

  accountStatusCard: { flexDirection: 'row', alignItems: 'center', gap: spacing[3], backgroundColor: colors.secondary[50], padding: spacing[4], borderRadius: borderRadius.lg },
  accountStatusInfo: { flex: 1 },
  accountStatusTitle: { fontFamily: typography.fontFamily.bold, fontSize: typography.size.base, color: colors.text.primary },
  accountStatusSub: { fontFamily: typography.fontFamily.medium, fontSize: typography.size.xs, color: colors.text.tertiary },

  logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing[2], backgroundColor: colors.surface.primary, margin: spacing[4], marginTop: spacing[4], padding: spacing[4], borderRadius: borderRadius.xl },
  logoutBtnText: { fontFamily: typography.fontFamily.bold, fontSize: typography.size.base, color: colors.semantic.error },

  reviewsContainer: { flex: 1, alignItems: 'center', padding: spacing[6] },
  reviewsHeader: { alignItems: 'center', marginBottom: spacing[6] },
  reviewsTitle: { fontFamily: typography.fontFamily.bold, fontSize: typography.size.xl, color: colors.text.primary },
  reviewsSubtitle: { fontFamily: typography.fontFamily.medium, fontSize: typography.size.sm, color: colors.text.tertiary, marginTop: spacing[1] },
  ratingDisplay: { alignItems: 'center', backgroundColor: colors.surface.primary, padding: spacing[8], borderRadius: borderRadius.xl },
  ratingNumber: { fontFamily: typography.fontFamily.bold, fontSize: 64, color: colors.text.primary },
  ratingStarsRow: { flexDirection: 'row', marginVertical: spacing[2] },
  reviewsCount: { fontFamily: typography.fontFamily.medium, fontSize: typography.size.sm, color: colors.text.tertiary, marginTop: spacing[2] },

  bottomNav: { position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', paddingVertical: spacing[3], paddingBottom: spacing[5], backgroundColor: colors.surface.primary, borderTopWidth: 1, borderTopColor: colors.border.light, elevation: 8, shadowColor: '#000', shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.1, shadowRadius: 8 },
  bottomNavItem: { alignItems: 'center', flex: 1 },
  bottomNavIcon: { width: 44, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  bottomNavIconActive: { backgroundColor: colors.secondary[100] },
  bottomNavLabel: { fontFamily: typography.fontFamily.medium, fontSize: typography.size.xs, color: colors.text.tertiary, marginTop: 2 },
  bottomNavLabelActive: { color: colors.secondary[500], fontFamily: typography.fontFamily.bold },
});
