'use client'

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'

interface ExpensePoint { category: string; amount: number }

const PALETTE = [
  '#90c4cf',
  '#6EE7B7',
  '#FCD34D',
  '#4A9B7F',
  '#E8504A',
  '#C9D1D9',
]

function fmtCurrency(n: number) {
  if (n >= 1_000) return `$${(n / 1_000).toFixed(1)}k`
  return `$${n}`
}

export default function ExpensesDonutChart({ data }: { data: ExpensePoint[] }) {
  const total = data.reduce((s, d) => s + d.amount, 0)

  return (
    <div className="flex flex-col lg:flex-row items-center gap-4">
      <div className="relative flex-shrink-0" style={{ width: 200, height: 200 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={58}
              outerRadius={88}
              paddingAngle={3}
              dataKey="amount"
              stroke="none"
            >
              {data.map((_, i) => (
                <Cell key={i} fill={PALETTE[i % PALETTE.length]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(v: unknown) => [
                fmtCurrency(Number(v)),
                'Expense',
              ]}
              contentStyle={{
                borderRadius: 10,
                border: '1px solid rgba(144,196,207,0.25)',
                fontSize: 12,
                backgroundColor: '#282626',
                color: 'rgba(255,255,255,0.85)',
              }}
            />
          </PieChart>
        </ResponsiveContainer>
        {/* Center label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <p className="text-[10px] font-bold uppercase tracking-widest"
            style={{ color: 'rgba(255,255,255,0.35)' }}>Total</p>
          <p className="text-lg font-bold" style={{ color: 'rgba(255,255,255,0.85)' }}>{fmtCurrency(total)}</p>
        </div>
      </div>

      {/* Legend list */}
      <div className="flex flex-col gap-2 flex-1 w-full">
        {data.map((d, i) => {
          const pct = ((d.amount / total) * 100).toFixed(1)
          return (
            <div key={d.category} className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-sm flex-shrink-0"
                style={{ backgroundColor: PALETTE[i % PALETTE.length] }} />
              <span className="text-[11px] flex-1 truncate" style={{ color: 'rgba(255,255,255,0.6)' }}>
                {d.category}
              </span>
              <span className="text-[11px] font-bold tabular-nums" style={{ color: 'rgba(255,255,255,0.85)' }}>
                {fmtCurrency(d.amount)}
              </span>
              <span className="text-[10px] w-10 text-right" style={{ color: 'rgba(255,255,255,0.35)' }}>
                {pct}%
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
