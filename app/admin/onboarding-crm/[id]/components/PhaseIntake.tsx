'use client'

import { useState } from 'react'
import { Copy, Check, Mail, RefreshCw, CheckSquare, Square, ExternalLink } from 'lucide-react'
import { BRAND } from '@/lib/brand'
import { supabase } from '@/lib/supabase'
import type { OnboardingApplication } from '@/lib/onboarding-types'

interface Props {
  application: OnboardingApplication
  onUpdate: () => void
}

function CopyBtn({ value }: { value: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <button onClick={() => { navigator.clipboard.writeText(value).catch(() => {}); setCopied(true); setTimeout(() => setCopied(false), 1800) }}
      className="hover:opacity-70 transition-opacity p-1 rounded"
      style={{ color: copied ? BRAND.success : BRAND.muted }}>
      {copied ? <Check size={13}/> : <Copy size={13}/>}
    </button>
  )
}

function fmt(iso: string | null) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function daysUntil(iso: string): number {
  return Math.ceil((new Date(iso).getTime() - Date.now()) / 86_400_000)
}

export default function PhaseIntake({ application: app, onUpdate }: Props) {
  const [matchChecked, setMatchChecked] = useState(app.match_list_checked)
  const [savingMatch, setSavingMatch]   = useState(false)

  const intakeUrl = `${process.env.NEXT_PUBLIC_APP_URL ?? 'https://unitedfintech.com'}/intake/${app.intake_token}`
  const expiryDays = daysUntil(app.intake_token_expires_at)
  const expired    = expiryDays < 0

  const emailSubject = encodeURIComponent(`Your Merchant Application — ${app.business_name ?? 'United Fintech'}`)
  const emailBody    = encodeURIComponent(
    `Hi ${app.owner_name ?? 'there'},\n\nPlease complete your merchant application using the link below:\n\n${intakeUrl}\n\nThis link expires on ${fmt(app.intake_token_expires_at)}.\n\nBest regards,\nUnited Fintech`
  )
  const mailtoLink = `mailto:${app.owner_email}?subject=${emailSubject}&body=${emailBody}`

  async function toggleMatch() {
    setSavingMatch(true)
    const next = !matchChecked
    await supabase.from('onboarding_applications').update({ match_list_checked: next }).eq('id', app.id)
    setMatchChecked(next)
    setSavingMatch(false)
    onUpdate()
  }

  const submitted = app.link_status === 'submitted'

  return (
    <div className="max-w-3xl space-y-5">

      {/* Status timeline card */}
      <div className="rounded-xl p-5 space-y-4" style={{ backgroundColor: BRAND.card, border: `1px solid ${BRAND.border}` }}>
        <h2 className="text-sm font-bold uppercase tracking-widest" style={{ color: BRAND.cyan }}>Link Status</h2>
        <div className="flex flex-wrap gap-6">
          {[
            { label: 'Link Sent',  value: fmt(app.created_at),            done: true },
            { label: 'Opened',     value: app.link_status !== 'sent' ? 'Yes' : '—', done: app.link_status !== 'sent' },
            { label: 'Submitted',  value: fmt(app.intake_submitted_at),   done: submitted },
          ].map(s => (
            <div key={s.label} className="flex flex-col gap-0.5">
              <span className="text-[10px] uppercase tracking-wider" style={{ color: BRAND.muted }}>{s.label}</span>
              <span className="text-sm font-semibold" style={{ color: s.done ? BRAND.text : BRAND.muted }}>{s.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Submitted banner */}
      {submitted && (
        <div className="flex items-center gap-3 rounded-xl px-5 py-3"
          style={{ backgroundColor: `${BRAND.success}15`, border: `1px solid ${BRAND.success}40` }}>
          <Check size={16} color={BRAND.success}/>
          <span className="text-sm font-semibold" style={{ color: BRAND.success }}>
            Intake Received — submitted {fmt(app.intake_submitted_at)}
          </span>
        </div>
      )}

      {/* Intake link */}
      <div className="rounded-xl p-5 space-y-3" style={{ backgroundColor: BRAND.card, border: `1px solid ${BRAND.border}` }}>
        <h2 className="text-sm font-bold uppercase tracking-widest" style={{ color: BRAND.cyan }}>Intake Link</h2>
        <div className="flex items-center gap-2 rounded-lg px-3 py-2" style={{ backgroundColor: 'rgba(255,255,255,0.04)', border: `1px solid ${BRAND.border}` }}>
          <span className="text-xs truncate flex-1" style={{ color: BRAND.silverLo }}>{intakeUrl}</span>
          <CopyBtn value={intakeUrl}/>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-xs font-medium px-2.5 py-1 rounded-full"
            style={expired
              ? { backgroundColor: `${BRAND.danger}20`, color: BRAND.danger, border: `1px solid ${BRAND.danger}40` }
              : { backgroundColor: `${BRAND.warn}15`, color: BRAND.warn, border: `1px solid ${BRAND.warn}30` }
            }>
            {expired ? 'EXPIRED' : `Expires in ${expiryDays} day${expiryDays === 1 ? '' : 's'}`}
          </span>
          <a href={mailtoLink}
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-opacity hover:opacity-75"
            style={{ backgroundColor: 'rgba(144,196,207,0.1)', color: BRAND.cyan, border: `1px solid ${BRAND.borderCyan}` }}>
            <RefreshCw size={12}/> Resend Link Email
          </a>
        </div>
      </div>

      {/* Submitted data summary */}
      {submitted && (
        <div className="rounded-xl p-5 space-y-3" style={{ backgroundColor: BRAND.card, border: `1px solid ${BRAND.border}` }}>
          <h2 className="text-sm font-bold uppercase tracking-widest" style={{ color: BRAND.cyan }}>Client-Submitted Info</h2>
          <div className="grid grid-cols-2 gap-x-8 gap-y-2">
            {[
              ['Business Name',   app.business_name],
              ['Entity Type',     app.business_type],
              ['EIN',             app.ein ? `••-•••${app.ein.slice(-4)}` : null],
              ['Monthly Volume',  app.monthly_volume ? `$${Number(app.monthly_volume).toLocaleString()}` : null],
              ['Website',         app.website],
              ['Owner Name',      app.owner_name],
              ['Owner Email',     app.owner_email],
              ['Chargeback Hist.',app.chargeback_history || null],
              ['MCC',             app.mcc],
              ['Avg Ticket',      app.avg_ticket ? `$${app.avg_ticket}` : null],
            ].map(([label, val]) => (
              <div key={label as string} className="flex flex-col gap-0.5">
                <span className="text-[10px] uppercase tracking-wider" style={{ color: BRAND.muted }}>{label}</span>
                <span className="text-xs" style={{ color: val ? BRAND.text : BRAND.muted }}>{val ?? '—'}</span>
              </div>
            ))}
          </div>

          {app.co_owners && app.co_owners.length > 0 && (
            <div className="pt-2 border-t" style={{ borderColor: BRAND.border }}>
              <span className="text-[10px] uppercase tracking-wider block mb-2" style={{ color: BRAND.muted }}>Co-Owners</span>
              {app.co_owners.map((co, i) => (
                <div key={i} className="text-xs" style={{ color: BRAND.silverLo }}>
                  {co.name} — {co.ownership_percent}%
                  {co.email && ` — ${co.email}`}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* MATCH list + email draft */}
      <div className="rounded-xl p-5 space-y-4" style={{ backgroundColor: BRAND.card, border: `1px solid ${BRAND.border}` }}>
        <h2 className="text-sm font-bold uppercase tracking-widest" style={{ color: BRAND.cyan }}>Compliance</h2>
        <button onClick={toggleMatch} disabled={savingMatch}
          className="flex items-center gap-2 text-sm font-medium hover:opacity-80 transition-opacity"
          style={{ color: matchChecked ? BRAND.success : BRAND.muted }}>
          {matchChecked ? <CheckSquare size={16}/> : <Square size={16}/>}
          MATCH List Checked
        </button>
      </div>

      {/* Email draft */}
      <div className="rounded-xl p-5 space-y-3" style={{ backgroundColor: BRAND.card, border: `1px solid ${BRAND.border}` }}>
        <h2 className="text-sm font-bold uppercase tracking-widest" style={{ color: BRAND.cyan }}>Email Draft</h2>
        <div className="rounded-lg p-3 space-y-1.5" style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: `1px solid ${BRAND.border}` }}>
          <div className="text-[10px] uppercase tracking-wider" style={{ color: BRAND.muted }}>Intake Link Email</div>
          <div className="text-xs font-semibold" style={{ color: BRAND.silver }}>
            Subject: Your Merchant Application — {app.business_name ?? 'United Fintech'}
          </div>
          <p className="text-xs whitespace-pre-wrap" style={{ color: BRAND.muted }}>
            {`Hi ${app.owner_name ?? 'there'},\n\nPlease complete your merchant application:\n${intakeUrl}`}
          </p>
          <a href={mailtoLink}
            className="inline-flex items-center gap-1.5 text-xs font-semibold mt-1 hover:opacity-75 transition-opacity"
            style={{ color: BRAND.cyan }}>
            <ExternalLink size={11}/> Open in Email
          </a>
        </div>
      </div>
    </div>
  )
}
