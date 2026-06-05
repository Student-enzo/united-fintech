'use client'

import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid, Cell,
} from 'recharts'

interface PartnerResidual { partner_name: string; residual: number }

const COLORS = ['#90c4cf', '#6EE7B7', '#FCD34D', '#4A9B7F', '#90c4cf', '#C9D1D9']

function fmtY(v: number) {
  if (v >= 1_000) return `$${(v / 1_000).toFixed(0)}k`
  return v === 0 ? '' : `$${v}`
}

export default function PartnerResidualChart({ data }: { data: PartnerResidual[] }) {
  const isEmpty = data.length === 0
  const display = isEmpty
    ? [{ partner_name: 'No data', residual: 0 }]
    : data.slice(0, 8)

  return (
    <div className="relative">
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={display} layout="vertical" margin={{ top: 4, right: 16, left: 4, bottom: 0 }}>
          <CartesianGrid strokeDasharray="4 4" stroke="rgba(255,255,255,0.05)" horizontal={false} />
          <XAxis type="number" tickFormatter={fmtY}
            tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.3)', fontWeight: 500 }}
            axisLine={false} tickLine={false} />
          <YAxis type="category" dataKey="partner_name" width={90}
            tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.5)', fontWeight: 500 }}
            axisLine={false} tickLine={false} />
          {!isEmpty && (
            <Tooltip
              formatter={(v) => [`$${Number(v).toLocaleString()}`, 'Net Residual']}
              contentStyle={{
                borderRadius: 10, border: '1px solid rgba(144,196,207,0.2)',
                fontSize: 12, backgroundColor: '#282626', color: 'rgba(255,255,255,0.85)',
              }}
              cursor={{ fill: 'rgba(144,196,207,0.06)' }}
            />
          )}
          <Bar dataKey="residual" radius={[0, 4, 4, 0]} maxBarSize={20}>
            {display.map((_, i) => (
              <Cell key={i} fill={isEmpty ? 'rgba(255,255,255,0.05)' : (COLORS[i % COLORS.length])} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {isEmpty && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <p className="text-xs font-semibold" style={{ color: 'rgba(255,255,255,0.2)' }}>
            No residual data yet
          </p>
        </div>
      )}
    </div>
  )
}
