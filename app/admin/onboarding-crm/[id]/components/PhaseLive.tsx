'use client'

import { ExternalLink } from 'lucide-react'
import { BRAND } from '@/lib/brand'
import type { OnboardingApplication, OnboardingPursuit, OnboardingEmail } from '@/lib/onboarding-types'

interface Props {
  application: OnboardingApplication
  pursuits: OnboardingPursuit[]
  emailDrafts: OnboardingEmail[]
}

function fmt(iso: string | null) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function daysBetween(a: string, b: string) {
  return Math.max(0, Math.ceil((new Date(b).getTime() - new Date(a).getTime()) / 86_400_000))
}

interface TimelineStep {
  label: string
  date: string | null
  done: boolean
}

export default function PhaseLive({ application: app, pursuits, emailDrafts }: Props) {
  const approvedPursuits = pursuits.filter(p => p.current_stage === 'approved')
  const firstPursuit     = pursuits.reduce<OnboardingPursuit | null>((acc, p) => {
    if (!acc) return p
    return new Date(p.started_at) < new Date(acc.started_at) ? p : acc
  }, null)

  const totalDays = app.created_at && app.live_at
    ? daysBetween(app.created_at, app.live_at)
    : null

  const timeline: TimelineStep[] = [
    { label: 'Application Created',  date: app.created_at,            done: true },
    { label: 'Intake Submitted',     date: app.intake_submitted_at,   done: !!app.intake_submitted_at },
    { label: 'Pre-Approved',         date: app.preapproved_at,        done: !!app.preapproved_at },
    { label: 'First Pursuit Started',date: firstPursuit?.started_at ?? null, done: !!firstPursuit },
    { label: 'Client Live',          date: app.live_at,               done: !!app.live_at },
  ]

  const welcomeEmail = emailDrafts.find(e => e.email_type === 'client_live')

  const mailtoLink = welcomeEmail
    ? `mailto:${app.owner_email}?subject=${encodeURIComponent(welcomeEmail.subject)}&body=${encodeURIComponent(welcomeEmail.body)}`
    : `mailto:${app.owner_email}?subject=${encodeURIComponent(`Welcome! You're Now Live — ${app.business_name ?? 'United Fintech'}`)}&body=${encodeURIComponent(`Hi ${app.owner_name ?? 'there'},\n\nCongratulations — your merchant account is now live!\n\nBest regards,\nUnited Fintech`)}`

  return (
    <div className="max-w-2xl space-y-6">

      {/* LIVE badge */}
      <div className="flex items-center gap-4">
        <span className="text-2xl font-black tracking-widest px-6 py-2 rounded-xl"
          style={{ backgroundColor: `${BRAND.success}15`, color: BRAND.success, border: `1px solid ${BRAND.success}40`, boxShadow: `0 0 32px ${BRAND.success}30` }}>
          LIVE
        </span>
        <div>
          <div className="text-sm font-semibold" style={{ color: BRAND.text }}>{app.business_name ?? 'Business'}</div>
          <div className="text-xs" style={{ color: BRAND.muted }}>Live since {fmt(app.live_at)}</div>
        </div>
      </div>

      {/* Approved partners */}
      {approvedPursuits.length > 0 && (
        <div className="rounded-xl p-4 space-y-3" style={{ backgroundColor: BRAND.card, border: `1px solid ${BRAND.border}` }}>
          <h2 className="text-sm font-bold uppercase tracking-widest" style={{ color: BRAND.cyan }}>Approved Partners</h2>
          <div className="space-y-2">
            {approvedPursuits.map(p => (
              <div key={p.id} className="flex items-center justify-between rounded-lg px-4 py-3"
                style={{ backgroundColor: `${BRAND.success}10`, border: `1px solid ${BRAND.success}30` }}>
                <span className="text-sm font-semibold" style={{ color: BRAND.success }}>{p.partner_name}</span>
                {p.ai_match_score !== null && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold"
                    style={{ backgroundColor: `${BRAND.success}15`, color: BRAND.success }}>
                    {p.ai_match_score}% match
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Timeline */}
      <div className="rounded-xl p-4 space-y-3" style={{ backgroundColor: BRAND.card, border: `1px solid ${BRAND.border}` }}>
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase tracking-widest" style={{ color: BRAND.cyan }}>Timeline</h2>
          {totalDays !== null && (
            <span className="text-xs font-bold px-2.5 py-1 rounded-full"
              style={{ backgroundColor: 'rgba(144,196,207,0.1)', color: BRAND.cyan, border: `1px solid ${BRAND.borderCyan}` }}>
              {totalDays} days to go live
            </span>
          )}
        </div>
        <div className="relative pl-5">
          <div className="absolute left-1.5 top-2 bottom-2 w-px" style={{ backgroundColor: BRAND.border }}/>
          {timeline.map((step, i) => (
            <div key={i} className="relative flex items-start gap-3 py-2">
              <div className="absolute -left-3.5 w-3 h-3 rounded-full border-2 flex-shrink-0 mt-0.5"
                style={{
                  backgroundColor: step.done ? BRAND.success : BRAND.card,
                  borderColor: step.done ? BRAND.success : BRAND.border,
                }}/>
              <div className="flex flex-col gap-0.5">
                <span className="text-xs font-semibold" style={{ color: step.done ? BRAND.text : BRAND.muted }}>{step.label}</span>
                <span className="text-[10px]" style={{ color: BRAND.muted }}>{fmt(step.date)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Welcome email */}
      <div className="rounded-xl p-4 space-y-3" style={{ backgroundColor: BRAND.card, border: `1px solid ${BRAND.border}` }}>
        <h2 className="text-sm font-bold uppercase tracking-widest" style={{ color: BRAND.cyan }}>Welcome Email</h2>
        <div className="rounded-lg p-3 space-y-1.5"
          style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: `1px solid ${BRAND.border}` }}>
          <div className="text-xs font-semibold" style={{ color: BRAND.silver }}>
            Subject: {welcomeEmail?.subject ?? `Welcome! You're Now Live — ${app.business_name ?? 'United Fintech'}`}
          </div>
          <p className="text-xs" style={{ color: BRAND.muted }}>
            {welcomeEmail?.body?.slice(0, 120) ?? `Hi ${app.owner_name ?? 'there'}, congratulations — your merchant account is now live!`}
            {(welcomeEmail?.body?.length ?? 0) > 120 ? '…' : ''}
          </p>
          <a href={mailtoLink}
            className="inline-flex items-center gap-1.5 text-xs font-semibold hover:opacity-75 transition-opacity"
            style={{ color: BRAND.cyan }}>
            <ExternalLink size={11}/> Open in Email
          </a>
        </div>
      </div>

      {/* Move to Merchant Partners */}
      <div className="rounded-xl p-4" style={{ backgroundColor: BRAND.card, border: `1px solid ${BRAND.border}` }}>
        <div className="relative group inline-block">
          <button disabled
            className="text-sm font-semibold px-5 py-2.5 rounded-lg cursor-not-allowed"
            style={{ backgroundColor: 'rgba(255,255,255,0.04)', color: BRAND.muted, border: `1px solid ${BRAND.border}` }}>
            Move to Merchant Partners
          </button>
          <div className="absolute bottom-full left-0 mb-1 hidden group-hover:block z-10">
            <div className="text-[11px] font-medium px-3 py-1.5 rounded-lg whitespace-nowrap"
              style={{ backgroundColor: BRAND.card, color: BRAND.muted, border: `1px solid ${BRAND.border}` }}>
              Merchant Partners tab coming soon
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
