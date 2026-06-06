import { createPortalServerClient } from '@/lib/supabase-server'
import { getApplicationForUser, getApplicationPursuits } from '@/lib/portal-db'
import { redirect } from 'next/navigation'
import type { PursuitStage } from '@/lib/onboarding-types'

const STAGE_INFO: Record<PursuitStage, { label: string; index: number; color: string }> = {
  not_submitted:          { label: 'Preparing',              index: 0, color: 'rgba(255,255,255,0.4)' },
  submitted:              { label: 'Submitted',              index: 1, color: '#90c4cf' },
  initial_review:         { label: 'In Review',              index: 2, color: '#90c4cf' },
  underwriting:           { label: 'Underwriting',           index: 3, color: '#FCD34D' },
  conditionally_approved: { label: 'Approved w/ Conditions', index: 4, color: '#6EE7B7' },
  approved:               { label: 'Approved',               index: 4, color: '#6EE7B7' },
  declined:               { label: 'Declined',               index: 4, color: '#E8504A' },
}

const TIMELINE_STAGES: PursuitStage[] = ['not_submitted', 'submitted', 'initial_review', 'underwriting', 'approved']
const TIMELINE_LABELS = ['Preparing', 'Submitted', 'In Review', 'Underwriting', 'Decision']

export default async function ProgressPage() {
  const supabase = await createPortalServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/portal/login')

  const app = await getApplicationForUser(user.id)
  if (!app) return <div style={{ color: 'rgba(255,255,255,0.5)', paddingTop: 40 }}>No application found.</div>

  const pursuits = await getApplicationPursuits(app.id)

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ color: 'rgba(255,255,255,0.85)', fontSize: 24, fontWeight: 300, marginBottom: 6 }}>Partner Progress</h1>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14 }}>
          Track your application status with each acquiring partner.
        </p>
      </div>

      {pursuits.length === 0 ? (
        <div style={{ background: '#282626', border: '1px solid rgba(144,196,207,0.12)', borderRadius: 12, padding: 32, textAlign: 'center' }}>
          <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14 }}>
            Partner selection hasn&apos;t started yet. We&apos;ll update you once your application is submitted to partners.
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {pursuits.map(p => {
            const info     = STAGE_INFO[p.current_stage]
            const stageIdx = info.index

            return (
              <div key={p.id} style={{ background: '#282626', border: '1px solid rgba(144,196,207,0.15)', borderRadius: 14, padding: 24 }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 8 }}>
                  <div>
                    <div style={{ color: 'rgba(255,255,255,0.85)', fontSize: 17 }}>{p.partner_name}</div>
                    <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, marginTop: 3 }}>
                      Started {new Date(p.started_at).toLocaleDateString()}
                    </div>
                  </div>
                  <span style={{
                    padding: '5px 14px', borderRadius: 99, fontSize: 13,
                    color: info.color,
                    background: `${info.color}18`,
                    border: `1px solid ${info.color}40`,
                  }}>
                    {info.label}
                  </span>
                </div>

                {/* Stage progress bar */}
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  {TIMELINE_STAGES.map((stage, i) => {
                    const done    = i < stageIdx
                    const current = i === stageIdx
                    const isLast  = i === TIMELINE_STAGES.length - 1

                    return (
                      <div key={stage} style={{ display: 'flex', alignItems: 'center', flex: isLast ? 'none' : 1 }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                          <div style={{
                            width: 24, height: 24, borderRadius: '50%', flexShrink: 0,
                            background: done ? '#90c4cf' : current ? 'rgba(144,196,207,0.2)' : 'rgba(255,255,255,0.07)',
                            border: current ? '2px solid #90c4cf' : done ? 'none' : '1px solid rgba(255,255,255,0.12)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                          }}>
                            {done && (
                              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                                <path d="M2 6L5 9L10 3" stroke="#1c1c1c" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                            )}
                            {current && <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#90c4cf' }} />}
                          </div>
                          <div style={{
                            fontSize: 10, letterSpacing: '0.04em', whiteSpace: 'nowrap',
                            color: done ? '#90c4cf' : current ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.25)',
                          }}>
                            {TIMELINE_LABELS[i]}
                          </div>
                        </div>
                        {!isLast && (
                          <div style={{
                            height: 2, flex: 1,
                            background: done ? 'rgba(144,196,207,0.4)' : 'rgba(255,255,255,0.08)',
                            margin: '0 4px', marginBottom: 20,
                          }} />
                        )}
                      </div>
                    )
                  })}
                </div>

                {/* Conditions */}
                {p.current_stage === 'conditionally_approved' && p.conditions && (
                  <div style={{ marginTop: 16, background: 'rgba(110,231,183,0.07)', border: '1px solid rgba(110,231,183,0.2)', borderRadius: 8, padding: '12px 14px' }}>
                    <div style={{ color: '#6EE7B7', fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 4 }}>Conditions for Approval</div>
                    <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13 }}>{p.conditions}</div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
