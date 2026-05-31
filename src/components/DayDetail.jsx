import { useState, useEffect } from 'react'
import { ROUTES, estimatedHours } from '../config.js'
import { parseGPX } from '../utils/gpxParser.js'
import RouteMap from './RouteMap.jsx'
import ElevationProfile from './ElevationProfile.jsx'
import WeatherCard from './WeatherCard.jsx'
import ClimbsSection from './ClimbsSection.jsx'

export default function DayDetail({ day, routeKey }) {
  const [gpxData, setGpxData] = useState(null)
  const [loading, setLoading] = useState(false)

  const route = routeKey ? ROUTES[routeKey] : null

  useEffect(() => {
    if (!route) return
    setLoading(true)
    setGpxData(null)
    parseGPX(route.gpxFile)
      .then(setGpxData)
      .finally(() => setLoading(false))
  }, [routeKey])

  if (!route) {
    return (
      <div className="tbc-screen">
        <span style={{ fontSize: '2rem' }}>🗓️</span>
        <h2>Route not assigned yet</h2>
        <p>Go back and assign a route to Day {day}</p>
      </div>
    )
  }

  return (
    <div className="day-detail">
      <div className="detail-section">
        <div className="stats-row">
          <div className="stat-box">
            <div className="stat-value">{gpxData ? gpxData.distanceKm : route.distance}</div>
            <div className="stat-unit">km</div>
            <div className="stat-label">Distance</div>
          </div>
          <div className="stat-box">
            <div className="stat-value">{(gpxData ? gpxData.elevGainM : route.elevation).toLocaleString()}</div>
            <div className="stat-unit">m</div>
            <div className="stat-label">Climbing</div>
          </div>
          <div className="stat-box">
            <div className="stat-value">{estimatedHours(route.distance, route.elevation)}</div>
            <div className="stat-unit"> </div>
            <div className="stat-label">Est. Time</div>
          </div>
        </div>
      </div>

      <div className="detail-section" style={{ paddingTop: 0, paddingLeft: 0, paddingRight: 0 }}>
        {loading && <div className="loading">Loading route…</div>}
        {gpxData && <RouteMap gpxData={gpxData} />}
      </div>

      {gpxData && (
        <div className="detail-section" style={{ paddingTop: 12 }}>
          <ElevationProfile elevPoints={gpxData.elevPoints} />
        </div>
      )}

      <ClimbsSection routeKey={routeKey} elevPoints={gpxData?.elevPoints} />

      <div className="detail-section">
        <WeatherCard />
      </div>
    </div>
  )
}
