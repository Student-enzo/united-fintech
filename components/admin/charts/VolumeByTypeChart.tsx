'use client'

import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid,
} from 'recharts'

interface VolumePoint {
  month:       string
  cardPresent: number
  eCommerce:   number
  moto:        number
}

function fmtY(v: number) {
  if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(1)}M`
  if (v >= 1_000)     return `$${(v / 1_000).toFixed(0)}k`
  return v === 0 ? '' : `$${v}`
}

function fmtTip(v: unknown) {
  return `$${Number(v).toLocaleString('en-US')}`
}

export default function VolumeByTypeChart({ data }: { data: VolumePoint[] }) {
  return (
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
          formatter={(v: unknown, name?: string | number) => {
            const labels: Record<string, string> = {
              cardPresent: 'Card Present',
              eCommerce:   'eCommerce',
              moto:        'MOTO',
            }
            const key = name != null ? String(name) : ''
            return [fmtTip(v), labels[key] ?? key]
          }}
          contentStyle={{
            borderRadius: 10,
            border: '1px solid rgba(144,196,207,0.25)',
            fontSize: 12,
            backgroundColor: '#282626',
            color: 'rgba(255,255,255,0.85)',
          }}
          cursor={{ fill: 'rgba(144,196,207,0.07)' }}
        />
        <Bar dataKey="cardPresent" stackId="vol" fill="#90c4cf" maxBarSize={32} />
        <Bar dataKey="eCommerce"   stackId="vol" fill="#6EE7B7" maxBarSize={32} />
        <Bar
          dataKey="moto"
          stackId="vol"
          fill="#FCD34D"
          radius={[4, 4, 0, 0]}
          maxBarSize={32}
        />
      </BarChart>
    </ResponsiveContainer>
  )
}
