'use client'

import { BRAND } from '@/lib/brand'
import type { MerchantRecord } from '@/lib/mock-merchants'

function fmtCurrency(n: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n)
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']

function mockVolumeHistory(base: number) {
  return [0.72, 0.79, 0.85, 0.88, 0.94, 1.0].map(f => Math.round(base * f))
}

function BarChart({ data, labels }: { data: number[]; labels: string[] }) {
  const max = Math.max(...data)
  const W = 560
  const H = 160
  const PAD_LEFT = 64
  const PAD_RIGHT = 12
  const PAD_TOP = 28
  const PAD_BOT = 28
  const chartW = W - PAD_LEFT - PAD_RIGHT
  const chartH = H - PAD_TOP - PAD_BOT
  const barW = Math.floor((chartW / data.length) * 0.55)
  const gap = chartW / data.length

  // Y-axis labels: 4 evenly spaced ticks
  const ticks = [0, 0.25, 0.5, 0.75, 1.0].map(t => Math.round(max * t))

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: 160 }}>
      {/* Y-axis grid lines + labels */}
      {ticks.map((tick, i) => {
        const y = PAD_TOP + chartH - (tick / max) * chartH
        return (
          <g key={i}>
            <line
              x1={PAD_LEFT} y1={y} x2={W - PAD_RIGHT} y2={y}
              stroke="rgba(255,255,255,0.05)" strokeWidth="1"
            />
            <text
              x={PAD_LEFT - 6} y={y + 4}
              textAnchor="end" fontSize="9" fill={BRAND.muted}
            >
              {tick >= 1000000 ? `$${(tick / 1000000).toFixed(1)}M` : tick >= 1000 ? `$${Math.round(tick / 1000)}k` : `$${tick}`}
            </text>
          </g>
        )
      })}

      {/* Bars */}
      {data.map((val, i) => {
        const isLast = i === data.length - 1
        const barH = (val / max) * chartH
        const x = PAD_LEFT + gap * i + (gap - barW) / 2
        const y = PAD_TOP + chartH - barH
        const fillOpacity = isLast ? 1 : 0.7
        const fill = isLast ? BRAND.cyan : `${BRAND.cyan}B3`

        return (
          <g key={i}>
            <rect
              x={x} y={y} width={barW} height={barH}
              fill={fill} fillOpacity={fillOpacity}
              rx="3" ry="3"
            />
            {/* Value above bar */}
            <text
              x={x + barW / 2} y={y - 5}
              textAnchor="middle" fontSize="8" fill={isLast ? BRAND.cyan : BRAND.muted}
              fontWeight={isLast ? 'bold' : 'normal'}
            >
              {val >= 1000000 ? `$${(val / 1000000).toFixed(1)}M` : `$${Math.round(val / 1000)}k`}
            </text>
            {/* Month label below bar */}
            <text
              x={x + barW / 2} y={PAD_TOP + chartH + 16}
              textAnchor="middle" fontSize="9" fill={isLast ? BRAND.text : BRAND.muted}
            >
              {labels[i]}
            </text>
          </g>
        )
      })}
    </svg>
  )
}

export default function MDFinance({ merchant: m }: { merchant: MerchantRecord }) {
  const bps = m.basis_points_earned ?? 15
  const residual = m.monthly_volume * bps / 10000
  const isoSplit = residual * 0.6

  // Rate breakdown values
  const processorCost = m.monthly_volume * 0.004
  const isoGross = m.monthly_volume * bps / 10000
  const isoSplitToPartner = isoGross * 0.40
  const netResidual = isoGross - isoSplitToPartner

  const volumeHistory = mockVolumeHistory(m.monthly_volume)
  const annualResidual = netResidual * 12

  const kpis = [
    { label: 'Gross Volume', value: fmtCurrency(m.monthly_volume), sub: 'this month', color: BRAND.cyan },
    { label: 'Estimated Residual', value: fmtCurrency(residual), sub: `${(bps / 100).toFixed(2)}% rate`, color: BRAND.success },
    { label: 'ISO Split (60%)', value: fmtCurrency(isoSplit), sub: 'after 40% partner', color: BRAND.text },
  ]

  const breakdown = [
    { label: 'Gross Volume', value: fmtCurrency(m.monthly_volume), prefix: '', special: false },
    { label: 'Processor Cost (0.40%)', value: `- ${fmtCurrency(processorCost)}`, prefix: '', special: false, muted: true },
    { label: 'ISO Gross Revenue', value: fmtCurrency(isoGross), prefix: '', special: false },
    { label: 'ISO Split to Partner (40%)', value: `- ${fmtCurrency(isoSplitToPartner)}`, prefix: '', special: false, muted: true },
    { label: 'Net Residual', value: fmtCurrency(netResidual), prefix: '', special: true },
  ]

  return (
    <div className="flex flex-col gap-5">

      {/* KPI row — 3 cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {kpis.map(({ label, value, sub, color }) => (
          <div
            key={label}
            className="p-4 rounded-2xl flex flex-col gap-1.5"
            style={{ backgroundColor: BRAND.card, border: `1px solid ${BRAND.border}` }}
          >
            <span className="text-[10px] uppercase tracking-widest font-semibold" style={{ color: BRAND.muted }}>
              {label}
            </span>
            <span className="text-2xl font-bold" style={{ color }}>{value}</span>
            <span className="text-[10px]" style={{ color: BRAND.muted }}>{sub}</span>
          </div>
        ))}
      </div>

      {/* 2-column: chart left, breakdown right */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">

        {/* Bar chart */}
        <div className="rounded-2xl p-5" style={{ backgroundColor: BRAND.card, border: `1px solid ${BRAND.border}` }}>
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs font-bold uppercase tracking-widest" style={{ color: BRAND.muted }}>
              Monthly Processing Volume
            </p>
            <span className="text-xs font-semibold" style={{ color: BRAND.cyan }}>
              6-month trend
            </span>
          </div>
          <BarChart data={volumeHistory} labels={MONTHS} />
        </div>

        {/* Rate breakdown */}
        <div className="rounded-2xl p-5 flex flex-col gap-4" style={{ backgroundColor: BRAND.card, border: `1px solid ${BRAND.border}` }}>
          <p className="text-xs font-bold uppercase tracking-widest" style={{ color: BRAND.muted }}>
            Rate Breakdown
          </p>
          <p className="text-[10px]" style={{ color: BRAND.muted }}>
            Based on {bps} bps earned rate
          </p>
          <div className="flex flex-col gap-0">
            {breakdown.map(({ label, value, special, muted }, i) => (
              <div
                key={i}
                className="flex items-center justify-between py-2.5"
                style={{
                  borderBottom: i < breakdown.length - 1 ? `1px solid ${BRAND.border}` : 'none',
                  marginTop: special ? 8 : 0,
                  paddingTop: special ? 12 : undefined,
                  borderTop: special ? `2px solid ${BRAND.borderCyan}` : undefined,
                }}
              >
                <span
                  className={special ? 'text-sm font-bold' : 'text-xs'}
                  style={{ color: special ? BRAND.success : muted ? BRAND.muted : BRAND.text }}
                >
                  {label}
                </span>
                <span
                  className={special ? 'text-sm font-bold' : 'text-xs font-semibold'}
                  style={{ color: special ? BRAND.success : muted ? BRAND.muted : BRAND.text }}
                >
                  {value}
                </span>
              </div>
            ))}
          </div>

          {/* Annualized card */}
          <div
            className="mt-2 rounded-xl p-4 flex items-center justify-between"
            style={{
              backgroundColor: `${BRAND.success}10`,
              border: `1px solid ${BRAND.success}33`,
            }}
          >
            <div>
              <p className="text-[10px] uppercase tracking-widest font-semibold" style={{ color: BRAND.success }}>
                Est. Annual Residual
              </p>
              <p className="text-[10px] mt-0.5" style={{ color: BRAND.muted }}>
                Net residual × 12
              </p>
            </div>
            <span className="text-xl font-bold" style={{ color: BRAND.success }}>
              {fmtCurrency(annualResidual)}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
