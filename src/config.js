export const CAFES = {
  bonetta_gavia: {
    id: 'bonetta_gavia',
    name: 'Rifugio Bonetta',
    lat: 46.349,
    lon: 10.494,
    elevation: 2652,
    tagline: 'The soul of the Gavia — 60 years at the summit',
    description: 'Family-run rifugio at the very top of Passo Gavia, 2,652m. Walls covered in Giro d\'Italia photos and cycling jerseys — Contador has stopped here. Reasonably priced, quick service, legendary goulash soup. The natural stop on this route.',
    photo: '/cafes/bonetta_gavia.jpg',
    website: 'https://www.passogavia.it/en/',
    address: 'Passo Gavia, 23030 Valfurva SO, Italy',
  },
  franzenshohe: {
    id: 'franzenshohe',
    name: 'Berghotel Franzenshöhe',
    lat: 46.534,
    lon: 10.468,
    elevation: 2188,
    tagline: 'The iconic mid-climb stop at 2,188m',
    description: 'Historic alpine hotel at hairpin 22 on the Prato descent. Sunny terrace with views back over all the switchbacks you just conquered. Rated 9.4/10 across TripAdvisor, Hotels.com and Booking.com — the consistently top-rated cyclist stop on the Stelvio.',
    photo: '/cafes/franzenshohe.jpg',
    website: 'https://www.franzenshoehe.com/en',
    address: 'Via del Passo 47, Passo Stelvio',
  },
}

export const ROUTES = {
  Stelvio_from_Bormio_both_sides: {
    name: 'Stelvio from Bormio Both Sides',
    gpxFile: '/gpx/Stelvio_from_Bormio_both_sides.gpx',
    distance: 101,
    elevation: 3300,
    cafes: ['franzenshohe'],
  },
  Motirolo_gavia: {
    name: 'Mortirolo & Gavia',
    gpxFile: '/gpx/Motirolo_gavia.gpx',
    distance: 111,
    elevation: 3308,
    cafes: ['bonetta_gavia'],
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
    id: 'adam',
    name: 'Adam',
    initials: 'A',
    color: '#C8960C',
    photo: '/riders/Adam Marmot.jpg',
    tagline: 'Can we stop for coffee?',
    hometown: null,
    cycling: null,
    bike: null,
    fact: null,
    strava: null,
  },
  {
    id: 'mike',
    name: 'Mike',
    initials: 'M',
    color: '#C00000',
    photo: '/riders/Mike rider.jpg',
    tagline: 'One more hill before coffee',
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
    photo: '/riders/Tony rider.jpg',
    tagline: 'See you at the top',
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
