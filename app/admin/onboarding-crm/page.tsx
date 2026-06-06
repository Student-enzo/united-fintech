'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { BRAND } from '@/lib/brand'
import { useColors } from '@/lib/theme'
import { supabase } from '@/lib/supabase'
import { MOCK_APPLICATIONS } from '@/lib/mock-onboarding'
import type { OnboardingApplication, Phase, LinkStatus } from '@/lib/onboarding-types'
import { ChevronRight, X, Plus, Copy, Mail, AlertTriangle, CheckCircle } from 'lucide-react'

// ── Constants ──────────────────────────────────────────────────────────────

type TabKey = 'all' | Phase

const TABS: { key: TabKey; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'intake_sent', label: 'Intake Sent' },
  { key: 'document_review', label: 'Document Review' },
  { key: 'partner_selection', label: 'Partner Selection' },
  { key: 'pursuit', label: 'In Pursuit' },
  { key: 'live', label: 'Live' },
  { key: 'declined', label: 'Declined' },
]

const STANDARD_DOCS = [
  'Government ID',
  'Bank Statements (3 months)',
  'Voided Check',
  'Business License / Articles',
  'EIN Letter',
  'Processing Statements (optional)',
]

// ── Helpers ─────────────────────────────────────────────────────────────────

function daysSince(d: string) { return Math.floor((Date.now() - new Date(d).getTime()) / 86400000) }
function fmtDate(d: string) { return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) }

function phaseBadge(phase: Phase) {
  const map: Record<Phase, { label: string; bg: string; color: string }> = {
    intake_sent:       { label: 'Intake Sent',    bg: 'rgba(138,146,156,0.2)',  color: BRAND.silverLo },
    document_review:   { label: 'Doc Review',     bg: 'rgba(252,211,77,0.15)', color: BRAND.warn },
    partner_selection: { label: 'Partner Select', bg: 'rgba(144,196,207,0.15)', color: BRAND.cyan },
    pursuit:           { label: 'In Pursuit',     bg: 'rgba(74,155,127,0.2)',  color: BRAND.cyanDeep },
    live:              { label: 'Live',            bg: 'rgba(110,231,183,0.15)', color: BRAND.success },
    declined:          { label: 'Declined',        bg: 'rgba(232,80,74,0.15)', color: BRAND.danger },
  }
  return map[phase]
}

function riskBadge(tier: string) {
  const map: Record<string, { label: string; color: string }> = {
    unscored:  { label: 'Unscored',  color: BRAND.silverLo },
    low:       { label: 'Low',       color: BRAND.success },
    medium:    { label: 'Medium',    color: BRAND.warn },
    high:      { label: 'High',      color: '#F97316' },
    very_high: { label: 'Very High', color: BRAND.danger },
  }
  return map[tier] ?? { label: tier, color: BRAND.silverLo }
}

function linkBadge(s: LinkStatus) {
  return s === 'submitted' ? { label: 'Submitted', color: BRAND.success }
    : s === 'opened'       ? { label: 'Opened',    color: BRAND.warn }
    :                        { label: 'Sent',       color: BRAND.silverLo }
}

// ── Sub-components ──────────────────────────────────────────────────────────

function Badge({ label, bg, color }: { label: string; bg: string; color: string }) {
  return (
    <span style={{ background: bg, color, fontSize: 11, fontWeight: 600, letterSpacing: '0.04em', padding: '2px 8px', borderRadius: 4, whiteSpace: 'nowrap' }}>
      {label}
    </span>
  )
}

function StatCard({ label, value, sub, accent }: { label: string; value: number; sub?: string; accent?: string }) {
  const c = useColors()
  return (
    <div style={{ background: c.card, border: `1px solid ${c.border}`, borderRadius: 10, padding: '16px 20px', flex: 1, minWidth: 140 }}>
      <div style={{ fontSize: 24, fontWeight: 700, color: accent ?? BRAND.text }}>{value}</div>
      <div style={{ fontSize: 12, color: BRAND.muted, marginTop: 2, letterSpacing: '0.05em', textTransform: 'uppercase' }}>{label}</div>
      {sub && <div style={{ fontSize: 11, color: BRAND.warn, marginTop: 4 }}>{sub}</div>}
    </div>
  )
}

function SkeletonRow() {
  return (
    <tr>
      {[200, 100, 80, 80, 60, 60, 32].map((w, i) => (
        <td key={i} style={{ padding: '14px 16px' }}>
          <div style={{ height: 14, width: w, borderRadius: 4, background: 'rgba(255,255,255,0.06)' }} />
        </td>
      ))}
    </tr>
  )
}

// ── New Client Drawer ───────────────────────────────────────────────────────

interface DrawerProps {
  open: boolean
  onClose: () => void
  onCreated: (app: OnboardingApplication) => void
}

function NewClientDrawer({ open, onClose, onCreated }: DrawerProps) {
  const c = useColors()
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

  function handleClose() { reset(); onClose() }

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
      const link = `${process.env.NEXT_PUBLIC_APP_URL ?? window.location.origin}/apply/${data.intake_token}`
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
    width: '100%', background: c.inputBg, border: `1px solid ${c.inputBorder}`,
    borderRadius: 6, padding: '8px 12px', color: BRAND.text, fontSize: 13, outline: 'none', boxSizing: 'border-box',
  }
  const canSubmit = !loading && businessName.trim() && email.trim()

  return (
    <>
      {open && <div onClick={handleClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 49 }} />}
      <div style={{
        position: 'fixed', top: 0, right: 0, bottom: 0, width: 420, zIndex: 50,
        background: c.card, borderLeft: `1px solid ${BRAND.borderCyan}`,
        transform: open ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 0.25s ease', display: 'flex', flexDirection: 'column',
        boxShadow: open ? BRAND.glowCyan : 'none',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px', borderBottom: `1px solid ${BRAND.border}` }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: BRAND.text, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            New Merchant Application
          </div>
          <button onClick={handleClose} style={{ background: 'none', border: 'none', color: BRAND.muted, cursor: 'pointer', padding: 4 }}>
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

// ── Main Page ──────────────────────────────────────────────────────────────

export default function OnboardingCRMPage() {
  const router = useRouter()
  const c = useColors()
  const [tab, setTab] = useState<TabKey>('all')
  const [apps, setApps] = useState<OnboardingApplication[]>(MOCK_APPLICATIONS)
  const [loading, setLoading] = useState(true)
  const [drawerOpen, setDrawerOpen] = useState(false)

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

  const filtered = tab === 'all' ? apps : apps.filter(a => a.current_phase === tab)

  const phaseCounts: Partial<Record<Phase, number>> = {}
  apps.forEach(a => { phaseCounts[a.current_phase] = (phaseCounts[a.current_phase] ?? 0) + 1 })

  const totalActive = apps.filter(a => a.current_phase !== 'declined' && a.current_phase !== 'live').length
  const awaitingDocs = phaseCounts['document_review'] ?? 0
  const inPursuit = phaseCounts['pursuit'] ?? 0
  const liveThisMonth = apps.filter(a => {
    if (!a.live_at) return false
    const d = new Date(a.live_at); const n = new Date()
    return d.getMonth() === n.getMonth() && d.getFullYear() === n.getFullYear()
  }).length

  const highlightPhases: Phase[] = ['document_review', 'pursuit', 'partner_selection']

  return (
    <div style={{ background: BRAND.bg, minHeight: '100vh', padding: '28px 32px' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: BRAND.silverLo, marginBottom: 4 }}>
            Onboarding CRM
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: BRAND.text, margin: 0 }}>Merchant Acquisition Pipeline</h1>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
          {highlightPhases.map(ph => {
            const cnt = phaseCounts[ph]
            if (!cnt) return null
            const b = phaseBadge(ph)
            return (
              <span key={ph} style={{ background: b.bg, color: b.color, fontSize: 11, fontWeight: 600, padding: '4px 10px', borderRadius: 20, letterSpacing: '0.04em' }}>
                {cnt} {b.label}
              </span>
            )
          })}
          <button onClick={() => setDrawerOpen(true)} style={{
            display: 'flex', alignItems: 'center', gap: 6, background: BRAND.cyan,
            border: 'none', borderRadius: 8, padding: '8px 16px', color: '#1c1c1c',
            fontSize: 13, fontWeight: 700, cursor: 'pointer', letterSpacing: '0.04em',
          }}>
            <Plus size={15} />New Client
          </button>
        </div>
      </div>

      {/* Stats bar */}
      <div style={{ display: 'flex', gap: 14, marginBottom: 24, flexWrap: 'wrap' }}>
        <StatCard label="Active Applications" value={totalActive} />
        <StatCard label="Awaiting Doc Review" value={awaitingDocs} accent={awaitingDocs > 0 ? BRAND.warn : undefined} sub={awaitingDocs > 0 ? 'Needs attention' : undefined} />
        <StatCard label="In Pursuit" value={inPursuit} accent={inPursuit > 0 ? BRAND.cyan : undefined} />
        <StatCard label="Live This Month" value={liveThisMonth} accent={liveThisMonth > 0 ? BRAND.success : undefined} />
      </div>

      {/* Tab bar */}
      <div style={{ display: 'flex', gap: 2, borderBottom: `1px solid rgba(144,196,207,0.1)`, marginBottom: 20 }}>
        {TABS.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)} style={{
            background: 'none', border: 'none', padding: '8px 14px', fontSize: 13, cursor: 'pointer',
            color: tab === t.key ? BRAND.cyan : 'rgba(255,255,255,0.4)',
            borderBottom: tab === t.key ? `2px solid ${BRAND.cyan}` : '2px solid transparent',
            fontWeight: tab === t.key ? 600 : 400, transition: 'color 0.15s', letterSpacing: '0.02em',
          }}
            onMouseEnter={e => { if (tab !== t.key) (e.target as HTMLElement).style.color = 'rgba(255,255,255,0.7)' }}
            onMouseLeave={e => { if (tab !== t.key) (e.target as HTMLElement).style.color = 'rgba(255,255,255,0.4)' }}
          >
            {t.label}
            {t.key !== 'all' && phaseCounts[t.key as Phase] ? (
              <span style={{ marginLeft: 6, fontSize: 11, background: 'rgba(144,196,207,0.12)', color: BRAND.cyan, borderRadius: 10, padding: '1px 6px' }}>
                {phaseCounts[t.key as Phase]}
              </span>
            ) : null}
          </button>
        ))}
      </div>

      {/* Table */}
      <div style={{ background: c.card, border: `1px solid ${c.border}`, borderRadius: 10, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'rgba(255,255,255,0.03)' }}>
              {['Business', 'Phase', 'Risk', 'Created', 'Last Update', 'Link', ''].map((h, i) => (
                <th key={i} style={{ padding: '10px 16px', textAlign: 'left', fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: BRAND.silverLo, borderBottom: `1px solid rgba(144,196,207,0.08)` }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ padding: '48px 16px', textAlign: 'center', color: BRAND.muted, fontSize: 13 }}>
                  No applications in this phase.
                </td>
              </tr>
            ) : filtered.map(app => {
              const phase = phaseBadge(app.current_phase)
              const risk = riskBadge(app.risk_tier)
              const link = linkBadge(app.link_status)
              const days = daysSince(app.created_at)
              return (
                <tr key={app.id} onClick={() => router.push(`/admin/onboarding-crm/${app.id}`)}
                  style={{ cursor: 'pointer', borderBottom: `1px solid rgba(144,196,207,0.06)`, transition: 'background 0.12s' }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.03)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      {app.duplicate_of && <span title="Possible duplicate" style={{ color: BRAND.warn, display: 'flex' }}><AlertTriangle size={14} /></span>}
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: BRAND.text }}>
                          {app.business_name ?? <span style={{ color: BRAND.muted, fontStyle: 'italic' }}>Unnamed</span>}
                        </div>
                        {app.owner_name && <div style={{ fontSize: 11, color: BRAND.muted, marginTop: 2 }}>{app.owner_name}</div>}
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '14px 16px' }}><Badge label={phase.label} bg={phase.bg} color={phase.color} /></td>
                  <td style={{ padding: '14px 16px' }}><span style={{ fontSize: 12, fontWeight: 600, color: risk.color }}>{risk.label}</span></td>
                  <td style={{ padding: '14px 16px', fontSize: 12, color: BRAND.silverLo }}>{fmtDate(app.created_at)}</td>
                  <td style={{ padding: '14px 16px', fontSize: 12, color: days > 14 ? BRAND.warn : BRAND.silverLo }}>
                    {days === 0 ? 'Today' : `${days}d ago`}
                  </td>
                  <td style={{ padding: '14px 16px' }}><span style={{ fontSize: 11, fontWeight: 600, color: link.color }}>{link.label}</span></td>
                  <td style={{ padding: '14px 16px', color: BRAND.muted }}><ChevronRight size={16} /></td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <NewClientDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} onCreated={app => setApps(p => [app, ...p])} />
    </div>
  )
}
