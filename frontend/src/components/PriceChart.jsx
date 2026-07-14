import React, { useMemo } from 'react'
import {
  ResponsiveContainer, ComposedChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, ReferenceLine,
} from 'recharts'

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null
  return (
    <div className="chart-tooltip">
      <div className="tt-date">{label}</div>
      <div className="tt-value">${payload[0].value?.toFixed(2)} / bbl</div>
    </div>
  )
}

// Recharts' category axis can only place a ReferenceLine exactly on one of
// the axis's own tick values. Event dates often fall on weekends/holidays
// when the market was closed, so we snap each event to the nearest date
// that actually exists in the current chart data.
function snapToNearestDate(targetDate, sortedDates) {
  if (!sortedDates.length) return null
  let lo = 0
  let hi = sortedDates.length - 1
  if (targetDate <= sortedDates[0]) return sortedDates[0]
  if (targetDate >= sortedDates[hi]) return sortedDates[hi]
  while (lo < hi) {
    const mid = Math.floor((lo + hi) / 2)
    if (sortedDates[mid] === targetDate) return sortedDates[mid]
    if (sortedDates[mid] < targetDate) lo = mid + 1
    else hi = mid
  }
  const after = sortedDates[lo]
  const before = sortedDates[Math.max(lo - 1, 0)]
  const target = new Date(targetDate).getTime()
  const distBefore = Math.abs(target - new Date(before).getTime())
  const distAfter = Math.abs(new Date(after).getTime() - target)
  return distBefore <= distAfter ? before : after
}

export default function PriceChart({ data, events, selectedEventId }) {
  const sortedDates = useMemo(() => data.map((d) => d.date), [data])

  const snappedEvents = useMemo(() => {
    if (!sortedDates.length) return []
    return events
      .filter((e) => e.date >= sortedDates[0] && e.date <= sortedDates[sortedDates.length - 1])
      .map((e) => ({ ...e, snappedDate: snapToNearestDate(e.date, sortedDates) }))
      .filter((e) => e.snappedDate)
  }, [events, sortedDates])

  if (!data.length) {
    return <div className="state-msg">No price data in this range.</div>
  }

  return (
    <ResponsiveContainer width="100%" height={360}>
      <ComposedChart data={data} margin={{ top: 24, right: 20, bottom: 8, left: 0 }}>
        <CartesianGrid stroke="#2a3542" strokeDasharray="3 3" vertical={false} />
        <XAxis
          dataKey="date"
          tick={{ fill: '#6c7787', fontSize: 11, fontFamily: 'IBM Plex Mono' }}
          minTickGap={40}
          axisLine={{ stroke: '#2a3542' }}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: '#6c7787', fontSize: 11, fontFamily: 'IBM Plex Mono' }}
          axisLine={false}
          tickLine={false}
          width={44}
          tickFormatter={(v) => `$${v}`}
        />
        <Tooltip content={<CustomTooltip />} />
        <Line
          type="monotone"
          dataKey="price"
          stroke="#e0973f"
          strokeWidth={1.4}
          dot={false}
          isAnimationActive={false}
        />
        {snappedEvents.map((e) => (
          <ReferenceLine
            key={e.event_id}
            x={e.snappedDate}
            stroke={e.event_id === selectedEventId ? '#45ada0' : '#e0973f'}
            strokeOpacity={e.event_id === selectedEventId ? 0.9 : 0.25}
            strokeWidth={e.event_id === selectedEventId ? 2 : 1}
            ifOverflow="extendDomain"
          />
        ))}
      </ComposedChart>
    </ResponsiveContainer>
  )
}
