# Bormio Ride App

## What This Is
A Progressive Web App (PWA) for a 6-day cycling trip in Bormio, Italy (June 2026).
Built for 3 riders: Mike, Adam, Tony. Mixed iPhone and Android devices.

## Features
1. **Route maps** — per-day GPX file display on interactive map
2. **Weather** — OpenWeatherMap API, Bormio region
3. **Live location tracking** — all 3 riders visible on shared map in real-time
4. **Elevation profiles** — extracted from GPX data, shown per day
5. **SOS pin drop** — drops GPS pin + sends push notification to all riders
6. **Accommodation pins** — each night's location marked on map
7. **Day summary cards** — distance, elevation gain, start time, meeting point

## Tech Stack
- **React + Vite** (PWA)
- **Leaflet.js + OpenStreetMap** (maps, GPX rendering)
- **Open-Meteo API** (weather — free, no key, no account)
- **WhatsApp deep links** (live location sharing + SOS alerts)
- **Vercel or GitHub Pages** (hosting — free, fully static)

## No accounts or API keys required
Entirely static app — no backend, no database, no sign-ups.

## Riders
- Mike
- Adam
- Tony

## Trip Details
- Region: Bormio, Italy
- Duration: 6 days
- GPX files: 3 provided (days TBD), 3 pending

## Routes (Days 1–3 confirmed, Days 4–6 pending)
| Day | Distance | Elevation | RideWithGPS URL |
|-----|----------|-----------|-----------------|
| 1 | 111 km | 3,308 m | https://ridewithgps.com/routes/30571087 |
| 2 | 124 km | 2,918 m | https://ridewithgps.com/routes/51282991 |
| 3 | 101 km | 3,300 m | https://ridewithgps.com/routes/48307565 |
| 4 | TBC | TBC | pending |
| 5 | TBC | TBC | pending |
| 6 | TBC | TBC | pending |

Note: RideWithGPS GPX export requires login. User must download GPX files manually:
- Go to each route URL → Export → GPX Track → save to /BormioRide/public/gpx/
- Files named by route name (e.g. stelvio.gpx) — NOT day1/day2 etc.
- User assigns routes to days via in-app day planner (order not yet decided)
- FIT files are NOT supported — must convert to GPX first (use RideWithGPS export or GPSBabel)

## Accommodation
**Hotel Palace Bormio** — all 6 nights
- Address: Via Milano, 54, 23032 Bormio SO, Italy
- Coordinates: 46.4683, 10.3737
- Phone: +39 0342 903131
- Email: info@palacebormio.it
- Website: https://palacebormio.it
- 4-star wellness & spa hotel
- Amenities: Technogym gym, heated indoor pool, sauna, Turkish bath, hydromassage, restaurant (Valtelline cuisine)
- Near town centre and riverside cycling paths

## Status
- [ ] GPX files x3 — user to download from RideWithGPS and drop in /public/gpx/
- [ ] GPX files x3 — pending from trip organiser
- [ ] WhatsApp group link — for SOS pre-fill (user to provide)

## Notes
- User has no prior Claude Code experience — explain steps clearly
- Days without GPX files get placeholder cards
- SOS alert goes to all riders in the group (not external emergency services)
- iOS Safari requires PWA added to home screen for best GPS behaviour
