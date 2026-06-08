# Google Maps Setup Guide — Solura

Follow these steps after Claude Code has finished writing the integration code.
Everything here is a one-time manual task on your end.

---

## Step 1 — Create a Google Cloud project

1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Click the project dropdown at the top → **New Project**
3. Name it `solura-travel` → **Create**
4. Make sure the new project is selected in the dropdown

---

## Step 2 — Enable billing

Google Maps requires a billing account (you get $200/month free credit — more than enough for this app).

1. In the left sidebar → **Billing**
2. Link or create a billing account
3. You will NOT be charged during normal traffic — the free tier covers ~28,000 map loads/month

---

## Step 3 — Enable the required APIs

Go to **APIs & Services → Library** and enable these three:

| API | Used for |
|-----|----------|
| **Maps JavaScript API** | The interactive map shown in the browser (trip page, admin GPS tracker, SOS page) |
| **Geocoding API** | Converting GPS coordinates → readable location names (server-side, `/api/gps` route) |

Search for each by name → click **Enable**.

---

## Step 4 — Create API keys

### Browser key (Maps JavaScript API)

1. **APIs & Services → Credentials → Create Credentials → API key**
2. Click **Edit** on the new key
3. Name it `solura-browser`
4. Under **Application restrictions** → select **HTTP referrers (websites)**
5. Add these referrers:
   ```
   localhost:3000/*
   yourdomain.com/*
   www.yourdomain.com/*
   ```
   (Replace `yourdomain.com` with your actual Vercel/production domain)
6. Under **API restrictions** → select **Restrict key** → choose only **Maps JavaScript API**
7. Save

### Server key (Geocoding API)

1. Create a second API key
2. Name it `solura-server`
3. Under **Application restrictions** → select **IP addresses**
4. Add your server/Vercel IP (or leave unrestricted for now — restrict after deploy)
5. Under **API restrictions** → select **Restrict key** → choose only **Geocoding API**
6. Save

---

## Step 5 — Add keys to `.env.local`

Open the file `.env.local` at the root of this project and replace the placeholder values:

```env
# Replace these two lines:
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=YOUR_GOOGLE_MAPS_API_KEY_HERE
GOOGLE_MAPS_API_KEY=YOUR_GOOGLE_MAPS_API_KEY_HERE

# With your actual keys:
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIzaSy...  ← browser key (solura-browser)
GOOGLE_MAPS_API_KEY=AIzaSy...              ← server key (solura-server)
```

> `NEXT_PUBLIC_` prefix = safe to expose in browser (Maps JS).  
> `GOOGLE_MAPS_API_KEY` = server-only (Geocoding, never sent to browser).

---

## Step 6 — Add keys to Vercel (for production)

1. Go to your Vercel project → **Settings → Environment Variables**
2. Add both keys exactly as above
3. Redeploy

---

## What you get after setup

| Feature | Where it appears |
|---------|-----------------|
| Live GPS map with earth-tone Solura styling | Trip detail page (`/dashboard/trips/[id]`) |
| Automatic location name from coordinates | Trip map badge, admin table `WHERE NOW` column |
| Continuous GPS tracking (every 30m movement or 30s) | GpsTracker pill on trip page |
| Admin live map with all travellers' markers | Admin GPS tracker (`/admin`) |
| SOS map showing traveller's exact location | SOS page, triggered on SOS alert |
| Red bouncing marker for SOS-active travellers | Admin map + SOS page |

---

## API quota reference

| API | Free tier | Solura typical usage |
|-----|-----------|----------------------|
| Maps JS loads | 28,000/month | ~1 per user session |
| Geocoding requests | 40,000/month free (then $0.005/call) | 1 per GPS ping (~every 30s while travelling) |

For 50 active travellers pinging every 30 seconds × 8 hours/day × 30 days ≈ 720,000 geocoding calls/month. Consider caching geocode results for the same lat/lng tile to reduce API calls once travellers grow past ~20 simultaneous.

---

## Troubleshooting

- **Map shows grey / blank** → Check browser console for `InvalidKeyMapError` — key is wrong or not enabled for Maps JS API
- **Location name shows `null`** → Check server logs; likely the Geocoding API is not enabled or the server key is wrong
- **"Google Maps not configured"** placeholder shows → `.env.local` still has `YOUR_GOOGLE_MAPS_API_KEY_HERE` — replace it and restart `npm run dev`
- **GPS tracking doesn't start** → Browser must be on HTTPS (or `localhost`) for `navigator.geolocation` to work; make sure the user grants location permission
