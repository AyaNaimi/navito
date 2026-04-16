export type ApiRole = 'tourist' | 'guide' | 'driver' | 'super_admin';

export type ApiAuthUser = {
  id: number;
  name: string;
  email: string;
  role: ApiRole;
  roles: ApiRole[];
  preferred_language: string;
  status: string;
  last_country?: { id: number; name: string; code: string } | null;
  last_city?: { id: number; name: string; slug: string; country_id: number } | null;
  guide_profile?: { status: 'pending' | 'approved' | 'rejected'; city?: { name: string } | null } | null;
  driver_profile?: {
    verification_status: 'none' | 'documents_pending' | 'pending' | 'verified' | 'rejected';
    phone?: string | null;
    vehicle_type?: string | null;
    city?: { name: string } | null;
  } | null;
};

type ApiResponse<T> = {
  data?: T;
  message?: string;
  token?: string;
  user?: ApiAuthUser;
};

export type ApiGuideRequest = {
  id: number;
  tourist_id: number;
  guide_id: number;
  city_id: number;
  travel_date?: string | null;
  notes?: string | null;
  status: 'pending' | 'accepted' | 'declined' | 'completed' | 'cancelled';
  created_at?: string;
  tourist?: {
    id: number;
    name: string;
    email: string;
  } | null;
  guide?: {
    id: number;
    name: string;
    email: string;
  } | null;
  city?: ApiCity | null;
};

export type ApiDriverRequest = {
  id: number;
  tourist_id: number;
  driver_id: number;
  city_id: number;
  pickup_location: string;
  destination?: string | null;
  travel_date?: string | null;
  notes?: string | null;
  status: 'pending' | 'accepted' | 'declined' | 'completed' | 'cancelled';
  created_at?: string;
  tourist?: {
    id: number;
    name: string;
    email: string;
    phone?: string | null;
  } | null;
  driver?: {
    id: number;
    name: string;
    email: string;
  } | null;
  city?: ApiCity | null;
};

export type DriverDashboardData = {
  role: 'driver';
  verification_status?: ApiAuthUser['driver_profile'] extends infer T
    ? T extends { verification_status: infer S }
      ? S
      : never
    : never;
  profile?: ApiAuthUser['driver_profile'] | null;
  requests: ApiDriverRequest[];
};

export type GuideDashboardData = {
  role: 'guide';
  profile_status?: ApiAuthUser['guide_profile'] extends infer T
    ? T extends { status: infer S }
      ? S
      : never
    : never;
  requests: ApiGuideRequest[];
};

export type TouristDashboardData = {
  role: 'tourist';
  guide_requests: ApiGuideRequest[];
  driver_requests: ApiDriverRequest[];
  favorites_count: number;
  community_events_count: number;
};

export type SuperAdminDashboardData = {
  role: 'super_admin';
  stats: {
    users: number;
    places: number;
    activities: number;
    restaurants: number;
    community_events: number;
    pending_guide_requests: number;
  };
};

export type ApiDashboardData =
  | DriverDashboardData
  | GuideDashboardData
  | TouristDashboardData
  | SuperAdminDashboardData;

export type ApiCountry = {
  id: number;
  name: string;
  code: string;
  is_active: boolean;
};

export type ApiDirectoryGuide = {
  id: number;
  name: string;
  email: string;
  role: ApiRole;
  city?: string | null;
  phone?: string | null;
  bio?: string | null;
  status?: string | null;
  verified: boolean;
};

export type ApiDirectoryDriver = {
  id: number;
  name: string;
  email: string;
  role: ApiRole;
  city?: string | null;
  phone?: string | null;
  vehicle_type?: string | null;
  vehicle_registration?: string | null;
  verification_status?: string | null;
  verified: boolean;
};

export type ApiCity = {
  id: number;
  country_id: number;
  name: string;
  slug: string;
  latitude?: number | null;
  longitude?: number | null;
  is_supported: boolean;
  country?: ApiCountry;
};

export type ApiConversationParticipant = {
  id: number;
  name: string;
  email: string;
  role: ApiRole;
  city?: string | null;
  phone?: string | null;
};

export type ApiConversationMessage = {
  id: number;
  body: string;
  created_at?: string | null;
  sender: {
    id: number;
    name: string;
    role?: ApiRole;
  };
};

export type ApiConversation = {
  id: number;
  title?: string | null;
  is_group: boolean;
  last_message_at?: string | null;
  participants: ApiConversationParticipant[];
  others: ApiConversationParticipant[];
  latest_message?: ApiConversationMessage | null;
  messages: ApiConversationMessage[];
};

export type ApiConversationContact = {
  id: number;
  name: string;
  email: string;
  role: ApiRole;
  city?: string | null;
};

const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';

async function apiFetch<T>(path: string, options: RequestInit = {}, token?: string | null): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers ?? {}),
    },
    ...options,
  });

  const payload = (await response.json().catch(() => ({}))) as ApiResponse<T> & { errors?: Record<string, string[]> };

  if (!response.ok) {
    const validationMessage = payload.errors
      ? Object.values(payload.errors).flat().join(' ')
      : undefined;
    throw new Error(validationMessage || payload.message || 'Une erreur est survenue avec l API.');
  }

  return payload as T;
}

export async function loginRequest(payload: { email: string; password: string; role?: ApiRole }) {
  return apiFetch<ApiResponse<never>>('/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function registerRequest(payload: {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  role: ApiRole;
  preferred_language?: string;
}) {
  return apiFetch<ApiResponse<never>>('/register', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function fetchCountries() {
  return apiFetch<ApiResponse<ApiCountry[]>>('/countries');
}

export async function fetchCities(countryId?: number) {
  const query = countryId ? `?country_id=${countryId}` : '';
  return apiFetch<ApiResponse<ApiCity[]>>(`/cities${query}`);
}

export async function detectLocation(
  payload: { latitude: number; longitude: number },
  token?: string | null,
) {
  const endpoint = token ? '/detect-location/authenticated' : '/detect-location';
  return apiFetch<ApiResponse<{
    latitude: number;
    longitude: number;
    city?: ApiCity | null;
    country?: ApiCountry | null;
    is_supported: boolean;
  }>>(endpoint, {
    method: 'POST',
    body: JSON.stringify(payload),
  }, token);
}

export async function logoutRequest(token?: string | null) {
  return apiFetch<ApiResponse<never>>('/logout', {
    method: 'POST',
  }, token);
}

export async function fetchDashboard(token: string) {
  return apiFetch<ApiResponse<ApiDashboardData>>('/me/dashboard', {}, token);
}

export async function fetchDirectoryGuides(city?: string) {
  const query = city ? `?city=${encodeURIComponent(city)}` : '';
  return apiFetch<ApiResponse<ApiDirectoryGuide[]>>(`/directory/guides${query}`);
}

export async function fetchDirectoryDrivers(city?: string) {
  const query = city ? `?city=${encodeURIComponent(city)}` : '';
  return apiFetch<ApiResponse<ApiDirectoryDriver[]>>(`/directory/drivers${query}`);
}

export async function createGuideRequest(
  payload: {
    guide_id: number;
    city_id: number;
    travel_date?: string;
    notes?: string;
  },
  token: string,
) {
  return apiFetch<ApiResponse<ApiGuideRequest>>('/guide-requests', {
    method: 'POST',
    body: JSON.stringify(payload),
  }, token);
}

export async function createDriverRequest(
  payload: {
    driver_id: number;
    city_id: number;
    pickup_location: string;
    destination?: string;
    travel_date?: string;
    notes?: string;
  },
  token: string,
) {
  return apiFetch<ApiResponse<ApiDriverRequest>>('/driver-requests', {
    method: 'POST',
    body: JSON.stringify(payload),
  }, token);
}

export async function updateGuideRequest(
  id: number,
  payload: Partial<Pick<ApiGuideRequest, 'status' | 'travel_date' | 'notes'>>,
  token: string,
) {
  return apiFetch<ApiResponse<ApiGuideRequest>>(`/guide-requests/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  }, token);
}

export async function updateDriverRequest(
  id: number,
  payload: Partial<Pick<ApiDriverRequest, 'status' | 'travel_date' | 'notes' | 'pickup_location' | 'destination'>>,
  token: string,
) {
  return apiFetch<ApiResponse<ApiDriverRequest>>(`/driver-requests/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  }, token);
}

export async function fetchConversations(token: string) {
  return apiFetch<ApiResponse<ApiConversation[]>>('/conversations', {}, token);
}

export async function fetchConversation(id: number, token: string) {
  return apiFetch<ApiResponse<ApiConversation>>(`/conversations/${id}`, {}, token);
}

export async function createConversation(
  payload: { participant_ids: number[]; title?: string; initial_message?: string },
  token: string,
) {
  return apiFetch<ApiResponse<ApiConversation>>('/conversations', {
    method: 'POST',
    body: JSON.stringify(payload),
  }, token);
}

export async function sendConversationMessage(
  conversationId: number,
  payload: { body: string },
  token: string,
) {
  return apiFetch<ApiResponse<ApiConversationMessage>>(`/conversations/${conversationId}/messages`, {
    method: 'POST',
    body: JSON.stringify(payload),
  }, token);
}

export async function fetchConversationContacts(token: string, search?: string) {
  const query = search ? `?search=${encodeURIComponent(search)}` : '';
  return apiFetch<ApiResponse<ApiConversationContact[]>>(`/directory/users${query}`, {}, token);
}

export type ApiPlace = {
  id: number;
  city_id: number;
  name: string;
  slug: string;
  category: string;
  description?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  address?: string | null;
  opening_hours?: string | null;
  entry_price_min?: number | null;
  entry_price_max?: number | null;
  rating?: number | null;
  is_published: boolean;
  city?: ApiCity | null;
};

export type ApiActivity = {
  id: number;
  city_id: number;
  name: string;
  slug: string;
  description?: string | null;
  duration_label?: string | null;
  price_min?: number | null;
  price_max?: number | null;
  rating?: number | null;
  is_published: boolean;
  city?: ApiCity | null;
  created_at?: string;
  updated_at?: string;
};

export type ActivityPayload = {
  city_id: number;
  name: string;
  slug: string;
  description?: string;
  duration_label?: string;
  price_min?: number | null;
  price_max?: number | null;
  rating?: number | null;
  is_published?: boolean;
};

export type ApiRestaurant = {
  id: number;
  city_id: number;
  name: string;
  slug: string;
  cuisine?: string | null;
  average_price?: number | null;
  rating?: number | null;
  is_halal: boolean;
  latitude?: number | null;
  longitude?: number | null;
  address?: string | null;
  opening_hours?: string | null;
  phone?: string | null;
  is_published: boolean;
  city?: {
    id: number;
    name: string;
    slug: string;
    country?: {
      id: number;
      name: string;
      code: string;
    };
  } | null;
};

export async function fetchPlaces(cityId?: number, search?: string) {
  const params = new URLSearchParams();
  if (cityId) params.set('city_id', cityId.toString());
  if (search) params.set('search', search);
  params.set('is_published', '1');
  params.set('sort', 'rating');
  params.set('direction', 'desc');
  const query = params.toString() ? `?${params.toString()}` : '';
  return apiFetch<ApiResponse<ApiPlace[]>>(`/places${query}`);
}

export async function fetchPlace(id: number) {
  return apiFetch<ApiResponse<ApiPlace>>(`/places/${id}`);
}

export async function fetchActivities(cityId?: number, search?: string, publishedOnly = true) {
  const params = new URLSearchParams();
  if (cityId) params.set('city_id', cityId.toString());
  if (search) params.set('search', search);
  if (publishedOnly) {
    params.set('is_published', '1');
  }
  params.set('sort', 'rating');
  params.set('direction', 'desc');
  const query = params.toString() ? `?${params.toString()}` : '';
  return apiFetch<ApiResponse<ApiActivity[]>>(`/activities${query}`);
}

export async function fetchActivity(id: number) {
  return apiFetch<ApiResponse<ApiActivity>>(`/activities/${id}`);
}

export async function createActivity(payload: ActivityPayload, token: string) {
  return apiFetch<ApiResponse<ApiActivity>>('/activities', {
    method: 'POST',
    body: JSON.stringify(payload),
  }, token);
}

export async function updateActivity(id: number, payload: ActivityPayload, token: string) {
  return apiFetch<ApiResponse<ApiActivity>>(`/activities/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  }, token);
}

export async function deleteActivity(id: number, token: string) {
  return apiFetch<ApiResponse<never>>(`/activities/${id}`, {
    method: 'DELETE',
  }, token);
}

export async function fetchRestaurants(cityId?: number, search?: string) {
  const params = new URLSearchParams();
  if (cityId) params.set('city_id', cityId.toString());
  if (search) params.set('search', search);
  params.set('is_published', '1');
  params.set('sort', 'rating');
  params.set('direction', 'desc');
  const query = params.toString() ? `?${params.toString()}` : '';
  return apiFetch<ApiResponse<ApiRestaurant[]>>(`/restaurants${query}`);
}

export async function fetchRestaurant(id: number) {
  return apiFetch<ApiResponse<ApiRestaurant>>(`/restaurants/${id}`);
}

export type ApiEmergencyContact = {
  id: number;
  country_id: number;
  service_name: string;
  phone_number: string;
  is_emergency: boolean;
  country?: ApiCountry | null;
};

export type ApiScamReport = {
  id: number;
  city_id: number;
  title: string;
  category: string;
  description: string;
  prevention_tips: string;
  severity: 'high' | 'medium' | 'low';
  city?: ApiCity | null;
};

export async function fetchEmergencyContacts(countryId?: number) {
  const query = countryId ? `?country_id=${countryId}` : '';
  return apiFetch<ApiResponse<ApiEmergencyContact[]>>(`/emergency-contacts${query}`);
}

export async function fetchScamReports(cityId?: number) {
  const query = cityId ? `?city_id=${cityId}` : '';
  return apiFetch<ApiResponse<ApiScamReport[]>>(`/scam-reports${query}`);
}

export type ApiTransportFare = {
  id: number;
  city_id: number;
  transport_type: string;
  label: string;
  price_min: number | null;
  price_max: number | null;
  notes?: string | null;
  city?: ApiCity | null;
};

export async function fetchTransportFares(cityId?: number) {
  const query = cityId ? `?city_id=${cityId}` : '';
  return apiFetch<ApiResponse<ApiTransportFare[]>>(`/transport-fares${query}`);
}
