import { useState } from 'react'
import DaysView from './components/DaysView.jsx'
import DayDetail from './components/DayDetail.jsx'
import HotelView from './components/HotelView.jsx'
import RidersView from './components/RidersView.jsx'
import SOSButton from './components/SOSButton.jsx'

const INITIAL_ASSIGNMENTS = { 1: null, 2: null, 3: null, 4: null, 5: null, 6: null }

function loadAssignments() {
  try {
    const saved = localStorage.getItem('dayAssignments')
    return saved ? JSON.parse(saved) : INITIAL_ASSIGNMENTS
  } catch {
    return INITIAL_ASSIGNMENTS
  }
}

const TITLES = {
  days: 'Bormio Ride 2026',
  riders: 'The Riders',
  hotel: 'Hotel',
  detail: null,
}

export default function App() {
  const [view, setView] = useState('days')
  const [selectedDay, setSelectedDay] = useState(null)
  const [dayAssignments, setDayAssignments] = useState(loadAssignments)

  function updateAssignment(day, routeKey) {
    const updated = { ...dayAssignments, [day]: routeKey }
    setDayAssignments(updated)
    localStorage.setItem('dayAssignments', JSON.stringify(updated))
  }

  function openDay(day) {
    setSelectedDay(day)
    setView('detail')
  }

  const title = view === 'detail' ? `Day ${selectedDay}` : TITLES[view]

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-inner">
          {view === 'detail' && (
            <button className="back-btn" onClick={() => setView('days')}>
              ← Back
            </button>
          )}
          <div>
            <h1 className="app-title">{title}</h1>
            {view === 'days' && <div className="app-subtitle">Bormio, Italy · June 2026</div>}
          </div>
        </div>
      </header>

      <main className="app-main">
        {view === 'days' && (
          <DaysView
            dayAssignments={dayAssignments}
            onUpdateAssignment={updateAssignment}
            onSelectDay={openDay}
          />
        )}
        {view === 'detail' && (
          <DayDetail day={selectedDay} routeKey={dayAssignments[selectedDay]} />
        )}
        {view === 'riders' && <RidersView />}
        {view === 'hotel' && <HotelView />}
      </main>

      <nav className="bottom-nav">
        <button
          className={`nav-btn ${view === 'days' || view === 'detail' ? 'active' : ''}`}
          onClick={() => setView('days')}
        >
          <span>🗓️</span>
          <span>Days</span>
        </button>
        <button
          className={`nav-btn ${view === 'riders' ? 'active' : ''}`}
          onClick={() => setView('riders')}
        >
          <span>🚵</span>
          <span>Riders</span>
        </button>
        <button
          className={`nav-btn ${view === 'hotel' ? 'active' : ''}`}
          onClick={() => setView('hotel')}
        >
          <span>🏨</span>
          <span>Hotel</span>
        </button>
      </nav>

      <SOSButton />
    </div>
  )
}
