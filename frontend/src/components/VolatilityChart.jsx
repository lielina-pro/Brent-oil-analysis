import React from 'react'
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
} from 'recharts'

function VolTooltip({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null
  return (
    <div className="chart-tooltip">
      <div className="tt-date">{label}</div>
      <div className="tt-value">{(payload[0].value * 100).toFixed(1)}% ann.</div>
    </div>
  )
}

export default function VolatilityChart({ data }) {
  if (!data.length) {
    return <div className="state-msg">No volatility data in this range.</div>
  }

  return (
    <ResponsiveContainer width="100%" height={160}>
      <AreaChart data={data} margin={{ top: 8, right: 20, bottom: 0, left: 0 }}>
        <defs>
          <linearGradient id="volFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#45ada0" stopOpacity={0.45} />
            <stop offset="100%" stopColor="#45ada0" stopOpacity={0.03} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke="#2a3542" strokeDasharray="3 3" vertical={false} />
        <XAxis
          dataKey="date"
          tick={{ fill: '#6c7787', fontSize: 10, fontFamily: 'IBM Plex Mono' }}
          minTickGap={40}
          axisLine={{ stroke: '#2a3542' }}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: '#6c7787', fontSize: 10, fontFamily: 'IBM Plex Mono' }}
          axisLine={false}
          tickLine={false}
          width={40}
          tickFormatter={(v) => `${Math.round(v * 100)}%`}
        />
        <Tooltip content={<VolTooltip />} />
        <Area
          type="monotone"
          dataKey="volatility"
          stroke="#45ada0"
          strokeWidth={1.2}
          fill="url(#volFill)"
          isAnimationActive={false}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
