'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { LayoutGrid, List, Search, X, Plus } from 'lucide-react'
import type { Merchant, PipelineStage } from '@/lib/db'
import { fmtCurrency, fmtDate } from '@/lib/utils'

const CYAN = '#1EA8D4'

const STAGE_META: Record<PipelineStage, {
  label: string; color: string; bg: string; border: string
}> = {
  new_lead:                { label: 'New Lead',        color: '#93C5FD', bg: 'rgba(96,165,250,0.10)',  border: 'rgba(96,165,250,0.22)' },
  application_started:     { label: 'Application',     color: '#FCD34D', bg: 'rgba(251,191,36,0.10)',  border: 'rgba(251,191,36,0.22)' },
  submitted_to_processor:  { label: 'Submitted',       color: CYAN,      bg: 'rgba(30,168,212,0.10)',  border: 'rgba(30,168,212,0.22)' },
  underwriting:            { label: 'Underwriting',    color: '#F0B23E', bg: 'rgba(240,178,62,0.10)',  border: 'rgba(240,178,62,0.22)' },
  approved:                { label: 'Approved',        color: '#3DD68C', bg: 'rgba(61,214,140,0.10)',  border: 'rgba(61,214,140,0.22)' },
  live:                    { label: 'Live',             color: '#33BEDE', bg: 'rgba(70,212,242,0.12)',  border: 'rgba(70,212,242,0.28)' },
  closed_lost:             { label: 'Closed Lost',     color: 'rgba(255,255,255,0.28)', bg: 'rgba(255,255,255,0.04)', border: 'rgba(255,255,255,0.10)' },
}

const RISK_COLORS: Record<string, string> = {
  low:    '#3DD68C',
  medium: '#F0B23E',
  high:   '#E8504A',
}

const KANBAN_STAGES: PipelineStage[] = [
  'new_lead',
  'application_started',
  'submitted_to_processor',
  'underwriting',
  'approved',
  'live',
]

const CARD_STYLE: React.CSSProperties = {
  backgroundColor: '#141821',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: '14px',
}

function RiskBadge({ tier }: { tier?: string | null }) {
  if (!tier) return null
  const color = RISK_COLORS[tier.toLowerCase()] ?? 'rgba(255,255,255,0.4)'
  return (
    <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold capitalize"
      style={{ backgroundColor: `${color}18`, color, border: `1px solid ${color}40` }}>
      {tier} risk
    </span>
  )
}

function StageBadge({ stage }: { stage: PipelineStage }) {
  const meta = STAGE_META[stage]
  return (
    <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold"
      style={{ backgroundColor: meta.bg, color: meta.color, border: `1px solid ${meta.border}` }}>
      {meta.label}
    </span>
  )
}

function KanbanCard({ merchant, onStageChange }: {
  merchant: Merchant
  onStageChange: (id: string, stage: PipelineStage) => void
}) {
  const meta = STAGE_META[merchant.pipeline_stage]

  async function moveTo(stage: PipelineStage) {
    onStageChange(merchant.id, stage)
    await fetch(`/api/merchants/${merchant.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pipeline_stage: stage }),
    })
  }

  return (
    <div style={CARD_STYLE} className="p-4 flex flex-col gap-3">
      <div>
        <p className="text-sm font-bold leading-snug" style={{ color: 'rgba(255,255,255,0.9)' }}>
          {merchant.name}
        </p>
        {merchant.country && (
          <p className="text-[11px] mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>
            {merchant.country}
          </p>
        )}
      </div>

      {(merchant.monthly_volume || merchant.risk_tier) && (
        <div className="flex flex-wrap gap-1.5">
          {merchant.monthly_volume && (
            <span className="text-[10px] font-semibold" style={{ color: CYAN }}>
              {fmtCurrency(merchant.monthly_volume)}/mo
            </span>
          )}
          <RiskBadge tier={merchant.risk_tier} />
        </div>
      )}

      <div className="flex gap-1.5 flex-wrap">
        {merchant.pipeline_stage !== 'live' && merchant.pipeline_stage !== 'closed_lost' && (
          <button
            onClick={() => {
              const stages = KANBAN_STAGES
              const idx = stages.indexOf(merchant.pipeline_stage as PipelineStage)
              if (idx < stages.length - 1) moveTo(stages[idx + 1])
            }}
            className="flex-1 text-center text-[10px] font-semibold py-1.5 rounded-lg transition-opacity hover:opacity-80"
            style={{ backgroundColor: meta.bg, color: meta.color, border: `1px solid ${meta.border}` }}>
            Advance →
          </button>
        )}
        <Link href={`/admin/merchants/${merchant.id}`}
          className="flex-1 text-center text-[10px] font-semibold py-1.5 rounded-lg transition-opacity hover:opacity-80"
          style={{ backgroundColor: 'rgba(30,168,212,0.12)', color: CYAN, border: '1px solid rgba(30,168,212,0.22)' }}>
          View
        </Link>
      </div>
    </div>
  )
}

export default function MerchantsBoard() {
  const [merchants, setMerchants] = useState<Merchant[]>([])
  const [loading, setLoading]     = useState(true)
  const [view, setView]           = useState<'kanban' | 'list'>('kanban')
  const [showClosed, setShowClosed] = useState(false)
  const [search, setSearch]       = useState('')

  useEffect(() => {
    fetch('/api/merchants')
      .then(r => r.json())
      .then((data: Merchant[]) => { if (Array.isArray(data)) setMerchants(data) })
      .finally(() => setLoading(false))
  }, [])

  function handleStageChange(id: string, stage: PipelineStage) {
    setMerchants(prev => prev.map(m => m.id === id ? { ...m, pipeline_stage: stage } : m))
  }

  const active   = merchants.filter(m => m.pipeline_stage !== 'closed_lost')
  const closed   = merchants.filter(m => m.pipeline_stage === 'closed_lost')
  const displayed = showClosed ? merchants : active

  const filtered = displayed.filter(m => {
    const q = search.trim().toLowerCase()
    if (!q) return true
    return (
      m.name.toLowerCase().includes(q) ||
      (m.email ?? '').toLowerCase().includes(q) ||
      (m.country ?? '').toLowerCase().includes(q) ||
      (m.business_type ?? '').toLowerCase().includes(q) ||
      (m.risk_tier ?? '').toLowerCase().includes(q) ||
      STAGE_META[m.pipeline_stage]?.label.toLowerCase().includes(q)
    )
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>Loading merchants…</p>
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-wide"
            style={{
              background: 'linear-gradient(90deg, #C9D1D9 0%, #FFFFFF 45%, #8A929C 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
            Merchants
          </h1>
          <p className="text-sm mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>
            {active.length} active · {closed.length} closed
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center rounded-lg overflow-hidden"
            style={{ border: '1px solid rgba(30,168,212,0.2)' }}>
            <button onClick={() => setView('kanban')}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium transition-colors"
              style={{
                backgroundColor: view === 'kanban' ? CYAN : 'rgba(255,255,255,0.05)',
                color: view === 'kanban' ? '#0A0C12' : 'rgba(255,255,255,0.5)',
              }}>
              <LayoutGrid size={13} /> Pipeline
            </button>
            <button onClick={() => setView('list')}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium transition-colors"
              style={{
                backgroundColor: view === 'list' ? CYAN : 'rgba(255,255,255,0.05)',
                color: view === 'list' ? '#0A0C12' : 'rgba(255,255,255,0.5)',
              }}>
              <List size={13} /> List
            </button>
          </div>
          <Link href="/admin/merchants/new"
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-opacity hover:opacity-80"
            style={{ backgroundColor: CYAN, color: '#0A0C12' }}>
            <Plus size={14} /> New Merchant
          </Link>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-5">
        <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
          style={{ color: 'rgba(30,168,212,0.5)' }} />
        <input
          type="text"
          placeholder="Search by name, country, business type, stage…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-11 pr-10 py-2.5 text-sm rounded-xl focus:outline-none focus:ring-2"
          style={{
            backgroundColor: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(30,168,212,0.18)',
            color: 'rgba(255,255,255,0.85)',
            // @ts-expect-error vendor prefix
            '--tw-ring-color': 'rgba(30,168,212,0.25)',
          }}
        />
        {search && (
          <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2"
            style={{ color: 'rgba(30,168,212,0.6)' }}>
            <X size={13} />
          </button>
        )}
      </div>

      {merchants.length === 0 ? (
        <div className="rounded-xl p-16 text-center"
          style={{ backgroundColor: '#141821', border: '1px solid rgba(255,255,255,0.08)' }}>
          <p className="text-sm mb-3" style={{ color: 'rgba(255,255,255,0.4)' }}>No merchants yet.</p>
          <Link href="/admin/merchants/new"
            className="text-sm font-medium hover:opacity-80"
            style={{ color: CYAN }}>
            + Add your first merchant →
          </Link>
        </div>
      ) : view === 'kanban' ? (
        <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))' }}>
          {KANBAN_STAGES.map(stage => {
            const meta = STAGE_META[stage]
            const cols = filtered.filter(m => m.pipeline_stage === stage)
            return (
              <div key={stage} className="flex flex-col gap-3">
                <div className="flex items-center justify-between px-3 py-2.5 rounded-xl"
                  style={{ backgroundColor: meta.bg, border: `1px solid ${meta.border}` }}>
                  <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: meta.color }}>
                    {meta.label}
                  </span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                    style={{ backgroundColor: meta.bg, color: meta.color, border: `1px solid ${meta.border}` }}>
                    {cols.length}
                  </span>
                </div>
                <div className="flex flex-col gap-2">
                  {cols.length === 0 ? (
                    <div style={{ ...CARD_STYLE, opacity: 0.4 }}>
                      <p className="p-5 text-center text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>Empty</p>
                    </div>
                  ) : cols.map(m => (
                    <KanbanCard key={m.id} merchant={m} onStageChange={handleStageChange} />
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div>
          <div className="rounded-xl overflow-hidden"
            style={{ backgroundColor: '#141821', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead style={{ backgroundColor: 'rgba(30,168,212,0.06)', borderBottom: '1px solid rgba(30,168,212,0.12)' }}>
                  <tr>
                    {['Merchant', 'Stage', 'Country', 'Volume / mo', 'Risk', 'Added', ''].map(h => (
                      <th key={h} className="text-left px-5 py-3 text-[10px] uppercase tracking-widest font-semibold"
                        style={{ color: 'rgba(30,168,212,0.6)' }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
                  {filtered.map(m => (
                    <tr key={m.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-5 py-3">
                        <div>
                          <Link href={`/admin/merchants/${m.id}`}
                            className="text-sm font-semibold hover:underline"
                            style={{ color: CYAN }}>
                            {m.name}
                          </Link>
                          {m.email && (
                            <p className="text-[11px] mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>
                              {m.email}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="px-5 py-3"><StageBadge stage={m.pipeline_stage} /></td>
                      <td className="px-5 py-3 text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>
                        {m.country ?? '—'}
                      </td>
                      <td className="px-5 py-3 text-sm font-semibold" style={{ color: m.monthly_volume ? CYAN : 'rgba(255,255,255,0.3)' }}>
                        {m.monthly_volume ? fmtCurrency(m.monthly_volume) : '—'}
                      </td>
                      <td className="px-5 py-3"><RiskBadge tier={m.risk_tier} /></td>
                      <td className="px-5 py-3 text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>
                        {fmtDate(m.created_at)}
                      </td>
                      <td className="px-5 py-3">
                        <Link href={`/admin/merchants/${m.id}`}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-opacity hover:opacity-80"
                          style={{ backgroundColor: 'rgba(30,168,212,0.12)', color: CYAN, border: '1px solid rgba(30,168,212,0.22)' }}>
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          {closed.length > 0 && (
            <button onClick={() => setShowClosed(v => !v)}
              className="mt-3 text-xs transition-opacity hover:opacity-70"
              style={{ color: 'rgba(255,255,255,0.3)' }}>
              {showClosed
                ? '↑ Hide closed'
                : `↓ Show ${closed.length} closed merchant${closed.length !== 1 ? 's' : ''}`}
            </button>
          )}
        </div>
      )}
    </div>
  )
}
