const cache = {}

function haversineMeters(a, b) {
  const R = 6371000
  const dLat = ((b.lat - a.lat) * Math.PI) / 180
  const dLon = ((b.lon - a.lon) * Math.PI) / 180
  const lat1 = (a.lat * Math.PI) / 180
  const lat2 = (b.lat * Math.PI) / 180
  const x = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x))
}

export async function parseGPX(url) {
  if (cache[url]) return cache[url]

  const res = await fetch(url)
  const text = await res.text()
  const doc = new DOMParser().parseFromString(text, 'application/xml')

  const trkpts = Array.from(doc.querySelectorAll('trkpt'))
  let distMeters = 0
  const allPoints = trkpts.map((pt, i) => {
    const p = {
      lat: parseFloat(pt.getAttribute('lat')),
      lon: parseFloat(pt.getAttribute('lon')),
      ele: parseFloat(pt.querySelector('ele')?.textContent ?? 0),
    }
    if (i > 0) {
      const prev = { lat: trkpts[i - 1].getAttribute('lat') * 1, lon: trkpts[i - 1].getAttribute('lon') * 1 }
      distMeters += haversineMeters(prev, p)
    }
    return { ...p, distKm: distMeters / 1000 }
  })

  let elevGain = 0
  for (let i = 1; i < allPoints.length; i++) {
    const diff = allPoints[i].ele - allPoints[i - 1].ele
    if (diff > 0) elevGain += diff
  }

  // Sample for map polyline (every 10th point)
  const mapPoints = allPoints.filter((_, i) => i % 10 === 0).map(p => [p.lat, p.lon])

  // Sample for elevation chart (max 400 points)
  const step = Math.max(1, Math.floor(allPoints.length / 400))
  const elevPoints = allPoints.filter((_, i) => i % step === 0).map(p => ({
    dist: Math.round(p.distKm * 10) / 10,
    ele: Math.round(p.ele),
  }))

  const result = {
    mapPoints,
    elevPoints,
    distanceKm: Math.round(distMeters / 100) / 10,
    elevGainM: Math.round(elevGain),
    startLat: allPoints[0].lat,
    startLon: allPoints[0].lon,
    minEle: Math.min(...elevPoints.map(p => p.ele)),
    maxEle: Math.max(...elevPoints.map(p => p.ele)),
  }

  cache[url] = result
  return result
}

// Returns elevation points sliced to a specific distance window (for climb profiles).
// Re-bases dist to start from 0 so the chart always reads "0km → Xkm".
export function sliceElevPoints(elevPoints, startKm, endKm) {
  const slice = elevPoints.filter(p => p.dist >= startKm - 0.5 && p.dist <= endKm + 0.5)
  const base = slice.length > 0 ? slice[0].dist : startKm
  return slice.map(p => ({ dist: Math.round((p.dist - base) * 10) / 10, ele: p.ele }))
}
