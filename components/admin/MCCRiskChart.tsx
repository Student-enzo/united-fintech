'use client'

import dynamic from 'next/dynamic'
import { AlertTriangle } from 'lucide-react'

// ─── Recharts (SSR-safe) ──────────────────────────────────────────────────────
const ResponsiveContainer = dynamic(
  () => import('recharts').then(m => m.ResponsiveContainer), { ssr: false },
)
const PieChart = dynamic(
  () => import('recharts').then(m => m.PieChart), { ssr: false },
)
const Pie = dynamic(() => import('recharts').then(m => m.Pie), { ssr: false })
const Cell = dynamic(() => import('recharts').then(m => m.Cell), { ssr: false })
const Tooltip = dynamic(() => import('recharts').then(m => m.Tooltip), { ssr: false })

// ─── Brand ────────────────────────────────────────────────────────────────────
const B = {
  card:   '#282626',
  text:   'rgba(255,255,255,0.85)',
  muted:  'rgba(255,255,255,0.3)',
  border: 'rgba(144,196,207,0.15)',
  cyan:   '#90c4cf',
  warn:   '#FCD34D',
  danger: '#E8504A',
  green:  '#6EE7B7',
} as const

// ─── MCC categories ───────────────────────────────────────────────────────────
type RiskLevel = 'low' | 'medium' | 'high' | 'very-high'

const RISK_COLOR: Record<RiskLevel, string> = {
  'low':      '#6EE7B7',
  'medium':   '#FCD34D',
  'high':     '#F97316',
  'very-high':'#E8504A',
}

const RISK_LABEL: Record<RiskLevel, string> = {
  'low':      'Low',
  'medium':   'Medium',
  'high':     'High',
  'very-high':'Very High',
}

type MCCEntry = {
  name:       string
  merchants:  number
  volume:     number   // in thousands
  risk:       RiskLevel
}

const MCC_DATA: MCCEntry[] = [
  { name: 'Retail',         merchants: 58,  volume: 12_400, risk: 'low'      },
  { name: 'Restaurant',     merchants: 42,  volume:  7_850, risk: 'low'      },
  { name: 'Healthcare',     merchants: 31,  volume:  5_200, risk: 'medium'   },
  { name: 'eCommerce',      merchants: 28,  volume:  9_300, risk: 'medium'   },
  { name: 'Travel',         merchants: 22,  volume:  6_100, risk: 'high'     },
  { name: 'Adult Content',  merchants: 12,  volume:  2_800, risk: 'high'     },
  { name: 'CBD/Cannabis',   merchants:  9,  volume:  1_950, risk: 'very-high'},
  { name: 'Gambling',       merchants:  4,  volume:    890, risk: 'very-high'},
  { name: 'Other',          merchants:  8,  volume:  1_700, risk: 'low'      },
]

const TOTAL_MERCHANTS = MCC_DATA.reduce((s, d) => s + d.merchants, 0)

// Weighted risk score: low=1, medium=2, high=3, very-high=4
const RISK_WEIGHT: Record<RiskLevel, number> = { low: 1, medium: 2, high: 3, 'very-high': 4 }
function weightedRiskScore() {
  const total = MCC_DATA.reduce((s, d) => s + d.merchants, 0)
  const score = MCC_DATA.reduce((s, d) => s + d.merchants * RISK_WEIGHT[d.risk], 0)
  return (score / total).toFixed(2)
}

// Flag any HIGH or VERY-HIGH mcc that exceeds 15% of portfolio
function overConcentrated(): MCCEntry[] {
  return MCC_DATA.filter(
    d => (d.risk === 'high' || d.risk === 'very-high') && (d.merchants / TOTAL_MERCHANTS) > 0.15,
  )
}

// ─── Tooltip ──────────────────────────────────────────────────────────────────
function CustomTooltip({ active, payload }: { active?: boolean; payload?: { payload: MCCEntry }[] }) {
  if (!active || !payload?.length) return null
  const d = payload[0].payload
  const pct = ((d.merchants / TOTAL_MERCHANTS) * 100).toFixed(1)
  return (
    <div
      className="rounded-xl px-3 py-2 text-xs space-y-0.5"
      style={{ background: '#1c1c1c', border: `1px solid ${B.border}` }}
    >
      <p style={{ color: RISK_COLOR[d.risk], fontWeight: 700 }}>{d.name}</p>
      <p style={{ color: B.text }}>{d.merchants} merchants — {pct}%</p>
      <p style={{ color: B.muted }}>Vol: ${(d.volume / 1_000).toFixed(1)}M / mo</p>
      <p style={{ color: B.muted }}>Risk: {RISK_LABEL[d.risk]}</p>
    </div>
  )
}

// ─── Legend ───────────────────────────────────────────────────────────────────
function Legend() {
  return (
    <div className="flex flex-col gap-1.5 justify-center">
      {MCC_DATA.map(d => {
        const pct = ((d.merchants / TOTAL_MERCHANTS) * 100).toFixed(1)
        return (
          <div key={d.name} className="flex items-center gap-2">
            <span
              className="w-2.5 h-2.5 rounded-full flex-shrink-0"
              style={{ backgroundColor: RISK_COLOR[d.risk] }}
            />
            <span className="text-[10px]" style={{ color: B.muted }}>
              {d.name}
            </span>
            <span className="text-[10px] font-bold ml-auto" style={{ color: B.text }}>
              {pct}%
            </span>
          </div>
        )
      })}
    </div>
  )
}

// ─── Main export ──────────────────────────────────────────────────────────────
export default function MCCRiskChart() {
  const flagged = overConcentrated()
  const riskScore = weightedRiskScore()

  return (
    <div
      className="rounded-2xl p-6 flex flex-col gap-4"
      style={{ backgroundColor: B.card, border: `1px solid ${B.border}` }}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p
            className="text-[9px] font-bold uppercase tracking-[0.22em]"
            style={{ color: B.cyan }}
          >
            MCC Risk Concentration
          </p>
          <p className="text-[11px] mt-0.5" style={{ color: B.muted }}>
            {TOTAL_MERCHANTS} merchants across {MCC_DATA.length} categories
          </p>
        </div>
        <div className="text-right">
          <p className="text-[9px] uppercase tracking-widest" style={{ color: B.muted }}>
            Portfolio Risk Score
          </p>
          <p
            className="text-xl font-bold"
            style={{
              color: parseFloat(riskScore) >= 2.5 ? B.danger : parseFloat(riskScore) >= 1.8 ? B.warn : B.green,
            }}
          >
            {riskScore} / 4.0
          </p>
        </div>
      </div>

      {/* Alert banner if any MCC overconcentrated */}
      {flagged.length > 0 && (
        <div
          className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs"
          style={{
            backgroundColor: 'rgba(232,80,74,0.10)',
            border: '1px solid rgba(232,80,74,0.25)',
          }}
        >
          <AlertTriangle size={13} style={{ color: B.danger, flexShrink: 0 }} />
          <span style={{ color: B.danger }}>
            High-risk MCC over 15% threshold:{' '}
            {flagged.map(d => `${d.name} (${((d.merchants / TOTAL_MERCHANTS) * 100).toFixed(1)}%)`).join(', ')}
          </span>
        </div>
      )}

      {/* Chart + Legend */}
      <div className="flex gap-4 items-center">
        {/* Donut */}
        <div style={{ width: 180, height: 180, flexShrink: 0 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={MCC_DATA}
                dataKey="merchants"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={52}
                outerRadius={80}
                paddingAngle={2}
                strokeWidth={0}
              >
                {MCC_DATA.map(d => (
                  <Cell key={d.name} fill={RISK_COLOR[d.risk]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="flex-1 min-w-0">
          <Legend />
        </div>
      </div>

      {/* Risk level key */}
      <div className="flex gap-3 flex-wrap pt-1" style={{ borderTop: `1px solid ${B.border}` }}>
        {(['low', 'medium', 'high', 'very-high'] as RiskLevel[]).map(r => (
          <div key={r} className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: RISK_COLOR[r] }} />
            <span className="text-[9px] uppercase tracking-widest" style={{ color: B.muted }}>
              {RISK_LABEL[r]}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
