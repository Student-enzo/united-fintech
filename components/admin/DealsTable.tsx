'use client'

import { useState, useMemo, useCallback, useRef, useEffect } from 'react'
import {
  Search, X, Plus, ChevronDown, ChevronUp, ChevronsUpDown,
  MoreHorizontal, Eye, Pencil, FileDown, Copy, Calculator,
  Download, AlertCircle, TrendingUp, Clock, CheckCircle2,
  ExternalLink, FileText,
} from 'lucide-react'
import { fmtCurrency, fmtDate } from '@/lib/utils'
import { BRAND } from '@/lib/brand'

// ── Types ────────────────────────────────────────────────────────────────────

type DealStatus = 'draft' | 'sent' | 'viewed' | 'accepted' | 'declined'

type Deal = {
  id: string
  deal_number: string
  merchant: string
  account_type: string
  proposed_rate: string          // e.g. "IC+ 0.20% + $0.10"
  est_monthly_volume: number
  status: DealStatus
  created_at: string
  notes?: string
}

type SortKey = keyof Pick<Deal, 'merchant' | 'account_type' | 'proposed_rate' | 'est_monthly_volume' | 'status' | 'created_at'>
type SortDir = 'asc' | 'desc'

// ── Mock data ─────────────────────────────────────────────────────────────────

const MOCK_DEALS: Deal[] = [
  {
    id: 'd-001', deal_number: 'DL-0001', merchant: 'Seaside Surf Co.',
    account_type: 'Card Present', proposed_rate: 'IC+ 0.20% + $0.10',
    est_monthly_volume: 85000, status: 'accepted', created_at: '2026-03-12',
    notes: 'High-volume retail — no chargeback history.',
  },
  {
    id: 'd-002', deal_number: 'DL-0002', merchant: 'TropicFuel LLC',
    account_type: 'eCommerce', proposed_rate: 'IC+ 0.30% + $0.15',
    est_monthly_volume: 220000, status: 'sent', created_at: '2026-04-01',
  },
  {
    id: 'd-003', deal_number: 'DL-0003', merchant: 'Harbor Dental Group',
    account_type: 'MOTO', proposed_rate: 'Flat 2.50% + $0.25',
    est_monthly_volume: 42000, status: 'viewed', created_at: '2026-04-15',
    notes: 'Phone-order clinic — prefers simple flat model.',
  },
  {
    id: 'd-004', deal_number: 'DL-0004', merchant: 'Oceanic Tours Ltd.',
    account_type: 'Card Present', proposed_rate: 'IC+ 0.15% + $0.08',
    est_monthly_volume: 310000, status: 'draft', created_at: '2026-05-02',
  },
  {
    id: 'd-005', deal_number: 'DL-0005', merchant: 'BlueFin Analytics',
    account_type: 'eCommerce', proposed_rate: 'IC+ 0.25% + $0.12',
    est_monthly_volume: 180000, status: 'accepted', created_at: '2026-05-10',
    notes: 'SaaS subscription model, avg ticket $149.',
  },
  {
    id: 'd-006', deal_number: 'DL-0006', merchant: 'Coral Bay Resorts',
    account_type: 'ACH', proposed_rate: '0.75% + $0.30 (ACH)',
    est_monthly_volume: 490000, status: 'declined', created_at: '2026-05-18',
    notes: 'Risk review — excessive refund rate flagged.',
  },
  {
    id: 'd-007', deal_number: 'DL-0007', merchant: 'NautiCart Inc.',
    account_type: 'eCommerce', proposed_rate: 'IC+ 0.28% + $0.14',
    est_monthly_volume: 97000, status: 'sent', created_at: '2026-05-22',
  },
  {
    id: 'd-008', deal_number: 'DL-0008', merchant: 'Windward Freight',
    account_type: 'Card Present', proposed_rate: 'IC+ 0.18% + $0.09',
    est_monthly_volume: 145000, status: 'viewed', created_at: '2026-05-29',
  },
]

// ── Status config ─────────────────────────────────────────────────────────────

const STATUS_META: Record<DealStatus, { label: string; color: string; bg: string; border: string; icon: React.ReactNode }> = {
  draft:    { label: 'Draft',    color: 'rgba(255,255,255,0.45)', bg: 'rgba(255,255,255,0.06)', border: 'rgba(255,255,255,0.12)', icon: <Clock size={10} /> },
  sent:     { label: 'Sent',     color: BRAND.cyan,               bg: 'rgba(144,196,207,0.10)',  border: 'rgba(144,196,207,0.22)',  icon: <TrendingUp size={10} /> },
  viewed:   { label: 'Viewed',   color: BRAND.warn,               bg: 'rgba(240,178,62,0.10)',  border: 'rgba(240,178,62,0.22)',  icon: <Eye size={10} /> },
  accepted: { label: 'Accepted', color: BRAND.success,            bg: 'rgba(61,214,140,0.10)',  border: 'rgba(61,214,140,0.22)',  icon: <CheckCircle2 size={10} /> },
  declined: { label: 'Declined', color: BRAND.danger,             bg: 'rgba(232,80,74,0.08)',   border: 'rgba(232,80,74,0.18)',   icon: <AlertCircle size={10} /> },
}

const ALL_STATUSES: Array<DealStatus | 'all'> = ['all', 'draft', 'sent', 'viewed', 'accepted', 'declined']

// ── Sub-components ────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: DealStatus }) {
  const m = STATUS_META[status]
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wide"
      style={{ backgroundColor: m.bg, color: m.color, border: `1px solid ${m.border}` }}>
      {m.icon}{m.label}
    </span>
  )
}

function SortIcon({ col, sortKey, sortDir }: { col: SortKey; sortKey: SortKey; sortDir: SortDir }) {
  if (col !== sortKey) return <ChevronsUpDown size={12} style={{ color: 'rgba(255,255,255,0.2)' }} />
  return sortDir === 'asc'
    ? <ChevronUp size={12} style={{ color: BRAND.cyan }} />
    : <ChevronDown size={12} style={{ color: BRAND.cyan }} />
}

// ── Rate Calculator Modal ─────────────────────────────────────────────────────

function RateCalculatorModal({ deal, onClose }: { deal: Deal; onClose: () => void }) {
  const [volume, setVolume] = useState(String(deal.est_monthly_volume))
  const [avgTicket, setAvgTicket] = useState('150')

  const vol = parseFloat(volume.replace(/,/g, '')) || 0
  const ticket = parseFloat(avgTicket) || 1

  // Parse proposed rate — best-effort
  const icPlusMatch = deal.proposed_rate.match(/([\d.]+)%\s*\+\s*\$([\d.]+)/)
  const flatMatch   = deal.proposed_rate.match(/Flat\s+([\d.]+)%\s*\+\s*\$([\d.]+)/i)
  const achMatch    = deal.proposed_rate.match(/([\d.]+)%\s*\+\s*\$([\d.]+)\s*\(ACH\)/i)

  const pctFee   = icPlusMatch ? parseFloat(icPlusMatch[1]) / 100
                 : flatMatch   ? parseFloat(flatMatch[1]) / 100
                 : achMatch    ? parseFloat(achMatch[1]) / 100 : 0.0025
  const txnFee   = icPlusMatch ? parseFloat(icPlusMatch[2])
                 : flatMatch   ? parseFloat(flatMatch[2])
                 : achMatch    ? parseFloat(achMatch[2]) : 0.15

  const numTxns        = vol / ticket
  const proposedCost   = vol * pctFee + numTxns * txnFee
  const flatRate3      = vol * 0.03
  const annualSavings  = (flatRate3 - proposedCost) * 12
  const effectiveRate  = vol > 0 ? (proposedCost / vol) * 100 : 0

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}>
      <div className="w-full max-w-md rounded-2xl p-6"
        style={{ backgroundColor: BRAND.card, border: `1px solid ${BRAND.borderCyan}`, boxShadow: BRAND.glowCyan }}>

        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <Calculator size={18} style={{ color: BRAND.cyan }} />
            <h3 className="text-base font-bold" style={{ color: BRAND.text }}>Rate Calculator</h3>
          </div>
          <button onClick={onClose} style={{ color: BRAND.muted }} className="hover:opacity-70 transition-opacity">
            <X size={18} />
          </button>
        </div>

        <p className="text-xs mb-4" style={{ color: BRAND.muted }}>
          {deal.merchant} &mdash; <span style={{ color: BRAND.cyan }}>{deal.proposed_rate}</span>
        </p>

        {/* Inputs */}
        <div className="space-y-3 mb-5">
          <label className="block">
            <span className="text-xs font-medium uppercase tracking-wide" style={{ color: BRAND.muted }}>
              Monthly Volume ($)
            </span>
            <input type="number" value={volume} onChange={e => setVolume(e.target.value)}
              className="mt-1 w-full px-3 py-2 rounded-lg text-sm focus:outline-none"
              style={{ backgroundColor: 'rgba(255,255,255,0.05)', border: `1px solid ${BRAND.borderCyan}`, color: BRAND.text }} />
          </label>
          <label className="block">
            <span className="text-xs font-medium uppercase tracking-wide" style={{ color: BRAND.muted }}>
              Avg. Ticket Size ($)
            </span>
            <input type="number" value={avgTicket} onChange={e => setAvgTicket(e.target.value)}
              className="mt-1 w-full px-3 py-2 rounded-lg text-sm focus:outline-none"
              style={{ backgroundColor: 'rgba(255,255,255,0.05)', border: `1px solid ${BRAND.borderCyan}`, color: BRAND.text }} />
          </label>
        </div>

        {/* Results */}
        <div className="rounded-xl p-4 space-y-3"
          style={{ backgroundColor: 'rgba(144,196,207,0.05)', border: `1px solid ${BRAND.borderCyan}` }}>
          <div className="flex justify-between text-sm">
            <span style={{ color: BRAND.muted }}>Projected Monthly Cost</span>
            <span className="font-semibold" style={{ color: BRAND.text }}>
              {fmtCurrency(proposedCost)}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span style={{ color: BRAND.muted }}>Effective Rate</span>
            <span className="font-semibold" style={{ color: BRAND.cyan }}>
              {effectiveRate.toFixed(3)}%
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span style={{ color: BRAND.muted }}>Est. at 3% Flat Rate</span>
            <span className="font-semibold" style={{ color: 'rgba(255,255,255,0.45)' }}>
              {fmtCurrency(flatRate3)}
            </span>
          </div>
          <div className="pt-2 border-t" style={{ borderColor: BRAND.borderCyan }}>
            <div className="flex justify-between text-sm">
              <span className="font-semibold" style={{ color: BRAND.muted }}>Est. Annual Savings vs. 3%</span>
              <span className="text-base font-bold" style={{ color: annualSavings > 0 ? BRAND.success : BRAND.danger }}>
                {annualSavings > 0 ? '+' : ''}{fmtCurrency(annualSavings)}
              </span>
            </div>
          </div>
        </div>

        <p className="text-[10px] mt-3" style={{ color: 'rgba(255,255,255,0.25)' }}>
          Estimates only. IC+ interchange costs vary by card type. Consult your ISO agreement.
        </p>
      </div>
    </div>
  )
}

// ── Add Deal Modal ────────────────────────────────────────────────────────────

function AddDealModal({ onClose, onAdd }: { onClose: () => void; onAdd: (d: Deal) => void }) {
  const [form, setForm] = useState({
    merchant: '', account_type: 'Card Present', proposed_rate: '',
    est_monthly_volume: '', notes: '',
  })

  const accountTypes = ['Card Present', 'eCommerce', 'MOTO', 'ACH']

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const newDeal: Deal = {
      id: `d-${Date.now()}`,
      deal_number: `DL-${String(Math.floor(Math.random() * 9000) + 1000)}`,
      merchant: form.merchant,
      account_type: form.account_type,
      proposed_rate: form.proposed_rate,
      est_monthly_volume: parseFloat(form.est_monthly_volume) || 0,
      status: 'draft',
      created_at: new Date().toISOString().split('T')[0],
      notes: form.notes || undefined,
    }
    onAdd(newDeal)
    onClose()
  }

  const fieldStyle = {
    backgroundColor: 'rgba(255,255,255,0.05)',
    border: `1px solid ${BRAND.borderCyan}`,
    color: BRAND.text,
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}>
      <div className="w-full max-w-lg rounded-2xl p-6"
        style={{ backgroundColor: BRAND.card, border: `1px solid ${BRAND.borderCyan}`, boxShadow: BRAND.glowCyan }}>

        <div className="flex items-center justify-between mb-5">
          <h3 className="text-base font-bold" style={{ color: BRAND.text }}>New Deal / Proposal</h3>
          <button onClick={onClose} style={{ color: BRAND.muted }} className="hover:opacity-70 transition-opacity">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block">
            <span className="text-xs font-medium uppercase tracking-wide" style={{ color: BRAND.muted }}>Merchant Name *</span>
            <input required type="text" value={form.merchant} onChange={e => setForm(p => ({ ...p, merchant: e.target.value }))}
              placeholder="e.g. Coral Bay Resorts"
              className="mt-1 w-full px-3 py-2.5 rounded-lg text-sm focus:outline-none"
              style={fieldStyle} />
          </label>

          <label className="block">
            <span className="text-xs font-medium uppercase tracking-wide" style={{ color: BRAND.muted }}>Account Type *</span>
            <select required value={form.account_type} onChange={e => setForm(p => ({ ...p, account_type: e.target.value }))}
              className="mt-1 w-full px-3 py-2.5 rounded-lg text-sm focus:outline-none appearance-none"
              style={fieldStyle}>
              {accountTypes.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </label>

          <label className="block">
            <span className="text-xs font-medium uppercase tracking-wide" style={{ color: BRAND.muted }}>Proposed Rate *</span>
            <input required type="text" value={form.proposed_rate} onChange={e => setForm(p => ({ ...p, proposed_rate: e.target.value }))}
              placeholder="e.g. IC+ 0.20% + $0.10"
              className="mt-1 w-full px-3 py-2.5 rounded-lg text-sm focus:outline-none"
              style={fieldStyle} />
          </label>

          <label className="block">
            <span className="text-xs font-medium uppercase tracking-wide" style={{ color: BRAND.muted }}>Est. Monthly Volume ($) *</span>
            <input required type="number" min="0" value={form.est_monthly_volume}
              onChange={e => setForm(p => ({ ...p, est_monthly_volume: e.target.value }))}
              placeholder="e.g. 150000"
              className="mt-1 w-full px-3 py-2.5 rounded-lg text-sm focus:outline-none"
              style={fieldStyle} />
          </label>

          <label className="block">
            <span className="text-xs font-medium uppercase tracking-wide" style={{ color: BRAND.muted }}>Notes</span>
            <textarea value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))}
              placeholder="Internal notes (optional)"
              rows={3}
              className="mt-1 w-full px-3 py-2.5 rounded-lg text-sm focus:outline-none resize-none"
              style={fieldStyle} />
          </label>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 py-2.5 rounded-lg text-sm font-semibold transition-opacity hover:opacity-70"
              style={{ backgroundColor: 'rgba(255,255,255,0.06)', color: BRAND.muted, border: `1px solid ${BRAND.border}` }}>
              Cancel
            </button>
            <button type="submit"
              className="flex-1 py-2.5 rounded-lg text-sm font-semibold transition-opacity hover:opacity-80"
              style={{ backgroundColor: BRAND.cyan, color: '#1c1c1c' }}>
              Create Deal
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ── Row action menu ───────────────────────────────────────────────────────────

function RowMenu({ deal, onCalc, onDuplicate }: { deal: Deal; onCalc: () => void; onDuplicate: () => void }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  const itemStyle = "flex items-center gap-2 w-full text-left px-3 py-2 text-xs rounded-lg transition-colors hover:bg-white/[0.06]"

  return (
    <div className="relative" ref={ref}>
      <button onClick={() => setOpen(p => !p)}
        className="p-1.5 rounded-lg transition-colors hover:bg-white/[0.06]"
        style={{ color: BRAND.muted }}>
        <MoreHorizontal size={15} />
      </button>
      {open && (
        <div className="absolute right-0 top-8 z-20 w-44 rounded-xl py-1 shadow-xl"
          style={{ backgroundColor: '#282626', border: `1px solid ${BRAND.border}` }}>
          <button className={itemStyle} style={{ color: BRAND.text }} onClick={() => setOpen(false)}>
            <Eye size={13} style={{ color: BRAND.cyan }} /> View
          </button>
          <button className={itemStyle} style={{ color: BRAND.text }} onClick={() => setOpen(false)}>
            <Pencil size={13} style={{ color: BRAND.cyan }} /> Edit
          </button>
          <button className={itemStyle} style={{ color: BRAND.text }}
            onClick={() => { onCalc(); setOpen(false) }}>
            <Calculator size={13} style={{ color: BRAND.cyan }} /> Rate Calculator
          </button>
          <button className={itemStyle} style={{ color: BRAND.text }} onClick={() => setOpen(false)}>
            <FileDown size={13} style={{ color: BRAND.cyan }} /> Download PDF
          </button>
          <div className="my-1 border-t" style={{ borderColor: BRAND.border }} />
          <button className={itemStyle} style={{ color: BRAND.text }}
            onClick={() => { onDuplicate(); setOpen(false) }}>
            <Copy size={13} style={{ color: BRAND.muted }} /> Duplicate
          </button>
        </div>
      )}
    </div>
  )
}

// ── Export CSV helper ─────────────────────────────────────────────────────────

function exportCSV(deals: Deal[]) {
  const headers = ['Deal #', 'Merchant', 'Account Type', 'Proposed Rate', 'Est. Monthly Volume', 'Status', 'Created Date']
  const rows = deals.map(d => [
    d.deal_number, d.merchant, d.account_type, d.proposed_rate,
    d.est_monthly_volume, d.status, d.created_at,
  ])
  const csv = [headers, ...rows].map(r => r.map(v => `"${v}"`).join(',')).join('\n')
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `deals-${new Date().toISOString().split('T')[0]}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

// ── Main component ────────────────────────────────────────────────────────────

const PAGE_SIZE = 5

export default function DealsTable() {
  const [deals, setDeals]           = useState<Deal[]>(MOCK_DEALS)
  const [search, setSearch]         = useState('')
  const [activeStatus, setActive]   = useState<DealStatus | 'all'>('all')
  const [sortKey, setSortKey]       = useState<SortKey>('created_at')
  const [sortDir, setSortDir]       = useState<SortDir>('desc')
  const [page, setPage]             = useState(1)
  const [calcDeal, setCalcDeal]     = useState<Deal | null>(null)
  const [showAdd, setShowAdd]       = useState(false)

  const handleSort = useCallback((col: SortKey) => {
    setSortKey(prev => {
      if (prev === col) { setSortDir(d => d === 'asc' ? 'desc' : 'asc'); return col }
      setSortDir('asc')
      return col
    })
    setPage(1)
  }, [])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return deals
      .filter(d => activeStatus === 'all' || d.status === activeStatus)
      .filter(d => !q || [d.merchant, d.account_type, d.proposed_rate, d.deal_number, d.status]
        .some(v => v.toLowerCase().includes(q)))
      .sort((a, b) => {
        let va: string | number = a[sortKey] ?? ''
        let vb: string | number = b[sortKey] ?? ''
        if (typeof va === 'string') va = va.toLowerCase()
        if (typeof vb === 'string') vb = vb.toLowerCase()
        const cmp = va < vb ? -1 : va > vb ? 1 : 0
        return sortDir === 'asc' ? cmp : -cmp
      })
  }, [deals, search, activeStatus, sortKey, sortDir])

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  function duplicateDeal(d: Deal) {
    const copy: Deal = {
      ...d,
      id: `d-${Date.now()}`,
      deal_number: `DL-${String(Math.floor(Math.random() * 9000) + 1000)}-C`,
      status: 'draft',
      created_at: new Date().toISOString().split('T')[0],
    }
    setDeals(prev => [copy, ...prev])
  }

  // Stat pills
  const statCounts = useMemo(() => {
    return ALL_STATUSES.reduce((acc, s) => {
      acc[s] = s === 'all' ? deals.length : deals.filter(d => d.status === s).length
      return acc
    }, {} as Record<DealStatus | 'all', number>)
  }, [deals])

  const thStyle: React.CSSProperties = {
    color: 'rgba(144,196,207,0.6)',
    fontSize: '10px',
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    fontWeight: 600,
    cursor: 'pointer',
    userSelect: 'none',
    whiteSpace: 'nowrap',
  }

  const SORTABLE: { key: SortKey; label: string }[] = [
    { key: 'merchant',           label: 'Merchant'         },
    { key: 'account_type',       label: 'Account Type'     },
    { key: 'proposed_rate',      label: 'Proposed Rate'    },
    { key: 'est_monthly_volume', label: 'Est. Mo. Volume'  },
    { key: 'status',             label: 'Status'           },
    { key: 'created_at',         label: 'Created'          },
  ]

  return (
    <div>
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-wide"
            style={{ background: 'linear-gradient(90deg,#C9D1D9 0%,#FFF 45%,#8A929C 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Deals &amp; Proposals
          </h1>
          <p className="text-sm mt-0.5" style={{ color: BRAND.muted }}>
            {deals.length} total &middot;{' '}
            <span style={{ color: BRAND.success }}>{deals.filter(d => d.status === 'accepted').length} accepted</span>
            {' '}&middot;{' '}
            <span style={{ color: BRAND.cyan }}>{deals.filter(d => d.status === 'sent').length} sent</span>
          </p>
        </div>
        <div className="flex items-center gap-2 self-start">
          <button onClick={() => exportCSV(filtered)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-opacity hover:opacity-70"
            style={{ backgroundColor: 'rgba(255,255,255,0.06)', color: BRAND.muted, border: `1px solid ${BRAND.border}` }}>
            <Download size={13} /> Export CSV
          </button>
          <button onClick={() => setShowAdd(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-opacity hover:opacity-80"
            style={{ backgroundColor: BRAND.cyan, color: '#1c1c1c' }}>
            <Plus size={14} /> New Deal
          </button>
        </div>
      </div>

      {/* ── Search ── */}
      <div className="relative mb-4">
        <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
          style={{ color: 'rgba(144,196,207,0.5)' }} />
        <input type="text" placeholder="Search merchant, account type, rate, or status…"
          value={search} onChange={e => { setSearch(e.target.value); setPage(1) }}
          className="w-full pl-11 pr-10 py-2.5 text-sm rounded-xl focus:outline-none"
          style={{ backgroundColor: 'rgba(255,255,255,0.05)', border: `1px solid ${BRAND.borderCyan}`, color: BRAND.text }} />
        {search && (
          <button onClick={() => { setSearch(''); setPage(1) }}
            className="absolute right-3 top-1/2 -translate-y-1/2 transition-opacity hover:opacity-70"
            style={{ color: 'rgba(144,196,207,0.6)' }}>
            <X size={13} />
          </button>
        )}
      </div>

      {/* ── Status filter tabs ── */}
      <div className="flex flex-wrap gap-1.5 mb-5">
        {ALL_STATUSES.map(s => {
          const meta = s === 'all' ? null : STATUS_META[s]
          const isActive = activeStatus === s
          return (
            <button key={s}
              onClick={() => { setActive(s); setPage(1) }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
              style={{
                backgroundColor: isActive ? (meta ? meta.bg : 'rgba(144,196,207,0.12)') : 'rgba(255,255,255,0.04)',
                color:           isActive ? (meta ? meta.color : BRAND.cyan) : BRAND.muted,
                border:          `1px solid ${isActive ? (meta ? meta.border : 'rgba(144,196,207,0.35)') : BRAND.border}`,
              }}>
              {meta?.icon}
              {s === 'all' ? 'All' : STATUS_META[s as DealStatus].label}
              <span className="ml-0.5 opacity-70">({statCounts[s]})</span>
            </button>
          )
        })}
      </div>

      {/* ── Table ── */}
      {paged.length === 0 ? (
        <div className="rounded-xl p-16 text-center"
          style={{ backgroundColor: BRAND.card, border: `1px solid ${BRAND.border}` }}>
          <p className="text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>
            {search || activeStatus !== 'all' ? 'No deals match your filters.' : 'No deals yet. Create your first proposal.'}
          </p>
        </div>
      ) : (
        <div className="rounded-xl overflow-hidden"
          style={{ backgroundColor: BRAND.card, border: `1px solid ${BRAND.border}` }}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead style={{ backgroundColor: 'rgba(144,196,207,0.06)', borderBottom: '1px solid rgba(144,196,207,0.12)' }}>
                <tr>
                  <th className="text-left px-5 py-3" style={thStyle}>Deal #</th>
                  {SORTABLE.map(({ key, label }) => (
                    <th key={key} className="text-left px-5 py-3" style={thStyle}
                      onClick={() => handleSort(key)}>
                      <span className="inline-flex items-center gap-1">
                        {label} <SortIcon col={key} sortKey={sortKey} sortDir={sortDir} />
                      </span>
                    </th>
                  ))}
                  <th className="px-5 py-3" style={{ ...thStyle, cursor: 'default' }} />
                </tr>
              </thead>
              <tbody>
                {paged.map((d, i) => (
                  <tr key={d.id}
                    className="transition-colors hover:bg-white/[0.025]"
                    style={{ borderTop: i === 0 ? 'none' : `1px solid ${BRAND.border}` }}>
                    <td className="px-5 py-3.5 font-mono text-xs font-bold" style={{ color: BRAND.cyan }}>
                      {d.deal_number}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="text-sm font-semibold" style={{ color: BRAND.text }}>
                        <a href="/admin/merchants" className="hover:underline font-semibold" style={{ color: BRAND.cyan }}>
                          {d.merchant}<ExternalLink size={11} style={{ display: 'inline', marginLeft: 4 }} />
                        </a>
                      </div>
                      {d.notes && (
                        <div className="text-[10px] mt-0.5 truncate max-w-[180px]" style={{ color: BRAND.muted }}>
                          {d.notes}
                        </div>
                      )}
                    </td>
                    <td className="px-5 py-3.5 text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>
                      {d.account_type}
                    </td>
                    <td className="px-5 py-3.5 text-sm font-mono" style={{ color: BRAND.cyanBright }}>
                      {d.proposed_rate}
                    </td>
                    <td className="px-5 py-3.5 text-sm font-semibold" style={{ color: BRAND.cyan }}>
                      {fmtCurrency(d.est_monthly_volume)}
                    </td>
                    <td className="px-5 py-3.5">
                      <StatusBadge status={d.status} />
                    </td>
                    <td className="px-5 py-3.5 text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>
                      {fmtDate(d.created_at)}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        {d.status === 'accepted' && (
                          <button className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-semibold"
                            style={{ backgroundColor: 'rgba(61,214,140,0.1)', color: '#6EE7B7', border: '1px solid rgba(61,214,140,0.25)' }}>
                            <FileText size={10} /> Convert to MPA
                          </button>
                        )}
                        <RowMenu deal={d} onCalc={() => setCalcDeal(d)} onDuplicate={() => duplicateDeal(d)} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ── Pagination ── */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-5 py-3"
              style={{ borderTop: `1px solid ${BRAND.border}` }}>
              <p className="text-xs" style={{ color: BRAND.muted }}>
                {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
              </p>
              <div className="flex gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                  <button key={p} onClick={() => setPage(p)}
                    className="w-7 h-7 rounded-lg text-xs font-semibold transition-all"
                    style={{
                      backgroundColor: p === page ? BRAND.cyan : 'rgba(255,255,255,0.04)',
                      color: p === page ? '#1c1c1c' : BRAND.muted,
                      border: `1px solid ${p === page ? BRAND.cyan : BRAND.border}`,
                    }}>
                    {p}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Modals ── */}
      {calcDeal && <RateCalculatorModal deal={calcDeal} onClose={() => setCalcDeal(null)} />}
      {showAdd && <AddDealModal onClose={() => setShowAdd(false)} onAdd={d => setDeals(prev => [d, ...prev])} />}
    </div>
  )
}
