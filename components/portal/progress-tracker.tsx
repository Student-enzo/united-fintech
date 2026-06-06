import type { Phase } from '@/lib/onboarding-types'

const PHASES: Array<{ key: Phase; label: string; description: string }> = [
  { key: 'intake_sent',       label: 'Intake Received',        description: 'Your application has been received.' },
  { key: 'document_review',   label: 'Documents Under Review', description: 'Our team is reviewing your documents.' },
  { key: 'partner_selection', label: 'Partner Selection',       description: 'Identifying the best acquiring banks for your business.' },
  { key: 'pursuit',           label: 'Pursuit & Underwriting', description: 'Your application is being submitted to partners.' },
  { key: 'live',              label: 'Live',                   description: 'Your merchant account is active.' },
]

function phaseIndex(phase: Phase): number {
  const idx = PHASES.findIndex(p => p.key === phase)
  return idx === -1 ? 0 : idx
}

export function ProgressTracker({ currentPhase, submittedAt }: {
  currentPhase: Phase
  submittedAt: string | null
}) {
  const current = phaseIndex(currentPhase)

  return (
    <div>
      <div style={{
        background: 'rgba(144,196,207,0.08)', border: '1px solid rgba(144,196,207,0.2)',
        borderRadius: 12, padding: '16px 20px', marginBottom: 28,
        display: 'flex', alignItems: 'center', gap: 12,
      }}>
        <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#90c4cf', boxShadow: '0 0 8px rgba(144,196,207,0.6)', flexShrink: 0 }} />
        <div>
          <div style={{ color: '#90c4cf', fontSize: 14 }}>
            {PHASES[current]?.label ?? 'In Progress'}
          </div>
          <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, marginTop: 2 }}>
            {PHASES[current]?.description}
            {submittedAt && (
              <span style={{ marginLeft: 8 }}>
                Submitted {new Date(submittedAt).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
        {PHASES.map((phase, i) => {
          const done    = i < current
          const active  = i === current
          const isLast  = i === PHASES.length - 1

          return (
            <div key={phase.key} style={{ display: 'flex', gap: 16, paddingBottom: 8 }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 32, flexShrink: 0 }}>
                <div style={{
                  width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                  background: done ? '#90c4cf' : active ? 'rgba(144,196,207,0.2)' : 'rgba(255,255,255,0.07)',
                  border: active ? '2px solid #90c4cf' : done ? 'none' : '2px solid rgba(255,255,255,0.1)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: active ? '0 0 16px rgba(144,196,207,0.4)' : 'none',
                }}>
                  {done && (
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M2.5 7L5.5 10L11.5 4" stroke="#1c1c1c" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                  {active && <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#90c4cf' }} />}
                </div>
                {!isLast && (
                  <div style={{ width: 2, flex: 1, minHeight: 24, background: done ? 'rgba(144,196,207,0.4)' : 'rgba(255,255,255,0.08)', marginTop: 2 }} />
                )}
              </div>

              <div style={{ paddingBottom: 20, paddingTop: 2 }}>
                <div style={{
                  color: done ? '#C9D1D9' : active ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.35)',
                  fontSize: 15, fontWeight: active ? 500 : 400,
                }}>
                  {phase.label}
                </div>
                {(done || active) && (
                  <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, marginTop: 3 }}>
                    {phase.description}
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
