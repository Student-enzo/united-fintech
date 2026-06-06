'use client'

import { useState } from 'react'
import { CheckSquare, Square, ExternalLink, AlertTriangle, Bot, RefreshCw } from 'lucide-react'
import { BRAND } from '@/lib/brand'
import { supabase } from '@/lib/supabase'
import { updateDocumentStatus, updateApplicationPhase } from '@/lib/onboarding-db'
import type {
  OnboardingApplication, OnboardingDocument, OnboardingNote, OnboardingEmail,
} from '@/lib/onboarding-types'

interface Props {
  application: OnboardingApplication
  documents: OnboardingDocument[]
  notes: OnboardingNote[]
  emailDrafts: OnboardingEmail[]
  onUpdate: () => void
}

const STATUS_COLORS: Record<string, { bg: string; text: string; label: string }> = {
  pending:            { bg: `${BRAND.muted}20`,   text: BRAND.muted,    label: 'Pending' },
  accepted:           { bg: `${BRAND.success}15`, text: BRAND.success,  label: 'Accepted' },
  rejected:           { bg: `${BRAND.danger}15`,  text: BRAND.danger,   label: 'Rejected' },
  re_upload_requested:{ bg: `${BRAND.warn}15`,    text: BRAND.warn,     label: 'Re-upload' },
}

function fmt(iso: string | null) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export default function PhaseDocReview({ application: app, documents, notes, emailDrafts, onUpdate }: Props) {
  const [docNotes, setDocNotes]       = useState<Record<string, string>>(
    Object.fromEntries(documents.map(d => [d.id, d.notes ?? '']))
  )
  const [overallNote, setOverallNote] = useState('')
  const [matchChecked, setMatchChecked] = useState(app.match_list_checked)
  const [aiLoading, setAiLoading]     = useState(false)
  const [aiQuestion, setAiQuestion]   = useState('')
  const [aiAnswer, setAiAnswer]       = useState('')
  const [aiAnsLoading, setAiAnsLoading] = useState(false)
  const [confirming, setConfirming]   = useState(false)
  const [advancing, setAdvancing]     = useState(false)

  const hasAccepted = documents.some(d => d.status === 'accepted')
  const canAdvance  = hasAccepted && matchChecked && app.current_phase !== 'live'
  const isDeclined  = app.current_phase === 'declined'

  async function setStatus(docId: string, status: string) {
    await updateDocumentStatus(docId, status, docNotes[docId])
    onUpdate()
  }

  async function saveNote(docId: string) {
    await updateDocumentStatus(docId, documents.find(d => d.id === docId)?.status ?? 'pending', docNotes[docId])
    onUpdate()
  }

  async function toggleMatch() {
    const next = !matchChecked
    await supabase.from('onboarding_applications').update({ match_list_checked: next }).eq('id', app.id)
    setMatchChecked(next)
    onUpdate()
  }

  async function runAI() {
    setAiLoading(true)
    try {
      const res = await fetch('/api/ai/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'analyze_documents', applicationId: app.id }),
      })
      await res.json()
      onUpdate()
    } catch (e) { console.error(e) }
    setAiLoading(false)
  }

  async function askAI() {
    if (!aiQuestion.trim()) return
    setAiAnsLoading(true)
    try {
      const res = await fetch('/api/ai/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'ask', applicationId: app.id, question: aiQuestion }),
      })
      const json = await res.json()
      setAiAnswer(json.answer ?? json.result ?? '')
    } catch (e) { console.error(e) }
    setAiAnsLoading(false)
  }

  async function advance() {
    setAdvancing(true)
    await updateApplicationPhase(app.id, 'partner_selection')
    onUpdate()
    setConfirming(false)
    setAdvancing(false)
  }

  async function reopen() {
    await updateApplicationPhase(app.id, 'document_review')
    onUpdate()
  }

  const riskScore = app.ai_risk_score ?? 0
  const riskGaugeColor = riskScore <= 40 ? BRAND.success : riskScore <= 70 ? BRAND.warn : BRAND.danger

  const ackEmail = emailDrafts.find(e => e.email_type === 'acknowledgment')
  const reupEmail = emailDrafts.find(e => e.email_type === 're_upload_request')
  const repEmail  = emailDrafts.find(e => e.email_type === 'representation_agreement')

  return (
    <div className="flex flex-col lg:flex-row gap-5 pb-24">

      {/* LEFT: Document list */}
      <div className="flex-1 min-w-0 space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-widest" style={{ color: BRAND.cyan }}>Documents ({documents.length})</h2>

        {documents.length === 0 && (
          <div className="rounded-xl p-8 text-center" style={{ backgroundColor: BRAND.card, border: `1px solid ${BRAND.border}` }}>
            <span className="text-sm" style={{ color: BRAND.muted }}>No documents uploaded yet.</span>
          </div>
        )}

        {documents.map(doc => {
          const sc = STATUS_COLORS[doc.status] ?? STATUS_COLORS.pending
          return (
            <div key={doc.id} className="rounded-xl p-4 space-y-3"
              style={{ backgroundColor: BRAND.card, border: `1px solid ${BRAND.border}` }}>
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-semibold" style={{ color: BRAND.text }}>{doc.file_name ?? 'Unnamed file'}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ backgroundColor: 'rgba(255,255,255,0.05)', color: BRAND.silverLo, border: `1px solid ${BRAND.border}` }}>
                      {doc.doc_label ?? doc.doc_type}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: sc.bg, color: sc.text }}>
                      {sc.label}
                    </span>
                  </div>
                  <span className="text-xs mt-0.5 block" style={{ color: BRAND.muted }}>Uploaded {fmt(doc.uploaded_at)}</span>
                </div>
              </div>

              {doc.ai_flags?.stale && (
                <div className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-md w-fit"
                  style={{ backgroundColor: `${BRAND.danger}15`, color: BRAND.danger, border: `1px solid ${BRAND.danger}30` }}>
                  <AlertTriangle size={11}/> STALE — over 90 days old
                </div>
              )}
              {doc.ai_flags?.misclassified && (
                <div className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-md w-fit"
                  style={{ backgroundColor: `${BRAND.warn}15`, color: BRAND.warn, border: `1px solid ${BRAND.warn}30` }}>
                  <AlertTriangle size={11}/> May be: {doc.ai_flags.suggested_type ?? 'unknown type'}
                </div>
              )}

              {doc.ai_analysis && (
                <p className="text-xs leading-relaxed" style={{ color: BRAND.muted }}>
                  {doc.ai_analysis.slice(0, 100)}{doc.ai_analysis.length > 100 ? '…' : ''}
                </p>
              )}

              {doc.ai_flags?.extracted_data && Object.keys(doc.ai_flags.extracted_data).length > 0 && (
                <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs rounded-lg p-2"
                  style={{ backgroundColor: 'rgba(144,196,207,0.05)', border: `1px solid ${BRAND.borderCyan}` }}>
                  {Object.entries(doc.ai_flags.extracted_data).map(([k, v]) => (
                    <div key={k}><span style={{ color: BRAND.muted }}>{k}: </span><span style={{ color: BRAND.silver }}>{v}</span></div>
                  ))}
                </div>
              )}

              <div className="flex gap-2 flex-wrap">
                <button onClick={() => setStatus(doc.id, 'accepted')}
                  className="text-xs font-semibold px-3 py-1.5 rounded-lg transition-opacity hover:opacity-75"
                  style={{ backgroundColor: `${BRAND.success}15`, color: BRAND.success, border: `1px solid ${BRAND.success}30` }}>
                  ✓ Accept
                </button>
                <button onClick={() => setStatus(doc.id, 'rejected')}
                  className="text-xs font-semibold px-3 py-1.5 rounded-lg transition-opacity hover:opacity-75"
                  style={{ backgroundColor: `${BRAND.danger}15`, color: BRAND.danger, border: `1px solid ${BRAND.danger}30` }}>
                  ✗ Reject
                </button>
                <button onClick={() => setStatus(doc.id, 're_upload_requested')}
                  className="text-xs font-semibold px-3 py-1.5 rounded-lg transition-opacity hover:opacity-75"
                  style={{ backgroundColor: `${BRAND.warn}15`, color: BRAND.warn, border: `1px solid ${BRAND.warn}30` }}>
                  ↺ Re-upload
                </button>
              </div>

              <textarea
                rows={2}
                placeholder="Doc notes…"
                value={docNotes[doc.id] ?? ''}
                onChange={e => setDocNotes(n => ({ ...n, [doc.id]: e.target.value }))}
                onBlur={() => saveNote(doc.id)}
                className="w-full text-xs rounded-lg px-3 py-2 resize-none focus:outline-none"
                style={{ backgroundColor: 'rgba(255,255,255,0.04)', border: `1px solid ${BRAND.border}`, color: BRAND.text }}
              />
            </div>
          )
        })}

        {/* Overall notes */}
        <div className="rounded-xl p-4 space-y-2" style={{ backgroundColor: BRAND.card, border: `1px solid ${BRAND.border}` }}>
          <span className="text-xs font-bold uppercase tracking-wider" style={{ color: BRAND.cyan }}>Overall Notes</span>
          <textarea rows={3} placeholder="General notes for this application…" value={overallNote}
            onChange={e => setOverallNote(e.target.value)}
            className="w-full text-xs rounded-lg px-3 py-2 resize-none focus:outline-none"
            style={{ backgroundColor: 'rgba(255,255,255,0.04)', border: `1px solid ${BRAND.border}`, color: BRAND.text }}
          />
        </div>

        {/* MATCH + Website compliance */}
        <div className="rounded-xl p-4 space-y-3" style={{ backgroundColor: BRAND.card, border: `1px solid ${BRAND.border}` }}>
          <button onClick={toggleMatch}
            className="flex items-center gap-2 text-sm font-medium hover:opacity-80 transition-opacity"
            style={{ color: matchChecked ? BRAND.success : BRAND.muted }}>
            {matchChecked ? <CheckSquare size={16}/> : <Square size={16}/>}
            MATCH List Checked
          </button>

          {app.website_compliance && (
            <div className="grid grid-cols-3 gap-2 pt-2">
              {[['Terms', app.website_compliance.has_terms], ['Privacy', app.website_compliance.has_privacy], ['Refund Policy', app.website_compliance.has_refund]].map(([l, v]) => (
                <div key={l as string} className="text-center rounded-lg p-2"
                  style={{ backgroundColor: (v ? BRAND.success : BRAND.danger) + '15', border: `1px solid ${(v ? BRAND.success : BRAND.danger)}30` }}>
                  <div className="text-[10px] uppercase" style={{ color: v ? BRAND.success : BRAND.danger }}>{l as string}</div>
                  <div className="text-xs font-bold" style={{ color: v ? BRAND.success : BRAND.danger }}>{v ? '✓' : '✗'}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* RIGHT: AI panel */}
      <div className="lg:w-80 xl:w-96 space-y-4 flex-shrink-0">
        <div className="rounded-xl p-4 space-y-4" style={{ backgroundColor: BRAND.card, border: `1px solid ${BRAND.borderCyan}` }}>
          <h2 className="text-sm font-bold uppercase tracking-widest" style={{ color: BRAND.cyan }}>AI Analysis</h2>

          {!app.ai_summary ? (
            <button onClick={runAI} disabled={aiLoading}
              className="w-full flex items-center justify-center gap-2 text-sm font-semibold py-2.5 rounded-lg transition-opacity hover:opacity-75"
              style={{ backgroundColor: 'rgba(144,196,207,0.1)', color: BRAND.cyan, border: `1px solid ${BRAND.borderCyan}` }}>
              {aiLoading ? <><RefreshCw size={13} className="animate-spin"/> Running…</> : <><Bot size={13}/> Run AI Analysis</>}
            </button>
          ) : (
            <p className="text-xs leading-relaxed" style={{ color: BRAND.silverLo }}>{app.ai_summary}</p>
          )}

          {app.ai_risk_score !== null && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase tracking-wider" style={{ color: BRAND.muted }}>Risk Score</span>
                <span className="text-sm font-bold" style={{ color: riskGaugeColor }}>{riskScore}/100</span>
              </div>
              <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}>
                <div className="h-full rounded-full transition-all" style={{ width: `${riskScore}%`, backgroundColor: riskGaugeColor }}/>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold inline-block"
                style={{ backgroundColor: `${riskGaugeColor}20`, color: riskGaugeColor }}>
                {app.risk_tier.replace('_', ' ').toUpperCase()} risk
              </span>
            </div>
          )}

          {app.ai_preapproval_recommendation && (
            <p className="text-xs leading-relaxed italic" style={{ color: BRAND.muted }}>
              {app.ai_preapproval_recommendation}
            </p>
          )}

          {/* Ask AI */}
          <div className="space-y-2 pt-2 border-t" style={{ borderColor: BRAND.border }}>
            <span className="text-[10px] uppercase tracking-wider" style={{ color: BRAND.muted }}>Ask AI</span>
            <div className="flex gap-2">
              <input value={aiQuestion} onChange={e => setAiQuestion(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && askAI()}
                placeholder="Ask a question…"
                className="flex-1 text-xs px-3 py-2 rounded-lg focus:outline-none"
                style={{ backgroundColor: 'rgba(255,255,255,0.05)', border: `1px solid ${BRAND.border}`, color: BRAND.text }}
              />
              <button onClick={askAI} disabled={aiAnsLoading}
                className="text-xs font-semibold px-3 py-2 rounded-lg transition-opacity hover:opacity-75 flex-shrink-0"
                style={{ backgroundColor: 'rgba(144,196,207,0.1)', color: BRAND.cyan, border: `1px solid ${BRAND.borderCyan}` }}>
                {aiAnsLoading ? '…' : 'Ask'}
              </button>
            </div>
            {aiAnswer && (
              <p className="text-xs leading-relaxed rounded-lg p-2" style={{ backgroundColor: 'rgba(144,196,207,0.06)', color: BRAND.silverLo, border: `1px solid ${BRAND.borderCyan}` }}>
                {aiAnswer}
              </p>
            )}
          </div>
        </div>

        {/* Email drafts */}
        <div className="rounded-xl p-4 space-y-3" style={{ backgroundColor: BRAND.card, border: `1px solid ${BRAND.border}` }}>
          <h2 className="text-sm font-bold uppercase tracking-widest" style={{ color: BRAND.cyan }}>Email Drafts</h2>
          {[ackEmail, reupEmail, repEmail].filter(Boolean).map(e => (
            <div key={e!.id} className="rounded-lg p-3 space-y-1.5" style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: `1px solid ${BRAND.border}` }}>
              <div className="text-[10px] uppercase tracking-wider" style={{ color: BRAND.muted }}>{e!.email_type.replace(/_/g, ' ')}</div>
              <div className="text-xs font-semibold truncate" style={{ color: BRAND.silver }}>{e!.subject}</div>
              <p className="text-xs line-clamp-2" style={{ color: BRAND.muted }}>{e!.body}</p>
              <a href={mailtoHref(app.owner_email, e!.subject, e!.body)}
                className="inline-flex items-center gap-1 text-xs font-semibold hover:opacity-75"
                style={{ color: BRAND.cyan }}>
                <ExternalLink size={10}/> Open in Email
              </a>
            </div>
          ))}
          {[ackEmail, reupEmail, repEmail].every(e => !e) && (
            <span className="text-xs" style={{ color: BRAND.muted }}>No drafts yet.</span>
          )}
        </div>
      </div>

      {/* Sticky bottom bar */}
      <div className="fixed bottom-0 left-0 right-0 px-6 py-4 flex items-center justify-end gap-4"
        style={{ backgroundColor: BRAND.card, borderTop: `1px solid ${BRAND.border}`, zIndex: 40 }}>
        {isDeclined ? (
          <button onClick={reopen}
            className="text-sm font-bold px-6 py-2.5 rounded-lg transition-opacity hover:opacity-80"
            style={{ backgroundColor: `${BRAND.warn}15`, color: BRAND.warn, border: `1px solid ${BRAND.warn}40` }}>
            Re-open Application
          </button>
        ) : (
          <>
            {!canAdvance && (
              <span className="text-xs" style={{ color: BRAND.muted }}>
                {!hasAccepted ? 'Accept at least 1 document' : 'MATCH list must be checked'}
              </span>
            )}
            {confirming ? (
              <div className="flex items-center gap-3">
                <span className="text-sm" style={{ color: BRAND.warn }}>Pre-approve this application?</span>
                <button onClick={advance} disabled={advancing}
                  className="text-sm font-bold px-5 py-2 rounded-lg"
                  style={{ backgroundColor: BRAND.cyan, color: BRAND.bg }}>
                  {advancing ? 'Moving…' : 'Confirm'}
                </button>
                <button onClick={() => setConfirming(false)} className="text-sm" style={{ color: BRAND.muted }}>Cancel</button>
              </div>
            ) : (
              <button onClick={() => setConfirming(true)} disabled={!canAdvance}
                className="text-sm font-bold px-6 py-2.5 rounded-lg transition-opacity"
                style={{
                  backgroundColor: canAdvance ? BRAND.cyan : 'rgba(255,255,255,0.06)',
                  color: canAdvance ? BRAND.bg : BRAND.muted,
                  cursor: canAdvance ? 'pointer' : 'not-allowed',
                  boxShadow: canAdvance ? BRAND.glowCyan : 'none',
                }}>
                Pre-Approve by United Fintech →
              </button>
            )}
          </>
        )}
      </div>
    </div>
  )
}

function mailtoHref(to: string, subject: string, body: string) {
  return `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}
