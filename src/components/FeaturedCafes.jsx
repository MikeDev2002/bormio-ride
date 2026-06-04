import { CAFES } from '../config.js'

export default function FeaturedCafes({ cafeIds = [] }) {
  const cafes = cafeIds.map(id => CAFES[id]).filter(Boolean)
  if (cafes.length === 0) return null

  return (
    <div className="detail-section">
      <div className="section-label" style={{ marginBottom: 10 }}>Featured Cafe</div>
      {cafes.map(cafe => (
        <div key={cafe.id} className="cafe-card">
          {cafe.photo && (
            <img src={cafe.photo} alt={cafe.name} className="cafe-photo" />
          )}
          <div className="cafe-body">
            <div className="cafe-name">{cafe.name}</div>
            <div className="cafe-meta">☕ {cafe.elevation}m · {cafe.address}</div>
            <div className="cafe-desc">{cafe.description}</div>
            {cafe.website && (
              <a className="cafe-link" href={cafe.website} target="_blank" rel="noreferrer">
                Visit website →
              </a>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
