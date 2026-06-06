'use client'

import { useState, useEffect } from 'react'
import { ExternalLink, Plus, AlertTriangle, CheckCircle2 } from 'lucide-react'
import { BRAND } from '@/lib/brand'
import { updatePursuitStage, updateApplicationPhase } from '@/lib/onboarding-db'
import { supabase } from '@/lib/supabase'
import type { OnboardingApplication, OnboardingPursuit, PursuitStageLog, PursuitDocumentRequest, PursuitStage } from '@/lib/onboarding-types'

interface Props {
  application: OnboardingApplication
  pursuits: OnboardingPursuit[]
  onUpdate: () => void
}

const STAGES: PursuitStage[] = ['not_submitted','submitted','initial_review','underwriting','conditionally_approved','approved','declined']

const STAGE_META: Record<PursuitStage, { label: string; color: string; bg: string }> = {
  not_submitted:        { label: 'Not Submitted',      color: BRAND.muted,    bg: 'rgba(255,255,255,0.06)' },
  submitted:            { label: 'Submitted',           color: '#60a5fa',      bg: 'rgba(96,165,250,0.1)' },
  initial_review:       { label: 'Initial Review',      color: BRAND.cyan,     bg: 'rgba(144,196,207,0.1)' },
  underwriting:         { label: 'Underwriting',        color: '#a78bfa',      bg: 'rgba(167,139,250,0.1)' },
  conditionally_approved:{ label: 'Cond. Approved',    color: BRAND.warn,     bg: `${BRAND.warn}15` },
  approved:             { label: 'Approved',            color: BRAND.success,  bg: `${BRAND.success}15` },
  declined:             { label: 'Declined',            color: BRAND.danger,   bg: `${BRAND.danger}15` },
}

function fmt(iso: string | null) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function daysUntil(iso: string) {
  return Math.ceil((new Date(iso).getTime() - Date.now()) / 86_400_000)
}

function mailtoHref(to: string, subject: string, body: string) {
  return `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}

function SlaTimer({ deadline }: { deadline: string }) {
  const days = daysUntil(deadline)
  const color = days < 2 ? BRAND.danger : days < 4 ? BRAND.warn : BRAND.success
  return (
    <div className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-lg w-fit"
      style={{ backgroundColor: `${color}15`, color, border: `1px solid ${color}30` }}>
      {days < 0 ? `SLA OVERDUE by ${Math.abs(days)}d` : `${days} day${days !== 1 ? 's' : ''} remaining (SLA)`}
    </div>
  )
}

function PursuitCard({ pursuit, ownerEmail, onUpdate }: { pursuit: OnboardingPursuit; ownerEmail: string; onUpdate: () => void }) {
  const [stageChanging, setStageChanging] = useState(false)
  const [conditions, setConditions]       = useState(pursuit.conditions ?? '')
  const [note, setNote]                   = useState('')
  const [stageLogs, setStageLogs]         = useState<PursuitStageLog[]>([])
  const [docReqs, setDocReqs]             = useState<PursuitDocumentRequest[]>([])
  const [showDocModal, setShowDocModal]   = useState(false)
  const [newDocName, setNewDocName]       = useState('')
  const [newDocReason, setNewDocReason]   = useState('')
  const [confirmDecline, setConfirmDecline] = useState(false)

  useEffect(() => {
    supabase.from('pursuit_stage_log').select('*').eq('pursuit_id', pursuit.id).order('changed_at', { ascending: false })
      .then(({ data }) => setStageLogs(data ?? []))
    supabase.from('pursuit_document_requests').select('*').eq('pursuit_id', pursuit.id)
      .then(({ data }) => setDocReqs(data ?? []))
  }, [pursuit.id])

  async function changeStage(stage: PursuitStage) {
    setStageChanging(true)
    await updatePursuitStage(pursuit.id, stage, note || undefined)
    setNote('')
    onUpdate()
    setStageChanging(false)
  }

  async function markConditionsRemoved() {
    await updatePursuitStage(pursuit.id, 'approved')
    onUpdate()
  }

  async function addDocRequest() {
    if (!newDocName.trim()) return
    await supabase.from('pursuit_document_requests').insert({
      pursuit_id: pursuit.id,
      application_id: pursuit.application_id,
      document_name: newDocName,
      reason: newDocReason || null,
      status: 'pending',
      deadline_at: new Date(Date.now() + 7 * 86_400_000).toISOString(),
    })
    setNewDocName('')
    setNewDocReason('')
    setShowDocModal(false)
    const { data } = await supabase.from('pursuit_document_requests').select('*').eq('pursuit_id', pursuit.id)
    setDocReqs(data ?? [])
  }

  const sm = STAGE_META[pursuit.current_stage]
  const isUnderwriting = pursuit.current_stage === 'underwriting'
  const isCond         = pursuit.current_stage === 'conditionally_approved'
  const isApproved     = pursuit.current_stage === 'approved'
  const condDays       = pursuit.condition_review_date ? daysUntil(pursuit.condition_review_date) : null

  const followUpSubject = `Underwriting Update — ${pursuit.partner_name}`
  const followUpBody    = `Hi,\n\nFollowing up on the underwriting status for our merchant application submitted to ${pursuit.partner_name}.\n\nPlease advise.\n\nBest regards,\nUnited Fintech`

  return (
    <div className="rounded-xl space-y-4 overflow-hidden"
      style={{ backgroundColor: BRAND.card, border: `1px solid ${isApproved ? BRAND.success : BRAND.border}` }}>

      {/* Header */}
      <div className="px-5 pt-4 flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-3">
          <span className="text-base font-bold" style={{ color: BRAND.text }}>{pursuit.partner_name}</span>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase" style={{ backgroundColor: sm.bg, color: sm.color }}>
            {sm.label}
          </span>
        </div>
        {isApproved && (
          <div className="flex items-center gap-1.5 text-sm font-bold" style={{ color: BRAND.success }}>
            <CheckCircle2 size={15}/> APPROVED
          </div>
        )}
      </div>

      <div className="px-5 space-y-4">
        {/* Stage selector */}
        {!isApproved && (
          <div className="flex items-center gap-3 flex-wrap">
            <select value={pursuit.current_stage} onChange={e => changeStage(e.target.value as PursuitStage)}
              disabled={stageChanging}
              className="text-xs rounded-lg px-3 py-2 focus:outline-none"
              style={{ backgroundColor: 'rgba(255,255,255,0.05)', border: `1px solid ${BRAND.border}`, color: BRAND.text }}>
              {STAGES.map(s => (
                <option key={s} value={s}>{STAGE_META[s].label}</option>
              ))}
            </select>
            <input value={note} onChange={e => setNote(e.target.value)} placeholder="Stage note…"
              className="flex-1 text-xs px-3 py-2 rounded-lg focus:outline-none min-w-0"
              style={{ backgroundColor: 'rgba(255,255,255,0.04)', border: `1px solid ${BRAND.border}`, color: BRAND.text }}
            />
          </div>
        )}

        {/* SLA timer */}
        {isUnderwriting && pursuit.underwriting_sla_deadline && (
          <div className="space-y-2">
            <SlaTimer deadline={pursuit.underwriting_sla_deadline}/>
            <a href={mailtoHref(ownerEmail, followUpSubject, followUpBody)}
              className="inline-flex items-center gap-1.5 text-xs font-semibold hover:opacity-75 transition-opacity"
              style={{ color: BRAND.cyan }}>
              <ExternalLink size={11}/> Follow Up Email
            </a>
          </div>
        )}

        {/* Conditional approval */}
        {isCond && (
          <div className="rounded-lg p-3 space-y-2"
            style={{ backgroundColor: `${BRAND.warn}10`, border: `1px solid ${BRAND.warn}30` }}>
            <span className="text-xs font-bold uppercase" style={{ color: BRAND.warn }}>Conditions</span>
            {condDays !== null && (
              <div className="text-xs font-semibold" style={{ color: condDays < 14 ? BRAND.danger : BRAND.warn }}>
                Review date: {fmt(pursuit.condition_review_date)} ({condDays} days)
                {condDays < 14 && <AlertTriangle size={11} className="inline ml-1"/>}
              </div>
            )}
            <textarea rows={2} value={conditions} onChange={e => setConditions(e.target.value)}
              placeholder="Conditions text…"
              className="w-full text-xs rounded-lg px-3 py-2 resize-none focus:outline-none"
              style={{ backgroundColor: 'rgba(255,255,255,0.04)', border: `1px solid ${BRAND.border}`, color: BRAND.text }}
            />
            <button onClick={markConditionsRemoved}
              className="text-xs font-bold px-3 py-1.5 rounded-lg transition-opacity hover:opacity-75"
              style={{ backgroundColor: `${BRAND.success}15`, color: BRAND.success, border: `1px solid ${BRAND.success}30` }}>
              Mark Conditions Removed →
            </button>
          </div>
        )}

        {/* Document requests */}
        {docReqs.length > 0 && (
          <div className="space-y-2">
            <span className="text-[10px] uppercase tracking-wider" style={{ color: BRAND.muted }}>Document Requests</span>
            {docReqs.map(dr => {
              const ddDays = daysUntil(dr.deadline_at)
              return (
                <div key={dr.id} className="flex items-center justify-between text-xs rounded-lg px-3 py-2"
                  style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: `1px solid ${BRAND.border}` }}>
                  <div>
                    <span style={{ color: BRAND.silver }}>{dr.document_name}</span>
                    {dr.reason && <span style={{ color: BRAND.muted }}> — {dr.reason}</span>}
                  </div>
                  <span style={{ color: ddDays < 2 ? BRAND.danger : BRAND.muted }}>
                    {dr.status === 'fulfilled' ? 'Fulfilled' : `${ddDays}d left`}
                  </span>
                </div>
              )
            })}
          </div>
        )}

        <button onClick={() => setShowDocModal(v => !v)}
          className="flex items-center gap-1.5 text-xs font-semibold hover:opacity-75 transition-opacity"
          style={{ color: BRAND.cyan }}>
          <Plus size={12}/> Request Document
        </button>

        {showDocModal && (
          <div className="rounded-lg p-3 space-y-2" style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: `1px solid ${BRAND.border}` }}>
            <input value={newDocName} onChange={e => setNewDocName(e.target.value)} placeholder="Document name"
              className="w-full text-xs px-3 py-2 rounded-lg focus:outline-none"
              style={{ backgroundColor: 'rgba(255,255,255,0.05)', border: `1px solid ${BRAND.border}`, color: BRAND.text }}
            />
            <input value={newDocReason} onChange={e => setNewDocReason(e.target.value)} placeholder="Reason (optional)"
              className="w-full text-xs px-3 py-2 rounded-lg focus:outline-none"
              style={{ backgroundColor: 'rgba(255,255,255,0.05)', border: `1px solid ${BRAND.border}`, color: BRAND.text }}
            />
            <div className="flex gap-2">
              <button onClick={addDocRequest}
                className="text-xs font-bold px-3 py-1.5 rounded-lg"
                style={{ backgroundColor: BRAND.cyan, color: BRAND.bg }}>
                Create Request
              </button>
              <button onClick={() => setShowDocModal(false)} className="text-xs" style={{ color: BRAND.muted }}>Cancel</button>
            </div>
          </div>
        )}

        {/* Stage history */}
        {stageLogs.length > 0 && (
          <div className="space-y-1.5">
            <span className="text-[10px] uppercase tracking-wider" style={{ color: BRAND.muted }}>Stage History</span>
            {stageLogs.map(log => (
              <div key={log.id} className="flex items-center gap-3 text-xs">
                <span style={{ color: BRAND.muted }}>{fmt(log.changed_at)}</span>
                <span style={{ color: BRAND.silverLo }}>{log.stage.replace('_', ' ')}</span>
                {log.notes && <span style={{ color: BRAND.muted }}>— {log.notes}</span>}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      {!isApproved && (
        <div className="px-5 pb-4">
          {confirmDecline ? (
            <div className="flex items-center gap-3">
              <span className="text-xs" style={{ color: BRAND.danger }}>Mark as declined?</span>
              <button onClick={() => { changeStage('declined'); setConfirmDecline(false) }}
                className="text-xs font-bold px-3 py-1.5 rounded-lg"
                style={{ backgroundColor: `${BRAND.danger}15`, color: BRAND.danger, border: `1px solid ${BRAND.danger}30` }}>
                Confirm
              </button>
              <button onClick={() => setConfirmDecline(false)} className="text-xs" style={{ color: BRAND.muted }}>Cancel</button>
            </div>
          ) : (
            <button onClick={() => setConfirmDecline(true)}
              className="text-xs font-semibold hover:opacity-75 transition-opacity"
              style={{ color: `${BRAND.danger}99` }}>
              Mark Declined
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export default function PhasePursuit({ application: app, pursuits, onUpdate }: Props) {
  const [goLiveConfirm, setGoLiveConfirm] = useState(false)
  const [goLiveSaving, setGoLiveSaving]   = useState(false)
  const [showAddPartner, setShowAddPartner] = useState(false)

  const anyApproved = pursuits.some(p => p.current_stage === 'approved')

  async function markLive() {
    setGoLiveSaving(true)
    await updateApplicationPhase(app.id, 'live')
    onUpdate()
    setGoLiveSaving(false)
    setGoLiveConfirm(false)
  }

  return (
    <div className="max-w-3xl space-y-5">
      <h2 className="text-sm font-bold uppercase tracking-widest" style={{ color: BRAND.cyan }}>Pursuit Pipeline</h2>

      {pursuits.length === 0 && (
        <div className="rounded-xl p-8 text-center" style={{ backgroundColor: BRAND.card, border: `1px solid ${BRAND.border}` }}>
          <span className="text-sm" style={{ color: BRAND.muted }}>No pursuits yet. Go back to Partner Selection to add partners.</span>
        </div>
      )}

      {pursuits.map(p => (
        <PursuitCard key={p.id} pursuit={p} ownerEmail={app.owner_email} onUpdate={onUpdate}/>
      ))}

      {/* Add another partner */}
      <div>
        <button onClick={() => setShowAddPartner(v => !v)}
          className="flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-lg transition-opacity hover:opacity-75"
          style={{ backgroundColor: 'rgba(255,255,255,0.05)', color: BRAND.silverLo, border: `1px solid ${BRAND.border}` }}>
          <Plus size={14}/> Add Another Bank / Processor
        </button>
        {showAddPartner && (
          <div className="mt-3 rounded-xl p-4" style={{ backgroundColor: BRAND.card, border: `1px solid ${BRAND.border}` }}>
            <span className="text-xs" style={{ color: BRAND.muted }}>
              Go to the Partner Selection tab to add and confirm additional partners.
            </span>
          </div>
        )}
      </div>

      {/* Go live banner */}
      {anyApproved && (
        <div className="rounded-xl p-5 space-y-3 text-center"
          style={{ backgroundColor: `${BRAND.success}10`, border: `1px solid ${BRAND.success}40` }}>
          <div className="text-xl">🎉</div>
          <h3 className="text-base font-bold" style={{ color: BRAND.success }}>Ready to Go Live</h3>
          <p className="text-xs" style={{ color: BRAND.muted }}>At least one partner has approved. You can now mark this merchant as live.</p>
          {goLiveConfirm ? (
            <div className="flex items-center justify-center gap-3">
              <button onClick={markLive} disabled={goLiveSaving}
                className="text-sm font-bold px-6 py-2.5 rounded-lg"
                style={{ backgroundColor: BRAND.success, color: '#000' }}>
                {goLiveSaving ? 'Saving…' : 'Confirm — Mark Live'}
              </button>
              <button onClick={() => setGoLiveConfirm(false)} className="text-sm" style={{ color: BRAND.muted }}>Cancel</button>
            </div>
          ) : (
            <button onClick={() => setGoLiveConfirm(true)}
              className="text-sm font-bold px-8 py-2.5 rounded-lg transition-opacity hover:opacity-80"
              style={{ backgroundColor: BRAND.success, color: '#000', boxShadow: `0 0 20px ${BRAND.success}40` }}>
              Mark Client as Live →
            </button>
          )}
        </div>
      )}
    </div>
  )
}
