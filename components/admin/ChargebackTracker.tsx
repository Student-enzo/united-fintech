'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import {
  AlertTriangle, TrendingUp, TrendingDown, Minus,
  Upload, CheckCircle, XCircle, ArrowUpCircle, Clock,
} from 'lucide-react'
import { useColors } from '@/lib/theme'
import { BRAND } from '@/lib/brand'

// ─── Types ────────────────────────────────────────────────────────────────────

type RiskLevel = 'clean' | 'warning' | 'violation' | 'critical'
type Trend = 'up' | 'down' | 'flat'
type DisputeStatus = 'open' | 'responded' | 'won' | 'lost'

type Merchant = {
  id: string
  name: string
  accountType: 'retail' | 'ecommerce' | 'restaurant' | 'healthcare' | 'services'
  mcc: string
  monthlyVolume: number
  totalTransactions: number
  chargebacks: number
  chargebackAmount: number
  ratio: number
  trend: Trend
  riskLevel: RiskLevel
  lastUpdated: string
}

type Dispute = {
  id: string
  merchantId: string
  merchantName: string
  txDate: string
  amount: number
  reasonCode: string
  reasonLabel: string
  daysUntilDeadline: number
  responseBy: string
  status: DisputeStatus
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const MERCHANTS: Merchant[] = [
  { id: '1', name: 'NovaMed Health Clinic',     accountType: 'healthcare', mcc: '8099', monthlyVolume: 320000, totalTransactions: 1240, chargebacks: 19, chargebackAmount: 4750, ratio: 1.53, trend: 'up',   riskLevel: 'critical',  lastUpdated: '2026-06-04' },
  { id: '2', name: 'Coastal Electronics Hub',    accountType: 'ecommerce',  mcc: '5734', monthlyVolume: 185000, totalTransactions: 880,  chargebacks: 11, chargebackAmount: 2310, ratio: 1.25, trend: 'up',   riskLevel: 'violation', lastUpdated: '2026-06-04' },
  { id: '3', name: 'Beachside Grille & Bar',     accountType: 'restaurant', mcc: '5812', monthlyVolume: 97000,  totalTransactions: 2100, chargebacks: 15, chargebackAmount: 895,  ratio: 0.71, trend: 'flat', riskLevel: 'warning',  lastUpdated: '2026-06-03' },
  { id: '4', name: 'Coral Bay Boutique',         accountType: 'retail',     mcc: '5621', monthlyVolume: 62000,  totalTransactions: 540,  chargebacks:  3, chargebackAmount: 640,  ratio: 0.56, trend: 'up',   riskLevel: 'warning',  lastUpdated: '2026-06-03' },
  { id: '5', name: 'SkyLine Travel Agency',      accountType: 'services',   mcc: '4722', monthlyVolume: 430000, totalTransactions: 310,  chargebacks:  3, chargebackAmount: 8100, ratio: 0.97, trend: 'down', riskLevel: 'warning',  lastUpdated: '2026-06-04' },
  { id: '6', name: 'Harbor Point Marina',        accountType: 'services',   mcc: '5551', monthlyVolume: 78000,  totalTransactions: 420,  chargebacks:  1, chargebackAmount: 480,  ratio: 0.24, trend: 'down', riskLevel: 'clean',    lastUpdated: '2026-06-01' },
  { id: '7', name: 'Sunrise Wellness Spa',       accountType: 'services',   mcc: '7299', monthlyVolume: 41000,  totalTransactions: 630,  chargebacks:  1, chargebackAmount: 195,  ratio: 0.16, trend: 'flat', riskLevel: 'clean',    lastUpdated: '2026-05-31' },
  { id: '8', name: 'Blue Ocean Auto Parts',      accountType: 'retail',     mcc: '5533', monthlyVolume: 114000, totalTransactions: 890,  chargebacks:  3, chargebackAmount: 720,  ratio: 0.34, trend: 'down', riskLevel: 'clean',    lastUpdated: '2026-06-02' },
  { id: '9', name: 'Pinnacle Gym & Fitness',     accountType: 'services',   mcc: '7997', monthlyVolume: 55000,  totalTransactions: 1100, chargebacks:  2, chargebackAmount: 290,  ratio: 0.18, trend: 'flat', riskLevel: 'clean',    lastUpdated: '2026-06-01' },
  { id: '10', name: 'Urban Threads Apparel',     accountType: 'ecommerce',  mcc: '5699', monthlyVolume: 88000,  totalTransactions: 760,  chargebacks:  3, chargebackAmount: 510,  ratio: 0.39, trend: 'down', riskLevel: 'clean',    lastUpdated: '2026-06-03' },
]

const DISPUTES: Dispute[] = [
  { id: 'D1', merchantId: '1', merchantName: 'NovaMed Health Clinic',   txDate: '2026-05-10', amount: 420.00, reasonCode: '4853', reasonLabel: 'Cardholder Dispute',         daysUntilDeadline: 4,  responseBy: '2026-06-09', status: 'open' },
  { id: 'D2', merchantId: '2', merchantName: 'Coastal Electronics Hub', txDate: '2026-05-18', amount: 899.99, reasonCode: '4855', reasonLabel: 'Non-receipt of Merchandise',  daysUntilDeadline: 9,  responseBy: '2026-06-14', status: 'open' },
  { id: 'D3', merchantId: '3', merchantName: 'Beachside Grille & Bar',  txDate: '2026-05-22', amount: 127.50, reasonCode: '4841', reasonLabel: 'Cancelled Transaction',       daysUntilDeadline: 12, responseBy: '2026-06-17', status: 'responded' },
  { id: 'D4', merchantId: '1', merchantName: 'NovaMed Health Clinic',   txDate: '2026-05-02', amount: 310.00, reasonCode: '4837', reasonLabel: 'No Cardholder Authorization', daysUntilDeadline: 2,  responseBy: '2026-06-07', status: 'open' },
  { id: 'D5', merchantId: '5', merchantName: 'SkyLine Travel Agency',   txDate: '2026-04-28', amount: 2150.00, reasonCode: '4853', reasonLabel: 'Cardholder Dispute',        daysUntilDeadline: 18, responseBy: '2026-06-23', status: 'open' },
]

const REASON_CODES = [
  { code: '4853', label: 'Cardholder Dispute',          count: 28, color: '#EF4444' },
  { code: '4855', label: 'Non-receipt of Merchandise',  count: 18, color: '#F97316' },
  { code: '4837', label: 'No Authorization',            count: 12, color: '#EAB308' },
  { code: '4841', label: 'Cancelled Transaction',       count: 8,  color: '#8B5CF6' },
  { code: '4831', label: 'Incorrect Amount',            count: 5,  color: '#90c4cf' },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmtCur(n: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n)
}

function riskColor(level: RiskLevel): string {
  if (level === 'critical')  return '#991B1B'
  if (level === 'violation') return '#EF4444'
  if (level === 'warning')   return '#F59E0B'
  return '#22C55E'
}

function riskBg(level: RiskLevel): string {
  if (level === 'critical')  return 'rgba(153,27,27,0.18)'
  if (level === 'violation') return 'rgba(239,68,68,0.12)'
  if (level === 'warning')   return 'rgba(245,158,11,0.12)'
  return 'rgba(34,197,94,0.10)'
}

function riskLabel(level: RiskLevel): string {
  if (level === 'critical')  return 'Critical'
  if (level === 'violation') return 'Violation'
  if (level === 'warning')   return 'Warning'
  return 'Clean'
}

function TrendIcon({ trend }: { trend: Trend }) {
  if (trend === 'up')   return <TrendingUp  size={14} style={{ color: '#EF4444' }} />
  if (trend === 'down') return <TrendingDown size={14} style={{ color: '#22C55E' }} />
  return <Minus size={14} style={{ color: '#6B7280' }} />
}

function statusColor(s: DisputeStatus) {
  if (s === 'open')      return '#EF4444'
  if (s === 'responded') return '#F59E0B'
  if (s === 'won')       return '#22C55E'
  return '#6B7280'
}
function statusLabel(s: DisputeStatus) {
  if (s === 'open')      return 'Open'
  if (s === 'responded') return 'Responded'
  if (s === 'won')       return 'Won'
  return 'Lost'
}

// ─── Donut Chart (pure CSS/SVG) ───────────────────────────────────────────────

function ReasonDonut() {
  const total = REASON_CODES.reduce((s, r) => s + r.count, 0)
  let cumAngle = -90
  const R = 60, cx = 80, cy = 80, stroke = 20

  const slices = REASON_CODES.map(r => {
    const angle = (r.count / total) * 360
    const start = cumAngle
    cumAngle += angle
    const a1 = (start * Math.PI) / 180
    const a2 = ((start + angle) * Math.PI) / 180
    const x1 = cx + R * Math.cos(a1)
    const y1 = cy + R * Math.sin(a1)
    const x2 = cx + R * Math.cos(a2)
    const y2 = cy + R * Math.sin(a2)
    const large = angle > 180 ? 1 : 0
    return { ...r, d: `M ${x1} ${y1} A ${R} ${R} 0 ${large} 1 ${x2} ${y2}`, angle }
  })

  return (
    <div className="flex flex-col md:flex-row items-start gap-5">
      <svg width={160} height={160} className="flex-shrink-0">
        {slices.map(s => (
          <path
            key={s.code}
            d={`${s.d}`}
            fill="none"
            stroke={s.color}
            strokeWidth={stroke}
          />
        ))}
        <circle cx={cx} cy={cy} r={R - stroke / 2 - 2} fill="#282626" />
        <text x={cx} y={cy - 6} textAnchor="middle" fill="rgba(255,255,255,0.85)" fontSize={16} fontWeight={700}>{total}</text>
        <text x={cx} y={cy + 10} textAnchor="middle" fill="rgba(255,255,255,0.35)" fontSize={9}>disputes</text>
      </svg>
      <div className="flex flex-col gap-2 flex-1">
        {REASON_CODES.map(r => (
          <div key={r.code} className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: r.color }} />
              <span className="text-xs" style={{ color: 'rgba(255,255,255,0.65)' }}>{r.code} — {r.label}</span>
            </div>
            <span className="text-xs font-bold" style={{ color: r.color }}>{r.count}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Ratio Bar Chart (CSS) ────────────────────────────────────────────────────

function RatioChart({ data }: { data: Merchant[] }) {
  const max = 2.0
  const thresholds = [
    { pct: (0.5 / max) * 100, label: '0.5%', color: '#F59E0B' },
    { pct: (1.0 / max) * 100, label: '1.0%', color: '#EF4444' },
    { pct: (1.5 / max) * 100, label: '1.5%', color: '#991B1B' },
  ]

  return (
    <div className="relative">
      {/* Threshold lines */}
      <div className="relative" style={{ height: data.length * 44 + 28 }}>
        {thresholds.map(t => (
          <div key={t.label} className="absolute top-0 bottom-6 pointer-events-none flex flex-col justify-between"
            style={{ left: `${t.pct}%`, zIndex: 2 }}>
            <div className="h-full w-px" style={{ backgroundColor: t.color, opacity: 0.6 }} />
            <span className="text-[9px] font-bold mt-0.5" style={{ color: t.color, marginLeft: -10 }}>{t.label}</span>
          </div>
        ))}
        {/* Bars */}
        <div className="flex flex-col gap-1.5 relative" style={{ zIndex: 1 }}>
          {data.map(m => {
            const barPct = Math.min((m.ratio / max) * 100, 100)
            return (
              <div key={m.id} className="flex items-center gap-3">
                <div className="flex-shrink-0 text-right" style={{ width: 150 }}>
                  <span className="text-xs truncate block" style={{ color: 'rgba(255,255,255,0.65)' }}>{m.name}</span>
                </div>
                <div className="flex-1 relative h-6 rounded-sm overflow-hidden" style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}>
                  <div className="h-full rounded-sm transition-all"
                    style={{ width: `${barPct}%`, backgroundColor: riskColor(m.riskLevel), opacity: 0.8 }} />
                  <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-bold" style={{ color: 'rgba(255,255,255,0.85)' }}>
                    {m.ratio.toFixed(2)}%
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

type Filter = 'all' | 'warning' | 'violation' | 'clean'

export default function ChargebackTracker() {
  const colors = useColors()
  const [filter, setFilter] = useState<Filter>('all')
  const [disputeActions, setDisputeActions] = useState<Record<string, DisputeStatus>>({})

  const card: React.CSSProperties = {
    backgroundColor: colors.card,
    border: `1px solid ${colors.border}`,
    borderRadius: 16,
  }

  const violators  = MERCHANTS.filter(m => m.riskLevel === 'violation' || m.riskLevel === 'critical')
  const warnings   = MERCHANTS.filter(m => m.riskLevel === 'warning')
  const weightedAvg = MERCHANTS.reduce((s, m) => s + m.ratio * m.monthlyVolume, 0) /
                      MERCHANTS.reduce((s, m) => s + m.monthlyVolume, 0)
  const resolvedThisMonth = 7

  const filtered = filter === 'all'
    ? MERCHANTS
    : filter === 'violation'
      ? MERCHANTS.filter(m => m.riskLevel === 'violation' || m.riskLevel === 'critical')
      : filter === 'warning'
        ? MERCHANTS.filter(m => m.riskLevel === 'warning')
        : MERCHANTS.filter(m => m.riskLevel === 'clean')

  function updateDisputeStatus(id: string, status: DisputeStatus) {
    setDisputeActions(prev => ({ ...prev, [id]: status }))
  }

  const FILTERS: { key: Filter; label: string }[] = [
    { key: 'all',       label: 'All Merchants' },
    { key: 'violation', label: 'Violation'      },
    { key: 'warning',   label: 'Warning'        },
    { key: 'clean',     label: 'Clean'          },
  ]

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold" style={{ color: colors.textPrimary }}>Chargeback Tracker</h1>
        <p className="text-sm mt-0.5" style={{ color: colors.textMuted }}>
          Visa VAMP compliance — monitor merchant chargeback ratios against regulatory thresholds
        </p>
      </div>

      {/* Alert Banner */}
      {violators.length > 0 && (
        <div className="mb-6 flex items-start gap-3 px-5 py-4 rounded-xl"
          style={{ backgroundColor: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.35)' }}>
          <AlertTriangle size={18} className="flex-shrink-0 mt-0.5" style={{ color: '#EF4444' }} />
          <div>
            <p className="text-sm font-bold" style={{ color: '#EF4444' }}>
              {violators.length} merchant{violators.length > 1 ? 's' : ''} above Visa VAMP threshold (1.0%)
            </p>
            <p className="text-xs mt-0.5" style={{ color: 'rgba(239,68,68,0.75)' }}>
              {violators.map(m => m.name).join(' · ')} — immediate review required to avoid processor termination
            </p>
          </div>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          {
            label: 'Portfolio Chargeback Rate',
            value: `${weightedAvg.toFixed(2)}%`,
            sub: 'weighted avg across all merchants',
            color: weightedAvg > 1.0 ? '#EF4444' : weightedAvg > 0.5 ? '#F59E0B' : '#22C55E',
          },
          {
            label: 'In Warning Zone',
            value: warnings.length.toString(),
            sub: '0.5% – 1.0% ratio',
            color: '#F59E0B',
          },
          {
            label: 'In Violation',
            value: violators.length.toString(),
            sub: 'above 1.0% — action required',
            color: '#EF4444',
          },
          {
            label: 'Disputes Resolved',
            value: resolvedThisMonth.toString(),
            sub: 'this month',
            color: '#90c4cf',
          },
        ].map(kpi => (
          <div key={kpi.label} className="p-4 rounded-xl" style={card}>
            <p className="text-xs uppercase tracking-wide font-semibold mb-2" style={{ color: colors.textMuted }}>{kpi.label}</p>
            <p className="text-2xl font-bold" style={{ color: kpi.color }}>{kpi.value}</p>
            <p className="text-xs mt-1" style={{ color: colors.textMuted }}>{kpi.sub}</p>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="col-span-2 p-6 rounded-2xl" style={card}>
          <p className="text-[10px] font-bold tracking-[0.22em] uppercase mb-1" style={{ color: colors.textMuted }}>Visa VAMP</p>
          <p className="text-base font-bold mb-4" style={{ color: colors.textPrimary }}>Chargeback Ratio by Merchant</p>
          <div className="flex items-center gap-4 mb-4">
            {[
              { label: '0.5% Warning', color: '#F59E0B' },
              { label: '1.0% Visa Threshold', color: '#EF4444' },
              { label: '1.5% Mastercard', color: '#991B1B' },
            ].map(t => (
              <div key={t.label} className="flex items-center gap-1.5">
                <span className="w-3 h-0.5 flex-shrink-0 rounded" style={{ backgroundColor: t.color }} />
                <span className="text-[10px]" style={{ color: 'rgba(255,255,255,0.45)' }}>{t.label}</span>
              </div>
            ))}
          </div>
          <RatioChart data={MERCHANTS} />
        </div>
        <div className="p-6 rounded-2xl" style={card}>
          <p className="text-[10px] font-bold tracking-[0.22em] uppercase mb-1" style={{ color: colors.textMuted }}>Breakdown</p>
          <p className="text-base font-bold mb-4" style={{ color: colors.textPrimary }}>Reason Codes</p>
          <ReasonDonut />
        </div>
      </div>

      {/* Filter bar */}
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        {FILTERS.map(f => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className="text-xs px-3 py-1.5 rounded-full font-semibold transition-colors cursor-pointer"
            style={filter === f.key
              ? { backgroundColor: '#90c4cf', color: '#1c1c1c' }
              : { backgroundColor: colors.card, border: `1px solid ${colors.border}`, color: colors.textSecondary }
            }
          >
            {f.label}
            {f.key !== 'all' && (
              <span className="ml-1.5 opacity-70">
                ({f.key === 'violation' ? violators.length : f.key === 'warning' ? warnings.length : MERCHANTS.filter(m => m.riskLevel === 'clean').length})
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Merchant Table */}
      <div className="rounded-2xl overflow-hidden mb-8" style={card}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ backgroundColor: colors.tableHead, borderBottom: `1px solid ${colors.borderAccent}` }}>
                {['Merchant', 'Type', 'MCC', 'Monthly Vol.', 'Transactions', 'Chargebacks', 'CB Amount', 'Ratio %', 'Trend', 'Risk', 'Last Updated'].map((h, i) => (
                  <th key={i} className={`${i >= 3 ? 'text-right' : 'text-left'} px-4 py-3 text-xs font-semibold uppercase tracking-wide whitespace-nowrap`}
                    style={{ color: colors.textMuted }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((m, idx) => (
                <tr
                  key={m.id}
                  className="transition-colors"
                  style={{ borderBottom: idx < filtered.length - 1 ? `1px solid ${colors.tableBorder}` : 'none' }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.backgroundColor = colors.rowHover}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'}
                >
                  <td className="px-4 py-3">
                    <span className="text-sm font-medium" style={{ color: colors.textPrimary }}>{m.name}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs px-2 py-0.5 rounded-full capitalize" style={{ backgroundColor: colors.pillBg, color: '#90c4cf' }}>
                      {m.accountType}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs font-mono" style={{ color: colors.textSecondary }}>{m.mcc}</td>
                  <td className="px-4 py-3 text-sm text-right" style={{ color: colors.textSecondary }}>{fmtCur(m.monthlyVolume)}</td>
                  <td className="px-4 py-3 text-sm text-right" style={{ color: colors.textSecondary }}>{m.totalTransactions.toLocaleString()}</td>
                  <td className="px-4 py-3 text-sm text-right font-semibold" style={{ color: m.chargebacks > 10 ? '#EF4444' : colors.textSecondary }}>
                    {m.chargebacks}
                  </td>
                  <td className="px-4 py-3 text-sm text-right" style={{ color: colors.textSecondary }}>{fmtCur(m.chargebackAmount)}</td>
                  <td className="px-4 py-3 text-right">
                    <span className="text-sm font-bold" style={{ color: riskColor(m.riskLevel) }}>{m.ratio.toFixed(2)}%</span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <TrendIcon trend={m.trend} />
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full"
                      style={{ backgroundColor: riskBg(m.riskLevel), color: riskColor(m.riskLevel) }}>
                      {riskLabel(m.riskLevel)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs" style={{ color: colors.textMuted }}>{m.lastUpdated}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Dispute Queue */}
      <div className="mb-2">
        <h2 className="text-lg font-bold mb-1" style={{ color: colors.textPrimary }}>Dispute Queue</h2>
        <p className="text-sm mb-4" style={{ color: colors.textMuted }}>Open disputes requiring response — sorted by deadline urgency</p>
      </div>

      <div className="flex flex-col gap-3">
        {DISPUTES.map(d => {
          const currentStatus = disputeActions[d.id] ?? d.status
          const isUrgent = d.daysUntilDeadline <= 5
          return (
            <div key={d.id} className="p-5 rounded-xl" style={{ ...card, borderColor: isUrgent && currentStatus === 'open' ? 'rgba(239,68,68,0.35)' : colors.border }}>
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-sm font-bold" style={{ color: colors.textPrimary }}>{d.merchantName}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full font-semibold"
                      style={{ backgroundColor: `${statusColor(currentStatus)}18`, color: statusColor(currentStatus) }}>
                      {statusLabel(currentStatus)}
                    </span>
                    {isUrgent && currentStatus === 'open' && (
                      <span className="text-xs px-2 py-0.5 rounded-full font-bold"
                        style={{ backgroundColor: 'rgba(239,68,68,0.15)', color: '#EF4444' }}>
                        Urgent
                      </span>
                    )}
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-1 text-xs" style={{ color: colors.textMuted }}>
                    <span>Tx Date: <strong style={{ color: colors.textSecondary }}>{d.txDate}</strong></span>
                    <span>Amount: <strong style={{ color: colors.textSecondary }}>{fmtCur(d.amount)}</strong></span>
                    <span>Code: <strong style={{ color: '#F59E0B' }}>{d.reasonCode} — {d.reasonLabel}</strong></span>
                    <span>Respond by: <strong style={{ color: isUrgent ? '#EF4444' : colors.textSecondary }}>{d.responseBy}</strong></span>
                  </div>
                  <div className="mt-2 flex items-center gap-1.5">
                    <Clock size={12} style={{ color: isUrgent ? '#EF4444' : colors.textMuted }} />
                    <span className="text-xs" style={{ color: isUrgent ? '#EF4444' : colors.textMuted }}>
                      {d.daysUntilDeadline} day{d.daysUntilDeadline !== 1 ? 's' : ''} until deadline
                    </span>
                  </div>
                </div>
                {currentStatus === 'open' || currentStatus === 'responded' ? (
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => updateDisputeStatus(d.id, 'responded')}
                      disabled={currentStatus === 'responded'}
                      className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer disabled:opacity-40"
                      style={{ backgroundColor: 'rgba(144,196,207,0.12)', color: '#90c4cf', border: '1px solid rgba(144,196,207,0.25)' }}>
                      <Upload size={12} /> Upload Rebuttal
                    </button>
                    <button
                      onClick={() => updateDisputeStatus(d.id, 'won')}
                      className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer"
                      style={{ backgroundColor: 'rgba(34,197,94,0.12)', color: '#22C55E', border: '1px solid rgba(34,197,94,0.25)' }}>
                      <CheckCircle size={12} /> Mark Won
                    </button>
                    <button
                      onClick={() => updateDisputeStatus(d.id, 'lost')}
                      className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer"
                      style={{ backgroundColor: 'rgba(239,68,68,0.10)', color: '#EF4444', border: '1px solid rgba(239,68,68,0.25)' }}>
                      <XCircle size={12} /> Mark Lost
                    </button>
                    <button
                      onClick={() => updateDisputeStatus(d.id, 'responded')}
                      className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer"
                      style={{ backgroundColor: 'rgba(139,92,246,0.12)', color: '#8B5CF6', border: '1px solid rgba(139,92,246,0.25)' }}>
                      <ArrowUpCircle size={12} /> Escalate
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {currentStatus === 'won'
                      ? <CheckCircle size={18} style={{ color: '#22C55E' }} />
                      : <XCircle size={18} style={{ color: '#6B7280' }} />
                    }
                    <span className="text-sm font-semibold" style={{ color: currentStatus === 'won' ? '#22C55E' : '#6B7280' }}>
                      {statusLabel(currentStatus)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
