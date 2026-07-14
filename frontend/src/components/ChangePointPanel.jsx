import React from 'react'

function ImpactStat({ label, value, direction }) {
  const cls = direction === 'up' ? 'up' : direction === 'down' ? 'down' : ''
  const arrow = direction === 'up' ? '\u25B2' : direction === 'down' ? '\u25BC' : ''
  return (
    <div className="stat-block">
      <div className="stat-label">{label}</div>
      <div className={`stat-value ${cls}`}>
        {arrow && <span className="ticker-arrow">{arrow}</span>}
        {value}
      </div>
    </div>
  )
}

function FullSeriesCard({ model }) {
  return (
    <div className="cp-card">
      <div className="cp-card-title">Full-series model (mandatory)</div>
      <div className="cp-card-date">Change point: {model.change_point_date}</div>
      <div className="stat-grid">
        <ImpactStat label="Mean before" value={`$${model.mean_before}`} />
        <ImpactStat label="Mean after" value={`$${model.mean_after}`} direction="up" />
        <ImpactStat label="Change" value={`+${model.pct_change}%`} direction="up" />
        <ImpactStat label="P(increase)" value={model.probability_increase.toFixed(2)} />
      </div>
      <div className="badge">No close event match — broad regime shift</div>
      <p className="cp-card-note">{model.interpretation}</p>
    </div>
  )
}

function CaseStudyCard({ study }) {
  const direction = study.direction === 'increase' ? 'up' : 'down'
  const sign = study.pct_change > 0 ? '+' : ''
  return (
    <div className="cp-card">
      <div className="cp-card-title">{study.title}</div>
      <div className="cp-card-date">Change point: {study.change_point_date}</div>
      <div className="stat-grid">
        <ImpactStat label="Mean before" value={`$${study.mean_before}`} />
        <ImpactStat label="Mean after" value={`$${study.mean_after}`} direction={direction} />
        <ImpactStat label="Change" value={`${sign}${study.pct_change}%`} direction={direction} />
        <ImpactStat label={`P(${study.direction})`} value={study.probability_direction.toFixed(2)} />
      </div>
      {study.matched_events?.map((ev) => (
        <div key={ev.name} className="badge">{ev.name} — {ev.date}</div>
      ))}
      {study.note && <p className="cp-card-note">{study.note}</p>}
    </div>
  )
}

function PeltCard({ breakpoints }) {
  return (
    <div className="cp-card">
      <div className="cp-card-title">Multiple change points (PELT extension)</div>
      <div className="cp-card-date">{breakpoints.length} breakpoints detected across full history</div>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {breakpoints.map((bp) => (
          <li key={bp.date} style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-crude)' }}>{bp.date}</span>
            {' — mean $'}{bp.mean_price_after}
            {bp.pct_change_vs_prev != null && (
              <span style={{ color: bp.pct_change_vs_prev > 0 ? 'var(--accent-teal)' : 'var(--accent-rust)' }}>
                {' '}({bp.pct_change_vs_prev > 0 ? '+' : ''}{bp.pct_change_vs_prev}%)
              </span>
            )}
            {bp.matched_event && (
              <div className="badge" style={{ marginTop: 4 }}>{bp.matched_event} — {bp.matched_event_date}</div>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function ChangePointPanel({ changepoints }) {
  if (!changepoints) return <div className="state-msg">Loading change point results…</div>

  return (
    <div className="cp-grid">
      <FullSeriesCard model={changepoints.full_series_model} />
      <PeltCard breakpoints={changepoints.pelt_breakpoints} />
      {changepoints.case_studies.map((s) => (
        <CaseStudyCard key={s.id} study={s} />
      ))}
    </div>
  )
}
