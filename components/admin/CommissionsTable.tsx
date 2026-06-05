'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import {
  Users, TrendingUp, Award, DollarSign, X, ChevronDown, ChevronUp,
} from 'lucide-react'
import { BRAND } from '@/lib/brand'
import { fmtCurrency, fmtPercent } from '@/lib/utils'

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

type AERole = 'Account Executive' | 'Senior AE' | 'Partner Manager'

type Agent = {
  id: string
  name: string
  role: AERole
  baseSplitPct: number     // % of gross revenue they keep
  residualSplitPct: number // % of residual they keep (rest goes to partner/ISO)
  thisMonth: number
  ytdTotal: number
  // Merchant breakdown for modal
  merchantBreakdown: { merchant: string; volume: number; residual: number; aeSplit: number }[]
}

type ChartRow = {
  month: string
  [ae: string]: number | string
}

// ─── Mock data ────────────────────────────────────────────────────────────────

const AGENTS: Agent[] = [
  {
    id: 'ae1', name: 'Marcus Webb', role: 'Senior AE',
    baseSplitPct: 55, residualSplitPct: 60,
    thisMonth: 14_820, ytdTotal: 87_400,
    merchantBreakdown: [
      { merchant: 'Pacific Logistics LLC',  volume: 1_240_000, residual: 2_356, aeSplit: 1_414 },
      { merchant: 'Coastal Auto Group',     volume: 892_000,   residual: 1_962, aeSplit: 1_177 },
      { merchant: 'Greenfield Retail',      volume: 356_700,   residual: 927,   aeSplit: 556 },
    ],
  },
  {
    id: 'ae2', name: 'Priya Nair', role: 'Account Executive',
    baseSplitPct: 45, residualSplitPct: 50,
    thisMonth: 9_340, ytdTotal: 54_200,
    merchantBreakdown: [
      { merchant: 'Atlantic E-Commerce Co', volume: 678_900, residual: 2_172, aeSplit: 1_086 },
      { merchant: 'Blue Horizon Travel',    volume: 312_800, residual: 1_095, aeSplit: 548 },
      { merchant: 'Nexus Digital Agency',   volume: 189_400, residual: 720,   aeSplit: 360 },
    ],
  },
  {
    id: 'ae3', name: 'Jordan Reyes', role: 'Account Executive',
    baseSplitPct: 45, residualSplitPct: 50,
    thisMonth: 7_260, ytdTotal: 41_800,
    merchantBreakdown: [
      { merchant: 'Harbor Point Marina',    volume: 487_250, residual: 1_365, aeSplit: 683 },
      { merchant: 'Skyline Restaurant Group', volume: 234_100, residual: 702, aeSplit: 351 },
    ],
  },
  {
    id: 'ae4', name: 'Sofia Andrade', role: 'Partner Manager',
    baseSplitPct: 35, residualSplitPct: 40,
    thisMonth: 11_600, ytdTotal: 69_800,
    merchantBreakdown: [
      { merchant: 'Summit Medical Billing', volume: 145_600, residual: 655,   aeSplit: 262 },
      { merchant: 'Riverside Dental',       volume: 98_300,  residual: 413,   aeSplit: 165 },
      { merchant: 'Coastal Auto Group',     volume: 892_000, residual: 1_962, aeSplit: 785 },
    ],
  },
  {
    id: 'ae5', name: 'Derek Huang', role: 'Senior AE',
    baseSplitPct: 55, residualSplitPct: 60,
    thisMonth: 12_490, ytdTotal: 75_200,
    merchantBreakdown: [
      { merchant: 'Pacific Logistics LLC',  volume: 1_240_000, residual: 2_356, aeSplit: 1_414 },
      { merchant: 'Atlantic E-Commerce Co', volume: 678_900,   residual: 2_172, aeSplit: 1_303 },
    ],
  },
  {
    id: 'ae6', name: 'Leila Hassan', role: 'Account Executive',
    baseSplitPct: 45, residualSplitPct: 50,
    thisMonth: 6_120, ytdTotal: 34_900,
    merchantBreakdown: [
      { merchant: 'Blue Horizon Travel',  volume: 312_800, residual: 1_095, aeSplit: 548 },
      { merchant: 'Nexus Digital Agency', volume: 189_400, residual: 720,   aeSplit: 360 },
    ],
  },
]

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']

// Seeded monthly commission history per AE
const MONTHLY_BASE: Record<string, number[]> = {
  'Marcus Webb':   [11_200, 12_400, 13_100, 12_800, 14_200, 14_820],
  'Priya Nair':    [6_800,  7_500,  8_200,  8_900,  9_100,  9_340],
  'Jordan Reyes':  [5_400,  5_900,  6_200,  6_800,  7_100,  7_260],
  'Sofia Andrade': [8_900,  9_400,  10_200, 10_800, 11_200, 11_600],
  'Derek Huang':   [9_800,  10_500, 11_100, 11_800, 12_200, 12_490],
  'Leila Hassan':  [4_200,  4_600,  5_100,  5_500,  5_900,  6_120],
}

const AE_COLORS: Record<string, string> = {
  'Marcus Webb':   BRAND.cyan,
  'Priya Nair':    BRAND.success,
  'Jordan Reyes':  BRAND.warn,
  'Sofia Andrade': '#A78BFA',
  'Derek Huang':   '#F472B6',
  'Leila Hassan':  '#34D399',
}

function buildChartData(): ChartRow[] {
  return MONTHS.map((month, i) => {
    const row: ChartRow = { month }
    for (const ae of AGENTS) row[ae.name] = MONTHLY_BASE[ae.name][i]
    return row
  })
}

const CHART_DATA = buildChartData()

// ─── Helpers ──────────────────────────────────────────────────────────────────

const ROLE_META: Record<AERole, { color: string; bg: string }> = {
  'Account Executive': { color: BRAND.cyan,    bg: `${BRAND.cyan}15` },
  'Senior AE':         { color: BRAND.success, bg: 'rgba(61,214,140,0.12)' },
  'Partner Manager':   { color: '#A78BFA',     bg: 'rgba(167,139,250,0.12)' },
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

// ─── Commission Statement Modal ───────────────────────────────────────────────

function StatementModal({ agent, onClose }: { agent: Agent; onClose: () => void }) {
  const aeSplitTotal = agent.merchantBreakdown.reduce((s, m) => s + m.aeSplit, 0)
  const partnerSplit = agent.merchantBreakdown.reduce((s, m) => s + (m.residual - m.aeSplit), 0)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div className="w-full max-w-2xl rounded-2xl overflow-hidden"
        style={{ backgroundColor: BRAND.cardAlt, border: `1px solid ${BRAND.borderCyan}` }}>

        {/* Modal header */}
        <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: BRAND.border }}>
          <div>
            <p className="text-[10px] font-bold tracking-[0.2em] uppercase mb-0.5" style={{ color: BRAND.muted }}>
              Commission Statement
            </p>
            <p className="text-lg font-bold" style={{ color: BRAND.text }}>{agent.name}</p>
            <p className="text-xs mt-0.5" style={{ color: BRAND.muted }}>{agent.role} · June 2026</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl transition-colors hover:opacity-70"
            style={{ color: BRAND.muted }}>
            <X size={18} />
          </button>
        </div>

        {/* Merchant breakdown */}
        <div className="px-6 py-4">
          <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: BRAND.muted }}>
            Merchant Earnings
          </p>
          <div className="rounded-xl overflow-hidden" style={{ border: `1px solid ${BRAND.border}` }}>
            <table className="w-full">
              <thead style={{ backgroundColor: `${BRAND.cyan}0A` }}>
                <tr>
                  {['Merchant', 'Volume', 'Total Residual', 'Your Split'].map((h, i) => (
                    <th key={h} className={`${i > 0 ? 'text-right' : 'text-left'} px-4 py-2.5 text-[10px] uppercase tracking-widest font-semibold`}
                      style={{ color: `${BRAND.cyan}99` }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {agent.merchantBreakdown.map((m, idx) => (
                  <tr key={m.merchant}
                    style={{ borderTop: idx > 0 ? `1px solid ${BRAND.border}` : undefined }}>
                    <td className="px-4 py-3 text-sm" style={{ color: BRAND.text }}>{m.merchant}</td>
                    <td className="px-4 py-3 text-sm text-right" style={{ color: BRAND.muted }}>{fmtCurrency(m.volume)}</td>
                    <td className="px-4 py-3 text-sm text-right" style={{ color: BRAND.text }}>{fmtCurrency(m.residual)}</td>
                    <td className="px-4 py-3 text-sm font-bold text-right" style={{ color: BRAND.success }}>{fmtCurrency(m.aeSplit)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr style={{ borderTop: `1px solid ${BRAND.border}`, backgroundColor: `${BRAND.cyan}06` }}>
                  <td className="px-4 py-3 text-xs font-bold" style={{ color: BRAND.muted }}>Subtotal</td>
                  <td />
                  <td className="px-4 py-3 text-sm font-bold text-right" style={{ color: BRAND.text }}>
                    {fmtCurrency(agent.merchantBreakdown.reduce((s, m) => s + m.residual, 0))}
                  </td>
                  <td className="px-4 py-3 text-sm font-bold text-right" style={{ color: BRAND.success }}>
                    {fmtCurrency(aeSplitTotal)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Residual split breakdown */}
        <div className="px-6 pb-4">
          <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: BRAND.muted }}>
            Residual Split
          </p>
          <div className="rounded-xl p-4 flex items-center gap-6"
            style={{ backgroundColor: `${BRAND.cyan}08`, border: `1px solid ${BRAND.borderCyan}` }}>
            <div className="flex-1">
              <p className="text-xs mb-1" style={{ color: BRAND.muted }}>AE Split ({agent.residualSplitPct}%)</p>
              <p className="text-xl font-bold" style={{ color: BRAND.success }}>{fmtCurrency(aeSplitTotal)}</p>
            </div>
            <div className="w-px h-10 self-stretch" style={{ backgroundColor: BRAND.border }} />
            <div className="flex-1">
              <p className="text-xs mb-1" style={{ color: BRAND.muted }}>Partner/ISO Split ({100 - agent.residualSplitPct}%)</p>
              <p className="text-xl font-bold" style={{ color: '#A78BFA' }}>{fmtCurrency(partnerSplit)}</p>
            </div>
            <div className="w-px h-10 self-stretch" style={{ backgroundColor: BRAND.border }} />
            <div className="flex-1">
              <p className="text-xs mb-1" style={{ color: BRAND.muted }}>This Month Total</p>
              <p className="text-xl font-bold" style={{ color: BRAND.text }}>{fmtCurrency(agent.thisMonth)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Residual Split Card ──────────────────────────────────────────────────────

function ResidualSplitSection() {
  return (
    <div className="rounded-2xl overflow-hidden mb-6"
      style={{ backgroundColor: BRAND.card, border: `1px solid ${BRAND.border}` }}>
      <div className="px-6 py-4 border-b" style={{ borderColor: BRAND.border }}>
        <p className="text-[10px] font-bold tracking-[0.2em] uppercase mb-0.5" style={{ color: BRAND.muted }}>Deal Structure</p>
        <p className="text-base font-bold" style={{ color: BRAND.text }}>Residual Split by Agent</p>
        <p className="text-xs mt-0.5" style={{ color: BRAND.muted }}>How each deal splits between AE and Partner/ISO</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead style={{ backgroundColor: `${BRAND.cyan}0A`, borderBottom: `1px solid ${BRAND.borderCyan}` }}>
            <tr>
              {['Agent', 'Role', 'Base Split', 'Residual Split', 'Partner/ISO Gets', 'This Month'].map((h, i) => (
                <th key={h}
                  className={`${i > 1 ? 'text-right' : 'text-left'} px-5 py-3 text-[10px] uppercase tracking-widest font-semibold`}
                  style={{ color: `${BRAND.cyan}99` }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {AGENTS.map((ae, idx) => {
              const roleMeta = ROLE_META[ae.role]
              return (
                <tr key={ae.id}
                  style={{ borderBottom: idx < AGENTS.length - 1 ? `1px solid ${BRAND.border}` : 'none' }}>
                  <td className="px-5 py-3.5 text-sm font-semibold" style={{ color: BRAND.text }}>{ae.name}</td>
                  <td className="px-5 py-3.5">
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold"
                      style={{ backgroundColor: roleMeta.bg, color: roleMeta.color }}>
                      {ae.role}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-sm text-right" style={{ color: BRAND.muted }}>
                    {fmtPercent(ae.baseSplitPct)}
                  </td>
                  <td className="px-5 py-3.5 text-sm font-semibold text-right" style={{ color: BRAND.cyan }}>
                    {fmtPercent(ae.residualSplitPct)}
                  </td>
                  <td className="px-5 py-3.5 text-sm text-right" style={{ color: '#A78BFA' }}>
                    {fmtPercent(100 - ae.residualSplitPct)}
                  </td>
                  <td className="px-5 py-3.5 text-sm font-bold text-right" style={{ color: BRAND.success }}>
                    {fmtCurrency(ae.thisMonth)}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function CommissionsTable() {
  const [activeModal, setActiveModal] = useState<Agent | null>(null)
  const [expandedAE, setExpandedAE] = useState<string | null>(null)

  const totalThisMonth = AGENTS.reduce((s, ae) => s + ae.thisMonth, 0)
  const activeAEs      = AGENTS.length
  const avgCommission  = totalThisMonth / activeAEs
  const bestPerformer  = [...AGENTS].sort((a, b) => b.thisMonth - a.thisMonth)[0]

  const cardStyle: React.CSSProperties = {
    backgroundColor: BRAND.card,
    border: `1px solid ${BRAND.border}`,
    borderRadius: 16,
  }

  return (
    <>
      {/* ── Header ── */}
      <div className="mb-7">
        <h1 className="text-3xl font-bold tracking-tight"
          style={{ background: 'linear-gradient(90deg,#C9D1D9 0%,#FFF 45%,#8A929C 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Commissions
        </h1>
        <p className="text-sm mt-0.5" style={{ color: BRAND.muted }}>
          Agent commissions &amp; residual splits · June 2026
        </p>
      </div>

      {/* ── KPI Row ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <KPICard
          label="Total Commissions This Month"
          value={fmtCurrency(totalThisMonth)}
          sub="across all agents"
          icon={DollarSign}
          accent={BRAND.cyan}
        />
        <KPICard
          label="Active AEs"
          value={String(activeAEs)}
          sub="across 3 roles"
          icon={Users}
          accent={BRAND.success}
        />
        <KPICard
          label="Avg Commission per AE"
          value={fmtCurrency(avgCommission)}
          sub="this month"
          icon={TrendingUp}
          accent={BRAND.warn}
        />
        <KPICard
          label="Best Performer"
          value={bestPerformer.name.split(' ')[0]}
          sub={fmtCurrency(bestPerformer.thisMonth)}
          icon={Award}
          accent="#A78BFA"
        />
      </div>

      {/* ── Commission by AE Bar Chart ── */}
      <div className="p-6 rounded-2xl mb-6" style={cardStyle}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          <div>
            <p className="text-[10px] font-bold tracking-[0.2em] uppercase mb-0.5" style={{ color: BRAND.muted }}>Commission Trend</p>
            <p className="text-base font-bold" style={{ color: BRAND.text }}>Earnings by AE · Last 6 Months</p>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            {AGENTS.map(ae => (
              <div key={ae.id} className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: AE_COLORS[ae.name] }} />
                <span className="text-xs" style={{ color: BRAND.muted }}>{ae.name.split(' ')[0]}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ height: 240 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={CHART_DATA} margin={{ top: 4, right: 8, left: -16, bottom: 0 }} barCategoryGap="28%">
              <XAxis dataKey="month" tick={{ fill: BRAND.muted, fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: BRAND.muted, fontSize: 11 }} axisLine={false} tickLine={false}
                tickFormatter={v => `$${(v as number / 1000).toFixed(0)}k`} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0D1117', border: `1px solid ${BRAND.borderCyan}`, borderRadius: 10, fontSize: 12 }}
                labelStyle={{ color: BRAND.muted }}
                formatter={(v: unknown, name: unknown) => [fmtCurrency(Number(v ?? 0)), String(name)]}
              />
              {AGENTS.map((ae, i) => (
                <Bar key={ae.id} dataKey={ae.name} stackId="a" fill={AE_COLORS[ae.name]}
                  radius={i === AGENTS.length - 1 ? [4, 4, 0, 0] : [0, 0, 0, 0]} />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── Residual Split Table ── */}
      <ResidualSplitSection />

      {/* ── Agent Roster ── */}
      <div className="rounded-2xl overflow-hidden" style={cardStyle}>
        <div className="px-6 py-4 border-b" style={{ borderColor: BRAND.border }}>
          <p className="text-[10px] font-bold tracking-[0.2em] uppercase mb-0.5" style={{ color: BRAND.muted }}>Agent Roster</p>
          <p className="text-base font-bold" style={{ color: BRAND.text }}>Account Executives</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead style={{ backgroundColor: `${BRAND.cyan}0A`, borderBottom: `1px solid ${BRAND.borderCyan}` }}>
              <tr>
                {['Name', 'Role', 'Base Split', 'Residual Split', 'This Month', 'YTD Total', 'Actions'].map((h, i) => (
                  <th key={h}
                    className={`${i >= 2 && i <= 5 ? 'text-right' : 'text-left'} px-5 py-3 text-[10px] uppercase tracking-widest font-semibold`}
                    style={{ color: `${BRAND.cyan}99` }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {AGENTS.map((ae, idx) => {
                const roleMeta = ROLE_META[ae.role]
                const isExpanded = expandedAE === ae.id
                return (
                  <>
                    <tr key={ae.id}
                      className="transition-colors"
                      style={{ borderBottom: `1px solid ${BRAND.border}` }}
                      onMouseEnter={e => (e.currentTarget as HTMLElement).style.backgroundColor = `${BRAND.cyan}06`}
                      onMouseLeave={e => (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'}
                    >
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                            style={{ backgroundColor: `${AE_COLORS[ae.name]}20`, color: AE_COLORS[ae.name] }}>
                            {ae.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <p className="text-sm font-semibold" style={{ color: BRAND.text }}>{ae.name}</p>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold"
                          style={{ backgroundColor: roleMeta.bg, color: roleMeta.color }}>
                          {ae.role}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-sm text-right" style={{ color: BRAND.muted }}>
                        {fmtPercent(ae.baseSplitPct)}
                      </td>
                      <td className="px-5 py-3.5 text-sm font-semibold text-right" style={{ color: BRAND.cyan }}>
                        {fmtPercent(ae.residualSplitPct)}
                      </td>
                      <td className="px-5 py-3.5 text-sm font-bold text-right" style={{ color: BRAND.success }}>
                        {fmtCurrency(ae.thisMonth)}
                      </td>
                      <td className="px-5 py-3.5 text-sm text-right" style={{ color: BRAND.text }}>
                        {fmtCurrency(ae.ytdTotal)}
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2 justify-end">
                          <button
                            onClick={() => setActiveModal(ae)}
                            className="px-3 py-1 rounded-lg text-xs font-semibold transition-all hover:opacity-80"
                            style={{ backgroundColor: `${BRAND.cyan}18`, color: BRAND.cyan, border: `1px solid ${BRAND.borderCyan}` }}>
                            Statement
                          </button>
                          <button
                            onClick={() => setExpandedAE(isExpanded ? null : ae.id)}
                            className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors hover:opacity-70"
                            style={{ backgroundColor: 'rgba(255,255,255,0.06)', color: BRAND.muted }}>
                            {isExpanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                          </button>
                        </div>
                      </td>
                    </tr>

                    {/* Expanded merchant mini-table */}
                    {isExpanded && (
                      <tr key={`${ae.id}-expanded`} style={{ borderBottom: `1px solid ${BRAND.border}` }}>
                        <td colSpan={7} className="px-5 pb-4 pt-2">
                          <div className="rounded-xl overflow-hidden"
                            style={{ backgroundColor: `${BRAND.cyan}06`, border: `1px solid ${BRAND.borderCyan}` }}>
                            <table className="w-full">
                              <thead>
                                <tr style={{ borderBottom: `1px solid ${BRAND.border}` }}>
                                  {['Merchant', 'Volume', 'Residual', 'AE Split'].map((h, i) => (
                                    <th key={h}
                                      className={`${i > 0 ? 'text-right' : 'text-left'} px-4 py-2 text-[10px] uppercase tracking-widest font-semibold`}
                                      style={{ color: BRAND.muted }}>{h}</th>
                                  ))}
                                </tr>
                              </thead>
                              <tbody>
                                {ae.merchantBreakdown.map((m, mi) => (
                                  <tr key={m.merchant}
                                    style={{ borderTop: mi > 0 ? `1px solid ${BRAND.border}` : undefined }}>
                                    <td className="px-4 py-2.5 text-xs" style={{ color: BRAND.text }}>{m.merchant}</td>
                                    <td className="px-4 py-2.5 text-xs text-right" style={{ color: BRAND.muted }}>{fmtCurrency(m.volume)}</td>
                                    <td className="px-4 py-2.5 text-xs text-right" style={{ color: BRAND.text }}>{fmtCurrency(m.residual)}</td>
                                    <td className="px-4 py-2.5 text-xs font-bold text-right" style={{ color: BRAND.success }}>{fmtCurrency(m.aeSplit)}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Commission Statement Modal ── */}
      {activeModal && (
        <StatementModal agent={activeModal} onClose={() => setActiveModal(null)} />
      )}
    </>
  )
}
