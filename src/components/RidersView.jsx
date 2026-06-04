import { RIDERS } from '../config.js'

export default function RidersView() {
  return (
    <div className="riders-view">
      <div className="section-label">The Riders</div>
      {RIDERS.map(rider => (
        <div key={rider.id} className="rider-card">
          {rider.photo ? (
            <img
              src={rider.photo}
              alt={rider.name}
              className="rider-avatar"
              style={{ objectFit: 'cover', border: `3px solid ${rider.color}` }}
            />
          ) : (
            <div className="rider-avatar" style={{ background: rider.color }}>
              {rider.initials}
            </div>
          )}
          <div style={{ flex: 1 }}>
            <div className="rider-name">{rider.name}</div>
            {rider.tagline && <div className="rider-tagline">{rider.tagline}</div>}

            {rider.hometown && (
              <div className="rider-detail">
                <span className="rider-detail-icon">📍</span>
                <span>{rider.hometown}</span>
              </div>
            )}
            {rider.cycling && (
              <div className="rider-detail">
                <span className="rider-detail-icon">🚵</span>
                <span>{rider.cycling}</span>
              </div>
            )}
            {rider.bike && (
              <div className="rider-detail">
                <span className="rider-detail-icon">🚲</span>
                <span>{rider.bike}</span>
              </div>
            )}
            {rider.fact && (
              <div className="rider-detail">
                <span className="rider-detail-icon">⚡</span>
                <span>{rider.fact}</span>
              </div>
            )}

            {!rider.tagline && !rider.hometown && !rider.cycling && (
              <div className="rider-placeholder">Profile coming soon…</div>
            )}

            {rider.strava && (
              <a className="rider-strava" href={rider.strava} target="_blank" rel="noreferrer">
                🟠 Strava
              </a>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
