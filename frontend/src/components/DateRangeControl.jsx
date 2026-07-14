import React from 'react'

const PRESETS = [
  { label: 'Full history', start: '1987-05-20', end: '2022-11-14' },
  { label: '2008 crisis', start: '2007-06-01', end: '2009-12-31' },
  { label: '2014-16 collapse', start: '2014-01-01', end: '2016-12-31' },
  { label: 'COVID / price war', start: '2019-11-01', end: '2020-06-01' },
  { label: 'Russia-Ukraine', start: '2021-11-01', end: '2022-06-01' },
]

export default function DateRangeControl({ start, end, onChange }) {
  return (
    <div className="date-range">
      <input
        type="date"
        value={start}
        min="1987-05-20"
        max={end}
        onChange={(e) => onChange(e.target.value, end)}
        aria-label="Range start date"
      />
      <span style={{ color: 'var(--text-muted)' }}>&rarr;</span>
      <input
        type="date"
        value={end}
        min={start}
        max="2022-11-14"
        onChange={(e) => onChange(start, e.target.value)}
        aria-label="Range end date"
      />
      <div className="preset-buttons">
        {PRESETS.map((p) => (
          <button
            key={p.label}
            className={`preset-btn ${start === p.start && end === p.end ? 'active' : ''}`}
            onClick={() => onChange(p.start, p.end)}
          >
            {p.label}
          </button>
        ))}
      </div>
    </div>
  )
}
