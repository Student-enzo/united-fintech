'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { MOCK_APPLICATIONS } from '@/lib/mock-onboarding'
import { BRAND } from '@/lib/brand'
import type { OnboardingApplication, Phase } from '@/lib/onboarding-types'
import {
  Plus, X, Copy, Mail, CheckCircle, AlertTriangle,
  GripVertical, ArrowRight, Clock, Search,
} from 'lucide-react'

// ─── Phase metadata ───────────────────────────────────────────────────────────

type PhaseCol = Exclude<Phase, 'declined'>

const PHASE_META: Record<Phase, { label: string; shortLabel: string; color: string; bg: string; border: string }> = {
  intake_sent:       { label: 'Intake Sent',     shortLabel: 'Intake',   color: '#93C5FD', bg: 'rgba(96,165,250,0.10)',   border: 'rgba(96,165,250,0.22)' },
  document_review:   { label: 'Doc Review',      shortLabel: 'Docs',     color: BRAND.warn, bg: 'rgba(240,178,62,0.10)',  border: 'rgba(240,178,62,0.22)' },
  partner_selection: { label: 'Partner Select',  shortLabel: 'Partners', color: '#C4B5FD', bg: 'rgba(139,92,246,0.10)',   border: 'rgba(139,92,246,0.22)' },
  pursuit:           { label: 'In Pursuit',      shortLabel: 'Pursuit',  color: BRAND.cyan, bg: 'rgba(144,196,207,0.10)', border: 'rgba(144,196,207,0.22)' },
  live:              { label: 'Live',             shortLabel: 'Live',     color: BRAND.success, bg: 'rgba(61,214,140,0.10)', border: 'rgba(61,214,140,0.22)' },
  declined:          { label: 'Declined',         shortLabel: 'Declined', color: 'rgba(255,255,255,0.28)', bg: 'rgba(255,255,255,0.04)', border: 'rgba(255,255,255,0.10)' },
}

const KANBAN_PHASES: PhaseCol[] = ['intake_sent', 'document_review', 'partner_selection', 'pursuit', 'live']

const RISK_COLOR: Record<string, string> = {
  unscored: BRAND.silverLo,
  low: BRAND.success,
  medium: BRAND.warn,
  high: '#F97316',
  very_high: BRAND.danger,
}

const STANDARD_DOCS = [
  'Government ID',
  'Bank Statements (3 months)',
  'Voided Check',
  'Business License / Articles',
  'EIN Letter',
  'Processing Statements (optional)',
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

function daysSince(d: string) { return Math.floor((Date.now() - new Date(d).getTime()) / 86400000) }

function DaysChip({ days, phase }: { days: number; phase: Phase }) {
  const urgent = days > 10 && phase !== 'live' && phase !== 'declined'
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 2,
      fontSize: 9, fontWeight: 600, padding: '2px 6px', borderRadius: 99,
      backgroundColor: urgent ? 'rgba(240,178,62,0.15)' : 'rgba(255,255,255,0.05)',
      color: urgent ? BRAND.warn : 'rgba(255,255,255,0.35)',
      border: `1px solid ${urgent ? 'rgba(240,178,62,0.3)' : 'rgba(255,255,255,0.1)'}`,
    }}>
      <Clock size={8} /> {days}d
    </span>
  )
}

function RiskDot({ tier }: { tier: string }) {
  const color = RISK_COLOR[tier] ?? BRAND.silverLo
  return (
    <span style={{ fontSize: 10, fontWeight: 700, color, background: `${color}18`, border: `1px solid ${color}40`, padding: '1px 6px', borderRadius: 99 }}>
      {tier === 'very_high' ? 'V.High' : tier.charAt(0).toUpperCase() + tier.slice(1)}
    </span>
  )
}

// ─── Kanban card ──────────────────────────────────────────────────────────────

function OnboardingCard({
  app, dragging, onDragStart, onDragEnd, onManage,
}: {
  app: OnboardingApplication
  dragging: boolean
  onDragStart: () => void
  onDragEnd: () => void
  onManage: () => void
}) {
  const meta = PHASE_META[app.current_phase]
  const days = daysSince(app.created_at)
  const linkColor = app.link_status === 'submitted' ? BRAND.success : app.link_status === 'opened' ? BRAND.warn : BRAND.silverLo

  return (
    <div
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      style={{
        backgroundColor: BRAND.card,
        border: `1px solid ${dragging ? meta.color : BRAND.border}`,
        borderRadius: 14,
        opacity: dragging ? 0.4 : 1,
        transform: dragging ? 'scale(0.96)' : undefined,
        cursor: 'default',
        userSelect: 'none',
      }}
    >
      <div style={{ padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {/* Name */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            {app.duplicate_of && <AlertTriangle size={12} style={{ color: BRAND.warn, flexShrink: 0 }} />}
            <p style={{ fontSize: 13, fontWeight: 700, color: BRAND.text, lineHeight: 1.3 }}>
              {app.business_name ?? <span style={{ color: BRAND.muted, fontStyle: 'italic' }}>Unnamed</span>}
            </p>
          </div>
          {app.owner_name && (
            <p style={{ fontSize: 10, color: BRAND.muted, marginTop: 2 }}>{app.owner_name}</p>
          )}
        </div>

        {/* Risk + days */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <RiskDot tier={app.risk_tier} />
          <DaysChip days={days} phase={app.current_phase} />
        </div>

        {/* Link status + MCC */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 10, fontWeight: 600, color: linkColor }}>
            {app.link_status === 'submitted' ? '● Submitted' : app.link_status === 'opened' ? '◐ Opened' : '○ Sent'}
          </span>
          {app.mcc && (
            <span style={{ fontSize: 9, color: BRAND.muted }}>MCC {app.mcc}</span>
          )}
        </div>

        {/* Manage Client */}
        <button
          onClick={e => { e.stopPropagation(); onManage() }}
          style={{
            width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            padding: '6px 0', borderRadius: 8, fontSize: 11, fontWeight: 600,
            backgroundColor: `${BRAND.cyan}15`, color: BRAND.cyan, border: `1px solid ${BRAND.borderCyan}`,
            cursor: 'pointer',
          }}
        >
          <ArrowRight size={11} /> Manage Client
        </button>
      </div>
    </div>
  )
}

// ─── New Client Drawer ────────────────────────────────────────────────────────

function NewClientDrawer({ open, onClose, onCreated }: {
  open: boolean
  onClose: () => void
  onCreated: (app: OnboardingApplication) => void
}) {
  const [businessName, setBusinessName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [checkedDocs, setCheckedDocs] = useState<boolean[]>(STANDARD_DOCS.map(() => true))
  const [customDocs, setCustomDocs] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{ link: string; email: string } | null>(null)
  const [copied, setCopied] = useState(false)

  function reset() {
    setBusinessName(''); setEmail(''); setPhone('')
    setCheckedDocs(STANDARD_DOCS.map(() => true))
    setCustomDocs([]); setResult(null); setCopied(false)
  }

  async function handleSubmit() {
    if (!businessName.trim() || !email.trim()) return
    setLoading(true)
    try {
      const res = await fetch('/api/onboarding/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ business_name: businessName, owner_email: email, owner_phone: phone || null }),
      })
      if (!res.ok) throw new Error('Failed')
      const data = await res.json()
      const link = `${window.location.origin}/apply/${data.intake_token}`
      setResult({ link, email })
      onCreated(data)
    } catch {
      alert('Error creating application. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  function copyLink() {
    if (!result) return
    navigator.clipboard.writeText(result.link)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function openEmail() {
    if (!result) return
    const subject = encodeURIComponent(`Your Merchant Account Application — ${businessName}`)
    const body = encodeURIComponent(`Dear ${businessName} Team,\n\nPlease complete your intake form:\n\n${result.link}\n\nBest regards,\nUnited Fintech`)
    window.open(`mailto:${result.email}?subject=${subject}&body=${body}`)
  }

  const inp: React.CSSProperties = {
    width: '100%', background: 'rgba(255,255,255,0.05)', border: `1px solid ${BRAND.borderCyan}`,
    borderRadius: 6, padding: '8px 12px', color: BRAND.text, fontSize: 13, outline: 'none', boxSizing: 'border-box',
  }
  const canSubmit = !loading && businessName.trim() && email.trim()

  return (
    <>
      {open && <div onClick={() => { reset(); onClose() }} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 49 }} />}
      <div style={{
        position: 'fixed', top: 0, right: 0, bottom: 0, width: 420, zIndex: 50,
        background: BRAND.cardAlt, borderLeft: `1px solid ${BRAND.borderCyan}`,
        transform: open ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 0.25s ease', display: 'flex', flexDirection: 'column',
        boxShadow: open ? BRAND.glowCyan : 'none',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px', borderBottom: `1px solid ${BRAND.border}` }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: BRAND.text, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            New Merchant Application
          </div>
          <button onClick={() => { reset(); onClose() }} style={{ background: 'none', border: 'none', color: BRAND.muted, cursor: 'pointer', padding: 4 }}>
            <X size={18} />
          </button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: 24 }}>
          {result ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: BRAND.success }}>
                <CheckCircle size={18} />
                <span style={{ fontSize: 14, fontWeight: 600 }}>Application created!</span>
              </div>
              <div style={{ background: 'rgba(110,231,183,0.08)', border: '1px solid rgba(110,231,183,0.2)', borderRadius: 8, padding: '12px 14px' }}>
                <div style={{ fontSize: 11, color: BRAND.muted, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Intake Link</div>
                <div style={{ fontSize: 12, color: BRAND.silver, wordBreak: 'break-all', marginBottom: 12 }}>{result.link}</div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={copyLink} style={{
                    flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                    background: copied ? 'rgba(110,231,183,0.15)' : 'rgba(144,196,207,0.1)',
                    border: `1px solid ${BRAND.borderCyan}`, borderRadius: 6, padding: '8px 12px',
                    color: copied ? BRAND.success : BRAND.cyan, fontSize: 13, cursor: 'pointer', fontWeight: 600,
                  }}>
                    <Copy size={14} />{copied ? 'Copied!' : 'Copy Link'}
                  </button>
                  <button onClick={openEmail} style={{
                    flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                    background: 'rgba(144,196,207,0.1)', border: `1px solid ${BRAND.borderCyan}`,
                    borderRadius: 6, padding: '8px 12px', color: BRAND.cyan, fontSize: 13, cursor: 'pointer', fontWeight: 600,
                  }}>
                    <Mail size={14} />Open in Email
                  </button>
                </div>
              </div>
              <button onClick={reset} style={{ background: 'none', border: `1px solid ${BRAND.border}`, borderRadius: 6, padding: 8, color: BRAND.muted, fontSize: 12, cursor: 'pointer' }}>
                Create Another
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              <div>
                <label style={{ fontSize: 11, color: BRAND.muted, textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: 6 }}>Business Name *</label>
                <input style={inp} value={businessName} onChange={e => setBusinessName(e.target.value)} placeholder="Acme Merchant LLC" />
              </div>
              <div>
                <label style={{ fontSize: 11, color: BRAND.muted, textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: 6 }}>Owner Email *</label>
                <input style={inp} type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="owner@business.com" />
              </div>
              <div>
                <label style={{ fontSize: 11, color: BRAND.muted, textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: 6 }}>Owner Phone (optional)</label>
                <input style={inp} type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+1 (555) 000-0000" />
              </div>
              <div>
                <div style={{ fontSize: 11, color: BRAND.muted, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 10 }}>Document Checklist</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {STANDARD_DOCS.map((doc, i) => (
                    <label key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
                      <input type="checkbox" checked={checkedDocs[i]} onChange={() => setCheckedDocs(p => p.map((v, idx) => idx === i ? !v : v))} style={{ accentColor: BRAND.cyan, width: 14, height: 14 }} />
                      <span style={{ fontSize: 13, color: checkedDocs[i] ? BRAND.text : BRAND.muted }}>{doc}</span>
                    </label>
                  ))}
                  {customDocs.map((doc, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <input style={{ ...inp, flex: 1 }} value={doc} onChange={e => setCustomDocs(p => p.map((d, idx) => idx === i ? e.target.value : d))} placeholder="Custom document name" />
                      <button onClick={() => setCustomDocs(p => p.filter((_, idx) => idx !== i))} style={{ background: 'none', border: 'none', color: BRAND.muted, cursor: 'pointer', padding: 4 }}>
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                  <button onClick={() => setCustomDocs(p => [...p, ''])} style={{
                    display: 'flex', alignItems: 'center', gap: 6, background: 'none',
                    border: `1px dashed ${BRAND.borderCyan}`, borderRadius: 6, padding: '6px 12px',
                    color: BRAND.cyan, fontSize: 12, cursor: 'pointer', marginTop: 4,
                  }}>
                    <Plus size={13} />Add Custom Document
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {!result && (
          <div style={{ padding: '16px 24px', borderTop: `1px solid ${BRAND.border}` }}>
            <button onClick={handleSubmit} disabled={!canSubmit} style={{
              width: '100%', padding: 10, borderRadius: 8, border: 'none',
              background: canSubmit ? BRAND.cyan : 'rgba(144,196,207,0.2)',
              color: canSubmit ? '#1c1c1c' : BRAND.muted,
              fontSize: 13, fontWeight: 700, cursor: canSubmit ? 'pointer' : 'not-allowed',
              letterSpacing: '0.05em', textTransform: 'uppercase',
            }}>
              {loading ? 'Generating...' : 'Generate Link & Send'}
            </button>
          </div>
        )}
      </div>
    </>
  )
}

// ─── Main Board ───────────────────────────────────────────────────────────────

export default function OnboardingCRMPage() {
  const router = useRouter()
  const [apps, setApps] = useState<OnboardingApplication[]>(MOCK_APPLICATIONS)
  const [loading, setLoading] = useState(true)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [draggingId, setDraggingId] = useState<string | null>(null)
  const [dragOverPhase, setDragOverPhase] = useState<Phase | null>(null)
  const [showDeclined, setShowDeclined] = useState(false)
  const [search, setSearch] = useState('')
  const dragCounter = useRef<Record<string, number>>({})

  useEffect(() => {
    async function load() {
      try {
        const { data } = await supabase
          .from('onboarding_applications')
          .select('*')
          .order('created_at', { ascending: false })
        if (data && data.length > 0) setApps(data as OnboardingApplication[])
      } catch {}
      setLoading(false)
    }
    load()
  }, [])

  const active = apps.filter(a => a.current_phase !== 'declined')
  const declined = apps.filter(a => a.current_phase === 'declined')

  const filtered = (showDeclined ? apps : active).filter(a => {
    const q = search.trim().toLowerCase()
    if (!q) return true
    return (
      (a.business_name ?? '').toLowerCase().includes(q) ||
      (a.owner_name ?? '').toLowerCase().includes(q) ||
      (a.owner_email ?? '').toLowerCase().includes(q) ||
      (a.mcc ?? '').includes(q)
    )
  })

  async function moveToPhase(appId: string, phase: Phase) {
    setApps(prev => prev.map(a => a.id === appId ? { ...a, current_phase: phase } : a))
    try {
      await supabase.from('onboarding_applications').update({ current_phase: phase }).eq('id', appId)
    } catch {}
  }

  return (
    <div style={{ background: BRAND.bg, minHeight: '100vh', padding: '28px 32px' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: BRAND.silverLo, marginBottom: 4 }}>
            Onboarding
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: BRAND.text, margin: 0 }}>
            Merchant Acquisition Pipeline
          </h1>
          <p style={{ fontSize: 13, color: BRAND.muted, marginTop: 6 }}>
            {active.length} active · {declined.length} declined
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button onClick={() => setDrawerOpen(true)} style={{
            display: 'flex', alignItems: 'center', gap: 6, background: BRAND.cyan,
            border: 'none', borderRadius: 8, padding: '8px 16px', color: '#1c1c1c',
            fontSize: 13, fontWeight: 700, cursor: 'pointer',
          }}>
            <Plus size={15} /> New Client
          </button>
        </div>
      </div>

      {/* Search */}
      <div style={{ position: 'relative', marginBottom: 20, maxWidth: 400 }}>
        <Search size={13} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: `${BRAND.cyan}80`, pointerEvents: 'none' }} />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by name, email, MCC…"
          style={{
            width: '100%', paddingLeft: 36, paddingRight: 12, paddingTop: 8, paddingBottom: 8,
            background: 'rgba(255,255,255,0.05)', border: `1px solid ${BRAND.borderCyan}`,
            borderRadius: 10, color: BRAND.text, fontSize: 13, outline: 'none', boxSizing: 'border-box',
          }}
        />
      </div>

      {/* Drag hint */}
      <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
        <GripVertical size={11} /> Drag cards to advance through the pipeline · Click Manage Client to open detail
      </p>

      {/* Kanban columns */}
      {loading ? (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 200 }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 28, height: 28, borderRadius: '50%', border: `2px solid ${BRAND.cyan}`, borderTopColor: 'transparent', animation: 'spin 0.8s linear infinite' }} />
            <span style={{ fontSize: 13, color: BRAND.muted }}>Loading pipeline…</span>
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', gap: 12, overflowX: 'auto', paddingBottom: 16, scrollbarWidth: 'thin', scrollbarColor: `${BRAND.borderCyan} transparent` }}>
          {KANBAN_PHASES.map(phase => {
            const meta = PHASE_META[phase]
            const cards = filtered.filter(a => a.current_phase === phase)
            const isOver = dragOverPhase === phase && draggingId !== null

            return (
              <div key={phase}
                style={{ display: 'flex', flexDirection: 'column', gap: 10, flexShrink: 0, width: 200 }}
                onDragOver={e => { e.preventDefault(); setDragOverPhase(phase) }}
                onDragEnter={e => {
                  e.preventDefault()
                  dragCounter.current[phase] = (dragCounter.current[phase] ?? 0) + 1
                  setDragOverPhase(phase)
                }}
                onDragLeave={() => {
                  dragCounter.current[phase] = (dragCounter.current[phase] ?? 1) - 1
                  if ((dragCounter.current[phase] ?? 0) <= 0) {
                    dragCounter.current[phase] = 0
                    setDragOverPhase(null)
                  }
                }}
                onDrop={e => {
                  e.preventDefault()
                  dragCounter.current[phase] = 0
                  if (draggingId) moveToPhase(draggingId, phase)
                  setDragOverPhase(null)
                  setDraggingId(null)
                }}
              >
                {/* Column header */}
                <div style={{
                  display: 'flex', flexDirection: 'column', gap: 4, padding: '10px 12px', borderRadius: 10,
                  backgroundColor: meta.bg,
                  border: `1px solid ${isOver ? meta.color : meta.border}`,
                  boxShadow: isOver ? `0 0 0 2px ${meta.color}30` : undefined,
                  transition: 'box-shadow 0.15s',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: meta.color }}>
                      {meta.shortLabel}
                    </span>
                    <span style={{ fontSize: 10, fontWeight: 700, padding: '1px 6px', borderRadius: 99, backgroundColor: `${meta.color}20`, color: meta.color }}>
                      {cards.length}
                    </span>
                  </div>
                </div>

                {/* Cards */}
                <div style={{
                  display: 'flex', flexDirection: 'column', gap: 8, minHeight: 80,
                  padding: 6, borderRadius: 10, transition: 'background 0.15s',
                  backgroundColor: isOver ? `${meta.bg}` : 'transparent',
                  border: isOver ? `1px dashed ${meta.color}60` : '1px solid transparent',
                }}>
                  {cards.length === 0 ? (
                    <div style={{ backgroundColor: BRAND.card, border: `1px solid ${BRAND.border}`, borderRadius: 10, opacity: isOver ? 0.7 : 0.3 }}>
                      <p style={{ padding: '20px 16px', textAlign: 'center', fontSize: 11, color: BRAND.muted }}>
                        {isOver ? 'Drop here' : 'Empty'}
                      </p>
                    </div>
                  ) : (
                    cards.map(app => (
                      <OnboardingCard key={app.id} app={app}
                        dragging={draggingId === app.id}
                        onDragStart={() => setDraggingId(app.id)}
                        onDragEnd={() => { setDraggingId(null); setDragOverPhase(null) }}
                        onManage={() => router.push(`/admin/onboarding-crm/${app.id}`)}
                      />
                    ))
                  )}
                  {isOver && cards.length > 0 && (
                    <div style={{ height: 36, borderRadius: 10, border: `2px dashed ${meta.color}60`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 600, color: meta.color }}>
                      Drop here
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Declined toggle */}
      {declined.length > 0 && (
        <button onClick={() => setShowDeclined(v => !v)}
          style={{ marginTop: 4, fontSize: 11, color: 'rgba(255,255,255,0.3)', background: 'none', border: 'none', cursor: 'pointer' }}>
          {showDeclined ? '↑ Hide declined' : `↓ Show ${declined.length} declined`}
        </button>
      )}

      <NewClientDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} onCreated={app => setApps(p => [app, ...p])} />
    </div>
  )
}
