'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { CheckCircle, Clock, AlertCircle } from 'lucide-react'

// ─── Types ────────────────────────────────────────────────────────────────────

type ReviewType = '30_day' | '60_day' | '90_day'

type ActivatedMerchant = {
  id: string
  name: string
  dba: string
  accountType: string
  activationDate: string
  daysSince: number
  reviewType: ReviewType
  reviewCompleted: boolean
  lastReviewDate?: string
  volume: string
}

// ─── Synthetic demo data ───────────────────────────────────────────────────────

const DEMO_MERCHANTS: ActivatedMerchant[] = [
  {
    id: 'mer_001', name: 'Coastal Surf & Board Co.', dba: 'Coastal Surf', accountType: 'Card Present',
    activationDate: '2026-05-06', daysSince: 30, reviewType: '30_day', reviewCompleted: false, volume: '$42,000',
  },
  {
    id: 'mer_002', name: 'Bayside Grill LLC', dba: 'Bayside Grill', accountType: 'Card Present',
    activationDate: '2026-05-06', daysSince: 30, reviewType: '30_day', reviewCompleted: false, volume: '$87,500',
  },
  {
    id: 'mer_003', name: 'Sunstate eCommerce Solutions', dba: '', accountType: 'eCommerce',
    activationDate: '2026-04-06', daysSince: 60, reviewType: '60_day', reviewCompleted: false, volume: '$215,000',
  },
  {
    id: 'mer_004', name: 'Atlantic Freight Partners', dba: 'AFP Logistics', accountType: 'MOTO',
    activationDate: '2026-04-06', daysSince: 60, reviewType: '60_day', reviewCompleted: true, lastReviewDate: '2026-06-01', volume: '$163,000',
  },
  {
    id: 'mer_005', name: 'Harbour Medical Group', dba: '', accountType: 'Card Present',
    activationDate: '2026-03-07', daysSince: 90, reviewType: '90_day', reviewCompleted: false, volume: '$330,000',
  },
  {
    id: 'mer_006', name: 'Keystone Auto Parts & Service', dba: 'Keystone Auto', accountType: 'Card Present',
    activationDate: '2026-03-07', daysSince: 90, reviewType: '90_day', reviewCompleted: true, lastReviewDate: '2026-05-30', volume: '$99,000',
  },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

const REVIEW_BADGE: Record<ReviewType, { bg: string; color: string; border: string; label: string }> = {
  '30_day':  { bg: 'rgba(96,165,250,0.12)',   color: '#93C5FD',  border: 'rgba(96,165,250,0.3)',   label: '30-Day Review' },
  '60_day':  { bg: 'rgba(251,191,36,0.12)',   color: '#FCD34D',  border: 'rgba(251,191,36,0.3)',   label: '60-Day Review' },
  '90_day':  { bg: 'rgba(74,155,127,0.15)',   color: '#6EE7B7',  border: 'rgba(74,155,127,0.35)',  label: '90-Day Review' },
}

function daysSinceLabel(n: number) {
  if (n < 1) return 'Today'
  if (n === 1) return '1 day ago'
  return `${n} days ago`
}

// ─── Merchant Card ────────────────────────────────────────────────────────────

function MerchantReviewCard({ m }: { m: ActivatedMerchant }) {
  const badge = REVIEW_BADGE[m.reviewType]

  return (
    <div
      className="rounded-2xl p-5 flex flex-col gap-4 transition-all"
      style={{
        backgroundColor: '#1c1c1c',
        border: `1px solid ${m.reviewCompleted ? 'rgba(74,155,127,0.25)' : 'rgba(144,196,207,0.13)'}`,
      }}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-bold text-base leading-snug" style={{ color: '#90c4cf' }}>
            {m.name}
          </p>
          {m.dba && (
            <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.4)' }}>
              DBA: {m.dba}
            </p>
          )}
        </div>
        <span
          className="text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide flex-shrink-0"
          style={{ backgroundColor: badge.bg, color: badge.color, border: `1px solid ${badge.border}` }}
        >
          {badge.label}
        </span>
      </div>

      {/* Meta */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <span className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>Activated</span>
          <span className="text-xs" style={{ color: 'rgba(255,255,255,0.65)' }}>
            {new Date(m.activationDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            <span className="ml-2" style={{ color: 'rgba(255,255,255,0.3)' }}>({daysSinceLabel(m.daysSince)})</span>
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>Type</span>
          <span className="text-xs" style={{ color: 'rgba(255,255,255,0.65)' }}>{m.accountType}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>Volume (30d)</span>
          <span className="text-xs font-semibold" style={{ color: 'rgba(255,255,255,0.75)' }}>{m.volume}</span>
        </div>
      </div>

      {/* Status badge */}
      <div className="flex items-center gap-2">
        {m.reviewCompleted ? (
          <>
            <CheckCircle size={13} color="#6EE7B7" />
            <span className="text-xs" style={{ color: '#6EE7B7' }}>
              Reviewed {m.lastReviewDate
                ? new Date(m.lastReviewDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                : ''}
            </span>
          </>
        ) : (
          <>
            <Clock size={13} color="#FCD34D" />
            <span className="text-xs font-semibold" style={{ color: '#FCD34D' }}>Review pending</span>
          </>
        )}
      </div>

      {/* CTA */}
      <Link
        href={`/admin/review/${m.id}`}
        className="block text-center text-sm font-semibold py-2.5 rounded-xl transition-colors mt-auto"
        style={{
          backgroundColor: m.reviewCompleted ? 'rgba(74,155,127,0.08)' : 'rgba(144,196,207,0.08)',
          border: `1px solid ${m.reviewCompleted ? 'rgba(74,155,127,0.25)' : 'rgba(144,196,207,0.25)'}`,
          color: m.reviewCompleted ? '#6EE7B7' : '#90c4cf',
        }}
      >
        {m.reviewCompleted ? 'View / Update Review →' : 'Start Review →'}
      </Link>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function PostActivationPage() {
  const [filter, setFilter] = useState<'all' | 'pending' | 'done'>('pending')
  const [merchants] = useState<ActivatedMerchant[]>(DEMO_MERCHANTS)

  const pendingCount   = merchants.filter(m => !m.reviewCompleted).length
  const completedCount = merchants.filter(m => m.reviewCompleted).length
  const day30Count     = merchants.filter(m => m.reviewType === '30_day' && !m.reviewCompleted).length

  const displayed = merchants.filter(m => {
    if (filter === 'pending') return !m.reviewCompleted
    if (filter === 'done')    return m.reviewCompleted
    return true
  })

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Post-Activation Reviews</h1>
        <p className="text-sm mt-0.5" style={{ color: 'rgba(255,255,255,0.45)' }}>
          30 / 60 / 90-day merchant health checks · {merchants.length} activated merchants
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Reviews Due',      value: pendingCount,   color: '#FCD34D' },
          { label: 'Reviews Complete', value: completedCount, color: '#6EE7B7' },
          { label: '30-Day Pending',   value: day30Count,     color: '#93C5FD' },
        ].map(s => (
          <div
            key={s.label}
            className="rounded-xl p-5"
            style={{ backgroundColor: '#1c1c1c', border: '1px solid rgba(144,196,207,0.13)' }}
          >
            <p className="text-3xl font-bold" style={{ color: s.color }}>{s.value}</p>
            <p className="text-xs uppercase tracking-wider mt-1" style={{ color: 'rgba(255,255,255,0.4)' }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Alert banner */}
      {pendingCount > 0 && (
        <div
          className="flex items-center gap-3 px-4 py-3 rounded-xl mb-6"
          style={{ backgroundColor: 'rgba(251,210,74,0.07)', border: '1px solid rgba(251,210,74,0.22)' }}
        >
          <AlertCircle size={16} color="#FCD34D" />
          <span className="text-sm font-medium" style={{ color: '#FCD34D' }}>
            {pendingCount} merchant{pendingCount !== 1 ? 's' : ''} awaiting post-activation review
          </span>
        </div>
      )}

      {/* Filter tabs */}
      <div className="flex gap-2 mb-6">
        {(['pending', 'all', 'done'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className="px-4 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wide transition-colors"
            style={filter === f
              ? { backgroundColor: 'rgba(144,196,207,0.15)', color: '#90c4cf', border: '1px solid rgba(144,196,207,0.35)' }
              : { backgroundColor: 'transparent', color: 'rgba(255,255,255,0.35)', border: '1px solid rgba(255,255,255,0.1)' }
            }
          >
            {f === 'all' ? `All (${merchants.length})` : f === 'pending' ? `Pending (${pendingCount})` : `Done (${completedCount})`}
          </button>
        ))}
      </div>

      {/* Grid */}
      {displayed.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {displayed.map(m => <MerchantReviewCard key={m.id} m={m} />)}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <CheckCircle size={40} color="rgba(255,255,255,0.1)" />
          <p className="text-lg font-semibold mt-4 mb-1" style={{ color: 'rgba(255,255,255,0.3)' }}>
            {filter === 'done' ? 'No completed reviews yet' : 'All reviews complete'}
          </p>
          <p className="text-sm" style={{ color: 'rgba(255,255,255,0.2)' }}>
            {filter === 'pending' ? 'No pending reviews right now.' : 'Check back as merchants activate.'}
          </p>
        </div>
      )}
    </div>
  )
}
