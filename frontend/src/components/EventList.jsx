import React, { useMemo, useState } from 'react'

export default function EventList({ events, selectedEventId, onSelect, onJumpToEvent }) {
  const [activeCategory, setActiveCategory] = useState('All')

  const categories = useMemo(
    () => ['All', ...Array.from(new Set(events.map((e) => e.category))).sort()],
    [events]
  )

  const filtered = useMemo(
    () => (activeCategory === 'All' ? events : events.filter((e) => e.category === activeCategory)),
    [events, activeCategory]
  )

  return (
    <div>
      <p className="section-label">Event filter</p>
      <div className="category-filter">
        {categories.map((c) => (
          <button
            key={c}
            className={`chip ${activeCategory === c ? 'active' : ''}`}
            onClick={() => setActiveCategory(c)}
          >
            {c}
          </button>
        ))}
      </div>

      <p className="section-label">Events ({filtered.length})</p>
      <ul className="event-list">
        {filtered.map((e) => {
          const isSelected = e.event_id === selectedEventId
          return (
            <li
              key={e.event_id}
              className={`event-item ${isSelected ? 'selected' : ''}`}
              onClick={() => {
                onSelect(isSelected ? null : e.event_id)
                onJumpToEvent(e)
              }}
            >
              <div className="event-date">{e.date}</div>
              <div className="event-name">{e.name}</div>
              <div className="event-category">{e.category}</div>
              {isSelected && <div className="event-description">{e.description}</div>}
            </li>
          )
        })}
      </ul>
    </div>
  )
}
