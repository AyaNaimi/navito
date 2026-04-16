# 🗺️ OpenStreetMap Implementation Guide

## ✅ No API Key Needed!

The new OpenStreetMap implementation uses:
- **Leaflet** - Open-source mapping library
- **Overpass API** - Free OpenStreetMap data queries
- **React Leaflet** - React wrapper for Leaflet

**Cost: ZERO** 💰

---

## 🚀 Quick Start

### Step 1: Already Installed ✓
Your project already has:
```
✅ leaflet: 1.9.4
✅ react-leaflet: 4.2.1
✅ @types/leaflet: 1.9.12
```

### Step 2: Test It Now!
Visit in your browser:
```
http://localhost:5173/explore/osm
```

That's it! 🎉

---

## 📁 Files Created

1. **[overpassService.ts](src/app/services/overpassService.ts)**
   - Query Overpass API for restaurants, monuments, activities
   - Parse OSM data
   - No authentication needed

2. **[useOpenStreetMap.ts](src/app/services/useOpenStreetMap.ts)**
   - React hook for OSM queries
   - Caching support
   - Multiple place type queries

3. **[OpenStreetMapFinder.tsx](src/app/pages/OpenStreetMapFinder.tsx)**
   - Interactive map with Leaflet
   - Search tabs for different place types
   - Place cards with details

4. **[App.tsx](src/app/App.tsx)**
   - New route: `/explore/osm`

---

## 🎯 Features

✅ **Search Restaurants** 🍽️
- Restaurants, cafes, bars from OSM

✅ **Search Monuments** 🏛️
- Historical sites, castles, museums, attractions

✅ **Search Activities** ⚡
- Parks, swimming pools, sports centers, spas

✅ **Interactive Map**
- Click markers to see details
- Popup with phone, website, hours

✅ **Place List**
- Scrollable list of results
- Contact information
- Links to call or visit websites

---

## 💡 How It Works

### 1. Overpass API (Free!)
```
Query: "Find all restaurants within 2km of Marrakech"
API: overpass-api.de
Data: OpenStreetMap (crowd-sourced, always free)
Response: JSON with place details
```

### 2. React Hook
```tsx
const { places, loading } = useOpenStreetMap({
  location: { lat: 31.6295, lng: -7.9811 },
  type: 'restaurants',
  radius: 2000,
});
```

### 3. Display on Map
```
Leaflet renders the map tiles (OpenStreetMap)
Markers show each place
Click for more info
```

---

## 🌍 Change Location

To search in different city:

```tsx
// Casablanca
<OpenStreetMapFinder
  location={{ lat: 33.5731, lng: -7.5898 }}
  city="Casablanca"
/>

// Paris
<OpenStreetMapFinder
  location={{ lat: 48.8566, lng: 2.3522 }}
  city="Paris"
/>

// London
<OpenStreetMapFinder
  location={{ lat: 51.5074, lng: -0.1278 }}
  city="London"
/>
```

---

## 📊 Data from OpenStreetMap

Each place includes:
```typescript
{
  id: number;              // Unique OpenStreetMap ID
  name: string;            // Place name
  lat: number;             // Latitude
  lng: number;             // Longitude
  type: 'restaurant' | 'monument' | 'activity';
  category?: string;       // More specific type
  phone?: string;          // Phone number (if available)
  website?: string;        // Website (if available)
  openingHours?: string;   // Hours (if available)
  tags?: Record<string, string>; // All OSM tags
}
```

---

## 🔍 What Each Type Searches

### 🍽️ Restaurants
Searches for:
- Restaurants
- Cafes
- Bars
- Food establishments

### 🏛️ Monuments & Attractions
Searches for:
- Historical sites
- Castles
- Monuments
- Museums
- Archaeological ruins
- Tourist attractions

### ⚡ Activities
Searches for:
- Parks
- Playgrounds
- Sports centers
- Swimming pools
- Theme parks
- Spas
- Gyms
- Cinemas

---

## ⚡ Speed & Performance

| Operation | Time | Cost |
|-----------|------|------|
| Initial load | ~1-2 seconds | $0 |
| Switch tab | ~500ms (cached) | $0 |
| 1000 queries | ~1000 seconds | $0 |
| Annual cost | N/A | **$0** 🎉 |

---

## 🔒 Privacy

- ✅ No Google tracking
- ✅ No personal data stored
- ✅ OpenStreetMap is community-driven
- ✅ Completely free and open-source

---

## ⚠️ Limitations vs Google Places

| Feature | OSM | Google |
|---------|-----|--------|
| Cost | $0 | $2.50+ per 1000 |
| API Key | ❌ None needed | ✅ Required |
| Data freshness | Good | Excellent |
| Photo integration | ❌ Not integrated | ✅ Yes |
| Reviews | ❌ Basic | ✅ Full reviews |
| Ratings | ❌ Limited | ✅ Full ratings |

---

## 🔧 Customization

### Add More Search Types
Edit [overpassService.ts](src/app/services/overpassService.ts):
```typescript
const queries = {
  restaurants: `...`,
  monuments: `...`,
  activities: `...`,
  hotels: `...`,  // Add new type
};
```

### Change Map Tiles
In [OpenStreetMapFinder.tsx](src/app/pages/OpenStreetMapFinder.tsx):
```tsx
<TileLayer
  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
/>
// Or use different providers:
// - CartoDB: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png"
// - Dark: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png"
```

### Increase Results Limit
Edit [overpassService.ts](src/app/services/overpassService.ts):
```typescript
return data.elements
  .slice(0, 50)  // Change 50 to any number
```

---

## 🐛 Troubleshooting

### Map doesn't load
**Solution:** Check that Leaflet CSS is imported in your main.tsx:
```tsx
import 'leaflet/dist/leaflet.css';
```

### No results found
**Solution:**
- Increase search radius
- Check location coordinates are correct
- Try a different place type
- Some areas have limited OSM data

### "Overpass API throttled"
**Solution:** Overpass API has rate limits
- Wait 60 seconds and try again
- Hook has 5-minute caching to help with this
- Consider running your own Overpass instance (advanced)

---

## 📚 Resources

- **Leaflet Docs:** https://leafletjs.com/
- **Overpass API:** https://overpass-api.de/
- **OpenStreetMap:** https://www.openstreetmap.org/
- **React Leaflet:** https://react-leaflet.js.org/

---

## 🚀 Next Steps

1. **Customize location** - change to your city
2. **Add more search types** - hotels, gas stations, etc.
3. **Style the markers** - use custom icons
4. **Integrate with existing app** - use the hook anywhere
5. **Deploy** - works everywhere, no API setup needed!

---

## ✅ Comparison: Google vs OpenStreetMap

### When to Use Google Places:
- Need restaurant reviews and ratings
- Need high-quality photos
- Need detailed business info
- Have budget for API costs

### When to Use OpenStreetMap:
- **Need free solution** ✅
- **Need no setup** ✅
- **Need privacy** ✅
- **Need to support open-source** ✅
- Works globally with same quality

---

**Questions?** Check the docs or try it yourself at `/explore/osm` 🗺️
