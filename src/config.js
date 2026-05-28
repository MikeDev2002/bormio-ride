export const ROUTES = {
  Stelvio_from_Bormio_both_sides: {
    name: 'Stelvio from Bormio Both Sides',
    gpxFile: '/gpx/Stelvio_from_Bormio_both_sides.gpx',
    distance: 101,
    elevation: 3300,
  },
  Motirolo_gavia: {
    name: 'Mortirolo & Gavia',
    gpxFile: '/gpx/Motirolo_gavia.gpx',
    distance: 111,
    elevation: 3308,
  },
  Tirrano_Livigno_Loop: {
    name: 'Tirano Livigno Loop',
    gpxFile: '/gpx/Tirrano_Livigno_Loop.gpx',
    distance: 124,
    elevation: 2918,
  },
}

export const HOTEL = {
  name: 'Hotel Palace Bormio',
  address: 'Via Milano, 54, 23032 Bormio SO, Italy',
  phone: '+39 0342 903131',
  email: 'info@palacebormio.it',
  website: 'https://palacebormio.it',
  lat: 46.4683,
  lon: 10.3737,
  stars: 4,
  amenities: [
    'Technogym gym',
    'Heated indoor pool',
    'Sauna & Turkish bath',
    'Hydromassage',
    'Restaurant — Valtelline cuisine',
  ],
  description: '4-star alpine wellness & spa hotel in the heart of Bormio, near town centre and riverside cycling paths.',
}

export const BORMIO = { lat: 46.4683, lon: 10.3737 }

export const RIDERS = [
  {
    id: 'mike',
    name: 'Mike',
    initials: 'M',
    color: '#C00000',
    tagline: null,
    hometown: null,
    cycling: null,
    bike: null,
    fact: null,
    strava: null,
  },
  {
    id: 'adam',
    name: 'Adam',
    initials: 'A',
    color: '#C8960C',
    tagline: null,
    hometown: null,
    cycling: null,
    bike: null,
    fact: null,
    strava: null,
  },
  {
    id: 'tony',
    name: 'Tony',
    initials: 'T',
    color: '#2E7A30',
    tagline: null,
    hometown: null,
    cycling: null,
    bike: null,
    fact: null,
    strava: null,
  },
]

export function estimatedHours(distanceKm, elevationM) {
  const h = distanceKm / 25 + elevationM / 1000
  const totalMins = Math.round(h * 60)
  const hrs = Math.floor(totalMins / 60)
  const mins = totalMins % 60
  return mins > 0 ? `~${hrs}h ${mins}m` : `~${hrs}h`
}
