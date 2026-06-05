'use client'

import { useState, useEffect } from 'react'
import {
  Users, TrendingUp, TrendingDown, Zap,
  DollarSign, AlertTriangle, ArrowUpRight, ArrowDownRight, Minus, ShieldAlert,
} from 'lucide-react'

// ── Brand tokens (AYC palette) ───────────────────────────────────────────────
const B = {
  card:        '#282626',
  cardAlt:     '#282626',
  cyan:        '#90c4cf',
  cyanBright:  '#90c4cf',
  cyanDeep:    '#4A9B7F',
  text:        'rgba(255,255,255,0.85)',
  muted:       'rgba(255,255,255,0.3)',
  border:      'rgba(144,196,207,0.15)',
  success:     '#6EE7B7',
  warn:        '#FCD34D',
  danger:      '#E8504A',
} as const

// ── Mock data (static — no API call needed) ──────────────────────────────────
const MOCK = {
  totalVolume:       48_320_450,
  volumePrevMonth:   41_870_200,
  activeMerchants:   214,
  newMerchantsMonth: 11,
  newActivations:    18,
  activationsPrev:   14,
  avgMonthlyVolume:  225_795,
  avgPrev:           209_487,
  residualRevenue:   193_282,
  residualPrev:      175_610,
  chargebackRate:    0.38,   // percent
  chargebackPrev:    0.44,
  // Portfolio risk score: weighted avg of MCC risk levels (1=low→4=very-high)
  portfolioRiskScore: 1.72,
  portfolioRiskPrev:  1.68,
}

function pctChange(current: number, previous: number): number {
  if (previous === 0) return 0
  return ((current - previous) / previous) * 100
}

function fmtCurrency(n: number) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`
  if (n >= 1_000)     return `$${(n / 1_000).toFixed(1)}K`
  return `$${n.toLocaleString('en-US')}`
}

function TrendBadge({ change, inverse = false }: { change: number; inverse?: boolean }) {
  const positive = inverse ? change < 0 : change > 0
  const neutral  = Math.abs(change) < 0.1

  const color = neutral
    ? B.muted
    : positive ? B.success : B.danger

  const bg = neutral
    ? 'rgba(126,135,148,0.12)'
    : positive ? 'rgba(61,214,140,0.12)' : 'rgba(232,80,74,0.12)'

  const Icon = neutral ? Minus : positive ? ArrowUpRight : ArrowDownRight

  return (
    <span
      className="inline-flex items-center gap-0.5 text-[10px] font-bold px-2 py-0.5 rounded-full"
      style={{ color, backgroundColor: bg }}
    >
      <Icon size={10} />
      {neutral ? 'flat' : `${Math.abs(change).toFixed(1)}%`}
    </span>
  )
}

type CardDef = {
  label:       string
  sub:         string
  value:       string
  badge:       React.ReactNode
  icon:        React.ElementType
  accent:      string
  bg:          string
  footer?:     string
  footerColor?: string
}

function buildCards(): CardDef[] {
  const volChange   = pctChange(MOCK.totalVolume,        MOCK.volumePrevMonth)
  const actChange   = pctChange(MOCK.newActivations,     MOCK.activationsPrev)
  const avgChange   = pctChange(MOCK.avgMonthlyVolume,   MOCK.avgPrev)
  const resChange   = pctChange(MOCK.residualRevenue,    MOCK.residualPrev)
  const cbChange    = pctChange(MOCK.chargebackRate,     MOCK.chargebackPrev)
  const riskChange  = pctChange(MOCK.portfolioRiskScore, MOCK.portfolioRiskPrev)

  // Chargeback color tier
  const cbColor = MOCK.chargebackRate < 0.5 ? B.success
                : MOCK.chargebackRate < 1.0 ? B.warn
                : B.danger
  const cbBg    = MOCK.chargebackRate < 0.5 ? 'rgba(61,214,140,0.08)'
                : MOCK.chargebackRate < 1.0 ? 'rgba(240,178,62,0.08)'
                : 'rgba(232,80,74,0.08)'

  return [
    {
      label:  'Total Processing Volume',
      sub:    'Month to date',
      value:  fmtCurrency(MOCK.totalVolume),
      badge:  <TrendBadge change={volChange} />,
      icon:   DollarSign,
      accent: B.cyan,
      bg:     'rgba(144,196,207,0.08)',
      footer: `vs $${(MOCK.volumePrevMonth / 1_000_000).toFixed(2)}M last month`,
      footerColor: 'rgba(255,255,255,0.3)',
    },
    {
      label:  'Active Merchants',
      sub:    'Live accounts',
      value:  MOCK.activeMerchants.toLocaleString(),
      badge:  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                style={{ color: B.cyanBright, backgroundColor: 'rgba(144,196,207,0.12)' }}>
                +{MOCK.newMerchantsMonth} this month
              </span>,
      icon:   Users,
      accent: B.cyanBright,
      bg:     'rgba(144,196,207,0.08)',
      footer: 'Card Present · eComm · MOTO',
      footerColor: 'rgba(255,255,255,0.3)',
    },
    {
      label:  'New Activations',
      sub:    'Merchants activated this month',
      value:  MOCK.newActivations.toLocaleString(),
      badge:  <TrendBadge change={actChange} />,
      icon:   Zap,
      accent: B.success,
      bg:     'rgba(61,214,140,0.08)',
      footer: `${MOCK.activationsPrev} prior month`,
      footerColor: 'rgba(255,255,255,0.3)',
    },
    {
      label:  'Avg Monthly Volume',
      sub:    'Per active merchant',
      value:  fmtCurrency(MOCK.avgMonthlyVolume),
      badge:  <TrendBadge change={avgChange} />,
      icon:   TrendingUp,
      accent: B.cyanDeep,
      bg:     'rgba(74,155,127,0.10)',
      footer: `${fmtCurrency(MOCK.avgPrev)} prior month`,
      footerColor: 'rgba(255,255,255,0.3)',
    },
    {
      label:  'Residual Revenue',
      sub:    'Month total (net)',
      value:  fmtCurrency(MOCK.residualRevenue),
      badge:  <TrendBadge change={resChange} />,
      icon:   TrendingUp,
      accent: B.success,
      bg:     'rgba(61,214,140,0.08)',
      footer: `${fmtCurrency(MOCK.residualPrev)} prior month`,
      footerColor: 'rgba(255,255,255,0.3)',
    },
    {
      label:  'Chargeback Rate',
      sub:    'All account types, MTD',
      value:  `${MOCK.chargebackRate.toFixed(2)}%`,
      badge:  <TrendBadge change={cbChange} inverse />,
      icon:   MOCK.chargebackRate >= 1 ? AlertTriangle : MOCK.chargebackRate >= 0.5 ? AlertTriangle : TrendingDown,
      accent: cbColor,
      bg:     cbBg,
      footer: MOCK.chargebackRate < 0.5 ? 'Within threshold (<0.5%)'
            : MOCK.chargebackRate < 1.0 ? 'Approaching threshold'
            : 'ABOVE THRESHOLD — action required',
      footerColor: cbColor,
    },
    {
      label:  'Portfolio Risk Score',
      sub:    'Weighted MCC concentration',
      value:  `${MOCK.portfolioRiskScore.toFixed(2)} / 4.0`,
      badge:  <TrendBadge change={riskChange} inverse />,
      icon:   ShieldAlert,
      accent: MOCK.portfolioRiskScore >= 2.5 ? B.danger : MOCK.portfolioRiskScore >= 1.8 ? B.warn : B.success,
      bg:     MOCK.portfolioRiskScore >= 2.5 ? 'rgba(232,80,74,0.08)'
            : MOCK.portfolioRiskScore >= 1.8 ? 'rgba(240,178,62,0.08)'
            : 'rgba(61,214,140,0.08)',
      footer: MOCK.portfolioRiskScore < 1.8 ? 'Low risk concentration'
            : MOCK.portfolioRiskScore < 2.5 ? 'Moderate — review MCC mix'
            : 'High concentration — action required',
      footerColor: MOCK.portfolioRiskScore >= 2.5 ? B.danger
                 : MOCK.portfolioRiskScore >= 1.8 ? B.warn
                 : B.success,
    },
  ]
}

export default function DashboardKPIs() {
  // Animate numbers in on mount
  const [ready, setReady] = useState(false)
  useEffect(() => { const t = setTimeout(() => setReady(true), 80); return () => clearTimeout(t) }, [])

  const cards = buildCards()

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-7 gap-4">
      {cards.map(card => {
        const Icon = card.icon
        return (
          <div
            key={card.label}
            className="rounded-xl p-5 flex flex-col justify-between transition-all hover:-translate-y-0.5 hover:shadow-lg"
            style={{
              backgroundColor: card.bg,
              border: `1px solid ${B.border}`,
              minHeight: 140,
            }}
          >
            {/* Top row */}
            <div className="flex items-start justify-between mb-3">
              <p
                className="text-[9px] font-bold uppercase tracking-[0.22em] leading-tight"
                style={{ color: card.accent, maxWidth: '80%' }}
              >
                {card.label}
              </p>
              <Icon size={13} style={{ color: card.accent, opacity: 0.75, flexShrink: 0 }} />
            </div>

            {/* Value */}
            <p
              className="text-2xl font-bold leading-none mb-2"
              style={{
                color: B.text,
                fontVariantNumeric: 'tabular-nums',
                opacity: ready ? 1 : 0,
                transition: 'opacity 0.3s ease',
              }}
            >
              {card.value}
            </p>

            {/* Badge */}
            <div className="mb-2">{card.badge}</div>

            {/* Footer */}
            {card.footer && (
              <p className="text-[10px] font-medium leading-tight mt-auto" style={{ color: card.footerColor }}>
                {card.footer}
              </p>
            )}
          </div>
        )
      })}
    </div>
  )
}
