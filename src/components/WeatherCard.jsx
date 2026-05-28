import { useState, useEffect } from 'react'
import { fetchWeather, getWeatherInfo } from '../utils/weather.js'

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export default function WeatherCard() {
  const [weather, setWeather] = useState(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    fetchWeather().then(setWeather).catch(() => setError(true))
  }, [])

  return (
    <div className="weather-card">
      <div className="weather-title">Bormio Weather — Next 7 Days</div>
      {error && <div className="weather-loading">Weather unavailable</div>}
      {!weather && !error && <div className="weather-loading">Loading weather…</div>}
      {weather && (
        <div className="weather-scroll">
          {weather.time.map((dateStr, i) => {
            const info = getWeatherInfo(weather.weather_code[i])
            const date = new Date(dateStr)
            const dayName = DAY_NAMES[date.getDay()]
            const dd = date.getDate()
            return (
              <div key={dateStr} className="weather-day">
                <div className="weather-day-name">{dayName} {dd}</div>
                <div className="weather-icon">{info.icon}</div>
                <div className="weather-temps">
                  {Math.round(weather.temperature_2m_max[i])}° / {Math.round(weather.temperature_2m_min[i])}°
                </div>
                {weather.precipitation_sum[i] > 0 && (
                  <div className="weather-rain">💧{weather.precipitation_sum[i]}mm</div>
                )}
                <div className="weather-wind">💨{Math.round(weather.wind_speed_10m_max[i])}km/h</div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
