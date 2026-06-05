'use client'

import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid, Cell,
} from 'recharts'

interface StageCount { stage: string; count: number }

const STAGE_COLORS: Record<string, string> = {
  'New Lead':      '#93C5FD',
  'Application':   '#FCD34D',
  'Submitted':     '#90c4cf',
  'Underwriting':  '#FCD34D',
  'Approved':      '#6EE7B7',
  'Live':          '#90c4cf',
  'Closed':        'rgba(255,255,255,0.2)',
}

export default function PipelineFunnelChart({ data }: { data: StageCount[] }) {
  const isEmpty = data.every(d => d.count === 0)

  return (
    <div className="relative">
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} margin={{ top: 10, right: 4, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="4 4" stroke="rgba(255,255,255,0.05)" vertical={false} />
          <XAxis dataKey="stage"
            tick={{ fontSize: 9, fill: 'rgba(255,255,255,0.3)', fontWeight: 500 }}
            axisLine={false} tickLine={false} />
          <YAxis allowDecimals={false}
            tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.3)', fontWeight: 500 }}
            axisLine={false} tickLine={false} width={24} />
          {!isEmpty && (
            <Tooltip
              formatter={(v, _, props) => [v, props.payload?.stage ?? 'Merchants']}
              contentStyle={{
                borderRadius: 10, border: '1px solid rgba(144,196,207,0.2)',
                fontSize: 12, backgroundColor: '#282626', color: 'rgba(255,255,255,0.85)',
              }}
              cursor={{ fill: 'rgba(144,196,207,0.06)' }}
            />
          )}
          <Bar dataKey="count" radius={[4, 4, 0, 0]} maxBarSize={36}>
            {data.map((d, i) => (
              <Cell key={i}
                fill={isEmpty ? 'rgba(255,255,255,0.05)' : (STAGE_COLORS[d.stage] ?? '#90c4cf')}
                fillOpacity={isEmpty ? 1 : 0.85}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {isEmpty && (
        <div className="absolute inset-0 flex items-end justify-center pb-10 pointer-events-none">
          <p className="text-xs font-semibold" style={{ color: 'rgba(255,255,255,0.2)' }}>
            No merchants yet — add your first to see the pipeline
          </p>
        </div>
      )}
    </div>
  )
}
