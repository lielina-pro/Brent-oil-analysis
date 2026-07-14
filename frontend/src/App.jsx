import React, { useEffect, useState, useCallback } from 'react'
import { api } from './api'
import DateRangeControl from './components/DateRangeControl'
import EventList from './components/EventList'
import PriceChart from './components/PriceChart'
import VolatilityChart from './components/VolatilityChart'
import ChangePointPanel from './components/ChangePointPanel'

const FULL_START = '1987-05-20'
const FULL_END = '2022-11-14'

export default function App() {
  const [range, setRange] = useState({ start: '2019-11-01', end: '2020-06-01' })
  const [prices, setPrices] = useState([])
  const [volatility, setVolatility] = useState([])
  const [events, setEvents] = useState([])
  const [changepoints, setChangepoints] = useState(null)
  const [selectedEventId, setSelectedEventId] = useState(null)
  const [showVolatility, setShowVolatility] = useState(true)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    api.getEvents().then(setEvents).catch((e) => setError(e.message))
    api.getChangepoints().then(setChangepoints).catch((e) => setError(e.message))
  }, [])

  useEffect(() => {
    setLoading(true)
    Promise.all([
      api.getPrices(range.start, range.end),
      api.getVolatility(30),
    ])
      .then(([priceData, volData]) => {
        setPrices(priceData)
        setVolatility(volData.filter((v) => v.date >= range.start && v.date <= range.end))
        setError(null)
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [range])

  const handleRangeChange = useCallback((start, end) => {
    setRange({ start, end })
  }, [])

  const handleJumpToEvent = useCallback((event) => {
    // center a ~9-month window around the selected event so its context is visible
    const d = new Date(event.date)
    const start = new Date(d)
    start.setMonth(start.getMonth() - 4)
    const end = new Date(d)
    end.setMonth(end.getMonth() + 5)

    const clamp = (dt, lo, hi) => {
      const iso = dt.toISOString().slice(0, 10)
      if (iso < lo) return lo
      if (iso > hi) return hi
      return iso
    }
    setRange({
      start: clamp(start, FULL_START, FULL_END),
      end: clamp(end, FULL_START, FULL_END),
    })
  }, [])

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="brand">
          <span className="brand-mark" />
          <div>
            <div className="brand-title">Brent Crude Intelligence</div>
            <div className="brand-subtitle">Birhan Energies — Change Point Dashboard</div>
          </div>
        </div>
        <DateRangeControl start={range.start} end={range.end} onChange={handleRangeChange} />
      </header>

      <aside className="app-sidebar">
        <EventList
          events={events}
          selectedEventId={selectedEventId}
          onSelect={setSelectedEventId}
          onJumpToEvent={handleJumpToEvent}
        />
      </aside>

      <main className="app-main">
        {error && <div className="state-msg" style={{ color: 'var(--accent-rust)' }}>Error: {error}. Is the Flask backend running on port 5000?</div>}

        <section className="panel">
          <p className="section-label">Historical price</p>
          <h2 className="section-title">Brent spot price (USD/barrel)</h2>
          {loading ? <div className="state-msg">Loading…</div> : (
            <PriceChart data={prices} events={events} selectedEventId={selectedEventId} />
          )}
        </section>

        <section className="panel">
          <div className="toggle-row">
            <button
              className={`toggle-btn ${showVolatility ? 'active' : ''}`}
              onClick={() => setShowVolatility(true)}
            >
              30-day volatility
            </button>
            <button
              className={`toggle-btn ${!showVolatility ? 'active' : ''}`}
              onClick={() => setShowVolatility(false)}
            >
              Hide
            </button>
          </div>
          {showVolatility && (loading ? <div className="state-msg">Loading…</div> : <VolatilityChart data={volatility} />)}
        </section>

        <section className="panel">
          <p className="section-label">Task 2 results</p>
          <h2 className="section-title">Change point model findings</h2>
          <ChangePointPanel changepoints={changepoints} />
        </section>
      </main>
    </div>
  )
}
