'use client'

import dynamic from 'next/dynamic'

// ── Chart style constants ────────────────────────────────────────────────────
export const CARD: React.CSSProperties = {
  backgroundColor: '#282626',
  border:          '1px solid rgba(144,196,207,0.15)',
  borderRadius:    16,
  padding:         20,
}

const LABEL: React.CSSProperties = {
  fontSize:        10,
  fontWeight:      700,
  textTransform:   'uppercase',
  letterSpacing:   '0.18em',
  color:           'rgba(144,196,207,0.7)',
  marginBottom:    4,
}

const TITLE: React.CSSProperties = {
  fontSize:        15,
  fontWeight:      600,
  color:           'rgba(255,255,255,0.85)',
  marginBottom:    16,
}

// ── Skeleton shown while charts load ────────────────────────────────────────
function ChartSkeleton({ h = 240 }: { h?: number }) {
  return (
    <div
      className="animate-pulse rounded-xl"
      style={{ height: h, backgroundColor: 'rgba(255,255,255,0.04)' }}
    />
  )
}

// ── Mock data ─────────────────────────────────────────────────────────────────
function last12Months() {
  const months: string[] = []
  const now = new Date()
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    months.push(d.toLocaleString('en-US', { month: 'short', year: '2-digit' }))
  }
  return months
}

export const RESIDUAL_DATA = (() => {
  const labels = last12Months()
  const base   = [41200, 43800, 39900, 47200, 52100, 55400, 58900, 63100, 70200, 78450, 88300, 96640]
  return labels.map((month, i) => ({ month, residual: base[i] ?? 0 }))
})()

export const VOLUME_BY_TYPE_DATA = (() => {
  const labels = last12Months()
  const cp   = [4_100_000, 4_380_000, 3_990_000, 4_720_000, 5_210_000, 5_540_000, 5_890_000, 6_310_000, 7_020_000, 7_845_000, 8_830_000, 9_664_000]
  const ec   = [2_200_000, 2_400_000, 2_150_000, 2_600_000, 2_850_000, 3_100_000, 3_400_000, 3_750_000, 4_200_000, 4_650_000, 5_100_000, 5_640_000]
  const moto = [  480_000,   510_000,   430_000,   560_000,   620_000,   670_000,   750_000,   820_000,   910_000, 1_010_000, 1_120_000, 1_240_000]
  return labels.map((month, i) => ({
    month,
    cardPresent: cp[i]   ?? 0,
    eCommerce:   ec[i]   ?? 0,
    moto:        moto[i] ?? 0,
  }))
})()

export const EXPENSES_DATA = [
  { category: 'Interchange Costs',  amount: 28_450 },
  { category: 'Processing Fees',    amount: 14_200 },
  { category: 'Risk Reserves',      amount:  9_800 },
  { category: 'Partner Payouts',    amount: 22_100 },
  { category: 'Compliance & Legal', amount:  6_300 },
  { category: 'Support & Ops',      amount:  4_900 },
]

// ── Lazy-loaded chart components ─────────────────────────────────────────────
const ResidualBarChart = dynamic(
  () => import('./charts/ResidualBarChart'),
  { ssr: false, loading: () => <ChartSkeleton h={240} /> }
)

const VolumeByTypeChart = dynamic(
  () => import('./charts/VolumeByTypeChart'),
  { ssr: false, loading: () => <ChartSkeleton h={240} /> }
)

const ExpensesDonutChart = dynamic(
  () => import('./charts/ExpensesDonutChart'),
  { ssr: false, loading: () => <ChartSkeleton h={240} /> }
)

// ── Legend ───────────────────────────────────────────────────────────────────
function Legend({ items }: { items: { color: string; label: string }[] }) {
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mb-4">
      {items.map(it => (
        <span key={it.label} className="flex items-center gap-1.5 text-[11px]"
          style={{ color: 'rgba(255,255,255,0.45)' }}>
          <span className="inline-block w-3 h-3 rounded-sm flex-shrink-0"
            style={{ backgroundColor: it.color }} />
          {it.label}
        </span>
      ))}
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────
export default function DashboardCharts() {
  return (
    <div className="flex flex-col gap-5">

      {/* Residual Revenue — 12 months bar */}
      <div style={CARD}>
        <p style={LABEL}>Revenue</p>
        <p style={TITLE}>Residual Revenue — Last 12 Months</p>
        <Legend items={[{ color: '#90c4cf', label: 'Net Residual' }]} />
        <ResidualBarChart data={RESIDUAL_DATA} />
      </div>

      {/* Processing Volume by Account Type — stacked bar */}
      <div style={CARD}>
        <p style={LABEL}>Processing</p>
        <p style={TITLE}>Volume by Account Type — Last 12 Months</p>
        <Legend items={[
          { color: '#90c4cf', label: 'Card Present' },
          { color: '#3DD68C', label: 'eCommerce'   },
          { color: '#F0B23E', label: 'MOTO'         },
        ]} />
        <VolumeByTypeChart data={VOLUME_BY_TYPE_DATA} />
      </div>

      {/* Operating Expenses by Category — donut */}
      <div style={CARD}>
        <p style={LABEL}>Cost Center</p>
        <p style={TITLE}>Operating Expenses by Category</p>
        <ExpensesDonutChart data={EXPENSES_DATA} />
      </div>

    </div>
  )
}
