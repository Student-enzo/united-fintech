import { createPortalServerClient } from '@/lib/supabase-server'
import { getApplicationForUser, getClientVisibleNotes, getClientEmails } from '@/lib/portal-db'
import { redirect } from 'next/navigation'
import type { OnboardingNote, OnboardingEmail } from '@/lib/onboarding-types'

type FeedItem =
  | { kind: 'note';  data: OnboardingNote;  date: string }
  | { kind: 'email'; data: OnboardingEmail; date: string }

export default async function MessagesPage() {
  const supabase = await createPortalServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/portal/login')

  const app = await getApplicationForUser(user.id)
  if (!app) return <div style={{ color: 'rgba(255,255,255,0.5)', paddingTop: 40 }}>No application found.</div>

  const [notes, emails] = await Promise.all([
    getClientVisibleNotes(app.id),
    getClientEmails(app.id),
  ])

  const feed: FeedItem[] = [
    ...notes.map(n  => ({ kind: 'note'  as const, data: n, date: n.created_at })),
    ...emails.map(e => ({ kind: 'email' as const, data: e, date: e.created_at })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ color: 'rgba(255,255,255,0.85)', fontSize: 24, fontWeight: 300, marginBottom: 6 }}>Messages</h1>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14 }}>
          Updates and communications from your United Fintech team.
        </p>
      </div>

      {feed.length === 0 ? (
        <div style={{ background: '#282626', border: '1px solid rgba(144,196,207,0.12)', borderRadius: 12, padding: 32, textAlign: 'center' }}>
          <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14 }}>
            No messages yet. Your representative will send updates here as your application progresses.
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {feed.map(item => (
            <div key={item.data.id} style={{
              background: '#282626', border: '1px solid rgba(144,196,207,0.12)',
              borderRadius: 12, padding: 20,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10, flexWrap: 'wrap', gap: 8 }}>
                <span style={{
                  padding: '3px 10px', borderRadius: 99, fontSize: 11, letterSpacing: '0.06em', textTransform: 'uppercase',
                  background: item.kind === 'email' ? 'rgba(144,196,207,0.1)' : 'rgba(255,255,255,0.07)',
                  color: item.kind === 'email' ? '#90c4cf' : 'rgba(255,255,255,0.5)',
                  border: item.kind === 'email' ? '1px solid rgba(144,196,207,0.2)' : '1px solid rgba(255,255,255,0.1)',
                }}>
                  {item.kind === 'email' ? 'Email' : 'Update'}
                </span>
                <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: 12 }}>
                  {new Date(item.date).toLocaleString()}
                </span>
              </div>

              {item.kind === 'email' ? (
                <div>
                  <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: 15, marginBottom: 6 }}>
                    {(item.data as OnboardingEmail).subject}
                  </div>
                  <div style={{ color: 'rgba(255,255,255,0.55)', fontSize: 14, lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                    {(item.data as OnboardingEmail).body}
                  </div>
                </div>
              ) : (
                <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 14, lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>
                  {(item.data as OnboardingNote).content}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
