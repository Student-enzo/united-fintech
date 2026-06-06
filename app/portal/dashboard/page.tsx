import { createPortalServerClient } from '@/lib/supabase-server'
import { getApplicationForUser } from '@/lib/portal-db'
import { redirect } from 'next/navigation'
import { IntakeFormWrapper } from '@/components/portal/intake-form'
import { ProgressTracker } from '@/components/portal/progress-tracker'

export default async function DashboardPage() {
  const supabase = await createPortalServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/portal/login')

  const app = await getApplicationForUser(user.id)
  if (!app) {
    return (
      <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14, paddingTop: 40 }}>
        No application found. Please contact your United Fintech representative.
      </div>
    )
  }

  const isSubmitted = !!app.intake_submitted_at

  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ color: 'rgba(255,255,255,0.85)', fontSize: 24, fontWeight: 300, letterSpacing: '0.04em', marginBottom: 6 }}>
          {isSubmitted ? 'Application Status' : 'Complete Your Application'}
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14 }}>
          {isSubmitted
            ? 'Your application is being reviewed. Track your progress below.'
            : 'Welcome! Please complete your application to get started.'}
        </p>
      </div>

      {isSubmitted
        ? <ProgressTracker currentPhase={app.current_phase} submittedAt={app.intake_submitted_at} />
        : <IntakeFormWrapper applicationId={app.id} initialData={app} />
      }
    </div>
  )
}
