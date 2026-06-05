'use client'

import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts'

type DataPoint = { label: string; inflows: number; outflows: number; net: number }

function fmt(n: number) {
  if (Math.abs(n) >= 1000) return `$${(n / 1000).toFixed(0)}k`
  return `$${n.toFixed(0)}`
}

export default function CashflowChart({ data }: { data: DataPoint[] }) {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <ComposedChart data={data} margin={{ top: 4, right: 4, left: 4, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
        <XAxis dataKey="label" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }} axisLine={false} tickLine={false} />
        <YAxis tickFormatter={fmt} tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }} axisLine={false} tickLine={false} width={48} />
        <Tooltip
          contentStyle={{ backgroundColor: '#1c1c1c', border: '1px solid rgba(144,196,207,0.2)', borderRadius: 10, fontSize: 12 }}
          labelStyle={{ color: 'rgba(255,255,255,0.6)', marginBottom: 4 }}
          formatter={(value, name) => {
            const labels: Record<string, string> = { inflows: 'Inflows', outflows: 'Outflows', net: 'Net' }
            const n = typeof value === 'number' ? value : Number(value ?? 0)
            return [`$${n.toLocaleString()}`, labels[String(name)] ?? String(name)]
          }}
        />
        <Legend
          wrapperStyle={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}
          formatter={(value: string) => ({ inflows: 'Inflows', outflows: 'Outflows', net: 'Net' }[value] ?? value)}
        />
        <Bar dataKey="inflows"  fill="#4A9B7F" radius={[4, 4, 0, 0]} opacity={0.85} />
        <Bar dataKey="outflows" fill="#EF4444" radius={[4, 4, 0, 0]} opacity={0.75} />
        <Line type="monotone" dataKey="net" stroke="#90c4cf" strokeWidth={2.5} dot={{ fill: '#90c4cf', r: 3 }} activeDot={{ r: 5 }} />
      </ComposedChart>
    </ResponsiveContainer>
  )
}
