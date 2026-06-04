'use client'

import {
  ComposedChart, Bar, Line, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid,
} from 'recharts'

interface MonthStat { month: string; volume: number; residual: number }

const MONTH_LABELS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

function shortMonth(m: string) {
  const [, mo] = m.split('-')
  return MONTH_LABELS[parseInt(mo, 10) - 1] ?? m
}

function fmtY(v: number) {
  if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(1)}M`
  if (v >= 1_000)     return `$${(v / 1_000).toFixed(0)}k`
  return v === 0 ? '' : `$${v}`
}

function last12(): MonthStat[] {
  const now = new Date()
  return Array.from({ length: 12 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (11 - i), 1)
    return {
      month:    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`,
      volume:   0,
      residual: 0,
    }
  })
}

export default function VolumeChart({ data }: { data: MonthStat[] }) {
  const base    = last12()
  const map     = Object.fromEntries(data.map(d => [d.month, d]))
  const display = base.map(b => ({ ...b, ...(map[b.month] ?? {}), label: shortMonth(b.month) }))
  const isEmpty = data.length === 0
  const maxVol  = Math.max(...display.map(d => d.volume), 1)

  return (
    <div className="relative">
      <svg width="0" height="0" style={{ position: 'absolute' }}>
        <defs>
          <linearGradient id="volBarGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#2BB8E6" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#0E8FB8" stopOpacity="0.35" />
          </linearGradient>
        </defs>
      </svg>

      <ResponsiveContainer width="100%" height={220}>
        <ComposedChart data={display} margin={{ top: 10, right: 4, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="4 4" stroke="rgba(255,255,255,0.05)" vertical={false} />
          <XAxis dataKey="label"
            tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.3)', fontWeight: 500 }}
            axisLine={false} tickLine={false} />
          <YAxis tickFormatter={fmtY}
            tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.3)', fontWeight: 500 }}
            axisLine={false} tickLine={false} width={42}
            domain={[0, isEmpty ? 100_000 : maxVol * 1.2]} />
          {!isEmpty && (
            <Tooltip
              formatter={(v, name) => [
                `$${Number(v).toLocaleString()}`,
                name === 'volume' ? 'Processing Vol.' : 'Net Residual',
              ]}
              contentStyle={{
                borderRadius: 10, border: '1px solid rgba(43,184,230,0.2)',
                fontSize: 12, backgroundColor: '#141821', color: 'rgba(255,255,255,0.85)',
              }}
              cursor={{ fill: 'rgba(43,184,230,0.06)' }}
            />
          )}
          <Bar dataKey="volume" radius={[4, 4, 0, 0]}
            fill={isEmpty ? 'rgba(255,255,255,0.05)' : 'url(#volBarGrad)'}
            maxBarSize={28} />
          {!isEmpty && (
            <Line dataKey="residual" type="natural"
              stroke="#3DD68C" strokeWidth={2}
              dot={false} activeDot={{ r: 4, fill: '#3DD68C', strokeWidth: 0 }} />
          )}
        </ComposedChart>
      </ResponsiveContainer>

      {isEmpty && (
        <div className="absolute inset-0 flex items-end justify-center pb-10 pointer-events-none">
          <p className="text-xs font-semibold" style={{ color: 'rgba(255,255,255,0.2)' }}>
            No data yet — residuals will populate this chart
          </p>
        </div>
      )}
    </div>
  )
}
