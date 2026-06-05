export const dynamic = 'force-dynamic'

import Link from 'next/link'
import {
  LayoutDashboard, TrendingUp, Users, Zap,
  CreditCard, Globe, PhoneCall, ArrowUpRight,
} from 'lucide-react'
import DashboardKPIs   from '@/components/admin/DashboardKPIs'
import DashboardCharts from '@/components/admin/DashboardCharts'
import AlertsPanel     from '@/components/admin/AlertsPanel'
import MCCRiskChart    from '@/components/admin/MCCRiskChart'

// ── Brand tokens ──────────────────────────────────────────────────────────────
const B = {
  bg:        '#1c1c1c',
  card:      '#282626',
  cardAlt:   '#282626',
  cyan:      '#90c4cf',
  cyanBright:'#90c4cf',
  cyanDeep:  '#4A9B7F',
  text:      'rgba(255,255,255,0.85)',
  muted:     'rgba(255,255,255,0.3)',
  border:    'rgba(255,255,255,0.08)',
  borderCyan:'rgba(144,196,207,0.25)',
  success:   '#3DD68C',
  warn:      '#F0B23E',
  danger:    '#E8504A',
} as const

// ── Helpers ───────────────────────────────────────────────────────────────────
function fmt(n: number): string {
  return new Intl.NumberFormat('en-US', {
    style:              'currency',
    currency:           'USD',
    maximumFractionDigits: 0,
  }).format(n)
}
function fmtDate(d: string): string {
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

// ── Account type config ───────────────────────────────────────────────────────
const ACCOUNT_TYPE_META: Record<string, { label: string; icon: React.ElementType; color: string; bg: string }> = {
  'Card Present': { label: 'Card Present', icon: CreditCard, color: B.cyan,      bg: 'rgba(144,196,207,0.12)'  },
  'eCommerce':    { label: 'eCommerce',    icon: Globe,      color: B.success,    bg: 'rgba(61,214,140,0.12)'  },
  'MOTO':         { label: 'MOTO',         icon: PhoneCall,  color: B.warn,       bg: 'rgba(240,178,62,0.12)'  },
}

// ── Mock: Recent Activations ──────────────────────────────────────────────────
type Activation = {
  id:          string
  merchant:    string
  accountType: 'Card Present' | 'eCommerce' | 'MOTO'
  volume:      number      // est. monthly volume
  activatedAt: string      // ISO date string
  partner:     string
  status:      'active' | 'provisioning' | 'suspended'
}

const RECENT_ACTIVATIONS: Activation[] = [
  {
    id:          'M-00214',
    merchant:    'BluePeak Retail Group',
    accountType: 'Card Present',
    volume:      328_500,
    activatedAt: '2026-06-03',
    partner:     'Nexus Payment Solutions',
    status:      'active',
  },
  {
    id:          'M-00213',
    merchant:    'Coral Bay Hospitality',
    accountType: 'eCommerce',
    volume:      91_200,
    activatedAt: '2026-06-01',
    partner:     'Atlantic ISO Group',
    status:      'active',
  },
  {
    id:          'M-00212',
    merchant:    'Ironbridge Auto Parts',
    accountType: 'MOTO',
    volume:      44_800,
    activatedAt: '2026-05-29',
    partner:     'Nexus Payment Solutions',
    status:      'active',
  },
  {
    id:          'M-00211',
    merchant:    'Sunrise Pharma Direct',
    accountType: 'eCommerce',
    volume:      215_000,
    activatedAt: '2026-05-27',
    partner:     'PinnaclePay Partners',
    status:      'provisioning',
  },
  {
    id:          'M-00210',
    merchant:    'Harbor Freight Services',
    accountType: 'Card Present',
    volume:      182_400,
    activatedAt: '2026-05-24',
    partner:     'Atlantic ISO Group',
    status:      'active',
  },
]

const STATUS_META: Record<string, { label: string; color: string; bg: string; border: string }> = {
  active:       { label: 'Active',        color: B.success,  bg: 'rgba(61,214,140,0.1)',  border: 'rgba(61,214,140,0.25)'  },
  provisioning: { label: 'Provisioning',  color: B.warn,     bg: 'rgba(240,178,62,0.1)',  border: 'rgba(240,178,62,0.25)'  },
  suspended:    { label: 'Suspended',     color: B.danger,   bg: 'rgba(232,80,74,0.1)',   border: 'rgba(232,80,74,0.25)'   },
}

// ── Stat pill used in hero summary row ───────────────────────────────────────
function StatPill({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="flex flex-col items-start gap-0.5">
      <span className="text-[9px] font-bold uppercase tracking-[0.2em]" style={{ color: 'rgba(255,255,255,0.35)' }}>
        {label}
      </span>
      <span className="text-sm font-bold" style={{ color }}>{value}</span>
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function AdminDashboardPage() {
  const today = new Date()
  const dateLabel = today.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })

  return (
    <div className="min-h-screen" style={{ fontFamily: "'Inter', 'Poppins', Arial, sans-serif" }}>

      {/* ── Hero / Header ──────────────────────────────────────────────────── */}
      <div
        className="rounded-2xl mb-6 shadow-xl overflow-hidden"
        style={{ backgroundColor: B.card }}
      >
        {/* Top band */}
        <div
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 px-6 md:px-8 py-5 md:py-6"
        >
          <div className="flex items-center gap-4">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: `linear-gradient(135deg, ${B.cyan} 0%, ${B.cyanDeep} 100%)` }}
            >
              <LayoutDashboard size={18} style={{ color: '#1c1c1c' }} />
            </div>
            <div>
              <h1
                className="font-bold tracking-widest"
                style={{
                  fontSize: 20,
                  background: 'linear-gradient(90deg, #C9D1D9 0%, #FFFFFF 45%, #8A929C 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  letterSpacing: '0.06em',
                }}
              >
                OPERATIONS DASHBOARD
              </h1>
              <p className="text-xs tracking-[0.18em] mt-0.5 font-semibold uppercase" style={{ color: B.cyan }}>
                United Fintech · ISO / Payments Operations
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <p className="text-[11px]" style={{ color: 'rgba(255,255,255,0.3)' }}>{dateLabel}</p>
            <Link
              href="/admin/merchants/new"
              className="px-4 py-2 text-sm font-bold rounded-lg transition-all hover:opacity-90"
              style={{ backgroundColor: B.cyan, color: '#1c1c1c' }}
            >
              + New Merchant
            </Link>
            <Link
              href="/admin/deals/new"
              className="px-3 py-2 text-xs font-bold rounded-lg border transition-all hover:border-[#90c4cf]"
              style={{ borderColor: B.borderCyan, color: B.cyanBright }}
            >
              New Deal
            </Link>
          </div>
        </div>

        {/* Gradient separator */}
        <div className="h-px" style={{
          background: `linear-gradient(90deg, transparent, ${B.cyan} 30%, ${B.cyanBright} 60%, transparent)`,
          opacity: 0.4,
        }} />

        {/* Summary stats row */}
        <div
          className="flex flex-wrap items-center gap-8 px-6 md:px-8 py-4"
          style={{ borderTop: 'none' }}
        >
          <StatPill label="MTD Volume"      value="$48.3M"    color={B.text}    />
          <StatPill label="Active Merchants" value="214"       color={B.cyanBright} />
          <StatPill label="Activations MTD"  value="18"        color={B.success} />
          <StatPill label="Residual (MTD)"   value="$193,282"  color={B.success} />
          <StatPill label="Chargeback Rate"  value="0.38%"     color={B.success} />
          <StatPill label="Open Alerts"      value="4"         color={B.warn}    />
        </div>
      </div>

      {/* ── KPI Cards ─────────────────────────────────────────────────────── */}
      <section className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <p
            className="text-[10px] font-bold tracking-[0.22em] uppercase"
            style={{ color: 'rgba(144,196,207,0.55)' }}
          >
            Key Performance Indicators
          </p>
          <Link
            href="/admin/residuals"
            className="flex items-center gap-1 text-[11px] font-bold hover:underline"
            style={{ color: B.cyanBright }}
          >
            View Residuals <ArrowUpRight size={11} />
          </Link>
        </div>
        <DashboardKPIs />
      </section>

      {/* ── Charts (2/3) + Alerts (1/3) ────────────────────────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_340px] gap-5 mb-6">
        {/* Charts column */}
        <section>
          <p
            className="text-[10px] font-bold tracking-[0.22em] uppercase mb-3"
            style={{ color: 'rgba(144,196,207,0.55)' }}
          >
            Analytics &amp; Charts
          </p>
          <DashboardCharts />
        </section>

        {/* Alerts column */}
        <section>
          <p
            className="text-[10px] font-bold tracking-[0.22em] uppercase mb-3"
            style={{ color: 'rgba(144,196,207,0.55)' }}
          >
            Action Items
          </p>
          <AlertsPanel />

          {/* Quick-link nav under alerts */}
          <div className="mt-4 grid grid-cols-2 gap-2">
            {[
              { label: 'Merchants',  href: '/admin/merchants',  Icon: Users,       color: B.cyan    },
              { label: 'Residuals',  href: '/admin/residuals',  Icon: TrendingUp,  color: B.success },
              { label: 'Activations',href: '/admin/activity',   Icon: Zap,         color: B.warn    },
              { label: 'Compliance', href: '/admin/compliance',  Icon: ArrowUpRight,color: '#C9D1D9' },
            ].map(({ label, href, Icon, color }) => (
              <Link
                key={label}
                href={href}
                className="flex items-center gap-2 rounded-xl px-4 py-3 transition-all hover:-translate-y-0.5 hover:shadow-md"
                style={{ backgroundColor: B.cardAlt, border: `1px solid ${B.border}` }}
              >
                <Icon size={14} style={{ color, flexShrink: 0 }} />
                <span className="text-xs font-semibold" style={{ color: B.text }}>{label}</span>
              </Link>
            ))}
          </div>
        </section>
      </div>

      {/* ── MCC Risk Concentration ────────────────────────────────────────── */}
      <section className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p
              className="text-[10px] font-bold tracking-[0.22em] uppercase"
              style={{ color: 'rgba(144,196,207,0.55)' }}
            >
              Portfolio Risk
            </p>
            <p className="text-base font-bold mt-0.5" style={{ color: B.text }}>
              MCC Risk Concentration
            </p>
          </div>
          <Link
            href="/admin/merchants"
            className="flex items-center gap-1 text-[11px] font-bold hover:underline"
            style={{ color: B.cyanBright }}
          >
            View Merchants <ArrowUpRight size={11} />
          </Link>
        </div>
        <MCCRiskChart />
      </section>

      {/* ── Recent Activations Table ───────────────────────────────────────── */}
      <section className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p
              className="text-[10px] font-bold tracking-[0.22em] uppercase"
              style={{ color: 'rgba(144,196,207,0.55)' }}
            >
              Activity
            </p>
            <p className="text-base font-bold mt-0.5" style={{ color: B.text }}>
              Recent Merchant Activations
            </p>
          </div>
          <Link
            href="/admin/activity"
            className="flex items-center gap-1 text-[11px] font-bold hover:underline"
            style={{ color: B.cyanBright }}
          >
            View all <ArrowUpRight size={11} />
          </Link>
        </div>

        <div
          className="rounded-2xl overflow-hidden shadow-sm"
          style={{ backgroundColor: B.card, border: `1px solid ${B.border}` }}
        >
          {/* Table header */}
          <div
            className="overflow-x-auto"
            style={{ backgroundColor: B.cardAlt }}
          >
            <table className="w-full min-w-[640px]">
              <thead>
                <tr style={{ borderBottom: `1px solid ${B.border}` }}>
                  {['ID', 'Merchant', 'Account Type', 'Est. Monthly Volume', 'Partner', 'Activated', 'Status'].map(h => (
                    <th
                      key={h}
                      className="text-left px-5 py-3 text-[10px] font-bold uppercase tracking-[0.18em] whitespace-nowrap"
                      style={{ color: 'rgba(144,196,207,0.7)' }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {RECENT_ACTIVATIONS.map((row, i) => {
                  const atMeta = ACCOUNT_TYPE_META[row.accountType]
                  const stMeta = STATUS_META[row.status]
                  const AtIcon = atMeta?.icon ?? CreditCard
                  return (
                    <tr
                      key={row.id}
                      className="transition-colors hover:bg-white/[0.025]"
                      style={{ borderBottom: i < RECENT_ACTIVATIONS.length - 1 ? `1px solid ${B.border}` : 'none' }}
                    >
                      {/* ID */}
                      <td className="px-5 py-3.5">
                        <Link
                          href={`/admin/merchants/${row.id}`}
                          className="font-mono text-xs font-bold hover:underline"
                          style={{ color: B.cyanBright }}
                        >
                          {row.id}
                        </Link>
                      </td>

                      {/* Merchant name */}
                      <td className="px-5 py-3.5">
                        <Link
                          href={`/admin/merchants/${row.id}`}
                          className="text-sm font-semibold hover:underline"
                          style={{ color: B.text }}
                        >
                          {row.merchant}
                        </Link>
                      </td>

                      {/* Account type pill */}
                      <td className="px-5 py-3.5">
                        <span
                          className="inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-lg whitespace-nowrap"
                          style={{
                            color:           atMeta?.color ?? B.text,
                            backgroundColor: atMeta?.bg    ?? 'rgba(255,255,255,0.06)',
                          }}
                        >
                          <AtIcon size={11} />
                          {row.accountType}
                        </span>
                      </td>

                      {/* Volume */}
                      <td className="px-5 py-3.5">
                        <p className="text-sm font-bold" style={{ color: B.text, fontVariantNumeric: 'tabular-nums' }}>
                          {fmt(row.volume)}
                        </p>
                      </td>

                      {/* Partner */}
                      <td className="px-5 py-3.5">
                        <p className="text-xs font-medium" style={{ color: B.muted }}>
                          {row.partner}
                        </p>
                      </td>

                      {/* Date */}
                      <td className="px-5 py-3.5">
                        <p className="text-xs font-medium whitespace-nowrap" style={{ color: B.muted }}>
                          {fmtDate(row.activatedAt)}
                        </p>
                      </td>

                      {/* Status */}
                      <td className="px-5 py-3.5">
                        <span
                          className="text-[10px] font-bold px-2.5 py-0.5 rounded-full whitespace-nowrap"
                          style={{
                            color:           stMeta.color,
                            backgroundColor: stMeta.bg,
                            border:          `1px solid ${stMeta.border}`,
                          }}
                        >
                          {stMeta.label}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>

    </div>
  )
}
