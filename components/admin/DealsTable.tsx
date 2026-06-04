'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Search, X, Plus } from 'lucide-react'
import type { Deal, DealStatus } from '@/lib/db'
import { fmtCurrency, fmtDate } from '@/lib/utils'

const CYAN = '#2BB8E6'

const STATUS_META: Record<DealStatus, { label: string; color: string; bg: string; border: string }> = {
  draft:        { label: 'Draft',        color: 'rgba(255,255,255,0.45)', bg: 'rgba(255,255,255,0.06)',  border: 'rgba(255,255,255,0.12)' },
  submitted:    { label: 'Submitted',    color: CYAN,                     bg: 'rgba(43,184,230,0.10)',   border: 'rgba(43,184,230,0.22)' },
  underwriting: { label: 'Underwriting', color: '#F0B23E',                bg: 'rgba(240,178,62,0.10)',   border: 'rgba(240,178,62,0.22)' },
  approved:     { label: 'Approved',     color: '#3DD68C',                bg: 'rgba(61,214,140,0.10)',   border: 'rgba(61,214,140,0.22)' },
  declined:     { label: 'Declined',     color: '#E8504A',                bg: 'rgba(232,80,74,0.08)',    border: 'rgba(232,80,74,0.18)' },
}

const STATUS_ORDER: DealStatus[] = ['draft', 'submitted', 'underwriting', 'approved', 'declined']

function StatusBadge({ status }: { status: DealStatus }) {
  const m = STATUS_META[status]
  return (
    <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold"
      style={{ backgroundColor: m.bg, color: m.color, border: `1px solid ${m.border}` }}>
      {m.label}
    </span>
  )
}

export default function DealsTable() {
  const [deals, setDeals]     = useState<Deal[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch]   = useState('')

  useEffect(() => {
    fetch('/api/deals')
      .then(r => r.json())
      .then((data: Deal[]) => { if (Array.isArray(data)) setDeals(data) })
      .finally(() => setLoading(false))
  }, [])

  async function advanceStatus(deal: Deal) {
    const idx = STATUS_ORDER.indexOf(deal.status)
    if (idx < 0 || idx >= STATUS_ORDER.length - 2) return
    const next = STATUS_ORDER[idx + 1]
    setDeals(prev => prev.map(d => d.id === deal.id ? { ...d, status: next } : d))
    await fetch(`/api/deals/${deal.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: next }),
    })
  }

  const filtered = deals.filter(d => {
    const q = search.trim().toLowerCase()
    if (!q) return true
    return (
      (d.deal_number ?? '').toLowerCase().includes(q) ||
      d.product_type.toLowerCase().includes(q) ||
      STATUS_META[d.status]?.label.toLowerCase().includes(q)
    )
  })

  if (loading) return (
    <div className="flex items-center justify-center h-48">
      <p className="text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>Loading deals…</p>
    </div>
  )

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-wide"
            style={{ background: 'linear-gradient(90deg,#C9D1D9 0%,#FFF 45%,#8A929C 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Deals &amp; Applications
          </h1>
          <p className="text-sm mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>
            {deals.length} total · {deals.filter(d => d.status === 'approved').length} approved
          </p>
        </div>
        <Link href="/admin/deals/new"
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-opacity hover:opacity-80 self-start"
          style={{ backgroundColor: CYAN, color: '#0A0C12' }}>
          <Plus size={14} /> New Deal
        </Link>
      </div>

      <div className="relative mb-5">
        <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
          style={{ color: 'rgba(43,184,230,0.5)' }} />
        <input type="text" placeholder="Search by deal #, product type, status…"
          value={search} onChange={e => setSearch(e.target.value)}
          className="w-full pl-11 pr-10 py-2.5 text-sm rounded-xl focus:outline-none"
          style={{ backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(43,184,230,0.18)', color: 'rgba(255,255,255,0.85)' }} />
        {search && (
          <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2"
            style={{ color: 'rgba(43,184,230,0.6)' }}>
            <X size={13} />
          </button>
        )}
      </div>

      {deals.length === 0 ? (
        <div className="rounded-xl p-16 text-center"
          style={{ backgroundColor: '#141821', border: '1px solid rgba(255,255,255,0.08)' }}>
          <p className="text-sm mb-3" style={{ color: 'rgba(255,255,255,0.4)' }}>No deals yet.</p>
          <Link href="/admin/deals/new" className="text-sm font-medium hover:opacity-80" style={{ color: CYAN }}>
            + Create first deal →
          </Link>
        </div>
      ) : (
        <div className="rounded-xl overflow-hidden"
          style={{ backgroundColor: '#141821', border: '1px solid rgba(255,255,255,0.08)' }}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead style={{ backgroundColor: 'rgba(43,184,230,0.06)', borderBottom: '1px solid rgba(43,184,230,0.12)' }}>
                <tr>
                  {['Deal #', 'Product', 'Est. Volume', 'Rate', 'Status', 'Created', ''].map(h => (
                    <th key={h} className="text-left px-5 py-3 text-[10px] uppercase tracking-widest font-semibold"
                      style={{ color: 'rgba(43,184,230,0.6)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
                {filtered.map(d => (
                  <tr key={d.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-5 py-3 text-sm font-semibold" style={{ color: CYAN }}>
                      {d.deal_number ?? `#${d.id.slice(0, 8)}`}
                    </td>
                    <td className="px-5 py-3 text-sm" style={{ color: 'rgba(255,255,255,0.8)' }}>
                      {d.product_type}
                    </td>
                    <td className="px-5 py-3 text-sm font-semibold"
                      style={{ color: d.est_monthly_volume ? CYAN : 'rgba(255,255,255,0.3)' }}>
                      {d.est_monthly_volume ? fmtCurrency(d.est_monthly_volume) : '—'}
                    </td>
                    <td className="px-5 py-3 text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>
                      {d.proposed_rate ? `${d.proposed_rate}%` : '—'}
                    </td>
                    <td className="px-5 py-3"><StatusBadge status={d.status} /></td>
                    <td className="px-5 py-3 text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>
                      {fmtDate(d.created_at)}
                    </td>
                    <td className="px-5 py-3">
                      {!['approved', 'declined'].includes(d.status) && (
                        <button onClick={() => advanceStatus(d)}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-opacity hover:opacity-80"
                          style={{ backgroundColor: 'rgba(43,184,230,0.12)', color: CYAN, border: '1px solid rgba(43,184,230,0.22)' }}>
                          Advance →
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
