import { useState, useEffect } from 'react'
import { ROUTES } from '../config.js'
import { fetchWeather, getWeatherInfo } from '../utils/weather.js'
import WeatherHero from './WeatherHero.jsx'

const DAY_NUMBERS = [1, 2, 3, 4, 5, 6]

export default function DaysView({ dayAssignments, onUpdateAssignment, onSelectDay }) {
  const [weather, setWeather] = useState(null)

  useEffect(() => {
    fetchWeather().then(setWeather).catch(() => null)
  }, [])

  const assignedRouteKeys = Object.values(dayAssignments).filter(Boolean)
  const availableRoutes = Object.keys(ROUTES).filter(k => !assignedRouteKeys.includes(k))

  return (
    <div>
      <WeatherHero />

      <div className="section-label">Plan Your Days</div>
      <div className="planner-section">
        {DAY_NUMBERS.map(day => (
          <div key={day} className="planner-row">
            <span className="planner-day-label">Day {day}</span>
            <select
              className="planner-select"
              value={dayAssignments[day] || ''}
              onChange={e => onUpdateAssignment(day, e.target.value || null)}
            >
              <option value="">— Route TBC —</option>
              {Object.entries(ROUTES).map(([key, route]) => (
                <option
                  key={key}
                  value={key}
                  disabled={assignedRouteKeys.includes(key) && dayAssignments[day] !== key}
                >
                  {route.name} ({route.distance}km)
                </option>
              ))}
            </select>
          </div>
        ))}
        {availableRoutes.length > 0 && (
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 2, marginBottom: 4 }}>
            {availableRoutes.length} route{availableRoutes.length > 1 ? 's' : ''} not yet assigned
          </p>
        )}
      </div>

      <div className="section-label">All Days</div>
      <div className="days-grid">
        {DAY_NUMBERS.map(day => {
          const routeKey = dayAssignments[day]
          const route = routeKey ? ROUTES[routeKey] : null
          const w = weather ? getWeatherInfo(weather.weather_code[day - 1] ?? 0) : null

          return (
            <div
              key={day}
              className={`day-card ${route ? 'has-route' : 'no-route'}`}
              onClick={() => onSelectDay(day)}
            >
              <div className="day-card-number">Day {day}</div>
              {route ? (
                <>
                  <div className="day-card-name">{route.name}</div>
                  <div className="day-card-stats">
                    <div className="day-card-stat">🚵 {route.distance} km</div>
                    <div className="day-card-stat">⛰️ {route.elevation.toLocaleString()} m</div>
                  </div>
                </>
              ) : (
                <div className="day-card-tbc">Route TBC</div>
              )}
              {w && <div className="day-card-weather">{w.icon}</div>}
            </div>
          )
        })}
      </div>
    </div>
  )
}
