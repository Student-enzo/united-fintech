'use client'

import { useState } from 'react'
import {
  TrendingDown, TrendingUp, AlertTriangle, Users,
  DollarSign, Clock, RefreshCw,
} from 'lucide-react'
import { useColors } from '@/lib/theme'
import { BRAND } from '@/lib/brand'

// ─── Types ────────────────────────────────────────────────────────────────────

type LeaveReason = 'competitor' | 'price' | 'service' | 'closed' | 'other'
type AtRiskReason = 'declining_volume' | 'support_tickets' | 'chargebacks' | 'no_review'
type VolumeTrend = 'up' | 'stable' | 'declining'

type LostMerchant = {
  id: string
  name: string
  mcc: string
  accountType: string
  monthlyVolume: number
  tenure: number
  reason: LeaveReason
  exitDate: string
  revenueImpact: number
}

type AtRiskMerchant = {
  id: string
  name: string
  mcc: string
  accountType: string
  monthlyVolume: number
  volumeTrend: VolumeTrend
  riskScore: number
  reasons: AtRiskReason[]
  lastReview: string
}

type MonthlyAttrition = {
  month: string
  lost: number
  revenueLost: number
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const LOST_MERCHANTS: LostMerchant[] = [
  { id: 'L1', name: 'Pacific Rim Restaurant',    mcc: '5812', accountType: 'Restaurant',  monthlyVolume: 88000,  tenure: 34, reason: 'competitor', exitDate: '2026-05-12', revenueImpact: 440  },
  { id: 'L2', name: 'Metro Dental Group',         mcc: '8021', accountType: 'Healthcare',  monthlyVolume: 210000, tenure: 58, reason: 'price',      exitDate: '2026-05-03', revenueImpact: 1050 },
  { id: 'L3', name: 'Sands Gift Shop',            mcc: '5947', accountType: 'Retail',      monthlyVolume: 32000,  tenure: 12, reason: 'service',    exitDate: '2026-04-28', revenueImpact: 160  },
  { id: 'L4', name: 'Velocity Fitness Club',      mcc: '7997', accountType: 'Services',    monthlyVolume: 67000,  tenure: 22, reason: 'competitor', exitDate: '2026-04-14', revenueImpact: 335  },
  { id: 'L5', name: 'Gulf Breeze Bait & Tackle',  mcc: '5941', accountType: 'Retail',      monthlyVolume: 19000,  tenure: 8,  reason: 'closed',     exitDate: '2026-04-01', revenueImpact: 95   },
  { id: 'L6', name: 'Luxe Auto Detailing',        mcc: '7542', accountType: 'Services',    monthlyVolume: 44000,  tenure: 17, reason: 'price',      exitDate: '2026-03-22', revenueImpact: 220  },
  { id: 'L7', name: 'Tide & Table Seafood',       mcc: '5812', accountType: 'Restaurant',  monthlyVolume: 103000, tenure: 41, reason: 'competitor', exitDate: '2026-03-05', revenueImpact: 515  },
  { id: 'L8', name: 'Garden Path Nursery',        mcc: '5261', accountType: 'Retail',      monthlyVolume: 28000,  tenure: 29, reason: 'other',      exitDate: '2026-02-18', revenueImpact: 140  },
]

const AT_RISK: AtRiskMerchant[] = [
  { id: 'R1', name: 'Horizon Apparel Co.',      mcc: '5699', accountType: 'Ecommerce',  monthlyVolume: 76000,  volumeTrend: 'declining', riskScore: 82, reasons: ['declining_volume', 'no_review'],           lastReview: '2025-10-01' },
  { id: 'R2', name: 'BlueTech Electronics',     mcc: '5734', accountType: 'Retail',     monthlyVolume: 145000, volumeTrend: 'declining', riskScore: 74, reasons: ['chargebacks', 'support_tickets'],          lastReview: '2025-12-15' },
  { id: 'R3', name: 'Shoreline Chiropractic',   mcc: '8041', accountType: 'Healthcare', monthlyVolume: 58000,  volumeTrend: 'stable',    riskScore: 61, reasons: ['support_tickets', 'no_review'],            lastReview: '2025-09-20' },
]

const MONTHLY_TREND: MonthlyAttrition[] = [
  { month: 'Jul',  lost: 1, revenueLost: 380  },
  { month: 'Aug',  lost: 0, revenueLost: 0    },
  { month: 'Sep',  lost: 2, revenueLost: 1120 },
  { month: 'Oct',  lost: 1, revenueLost: 440  },
  { month: 'Nov',  lost: 0, revenueLost: 0    },
  { month: 'Dec',  lost: 1, revenueLost: 260  },
  { month: 'Jan',  lost: 0, revenueLost: 0    },
  { month: 'Feb',  lost: 1, revenueLost: 140  },
  { month: 'Mar',  lost: 2, revenueLost: 655  },
  { month: 'Apr',  lost: 2, revenueLost: 590  },
  { month: 'May',  lost: 2, revenueLost: 1490 },
  { month: 'Jun',  lost: 0, revenueLost: 0    },
]

const REASONS = [
  { key: 'competitor', label: 'Competitor Offer', pct: 29, color: '#EF4444' },
  { key: 'price',      label: 'Price',            pct: 38, color: '#F97316' },
  { key: 'service',    label: 'Service Issues',   pct: 18, color: '#EAB308' },
  { key: 'closed',     label: 'Business Closed',  pct: 10, color: '#8B5CF6' },
  { key: 'other',      label: 'Other',            pct: 5,  color: '#6B7280' },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmtCur(n: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n)
}

function reasonColor(r: LeaveReason): string {
  const m: Record<LeaveReason, string> = {
    competitor: '#EF4444',
    price:      '#F97316',
    service:    '#EAB308',
    closed:     '#8B5CF6',
    other:      '#6B7280',
  }
  return m[r]
}

function reasonLabel(r: LeaveReason): string {
  const m: Record<LeaveReason, string> = {
    competitor: 'Competitor',
    price:      'Price',
    service:    'Service',
    closed:     'Closed',
    other:      'Other',
  }
  return m[r]
}

function atRiskReasonLabel(r: AtRiskReason): string {
  const m: Record<AtRiskReason, string> = {
    declining_volume: 'Volume Decline',
    support_tickets:  'Support Issues',
    chargebacks:      'Chargebacks',
    no_review:        'No Recent Review',
  }
  return m[r]
}

function riskScoreColor(score: number): string {
  if (score >= 80) return '#EF4444'
  if (score >= 65) return '#F59E0B'
  return '#22C55E'
}

// ─── Reason Donut (SVG) ───────────────────────────────────────────────────────

function ReasonDonut() {
  let cumAngle = -90
  const R = 55, cx = 70, cy = 70, stroke = 18

  const slices = REASONS.map(r => {
    const angle = (r.pct / 100) * 360
    const start = cumAngle
    cumAngle += angle
    const a1 = (start * Math.PI) / 180
    const a2 = ((start + angle) * Math.PI) / 180
    const x1 = cx + R * Math.cos(a1)
    const y1 = cy + R * Math.sin(a1)
    const x2 = cx + R * Math.cos(a2)
    const y2 = cy + R * Math.sin(a2)
    const large = angle > 180 ? 1 : 0
    return { ...r, d: `M ${x1} ${y1} A ${R} ${R} 0 ${large} 1 ${x2} ${y2}` }
  })

  return (
    <div className="flex flex-col md:flex-row items-start gap-5">
      <svg width={140} height={140} className="flex-shrink-0">
        {slices.map(s => (
          <path key={s.key} d={s.d} fill="none" stroke={s.color} strokeWidth={stroke} />
        ))}
        <circle cx={cx} cy={cy} r={R - stroke / 2 - 2} fill="#282626" />
        <text x={cx} y={cy - 5} textAnchor="middle" fill="rgba(255,255,255,0.85)" fontSize={14} fontWeight={700}>Why</text>
        <text x={cx} y={cy + 10} textAnchor="middle" fill="rgba(255,255,255,0.35)" fontSize={9}>they left</text>
      </svg>
      <div className="flex flex-col gap-2 flex-1 justify-center">
        {REASONS.map(r => (
          <div key={r.key} className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: r.color }} />
              <span className="text-xs" style={{ color: 'rgba(255,255,255,0.65)' }}>{r.label}</span>
            </div>
            <span className="text-xs font-bold" style={{ color: r.color }}>{r.pct}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Trend Line (CSS sparkline) ───────────────────────────────────────────────

function TrendChart() {
  const maxLost = Math.max(...MONTHLY_TREND.map(m => m.lost), 1)
  const maxRev  = Math.max(...MONTHLY_TREND.map(m => m.revenueLost), 1)
  const h = 80

  return (
    <div>
      <div className="flex items-end gap-1.5" style={{ height: h }}>
        {MONTHLY_TREND.map((m, i) => {
          const barH = (m.lost / maxLost) * h
          return (
            <div key={i} className="flex flex-col items-center flex-1 gap-0.5">
              <div className="w-full rounded-t-sm transition-all flex-shrink-0 relative group"
                style={{ height: barH || 2, backgroundColor: m.lost > 2 ? '#EF4444' : m.lost > 0 ? '#F59E0B' : 'rgba(255,255,255,0.06)' }}>
                {m.lost > 0 && (
                  <div className="absolute -top-5 left-1/2 -translate-x-1/2 hidden group-hover:block z-10">
                    <span className="text-[9px] font-bold whitespace-nowrap px-1 py-0.5 rounded"
                      style={{ backgroundColor: '#282626', color: 'rgba(255,255,255,0.85)', border: '1px solid rgba(144,196,207,0.2)' }}>
                      {m.lost} / {fmtCur(m.revenueLost)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
      <div className="flex gap-1.5 mt-1">
        {MONTHLY_TREND.map((m, i) => (
          <div key={i} className="flex-1 text-center">
            <span className="text-[9px]" style={{ color: 'rgba(255,255,255,0.3)' }}>{m.month}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Revenue Impact Calculator ────────────────────────────────────────────────

function RevenueCalculator({ monthlyRevenueLost }: { monthlyRevenueLost: number }) {
  const [retainPct, setRetainPct] = useState(25)
  const annualImpact = (monthlyRevenueLost * 12 * retainPct) / 100

  return (
    <div className="rounded-xl p-5" style={{ backgroundColor: 'rgba(144,196,207,0.06)', border: '1px solid rgba(144,196,207,0.18)' }}>
      <p className="text-sm font-bold mb-3" style={{ color: 'rgba(255,255,255,0.85)' }}>Revenue Impact Calculator</p>
      <div className="flex items-center gap-4 mb-3">
        <span className="text-xs" style={{ color: 'rgba(255,255,255,0.55)' }}>Retention improvement:</span>
        <input
          type="range" min={5} max={100} step={5} value={retainPct}
          onChange={e => setRetainPct(Number(e.target.value))}
          className="flex-1"
          style={{ accentColor: '#90c4cf' }}
        />
        <span className="text-sm font-bold w-10 text-right" style={{ color: '#90c4cf' }}>{retainPct}%</span>
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-xs" style={{ color: 'rgba(255,255,255,0.45)' }}>Projected annual recovery:</span>
        <span className="text-xl font-bold" style={{ color: '#90c4cf' }}>{fmtCur(annualImpact)}</span>
      </div>
      <p className="text-[10px] mt-1" style={{ color: 'rgba(255,255,255,0.3)' }}>
        Based on {fmtCur(monthlyRevenueLost)}/mo residual loss across all churned merchants
      </p>
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function AttritionTracker() {
  const colors = useColors()

  const card: React.CSSProperties = {
    backgroundColor: colors.card,
    border: `1px solid ${colors.border}`,
    borderRadius: 16,
  }

  const totalRevenueLostMonthly = LOST_MERCHANTS.reduce((s, m) => s + m.revenueImpact, 0)
  const lostMTD = LOST_MERCHANTS.filter(m => m.exitDate >= '2026-05-01').length
  const revenueLostMTD = LOST_MERCHANTS.filter(m => m.exitDate >= '2026-05-01').reduce((s, m) => s + m.revenueImpact, 0)
  const avgTenure = Math.round(LOST_MERCHANTS.reduce((s, m) => s + m.tenure, 0) / LOST_MERCHANTS.length)
  const attritionRate = ((LOST_MERCHANTS.length / 60) * 100).toFixed(1) // 60 = mock total portfolio

  const winBackCandidates = LOST_MERCHANTS.filter(m => {
    const exit = new Date(m.exitDate)
    const now  = new Date('2026-06-05')
    const daysDiff = (now.getTime() - exit.getTime()) / (1000 * 60 * 60 * 24)
    return daysDiff <= 90
  })

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold" style={{ color: colors.textPrimary }}>Attrition Tracker</h1>
        <p className="text-sm mt-0.5" style={{ color: colors.textMuted }}>
          Monitor portfolio churn, revenue leakage, and at-risk merchants
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          {
            label: 'Attrition Rate (6mo)',
            value: `${attritionRate}%`,
            sub: 'merchants lost vs. portfolio size',
            icon: TrendingDown,
            color: '#EF4444',
          },
          {
            label: 'Merchants Lost MTD',
            value: lostMTD.toString(),
            sub: 'May 2026',
            icon: Users,
            color: '#F59E0B',
          },
          {
            label: 'Revenue Lost MTD',
            value: fmtCur(revenueLostMTD),
            sub: 'monthly residual impact',
            icon: DollarSign,
            color: '#EF4444',
          },
          {
            label: 'Avg Tenure Lost',
            value: `${avgTenure}mo`,
            sub: 'of churned merchants',
            icon: Clock,
            color: '#90c4cf',
          },
        ].map(kpi => (
          <div key={kpi.label} className="p-4 rounded-xl" style={card}>
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs uppercase tracking-wide font-semibold" style={{ color: colors.textMuted }}>{kpi.label}</p>
              <kpi.icon size={14} style={{ color: kpi.color }} />
            </div>
            <p className="text-2xl font-bold" style={{ color: kpi.color }}>{kpi.value}</p>
            <p className="text-xs mt-1" style={{ color: colors.textMuted }}>{kpi.sub}</p>
          </div>
        ))}
      </div>

      {/* Trend + Donut row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="col-span-2 p-6 rounded-2xl" style={card}>
          <p className="text-[10px] font-bold tracking-[0.22em] uppercase mb-1" style={{ color: colors.textMuted }}>12 Months</p>
          <p className="text-base font-bold mb-4" style={{ color: colors.textPrimary }}>Monthly Attrition — Merchants Lost</p>
          <TrendChart />
          <div className="flex items-center gap-4 mt-3">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-2 rounded-sm" style={{ backgroundColor: '#EF4444' }} />
              <span className="text-[10px]" style={{ color: 'rgba(255,255,255,0.45)' }}>{'>'} 2 lost</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-2 rounded-sm" style={{ backgroundColor: '#F59E0B' }} />
              <span className="text-[10px]" style={{ color: 'rgba(255,255,255,0.45)' }}>1-2 lost</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-2 rounded-sm" style={{ backgroundColor: 'rgba(255,255,255,0.06)' }} />
              <span className="text-[10px]" style={{ color: 'rgba(255,255,255,0.45)' }}>None lost</span>
            </div>
            <div className="ml-auto text-right">
              <p className="text-xs font-semibold" style={{ color: '#EF4444' }}>{fmtCur(totalRevenueLostMonthly)}/mo</p>
              <p className="text-[10px]" style={{ color: 'rgba(255,255,255,0.3)' }}>total residual lost</p>
            </div>
          </div>
        </div>
        <div className="p-6 rounded-2xl" style={card}>
          <p className="text-[10px] font-bold tracking-[0.22em] uppercase mb-1" style={{ color: colors.textMuted }}>Analysis</p>
          <p className="text-base font-bold mb-4" style={{ color: colors.textPrimary }}>Why They Left</p>
          <ReasonDonut />
        </div>
      </div>

      {/* Lost Merchants Table */}
      <div className="mb-2">
        <h2 className="text-lg font-bold mb-1" style={{ color: colors.textPrimary }}>Lost Merchants</h2>
        <p className="text-sm mb-4" style={{ color: colors.textMuted }}>Last 6 months — sorted by exit date</p>
      </div>

      <div className="rounded-2xl overflow-hidden mb-8" style={card}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ backgroundColor: colors.tableHead, borderBottom: `1px solid ${colors.borderAccent}` }}>
                {['Merchant', 'MCC', 'Type', 'Monthly Vol.', 'Tenure', 'Reason', 'Exit Date', 'Rev. Impact/mo'].map((h, i) => (
                  <th key={i}
                    className={`${i >= 3 ? 'text-right' : 'text-left'} px-4 py-3 text-xs font-semibold uppercase tracking-wide whitespace-nowrap`}
                    style={{ color: colors.textMuted }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {LOST_MERCHANTS.map((m, idx) => (
                <tr
                  key={m.id}
                  className="transition-colors"
                  style={{ borderBottom: idx < LOST_MERCHANTS.length - 1 ? `1px solid ${colors.tableBorder}` : 'none' }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.backgroundColor = colors.rowHover}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'}
                >
                  <td className="px-4 py-3 text-sm font-medium" style={{ color: colors.textPrimary }}>{m.name}</td>
                  <td className="px-4 py-3 text-xs font-mono" style={{ color: colors.textSecondary }}>{m.mcc}</td>
                  <td className="px-4 py-3">
                    <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: colors.pillBg, color: '#90c4cf' }}>
                      {m.accountType}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-right" style={{ color: colors.textSecondary }}>{fmtCur(m.monthlyVolume)}</td>
                  <td className="px-4 py-3 text-sm text-right" style={{ color: colors.textSecondary }}>{m.tenure}mo</td>
                  <td className="px-4 py-3 text-right">
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full"
                      style={{ backgroundColor: `${reasonColor(m.reason)}15`, color: reasonColor(m.reason) }}>
                      {reasonLabel(m.reason)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-right" style={{ color: colors.textMuted }}>{m.exitDate}</td>
                  <td className="px-4 py-3 text-sm text-right font-bold" style={{ color: '#EF4444' }}>-{fmtCur(m.revenueImpact)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr style={{ borderTop: `1px solid ${colors.border}`, backgroundColor: colors.tableHead }}>
                <td colSpan={7} className="px-4 py-3 text-sm font-semibold" style={{ color: colors.textSecondary }}>
                  Total ({LOST_MERCHANTS.length} merchants)
                </td>
                <td className="px-4 py-3 text-right text-sm font-bold" style={{ color: '#EF4444' }}>
                  -{fmtCur(totalRevenueLostMonthly)}/mo
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* At-Risk Merchants */}
      <div className="mb-2">
        <h2 className="text-lg font-bold mb-1" style={{ color: colors.textPrimary }}>At-Risk Merchants</h2>
        <p className="text-sm mb-4" style={{ color: colors.textMuted }}>
          Flagged by declining volume, support issues, or overdue review — act before they churn
        </p>
      </div>

      <div className="flex flex-col gap-3 mb-8">
        {AT_RISK.map(m => (
          <div key={m.id} className="p-5 rounded-xl" style={{ ...card, borderColor: m.riskScore >= 80 ? 'rgba(239,68,68,0.35)' : colors.border }}>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <AlertTriangle size={15} style={{ color: riskScoreColor(m.riskScore) }} />
                  <span className="text-sm font-bold" style={{ color: colors.textPrimary }}>{m.name}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full font-semibold"
                    style={{ backgroundColor: `${riskScoreColor(m.riskScore)}18`, color: riskScoreColor(m.riskScore) }}>
                    Risk {m.riskScore}/100
                  </span>
                </div>
                <div className="flex flex-wrap gap-x-6 gap-y-1 text-xs mb-2" style={{ color: colors.textMuted }}>
                  <span>MCC: <strong style={{ color: colors.textSecondary }}>{m.mcc}</strong></span>
                  <span>Type: <strong style={{ color: colors.textSecondary }}>{m.accountType}</strong></span>
                  <span>Volume: <strong style={{ color: colors.textSecondary }}>{fmtCur(m.monthlyVolume)}/mo</strong></span>
                  <span>Last Review: <strong style={{ color: colors.textSecondary }}>{m.lastReview}</strong></span>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  {m.reasons.map(r => (
                    <span key={r} className="text-[10px] px-2 py-0.5 rounded-full"
                      style={{ backgroundColor: 'rgba(245,158,11,0.12)', color: '#F59E0B' }}>
                      {atRiskReasonLabel(r)}
                    </span>
                  ))}
                  {m.volumeTrend === 'declining' && (
                    <span className="flex items-center gap-1 text-[10px]" style={{ color: '#EF4444' }}>
                      <TrendingDown size={11} /> Volume declining
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  className="text-xs px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer"
                  style={{ backgroundColor: 'rgba(144,196,207,0.12)', color: '#90c4cf', border: '1px solid rgba(144,196,207,0.25)' }}>
                  Schedule Review
                </button>
                <button
                  className="text-xs px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer"
                  style={{ backgroundColor: 'rgba(245,158,11,0.12)', color: '#F59E0B', border: '1px solid rgba(245,158,11,0.25)' }}>
                  Flag for Follow-up
                </button>
              </div>
            </div>
            {/* Risk score bar */}
            <div className="mt-3">
              <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: 'rgba(255,255,255,0.06)' }}>
                <div className="h-full rounded-full transition-all"
                  style={{ width: `${m.riskScore}%`, backgroundColor: riskScoreColor(m.riskScore) }} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Win-Back Opportunities */}
      {winBackCandidates.length > 0 && (
        <>
          <div className="mb-2">
            <h2 className="text-lg font-bold mb-1" style={{ color: colors.textPrimary }}>Win-Back Opportunities</h2>
            <p className="text-sm mb-4" style={{ color: colors.textMuted }}>
              Merchants who left within 90 days — re-engagement window still open
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {winBackCandidates.map(m => {
              const exit     = new Date(m.exitDate)
              const now      = new Date('2026-06-05')
              const daysSince = Math.floor((now.getTime() - exit.getTime()) / (1000 * 60 * 60 * 24))
              const daysLeft  = 90 - daysSince
              return (
                <div key={m.id} className="p-4 rounded-xl flex items-start justify-between gap-3"
                  style={{ ...card, borderColor: 'rgba(74,155,127,0.3)' }}>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <RefreshCw size={13} style={{ color: '#4A9B7F' }} />
                      <span className="text-sm font-bold" style={{ color: colors.textPrimary }}>{m.name}</span>
                    </div>
                    <p className="text-xs mb-1" style={{ color: colors.textMuted }}>
                      Left: <strong style={{ color: colors.textSecondary }}>{m.exitDate}</strong>
                      {' · '}Reason: <strong style={{ color: reasonColor(m.reason) }}>{reasonLabel(m.reason)}</strong>
                    </p>
                    <p className="text-xs" style={{ color: '#4A9B7F' }}>
                      {daysLeft} days left to re-engage · {fmtCur(m.revenueImpact)}/mo at stake
                    </p>
                  </div>
                  <button
                    className="text-xs px-3 py-1.5 rounded-lg font-semibold flex-shrink-0 cursor-pointer"
                    style={{ backgroundColor: 'rgba(74,155,127,0.15)', color: '#4A9B7F', border: '1px solid rgba(74,155,127,0.3)' }}>
                    Contact
                  </button>
                </div>
              )
            })}
          </div>
        </>
      )}

      {/* Revenue Impact Calculator */}
      <RevenueCalculator monthlyRevenueLost={totalRevenueLostMonthly} />
    </div>
  )
}
