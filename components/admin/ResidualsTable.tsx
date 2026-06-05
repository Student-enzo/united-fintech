'use client'

import { useState, useMemo, useCallback } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import {
  Download, Search, X, TrendingUp, Clock, CheckCircle2, BarChart2, Upload,
} from 'lucide-react'
import { BRAND } from '@/lib/brand'
import { fmtCurrency, fmtDate, fmtPercent } from '@/lib/utils'

// ─── Recharts (SSR-safe) ──────────────────────────────────────────────────────

const ResponsiveContainer = dynamic(
  () => import('recharts').then(m => m.ResponsiveContainer),
  { ssr: false },
)
const BarChart = dynamic(
  () => import('recharts').then(m => m.BarChart),
  { ssr: false },
)
const Bar = dynamic(() => import('recharts').then(m => m.Bar), { ssr: false })
const XAxis = dynamic(() => import('recharts').then(m => m.XAxis), { ssr: false })
const YAxis = dynamic(() => import('recharts').then(m => m.YAxis), { ssr: false })
const Tooltip = dynamic(() => import('recharts').then(m => m.Tooltip), { ssr: false })

// ─── Types ────────────────────────────────────────────────────────────────────

type AccountType = 'Card Present' | 'eCommerce' | 'MOTO'
type ResidualStatus = 'pending' | 'paid' | 'overdue'

type MerchantResidual = {
  id: string
  merchant: string
  accountType: AccountType
  monthlyVolume: number
  residualRate: number   // decimal e.g. 0.0025
  residualAmount: number
  status: ResidualStatus
  payoutDate: string | null
}

type ChartRow = {
  month: string
  [merchant: string]: number | string
}

type StatusFilter = 'all' | ResidualStatus

// ─── Mock data ────────────────────────────────────────────────────────────────

const MERCHANTS: MerchantResidual[] = [
  { id: 'm1',  merchant: 'Harbor Point Marina',    accountType: 'Card Present', monthlyVolume: 487_250, residualRate: 0.0028, residualAmount: 1_365, status: 'paid',    payoutDate: '2026-05-15' },
  { id: 'm2',  merchant: 'Blue Horizon Travel',    accountType: 'eCommerce',    monthlyVolume: 312_800, residualRate: 0.0035, residualAmount: 1_095, status: 'pending', payoutDate: null },
  { id: 'm3',  merchant: 'Coastal Auto Group',     accountType: 'Card Present', monthlyVolume: 892_000, residualRate: 0.0022, residualAmount: 1_962, status: 'paid',    payoutDate: '2026-05-20' },
  { id: 'm4',  merchant: 'Summit Medical Billing', accountType: 'MOTO',         monthlyVolume: 145_600, residualRate: 0.0045, residualAmount:   655, status: 'overdue', payoutDate: '2026-05-01' },
  { id: 'm5',  merchant: 'Skyline Restaurant Group', accountType: 'Card Present', monthlyVolume: 234_100, residualRate: 0.0030, residualAmount: 702, status: 'paid',   payoutDate: '2026-05-18' },
  { id: 'm6',  merchant: 'Atlantic E-Commerce Co', accountType: 'eCommerce',    monthlyVolume: 678_900, residualRate: 0.0032, residualAmount: 2_172, status: 'pending', payoutDate: null },
  { id: 'm7',  merchant: 'Riverside Dental',       accountType: 'MOTO',         monthlyVolume:  98_300, residualRate: 0.0042, residualAmount:   413, status: 'paid',    payoutDate: '2026-05-22' },
  { id: 'm8',  merchant: 'Pacific Logistics LLC',  accountType: 'Card Present', monthlyVolume: 1_240_000, residualRate: 0.0019, residualAmount: 2_356, status: 'paid', payoutDate: '2026-05-14' },
  { id: 'm9',  merchant: 'Greenfield Retail',      accountType: 'Card Present', monthlyVolume: 356_700, residualRate: 0.0026, residualAmount:   927, status: 'overdue', payoutDate: '2026-04-30' },
  { id: 'm10', merchant: 'Nexus Digital Agency',   accountType: 'eCommerce',    monthlyVolume: 189_400, residualRate: 0.0038, residualAmount:   720, status: 'pending', payoutDate: null },
]

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']

// Last 6 months of residual volume by merchant (top 5 for chart legibility)
const TOP_CHART_MERCHANTS = [
  'Coastal Auto Group',
  'Pacific Logistics LLC',
  'Atlantic E-Commerce Co',
  'Harbor Point Marina',
  'Blue Horizon Travel',
]

const CHART_COLORS: Record<string, string> = {
  'Coastal Auto Group':     BRAND.cyan,
  'Pacific Logistics LLC':  BRAND.success,
  'Atlantic E-Commerce Co': BRAND.warn,
  'Harbor Point Marina':    '#A78BFA',
  'Blue Horizon Travel':    '#F472B6',
}

function buildChartData(): ChartRow[] {
  const base: Record<string, number[]> = {
    'Coastal Auto Group':     [1_540, 1_680, 1_820, 1_750, 1_900, 1_962],
    'Pacific Logistics LLC':  [1_980, 2_100, 2_050, 2_200, 2_310, 2_356],
    'Atlantic E-Commerce Co': [1_420, 1_580, 1_790, 1_920, 2_050, 2_172],
    'Harbor Point Marina':    [1_100, 1_200, 1_280, 1_310, 1_350, 1_365],
    'Blue Horizon Travel':    [820,   900,   960,   1_010, 1_070, 1_095],
  }
  return MONTHS.map((month, i) => {
    const row: ChartRow = { month }
    for (const m of TOP_CHART_MERCHANTS) row[m] = base[m][i]
    return row
  })
}

const CHART_DATA = buildChartData()

// ─── Helpers ──────────────────────────────────────────────────────────────────

const STATUS_META: Record<ResidualStatus, { label: string; color: string; bg: string }> = {
  pending: { label: 'Pending', color: BRAND.warn,    bg: 'rgba(240,178,62,0.10)' },
  paid:    { label: 'Paid',    color: BRAND.success,  bg: 'rgba(61,214,140,0.10)' },
  overdue: { label: 'Overdue', color: BRAND.danger,   bg: 'rgba(232,80,74,0.12)' },
}

const ACCT_TYPE_COLOR: Record<AccountType, string> = {
  'Card Present': BRAND.cyan,
  'eCommerce':    '#A78BFA',
  'MOTO':         BRAND.warn,
}

function exportCSV(rows: MerchantResidual[]) {
  const headers = ['Merchant', 'Account Type', 'Monthly Volume', 'Residual Rate', 'Residual BPS', 'Residual Amount', 'Status', 'Payout Date']
  const lines = rows.map(r => [
    r.merchant,
    r.accountType,
    r.monthlyVolume,
    fmtPercent(r.residualRate * 100, 3),
    Math.round(r.residualAmount / r.monthlyVolume * 10000),
    r.residualAmount,
    r.status,
    r.payoutDate ?? '',
  ].join(','))
  const csv = [headers.join(','), ...lines].join('\n')
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `residuals-${new Date().toISOString().slice(0, 10)}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function KPICard({ label, value, sub, icon: Icon, accent }: {
  label: string; value: string; sub?: string; icon: React.ElementType; accent: string
}) {
  return (
    <div className="p-5 rounded-2xl flex flex-col gap-3" style={{
      backgroundColor: BRAND.card,
      border: `1px solid ${BRAND.border}`,
    }}>
      <div className="flex items-center justify-between">
        <p className="text-[10px] font-bold tracking-[0.2em] uppercase" style={{ color: BRAND.muted }}>{label}</p>
        <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: `${accent}18` }}>
          <Icon size={15} style={{ color: accent }} />
        </div>
      </div>
      <p className="text-2xl font-bold leading-none" style={{ color: BRAND.text }}>{value}</p>
      {sub && <p className="text-xs" style={{ color: BRAND.muted }}>{sub}</p>}
    </div>
  )
}

const LOADING_SHIMMER = (
  <div className="animate-pulse rounded-2xl h-24" style={{ backgroundColor: 'rgba(255,255,255,0.04)' }} />
)

// ─── Main component ───────────────────────────────────────────────────────────

export default function ResidualsTable() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [chartReady] = useState(true)   // always true — data is mock

  // KPIs
  const totalThisMonth = MERCHANTS.reduce((s, m) => s + m.residualAmount, 0)
  const pendingPayout  = MERCHANTS.filter(m => m.status === 'pending' || m.status === 'overdue')
                                  .reduce((s, m) => s + m.residualAmount, 0)
  const paidOutYTD     = totalThisMonth * 5 + MERCHANTS.filter(m => m.status === 'paid').reduce((s, m) => s + m.residualAmount, 0)
  const avgPerMerchant = totalThisMonth / MERCHANTS.length

  // Filtered table rows
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return MERCHANTS.filter(m => {
      const matchStatus = statusFilter === 'all' || m.status === statusFilter
      const matchSearch = !q || m.merchant.toLowerCase().includes(q) || m.accountType.toLowerCase().includes(q)
      return matchStatus && matchSearch
    })
  }, [search, statusFilter])

  const handleExport = useCallback(() => exportCSV(filtered), [filtered])

  const cardStyle: React.CSSProperties = {
    backgroundColor: BRAND.card,
    border: `1px solid ${BRAND.border}`,
    borderRadius: 16,
  }

  const STATUS_FILTERS: { key: StatusFilter; label: string }[] = [
    { key: 'all',     label: 'All' },
    { key: 'pending', label: 'Pending' },
    { key: 'paid',    label: 'Paid' },
    { key: 'overdue', label: 'Overdue' },
  ]

  return (
    <div>
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-7">
        <div>
          <h1 className="text-3xl font-bold tracking-tight"
            style={{ background: 'linear-gradient(90deg,#C9D1D9 0%,#FFF 45%,#8A929C 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Residuals
          </h1>
          <p className="text-sm mt-0.5" style={{ color: BRAND.muted }}>
            Settlement flow · {MERCHANTS.length} merchants · June 2026
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/admin/residuals/import"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all hover:opacity-80"
            style={{ backgroundColor: `${BRAND.cyan}18`, color: BRAND.cyan, border: `1px solid ${BRAND.borderCyan}` }}
          >
            <Upload size={14} /> Import Statement
          </Link>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all hover:opacity-80"
            style={{ backgroundColor: `${BRAND.cyan}18`, color: BRAND.cyan, border: `1px solid ${BRAND.borderCyan}` }}>
            <Download size={14} /> Export CSV
          </button>
        </div>
      </div>

      {/* ── KPI Row ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <KPICard
          label="Total Residuals This Month"
          value={fmtCurrency(totalThisMonth)}
          sub={`${MERCHANTS.length} active merchants`}
          icon={BarChart2}
          accent={BRAND.cyan}
        />
        <KPICard
          label="Pending Payout"
          value={fmtCurrency(pendingPayout)}
          sub={`${MERCHANTS.filter(m => m.status !== 'paid').length} awaiting settlement`}
          icon={Clock}
          accent={BRAND.warn}
        />
        <KPICard
          label="Paid Out YTD"
          value={fmtCurrency(paidOutYTD)}
          sub="Jan – Jun 2026"
          icon={CheckCircle2}
          accent={BRAND.success}
        />
        <KPICard
          label="Avg Residual per Merchant"
          value={fmtCurrency(avgPerMerchant)}
          sub="across all account types"
          icon={TrendingUp}
          accent="#A78BFA"
        />
      </div>

      {/* ── Settlement Timeline Chart ── */}
      <div className="p-6 rounded-2xl mb-6" style={cardStyle}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          <div>
            <p className="text-[10px] font-bold tracking-[0.2em] uppercase mb-0.5" style={{ color: BRAND.muted }}>Settlement Timeline</p>
            <p className="text-base font-bold" style={{ color: BRAND.text }}>Residuals by Merchant · Last 6 Months</p>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            {TOP_CHART_MERCHANTS.map(m => (
              <div key={m} className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: CHART_COLORS[m] }} />
                <span className="text-xs" style={{ color: BRAND.muted }}>{m.split(' ').slice(0, 2).join(' ')}</span>
              </div>
            ))}
          </div>
        </div>

        {chartReady ? (
          <div style={{ height: 240 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={CHART_DATA} margin={{ top: 4, right: 8, left: -16, bottom: 0 }} barCategoryGap="30%">
                <XAxis dataKey="month" tick={{ fill: BRAND.muted, fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: BRAND.muted, fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `$${(v as number / 1000).toFixed(1)}k`} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0D1117', border: `1px solid ${BRAND.borderCyan}`, borderRadius: 10, fontSize: 12 }}
                  labelStyle={{ color: BRAND.muted }}
                  formatter={(v: unknown) => [fmtCurrency(Number(v ?? 0))]}
                />
{TOP_CHART_MERCHANTS.map((m, i) => (
                  <Bar key={m} dataKey={m} stackId="a" fill={CHART_COLORS[m]}
                    radius={i === TOP_CHART_MERCHANTS.length - 1 ? [4, 4, 0, 0] : [0, 0, 0, 0]} />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-60 rounded-xl animate-pulse" style={{ backgroundColor: 'rgba(255,255,255,0.04)' }} />
        )}
      </div>

      {/* ── Filters + Search ── */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        {/* Status filter tabs */}
        <div className="flex items-center gap-1 p-1 rounded-xl" style={cardStyle}>
          {STATUS_FILTERS.map(f => (
            <button key={f.key} onClick={() => setStatusFilter(f.key)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
              style={statusFilter === f.key
                ? { backgroundColor: BRAND.cyan, color: '#000' }
                : { color: BRAND.muted }
              }>
              {f.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative flex-1">
          <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
            style={{ color: `${BRAND.cyan}55` }} />
          <input
            type="text"
            placeholder="Search merchant or account type…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-11 pr-10 py-2.5 text-sm rounded-xl focus:outline-none"
            style={{ backgroundColor: 'rgba(255,255,255,0.05)', border: `1px solid ${BRAND.borderCyan}`, color: BRAND.text }}
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2"
              style={{ color: BRAND.muted }}>
              <X size={13} />
            </button>
          )}
        </div>
      </div>

      {/* ── Table ── */}
      <div className="rounded-2xl overflow-hidden" style={cardStyle}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead style={{ backgroundColor: `${BRAND.cyan}0A`, borderBottom: `1px solid ${BRAND.borderCyan}` }}>
              <tr>
                {['Merchant', 'Account Type', 'Monthly Volume', 'Residual Rate', 'Residual BPS', 'Residual Amount', 'Status', 'Payout Date'].map((h, i) => (
                  <th key={h}
                    className={`${i > 1 ? 'text-right' : 'text-left'} px-5 py-3 text-[10px] uppercase tracking-widest font-semibold`}
                    style={{ color: `${BRAND.cyan}99` }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-16 text-center text-sm" style={{ color: BRAND.muted }}>
                    No residuals match your filter.
                  </td>
                </tr>
              ) : filtered.map((m, idx) => {
                const meta = STATUS_META[m.status]
                return (
                  <tr key={m.id}
                    className="transition-colors"
                    style={{ borderBottom: idx < filtered.length - 1 ? `1px solid ${BRAND.border}` : 'none' }}
                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.backgroundColor = `${BRAND.cyan}06`}
                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'}
                  >
                    <td className="px-5 py-3.5 text-sm font-semibold" style={{ color: BRAND.text }}>
                      {m.merchant}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold"
                        style={{ backgroundColor: `${ACCT_TYPE_COLOR[m.accountType]}15`, color: ACCT_TYPE_COLOR[m.accountType] }}>
                        {m.accountType}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-sm text-right" style={{ color: 'rgba(255,255,255,0.6)' }}>
                      {fmtCurrency(m.monthlyVolume)}
                    </td>
                    <td className="px-5 py-3.5 text-sm text-right" style={{ color: BRAND.muted }}>
                      {fmtPercent(m.residualRate * 100, 3)}
                    </td>
                    <td className="px-5 py-3.5 text-sm font-bold text-right" style={{ color: BRAND.cyan }}>
                      {Math.round(m.residualAmount / m.monthlyVolume * 10000)} bps
                    </td>
                    <td className="px-5 py-3.5 text-sm font-bold text-right" style={{ color: BRAND.success }}>
                      {fmtCurrency(m.residualAmount)}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold capitalize"
                        style={{ backgroundColor: meta.bg, color: meta.color }}>
                        {meta.label}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-xs text-right" style={{ color: BRAND.muted }}>
                      {m.payoutDate ? fmtDate(m.payoutDate) : '—'}
                    </td>
                  </tr>
                )
              })}
            </tbody>

            {/* Footer totals */}
            {filtered.length > 0 && (
              <tfoot>
                <tr style={{ borderTop: `1px solid ${BRAND.border}`, backgroundColor: `${BRAND.cyan}06` }}>
                  <td className="px-5 py-3 text-xs font-bold" style={{ color: BRAND.muted }}>
                    {filtered.length} merchant{filtered.length !== 1 ? 's' : ''}
                  </td>
                  <td />
                  <td className="px-5 py-3 text-sm font-bold text-right" style={{ color: BRAND.text }}>
                    {fmtCurrency(filtered.reduce((s, m) => s + m.monthlyVolume, 0))}
                  </td>
                  <td />
                  <td className="px-5 py-3 text-xs text-right" style={{ color: BRAND.muted }}>
                    {Math.round(
                      filtered.reduce((s, m) => s + m.residualAmount, 0) /
                      filtered.reduce((s, m) => s + m.monthlyVolume, 0) * 10000
                    )} bps avg
                  </td>
                  <td className="px-5 py-3 text-sm font-bold text-right" style={{ color: BRAND.success }}>
                    {fmtCurrency(filtered.reduce((s, m) => s + m.residualAmount, 0))}
                  </td>
                  <td />
                  <td />
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>
    </div>
  )
}
