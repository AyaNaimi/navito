# 🚀 Quick Start - Google Places API Integration

## ✅ What's Been Created

I've created a complete, working Google Places API integration for your React app:

### Files Created:
1. **[placesService.ts](src/app/services/placesService.ts)** - Core API service
2. **[useGooglePlaces.ts](src/app/services/useGooglePlaces.ts)** - React hook
3. **[PlacesSearchFinder.tsx](src/app/pages/PlacesSearchFinder.tsx)** - Main component
4. **App.tsx** - Updated with route `/explore/places`

### Features:
✅ Search **Restaurants** 🍽️  
✅ Search **Monuments & Attractions** 🏛️  
✅ Search **Activities** ⚡  
✅ Interactive Google Map  
✅ Place cards with photos, ratings, prices  
✅ Real-time data from Google Places API  

---

## 🔥 IMMEDIATE SETUP (5 minutes)

### Step 1: Get API Key from Google
**Go here:** https://console.cloud.google.com/

1. Create a new project
2. Enable these 2 APIs:
   - **Maps JavaScript API** ✓
   - **Places API** ✓
3. Create an API Key
4. Get key string (looks like: `AIzaSyD...`)

### Step 2: Update .env File
Open `.env` in your project root and replace:
```diff
- VITE_GOOGLE_MAPS_API_KEY=YOUR_API_KEY_HERE
+ VITE_GOOGLE_MAPS_API_KEY=AIzaSyD...your_actual_key_here...
```

### Step 3: Restart Dev Server
```bash
npm run dev
```

### Step 4: Test It
Open your browser and go to:
```
http://localhost:5173/explore/places
```

**That's it!** 🎉 You should see an interactive map with restaurants, monuments, and activities!

---

## 📋 Full Setup Details

See **[GOOGLE_PLACES_SETUP.md](GOOGLE_PLACES_SETUP.md)** for:
- Detailed Google Cloud setup
- Security best practices  
- API key restrictions
- Troubleshooting
- Cost estimation

---

## 💻 How to Use in Your Code

### Simple Hook Usage
```tsx
import { useGooglePlaces } from './services/useGooglePlaces';

function MyComponent() {
  const { places, loading, error } = useGooglePlaces({
    apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '',
    location: { lat: 31.6295, lng: -7.9811 },
    type: 'restaurants', // or 'attractions' or 'activities'
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {places.map(place => (
        <div key={place.placeId}>
          <h3>{place.name}</h3>
          <p>⭐ {place.rating?.toFixed(1)}</p>
          <p>📍 {place.vicinity}</p>
        </div>
      ))}
    </div>
  );
}
```

### Use the Full Component
```tsx
import PlacesSearchFinder from './pages/PlacesSearchFinder';

<PlacesSearchFinder
  apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ''}
  location={{ lat: 31.6295, lng: -7.9811 }}
  city="Marrakech"
  radius={2000}
/>
```

---

## 🌍 Change Location

To search in a different city, just change the `location` prop:

```tsx
// Casablanca
<PlacesSearchFinder
  location={{ lat: 33.5731, lng: -7.5898 }}
  city="Casablanca"
/>

// Fez
<PlacesSearchFinder
  location={{ lat: 34.0381, lng: -5.0077 }}
  city="Fez"
/>

// New York
<PlacesSearchFinder
  location={{ lat: 40.7128, lng: -74.0060 }}
  city="New York"
/>
```

---

## 📡 What the API Returns

Each place has:
```typescript
{
  placeId: string;
  name: string;
  vicinity: string;
  latitude: number;
  longitude: number;
  rating?: number;              // 0-5 stars
  userRatingsTotal?: number;    // number of reviews
  priceLevel?: number;          // 0-4 ($, $$, $$$, $$$$)
  photoRef?: string;            // photo URL
  openNow?: boolean;            // open/closed
  formattedAddress?: string;
  types: string[];              // e.g., ['restaurant', 'food']
}
```

---

## 🎯 Next Steps

1. **Test the component** at `/explore/places`
2. **Explore the code** to understand how it works
3. **Integrate into your pages** - copy the pattern from `PlacesSearchFinder.tsx`
4. **Customize styling** - modify colors, cards, map behavior
5. **Add to more pages** - use `useGooglePlaces` hook anywhere

---

## ⚠️ Common Issues

| Problem | Solution |
|---------|----------|
| "API key not configured" | Check `.env` has real key, not `YOUR_API_KEY_HERE` |
| Map is gray | Ensure API key restrictions allow Maps & Places APIs |
| No results | Try increasing radius or verify location coordinates |
| CORS error | Add your domain to API key's HTTP referrer list |

---

## 📚 Example Components

Original examples still available in:
- **[PLACES_API_EXAMPLES.tsx](src/app/services/PLACES_API_EXAMPLES.tsx)** - Various usage patterns
- **[README_PLACES_API.md](src/app/services/README_PLACES_API.md)** - Detailed documentation

---

## 🔐 Security Notes

✅ API key in `VITE_` env var (loaded at build time only)  
✅ HTTP referrer restrictions prevent misuse  
✅ Only needed APIs enabled (Maps + Places)  
✅ Graceful error handling for quota limits  

---

**Questions?** Check the full documentation files or ask me! 🚀
