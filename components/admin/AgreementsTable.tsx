'use client'

import { useState, useMemo, useCallback, useRef, useEffect } from 'react'
import {
  Search, X, Plus, ChevronDown, ChevronUp, ChevronsUpDown,
  MoreHorizontal, Eye, Pencil, FileDown, Copy, Download,
  AlertTriangle, CheckCircle2, Clock, Send, PenLine,
  Activity, Ban, CalendarClock, ExternalLink, RefreshCw,
} from 'lucide-react'
import { fmtDate } from '@/lib/utils'
import { BRAND } from '@/lib/brand'

// ── Types ─────────────────────────────────────────────────────────────────────

type AgreementStatus = 'draft' | 'sent' | 'signed' | 'active' | 'under_review' | 'terminated' | 'expired'

type Agreement = {
  id: string
  mpa_number: string
  merchant: string
  account_type: 'Card Present' | 'eCommerce' | 'MOTO' | 'ACH'
  rate_model: string            // e.g. "IC+ 0.20% + $0.10" or "Flat 2.50%"
  monthly_limit: number         // processing limit in $
  status: AgreementStatus
  signed_date?: string
  expiry_date?: string
  created_at: string
  notes?: string
}

type SortKey = keyof Pick<Agreement, 'merchant' | 'account_type' | 'monthly_limit' | 'status' | 'signed_date' | 'expiry_date'>
type SortDir = 'asc' | 'desc'

// ── Mock data ─────────────────────────────────────────────────────────────────

function daysFromNow(days: number): string {
  const d = new Date()
  d.setDate(d.getDate() + days)
  return d.toISOString().split('T')[0]
}

function daysAgo(days: number): string {
  const d = new Date()
  d.setDate(d.getDate() - days)
  return d.toISOString().split('T')[0]
}

const MOCK_AGREEMENTS: Agreement[] = [
  {
    id: 'a-001', mpa_number: 'MPA-0001', merchant: 'Seaside Surf Co.',
    account_type: 'Card Present', rate_model: 'IC+ 0.20% + $0.10',
    monthly_limit: 250000, status: 'active',
    signed_date: daysAgo(180), expiry_date: daysFromNow(185),
    created_at: daysAgo(185),
  },
  {
    id: 'a-002', mpa_number: 'MPA-0002', merchant: 'TropicFuel LLC',
    account_type: 'eCommerce', rate_model: 'IC+ 0.30% + $0.15',
    monthly_limit: 500000, status: 'signed',
    signed_date: daysAgo(14), expiry_date: daysFromNow(351),
    created_at: daysAgo(21),
    notes: 'Awaiting bank verification to go active.',
  },
  {
    id: 'a-003', mpa_number: 'MPA-0003', merchant: 'Harbor Dental Group',
    account_type: 'MOTO', rate_model: 'Flat 2.50% + $0.25',
    monthly_limit: 100000, status: 'under_review',
    signed_date: daysAgo(60), expiry_date: daysFromNow(305),
    created_at: daysAgo(65),
    notes: 'Chargeback rate exceeded 1% threshold — risk review.',
  },
  {
    id: 'a-004', mpa_number: 'MPA-0004', merchant: 'Oceanic Tours Ltd.',
    account_type: 'Card Present', rate_model: 'IC+ 0.15% + $0.08',
    monthly_limit: 750000, status: 'draft',
    created_at: daysAgo(3),
  },
  {
    id: 'a-005', mpa_number: 'MPA-0005', merchant: 'BlueFin Analytics',
    account_type: 'eCommerce', rate_model: 'IC+ 0.25% + $0.12',
    monthly_limit: 400000, status: 'active',
    signed_date: daysAgo(120), expiry_date: daysFromNow(45),
    created_at: daysAgo(125),
    notes: 'SaaS subscription merchant. Renewal due in 45 days.',
  },
  {
    id: 'a-006', mpa_number: 'MPA-0006', merchant: 'Coral Bay Resorts',
    account_type: 'ACH', rate_model: '0.75% + $0.30 (ACH)',
    monthly_limit: 1000000, status: 'terminated',
    signed_date: daysAgo(400), expiry_date: daysAgo(30),
    created_at: daysAgo(410),
    notes: 'Terminated due to excessive chargebacks.',
  },
  {
    id: 'a-007', mpa_number: 'MPA-0007', merchant: 'NautiCart Inc.',
    account_type: 'eCommerce', rate_model: 'IC+ 0.28% + $0.14',
    monthly_limit: 300000, status: 'sent',
    created_at: daysAgo(7),
  },
  {
    id: 'a-008', mpa_number: 'MPA-0008', merchant: 'Windward Freight',
    account_type: 'Card Present', rate_model: 'IC+ 0.18% + $0.09',
    monthly_limit: 600000, status: 'active',
    signed_date: daysAgo(200), expiry_date: daysFromNow(55),
    created_at: daysAgo(205),
  },
  {
    id: 'a-009', mpa_number: 'MPA-0009', merchant: 'Palms Digital Agency',
    account_type: 'eCommerce', rate_model: 'IC+ 0.22% + $0.11',
    monthly_limit: 180000, status: 'expired',
    signed_date: daysAgo(400), expiry_date: daysAgo(35),
    created_at: daysAgo(410),
    notes: 'Renewal not completed in time. Contact merchant.',
  },
  {
    id: 'a-010', mpa_number: 'MPA-0010', merchant: 'Gulf Stream Merchants',
    account_type: 'MOTO', rate_model: 'Flat 2.75% + $0.20',
    monthly_limit: 80000, status: 'under_review',
    signed_date: daysAgo(45), expiry_date: daysFromNow(320),
    created_at: daysAgo(50),
    notes: 'Flagged for high MOTO refund volume.',
  },
]

// ── Status config ─────────────────────────────────────────────────────────────

const STATUS_META: Record<AgreementStatus, { label: string; color: string; bg: string; border: string; icon: React.ReactNode }> = {
  draft:        { label: 'Draft',        color: 'rgba(255,255,255,0.45)', bg: 'rgba(255,255,255,0.06)', border: 'rgba(255,255,255,0.12)', icon: <Clock size={10} /> },
  sent:         { label: 'Sent',         color: BRAND.cyan,               bg: 'rgba(144,196,207,0.10)',  border: 'rgba(144,196,207,0.22)',  icon: <Send size={10} /> },
  signed:       { label: 'Signed',       color: BRAND.warn,               bg: 'rgba(240,178,62,0.10)',  border: 'rgba(240,178,62,0.22)',  icon: <PenLine size={10} /> },
  active:       { label: 'Active',       color: BRAND.success,            bg: 'rgba(61,214,140,0.10)',  border: 'rgba(61,214,140,0.22)',  icon: <Activity size={10} /> },
  under_review: { label: 'Under Review', color: '#F97316',                bg: 'rgba(249,115,22,0.10)',  border: 'rgba(249,115,22,0.22)',  icon: <AlertTriangle size={10} /> },
  terminated:   { label: 'Terminated',   color: BRAND.danger,             bg: 'rgba(232,80,74,0.08)',   border: 'rgba(232,80,74,0.18)',   icon: <Ban size={10} /> },
  expired:      { label: 'Expired',      color: 'rgba(255,255,255,0.3)',  bg: 'rgba(255,255,255,0.04)', border: 'rgba(255,255,255,0.08)', icon: <CalendarClock size={10} /> },
}

const ALL_STATUSES: Array<AgreementStatus | 'all'> = ['all', 'draft', 'sent', 'signed', 'active', 'under_review', 'terminated', 'expired']

const EXPIRY_WARN_DAYS = 60

// ── Helpers ───────────────────────────────────────────────────────────────────

function daysUntilExpiry(dateStr?: string): number | null {
  if (!dateStr) return null
  const diff = new Date(dateStr).getTime() - Date.now()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

function fmtVolume(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000)     return `$${(n / 1_000).toFixed(0)}K`
  return `$${n}`
}

// ── Sub-components ────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: AgreementStatus }) {
  const m = STATUS_META[status]
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wide"
      style={{ backgroundColor: m.bg, color: m.color, border: `1px solid ${m.border}` }}>
      {m.icon}{m.label}
    </span>
  )
}

function ExpiryPill({ dateStr }: { dateStr?: string }) {
  const days = daysUntilExpiry(dateStr)
  if (days === null) return <span style={{ color: 'rgba(255,255,255,0.25)' }}>—</span>
  if (days < 0)   return <span className="text-xs" style={{ color: BRAND.danger }}>Expired</span>
  if (days <= 30) return (
    <span className="inline-flex items-center gap-1 text-xs font-semibold" style={{ color: BRAND.danger }}>
      <AlertTriangle size={11} /> {fmtDate(dateStr!)} ({days}d)
    </span>
  )
  if (days <= 60) return (
    <span className="inline-flex items-center gap-1 text-xs font-semibold" style={{ color: BRAND.warn }}>
      <CalendarClock size={11} /> {fmtDate(dateStr!)} ({days}d)
    </span>
  )
  return <span className="text-xs" style={{ color: 'rgba(255,255,255,0.45)' }}>{fmtDate(dateStr!)}</span>
}

function SortIcon({ col, sortKey, sortDir }: { col: SortKey; sortKey: SortKey; sortDir: SortDir }) {
  if (col !== sortKey) return <ChevronsUpDown size={12} style={{ color: 'rgba(255,255,255,0.2)' }} />
  return sortDir === 'asc'
    ? <ChevronUp size={12} style={{ color: BRAND.cyan }} />
    : <ChevronDown size={12} style={{ color: BRAND.cyan }} />
}

// ── Row action menu ───────────────────────────────────────────────────────────

function RowMenu({ agreement, onDuplicate }: { agreement: Agreement; onDuplicate: () => void }) {
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
            <Eye size={13} style={{ color: BRAND.cyan }} /> View MPA
          </button>
          <button className={itemStyle} style={{ color: BRAND.text }} onClick={() => setOpen(false)}>
            <Pencil size={13} style={{ color: BRAND.cyan }} /> Edit
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

// ── Add Agreement Modal ───────────────────────────────────────────────────────

function AddAgreementModal({ onClose, onAdd }: { onClose: () => void; onAdd: (a: Agreement) => void }) {
  const [form, setForm] = useState({
    merchant: '', account_type: 'Card Present' as Agreement['account_type'],
    rate_model: '', monthly_limit: '', expiry_date: '', notes: '',
  })

  const accountTypes: Agreement['account_type'][] = ['Card Present', 'eCommerce', 'MOTO', 'ACH']

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const ag: Agreement = {
      id: `a-${Date.now()}`,
      mpa_number: `MPA-${String(Math.floor(Math.random() * 9000) + 1000)}`,
      merchant: form.merchant,
      account_type: form.account_type,
      rate_model: form.rate_model,
      monthly_limit: parseFloat(form.monthly_limit) || 0,
      status: 'draft',
      expiry_date: form.expiry_date || undefined,
      created_at: new Date().toISOString().split('T')[0],
      notes: form.notes || undefined,
    }
    onAdd(ag)
    onClose()
  }

  const fieldStyle: React.CSSProperties = {
    backgroundColor: 'rgba(255,255,255,0.05)',
    border: `1px solid ${BRAND.borderCyan}`,
    color: BRAND.text,
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}>
      <div className="w-full max-w-lg rounded-2xl p-6 max-h-[90vh] overflow-y-auto"
        style={{ backgroundColor: BRAND.card, border: `1px solid ${BRAND.borderCyan}`, boxShadow: BRAND.glowCyan }}>

        <div className="flex items-center justify-between mb-5">
          <h3 className="text-base font-bold" style={{ color: BRAND.text }}>New Merchant Processing Agreement</h3>
          <button onClick={onClose} style={{ color: BRAND.muted }} className="hover:opacity-70 transition-opacity">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block">
            <span className="text-xs font-medium uppercase tracking-wide" style={{ color: BRAND.muted }}>Merchant Name *</span>
            <input required type="text" value={form.merchant}
              onChange={e => setForm(p => ({ ...p, merchant: e.target.value }))}
              placeholder="e.g. Coral Bay Resorts"
              className="mt-1 w-full px-3 py-2.5 rounded-lg text-sm focus:outline-none"
              style={fieldStyle} />
          </label>

          <label className="block">
            <span className="text-xs font-medium uppercase tracking-wide" style={{ color: BRAND.muted }}>Account Type *</span>
            <select required value={form.account_type}
              onChange={e => setForm(p => ({ ...p, account_type: e.target.value as Agreement['account_type'] }))}
              className="mt-1 w-full px-3 py-2.5 rounded-lg text-sm focus:outline-none appearance-none"
              style={fieldStyle}>
              {accountTypes.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </label>

          <label className="block">
            <span className="text-xs font-medium uppercase tracking-wide" style={{ color: BRAND.muted }}>Rate Model *</span>
            <input required type="text" value={form.rate_model}
              onChange={e => setForm(p => ({ ...p, rate_model: e.target.value }))}
              placeholder="e.g. IC+ 0.20% + $0.10"
              className="mt-1 w-full px-3 py-2.5 rounded-lg text-sm focus:outline-none"
              style={fieldStyle} />
          </label>

          <label className="block">
            <span className="text-xs font-medium uppercase tracking-wide" style={{ color: BRAND.muted }}>Monthly Limit ($) *</span>
            <input required type="number" min="0" value={form.monthly_limit}
              onChange={e => setForm(p => ({ ...p, monthly_limit: e.target.value }))}
              placeholder="e.g. 500000"
              className="mt-1 w-full px-3 py-2.5 rounded-lg text-sm focus:outline-none"
              style={fieldStyle} />
          </label>

          <label className="block">
            <span className="text-xs font-medium uppercase tracking-wide" style={{ color: BRAND.muted }}>Expiry Date</span>
            <input type="date" value={form.expiry_date}
              onChange={e => setForm(p => ({ ...p, expiry_date: e.target.value }))}
              className="mt-1 w-full px-3 py-2.5 rounded-lg text-sm focus:outline-none"
              style={fieldStyle} />
          </label>

          <label className="block">
            <span className="text-xs font-medium uppercase tracking-wide" style={{ color: BRAND.muted }}>Notes</span>
            <textarea value={form.notes}
              onChange={e => setForm(p => ({ ...p, notes: e.target.value }))}
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
              Create MPA
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ── Alert section ─────────────────────────────────────────────────────────────

function AlertSection({ agreements }: { agreements: Agreement[] }) {
  const expiring = agreements.filter(a => {
    const days = daysUntilExpiry(a.expiry_date)
    return days !== null && days >= 0 && days <= EXPIRY_WARN_DAYS && !['terminated', 'expired'].includes(a.status)
  }).sort((a, b) => (daysUntilExpiry(a.expiry_date) ?? 999) - (daysUntilExpiry(b.expiry_date) ?? 999))

  const underReview = agreements.filter(a => a.status === 'under_review')

  if (expiring.length === 0 && underReview.length === 0) return null

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
      {expiring.length > 0 && (
        <div className="rounded-xl p-4"
          style={{ backgroundColor: BRAND.card, border: '1px solid rgba(240,178,62,0.25)' }}>
          <div className="flex items-center gap-2 mb-3">
            <CalendarClock size={15} style={{ color: BRAND.warn }} />
            <h3 className="text-xs font-bold uppercase tracking-widest" style={{ color: BRAND.warn }}>
              Upcoming Expirations ({expiring.length})
            </h3>
          </div>
          <div className="space-y-2">
            {expiring.map(a => {
              const days = daysUntilExpiry(a.expiry_date)!
              return (
                <div key={a.id} className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold" style={{ color: BRAND.text }}>{a.merchant}</span>
                    <span className="text-[10px] ml-2" style={{ color: BRAND.muted }}>{a.mpa_number}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold" style={{ color: days <= 30 ? BRAND.danger : BRAND.warn }}>
                      {days}d left
                    </span>
                    <button
                      className="flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-semibold whitespace-nowrap"
                      style={{ backgroundColor: 'rgba(252,211,77,0.12)', color: '#FCD34D', border: '1px solid rgba(252,211,77,0.3)' }}>
                      <RefreshCw size={9} /> Renew MPA
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {underReview.length > 0 && (
        <div className="rounded-xl p-4"
          style={{ backgroundColor: BRAND.card, border: '1px solid rgba(249,115,22,0.25)' }}>
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle size={15} style={{ color: '#F97316' }} />
            <h3 className="text-xs font-bold uppercase tracking-widest" style={{ color: '#F97316' }}>
              Merchants Under Review ({underReview.length})
            </h3>
          </div>
          <div className="space-y-2">
            {underReview.map(a => (
              <div key={a.id} className="flex items-start justify-between gap-3">
                <div>
                  <span className="text-xs font-semibold" style={{ color: BRAND.text }}>{a.merchant}</span>
                  <span className="text-[10px] ml-2" style={{ color: BRAND.muted }}>{a.account_type}</span>
                  {a.notes && (
                    <p className="text-[10px] mt-0.5 truncate max-w-[220px]" style={{ color: BRAND.muted }}>{a.notes}</p>
                  )}
                </div>
                <StatusBadge status="under_review" />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// ── Export CSV ────────────────────────────────────────────────────────────────

function exportCSV(agreements: Agreement[]) {
  const headers = ['MPA #', 'Merchant', 'Account Type', 'Rate Model', 'Monthly Limit', 'Status', 'Signed Date', 'Expiry Date']
  const rows = agreements.map(a => [
    a.mpa_number, a.merchant, a.account_type, a.rate_model,
    a.monthly_limit, a.status, a.signed_date ?? '', a.expiry_date ?? '',
  ])
  const csv = [headers, ...rows].map(r => r.map(v => `"${v}"`).join(',')).join('\n')
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `agreements-${new Date().toISOString().split('T')[0]}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

// ── Main component ────────────────────────────────────────────────────────────

const PAGE_SIZE = 6

export default function AgreementsTable() {
  const [agreements, setAgreements] = useState<Agreement[]>(MOCK_AGREEMENTS)
  const [search, setSearch]         = useState('')
  const [activeStatus, setActive]   = useState<AgreementStatus | 'all'>('all')
  const [sortKey, setSortKey]       = useState<SortKey>('merchant')
  const [sortDir, setSortDir]       = useState<SortDir>('asc')
  const [page, setPage]             = useState(1)
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
    return agreements
      .filter(a => activeStatus === 'all' || a.status === activeStatus)
      .filter(a => !q || [a.merchant, a.account_type, a.rate_model, a.mpa_number, a.status]
        .some(v => v.toLowerCase().includes(q)))
      .sort((a, b) => {
        let va: string | number = (a[sortKey] as string | number | undefined) ?? ''
        let vb: string | number = (b[sortKey] as string | number | undefined) ?? ''
        if (typeof va === 'string') va = va.toLowerCase()
        if (typeof vb === 'string') vb = vb.toLowerCase()
        const cmp = va < vb ? -1 : va > vb ? 1 : 0
        return sortDir === 'asc' ? cmp : -cmp
      })
  }, [agreements, search, activeStatus, sortKey, sortDir])

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  function duplicateAgreement(a: Agreement) {
    const copy: Agreement = {
      ...a,
      id: `a-${Date.now()}`,
      mpa_number: `MPA-${String(Math.floor(Math.random() * 9000) + 1000)}-C`,
      status: 'draft',
      signed_date: undefined,
      created_at: new Date().toISOString().split('T')[0],
    }
    setAgreements(prev => [copy, ...prev])
  }

  const statCounts = useMemo(() => {
    return ALL_STATUSES.reduce((acc, s) => {
      acc[s] = s === 'all' ? agreements.length : agreements.filter(a => a.status === s).length
      return acc
    }, {} as Record<AgreementStatus | 'all', number>)
  }, [agreements])

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
    { key: 'merchant',      label: 'Merchant'       },
    { key: 'account_type',  label: 'Account Type'   },
    { key: 'monthly_limit', label: 'Monthly Limit'  },
    { key: 'status',        label: 'Status'         },
    { key: 'signed_date',   label: 'Signed'         },
    { key: 'expiry_date',   label: 'Expiry'         },
  ]

  return (
    <div>
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-wide"
            style={{ background: 'linear-gradient(90deg,#C9D1D9 0%,#FFF 45%,#8A929C 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Merchant Processing Agreements
          </h1>
          <p className="text-sm mt-0.5" style={{ color: BRAND.muted }}>
            {agreements.length} total &middot;{' '}
            <span style={{ color: BRAND.success }}>
              {agreements.filter(a => a.status === 'active').length} active
            </span>
            {' '}&middot;{' '}
            <span style={{ color: '#F97316' }}>
              {agreements.filter(a => a.status === 'under_review').length} under review
            </span>
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
            <Plus size={14} /> New MPA
          </button>
        </div>
      </div>

      {/* ── Alert sections ── */}
      <AlertSection agreements={agreements} />

      {/* ── Search ── */}
      <div className="relative mb-4">
        <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
          style={{ color: 'rgba(144,196,207,0.5)' }} />
        <input type="text" placeholder="Search merchant, account type, rate model, or status…"
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

      {/* ── Status filter — mobile dropdown ── */}
      <div className="lg:hidden mb-3">
        <select
          value={activeStatus}
          onChange={e => { setActive(e.target.value as AgreementStatus | 'all'); setPage(1) }}
          className="w-full rounded-xl px-3 py-2.5 text-sm focus:outline-none"
          style={{ backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(144,196,207,0.25)', color: 'rgba(255,255,255,0.85)' }}>
          {ALL_STATUSES.map(s => (
            <option key={s} value={s}>
              {s === 'all' ? 'All' : STATUS_META[s as AgreementStatus].label} ({statCounts[s]})
            </option>
          ))}
        </select>
      </div>

      {/* ── Status filter tabs — desktop pills ── */}
      <div className="hidden lg:flex flex-wrap gap-1.5 mb-5">
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
              {s === 'all' ? 'All' : STATUS_META[s as AgreementStatus].label}
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
            {search || activeStatus !== 'all' ? 'No agreements match your filters.' : 'No MPAs yet. Create your first agreement.'}
          </p>
        </div>
      ) : (
        <div className="rounded-xl overflow-hidden"
          style={{ backgroundColor: BRAND.card, border: `1px solid ${BRAND.border}` }}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead style={{ backgroundColor: 'rgba(144,196,207,0.06)', borderBottom: '1px solid rgba(144,196,207,0.12)' }}>
                <tr>
                  <th className="text-left px-5 py-3" style={{ ...thStyle, cursor: 'default' }}>MPA #</th>
                  {SORTABLE.map(({ key, label }) => (
                    <th key={key} className="text-left px-5 py-3" style={thStyle}
                      onClick={() => handleSort(key)}>
                      <span className="inline-flex items-center gap-1">
                        {label} <SortIcon col={key} sortKey={sortKey} sortDir={sortDir} />
                      </span>
                    </th>
                  ))}
                  <th className="px-5 py-3" style={{ ...thStyle, cursor: 'default' }}>Rate Model</th>
                  <th className="px-5 py-3" style={{ ...thStyle, cursor: 'default' }} />
                </tr>
              </thead>
              <tbody>
                {paged.map((a, i) => {
                  const days = daysUntilExpiry(a.expiry_date)
                  const isExpiringSoon = days !== null && days >= 0 && days <= EXPIRY_WARN_DAYS
                  const isUnderReview  = a.status === 'under_review'
                  const rowAccent = isUnderReview
                    ? 'rgba(249,115,22,0.03)'
                    : isExpiringSoon && !['terminated','expired'].includes(a.status)
                    ? 'rgba(240,178,62,0.03)'
                    : 'transparent'

                  return (
                    <tr key={a.id}
                      className="transition-colors hover:bg-white/[0.025]"
                      style={{
                        borderTop: i === 0 ? 'none' : `1px solid ${BRAND.border}`,
                        backgroundColor: rowAccent,
                      }}>
                      <td className="px-5 py-3.5 font-mono text-xs font-bold" style={{ color: BRAND.cyan }}>
                        {a.mpa_number}
                      </td>
                      <td className="px-5 py-3.5">
                        <a href="/admin/merchants"
                          className="inline-flex items-center gap-1 hover:underline text-sm font-semibold"
                          style={{ color: '#90c4cf' }}>
                          {a.merchant}
                          <ExternalLink size={11} />
                        </a>
                        {a.notes && (
                          <div className="text-[10px] mt-0.5 truncate max-w-[180px]" style={{ color: BRAND.muted }}>
                            {a.notes}
                          </div>
                        )}
                      </td>
                      <td className="px-5 py-3.5 text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>
                        {a.account_type}
                      </td>
                      <td className="px-5 py-3.5 text-sm font-semibold" style={{ color: BRAND.cyan }}>
                        {fmtVolume(a.monthly_limit)}
                      </td>
                      <td className="px-5 py-3.5">
                        <StatusBadge status={a.status} />
                      </td>
                      <td className="px-5 py-3.5 text-xs" style={{ color: 'rgba(255,255,255,0.45)' }}>
                        {a.signed_date
                          ? <span className="inline-flex items-center gap-1"><CheckCircle2 size={10} style={{ color: BRAND.success }} />{fmtDate(a.signed_date)}</span>
                          : <span style={{ color: 'rgba(255,255,255,0.25)' }}>—</span>}
                      </td>
                      <td className="px-5 py-3.5">
                        <ExpiryPill dateStr={a.expiry_date} />
                      </td>
                      <td className="px-5 py-3.5 font-mono text-xs" style={{ color: BRAND.cyanBright }}>
                        {a.rate_model}
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-1.5">
                          {days !== null && days >= 0 && days <= EXPIRY_WARN_DAYS && (
                            <button
                              className="flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-semibold whitespace-nowrap"
                              style={{ backgroundColor: 'rgba(252,211,77,0.12)', color: '#FCD34D', border: '1px solid rgba(252,211,77,0.3)' }}>
                              <RefreshCw size={9} /> Renew MPA
                            </button>
                          )}
                          <RowMenu agreement={a} onDuplicate={() => duplicateAgreement(a)} />
                        </div>
                      </td>
                    </tr>
                  )
                })}
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
                {Array.from({ length: totalPages }, (_, idx) => idx + 1).map(p => (
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

      {/* ── Add modal ── */}
      {showAdd && <AddAgreementModal onClose={() => setShowAdd(false)} onAdd={a => setAgreements(prev => [a, ...prev])} />}
    </div>
  )
}
