'use client'

import { useState, useEffect } from 'react'
import { Search, X } from 'lucide-react'
import type { Commission } from '@/lib/db'
import { fmtCurrency, fmtDate } from '@/lib/utils'

const CYAN = '#2BB8E6'

export default function CommissionsTable() {
  const [commissions, setCommissions] = useState<Commission[]>([])
  const [loading, setLoading]         = useState(true)
  const [search, setSearch]           = useState('')

  useEffect(() => {
    fetch('/api/commissions')
      .then(r => r.json())
      .then((data: Commission[]) => { if (Array.isArray(data)) setCommissions(data) })
      .finally(() => setLoading(false))
  }, [])

  const totalPaid = commissions
    .filter(c => c.status === 'paid')
    .reduce((s, c) => s + (c.amount ?? 0) + (c.bonus ?? 0), 0)

  const filtered = commissions.filter(c => {
    const q = search.trim().toLowerCase()
    if (!q) return true
    return (
      (c.period_label ?? '').toLowerCase().includes(q) ||
      c.status.toLowerCase().includes(q)
    )
  })

  if (loading) return (
    <div className="flex items-center justify-center h-48">
      <p className="text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>Loading commissions…</p>
    </div>
  )

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-wide"
          style={{ background: 'linear-gradient(90deg,#C9D1D9 0%,#FFF 45%,#8A929C 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Commissions
        </h1>
        <p className="text-sm mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>
          {commissions.length} records · paid out{' '}
          <span style={{ color: CYAN }}>{fmtCurrency(totalPaid)}</span>
        </p>
      </div>

      <div className="relative mb-5">
        <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
          style={{ color: 'rgba(43,184,230,0.5)' }} />
        <input type="text" placeholder="Search by period or status…"
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

      {commissions.length === 0 ? (
        <div className="rounded-xl p-16 text-center"
          style={{ backgroundColor: '#141821', border: '1px solid rgba(255,255,255,0.08)' }}>
          <p className="text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>No commissions recorded yet.</p>
        </div>
      ) : (
        <div className="rounded-xl overflow-hidden"
          style={{ backgroundColor: '#141821', border: '1px solid rgba(255,255,255,0.08)' }}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead style={{ backgroundColor: 'rgba(43,184,230,0.06)', borderBottom: '1px solid rgba(43,184,230,0.12)' }}>
                <tr>
                  {['Period', 'Amount', 'Bonus', 'Total', 'Status', 'Paid Date'].map(h => (
                    <th key={h} className="text-left px-5 py-3 text-[10px] uppercase tracking-widest font-semibold"
                      style={{ color: 'rgba(43,184,230,0.6)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
                {filtered.map(c => {
                  const total = (c.amount ?? 0) + (c.bonus ?? 0)
                  return (
                    <tr key={c.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-5 py-3 text-sm font-semibold" style={{ color: CYAN }}>
                        {c.period_label ?? '—'}
                      </td>
                      <td className="px-5 py-3 text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>
                        {c.amount ? fmtCurrency(c.amount) : '—'}
                      </td>
                      <td className="px-5 py-3 text-sm" style={{ color: c.bonus ? '#F0B23E' : 'rgba(255,255,255,0.3)' }}>
                        {c.bonus ? fmtCurrency(c.bonus) : '—'}
                      </td>
                      <td className="px-5 py-3 text-sm font-semibold" style={{ color: '#3DD68C' }}>
                        {total > 0 ? fmtCurrency(total) : '—'}
                      </td>
                      <td className="px-5 py-3">
                        <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold capitalize"
                          style={{
                            backgroundColor: c.status === 'paid' ? 'rgba(61,214,140,0.10)' : 'rgba(240,178,62,0.10)',
                            color: c.status === 'paid' ? '#3DD68C' : '#F0B23E',
                          }}>
                          {c.status}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>
                        {c.paid_date ? fmtDate(c.paid_date) : '—'}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
