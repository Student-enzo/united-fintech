'use client'

import { useState } from 'react'
import { Check, Copy, Mail, ArrowRight, Clock } from 'lucide-react'
import { BRAND } from '@/lib/brand'
import type { MerchantRecord, PipelineStage } from '@/lib/mock-merchants'
import { STAGE_META } from '@/lib/mock-merchants'

const ACTIVE_STAGES: PipelineStage[] = [
  'lead_identified',
  'proposal_sent',
  'agreement_sent',
  'agreement_signed',
  'setup_fee_paid',
  'underwriting',
  'account_activated',
  'merchant_live',
]

const STAGE_ACTIONS: Partial<Record<PipelineStage, string[]>> = {
  lead_identified:   ['Confirm business type and MCC', 'Collect owner contact info', 'Send proposal'],
  proposal_sent:     ['Follow up within 3 business days', 'Answer rate questions', 'Confirm decision-maker'],
  agreement_sent:    ['Verify email delivery', 'Set follow-up reminder', 'Offer wet signature option'],
  agreement_signed:  ['Collect setup fee', 'Send payment instructions', 'Confirm receipt'],
  setup_fee_paid:    ['Submit underwriting package', 'Collect 3 months statements', 'Verify KYC documents'],
  underwriting:      ['Monitor approval status', 'Respond to UW requests within 24h', 'Prepare boarding documents'],
  account_activated: ['Confirm terminal/gateway setup', 'Test first transaction', 'Brief merchant on processing'],
  merchant_live:     ['Set 30-day check-in reminder', 'Verify first settlement', 'Request referrals'],
}

function DaysInStageBadge({ days }: { days: number }) {
  const color = days < 7 ? BRAND.success : days <= 14 ? BRAND.warn : BRAND.danger
  const bg = days < 7 ? 'rgba(110,231,183,0.08)' : days <= 14 ? 'rgba(252,211,77,0.08)' : 'rgba(232,80,74,0.08)'
  const border = days < 7 ? 'rgba(110,231,183,0.2)' : days <= 14 ? 'rgba(252,211,77,0.2)' : 'rgba(232,80,74,0.2)'
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold"
      style={{ backgroundColor: bg, border: `1px solid ${border}`, color }}>
      <Clock size={10} />
      {days}d in stage
    </span>
  )
}

interface Props {
  merchant: MerchantRecord
  onStageChange: (stage: PipelineStage) => void
  addActivity: (text: string, color: string) => void
}

export default function MDPipeline({ merchant: m, onStageChange, addActivity }: Props) {
  const currentIdx = ACTIVE_STAGES.indexOf(m.pipeline_stage as PipelineStage)
  const actions = STAGE_ACTIONS[m.pipeline_stage] ?? []
  const [checked, setChecked] = useState<Record<string, boolean>>({})
  const [copied, setCopied] = useState(false)

  const applyLink = typeof window !== 'undefined'
    ? `${window.location.origin}/apply/${m.id}`
    : `/apply/${m.id}`

  const nextStage = currentIdx < ACTIVE_STAGES.length - 1
    ? ACTIVE_STAGES[currentIdx + 1]
    : null

  function toggleCheck(key: string) {
    setChecked(prev => ({ ...prev, [key]: !prev[key] }))
  }

  function handleAdvanceStage() {
    if (!nextStage) return
    onStageChange(nextStage)
    addActivity(`Stage advanced to: ${STAGE_META[nextStage].label}`, BRAND.cyan)
  }

  function handleCopyLink() {
    navigator.clipboard.writeText(applyLink).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  function handleSendEmail() {
    if (!m.contact_email) return
    const subject = encodeURIComponent('Your Application Link — United Fintech')
    const body = encodeURIComponent(
      `Hi ${m.owner_name || 'there'},\n\nPlease use the link below to continue your application:\n\n${applyLink}\n\nIf you have any questions, reply to this email.\n\nBest regards,\nUnited Fintech Team`
    )
    window.open(`mailto:${m.contact_email}?subject=${subject}&body=${body}`)
    addActivity('Application link sent via email', BRAND.success)
  }

  const isDeclined = m.pipeline_stage === 'declined'

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

      {/* ── Left: Pipeline tracker + Action checklist ── */}
      <div className="flex flex-col gap-5">

        {/* Pipeline tracker */}
        <div className="rounded-2xl p-5" style={{ backgroundColor: BRAND.card, border: `1px solid ${BRAND.border}` }}>
          <div className="flex items-center justify-between mb-4">
            <p className="text-[10px] uppercase tracking-widest font-semibold" style={{ color: BRAND.muted }}>
              Pipeline Stage
            </p>
            <DaysInStageBadge days={m.days_in_stage} />
          </div>

          {isDeclined ? (
            <div className="px-4 py-3 rounded-xl text-sm font-semibold"
              style={{ backgroundColor: 'rgba(232,80,74,0.08)', border: `1px solid rgba(232,80,74,0.22)`, color: BRAND.danger }}>
              This merchant has been declined.
            </div>
          ) : (
            <div className="flex flex-col gap-1">
              {ACTIVE_STAGES.map((stage, idx) => {
                const meta = STAGE_META[stage]
                const isCompleted = idx < currentIdx
                const isCurrent = idx === currentIdx
                const isFuture = idx > currentIdx

                return (
                  <div key={stage} className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors"
                    style={{
                      backgroundColor: isCurrent ? `${BRAND.cyan}10` : 'transparent',
                      border: isCurrent ? `1px solid ${BRAND.borderCyan}` : '1px solid transparent',
                    }}>

                    {/* Number / check circle */}
                    <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-[11px] font-bold transition-all"
                      style={{
                        backgroundColor: isCompleted
                          ? 'rgba(110,231,183,0.12)'
                          : isCurrent
                            ? `${BRAND.cyan}20`
                            : 'rgba(255,255,255,0.04)',
                        border: isCompleted
                          ? '1px solid rgba(110,231,183,0.3)'
                          : isCurrent
                            ? `1px solid ${BRAND.borderCyan}`
                            : `1px solid ${BRAND.border}`,
                        color: isCompleted ? BRAND.success : isCurrent ? BRAND.cyan : BRAND.muted,
                      }}>
                      {isCompleted
                        ? <Check size={12} strokeWidth={2.5} />
                        : idx + 1
                      }
                    </div>

                    {/* Label */}
                    <span className="flex-1 text-xs font-medium"
                      style={{ color: isCompleted ? BRAND.muted : isCurrent ? BRAND.cyan : BRAND.muted, opacity: isFuture ? 0.45 : 1 }}>
                      {meta.label}
                    </span>

                    {/* CURRENT pill */}
                    {isCurrent && (
                      <span className="text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full"
                        style={{ backgroundColor: `${BRAND.cyan}18`, border: `1px solid ${BRAND.borderCyan}`, color: BRAND.cyan }}>
                        Current
                      </span>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Action checklist */}
        {actions.length > 0 && (
          <div className="rounded-2xl p-5" style={{ backgroundColor: BRAND.card, border: `1px solid ${BRAND.border}` }}>
            <p className="text-[10px] uppercase tracking-widest font-semibold mb-4" style={{ color: BRAND.muted }}>
              Stage Actions
            </p>
            <div className="flex flex-col gap-2">
              {actions.map((action) => {
                const key = `${m.pipeline_stage}__${action}`
                const isChecked = !!checked[key]
                return (
                  <label key={key} className="flex items-start gap-3 cursor-pointer group">
                    <div
                      className="w-4 h-4 rounded flex items-center justify-center flex-shrink-0 mt-0.5 transition-all"
                      style={{
                        backgroundColor: isChecked ? BRAND.cyan : 'transparent',
                        border: `1.5px solid ${isChecked ? BRAND.cyan : BRAND.border}`,
                      }}
                      onClick={() => toggleCheck(key)}>
                      {isChecked && <Check size={10} strokeWidth={3} style={{ color: BRAND.bg }} />}
                    </div>
                    <span className="text-xs leading-relaxed transition-colors"
                      style={{ color: isChecked ? BRAND.muted : BRAND.text, textDecoration: isChecked ? 'line-through' : 'none' }}>
                      {action}
                    </span>
                  </label>
                )
              })}
            </div>

            {/* Advance stage button */}
            {nextStage && !isDeclined && (
              <button
                onClick={handleAdvanceStage}
                className="mt-5 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-opacity hover:opacity-80 active:scale-[0.98]"
                style={{ backgroundColor: `${BRAND.cyan}18`, border: `1px solid ${BRAND.borderCyan}`, color: BRAND.cyan }}>
                Advance to {STAGE_META[nextStage].label}
                <ArrowRight size={14} />
              </button>
            )}

            {m.pipeline_stage === 'merchant_live' && (
              <div className="mt-4 px-3 py-2.5 rounded-xl text-xs font-semibold text-center"
                style={{ backgroundColor: 'rgba(110,231,183,0.08)', border: '1px solid rgba(110,231,183,0.2)', color: BRAND.success }}>
                Merchant is live — pipeline complete
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Right: Send to Client panel ── */}
      <div className="flex flex-col gap-5">

        {/* Apply link generator */}
        <div className="rounded-2xl p-5" style={{ backgroundColor: BRAND.card, border: `1px solid ${BRAND.border}` }}>
          <p className="text-[10px] uppercase tracking-widest font-semibold mb-4" style={{ color: BRAND.muted }}>
            Client Application Link
          </p>

          {/* Link box */}
          <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl mb-3"
            style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: `1px solid ${BRAND.border}` }}>
            <code className="flex-1 text-[11px] truncate" style={{ color: BRAND.cyan, fontFamily: 'monospace' }}>
              {applyLink}
            </code>
            <button
              onClick={handleCopyLink}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold transition-all hover:opacity-80 flex-shrink-0"
              style={{
                backgroundColor: copied ? 'rgba(110,231,183,0.12)' : `${BRAND.cyan}18`,
                border: `1px solid ${copied ? 'rgba(110,231,183,0.3)' : BRAND.borderCyan}`,
                color: copied ? BRAND.success : BRAND.cyan,
              }}>
              {copied ? <Check size={11} /> : <Copy size={11} />}
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>

          {/* Send via email */}
          {m.contact_email ? (
            <button
              onClick={handleSendEmail}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-opacity hover:opacity-80 active:scale-[0.98]"
              style={{ backgroundColor: `${BRAND.cyan}18`, border: `1px solid ${BRAND.borderCyan}`, color: BRAND.cyan }}>
              <Mail size={14} />
              Send via Email to {m.contact_email}
            </button>
          ) : (
            <div className="px-3 py-2.5 rounded-xl text-xs"
              style={{ backgroundColor: 'rgba(252,211,77,0.06)', border: '1px solid rgba(252,211,77,0.18)', color: BRAND.warn }}>
              No email on file — add contact info to send via email.
            </div>
          )}
        </div>

        {/* Stage summary card */}
        <div className="rounded-2xl p-5" style={{ backgroundColor: BRAND.card, border: `1px solid ${BRAND.border}` }}>
          <p className="text-[10px] uppercase tracking-widest font-semibold mb-4" style={{ color: BRAND.muted }}>
            Stage Summary
          </p>

          <div className="flex flex-col gap-3">
            {/* Current stage display */}
            {!isDeclined && currentIdx >= 0 && (
              <div className="flex items-center justify-between py-2.5"
                style={{ borderBottom: `1px solid ${BRAND.border}` }}>
                <span className="text-xs" style={{ color: BRAND.muted }}>Current Stage</span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full"
                  style={{
                    backgroundColor: STAGE_META[m.pipeline_stage].bg,
                    border: `1px solid ${STAGE_META[m.pipeline_stage].border}`,
                    color: STAGE_META[m.pipeline_stage].color,
                  }}>
                  {STAGE_META[m.pipeline_stage].label}
                </span>
              </div>
            )}

            {/* Progress */}
            {!isDeclined && (
              <div className="flex items-center justify-between py-2.5"
                style={{ borderBottom: `1px solid ${BRAND.border}` }}>
                <span className="text-xs" style={{ color: BRAND.muted }}>Progress</span>
                <span className="text-xs font-semibold" style={{ color: BRAND.text }}>
                  {currentIdx + 1} / {ACTIVE_STAGES.length} stages
                </span>
              </div>
            )}

            {/* Progress bar */}
            {!isDeclined && (
              <div>
                <div className="h-1.5 rounded-full" style={{ backgroundColor: 'rgba(255,255,255,0.06)' }}>
                  <div className="h-1.5 rounded-full transition-all"
                    style={{
                      width: `${((currentIdx + 1) / ACTIVE_STAGES.length) * 100}%`,
                      backgroundColor: BRAND.cyan,
                    }} />
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-[9px]" style={{ color: BRAND.muted }}>Lead</span>
                  <span className="text-[9px]" style={{ color: BRAND.muted }}>Live</span>
                </div>
              </div>
            )}

            {/* Checklist completion */}
            {actions.length > 0 && (
              <div className="flex items-center justify-between py-2.5"
                style={{ borderBottom: `1px solid ${BRAND.border}` }}>
                <span className="text-xs" style={{ color: BRAND.muted }}>Actions Complete</span>
                <span className="text-xs font-semibold" style={{ color: BRAND.text }}>
                  {actions.filter(a => !!checked[`${m.pipeline_stage}__${a}`]).length} / {actions.length}
                </span>
              </div>
            )}

            {/* Next stage */}
            {nextStage && !isDeclined && (
              <div className="flex items-center justify-between py-2.5">
                <span className="text-xs" style={{ color: BRAND.muted }}>Next Stage</span>
                <span className="text-xs font-semibold" style={{ color: BRAND.text }}>
                  {STAGE_META[nextStage].label}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
