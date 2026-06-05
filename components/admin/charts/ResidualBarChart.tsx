'use client'

import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid,
} from 'recharts'

interface ResidualPoint { month: string; residual: number }

function fmtY(v: number) {
  if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(1)}M`
  if (v >= 1_000)     return `$${(v / 1_000).toFixed(0)}k`
  return v === 0 ? '' : `$${v}`
}

export default function ResidualBarChart({ data }: { data: ResidualPoint[] }) {
  return (
    <div className="relative">
      <svg width="0" height="0" style={{ position: 'absolute' }}>
        <defs>
          <linearGradient id="residualGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#90c4cf" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#4A9B7F" stopOpacity="0.4" />
          </linearGradient>
        </defs>
      </svg>
      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="4 4" stroke="rgba(255,255,255,0.05)" vertical={false} />
          <XAxis
            dataKey="month"
            tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.3)', fontWeight: 500 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tickFormatter={fmtY}
            tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.3)', fontWeight: 500 }}
            axisLine={false}
            tickLine={false}
            width={46}
          />
          <Tooltip
            formatter={(v: unknown) => [`$${Number(v).toLocaleString('en-US')}`, 'Net Residual']}
            contentStyle={{
              borderRadius: 10,
              border: '1px solid rgba(144,196,207,0.25)',
              fontSize: 12,
              backgroundColor: '#282626',
              color: 'rgba(255,255,255,0.85)',
            }}
            cursor={{ fill: 'rgba(144,196,207,0.07)' }}
          />
          <Bar
            dataKey="residual"
            radius={[4, 4, 0, 0]}
            fill="url(#residualGrad)"
            maxBarSize={32}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
