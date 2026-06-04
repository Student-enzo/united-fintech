'use client'

import { useState, useEffect } from 'react'
import { Search, X } from 'lucide-react'
import type { Residual } from '@/lib/db'
import { fmtCurrency, fmtDate } from '@/lib/utils'

const CYAN = '#1EA8D4'

export default function ResidualsTable() {
  const [residuals, setResiduals] = useState<Residual[]>([])
  const [loading, setLoading]     = useState(true)
  const [search, setSearch]       = useState('')

  useEffect(() => {
    fetch('/api/residuals')
      .then(r => r.json())
      .then((data: Residual[]) => { if (Array.isArray(data)) setResiduals(data) })
      .finally(() => setLoading(false))
  }, [])

  const totalNet = residuals.reduce((s, r) => s + (r.net_residual ?? 0), 0)

  const filtered = residuals.filter(r => {
    const q = search.trim().toLowerCase()
    if (!q) return true
    return r.period.toLowerCase().includes(q) || r.status.toLowerCase().includes(q)
  })

  if (loading) return (
    <div className="flex items-center justify-center h-48">
      <p className="text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>Loading residuals…</p>
    </div>
  )

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-wide"
          style={{ background: 'linear-gradient(90deg,#C9D1D9 0%,#FFF 45%,#8A929C 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Residuals
        </h1>
        <p className="text-sm mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>
          {residuals.length} records · total net{' '}
          <span style={{ color: CYAN }}>{fmtCurrency(totalNet)}</span>
        </p>
      </div>

      <div className="relative mb-5">
        <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
          style={{ color: 'rgba(30,168,212,0.5)' }} />
        <input type="text" placeholder="Search by period or status…"
          value={search} onChange={e => setSearch(e.target.value)}
          className="w-full pl-11 pr-10 py-2.5 text-sm rounded-xl focus:outline-none"
          style={{ backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(30,168,212,0.18)', color: 'rgba(255,255,255,0.85)' }} />
        {search && (
          <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2"
            style={{ color: 'rgba(30,168,212,0.6)' }}>
            <X size={13} />
          </button>
        )}
      </div>

      {residuals.length === 0 ? (
        <div className="rounded-xl p-16 text-center"
          style={{ backgroundColor: '#141821', border: '1px solid rgba(255,255,255,0.08)' }}>
          <p className="text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>No residuals recorded yet.</p>
        </div>
      ) : (
        <div className="rounded-xl overflow-hidden"
          style={{ backgroundColor: '#141821', border: '1px solid rgba(255,255,255,0.08)' }}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead style={{ backgroundColor: 'rgba(30,168,212,0.06)', borderBottom: '1px solid rgba(30,168,212,0.12)' }}>
                <tr>
                  {['Period', 'Processing Vol.', 'Gross Residual', 'Partner Share', 'Net Residual', 'Status', 'Received'].map(h => (
                    <th key={h} className="text-left px-5 py-3 text-[10px] uppercase tracking-widest font-semibold"
                      style={{ color: 'rgba(30,168,212,0.6)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
                {filtered.map(r => (
                  <tr key={r.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-5 py-3 text-sm font-semibold" style={{ color: CYAN }}>{r.period}</td>
                    <td className="px-5 py-3 text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>
                      {r.processing_volume ? fmtCurrency(r.processing_volume) : '—'}
                    </td>
                    <td className="px-5 py-3 text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>
                      {r.gross_residual ? fmtCurrency(r.gross_residual) : '—'}
                    </td>
                    <td className="px-5 py-3 text-sm" style={{ color: 'rgba(255,255,255,0.45)' }}>
                      {r.partner_share ? fmtCurrency(r.partner_share) : '—'}
                    </td>
                    <td className="px-5 py-3 text-sm font-semibold" style={{ color: '#3DD68C' }}>
                      {r.net_residual ? fmtCurrency(r.net_residual) : '—'}
                    </td>
                    <td className="px-5 py-3">
                      <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold capitalize"
                        style={{
                          backgroundColor: r.status === 'received' ? 'rgba(61,214,140,0.10)' : 'rgba(240,178,62,0.10)',
                          color: r.status === 'received' ? '#3DD68C' : '#F0B23E',
                        }}>
                        {r.status}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>
                      {r.received_date ? fmtDate(r.received_date) : '—'}
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
