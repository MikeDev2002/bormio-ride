export const CAFES = {
  asino_che_vola: {
    id: 'asino_che_vola',
    name: "Bar L'Asino Che Vola",
    lat: 46.2574,
    lon: 10.5062,
    elevation: 1258,
    tagline: 'The Flying Donkey — midway refuel between two monsters',
    description: 'The natural stop in Ponte di Legno after descending the Mortirolo and before tackling the Gavia. 227 TripAdvisor reviews — a group of 12 cyclists praised the food, staff and atmosphere. The name says it all: "The Flying Donkey" is Italian cycling slang for a rider who keeps grinding uphill.',
    photo: '/cafes/asino_che_vola.jpg',
    website: 'https://www.tripadvisor.com/Restaurant_Review-g194852-d4719303-Reviews-Bar_L_Asino_Che_Vola-Ponte_di_Legno_Province_of_Brescia_Lombardy.html',
    address: 'Ponte di Legno, Province of Brescia, Lombardy',
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
    cafes: ['asino_che_vola'],
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
