'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import { TrendingUp, TrendingDown, Clock, CreditCard, Globe, Phone } from 'lucide-react'

const CashflowChart = dynamic(
  () => import('@/components/admin/charts/CashflowChart'),
  { ssr: false, loading: () => <div className="h-60 rounded-xl animate-pulse" style={{ backgroundColor: 'rgba(255,255,255,0.04)' }} /> }
)

// ─── Types ────────────────────────────────────────────────────────────────────

type Period = '3M' | '6M' | 'YTD' | '12M'
const PERIODS: Period[] = ['3M', '6M', 'YTD', '12M']
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

// ─── Mock Data ────────────────────────────────────────────────────────────────

const RAW_MONTHLY = [
  { key: '2025-07', label: 'Jul', inflows: 82400,  outflows: 41200 },
  { key: '2025-08', label: 'Aug', inflows: 91300,  outflows: 44800 },
  { key: '2025-09', label: 'Sep', inflows: 78600,  outflows: 38400 },
  { key: '2025-10', label: 'Oct', inflows: 104200, outflows: 52100 },
  { key: '2025-11', label: 'Nov', inflows: 118700, outflows: 58300 },
  { key: '2025-12', label: 'Dec', inflows: 135400, outflows: 61200 },
  { key: '2026-01', label: 'Jan', inflows: 97300,  outflows: 48600 },
  { key: '2026-02', label: 'Feb', inflows: 108500, outflows: 53400 },
  { key: '2026-03', label: 'Mar', inflows: 124100, outflows: 59700 },
  { key: '2026-04', label: 'Apr', inflows: 139800, outflows: 64300 },
  { key: '2026-05', label: 'May', inflows: 151200, outflows: 68900 },
  { key: '2026-06', label: 'Jun', inflows: 48600,  outflows: 22100 },
]

const BY_ACCOUNT_TYPE = [
  { type: 'Card Present',  icon: CreditCard, color: '#90c4cf', inflows: 312400, outflows: 156200, count: 142 },
  { type: 'eCommerce',     icon: Globe,      color: '#4A9B7F', inflows: 498700, outflows: 201300, count: 231 },
  { type: 'MOTO',          icon: Phone,      color: '#A78BFA', inflows: 189900, outflows: 88400,  count: 67  },
]

const SETTLEMENT_TIMELINE = [
  { date: '2026-06-01', description: 'May residuals — Card Present batch',  amount: 28400 },
  { date: '2026-06-03', description: 'May residuals — eCommerce batch',     amount: 51200 },
  { date: '2026-06-05', description: 'May residuals — MOTO batch',          amount: 18700 },
  { date: '2026-06-07', description: 'Partner payout — First Capital ISO',  amount: 12450 },
  { date: '2026-06-10', description: 'Partner payout — Alpha ISO',          amount: 9800  },
  { date: '2026-06-15', description: 'Processor fee settlement',            amount: -8400  },
  { date: '2026-06-20', description: 'Jun residuals — early batch',         amount: 19600 },
  { date: '2026-07-01', description: 'Jun residuals — final posting',       amount: 29000 },
]

function fmt(n: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(Math.abs(n))
}

function fmtSigned(n: number) {
  return n >= 0 ? `+${fmt(n)}` : `-${fmt(n)}`
}

function getMonthRange(period: Period) {
  const now = new Date()
  if (period === 'YTD') {
    return RAW_MONTHLY.filter(m => m.key.startsWith(String(now.getFullYear())))
  }
  const count = period === '3M' ? 3 : period === '6M' ? 6 : 12
  return RAW_MONTHLY.slice(-count)
}

const cardStyle: React.CSSProperties = {
  backgroundColor: '#282626',
  border: '1px solid rgba(144,196,207,0.13)',
  borderRadius: 16,
}

function Skeleton({ w = '100%', h = 16 }: { w?: string | number; h?: number }) {
  return <div className="rounded animate-pulse" style={{ width: w, height: h, backgroundColor: 'rgba(255,255,255,0.06)' }} />
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function CashflowPage() {
  const [period, setPeriod] = useState<Period>('12M')

  const months = getMonthRange(period)

  let running = 0
  const monthRows = months.map(m => {
    const net = m.inflows - m.outflows
    running += net
    return { ...m, net, running }
  })

  const totalInflows  = monthRows.reduce((s, m) => s + m.inflows, 0)
  const totalOutflows = monthRows.reduce((s, m) => s + m.outflows, 0)
  const netCashflow   = totalInflows - totalOutflows
  const margin        = totalInflows > 0 ? Math.round((netCashflow / totalInflows) * 100) : null

  const chartData = monthRows.map(m => ({ label: m.label, inflows: m.inflows, outflows: m.outflows, net: m.net }))

  // Last posting date
  const lastPosting = SETTLEMENT_TIMELINE.filter(s => s.amount > 0).sort((a, b) => b.date.localeCompare(a.date))[0]
  const pendingSettlements = SETTLEMENT_TIMELINE.filter(s => s.date > new Date().toISOString().slice(0, 10))
  const pendingTotal = pendingSettlements.filter(s => s.amount > 0).reduce((sum, s) => sum + s.amount, 0)

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: 'rgba(255,255,255,0.95)' }}>Cash Flow</h1>
          <p className="text-sm mt-0.5" style={{ color: 'rgba(255,255,255,0.4)' }}>
            Residuals vs outflows · {period === 'YTD' ? 'year to date' : `last ${period}`}
          </p>
        </div>
        <div className="flex items-center gap-1 p-1 rounded-xl" style={cardStyle}>
          {PERIODS.map(p => (
            <button key={p} onClick={() => setPeriod(p)}
              className="px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer"
              style={period === p ? { backgroundColor: '#90c4cf', color: '#111' } : { color: 'rgba(255,255,255,0.5)' }}>
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {/* Net hero */}
        <div className="col-span-2 p-6 rounded-2xl relative overflow-hidden" style={{
          background: netCashflow >= 0
            ? 'linear-gradient(135deg, rgba(74,155,127,0.22) 0%, rgba(74,155,127,0.08) 100%)'
            : 'linear-gradient(135deg, rgba(239,68,68,0.18) 0%, rgba(239,68,68,0.06) 100%)',
          border: `1px solid ${netCashflow >= 0 ? 'rgba(74,155,127,0.35)' : 'rgba(239,68,68,0.3)'}`,
        }}>
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[10px] font-bold tracking-[0.22em] uppercase mb-2" style={{ color: 'rgba(255,255,255,0.38)' }}>
                MTD Net Cashflow
              </p>
              <p className="text-4xl font-bold leading-none" style={{ color: netCashflow >= 0 ? '#6EE7B7' : '#FCA5A5' }}>
                {fmtSigned(netCashflow)}
              </p>
              <p className="text-xs mt-2" style={{ color: 'rgba(255,255,255,0.35)' }}>
                {margin !== null ? `${margin}% margin` : '—'}
              </p>
            </div>
            <div className="p-2.5 rounded-xl flex-shrink-0"
              style={{ backgroundColor: netCashflow >= 0 ? 'rgba(74,155,127,0.18)' : 'rgba(239,68,68,0.12)' }}>
              {netCashflow >= 0
                ? <TrendingUp size={22} style={{ color: '#6EE7B7' }} />
                : <TrendingDown size={22} style={{ color: '#FCA5A5' }} />
              }
            </div>
          </div>
        </div>

        {/* Inflows */}
        <div className="p-5 rounded-2xl" style={cardStyle}>
          <p className="text-[10px] font-bold tracking-[0.22em] uppercase mb-2" style={{ color: 'rgba(255,255,255,0.35)' }}>Residuals In</p>
          <p className="text-2xl font-bold" style={{ color: '#6EE7B7' }}>{fmt(totalInflows)}</p>
          <p className="text-xs mt-1.5" style={{ color: 'rgba(255,255,255,0.35)' }}>{monthRows.length} months</p>
        </div>

        {/* Outflows */}
        <div className="p-5 rounded-2xl" style={cardStyle}>
          <p className="text-[10px] font-bold tracking-[0.22em] uppercase mb-2" style={{ color: 'rgba(255,255,255,0.35)' }}>Outflows</p>
          <p className="text-2xl font-bold" style={{ color: '#FCA5A5' }}>{fmt(totalOutflows)}</p>
          <div className="flex items-center gap-1 mt-1.5">
            <Clock size={10} style={{ color: 'rgba(255,255,255,0.35)' }} />
            <p className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>fees + AE commissions</p>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="p-6 rounded-2xl mb-6" style={cardStyle}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          <div>
            <p className="text-[10px] font-bold tracking-[0.22em] uppercase mb-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>Overview</p>
            <p className="text-base font-bold" style={{ color: 'rgba(255,255,255,0.9)' }}>Inflows vs Outflows</p>
          </div>
          <div className="flex items-center gap-4">
            {[{ c: '#4A9B7F', l: 'Residuals In' }, { c: '#EF4444', l: 'Outflows' }, { c: '#90c4cf', l: 'Net' }].map(({ c, l }) => (
              <div key={l} className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: c }} />
                <span className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>{l}</span>
              </div>
            ))}
          </div>
        </div>
        <CashflowChart data={chartData} />
      </div>

      {/* Two-column: breakdown + settlement */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">

        {/* Monthly breakdown table */}
        <div className="md:col-span-2 rounded-2xl overflow-hidden" style={cardStyle}>
          <div className="px-6 py-4 border-b" style={{ borderColor: 'rgba(144,196,207,0.1)' }}>
            <p className="text-[10px] font-bold tracking-[0.22em] uppercase mb-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>Breakdown</p>
            <p className="text-base font-bold" style={{ color: 'rgba(255,255,255,0.9)' }}>Month by Month</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ backgroundColor: 'rgba(144,196,207,0.05)', borderBottom: '1px solid rgba(144,196,207,0.1)' }}>
                  {['Month', 'Inflows', 'Outflows', 'Net', 'Running Total'].map((h, i) => (
                    <th key={h} className={`${i > 0 ? 'text-right' : 'text-left'} px-5 py-3 text-xs font-semibold uppercase tracking-wide`}
                      style={{ color: 'rgba(255,255,255,0.35)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {monthRows.map((row, idx) => (
                  <tr key={row.key}
                    className="transition-colors"
                    style={{ borderBottom: idx < monthRows.length - 1 ? '1px solid rgba(144,196,207,0.06)' : 'none' }}
                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(255,255,255,0.025)'}
                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'}>
                    <td className="px-5 py-3 text-sm font-semibold" style={{ color: 'rgba(255,255,255,0.7)' }}>{row.label}</td>
                    <td className="px-5 py-3 text-right text-sm font-semibold" style={{ color: '#6EE7B7' }}>+{fmt(row.inflows)}</td>
                    <td className="px-5 py-3 text-right text-sm font-semibold" style={{ color: '#FCA5A5' }}>-{fmt(row.outflows)}</td>
                    <td className="px-5 py-3 text-right text-sm font-bold" style={{ color: row.net > 0 ? '#6EE7B7' : '#FCA5A5' }}>
                      {fmtSigned(row.net)}
                    </td>
                    <td className="px-5 py-3 text-right text-sm font-bold" style={{ color: row.running > 0 ? '#90c4cf' : '#FCA5A5' }}>
                      {fmtSigned(row.running)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr style={{ borderTop: '1px solid rgba(144,196,207,0.1)', backgroundColor: 'rgba(144,196,207,0.05)' }}>
                  <td className="px-5 py-3 text-sm font-bold" style={{ color: 'rgba(255,255,255,0.6)' }}>Total</td>
                  <td className="px-5 py-3 text-right text-sm font-bold" style={{ color: '#6EE7B7' }}>+{fmt(totalInflows)}</td>
                  <td className="px-5 py-3 text-right text-sm font-bold" style={{ color: '#FCA5A5' }}>-{fmt(totalOutflows)}</td>
                  <td className="px-5 py-3 text-right text-sm font-bold" style={{ color: netCashflow >= 0 ? '#6EE7B7' : '#FCA5A5' }}>{fmtSigned(netCashflow)}</td>
                  <td />
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Settlement timeline */}
        <div className="rounded-2xl overflow-hidden" style={cardStyle}>
          <div className="px-5 py-4 border-b" style={{ borderColor: 'rgba(144,196,207,0.1)' }}>
            <p className="text-[10px] font-bold tracking-[0.22em] uppercase mb-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>Settlement</p>
            <p className="text-base font-bold" style={{ color: 'rgba(255,255,255,0.9)' }}>Timeline</p>
            <p className="text-xs mt-1 font-semibold" style={{ color: '#FBBF24' }}>{fmt(pendingTotal)} pending</p>
          </div>
          {SETTLEMENT_TIMELINE.map((s, idx) => {
            const isPast = s.date <= new Date().toISOString().slice(0, 10)
            const isInflow = s.amount > 0
            return (
              <div key={idx} className="px-5 py-3 flex items-start gap-3"
                style={{ borderBottom: idx < SETTLEMENT_TIMELINE.length - 1 ? '1px solid rgba(144,196,207,0.06)' : 'none', opacity: isPast ? 0.55 : 1 }}>
                <div className="mt-0.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: isInflow ? '#6EE7B7' : '#FCA5A5' }} />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium truncate" style={{ color: 'rgba(255,255,255,0.75)' }}>{s.description}</p>
                  <p className="text-[10px] mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>{s.date}</p>
                </div>
                <p className="text-sm font-bold flex-shrink-0" style={{ color: isInflow ? '#6EE7B7' : '#FCA5A5' }}>
                  {isInflow ? '+' : '-'}{fmt(s.amount)}
                </p>
              </div>
            )
          })}
          <div className="px-5 py-3 border-t" style={{ borderColor: 'rgba(144,196,207,0.1)', backgroundColor: 'rgba(255,255,255,0.02)' }}>
            <p className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>
              Last payout: <span style={{ color: '#90c4cf' }}>{lastPosting?.date ?? '—'}</span>
            </p>
          </div>
        </div>
      </div>

      {/* By account type */}
      <div className="p-6 rounded-2xl" style={cardStyle}>
        <div className="mb-5">
          <p className="text-[10px] font-bold tracking-[0.22em] uppercase mb-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>By Account Type</p>
          <p className="text-base font-bold" style={{ color: 'rgba(255,255,255,0.9)' }}>Revenue Split</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {BY_ACCOUNT_TYPE.map(acct => {
            const net = acct.inflows - acct.outflows
            const pct = totalInflows > 0 ? Math.round((acct.inflows / totalInflows) * 100) : 0
            return (
              <div key={acct.type} className="p-4 rounded-xl" style={{ backgroundColor: `${acct.color}10`, border: `1px solid ${acct.color}25` }}>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${acct.color}20` }}>
                    <acct.icon size={14} style={{ color: acct.color }} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold" style={{ color: 'rgba(255,255,255,0.85)' }}>{acct.type}</p>
                    <p className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>{acct.count} accounts · {pct}% of volume</p>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>Inflows</span>
                    <span className="text-sm font-bold" style={{ color: '#6EE7B7' }}>+{fmt(acct.inflows)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>Outflows</span>
                    <span className="text-sm font-bold" style={{ color: '#FCA5A5' }}>-{fmt(acct.outflows)}</span>
                  </div>
                  <div className="flex items-center justify-between pt-1.5 border-t" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                    <span className="text-xs font-semibold" style={{ color: 'rgba(255,255,255,0.5)' }}>Net</span>
                    <span className="text-base font-bold" style={{ color: acct.color }}>+{fmt(net)}</span>
                  </div>
                </div>
                {/* Mini bar */}
                <div className="mt-3 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: 'rgba(255,255,255,0.06)' }}>
                  <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: acct.color }} />
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
