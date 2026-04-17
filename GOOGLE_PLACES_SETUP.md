# 🗺️ Google Places API Setup Guide

## ⚠️ IMPORTANT: Get Your API Key First

### Step 1: Create Google Cloud Project
1. Go to https://console.cloud.google.com/
2. Click "Select a Project" → "New Project"
3. Name it (e.g., "Navito Places")
4. Click "Create"
5. Wait for project creation

### Step 2: Enable Required APIs
1. Go to APIs & Services → Library
2. Search for and **ENABLE** each of these:
   - ✅ **Maps JavaScript API**
   - ✅ **Places API**
3. Wait for them to show as "Enabled"

### Step 3: Create API Key
1. Go to APIs & Services → Credentials
2. Click "+ Create Credentials" → "API Key"
3. Copy your key (looks like: `AIzaSyDxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`)

### Step 4: Restrict Your Key (Important for Security)
1. Click on your newly created key
2. Set **Application restrictions** to "HTTP referrers"
3. Add your domain (for dev use `localhost:5173`)
4. Set **API restrictions** to:
   - Maps JavaScript API
   - Places API
5. Click "Save"

### Step 5: Add to Your Project
1. Open `.env` file in your project root
2. Replace:
   ```
   VITE_GOOGLE_MAPS_API_KEY=YOUR_API_KEY_HERE
   ```
   With your actual key:
   ```
   VITE_GOOGLE_MAPS_API_KEY=AIzaSyDxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   ```

3. Restart your dev server:
   ```bash
   npm run dev
   ```

---

## 📱 Using the Search Component

### Basic Usage
```tsx
import PlacesSearchFinder from './pages/PlacesSearchFinder';

function App() {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  
  return (
    <PlacesSearchFinder
      apiKey={apiKey}
      location={{ lat: 31.6295, lng: -7.9811 }} // Marrakech
      city="Marrakech"
      radius={2000}
    />
  );
}
```

### Add to Routing
In your `App.tsx`:
```tsx
import PlacesSearchFinder from './pages/PlacesSearchFinder';

// In your Routes:
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
```

---

## 🔎 What You Can Search

The component searches for 3 types of places:

### 1. **Restaurants** 🍽️
- Restaurants, cafes, food vendors
- Shows rating, price level, open/closed status
- Click for more details

### 2. **Monuments & Attractions** 🏛️
- Tourist attractions
- Museums
- Historical landmarks
- Places of worship
- Points of interest

### 3. **Activities** ⚡
- Amusement parks
- Spas
- Tours
- Adventure activities
- Parks
- Stadiums

---

## 💡 How to Use the Component

### Search for Restaurants
1. Click "Restaurants" tab at top
2. See all restaurants within the search radius
3. Click on any restaurant card to see it on the map
4. View details: rating, address, open status, price level

### Switch to Different Types
Just click the tab buttons:
- 🍽️ Restaurants
- 🏛️ Monuments & Attractions  
- ⚡ Activities

### View on Map
- Left side shows interactive map
- Click markers to see details
- Right side shows scrollable list of places
- Selected place is highlighted

---

## ⚙️ Configuration Options

```tsx
<PlacesSearchFinder
  apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
  location={{ lat: 31.6295, lng: -7.9811 }}
  city="Marrakech"
  radius={2000} // Search radius in meters (default: 2000)
/>
```

---

## 🐛 Troubleshooting

### Error: "Google Maps API key not configured"
**Solution:** Check your `.env` file has the real API key, not `YOUR_API_KEY_HERE`

### Map shows gray area
**Solution:** Ensure your API key has the correct API restrictions set

### No results found
**Solution:** 
- Verify the location coordinates are correct
- Increase the search radius
- Check that the place type exists in that area

### "CORS error"
**Solution:** 
- Add `localhost:5173` to your API key's HTTP referrer restrictions
- Make sure you're using `VITE_` prefix for environment variables

---

## 💰 Cost Estimation

Google Places API costs:
- **Nearby Search**: $2.50 per 1000 requests
- **Place Details**: $3.50 per 1000 requests

Example:
- 1000 users searching → **$2.50**
- 100 users getting detailed info → **$0.35**
- Total per 1000 users ≈ **$3-5**

You get **$300/month free** from Google Cloud credits!

---

## 📝 Environment Variables

Make sure your `.env` file looks like:
```
VITE_GOOGLE_MAPS_API_KEY=AIzaSyD...your...key...here
```

**Note:** Only `VITE_` prefixed variables are exposed to the frontend in Vite projects.

---

## 🔗 Useful Links

- Google Cloud Console: https://console.cloud.google.com/
- Maps JavaScript API Docs: https://developers.google.com/maps/documentation/javascript
- Places API Docs: https://developers.google.com/maps/documentation/places/web-service
- API Pricing: https://developers.google.com/maps/billing-and-pricing

---

## ✅ Quick Checklist

- [ ] Created Google Cloud Project
- [ ] Enabled Maps JavaScript API
- [ ] Enabled Places API
- [ ] Created API Key
- [ ] Set API Key restrictions
- [ ] Added key to `.env` file
- [ ] Restarted dev server (`npm run dev`)
- [ ] Added route to App.tsx (optional)
- [ ] Tested component

Done! 🎉
