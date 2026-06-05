'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Star, CheckCircle, Upload, ChevronLeft } from 'lucide-react'

// ─── Types ────────────────────────────────────────────────────────────────────

type RatingKey = 'onboardingSpeed' | 'supportQuality' | 'rateSatisfaction' | 'terminalReliability' | 'approvalRate'

interface ReviewForm {
  ratings: Record<RatingKey, number>
  overallSatisfaction: number
  feedbackNotes: string
  upsellOpportunities: string
  referralPotential: 'none' | 'possible' | 'likely' | 'strong'
  offerRateAdjustment: boolean
  newProposedRate: string
  followUpDate: string
  statementFiles: File[]
}

const INITIAL_FORM: ReviewForm = {
  ratings: {
    onboardingSpeed: 0,
    supportQuality: 0,
    rateSatisfaction: 0,
    terminalReliability: 0,
    approvalRate: 0,
  },
  overallSatisfaction: 0,
  feedbackNotes: '',
  upsellOpportunities: '',
  referralPotential: 'none',
  offerRateAdjustment: false,
  newProposedRate: '',
  followUpDate: '',
  statementFiles: [],
}

// ─── Demo merchant lookup ─────────────────────────────────────────────────────

const MERCHANT_DATA: Record<string, { name: string; dba: string; activationDate: string; reviewType: string; accountType: string; volume: string }> = {
  mer_001: { name: 'Coastal Surf & Board Co.',      dba: 'Coastal Surf',  activationDate: '2026-05-06', reviewType: '30-Day', accountType: 'Card Present', volume: '$42,000' },
  mer_002: { name: 'Bayside Grill LLC',             dba: 'Bayside Grill', activationDate: '2026-05-06', reviewType: '30-Day', accountType: 'Card Present', volume: '$87,500' },
  mer_003: { name: 'Sunstate eCommerce Solutions',  dba: '',              activationDate: '2026-04-06', reviewType: '60-Day', accountType: 'eCommerce',    volume: '$215,000' },
  mer_004: { name: 'Atlantic Freight Partners',     dba: 'AFP Logistics', activationDate: '2026-04-06', reviewType: '60-Day', accountType: 'MOTO',         volume: '$163,000' },
  mer_005: { name: 'Harbour Medical Group',         dba: '',              activationDate: '2026-03-07', reviewType: '90-Day', accountType: 'Card Present', volume: '$330,000' },
  mer_006: { name: 'Keystone Auto Parts & Service', dba: 'Keystone Auto', activationDate: '2026-03-07', reviewType: '90-Day', accountType: 'Card Present', volume: '$99,000' },
}

// ─── Shared style tokens ─────────────────────────────────────────────────────

const CARD_STYLE: React.CSSProperties = {
  backgroundColor: '#282626',
  border: '1px solid rgba(144,196,207,0.13)',
  borderRadius: 16,
  padding: '24px 28px',
}

const INPUT_STYLE: React.CSSProperties = {
  backgroundColor: '#1c1c1c',
  border: '1px solid rgba(144,196,207,0.18)',
  borderRadius: 8,
  color: 'rgba(255,255,255,0.85)',
  padding: '9px 12px',
  fontSize: 13,
  width: '100%',
  outline: 'none',
}

const LABEL_STYLE: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 600,
  textTransform: 'uppercase' as const,
  letterSpacing: '0.1em',
  color: 'rgba(255,255,255,0.4)',
  display: 'block',
  marginBottom: 6,
}

// ─── Star Rating ──────────────────────────────────────────────────────────────

function StarRating({
  value,
  onChange,
}: {
  value: number
  onChange: (v: number) => void
}) {
  const [hovered, setHovered] = useState(0)
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map(n => {
        const filled = n <= (hovered || value)
        return (
          <button
            key={n}
            type="button"
            onClick={() => onChange(n)}
            onMouseEnter={() => setHovered(n)}
            onMouseLeave={() => setHovered(0)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '2px',
              color: filled ? '#FCD34D' : 'rgba(255,255,255,0.18)',
              fontSize: 22,
              transition: 'color 0.1s',
            }}
          >
            ★
          </button>
        )
      })}
    </div>
  )
}

// ─── Rating Row ───────────────────────────────────────────────────────────────

function RatingRow({
  label,
  desc,
  value,
  onChange,
}: {
  label: string
  desc: string
  value: number
  onChange: (v: number) => void
}) {
  const labels = ['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent']
  return (
    <div
      className="flex items-center justify-between gap-4 py-3.5"
      style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
    >
      <div className="min-w-0">
        <p className="text-sm font-semibold" style={{ color: 'rgba(255,255,255,0.8)' }}>{label}</p>
        <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>{desc}</p>
      </div>
      <div className="flex items-center gap-3 flex-shrink-0">
        <StarRating value={value} onChange={onChange} />
        <span
          className="text-xs font-semibold w-16 text-right"
          style={{ color: value ? '#FCD34D' : 'rgba(255,255,255,0.2)' }}
        >
          {value ? labels[value] : '—'}
        </span>
      </div>
    </div>
  )
}

// ─── Toggle ───────────────────────────────────────────────────────────────────

function Toggle({ value, onChange, label }: { value: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm" style={{ color: 'rgba(255,255,255,0.7)' }}>{label}</span>
      <button
        type="button"
        onClick={() => onChange(!value)}
        className="relative w-12 h-6 rounded-full transition-all"
        style={{ backgroundColor: value ? 'rgba(144,196,207,0.4)' : 'rgba(255,255,255,0.1)' }}
      >
        <div
          className="absolute top-1 w-4 h-4 rounded-full transition-all"
          style={{
            left: value ? 'calc(100% - 20px)' : '4px',
            backgroundColor: value ? '#90c4cf' : 'rgba(255,255,255,0.35)',
          }}
        />
      </button>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function ReviewPage() {
  const params = useParams()
  const router = useRouter()
  const id = typeof params?.id === 'string' ? params.id : ''
  const merchant = MERCHANT_DATA[id] ?? {
    name: 'Unknown Merchant', dba: '', activationDate: '', reviewType: '', accountType: '', volume: '',
  }

  const [form, setForm] = useState<ReviewForm>(INITIAL_FORM)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  function setRating(key: RatingKey, value: number) {
    setForm(prev => ({ ...prev, ratings: { ...prev.ratings, [key]: value } }))
  }

  function setField<K extends keyof ReviewForm>(key: K, value: ReviewForm[K]) {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    await new Promise(r => setTimeout(r, 1200))
    setSubmitting(false)
    setSubmitted(true)
  }

  const avgRating = (): number => {
    const vals = Object.values(form.ratings).filter(v => v > 0)
    if (!vals.length) return 0
    return parseFloat((vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(1))
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center gap-5">
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center"
          style={{ backgroundColor: 'rgba(74,155,127,0.12)', border: '2px solid rgba(74,155,127,0.35)' }}
        >
          <CheckCircle size={36} color="#6EE7B7" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">Review Saved</h2>
          <p className="text-sm mt-2" style={{ color: 'rgba(255,255,255,0.5)' }}>
            {merchant.name} has been marked as reviewed and added to the activity log.
          </p>
          {form.followUpDate && (
            <p className="text-sm mt-1" style={{ color: '#90c4cf' }}>
              Follow-up scheduled for {new Date(form.followUpDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
          )}
        </div>
        <div className="flex gap-3 mt-2">
          <Link
            href="/admin/post-activation"
            className="px-5 py-2.5 rounded-lg text-sm font-semibold"
            style={{ backgroundColor: 'rgba(144,196,207,0.1)', border: '1px solid rgba(144,196,207,0.25)', color: '#90c4cf' }}
          >
            ← Back to Reviews
          </Link>
          <Link
            href="/admin/merchants"
            className="px-5 py-2.5 rounded-lg text-sm font-semibold"
            style={{ backgroundColor: '#90c4cf', color: '#1c1c1c' }}
          >
            View Merchant →
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-start gap-3 mb-8">
        <Link
          href="/admin/post-activation"
          className="flex items-center gap-1.5 text-sm mt-1 transition-colors"
          style={{ color: 'rgba(255,255,255,0.35)' }}
        >
          <ChevronLeft size={14} /> Back
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-white">{merchant.reviewType} Review</h1>
          <p className="text-sm mt-0.5" style={{ color: 'rgba(255,255,255,0.45)' }}>
            {merchant.name}{merchant.dba ? ` · ${merchant.dba}` : ''} · Activated {merchant.activationDate
              ? new Date(merchant.activationDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
              : ''}
          </p>
        </div>
      </div>

      {/* Merchant summary strip */}
      <div
        className="grid grid-cols-2 sm:grid-cols-4 gap-px mb-8 rounded-xl overflow-hidden"
        style={{ border: '1px solid rgba(144,196,207,0.13)' }}
      >
        {[
          { label: 'Account Type', value: merchant.accountType },
          { label: '30d Volume',   value: merchant.volume },
          { label: 'Review',       value: merchant.reviewType },
          { label: 'Avg Rating',   value: avgRating() > 0 ? `${avgRating()} / 5` : '—' },
        ].map((s, i) => (
          <div
            key={i}
            className="px-4 py-3"
            style={{ backgroundColor: '#282626' }}
          >
            <p className="text-[10px] uppercase tracking-widest mb-1" style={{ color: 'rgba(255,255,255,0.3)' }}>{s.label}</p>
            <p className="text-sm font-bold" style={{ color: 'rgba(255,255,255,0.8)' }}>{s.value}</p>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {/* ── Ratings ── */}
        <div style={CARD_STYLE}>
          <h2 className="text-sm font-bold uppercase tracking-widest mb-4" style={{ color: '#90c4cf' }}>
            Performance Ratings
          </h2>
          {(
            [
              ['onboardingSpeed',      'Onboarding Speed',       'How smooth was the activation process?'],
              ['supportQuality',       'Support Quality',        'Responsiveness and helpfulness of the support team'],
              ['rateSatisfaction',     'Rate Satisfaction',      'Merchant satisfaction with pricing and fees'],
              ['terminalReliability',  'Terminal Reliability',   'Hardware / gateway uptime and reliability'],
              ['approvalRate',         'Approval Rate',          'Transaction approval rate relative to expectations'],
            ] as [RatingKey, string, string][]
          ).map(([key, label, desc]) => (
            <RatingRow
              key={key}
              label={label}
              desc={desc}
              value={form.ratings[key]}
              onChange={v => setRating(key, v)}
            />
          ))}
        </div>

        {/* ── Overall satisfaction ── */}
        <div style={CARD_STYLE}>
          <h2 className="text-sm font-bold uppercase tracking-widest mb-2" style={{ color: '#90c4cf' }}>
            Overall Satisfaction
          </h2>
          <p className="text-xs mb-4" style={{ color: 'rgba(255,255,255,0.35)' }}>
            Merchant's overall satisfaction with United Fintech services
          </p>
          <div className="flex items-center gap-4">
            <StarRating value={form.overallSatisfaction} onChange={v => setField('overallSatisfaction', v)} />
            {form.overallSatisfaction > 0 && (
              <span
                className="text-2xl font-bold"
                style={{ color: form.overallSatisfaction >= 4 ? '#6EE7B7' : form.overallSatisfaction === 3 ? '#FCD34D' : '#FCA5A5' }}
              >
                {['', '1', '2', '3', '4', '5'][form.overallSatisfaction]} / 5
              </span>
            )}
          </div>
        </div>

        {/* ── Notes & intelligence ── */}
        <div style={CARD_STYLE}>
          <h2 className="text-sm font-bold uppercase tracking-widest mb-4" style={{ color: '#90c4cf' }}>
            Notes & Intelligence
          </h2>

          <div className="flex flex-col gap-5">
            <div>
              <label style={LABEL_STYLE}>Feedback Notes</label>
              <textarea
                value={form.feedbackNotes}
                onChange={e => setField('feedbackNotes', e.target.value)}
                rows={3}
                placeholder="General feedback from merchant conversation, pain points, wins…"
                style={{ ...INPUT_STYLE, resize: 'vertical' as const }}
              />
            </div>

            <div>
              <label style={LABEL_STYLE}>Upsell Opportunities</label>
              <textarea
                value={form.upsellOpportunities}
                onChange={e => setField('upsellOpportunities', e.target.value)}
                rows={2}
                placeholder="ACH, POS upgrade, loyalty program, gift cards, funding…"
                style={{ ...INPUT_STYLE, resize: 'vertical' as const }}
              />
            </div>

            <div>
              <label style={LABEL_STYLE}>Referral Potential</label>
              <div className="flex gap-2">
                {(['none', 'possible', 'likely', 'strong'] as const).map(v => {
                  const active = form.referralPotential === v
                  const colors: Record<string, string> = {
                    none: '#FCA5A5', possible: '#FCD34D', likely: '#93C5FD', strong: '#6EE7B7',
                  }
                  return (
                    <button
                      key={v}
                      type="button"
                      onClick={() => setField('referralPotential', v)}
                      className="flex-1 py-2 rounded-lg text-xs font-semibold capitalize transition-all"
                      style={{
                        backgroundColor: active ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.02)',
                        border: `1px solid ${active ? colors[v] + '66' : 'rgba(255,255,255,0.08)'}`,
                        color: active ? colors[v] : 'rgba(255,255,255,0.35)',
                      }}
                    >
                      {v}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        </div>

        {/* ── Rate adjustment ── */}
        <div style={CARD_STYLE}>
          <h2 className="text-sm font-bold uppercase tracking-widest mb-4" style={{ color: '#90c4cf' }}>
            Rate Adjustment
          </h2>

          <Toggle
            value={form.offerRateAdjustment}
            onChange={v => setField('offerRateAdjustment', v)}
            label="Offer rate adjustment to this merchant"
          />

          {form.offerRateAdjustment && (
            <div className="mt-5">
              <label style={LABEL_STYLE}>New Proposed Rate (%)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={form.newProposedRate}
                onChange={e => setField('newProposedRate', e.target.value)}
                placeholder="e.g. 1.65"
                style={INPUT_STYLE}
              />
              <p className="text-xs mt-2" style={{ color: 'rgba(255,255,255,0.35)' }}>
                Rate change will be logged in activity and flagged for manager approval.
              </p>
            </div>
          )}
        </div>

        {/* ── Documents ── */}
        <div style={CARD_STYLE}>
          <h2 className="text-sm font-bold uppercase tracking-widest mb-4" style={{ color: '#90c4cf' }}>
            Recent Statements
          </h2>
          <p className="text-xs mb-4" style={{ color: 'rgba(255,255,255,0.35)' }}>
            Upload current processing statements to compare against activation baseline.
          </p>
          <label
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              border: `1px dashed ${form.statementFiles.length > 0 ? 'rgba(144,196,207,0.5)' : 'rgba(144,196,207,0.2)'}`,
              borderRadius: 10,
              padding: '24px 16px',
              cursor: 'pointer',
              backgroundColor: form.statementFiles.length > 0 ? 'rgba(144,196,207,0.04)' : 'rgba(255,255,255,0.02)',
            }}
          >
            <input
              type="file"
              multiple
              accept=".pdf,.jpg,.jpeg,.png"
              style={{ display: 'none' }}
              onChange={e => {
                const files = Array.from(e.target.files ?? [])
                setField('statementFiles', [...form.statementFiles, ...files])
              }}
            />
            <Upload size={18} color={form.statementFiles.length > 0 ? '#90c4cf' : 'rgba(255,255,255,0.25)'} />
            {form.statementFiles.length === 0 ? (
              <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>
                Click to upload statement files (PDF, JPG, PNG)
              </span>
            ) : (
              <div className="flex flex-col items-center gap-1">
                {form.statementFiles.map((f, i) => (
                  <span key={i} style={{ fontSize: 12, color: '#90c4cf', fontWeight: 600 }}>{f.name}</span>
                ))}
              </div>
            )}
          </label>
        </div>

        {/* ── Follow-up scheduler ── */}
        <div style={CARD_STYLE}>
          <h2 className="text-sm font-bold uppercase tracking-widest mb-4" style={{ color: '#90c4cf' }}>
            Follow-Up Scheduler
          </h2>
          <p className="text-xs mb-4" style={{ color: 'rgba(255,255,255,0.35)' }}>
            Schedule the next check-in or follow-up call for this merchant.
          </p>
          <div>
            <label style={LABEL_STYLE}>Follow-Up Date</label>
            <input
              type="date"
              value={form.followUpDate}
              onChange={e => setField('followUpDate', e.target.value)}
              style={INPUT_STYLE}
            />
          </div>
        </div>

        {/* ── Submit ── */}
        <div className="flex justify-end gap-3 pb-8">
          <Link
            href="/admin/post-activation"
            className="px-5 py-2.5 rounded-lg text-sm font-semibold"
            style={{ color: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.1)', backgroundColor: 'rgba(255,255,255,0.03)' }}
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={submitting}
            className="px-8 py-2.5 rounded-lg text-sm font-bold transition-all"
            style={{ backgroundColor: submitting ? 'rgba(74,155,127,0.4)' : '#4A9B7F', color: '#ffffff' }}
          >
            {submitting ? 'Saving…' : 'Save Review →'}
          </button>
        </div>
      </form>
    </div>
  )
}
