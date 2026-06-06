'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { fetchMerchants } from '@/lib/merchants-db'
import type { MerchantRecord } from '@/lib/mock-merchants'
import { BRAND } from '@/lib/brand'
import {
  Search, X, TrendingUp, DollarSign, Users, ArrowRight,
  CheckCircle2, AlertCircle, Building2,
} from 'lucide-react'

function MerchantTabs({ active }: { active: 'all' | 'onboarding' | 'live' }) {
  const tabs = [
    { key: 'all' as const,        label: 'All Merchants', href: '/admin/merchants' },
    { key: 'onboarding' as const, label: 'Onboarding',    href: '/admin/onboarding-crm' },
    { key: 'live' as const,       label: 'Live',          href: '/admin/portfolio' },
  ]
  return (
    <div style={{ display: 'flex', gap: 2, borderBottom: `1px solid rgba(144,196,207,0.12)`, marginBottom: 24 }}>
      {tabs.map(t => (
        <Link key={t.key} href={t.href} style={{
          padding: '8px 16px', fontSize: 13, fontWeight: active === t.key ? 600 : 400,
          color: active === t.key ? BRAND.cyan : 'rgba(255,255,255,0.4)',
          borderBottom: active === t.key ? `2px solid ${BRAND.cyan}` : '2px solid transparent',
          textDecoration: 'none', letterSpacing: '0.02em', transition: 'color 0.15s',
        }}>
          {t.label}
        </Link>
      ))}
    </div>
  )
}

// ─── Formatters ───────────────────────────────────────────────────────────────

function fmtVolume(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`
  if (n >= 1_000)     return `$${(n / 1_000).toFixed(0)}K`
  return `$${n}`
}

function fmtCurrency(n: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency', currency: 'USD', maximumFractionDigits: 0,
  }).format(n)
}

function calcResidual(m: MerchantRecord): number {
  return (m.monthly_volume * (m.basis_points_earned ?? 15)) / 10000
}

// ─── Shared styles ────────────────────────────────────────────────────────────

const INPUT_STYLE: React.CSSProperties = {
  backgroundColor: 'rgba(255,255,255,0.05)',
  border: `1px solid ${BRAND.borderCyan}`,
  color: BRAND.text,
}

const CARD_STYLE: React.CSSProperties = {
  backgroundColor: BRAND.card,
  border: `1px solid ${BRAND.border}`,
  borderRadius: '14px',
}

// ─── Risk badge ───────────────────────────────────────────────────────────────

const RISK_COLORS: Record<string, string> = {
  low:    BRAND.success,
  medium: BRAND.warn,
  high:   BRAND.danger,
}

function RiskBadge({ risk }: { risk?: 'low' | 'medium' | 'high' }) {
  if (!risk) return null
  const color = RISK_COLORS[risk]
  return (
    <span
      className="inline-block px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wide"
      style={{ backgroundColor: `${color}18`, color, border: `1px solid ${color}40` }}
    >
      {risk}
    </span>
  )
}

// ─── Account type badge ───────────────────────────────────────────────────────

const ACCT_COLORS: Record<string, { color: string; bg: string }> = {
  'Card Present': { color: BRAND.cyan,      bg: 'rgba(144,196,207,0.12)' },
  'eCommerce':    { color: '#A78BFA',        bg: 'rgba(139,92,246,0.12)' },
  'MOTO':         { color: BRAND.warn,       bg: 'rgba(240,178,62,0.12)' },
  'ACH':          { color: BRAND.cyanDeep,  bg: 'rgba(14,143,184,0.12)' },
}

function AccountTypeBadge({ type }: { type: string }) {
  const c = ACCT_COLORS[type] ?? { color: BRAND.muted, bg: 'rgba(255,255,255,0.06)' }
  return (
    <span
      className="inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold"
      style={{ backgroundColor: c.bg, color: c.color, border: `1px solid ${c.color}30` }}
    >
      {type}
    </span>
  )
}

// ─── Stat card ────────────────────────────────────────────────────────────────

function StatCard({
  icon, label, value, sub, accent,
}: {
  icon: React.ReactNode
  label: string
  value: string
  sub?: string
  accent?: string
}) {
  return (
    <div
      className="flex items-center gap-4 px-5 py-4 rounded-2xl flex-1 min-w-[160px]"
      style={CARD_STYLE}
    >
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: `${accent ?? BRAND.cyan}18`, border: `1px solid ${accent ?? BRAND.cyan}30` }}
      >
        {icon}
      </div>
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-widest mb-0.5" style={{ color: BRAND.muted }}>
          {label}
        </p>
        <p className="text-xl font-bold leading-tight" style={{ color: accent ?? BRAND.cyan }}>
          {value}
        </p>
        {sub && (
          <p className="text-[10px] mt-0.5" style={{ color: BRAND.muted }}>{sub}</p>
        )}
      </div>
    </div>
  )
}

// ─── Loading skeleton ─────────────────────────────────────────────────────────

function TableSkeleton() {
  return (
    <div className="rounded-xl overflow-hidden" style={CARD_STYLE}>
      <div className="p-4 flex flex-col gap-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex gap-4 items-center animate-pulse">
            <div className="h-4 rounded-md flex-1" style={{ backgroundColor: 'rgba(255,255,255,0.06)' }} />
            <div className="h-4 rounded-md w-24" style={{ backgroundColor: 'rgba(255,255,255,0.04)' }} />
            <div className="h-4 rounded-md w-20" style={{ backgroundColor: 'rgba(255,255,255,0.04)' }} />
            <div className="h-4 rounded-md w-20" style={{ backgroundColor: 'rgba(255,255,255,0.04)' }} />
            <div className="h-4 rounded-md w-16" style={{ backgroundColor: 'rgba(255,255,255,0.04)' }} />
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Main board ───────────────────────────────────────────────────────────────

export default function PortfolioBoard() {
  const router = useRouter()
  const [merchants, setMerchants] = useState<MerchantRecord[]>([])
  const [loading, setLoading]     = useState(true)
  const [search, setSearch]       = useState('')

  // ── Load ──────────────────────────────────────────────────────────────────

  useEffect(() => {
    fetchMerchants()
      .then(all => setMerchants(all.filter(m => m.pipeline_stage === 'merchant_live')))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  // ── Derived stats ─────────────────────────────────────────────────────────

  const totalVolume    = merchants.reduce((s, m) => s + m.monthly_volume, 0)
  const totalResiduals = merchants.reduce((s, m) => s + calcResidual(m), 0)
  const avgTicket      = merchants.length
    ? Math.round(merchants.reduce((s, m) => s + m.avg_ticket, 0) / merchants.length)
    : 0

  // ── Filter ────────────────────────────────────────────────────────────────

  const filtered = search.trim()
    ? merchants.filter(m =>
        m.name.toLowerCase().includes(search.toLowerCase()) ||
        (m.dba_name ?? '').toLowerCase().includes(search.toLowerCase())
      )
    : merchants

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div>
      <MerchantTabs active="live" />
      {/* Header */}
      <div className="mb-6">
        <h1
          className="text-3xl font-bold tracking-tight"
          style={{
            background: `linear-gradient(90deg, ${BRAND.silver} 0%, ${BRAND.silverHi} 45%, ${BRAND.silverLo} 100%)`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Portfolio CRM
        </h1>
        <p className="text-sm mt-1 flex items-center gap-1.5" style={{ color: BRAND.muted }}>
          <CheckCircle2 size={12} style={{ color: BRAND.success }} />
          Live merchants generating residuals
        </p>
      </div>

      {/* Stat bar */}
      <div className="flex flex-wrap gap-3 mb-6">
        <StatCard
          icon={<Users size={16} style={{ color: BRAND.cyan }} />}
          label="Live Merchants"
          value={loading ? '—' : String(merchants.length)}
          sub="active accounts"
          accent={BRAND.cyan}
        />
        <StatCard
          icon={<TrendingUp size={16} style={{ color: BRAND.success }} />}
          label="Monthly Volume"
          value={loading ? '—' : fmtVolume(totalVolume)}
          sub="total processing"
          accent={BRAND.success}
        />
        <StatCard
          icon={<DollarSign size={16} style={{ color: '#FCD34D' }} />}
          label="Est. Monthly Residuals"
          value={loading ? '—' : fmtCurrency(totalResiduals)}
          sub="based on BPS earned"
          accent="#FCD34D"
        />
        <StatCard
          icon={<AlertCircle size={16} style={{ color: BRAND.cyanDeep }} />}
          label="Avg Ticket"
          value={loading ? '—' : fmtCurrency(avgTicket)}
          sub="across live accounts"
          accent={BRAND.cyanDeep}
        />
      </div>

      {/* Search */}
      <div className="relative mb-5">
        <Search
          size={14}
          className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
          style={{ color: `${BRAND.cyan}80` }}
        />
        <input
          type="text"
          placeholder="Search by merchant name…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full py-2.5 text-sm rounded-xl focus:outline-none transition-colors"
          style={{ ...INPUT_STYLE, paddingLeft: 44, paddingRight: search ? 40 : 16 }}
        />
        {search && (
          <button
            onClick={() => setSearch('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 hover:opacity-70 transition-opacity"
            style={{ color: `${BRAND.cyan}99` }}
          >
            <X size={13} />
          </button>
        )}
      </div>

      {/* Table / states */}
      {loading ? (
        <TableSkeleton />
      ) : merchants.length === 0 ? (
        /* Empty state */
        <div
          className="rounded-xl p-16 text-center"
          style={CARD_STYLE}
        >
          <Building2 size={32} className="mx-auto mb-3" style={{ color: BRAND.muted, opacity: 0.4 }} />
          <p className="text-sm font-semibold mb-1" style={{ color: BRAND.text }}>No live merchants yet.</p>
          <p className="text-sm max-w-sm mx-auto" style={{ color: BRAND.muted }}>
            Merchants graduate here when they reach the Live stage in Pipeline.
          </p>
        </div>
      ) : (
        <div className="rounded-xl overflow-hidden" style={{ backgroundColor: BRAND.card, border: `1px solid ${BRAND.border}` }}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead style={{ backgroundColor: `${BRAND.cyan}0D`, borderBottom: `1px solid ${BRAND.borderCyan}` }}>
                <tr>
                  {['Business Name', 'Account Type', 'Monthly Volume', 'Avg Ticket', 'Processor', 'Partner', 'Est. Residual', 'Risk', ''].map(col => (
                    <th
                      key={col}
                      className="text-left px-4 py-3 text-[10px] uppercase tracking-widest font-semibold whitespace-nowrap"
                      style={{ color: `${BRAND.cyan}99` }}
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y" style={{ borderColor: BRAND.border }}>
                {filtered.map(m => {
                  const residual = calcResidual(m)
                  return (
                    <tr
                      key={m.id}
                      className="transition-colors"
                      style={{ backgroundColor: 'transparent', cursor: 'pointer' }}
                      onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.02)')}
                      onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                      onClick={() => router.push(`/admin/merchants/${m.id}`)}
                    >
                      {/* Business Name */}
                      <td className="px-4 py-3">
                        <p className="text-sm font-bold" style={{ color: BRAND.cyan }}>{m.name}</p>
                        {m.dba_name && (
                          <p className="text-[10px] mt-0.5" style={{ color: BRAND.muted }}>
                            DBA: {m.dba_name}
                          </p>
                        )}
                      </td>

                      {/* Account Type */}
                      <td className="px-4 py-3">
                        <AccountTypeBadge type={m.account_type} />
                      </td>

                      {/* Monthly Volume */}
                      <td className="px-4 py-3">
                        <span className="text-sm font-bold" style={{ color: BRAND.text }}>
                          {fmtVolume(m.monthly_volume)}
                        </span>
                        <span className="text-[9px] ml-1 opacity-50" style={{ color: BRAND.muted }}>/mo</span>
                      </td>

                      {/* Avg Ticket */}
                      <td className="px-4 py-3 text-sm" style={{ color: BRAND.muted }}>
                        {fmtCurrency(m.avg_ticket)}
                      </td>

                      {/* Processor */}
                      <td className="px-4 py-3">
                        {m.processor ? (
                          <span className="text-xs font-medium" style={{ color: BRAND.text }}>{m.processor}</span>
                        ) : (
                          <span className="text-[10px]" style={{ color: 'rgba(255,255,255,0.2)' }}>—</span>
                        )}
                      </td>

                      {/* Partner */}
                      <td className="px-4 py-3">
                        <p className="text-xs" style={{ color: BRAND.muted }}>{m.partner}</p>
                        <p className="text-[10px] font-mono mt-0.5" style={{ color: `${BRAND.muted}80` }}>{m.partner_iso}</p>
                      </td>

                      {/* Est. Residual */}
                      <td className="px-4 py-3">
                        <span className="text-sm font-bold" style={{ color: '#FCD34D' }}>
                          {fmtCurrency(residual)}
                        </span>
                        <p className="text-[9px] mt-0.5" style={{ color: BRAND.muted }}>
                          {m.basis_points_earned ?? 15} BPS
                        </p>
                      </td>

                      {/* Risk */}
                      <td className="px-4 py-3">
                        <RiskBadge risk={m.risk} />
                      </td>

                      {/* Action */}
                      <td className="px-4 py-3">
                        <button
                          onClick={e => { e.stopPropagation(); router.push(`/admin/merchants/${m.id}`) }}
                          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-opacity hover:opacity-80 whitespace-nowrap"
                          style={{ backgroundColor: `${BRAND.cyan}12`, color: BRAND.cyan, border: `1px solid ${BRAND.borderCyan}` }}
                        >
                          View <ArrowRight size={11} />
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>

            {/* No search results */}
            {filtered.length === 0 && merchants.length > 0 && (
              <div className="py-10 text-center">
                <p className="text-sm" style={{ color: BRAND.muted }}>No merchants match your search.</p>
              </div>
            )}
          </div>

          {/* Table footer */}
          <div
            className="px-5 py-3 flex items-center justify-between flex-wrap gap-3"
            style={{ borderTop: `1px solid ${BRAND.border}` }}
          >
            <span className="text-xs" style={{ color: BRAND.muted }}>
              {filtered.length} of {merchants.length} live merchants shown
            </span>
            <div className="flex items-center gap-4 text-xs" style={{ color: BRAND.muted }}>
              <span>
                Volume:{' '}
                <strong style={{ color: BRAND.text }}>
                  {fmtVolume(filtered.reduce((s, m) => s + m.monthly_volume, 0))}/mo
                </strong>
              </span>
              <span>
                Residuals:{' '}
                <strong style={{ color: '#FCD34D' }}>
                  {fmtCurrency(filtered.reduce((s, m) => s + calcResidual(m), 0))}/mo
                </strong>
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
