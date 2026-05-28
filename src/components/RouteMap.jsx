import { useEffect } from 'react'
import { MapContainer, TileLayer, Polyline, Marker, Popup, useMap } from 'react-leaflet'
import { HOTEL } from '../config.js'
import L from 'leaflet'

const hotelIcon = L.divIcon({
  html: '<div style="background:#CE2B37;color:white;border-radius:50%;width:28px;height:28px;display:flex;align-items:center;justify-content:center;font-size:14px;box-shadow:0 2px 6px rgba(0,0,0,0.3)">🏨</div>',
  className: '',
  iconSize: [28, 28],
  iconAnchor: [14, 14],
})

const startIcon = L.divIcon({
  html: '<div style="background:#009246;color:white;border-radius:50%;width:24px;height:24px;display:flex;align-items:center;justify-content:center;font-size:12px;box-shadow:0 2px 6px rgba(0,0,0,0.3)">S</div>',
  className: '',
  iconSize: [24, 24],
  iconAnchor: [12, 12],
})

function FitBounds({ mapPoints }) {
  const map = useMap()
  useEffect(() => {
    if (mapPoints.length > 0) {
      map.fitBounds(mapPoints, { padding: [20, 20] })
    }
  }, [mapPoints, map])
  return null
}

export default function RouteMap({ gpxData }) {
  const { mapPoints, startLat, startLon } = gpxData
  const center = [startLat, startLon]

  return (
    <MapContainer
      center={center}
      zoom={12}
      className="map-container"
      zoomControl={false}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      />
      <Polyline
        positions={mapPoints}
        pathOptions={{ color: '#009246', weight: 3, opacity: 0.9 }}
      />
      <Marker position={center} icon={startIcon}>
        <Popup>Start</Popup>
      </Marker>
      <Marker position={[HOTEL.lat, HOTEL.lon]} icon={hotelIcon}>
        <Popup>
          <strong>{HOTEL.name}</strong><br />
          {HOTEL.address}
        </Popup>
      </Marker>
      <FitBounds mapPoints={mapPoints} />
    </MapContainer>
  )
}
