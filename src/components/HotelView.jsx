import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import { HOTEL } from '../config.js'
import L from 'leaflet'

const hotelIcon = L.divIcon({
  html: '<div style="background:#1B4332;color:white;border-radius:50%;width:36px;height:36px;display:flex;align-items:center;justify-content:center;font-size:18px;box-shadow:0 2px 8px rgba(0,0,0,0.3)">🏨</div>',
  className: '',
  iconSize: [36, 36],
  iconAnchor: [18, 18],
})

export default function HotelView() {
  return (
    <div className="hotel-view">
      <div className="hotel-hero">
        <div className="hotel-stars">{'⭐'.repeat(HOTEL.stars)}</div>
        <div className="hotel-name">{HOTEL.name}</div>
        <div className="hotel-desc">{HOTEL.description}</div>
      </div>

      <div className="card" style={{ marginBottom: 12 }}>
        <div className="hotel-info-row">
          <span className="hotel-info-icon">📍</span>
          <div>
            <div className="hotel-info-label">Address</div>
            <div className="hotel-info-value">{HOTEL.address}</div>
          </div>
        </div>
        <div className="hotel-info-row">
          <span className="hotel-info-icon">📞</span>
          <div>
            <div className="hotel-info-label">Phone</div>
            <a className="hotel-link" href={`tel:${HOTEL.phone}`}>{HOTEL.phone}</a>
          </div>
        </div>
        <div className="hotel-info-row">
          <span className="hotel-info-icon">✉️</span>
          <div>
            <div className="hotel-info-label">Email</div>
            <a className="hotel-link" href={`mailto:${HOTEL.email}`}>{HOTEL.email}</a>
          </div>
        </div>
        <div className="hotel-info-row">
          <span className="hotel-info-icon">🌐</span>
          <div>
            <div className="hotel-info-label">Website</div>
            <a className="hotel-link" href={HOTEL.website} target="_blank" rel="noreferrer">
              palacebormio.it
            </a>
          </div>
        </div>
        <div className="hotel-info-row">
          <span className="hotel-info-icon">✨</span>
          <div>
            <div className="hotel-info-label">Facilities</div>
            <div className="amenities-list">
              {HOTEL.amenities.map(a => (
                <span key={a} className="amenity-chip">{a}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <MapContainer
        center={[HOTEL.lat, HOTEL.lon]}
        zoom={15}
        className="hotel-map-container"
        zoomControl={false}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />
        <Marker position={[HOTEL.lat, HOTEL.lon]} icon={hotelIcon}>
          <Popup>
            <strong>{HOTEL.name}</strong><br />
            {HOTEL.address}
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  )
}
