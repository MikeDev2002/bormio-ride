import { useState, useEffect } from 'react'
import { fetchWeather, getWeatherInfo } from '../utils/weather.js'

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

function skyClass(code) {
  if (code <= 2) return 'sunny'
  if (code === 3 || code === 45 || code === 48) return 'cloudy'
  if (code >= 95) return 'stormy'
  return 'rainy'
}

export default function WeatherHero() {
  const [weather, setWeather] = useState(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    fetchWeather().then(setWeather).catch(() => setError(true))
  }, [])

  if (error) return null

  if (!weather) {
    return (
      <div className="weather-hero">
        <div className="weather-hero-top cloudy" style={{ minHeight: 110, alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ opacity: 0.7, fontSize: '0.85rem' }}>Loading weather…</span>
        </div>
      </div>
    )
  }

  const code = weather.weather_code[0]
  const today = getWeatherInfo(code)

  return (
    <div className="weather-hero">
      <div className={`weather-hero-top ${skyClass(code)}`}>
        <div>
          <div className="weather-hero-location">🇮🇹 Bormio, Italy</div>
          <div className="weather-hero-temp">{Math.round(weather.temperature_2m_max[0])}°</div>
          <div className="weather-hero-condition">{today.label}</div>
          <div className="weather-hero-meta">
            <span>💨 {Math.round(weather.wind_speed_10m_max[0])} km/h</span>
            {weather.precipitation_sum[0] > 0
              ? <span>💧 {weather.precipitation_sum[0]} mm</span>
              : <span>No rain</span>}
            <span>↓ {Math.round(weather.temperature_2m_min[0])}°</span>
          </div>
        </div>
        <div className="weather-hero-icon">{today.icon}</div>
      </div>

      <div className="weather-forecast-strip">
        {weather.time.map((dateStr, i) => {
          const info = getWeatherInfo(weather.weather_code[i])
          const date = new Date(dateStr)
          const name = i === 0 ? 'Today' : DAY_NAMES[date.getDay()]
          return (
            <div key={dateStr} className={`forecast-day ${i === 0 ? 'today' : ''}`}>
              <div className="forecast-day-name">{name}</div>
              <div className="forecast-day-icon">{info.icon}</div>
              <div className="forecast-day-hi">{Math.round(weather.temperature_2m_max[i])}°</div>
              <div className="forecast-day-lo">{Math.round(weather.temperature_2m_min[i])}°</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
