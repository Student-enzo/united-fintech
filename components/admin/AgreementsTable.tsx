'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Search, X, Plus } from 'lucide-react'
import type { Agreement, AgreementStatus } from '@/lib/db'
import { fmtDate } from '@/lib/utils'

const CYAN = '#2BB8E6'

const STATUS_META: Record<AgreementStatus, { label: string; color: string; bg: string; border: string }> = {
  draft:       { label: 'Draft',       color: 'rgba(255,255,255,0.45)', bg: 'rgba(255,255,255,0.06)', border: 'rgba(255,255,255,0.12)' },
  sent:        { label: 'Sent',        color: CYAN,                     bg: 'rgba(43,184,230,0.10)',  border: 'rgba(43,184,230,0.22)' },
  signed:      { label: 'Signed',      color: '#F0B23E',                bg: 'rgba(240,178,62,0.10)',  border: 'rgba(240,178,62,0.22)' },
  live:        { label: 'Live',        color: '#3DD68C',                bg: 'rgba(61,214,140,0.10)',  border: 'rgba(61,214,140,0.22)' },
  terminated:  { label: 'Terminated',  color: '#E8504A',                bg: 'rgba(232,80,74,0.08)',   border: 'rgba(232,80,74,0.18)' },
}

const STATUS_ORDER: AgreementStatus[] = ['draft', 'sent', 'signed', 'live']

function StatusBadge({ status }: { status: AgreementStatus }) {
  const m = STATUS_META[status]
  return (
    <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold"
      style={{ backgroundColor: m.bg, color: m.color, border: `1px solid ${m.border}` }}>
      {m.label}
    </span>
  )
}

export default function AgreementsTable() {
  const [agreements, setAgreements] = useState<Agreement[]>([])
  const [loading, setLoading]       = useState(true)
  const [search, setSearch]         = useState('')

  useEffect(() => {
    fetch('/api/agreements')
      .then(r => r.json())
      .then((data: Agreement[]) => { if (Array.isArray(data)) setAgreements(data) })
      .finally(() => setLoading(false))
  }, [])

  async function advanceStatus(ag: Agreement) {
    const idx = STATUS_ORDER.indexOf(ag.status as AgreementStatus)
    if (idx < 0 || idx >= STATUS_ORDER.length - 1) return
    const next = STATUS_ORDER[idx + 1]
    setAgreements(prev => prev.map(a => a.id === ag.id ? { ...a, status: next } : a))
    await fetch(`/api/agreements/${ag.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: next }),
    })
  }

  const filtered = agreements.filter(a => {
    const q = search.trim().toLowerCase()
    if (!q) return true
    return (
      a.product_type.toLowerCase().includes(q) ||
      STATUS_META[a.status]?.label.toLowerCase().includes(q)
    )
  })

  if (loading) return (
    <div className="flex items-center justify-center h-48">
      <p className="text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>Loading agreements…</p>
    </div>
  )

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-wide"
            style={{ background: 'linear-gradient(90deg,#C9D1D9 0%,#FFF 45%,#8A929C 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Agreements
          </h1>
          <p className="text-sm mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>
            {agreements.length} total · {agreements.filter(a => a.status === 'live').length} live
          </p>
        </div>
        <Link href="/admin/agreements/new"
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-opacity hover:opacity-80 self-start"
          style={{ backgroundColor: CYAN, color: '#0A0C12' }}>
          <Plus size={14} /> New Agreement
        </Link>
      </div>

      <div className="relative mb-5">
        <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
          style={{ color: 'rgba(43,184,230,0.5)' }} />
        <input type="text" placeholder="Search by product type or status…"
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

      {agreements.length === 0 ? (
        <div className="rounded-xl p-16 text-center"
          style={{ backgroundColor: '#141821', border: '1px solid rgba(255,255,255,0.08)' }}>
          <p className="text-sm mb-3" style={{ color: 'rgba(255,255,255,0.4)' }}>No agreements yet.</p>
          <Link href="/admin/agreements/new" className="text-sm font-medium hover:opacity-80" style={{ color: CYAN }}>
            + Create first agreement →
          </Link>
        </div>
      ) : (
        <div className="rounded-xl overflow-hidden"
          style={{ backgroundColor: '#141821', border: '1px solid rgba(255,255,255,0.08)' }}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead style={{ backgroundColor: 'rgba(43,184,230,0.06)', borderBottom: '1px solid rgba(43,184,230,0.12)' }}>
                <tr>
                  {['Product', 'Rate', 'Residual Split', 'Signed', 'Go Live', 'Status', ''].map(h => (
                    <th key={h} className="text-left px-5 py-3 text-[10px] uppercase tracking-widest font-semibold"
                      style={{ color: 'rgba(43,184,230,0.6)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
                {filtered.map(a => (
                  <tr key={a.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-5 py-3 text-sm font-semibold" style={{ color: 'rgba(255,255,255,0.85)' }}>
                      {a.product_type}
                    </td>
                    <td className="px-5 py-3 text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>
                      {a.rate ? `${a.rate}%` : '—'}
                    </td>
                    <td className="px-5 py-3 text-sm" style={{ color: a.residual_split_pct ? CYAN : 'rgba(255,255,255,0.3)' }}>
                      {a.residual_split_pct ? `${a.residual_split_pct}%` : '—'}
                    </td>
                    <td className="px-5 py-3 text-xs" style={{ color: 'rgba(255,255,255,0.45)' }}>
                      {a.signed_date ? fmtDate(a.signed_date) : '—'}
                    </td>
                    <td className="px-5 py-3 text-xs" style={{ color: 'rgba(255,255,255,0.45)' }}>
                      {a.go_live_date ? fmtDate(a.go_live_date) : '—'}
                    </td>
                    <td className="px-5 py-3"><StatusBadge status={a.status} /></td>
                    <td className="px-5 py-3">
                      {!['live', 'terminated'].includes(a.status) && (
                        <button onClick={() => advanceStatus(a)}
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
